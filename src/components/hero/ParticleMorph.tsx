import { useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useReducedMotion } from '../../hooks';
import { cx } from '../ui/primitives';

/**
 * Hero artwork: one cloud of particles that keeps reshaping itself into
 * familiar analytics visuals, drawn with nothing but dots.
 *
 *   free particles → bar chart
 *   → free → line chart (a highlight sweeps along it, reading the data)
 *   → free → pie chart
 *   → free → "+24%" KPI
 *   → free → conversion funnel
 *   → and round again.
 *
 * Transparent canvas: no box, no faded edges, no lines or outlines.
 * When the visitor prefers reduced motion, a still bar chart is shown.
 */

const W = 600;
const H = 520;
const N = 1100;
const BASE = 440;

type Pt = { x: number; y: number; c: number };
type ShapeId = 'swarm' | 'bars' | 'line' | 'pie' | 'kpi' | 'funnel';

const FREE = 1600;
const HOLD = 3800;
/** The loop: which shape, and for how long (ms). */
const TIMELINE: { shape: ShapeId; ms: number }[] = [
  { shape: 'swarm', ms: 2000 },
  { shape: 'bars', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'line', ms: HOLD + 800 },
  { shape: 'swarm', ms: FREE },
  { shape: 'pie', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'kpi', ms: HOLD },
  { shape: 'swarm', ms: FREE },
  { shape: 'funnel', ms: HOLD },
];
const LOOP = TIMELINE.reduce((a, b) => a + b.ms, 0);

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

/* ───────── Shapes: N target points each, sorted left to right so particles travel smoothly ───────── */

const byX = (a: Pt, b: Pt) => a.x - b.x;

/** Splits N particles across parts in proportion to their weights. */
function share(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.floor((N * w) / total));
  counts[counts.length - 1] += N - counts.reduce((a, b) => a + b, 0);
  return counts;
}

const BARS = [0.34, 0.46, 0.4, 0.58, 0.52, 0.7, 0.64, 0.82, 0.96];
function barsShape(): Pt[] {
  const left = 64;
  const slot = 480 / BARS.length;
  const bw = slot * 0.66;
  const pts: Pt[] = [];
  share(BARS).forEach((count, i) => {
    const x0 = left + i * slot + (slot - bw) / 2;
    const hh = BARS[i] * 330;
    const c = i === BARS.length - 1 ? C_GOLD : i % 2 ? C_MAUVE : C_ROSE;
    for (let k = 0; k < count; k++) pts.push({ x: x0 + rnd() * bw, y: BASE - rnd() * hh, c });
  });
  return pts.sort(byX);
}

const LINE_X0 = 50;
const LINE_W = 500;
const lineY = (u: number) => BASE - 30 - 270 * Math.pow(u, 1.3) - 30 * Math.sin(u * Math.PI * 3) * (1 - u * 0.6);
function lineShape(): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1);
    const x = LINE_X0 + u * LINE_W;
    // 60% trace the line itself; the rest fill the area beneath it, thinning out toward the baseline.
    if (i % 5 < 3) pts.push({ x, y: lineY(u) + gauss() * 7, c: C_ROSE });
    else pts.push({ x: x + gauss() * 4, y: lineY(u) + 10 + Math.pow(rnd(), 1.6) * (BASE - lineY(u) - 10), c: C_MAUVE });
  }
  return pts.sort(byX);
}

const PIE = { x: 300, y: 262, r: 196 };
const SLICES = [
  { share: 0.4, c: C_ROSE },
  { share: 0.25, c: C_GOLD, pop: 18 },
  { share: 0.2, c: C_TEAL },
  { share: 0.15, c: C_MAUVE },
];
/** Pie points are kept in polar form so the pie can turn slowly. */
type Polar = { a: number; r: number; c: number; dx: number; dy: number };
function pieShape(): Polar[] {
  const pts: Polar[] = [];
  let start = -Math.PI / 2;
  share(SLICES.map((s) => s.share)).forEach((count, s) => {
    const sl = SLICES[s];
    const span = sl.share * Math.PI * 2;
    const mid = start + span / 2;
    const pop = sl.pop ?? 0;
    for (let k = 0; k < count; k++) {
      // a thin gap between slices keeps each wedge readable
      pts.push({ a: start + 0.035 + rnd() * (span - 0.07), r: Math.sqrt(rnd()) * PIE.r, c: sl.c, dx: Math.cos(mid) * pop, dy: Math.sin(mid) * pop });
    }
    start += span;
  });
  return pts;
}

const FUNNEL = [
  { w: 480, c: C_TEAL },
  { w: 370, c: C_ROSE },
  { w: 260, c: C_INK },
  { w: 150, c: C_GOLD },
];
function funnelShape(): Pt[] {
  const top = 70;
  const h = 80;
  const gap = 16;
  const pts: Pt[] = [];
  share(FUNNEL.map((f, i) => (f.w + (FUNNEL[i + 1]?.w ?? f.w * 0.6)) / 2)).forEach((count, i) => {
    const wTop = FUNNEL[i].w;
    const wBot = FUNNEL[i + 1]?.w ?? wTop * 0.6;
    const y0 = top + i * (h + gap);
    for (let k = 0; k < count; k++) {
      const v = rnd();
      const w = wTop + (wBot - wTop) * v;
      pts.push({ x: W / 2 + (rnd() - 0.5) * w, y: y0 + v * h, c: FUNNEL[i].c });
    }
  });
  return pts.sort(byX);
}

