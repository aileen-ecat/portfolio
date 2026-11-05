import { useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useReducedMotion } from '../../hooks';
import { cx } from '../ui/primitives';

/**
 * Hero artwork: one cloud of particles that keeps reshaping itself into
 * analytics visuals from Aileen's work, drawn with nothing but dots. No
 * numbers or text. Every shape fills about the same space as the free cloud
 * and stays alive while it holds: particles keep streaming through it and
 * colours keep shifting, the way live data does.
 *
 *   free particles → live bar chart (sales dashboards: bars refresh, data streams up, a highlight glides across)
 *   → free → trend line with area (data flows left to right, a highlight reads along it)
 *   → free → channel-mix pie (Shopee, Lazada, TikTok, Meta, Google: slices turn and re-balance)
 *   → free → conversion funnel (stacked tiers, visitors sink through, teal to rose to gold)
 *   → free → KPI gauge (a needle swings to a new reading and settles)
 *   → and round again.
 *
 * Transparent canvas: no box, no faded edges, no lines or outlines.
 * When the visitor prefers reduced motion, a still bar chart is shown.
 */

const W = 600;
const H = 520;
const N = 1100;
/** Shapes fill the same area as the free cloud: x 30–570, y about 36–494. */
const LEFT = 30;
const SPAN = 540;
const BASE = 494;

type ShapeId = 'swarm' | 'bars' | 'line' | 'pie' | 'funnel' | 'gauge';

const FREE = 6000;
const HOLD = 15000;
/** The loop: which shape, and for how long (ms). Forming is part of each shape's time. */
const TIMELINE: { shape: ShapeId; ms: number }[] = [
  { shape: 'swarm', ms: FREE },
  { shape: 'bars', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'line', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'pie', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'funnel', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'gauge', ms: HOLD },
];
const LOOP = TIMELINE.reduce((a, b) => a + b.ms, 0);
/** Particles set off one after another, left to right, over this long, so shapes form like a wave. */
const STAGGER = 700;
/** How long after setting off a particle starts riding its shape's live motion closely. */
const SETTLE = 1600;

// Palette index: 0 berry, 1 marigold, 2 teal, 3 deep berry, 4 mauve
const C_ROSE = 0, C_GOLD = 1, C_TEAL = 2, C_INK = 3, C_MAUVE = 4;

// Seeded random so the artwork is the same on every visit.
let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const gauss = () => {
  let u = 0;
  for (let i = 0; i < 6; i++) u += rnd();
  return u / 6 - 0.5;
};
const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
/** 0 at both ends of a 0..1 cycle, 1 in between: hides particles as they wrap round. */
const edge = (v: number, e: number) => clamp(Math.min(v / e, (1 - v) / e), 0, 1);

/* ───────── Shapes: N particles each, with their own parameters; sorted left to right so particles travel smoothly ───────── */

const byX = <T extends { x: number }>(a: T, b: T) => a.x - b.x;

/** Splits N particles across parts in proportion to their weights. */
function share(weights: number[], n = N) {
  const total = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.floor((n * w) / total));
  counts[counts.length - 1] += n - counts.reduce((a, b) => a + b, 0);
  return counts;
}
const spread = <T,>(counts: number[], make: (part: number) => T) => counts.flatMap((count, part) => Array.from({ length: count }, () => make(part)));

// 1. Live bar chart
const BARS = [0.34, 0.46, 0.4, 0.58, 0.52, 0.7, 0.64, 0.82, 0.96];
const BAR_SLOT = SPAN / BARS.length;
const BAR_W = BAR_SLOT * 0.7;
const BAR_PTS = spread(share(BARS), (bar) => ({ bar, x: LEFT + bar * BAR_SLOT + (BAR_SLOT - BAR_W) / 2 + rnd() * BAR_W, v: rnd(), sp: 0.7 + rnd() * 0.6 })).sort(byX);
const barColor = (bar: number) => (bar === BARS.length - 1 ? C_GOLD : bar % 2 ? C_MAUVE : C_ROSE);

