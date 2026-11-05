import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Calculator, RotateCcw } from '../ui/icons';
import { computeRoas, type RoasMode } from '../../lib/calc';
import { useChartColors } from '../../context/UIContext';
import { useReducedMotion } from '../../hooks';
import { fmtNum, fmtPct, fmtPeso, fmtPesoCompact, fmtRatio } from '../../lib/format';
import { ChartCard, ChartTooltip, SliderField } from '../ui/chart';
import { DemoLabel, Kpi } from '../ui/primitives';

const DEFAULTS = { spend: 80000, clicks: 20000, cvr: 1.8, aov: 1200, revenue: 400000, margin: 25 };

export default function RoasSimulator() {
  const c = useChartColors();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<RoasMode>('funnel');
  const [v, setV] = useState(DEFAULTS);
  const set = (k: keyof typeof DEFAULTS) => (n: number) => setV((s) => ({ ...s, [k]: n }));

  const out = useMemo(() => computeRoas({ mode, ...v }), [mode, v]);
  const profitable = out.contribution >= 0;

  const bars = [
    { name: 'Ad spend', value: v.spend, color: c.lavender },
    { name: 'Revenue', value: out.revenue, color: c.rose },
    { name: 'Gross profit', value: out.grossProfit, color: c.mauve },
    { name: 'After ad spend', value: out.contribution, color: profitable ? c.ok : c.alert },
  ];

  const sensitivity = useMemo(() => {
    const pts = [];
    for (let cvr = 0.5; cvr <= 6.001; cvr += 0.25) {
      const r = computeRoas({ mode: 'funnel', spend: v.spend, clicks: v.clicks, cvr, aov: v.aov, revenue: 0, margin: v.margin });
      pts.push({ cvr: Number(cvr.toFixed(2)), roas: r.roas ?? 0 });
    }
    return pts;
  }, [v.spend, v.clicks, v.aov, v.margin]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DemoLabel />
        <button type="button" className="btn btn-ghost btn-sm self-start" onClick={() => { setV(DEFAULTS); setMode('funnel'); }}>
          <RotateCcw size={14} aria-hidden="true" /> Reset inputs
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <div className="grid content-start gap-5 rounded-3xl border border-line bg-surface p-5">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-fg">How is revenue known?</legend>
            <div className="seg w-full">
              <button type="button" aria-pressed={mode === 'funnel'} onClick={() => setMode('funnel')} className="flex-1">
                From funnel
              </button>
              <button type="button" aria-pressed={mode === 'direct'} onClick={() => setMode('direct')} className="flex-1">
                Enter revenue
              </button>
            </div>
          </fieldset>
          <SliderField label="Advertising budget" value={v.spend} onChange={set('spend')} min={1000} max={300000} step={1000} prefix="₱" />
          <SliderField label="Traffic (clicks)" value={v.clicks} onChange={set('clicks')} min={100} max={100000} step={100} />
          <SliderField label="Conversion rate" value={mode === 'funnel' ? v.cvr : Number(out.cvr.toFixed(2))} onChange={set('cvr')} min={0.1} max={10} step={0.1} suffix="%" disabled={mode === 'direct'} hint={mode === 'direct' ? 'Implied from revenue ÷ AOV ÷ clicks.' : undefined} />
          <SliderField label="Average order value" value={v.aov} onChange={set('aov')} min={100} max={10000} step={50} prefix="₱" />
          <SliderField label="Advertising revenue" value={mode === 'direct' ? v.revenue : Math.round(out.revenue)} onChange={set('revenue')} min={0} max={2000000} step={5000} prefix="₱" disabled={mode === 'funnel'} hint={mode === 'funnel' ? 'Calculated: clicks × CVR × AOV.' : undefined} />
          <SliderField label="Gross margin" value={v.margin} onChange={set('margin')} min={1} max={80} step={1} suffix="%" hint="Used for break-even ROAS and profit after ad spend." />
        </div>

        <div className="grid min-w-0 content-start gap-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3" aria-live="polite">
            <Kpi label="ROAS" value={out.roas !== null ? fmtRatio(out.roas) : '—'} tone={out.roas !== null && out.breakEvenRoas !== null && out.roas >= out.breakEvenRoas ? 'good' : 'bad'} hint={out.breakEvenRoas ? `Break-even ${fmtRatio(out.breakEvenRoas)}` : undefined} />
            <Kpi label="ACoS" value={out.acos !== null ? fmtPct(out.acos) : '—'} hint="Ad cost ÷ revenue" />
            <Kpi label="Orders" value={fmtNum(out.orders)} hint={`CVR ${fmtPct(out.cvr, 2)}`} />
            <Kpi label="Cost per acquisition" value={out.cpa !== null ? fmtPeso(out.cpa) : '—'} hint={out.cpc !== null ? `CPC ${fmtPeso(out.cpc)}` : undefined} />
            <Kpi label="Revenue" value={fmtPesoCompact(out.revenue)} tone="accent" />
            <Kpi label="Profit after ad spend" value={fmtPesoCompact(out.contribution)} tone={profitable ? 'good' : 'bad'} hint={profitable ? 'Campaign covers its ad cost' : 'Ad cost exceeds gross profit'} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="Revenue performance" subtitle="spend, revenue and profit">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bars} margin={{ top: 4, right: 4, left: -6, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={c.grid} />
                    <XAxis dataKey="name" tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tickFormatter={fmtPesoCompact} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={56} />
                    <ReferenceLine y={0} stroke={c.axis} />
                    <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(n) => fmtPeso(n)} />} />
                    <Bar dataKey="value" name="Amount" radius={[6, 6, 0, 0]} isAnimationActive={!reduced} animationDuration={500}>
                      {bars.map((b) => (
                        <Cell key={b.name} fill={b.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="ROAS sensitivity to conversion rate" subtitle="same spend, clicks & AOV · dashed = break-even">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensitivity} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={c.grid} />
                    <XAxis dataKey="cvr" type="number" domain={[0.5, 6]} tickFormatter={(x) => `${x}%`} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(x) => `${x}×`} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip labelFormatter={(l) => `CVR ${l}%`} valueFormatter={(n) => fmtRatio(n)} />} />
                    {out.breakEvenRoas !== null && <ReferenceLine y={out.breakEvenRoas} stroke={c.alert} strokeDasharray="5 4" />}
                    <Line type="monotone" dataKey="roas" name="ROAS" stroke={c.rose} strokeWidth={2.4} dot={false} isAnimationActive={!reduced} animationDuration={500} />
                    {out.roas !== null && out.cvr >= 0.5 && out.cvr <= 6 && <ReferenceDot x={Number(out.cvr.toFixed(2))} y={out.roas} r={6} fill={c.plum} stroke={c.surface} strokeWidth={2} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <details className="group rounded-3xl border border-line bg-surface-2 p-5 text-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-fg">
              <Calculator size={16} className="text-rose-ink" aria-hidden="true" /> Formulas & assumptions
              <span className="ml-auto font-mono text-xs text-muted group-open:hidden">show</span>
              <span className="ml-auto hidden font-mono text-xs text-muted group-open:inline">hide</span>
            </summary>
            <ul className="mt-4 grid gap-2 font-mono text-[12px] text-fg sm:grid-cols-2">
              <li>Orders = Clicks × CVR</li>
              <li>Revenue = Orders × AOV</li>
              <li>ROAS = Revenue ÷ Ad spend</li>
              <li>ACoS = Ad spend ÷ Revenue × 100</li>
              <li>CPA = Ad spend ÷ Orders</li>
              <li>CPC = Ad spend ÷ Clicks</li>
              <li>Gross profit = Revenue × Margin</li>
              <li>Break-even ROAS = 1 ÷ Margin</li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Revenue here is ad-attributed revenue. Real platforms use different attribution windows and models, so ROAS from different platforms is not always directly comparable. Profit after ad spend ignores fees, shipping and returns.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