/** Samples N points from the pixels of rendered text. Runs in the browser, after fonts load. */
function textShape(text: string, accentFrom: number, font: string): Pt[] {
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  if (!g) return barsShape();
  let size = 260;
  g.font = `800 ${size}px ${font}`;
  const fit = (W - 60) / g.measureText(text).width;
  if (fit < 1) size = Math.floor(size * fit);
  g.font = `800 ${size}px ${font}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#000';
  g.fillText(text, W / 2, H / 2 + 6);
  const full = g.measureText(text).width;
  const accentX = W / 2 - full / 2 + g.measureText(text.slice(0, accentFrom)).width;
  const data = g.getImageData(0, 0, W, H).data;
  const cand: { x: number; y: number }[] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 140) cand.push({ x, y });
  if (!cand.length) return barsShape();
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const p = cand[Math.floor(rnd() * cand.length)];
    const x = p.x + rnd() * 2;
    pts.push({ x, y: p.y + rnd() * 2, c: x >= accentX ? C_GOLD : C_ROSE });
  }
  return pts.sort(byX);
}

const SHAPES: Record<'bars' | 'line' | 'funnel', Pt[]> = { bars: barsShape(), line: lineShape(), funnel: funnelShape() };
const PIE_PTS = pieShape();

const HOMES = Array.from({ length: N }, () => ({ x: 30 + rnd() * 540, y: 30 + rnd() * 460, ph: rnd() * Math.PI * 2, sp: 0.6 + rnd() * 0.8 }));
const SIZES = Array.from({ length: N }, () => 1.2 + rnd() * 1.5);
const STIFF = Array.from({ length: N }, () => 0.045 + rnd() * 0.05);

function phaseAt(ms: number) {
  let t = ms % LOOP;
  for (let i = 0; i < TIMELINE.length; i++) {
    if (t < TIMELINE[i].ms) return { ...TIMELINE[i], elapsed: t };
    t -= TIMELINE[i].ms;
  }
  return { ...TIMELINE[0], elapsed: 0 };
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

    const font = v('--font-sans') || 'system-ui, sans-serif';
    let kpi = textShape('+24%', 3, font);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) kpi = textShape('+24%', 3, font);
    });

    // Particle state
    const P = HOMES.map((h) => ({ x: h.x, y: h.y, r: PAL[C_MAUVE][0], g: PAL[C_MAUVE][1], b: PAL[C_MAUVE][2], glow: 0 }));

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

    const targetFor = (shape: ShapeId, i: number, now: number): Pt => {
      if (shape === 'bars' || shape === 'line' || shape === 'funnel') return SHAPES[shape][i];
      if (shape === 'kpi') return kpi[i];
      if (shape === 'pie') {
        const p = PIE_PTS[i];
        const a = p.a + now * 0.0001;
        return { x: PIE.x + p.dx + Math.cos(a) * p.r, y: PIE.y + p.dy + Math.sin(a) * p.r, c: p.c };
      }
      const h = HOMES[i];
      return { x: h.x + Math.sin(now * 0.0006 * h.sp + h.ph) * 34, y: h.y + Math.cos(now * 0.0005 * h.sp + h.ph * 1.3) * 28, c: i % 7 === 0 ? C_GOLD : i % 5 === 0 ? C_ROSE : C_MAUVE };
    };

    let last = 0;
    const render = (now: number, still = false) => {
      const ph = still ? { shape: 'bars' as ShapeId, ms: HOLD, elapsed: 2000 } : phaseAt(now);
      // Easing is tuned for 60fps; scale it by elapsed time so shapes form on schedule at any frame rate.
      const frames = last ? Math.min(20, (now - last) / (1000 / 60)) : 1;
      last = now;
      const ease = (k: number) => 1 - Math.pow(1 - k, frames);

      // On the line chart a highlight travels left to right once the line has formed, as if reading the data.
      const sweep = ph.shape === 'line' ? Math.min(1, Math.max(0, (ph.elapsed - 1100) / (ph.ms - 1700))) : -1;
      const sweepX = sweep >= 0 ? LINE_X0 + sweep * LINE_W : -999;

      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < N; i++) {
        const t = targetFor(ph.shape, i, now);
        const p = P[i];
        const k = still ? 1 : ease(STIFF[i]);
        p.x += (t.x - p.x) * k;
        p.y += (t.y - p.y) * k;
        const col = PAL[t.c];
        const ck = still ? 1 : ease(0.06);
        p.r += (col[0] - p.r) * ck;
        p.g += (col[1] - p.g) * ck;
        p.b += (col[2] - p.b) * ck;
        const lit = Math.abs(p.x - sweepX) < 22 ? 1 : 0;
        p.glow += (lit - p.glow) * (still ? 1 : ease(lit ? 0.35 : 0.05));
        const gl = p.glow;
        const r = p.r + (GOLD[0] - p.r) * gl;
        const g = p.g + (GOLD[1] - p.g) * gl;
        const b = p.b + (GOLD[2] - p.b) * gl;
        ctx.fillStyle = `rgb(${r | 0} ${g | 0} ${b | 0})`;
        ctx.globalAlpha = t.c === C_MAUVE ? 0.72 : 0.92;
        ctx.beginPath();
        ctx.arc(p.x, p.y, SIZES[i] * (1 + gl * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      render(0, true);
      const onResize = () => render(0, true);
      window.addEventListener('resize', onResize);
      return () => {
        cancelled = true;
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
      cancelled = true;
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
      aria-label="Animated illustration: a cloud of particles forms a bar chart, a line chart being read from left to right, a pie chart, a +24% growth figure and a conversion funnel, drifting apart between each."
    />
  );
}