// 2. Trend line with area: x holds each particle's starting place along the line (0..1)
const lineY = (u: number) => BASE - 24 - 390 * Math.pow(u, 1.3) - 40 * Math.sin(u * Math.PI * 3) * (1 - u * 0.6);
const LINE_PTS = Array.from({ length: N }, (_, i) => ({ x: i / (N - 1), area: i % 5 >= 3, f: Math.pow(rnd(), 1.6), j: gauss(), ph: rnd() * TAU }));

// 3. Channel-mix pie
const PIE = { x: 300, y: 262, r: 232 };
const SLICES = [
  { share: 0.3, c: C_ROSE },
  { share: 0.24, c: C_GOLD },
  { share: 0.2, c: C_TEAL },
  { share: 0.15, c: C_MAUVE },
  { share: 0.11, c: C_INK },
];
const PIE_PTS = spread(share(SLICES.map((s) => s.share)), (s) => ({ s, q: rnd(), r: Math.sqrt(rnd()) * PIE.r, sp: 0.6 + rnd() * 0.8 }));

// 4. Conversion funnel: stacked tiers, each narrower than the one above
const TIERS = [
  { top: 540, bot: 460 },
  { top: 440, bot: 360 },
  { top: 340, bot: 262 },
  { top: 242, bot: 172 },
  { top: 152, bot: 100 },
];
/** Tier colours top to bottom, teal → rose → gold: [from, to, mix]. */
const TIER_COLS = [
  [C_TEAL, C_TEAL, 0],
  [C_ROSE, C_ROSE, 0],
  [C_ROSE, C_GOLD, 0.3],
  [C_ROSE, C_GOLD, 0.65],
  [C_GOLD, C_GOLD, 0],
];
const TIER_TOP = 36;
const TIER_GAP = 14;
const TIER_H = (BASE - TIER_TOP - TIER_GAP * (TIERS.length - 1)) / TIERS.length;
const FUNNEL_PTS = spread(share(TIERS.map((t) => t.top + t.bot)), (tier) => {
  const s = rnd() - 0.5;
  return { tier, s, x: W / 2 + s * TIERS[tier].top, f: rnd(), sp: 0.8 + rnd() * 0.4 };
}).sort(byX);

// 5. KPI gauge: a thick 240° arc in three zones, with a needle
const GAUGE = { x: 300, y: 318, r0: 186, r1: 268, start: (Math.PI * 5) / 6, sweep: (Math.PI * 4) / 3, needle: 172, hub: 22 };
const ZONES = [
  { to: 0.45, c: C_TEAL },
  { to: 0.75, c: C_ROSE },
  { to: 1, c: C_GOLD },
];
const GAUGE_PTS = Array.from({ length: N }, (_, i) => {
  const part = i % 100 < 78 ? 'arc' : i % 100 < 93 ? 'needle' : 'hub';
  return { part, q: rnd(), r: rnd(), f: rnd(), j: gauss(), ph: rnd() * TAU, x: rnd() };
});
/** Where the needle points next: a steady pseudo-random reading per step. */
const reading = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return 0.12 + 0.8 * (v - Math.floor(v));
};

const HOMES = Array.from({ length: N }, () => ({ x: 30 + rnd() * 540, y: 30 + rnd() * 460, ph: rnd() * TAU, sp: 0.6 + rnd() * 0.8 }));
const SIZES = Array.from({ length: N }, () => 1.2 + rnd() * 1.5);
const STIFF = Array.from({ length: N }, () => 0.035 + rnd() * 0.04);
const DELAY = Array.from({ length: N }, (_, i) => (i / N) * STAGGER * 0.8 + rnd() * STAGGER * 0.2);

/** Where the loop is: the current shape, the one before it, and time spent in the current one. Reused to avoid allocating. */
const PH = { shape: 'swarm' as ShapeId, prev: 'swarm' as ShapeId, elapsed: 0 };
function phaseAt(ms: number) {
  let t = ms % LOOP;
  for (let i = 0; i < TIMELINE.length; i++) {
    if (t < TIMELINE[i].ms) {
      PH.shape = TIMELINE[i].shape;
      PH.prev = TIMELINE[(i + TIMELINE.length - 1) % TIMELINE.length].shape;
      PH.elapsed = t;
      return PH;
    }
    t -= TIMELINE[i].ms;
  }
  return PH;
}

