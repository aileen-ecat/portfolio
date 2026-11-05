import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleCheck, Eye, LoaderCircle, Lock, Play, RotateCcw } from '../../ui/icons';
import { LISTINGS, MATCH_RULES, PRICED_PRODUCTS } from '../../../data/demo/pricingData';
import { checkCompliance } from '../../../lib/calc';
import { fmtPeso, fmtSignedPct } from '../../../lib/format';
import { useReducedMotion } from '../../../hooks';
import { SliderField } from '../../ui/chart';
import { DemoLabel, cx } from '../../ui/primitives';
import { StatusPill } from './PricingAnalyzerDemo';

const STEPS = [
  { id: 'collect', label: 'Collect', detail: 'Observed online prices' },
  { id: 'match', label: 'Match', detail: 'Listing to SKU' },
  { id: 'compare', label: 'Compare', detail: 'vs pricing guideline' },
  { id: 'flag', label: 'Flag', detail: 'Outside tolerance' },
  { id: 'report', label: 'Report', detail: 'Exception list' },
  { id: 'review', label: 'Review', detail: 'Human check' },
];

function matchSku(title: string) {
  const t = title.toLowerCase();
  return MATCH_RULES.find((r) => r.keywords.some((k) => t.includes(k)))?.sku ?? null;
}

