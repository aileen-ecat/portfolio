/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId, type ReactNode } from 'react';
import { cx } from './primitives';

/** Tooltip content for Recharts, styled to match the site. */
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
  labelFormatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: any;
  valueFormatter?: (value: number, entry: any) => ReactNode;
  labelFormatter?: (label: any, payload: any[]) => ReactNode;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[160px] rounded-xl border border-line bg-surface/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur">
      <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">{labelFormatter ? labelFormatter(label, payload) : label}</div>
      <div className="grid gap-1">
        {payload.map((p, i) => (
          <div key={`${p.dataKey ?? p.name}-${i}`} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color ?? p.payload?.fill ?? p.fill }} aria-hidden="true" />
            <span className="text-muted">{p.name}</span>
            <span className="ml-auto pl-3 font-medium tabular-nums text-fg">{valueFormatter ? valueFormatter(Number(p.value), p) : p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartCard({ title, subtitle, children, className, action }: { title: string; subtitle?: ReactNode; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <div className={cx('rounded-2xl border border-line bg-surface p-4 sm:p-5', className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-fg">{title}</h4>
          {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ───────── Labelled slider + number input used by simulators ───────── */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const pct = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  return (
    <div className={cx('grid gap-2', disabled && 'opacity-45')}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-line-strong bg-surface px-2 focus-within:border-rose">
          {prefix && <span className="text-xs text-muted">{prefix}</span>}
          <input
            type="number"
            inputMode="decimal"
            aria-label={`${label} value`}
            className="w-24 bg-transparent py-1.5 text-right text-sm tabular-nums text-fg outline-none"
            value={Number.isFinite(value) ? value : ''}
            min={min}
            step={step}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          />
          {suffix && <span className="pl-1 text-xs text-muted">{suffix}</span>}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: `linear-gradient(90deg, var(--rose-ink) ${pct}%, var(--line) ${pct}%)` }}
      />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
