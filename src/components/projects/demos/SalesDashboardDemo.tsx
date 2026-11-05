import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, RotateCcw } from '../../ui/icons';
import { CATEGORIES, MARKETPLACES, MONTHS, SALES_ROWS, YEAR, productBySku, type Category, type Marketplace } from '../../../data/demo/salesData';
import { seriesColors, useChartColors } from '../../../context/UIContext';
import { useReducedMotion } from '../../../hooks';
import { fmtNum, fmtPeso, fmtPesoCompact } from '../../../lib/format';
import { ChartTooltip } from '../../ui/chart';
import { DemoLabel, cx } from '../../ui/primitives';

const QUARTERS = ['All', 'Q1', 'Q2', 'Q3', 'Q4'] as const;
type Quarter = (typeof QUARTERS)[number];
const inQuarter = (m: number, q: Quarter) => q === 'All' || Math.floor(m / 3) + 1 === Number(q.slice(1));

export default function SalesDashboardDemo() {
  const c = useChartColors();
  const reduced = useReducedMotion();
  const palette = seriesColors(c);
  const [quarter, setQuarter] = useState<Quarter>('All');
  const [cats, setCats] = useState<Category[]>([...CATEGORIES]);
  const [market, setMarket] = useState<Marketplace | 'All'>('All');

  const base = useMemo(() => SALES_ROWS.filter((r) => cats.includes(r.category) && (market === 'All' || r.marketplace === market)), [cats, market]);
  const scoped = useMemo(() => base.filter((r) => inQuarter(r.month, quarter)), [base, quarter]);

  const kpis = useMemo(() => {
    const revenue = scoped.reduce((s, r) => s + r.revenue, 0);
    const units = scoped.reduce((s, r) => s + r.units, 0);
    const skus = new Set(scoped.map((r) => r.sku)).size;
    return { revenue, units, asp: units ? revenue / units : 0, skus };
  }, [scoped]);

  const monthly = useMemo(
    () =>
      MONTHS.map((m, i) => ({
        month: m,
        revenue: base.filter((r) => r.month === i).reduce((s, r) => s + r.revenue, 0),
        inScope: inQuarter(i, quarter),
      })),
    [base, quarter],
  );

  const byCategory = useMemo(
    () =>
      CATEGORIES.map((cat, i) => ({ category: cat, revenue: scoped.filter((r) => r.category === cat).reduce((s, r) => s + r.revenue, 0), color: palette[i] })).sort((a, b) => b.revenue - a.revenue),
    [scoped, palette],
  );

  const topSkus = useMemo(() => {
    const m = new Map<string, { revenue: number; units: number }>();
    for (const r of scoped) {
      const cur = m.get(r.sku) ?? { revenue: 0, units: 0 };
      cur.revenue += r.revenue;
      cur.units += r.units;
      m.set(r.sku, cur);
    }
    return [...m.entries()].map(([sku, v]) => ({ sku, name: productBySku[sku].name, ...v })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [scoped]);
  const maxSku = topSkus[0]?.revenue ?? 1;

  const toggleCat = (cat: Category) => setCats((cur) => (cur.includes(cat) ? (cur.length > 1 ? cur.filter((x) => x !== cat) : cur) : [...cur, cat]));
  const reset = () => {
    setQuarter('All');
    setCats([...CATEGORIES]);
    setMarket('All');
  };

  return (
    <div className="grid gap-4">
      <DemoLabel />
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-sm">
        {/* Report title bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold/20 text-gold">
              <BarChart3 size={15} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-fg">Sales Overview · FY{YEAR}</p>
              <p className="font-mono text-[10px] text-muted">Power BI-style report mock-up · fictional SKUs</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="btn btn-ghost btn-sm">
            <RotateCcw size={14} aria-hidden="true" /> Reset filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[220px_1fr]">
          {/* Slicers */}
          <aside className="grid content-start gap-5 border-b border-line p-4 lg:border-b-0 lg:border-r" aria-label="Report filters">
            <fieldset>
              <legend className="eyebrow mb-2 !text-[10px]">Quarter</legend>
              <div className="flex flex-wrap gap-1.5">
                {QUARTERS.map((q) => (
                  <button key={q} type="button" aria-pressed={quarter === q} onClick={() => setQuarter(q)} className={cx('rounded-lg border px-2.5 py-1 text-xs transition-colors', quarter === q ? 'border-ink bg-ink text-ink-fg' : 'border-line text-muted hover:border-rose')}>
                    {q}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow mb-2 !text-[10px]">Category</legend>
              <div className="grid gap-1.5">
                {CATEGORIES.map((cat, i) => (
                  <label key={cat} className="flex cursor-pointer items-center gap-2 text-sm text-fg">
                    <input type="checkbox" checked={cats.includes(cat)} onChange={() => toggleCat(cat)} className="h-4 w-4 accent-[var(--rose-ink)]" />
                    <span className="h-2 w-2 rounded-sm" style={{ background: palette[i] }} aria-hidden="true" />
                    {cat}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="grid gap-2">
              <span className="eyebrow !text-[10px]">Marketplace</span>
              <select value={market} onChange={(e) => setMarket(e.target.value as Marketplace | 'All')} className="field !py-2 text-sm">
                <option value="All">All marketplaces</option>
                {MARKETPLACES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
          </aside>

          <div className="grid gap-4 p-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                ['Revenue', fmtPesoCompact(kpis.revenue)],
                ['Units sold', fmtNum(kpis.units)],
                ['Avg selling price', fmtPeso(kpis.asp)],
                ['Active SKUs', String(kpis.skus)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-2xl border border-line p-3.5">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted">{l}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums text-fg">{v}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-5">
              <div className="rounded-2xl border border-line p-3.5 xl:col-span-3">
                <p className="mb-2 text-xs font-semibold text-fg">Revenue by month {quarter !== 'All' && <span className="font-normal text-muted">· {quarter} highlighted</span>}</p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthly} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={c.grid} />
                      <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => fmtPesoCompact(v)} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={56} />
                      <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(v) => fmtPeso(v)} />} />
                      <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]} isAnimationActive={!reduced}>
                        {monthly.map((m) => (
                          <Cell key={m.month} fill={m.inScope ? c.rose : c.grid} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-line p-3.5 xl:col-span-2">
                <p className="mb-2 text-xs font-semibold text-fg">Revenue by category <span className="font-normal text-muted">· click a bar to isolate</span></p>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byCategory} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="category" tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={84} />
                      <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(v) => fmtPeso(v)} />} />
                      <Bar
                        dataKey="revenue"
                        name="Revenue"
                        radius={[0, 6, 6, 0]}
                        isAnimationActive={!reduced}
                        className="cursor-pointer"
                        onClick={(d) => {
                          const cat = (d as unknown as { category: Category }).category;
                          setCats((cur) => (cur.length === 1 && cur[0] === cat ? [...CATEGORIES] : [cat]));
                        }}
                      >
                        {byCategory.map((b) => (
                          <Cell key={b.category} fill={b.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[480px] text-left text-sm">
                <caption className="sr-only">Top five SKUs by revenue for the current filters</caption>
                <thead>
                  <tr className="border-b border-line font-mono text-[10px] uppercase tracking-wider text-muted">
                    <th className="px-3.5 py-2.5 font-normal">SKU</th>
                    <th className="px-3.5 py-2.5 font-normal">Product</th>
                    <th className="px-3.5 py-2.5 text-right font-normal">Units</th>
                    <th className="px-3.5 py-2.5 font-normal">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSkus.map((s) => (
                    <tr key={s.sku} className="border-b border-line/60 last:border-0">
                      <td className="px-3.5 py-2.5 font-mono text-xs text-rose-ink">{s.sku}</td>
                      <td className="px-3.5 py-2.5 text-fg">{s.name}</td>
                      <td className="px-3.5 py-2.5 text-right tabular-nums text-muted">{fmtNum(s.units)}</td>
                      <td className="w-[38%] px-3.5 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                            <div className="h-full rounded-full bg-gradient-to-r from-rose to-mauve transition-all duration-700" style={{ width: `${(s.revenue / maxSku) * 100}%` }} />
                          </div>
                          <span className="w-16 text-right text-xs tabular-nums text-fg">{fmtPesoCompact(s.revenue)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