export default function MonitoringDemo() {
  const reduced = useReducedMotion();
  const [tolerance, setTolerance] = useState(3);
  const [stage, setStage] = useState(-1);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const processed = useMemo(
    () =>
      LISTINGS.map((l) => {
        const sku = matchSku(l.title);
        const product = PRICED_PRODUCTS.find((p) => p.sku === sku);
        const unit = l.price / l.pack;
        const res = product ? checkCompliance(product.authorized, unit, tolerance, 'below') : null;
        return { ...l, sku, product, unit, res: res && res.ok ? res : null };
      }),
    [tolerance],
  );
  const exceptions = processed.filter((p) => p.res && !p.res.compliant);
  const unmatched = processed.filter((p) => !p.sku);
  const allReviewed = exceptions.length > 0 && exceptions.every((e) => reviewed[e.id]);

  const run = () => {
    window.clearTimeout(timer.current);
    setReviewed({});
    let i = 0;
    const tick = () => {
      setStage(i);
      i += 1;
      if (i < STEPS.length) timer.current = window.setTimeout(tick, reduced ? 0 : 650);
    };
    tick();
  };

  const running = stage >= 0 && stage < STEPS.length - 1;
  const show = (id: string) => stage >= STEPS.findIndex((s) => s.id === id);

  return (
    <div className="grid gap-4">
      <DemoLabel>Interactive demonstration using illustrative data. Not actual company records. Listings, partners and prices are fictional.</DemoLabel>

      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <ol className="grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Monitoring workflow">
          {STEPS.map((s, i) => (
            <li key={s.id} className={cx('rounded-2xl border p-3 transition-all duration-500', i < stage || (i === stage && i === STEPS.length - 1) ? 'border-sage/40 bg-sage/10' : i === stage ? 'border-rose bg-rose-soft' : 'border-line bg-surface-2')}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-rose-ink">{String(i + 1).padStart(2, '0')}</span>
                {i < stage && <CircleCheck size={13} className="text-sage" aria-hidden="true" />}
                {i === stage && i < STEPS.length - 1 && <LoaderCircle size={13} className="animate-spin text-rose-ink" aria-hidden="true" />}
              </div>
              <div className="mt-1 text-sm font-semibold text-fg">{s.label}</div>
              <div className="text-[11px] leading-tight text-muted">{s.detail}</div>
            </li>
          ))}
        </ol>
        <div className="mt-4 grid items-end gap-4 sm:grid-cols-[1fr_auto]">
          <SliderField label="Tolerance below authorized price" value={tolerance} onChange={setTolerance} min={0} max={10} step={0.5} suffix="%" />
          <button type="button" onClick={run} disabled={running} className="btn btn-primary">
            {running ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : stage >= 0 ? <RotateCcw size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            {running ? 'Running…' : stage >= 0 ? 'Run again' : 'Run monitoring cycle'}
          </button>
        </div>
      </div>

      {stage < 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-line-strong p-10 text-center text-sm text-muted">Press “Run monitoring cycle” to process {LISTINGS.length} observed listings.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="scrollbar-thin overflow-x-auto rounded-3xl border border-line bg-surface lg:col-span-3">
            <table className="w-full min-w-[520px] text-left text-[12.5px]">
              <caption className="px-4 pt-4 text-left text-sm font-semibold text-fg">Observed listings</caption>
              <thead>
                <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-muted">
                  <th className="px-4 py-2 font-normal">Listing</th>
                  <th className="px-2 py-2 text-right font-normal">Price</th>
                  {show('match') && <th className="px-2 py-2 font-normal">SKU</th>}
                  {show('compare') && <th className="px-2 py-2 text-right font-normal">Var %</th>}
                  {show('flag') && <th className="px-4 py-2 font-normal">Flag</th>}
                </tr>
              </thead>
              <tbody>
                {processed.map((l) => (
                  <tr key={l.id} className="fade-in border-b border-line/60 last:border-0">
                    <td className="px-4 py-2">
                      <div className="text-fg">{l.title}</div>
                      <div className="text-[11px] text-muted">
                        {l.seller}
                        {l.pack > 1 && ` · ${l.pack}-pack = ${fmtPeso(l.unit)}/unit`}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{fmtPeso(l.price)}</td>
                    {show('match') && <td className="px-2 py-2 font-mono text-[11px]">{l.sku ?? <span className="text-amber">no match</span>}</td>}
                    {show('compare') && <td className="px-2 py-2 text-right tabular-nums">{l.res ? fmtSignedPct(l.res.variancePct) : '—'}</td>}
                    {show('flag') && <td className="px-4 py-2">{l.res ? <StatusPill status={l.res.status} /> : <span className="text-[11px] text-muted">excluded</span>}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid content-start gap-4 lg:col-span-2">
            {show('report') ? (
              <div className="pop-in rounded-3xl border border-line bg-surface p-5">
                <p className="text-sm font-semibold text-fg">Exception report</p>
                <p className="text-xs text-muted">
                  {exceptions.length} exception{exceptions.length === 1 ? '' : 's'} · {unmatched.length} unmatched listing{unmatched.length === 1 ? '' : 's'} set aside for manual mapping
                </p>
                <ul className="mt-4 grid gap-2">
                  {exceptions.length === 0 && <li className="text-sm text-muted">No listings below the tolerance.</li>}
                  {exceptions.map((e) => (
                    <li key={e.id} className="rounded-2xl border border-line p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-fg">
                            {e.seller} · <span className="font-mono text-xs">{e.sku}</span>
                          </div>
                          <div className="text-[11px] text-muted">
                            {fmtPeso(e.unit)} vs {fmtPeso(e.product!.authorized)} ({fmtSignedPct(e.res!.variancePct)})
                          </div>
                        </div>
                        {show('review') && (
                          <label className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-muted">
                            <input type="checkbox" checked={!!reviewed[e.id]} onChange={(ev) => setReviewed((r) => ({ ...r, [e.id]: ev.target.checked }))} className="h-4 w-4 accent-[var(--rose-ink)]" />
                            Verified
                          </label>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="shimmer h-40 rounded-3xl" aria-hidden="true" />
            )}
            {show('review') && (
              <div className={cx('pop-in rounded-3xl border p-5 text-sm', allReviewed ? 'border-sage/40 bg-sage/10' : 'border-dashed border-line-strong')}>
                <div className="flex items-center gap-2 font-semibold text-fg">
                  {allReviewed ? <CircleCheck size={16} className="text-sage" aria-hidden="true" /> : <Eye size={16} className="text-rose-ink" aria-hidden="true" />}
                  {allReviewed ? 'Report reviewed — ready for the team' : 'Review gate'}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Each exception is checked by a person before any follow-up is decided. <span className="inline-flex items-center gap-1"><Lock size={11} aria-hidden="true" /> This demo never sends emails or messages.</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
