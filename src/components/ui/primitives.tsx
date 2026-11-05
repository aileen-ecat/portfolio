import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Info } from './icons';
import { useInView, useReducedMotion } from '../../hooks';
import type { AnyIcon } from './DataIcons';

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Resolve a path inside /public against the deployed base URL. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

/* ───────── Reveal: fades + lifts content in when scrolled into view ───────── */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' | 'article' }) {
  const [ref, inView] = useInView<HTMLElement>();
  const Tag = as as 'div';
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={cx('reveal', inView && 'is-in', className)} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/* ───────── Animated number counter ───────── */
export function CountUp({ value, prefix = '', suffix = '', grouped = false, decimals = 0, duration = 1700 }: { value: number; prefix?: string; suffix?: string; grouped?: boolean; decimals?: number; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setDisplay(value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);
  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped });
  return (
    <span ref={ref}>
      <span className="sr-only">{`${prefix}${fmt(value)}${suffix}`}</span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {fmt(display)}
        {suffix}
      </span>
    </span>
  );
}

/* ───────── Magnetic wrapper for primary CTAs ───────── */
export function Magnetic({ children, strength = 0.22, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  return (
    <span
      ref={ref}
      className={cx('magnetic inline-flex', className)}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
    >
      {children}
    </span>
  );
}

/* ───────── Section heading ───────── */
/** Small in-view heading, e.g. "✦ WHAT I DO" with an optional action on the right. */
export function MiniHeading({ icon: I, children, action, id }: { icon: AnyIcon; children: ReactNode; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h3 id={id} className="eyebrow flex items-center gap-3 !text-fg">
        <span className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-surface text-rose-ink">
          <I size={15} aria-hidden="true" />
        </span>
        {children}
      </h3>
      {action}
    </div>
  );
}

export function SectionHeading({ index, eyebrow, title, subtitle, align = 'left', icon: I, children }: { index: string; eyebrow: string; title: ReactNode; subtitle?: ReactNode; align?: 'left' | 'center'; icon?: AnyIcon; children?: ReactNode }) {
  return (
    <div className={cx('mb-10 md:mb-12', align === 'center' && 'mx-auto max-w-3xl text-center')}>
      <Reveal>
        <div className={cx('eyebrow flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="text-rose-ink">{index}</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className={cx('mt-5 flex items-center gap-4', align === 'center' && 'justify-center')}>
          {I && (
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose to-mauve text-white shadow-[0_14px_30px_-14px_var(--rose-ink)] sm:grid">
              <I size={26} aria-hidden="true" />
            </span>
          )}
          <h2 className="display text-[2.6rem] text-fg text-balance sm:text-5xl md:text-6xl">{title}</h2>
        </div>
      </Reveal>
      {subtitle && (
        <Reveal delay={160}>
          <p className={cx('mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-muted text-pretty', align === 'center' && 'mx-auto')}>{subtitle}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

/* ───────── Illustrative-data label ───────── */
export function DemoLabel({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <p className={cx('inline-flex items-start gap-2 rounded-xl border border-dashed border-line-strong bg-surface-2 px-3 py-2 text-xs text-muted', className)}>
      <Info size={14} className="mt-0.5 shrink-0 text-rose-ink" aria-hidden="true" />
      <span>{children ?? 'Interactive demonstration using illustrative data. Not actual company records.'}</span>
    </p>
  );
}

/* ───────── KPI tile used in demos ───────── */
export function Kpi({ label, value, hint, tone = 'default', className }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'default' | 'good' | 'bad' | 'accent'; className?: string }) {
  const toneCls = tone === 'good' ? 'text-sage' : tone === 'bad' ? 'text-alert' : tone === 'accent' ? 'text-rose-ink' : 'text-fg';
  return (
    <div className={cx('rounded-2xl border border-line bg-surface p-4', className)}>
      <div className="eyebrow !text-[10px]">{label}</div>
      <div className={cx('mt-2 text-2xl font-semibold tabular-nums tracking-tight', toneCls)}>{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

/* ───────── Chip toggle used for filters ───────── */
export function ToggleChip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300',
        active ? 'border-transparent bg-ink text-ink-fg shadow-sm' : 'border-line bg-surface text-muted hover:border-rose hover:text-fg',
      )}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />}
      {children}
    </button>
  );
}

/* ───────── Loading skeleton ───────── */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('shimmer rounded-2xl', className)} aria-hidden="true" />;
}

export function LoadingPanel({ label = 'Loading interactive demo…', className }: { label?: string; className?: string }) {
  return (
    <div className={cx('grid gap-3', className)} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
