import { useId, useState } from 'react';
import { CircleCheck, CircleX, TriangleExclamationPoint } from '../ui/icons';
import { checkCompliance, type CompliancePolicy } from '../../lib/calc';
import { fmtPeso2, fmtSignedPct } from '../../lib/format';
import { DemoLabel, cx } from '../ui/primitives';

function NumberInput({ label, value, onChange, prefix, suffix, disabled, hint }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string; disabled?: boolean; hint?: string }) {
  const id = useId();
  return (
    <div className={cx('grid gap-1.5', disabled && 'opacity-50')}>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-line-strong bg-surface px-3 focus-within:border-rose focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--rose)_25%,transparent)]">
        {prefix && <span className="text-sm text-muted">{prefix}</span>}
        <input id={id} type="number" inputMode="decimal" min={0} step="0.01" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-2 py-2.5 text-[15px] tabular-nums text-fg outline-none" />
        {suffix && <span className="text-sm text-muted">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

const PRESETS = [
  { label: 'Within tolerance', a: '1299', o: '1269' },
  { label: 'Under-priced', a: '2499', o: '2199' },
  { label: 'Above authorized', a: '1490', o: '1590' },
];

export default function ComplianceChecker() {
  const [authorized, setAuthorized] = useState('1299');
  const [observed, setObserved] = useState('1249');
  const [useTol, setUseTol] = useState(true);
  const [tol, setTol] = useState('3');
  const [policy, setPolicy] = useState<CompliancePolicy>('below');

  const a = authorized === '' ? NaN : Number(authorized);
  const o = observed === '' ? NaN : Number(observed);
  const t = useTol ? Number(tol || 0) : 0;
  const res = checkCompliance(a, o, t, policy);

  // Number line from −20% to +20% around the authorized price.
  const RANGE = 20;
  const pos = (pct: number) => `${Math.min(100, Math.max(0, ((pct + RANGE) / (2 * RANGE)) * 100))}%`;

  return (
    <div className="grid gap-5">
      <DemoLabel />
      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="grid content-start gap-4 rounded-3xl border border-line bg-surface p-5">
          <NumberInput label="Authorized selling price" value={authorized} onChange={setAuthorized} prefix="₱" />
          <NumberInput label="Observed selling price" value={observed} onChange={setObserved} prefix="₱" />
          <label className="flex items-center justify-between gap-3 text-sm font-medium text-fg">
            Apply a tolerance threshold
            <input type="checkbox" checked={useTol} onChange={(e) => setUseTol(e.target.checked)} className="h-4 w-4 accent-[var(--rose-ink)]" />
          </label>
          <NumberInput label="Tolerance" value={tol} onChange={setTol} suffix="%" disabled={!useTol} hint="Optional allowance before a price is flagged." />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-fg">Policy</legend>
            <div className="seg w-full">
              <button type="button" aria-pressed={policy === 'below'} onClick={() => setPolicy('below')} className="flex-1">
                Flag below only
              </button>
              <button type="button" aria-pressed={policy === 'both'} onClick={() => setPolicy('both')} className="flex-1">
                Both directions
              </button>
            </div>
          </fieldset>
          <div>
            <p className="eyebrow mb-2 !text-[10px]">Try a scenario</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.label} type="button" className="chip transition-colors hover:border-rose" onClick={() => { setAuthorized(p.a); setObserved(p.o); }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-4" aria-live="polite">
          {!res.ok ? (
            <div className="flex items-start gap-3 rounded-3xl border border-alert/40 bg-alert/10 p-6 text-alert">
              <TriangleExclamationPoint size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">Check the inputs</p>
                <p className="mt-1 text-sm">{res.error}</p>
              </div>
            </div>
          ) : (
            <>
              <div key={res.status} className={cx('pop-in flex items-center gap-4 rounded-3xl border p-6', res.compliant ? 'border-sage/40 bg-sage/10' : 'border-alert/40 bg-alert/10')}>
                <span className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-2xl', res.compliant ? 'bg-sage text-white' : 'bg-alert text-white')}>
                  {res.compliant ? <CircleCheck size={28} aria-hidden="true" /> : <CircleX size={28} aria-hidden="true" />}
                </span>
                <div>
                  <p className={cx('font-serif text-3xl font-medium', res.compliant ? 'text-sage' : 'text-alert')}>{res.compliant ? 'Compliant' : 'Non-compliant'}</p>
                  <p className="mt-1 text-sm text-fg/90">{res.explanation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <div className="eyebrow !text-[10px]">Absolute variance</div>
                  <div className="mt-2 text-2xl font-semibold tabular-nums text-fg">
                    {res.variance > 0 ? '+' : res.variance < 0 ? '−' : ''}
                    {fmtPeso2(Math.abs(res.variance))}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-muted">observed − authorized</div>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-4">
                  <div className="eyebrow !text-[10px]">Percentage variance</div>
                  <div className="mt-2 text-2xl font-semibold tabular-nums text-fg">{fmtSignedPct(res.variancePct, 2)}</div>
                  <div className="mt-1 font-mono text-[11px] text-muted">variance ÷ authorized × 100</div>
                </div>
              </div>

              <div className="rounded-3xl border border-line bg-surface p-5">
                <p className="text-sm font-semibold text-fg">Where the price sits</p>
                <p className="text-xs text-muted">Scale shows −{RANGE}% to +{RANGE}% around the authorized price; the shaded band is the allowed zone.</p>
                <div className="relative mt-8 h-12">
                  <div className="absolute inset-x-0 top-5 h-2 rounded-full bg-line" />
                  {/* allowed band */}
                  <div
                    className="absolute top-5 h-2 rounded-full bg-sage/45 transition-all duration-500"
                    style={{ left: pos(-res.tolerance), width: `calc(${policy === 'below' ? '100%' : pos(res.tolerance)} - ${pos(-res.tolerance)})` }}
                  />
                  <div className="absolute top-2 h-8 w-px bg-plum" style={{ left: pos(0) }} />
                  <span className="absolute -top-4 -translate-x-1/2 font-mono text-[10px] text-muted" style={{ left: pos(0) }}>
                    authorized
                  </span>
                  <div className="absolute top-3.5 h-5 w-5 -translate-x-1/2 rounded-full border-[3px] border-surface shadow-md transition-all duration-500 ease-[var(--ease-silk)]" style={{ left: pos(res.variancePct), background: res.compliant ? 'var(--sage)' : 'var(--alert)' }} />
                  <span className="absolute top-10 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-fg transition-all duration-500" style={{ left: pos(res.variancePct) }}>
                    observed {fmtSignedPct(res.variancePct)}
                  </span>
                  <span className="absolute left-0 top-10 font-mono text-[10px] text-muted">−{RANGE}%</span>
                  <span className="absolute right-0 top-10 font-mono text-[10px] text-muted">+{RANGE}%</span>
                </div>
                {Math.abs(res.variancePct) > RANGE && <p className="mt-4 text-xs text-muted">The observed price is outside the ±{RANGE}% scale; the marker is pinned to the edge.</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
