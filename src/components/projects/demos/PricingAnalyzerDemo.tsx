import { useMemo, useState } from 'react';
import { OBSERVED_PRICES, PARTNERS, PRICED_PRODUCTS } from '../../../data/demo/pricingData';
import { checkCompliance, type CompliancePolicy, type ComplianceStatus } from '../../../lib/calc';
import { fmtPeso, fmtPct, fmtSignedPct } from '../../../lib/format';
import { SliderField } from '../../ui/chart';
import { DemoLabel, Kpi, cx } from '../../ui/primitives';

export function StatusPill({ status }: { status: ComplianceStatus }) {
  const map = {
    compliant: ['Compliant', 'bg-sage/15 text-sage'],
    below: ['Below price', 'bg-alert/15 text-alert'],
    above: ['Above price', 'bg-amber/15 text-amber'],
  } as const;
  const [label, cls] = map[status];
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', cls)}>{label}</span>;
}

export default function PricingAnalyzerDemo() {
  const [sku, setSku] = useState(PRICED_PRODUCTS[0].sku);
  const [tolerance, setTolerance] = useState(3);
  const [policy, setPolicy] = useState<CompliancePolicy>('below');
  const [onlyExceptions, setOnlyExceptions] = useState(false);
  const product = PRICED_PRODUCTS.find((p) => p.sku === sku)!;

  const evaluate = (productSku: string, observed: number) => {
    const p = PRICED_PRODUCTS.find((x) => x.sku === productSku)!;
    const res = checkCompliance(p.authorized, observed, tolerance, policy);
    return res.ok ? res : null;
  };

  const rows = useMemo(
    () =>
      PARTNERS.map((partner) => {
        const obs = OBSERVED_PRICES.find((o) => o.partnerId === partner.id && o.sku === sku)!;
        const res = evaluate(sku, obs.observed)!;
        const margin = ((obs.observed - product.unitCost) / obs.observed) * 100;
        return { partner, observed: obs.observed, res, margin };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sku, tolerance, policy],
  );

  const overview = useMemo(
    () =>
      PARTNERS.map((partner) => {
        const lines = PRICED_PRODUCTS.map((p) => {
          const obs = OBSERVED_PRICES.find((o) => o.partnerId === partner.id && o.sku === p.sku)!;
          return evaluate(p.sku, obs.observed)!;
        });
        const ok = lines.filter((l) => l.compliant).length;
        return { partner, ok, total: lines.length };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tolerance, policy],
  );

  const counts = rows.reduce((acc, r) => ({ ...acc, [r.res.status]: (acc[r.res.status] ?? 0) + 1 }), {} as Record<ComplianceStatus, number>);
  const exceptions = rows.filter((r) => !r.res.compliant).length;
  const visible = onlyExceptions ? rows.filter((r) => !r.res.compliant) : rows;
  const avgMargin = rows.reduce((s, r) => s + r.margin, 0) / rows.length;

  return (
    <div className="grid gap-4">
      <DemoLabel />
      <div className="grid gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5 lg:grid-cols-[280px_1fr]">
        <div className="grid content-start gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-fg">Product</span>
            <select value={sku} onChange={(e) => setSku(e.target.value)} className="field">
              {PRICED_PRODUCTS.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.sku} · {p.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-surface-2 p-3">
              <div className="font-mono text-[10px] uppercase text-muted">Authorized</div>
              <div className="mt-1 font-semibold tabular-nums text-fg">{fmtPeso(product.authorized)}</div>
            </div>
            <div className="rounded-2xl bg-surface-2 p-3">
              <div className="font-mono text-[10px] uppercase text-muted">Unit cost</div>
              <div className="mt-1 font-semibold tabular-nums text-fg">{fmtPeso(product.unitCost)}</div>
            </div>
          </div>
          <SliderField label="Tolerance" value={tolerance} onChange={setTolerance} min={0} max={10} step={0.5} suffix="%" hint="Variance allowed before a line is flagged." />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-fg">Policy</legend>
            <div className="seg w-full">
              <button type="button" aria-pressed={policy === 'below'} onClick={() => setPolicy('below')} className="flex-1">
                Below only
              </button>
              <button type="button" aria-pressed={policy === 'both'} onClick={() => setPolicy('both')} className="flex-1">
                Both directions
              </button>
            </div>
          </fieldset>
        </div>

        <div className="grid min-w-0 gap-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Partners checked" value={rows.length} />
            <Kpi label="Compliant" value={counts.compliant ?? 0} tone="good" />
            <Kpi label="Exceptions" value={exceptions} tone={exceptions ? 'bad' : 'good'} />
            <Kpi label="Avg margin" value={fmtPct(avgMargin)} hint="at observed prices" />
          </div>
          <div className="flex h-3 overflow-hidden rounded-full bg-line" role="img" aria-label={`${counts.compliant ?? 0} compliant, ${counts.below ?? 0} below, ${counts.above ?? 0} above`}>
            <div className="bg-sage transition-all duration-700" style={{ width: `${((counts.compliant ?? 0) / rows.length) * 100}%` }} />
            <div className="bg-alert transition-all duration-700" style={{ width: `${((counts.below ?? 0) / rows.length) * 100}%` }} />
            <div className="bg-amber transition-all duration-700" style={{ width: `${((counts.above ?? 0) / rows.length) * 100}%` }} />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={onlyExceptions} onChange={(e) => setOnlyExceptions(e.target.checked)} className="h-4 w-4 accent-[var(--rose-ink)]" />
            Show exceptions only
          </label>
          <div className="scrollbar-thin max-h-80 overflow-auto rounded-2xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Observed partner prices compared with the authorized price</caption>
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-muted">
                  <th className="px-3 py-2.5 font-normal">Partner</th>
                  <th className="px-3 py-2.5 text-right font-normal">Observed</th>
                  <th className="px-3 py-2.5 text-right font-normal">Variance</th>
                  <th className="px-3 py-2.5 text-right font-normal">Var %</th>
                  <th className="px-3 py-2.5 text-right font-normal">Margin</th>
                  <th className="px-3 py-2.5 font-normal">Flag</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted">
                      No exceptions at this tolerance.
                    </td>
                  </tr>
                )}
                {visible.map((r) => (
                  <tr key={r.partner.id} className={cx('border-b border-line/60 transition-colors last:border-0', !r.res.compliant && 'bg-alert/5')}>
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-fg">{r.partner.name}</div>
                      <div className="text-[11px] text-muted">{r.partner.channel}</div>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtPeso(r.observed)}</td>
                    <td className={cx('px-3 py-2.5 text-right tabular-nums', r.res.variance < 0 ? 'text-alert' : 'text-muted')}>{r.res.variance === 0 ? '—' : `${r.res.variance > 0 ? '+' : '−'}${fmtPeso(Math.abs(r.res.variance))}`}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtSignedPct(r.res.variancePct)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted">{fmtPct(r.margin)}</td>
                    <td className="px-3 py-2.5">
                      <StatusPill status={r.res.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <p className="text-sm font-semibold text-fg">Partner compliance overview</p>
        <p className="text-xs text-muted">Share of the {PRICED_PRODUCTS.length} monitored products within guideline, per partner, at the current tolerance and policy.</p>
        <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {overview.map((o) => (
            <li key={o.partner.id} className="flex items-center gap-3 text-sm">
              <span className="w-20 shrink-0 text-muted">{o.partner.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                <div className={cx('h-full rounded-full transition-all duration-700', o.ok === o.total ? 'bg-sage' : o.ok / o.total >= 0.6 ? 'bg-rose' : 'bg-alert')} style={{ width: `${(o.ok / o.total) * 100}%` }} />
              </div>
              <span className="w-10 text-right font-mono text-xs tabular-nums text-fg">
                {o.ok}/{o.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