function toRgb(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = '#000';
  ctx.fillStyle = color;
  const hex = ctx.fillStyle as string;
  if (hex.startsWith('#')) return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const m = hex.match(/\d+/g);
  return m ? m.slice(0, 3).map(Number) : [200, 120, 150];
}

export function ParticleMorph({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useUI();
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    const PAL = [v('--rose'), v('--gold'), v('--lavender'), v('--rose-ink'), v('--mauve')].map((c) => toRgb(ctx, c));
    const GOLD = PAL[C_GOLD];

    // Particle state
    const P = HOMES.map((h) => ({ x: h.x, y: h.y, r: PAL[C_MAUVE][0], g: PAL[C_MAUVE][1], b: PAL[C_MAUVE][2], a: 0, s: 1, glow: 0 }));

    let scale = 1;
    let dpr = 1;
    const resize = () => {
      const w = canvas.clientWidth;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      scale = w / W;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(w * (H / W) * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* The current particle's target, written in place to avoid allocating every frame. s is a size multiplier. */
    const T = { x: 0, y: 0, r: 0, g: 0, b: 0, a: 1, s: 1, glow: 0, flow: false };
    const paint = (ci: number, a = 1) => {
      const c = PAL[ci];
      T.r = c[0];
      T.g = c[1];
      T.b = c[2];
      T.a = a * (ci === C_MAUVE ? 0.75 : 0.92);
    };
    const blend = (c1: number, c2: number, f: number, a = 1) => {
      const A = PAL[c1];
      const B = PAL[c2];
      T.r = A[0] + (B[0] - A[0]) * f;
      T.g = A[1] + (B[1] - A[1]) * f;
      T.b = A[2] + (B[2] - A[2]) * f;
      T.a = a * 0.92;
    };

    // Per-frame values shared by many particles
    const pieStart = new Float64Array(SLICES.length);
    const pieSpan = new Float64Array(SLICES.length);
    let litBar = -9;
    let litTier = -9;
    let needle = 0.5;
    let frames = 1;

    const prepare = (shape: ShapeId, now: number) => {
      // highlights glide from bar to bar and tier to tier
      if (shape === 'bars') litBar = ((now / 700) % (BARS.length + 3)) - 1.5;
      if (shape === 'funnel') litTier = ((now / 900) % (TIERS.length + 3)) - 1.5;
      if (shape === 'pie') {
        // Slices slowly re-balance: each share swells and shrinks, and the whole pie turns.
        let total = 0;
        for (let s = 0; s < SLICES.length; s++) total += pieSpan[s] = SLICES[s].share * (1 + 0.22 * Math.sin(now * 0.0008 + s * 1.9) + 0.12 * Math.sin(now * 0.00031 + s * 4.1));
        let a = -Math.PI / 2 + now * 0.0001;
        for (let s = 0; s < SLICES.length; s++) {
          pieSpan[s] = (pieSpan[s] / total) * TAU;
          pieStart[s] = a;
          a += pieSpan[s];
        }
      }
      if (shape === 'gauge') {
        // Every 2.6 s the needle swings to a new reading, overshoots a little and settles.
        const step = Math.floor(now / 2600);
        const t = (now % 2600) / 1000;
        const from = reading(step - 1);
        const to = reading(step);
        needle = clamp(to + (from - to) * Math.exp(-3.5 * t) * Math.cos(6 * t), 0, 1);
      }
    };

    const target = (shape: ShapeId, i: number, now: number) => {
      T.glow = 0;
      T.s = 1;
      T.flow = true;
      switch (shape) {
        case 'bars': {
          const p = BAR_PTS[i];
          const hh = BARS[p.bar] * 430 * (1 + 0.05 * Math.sin(now * 0.0015 + p.bar * 0.9) + 0.04 * Math.sin(now * 0.00053 + p.bar * 2.3));
          const u = (p.v + now * 0.00006 * p.sp) % 1;
          T.x = p.x;
          T.y = BASE - u * hh;
          paint(barColor(p.bar), Math.min(1, (1 - u) / 0.06, u / 0.03));
          T.glow = 0.55 * Math.max(0, 1 - Math.abs(p.bar - litBar));
          return;
        }
        case 'line': {
          const p = LINE_PTS[i];
          const u = (p.x + now * 0.00006) % 1;
          const ly = lineY(u);
          T.x = LEFT + u * SPAN + (p.area ? p.j * 8 : 0);
          if (p.area) {
            T.y = ly + 10 + p.f * (BASE - ly - 10);
            paint(C_MAUVE, edge(u, 0.04) * (0.6 + 0.4 * Math.sin(now * 0.003 + p.ph)));
          } else {
            T.y = ly + p.j * 16;
            T.s = 1.15;
            paint(C_ROSE, edge(u, 0.04));
          }
          return;
        }
        case 'pie': {
          const p = PIE_PTS[i];
          const q = (p.q + now * 0.00006 * p.sp) % 1;
          const a = pieStart[p.s] + 0.03 + q * Math.max(0, pieSpan[p.s] - 0.06);
          T.x = PIE.x + Math.cos(a) * p.r;
          T.y = PIE.y + Math.sin(a) * p.r;
          paint(SLICES[p.s].c, edge(q, 0.08));
          return;
        }
        case 'funnel': {
          // Visitors sink slowly through each tier; tiers run teal → rose → gold, top to bottom.
          const p = FUNNEL_PTS[i];
          const t = TIERS[p.tier];
          const f = (p.f + now * 0.00006 * p.sp) % 1;
          T.x = W / 2 + p.s * (t.top + (t.bot - t.top) * f);
          T.y = TIER_TOP + p.tier * (TIER_H + TIER_GAP) + f * TIER_H;
          T.s = 1.3;
          const [c1, c2, mix] = TIER_COLS[p.tier];
          blend(c1, c2, mix, edge(f, 0.05));
          T.glow = 0.4 * Math.max(0, 1 - Math.abs(p.tier - litTier));
          return;
        }
        case 'gauge': {
          const p = GAUGE_PTS[i];
          if (p.part === 'arc') {
            const a = GAUGE.start + p.q * GAUGE.sweep;
            const r = GAUGE.r0 + p.r * (GAUGE.r1 - GAUGE.r0);
            T.x = GAUGE.x + Math.cos(a) * r;
            T.y = GAUGE.y + Math.sin(a) * r;
            T.s = 1.3;
            T.flow = false;
            const zone = p.q < ZONES[0].to ? 0 : p.q < ZONES[1].to ? 1 : 2;
            // thin gaps between zones keep the three bands readable
            const gap = Math.min(Math.abs(p.q - ZONES[0].to), Math.abs(p.q - ZONES[1].to)) < 0.012 ? 0.12 : 1;
            paint(ZONES[zone].c, gap * (0.8 + 0.2 * Math.sin(now * 0.003 + p.ph)));
            // the part of the arc the needle points at lights up
            T.glow = 0.7 * Math.max(0, 1 - Math.abs(p.q - needle) / 0.05);
          } else {
            const a = GAUGE.start + needle * GAUGE.sweep;
            if (p.part === 'needle') {
              // energy runs out along the needle, from the hub to the tip
              const f = (p.f + now * 0.0003) % 1;
              const r = 6 + f * GAUGE.needle;
              const w = (1 - f) * 7 * p.j * 2;
              T.x = GAUGE.x + Math.cos(a) * r - Math.sin(a) * w;
              T.y = GAUGE.y + Math.sin(a) * r + Math.cos(a) * w;
              T.s = 1.2;
              paint(C_GOLD, Math.min(1, f / 0.05, (1 - f) / 0.1));
            } else {
              const ang = p.q * TAU;
              const r = Math.sqrt(p.r) * GAUGE.hub;
              T.x = GAUGE.x + Math.cos(ang) * r;
              T.y = GAUGE.y + Math.sin(ang) * r;
              T.s = 1.2;
              T.flow = false;
              paint(C_GOLD);
            }
          }
          return;
        }
        default: {
          const h = HOMES[i];
          // a gentle flow field: neighbours drift together rather than each wandering alone
          T.x = h.x + Math.sin(now * 0.0005 * h.sp + h.ph) * 26 + Math.sin(h.y * 0.011 + now * 0.00035) * 22;
          T.y = h.y + Math.cos(now * 0.0004 * h.sp + h.ph * 1.3) * 22 + Math.cos(h.x * 0.011 - now * 0.0003) * 22;
          T.flow = false;
          paint(i % 7 === 0 ? C_GOLD : i % 5 === 0 ? C_ROSE : C_MAUVE);
        }
      }
    };

    let last = 0;
    const render = (now: number, still = false) => {
      const ph = still ? Object.assign(PH, { shape: 'bars', prev: 'bars', elapsed: HOLD / 2 }) : phaseAt(now);
      // Easing is tuned for 60fps; scale it by elapsed time (capped, so a tab switch can't cause a jump).
      frames = last ? Math.min(3, (now - last) / (1000 / 60)) : 1;
      last = now;
      const ease = (k: number) => (still ? 1 : 1 - Math.pow(1 - k, frames));
      prepare(ph.shape, now);
      if (ph.elapsed < STAGGER) prepare(ph.prev, now);

      // On the line chart a highlight travels left to right, again and again, as if reading the data.
      const sweepX = ph.shape === 'line' && ph.elapsed > 1500 ? LEFT - 30 + (((ph.elapsed - 1500) / 3200) % 1) * (SPAN + 60) : -999;

      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        // Each particle sets off a little after its left-hand neighbours, so shapes form and dissolve like a wave.
        const since = ph.elapsed - DELAY[i];
        target(since < 0 ? ph.prev : ph.shape, i, now);
        const p = P[i];
        // Once settled, particles ride the shape's live motion more and more closely.
        const settle = still || !T.flow ? 0 : clamp((since - SETTLE) / 1500, 0, 1);
        const k = ease(STIFF[i] + settle * 0.14);
        const ck = ease(0.06);
        let ak = ease(0.12 + settle * 0.3);
        if (settle > 0 && T.a < 0.08) {
          // A particle wrapping round its stream is invisible at that moment, so it may hop back to the start.
          const dx = T.x - p.x;
          const dy = T.y - p.y;
          if (dx * dx + dy * dy > 1600) {
            p.x = T.x;
            p.y = T.y;
            p.r = T.r;
            p.g = T.g;
            p.b = T.b;
            ak = 1;
          }
        }
        p.x += (T.x - p.x) * k;
        p.y += (T.y - p.y) * k;
        p.r += (T.r - p.r) * ck;
        p.g += (T.g - p.g) * ck;
        p.b += (T.b - p.b) * ck;
        p.a += (T.a - p.a) * ak;
        p.s += (T.s - p.s) * ease(0.1);
        const lit = Math.max(T.glow, 1 - Math.abs(p.x - sweepX) / 30);
        p.glow += (lit - p.glow) * ease(lit > p.glow ? 0.2 : 0.05);
        if (p.a < 0.02) continue;
        const gl = p.glow;
        const r = p.r + (GOLD[0] - p.r) * gl;
        const g = p.g + (GOLD[1] - p.g) * gl;
        const b = p.b + (GOLD[2] - p.b) * gl;
        ctx.fillStyle = `rgb(${r | 0} ${g | 0} ${b | 0})`;
        ctx.globalAlpha = Math.min(1, p.a);
        ctx.beginPath();
        ctx.arc(p.x, p.y, SIZES[i] * p.s * (1 + gl * 0.6), 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      render(0, true);
      const onResize = () => render(0, true);
      window.addEventListener('resize', onResize);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', onResize);
      };
    }

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const loop = (now: number) => {
      if (visible && !document.hidden) render(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={cx('block aspect-[600/520] w-full', className)}
      role="img"
      aria-label="Animated illustration: a cloud of particles keeps reshaping into live analytics visuals: a refreshing bar chart, a flowing trend line, a turning channel-mix pie, a conversion funnel and a KPI gauge whose needle swings and settles."
    />
  );
}
