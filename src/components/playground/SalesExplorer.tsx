import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Filter } from '../ui/icons';
import { CATEGORIES, MARKETPLACES, MONTHS, SALES_ROWS, YEAR, productBySku, type Category, type Marketplace } from '../../data/demo/salesData';
import { seriesColors, useChartColors } from '../../context/UIContext';
import { useReducedMotion } from '../../hooks';
import { fmtNum, fmtPct, fmtPeso, fmtPesoCompact, fmtSignedPct } from '../../lib/format';
import { ChartCard, ChartTooltip } from '../ui/chart';
import { DemoLabel, Kpi, ToggleChip } from '../ui/primitives';

export default function SalesExplorer() {
  const c = useChartColors();
  const reduced = useReducedMotion();
  const palette = seriesColors(c);
  const [month, setMonth] = useState<number | 'all'>('all');
  const [cats, setCats] = useState<Category[]>([...CATEGORIES]);
  const [markets, setMarkets] = useState<Marketplace[]>([...MARKETPLACES]);

  const toggle = <T,>(list: T[], item: T, setter: (v: T[]) => void) => setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  const filtered = useMemo(() => SALES_ROWS.filter((r) => cats.includes(r.category) && markets.includes(r.marketplace)), [cats, markets]);
  const inPeriod = useMemo(() => (month === 'all' ? filtered : filtered.filter((r) => r.month === month)), [filtered, month]);

  const trend = useMemo(
    () =>
      MONTHS.map((m, i) => {
        const row: Record<string, number | string> = { month: m };
        for (const mk of markets) row[mk] = filtered.filter((r) => r.month === i && r.marketplace === mk).reduce((s, r) => s + r.revenue, 0);
        row.total = filtered.filter((r) => r.month === i).reduce((s, r) => s + r.revenue, 0);
        return row;
      }),
    [filtered, markets],
  );

  const mom = trend.map((t, i) => ({ month: t.month as string, growth: i === 0 ? 0 : (((t.total as number) - (trend[i - 1].total as number)) / ((trend[i - 1].total as number) || 1)) * 100, valid: i > 0 }));

  const revenue = inPeriod.reduce((s, r) => s + r.revenue, 0);
  const units = inPeriod.reduce((s, r) => s + r.units, 0);
  const momIdx = month === 'all' ? 11 : month;
  const momValue = momIdx > 0 ? mom[momIdx].growth : null;

  const topProducts = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of inPeriod) m.set(r.sku, (m.get(r.sku) ?? 0) + r.revenue);
    return [...m.entries()].map(([sku, rev]) => ({ name: productBySku[sku].name, sku, revenue: rev })).sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [inPeriod]);

  const contribution = CATEGORIES.filter((cat) => cats.includes(cat)).map((cat) => ({
    name: cat,
    value: inPeriod.filter((r) => r.category === cat).reduce((s, r) => s + r.revenue, 0),
    color: palette[CATEGORIES.indexOf(cat)],
  }));

  const empty = cats.length === 0 || markets.length === 0;
  const marketColor = (mk: Marketplace) => [c.rose, c.lavender, c.gold][MARKETPLACES.indexOf(mk)];

  return (
    <div className="grid gap-5">
      <DemoLabel />
      <div className="grid gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5 lg:grid-cols-[auto_1fr_1fr] lg:items-start">
        <label className="grid gap-2">
          <span className="eyebrow !text-[10px]">Month</span>
          <select value={month} onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="field !w-48">
            <option value="all">All months ({YEAR})</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i}>
                {m} {YEAR}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend className="eyebrow mb-2 !text-[10px]">Product category</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat, i) => (
              <ToggleChip key={cat} active={cats.includes(cat)} onClick={() => toggle(cats, cat, setCats)} color={palette[i]}>
                {cat}
              </ToggleChip>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="eyebrow mb-2 !text-[10px]">Marketplace</legend>
          <div className="flex flex-wrap gap-2">
            {MARKETPLACES.map((mk) => (
              <ToggleChip key={mk} active={markets.includes(mk)} onClick={() => toggle(markets, mk, setMarkets)} color={marketColor(mk)}>
                {mk}
              </ToggleChip>
            ))}
          </div>
        </fieldset>
      </div>

      {empty ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
          <Filter className="text-rose-ink" size={24} aria-hidden="true" />
          <p className="mt-3 font-medium text-fg">Nothing to show yet</p>
          <p className="mt-1 text-sm text-muted">Select at least one category and one marketplace.</p>
          <button type="button" className="btn btn-secondary btn-sm mt-5" onClick={() => { setCats([...CATEGORIES]); setMarkets([...MARKETPLACES]); }}>
            Select all
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-live="polite">
            <Kpi label={month === 'all' ? `Revenue · FY${YEAR}` : `Revenue · ${MONTHS[month]}`} value={fmtPesoCompact(revenue)} tone="accent" />
            <Kpi label="Units" value={fmtNum(units)} />
            <Kpi
              label={month === 'all' ? 'MoM growth · Dec vs Nov' : `MoM growth · ${MONTHS[month]}`}
              value={momValue === null ? '—' : fmtSignedPct(momValue)}
              tone={momValue === null ? 'default' : momValue >= 0 ? 'good' : 'bad'}
              hint={momValue === null ? 'No prior month in dataset' : undefined}
            />
            <Kpi label="Top product" value={<span className="text-base">{topProducts[0]?.name ?? '—'}</span>} hint={topProducts[0] ? fmtPeso(topProducts[0].revenue) : undefined} />
          </div>

          <ChartCard title="Revenue trend by marketplace" subtitle={month === 'all' ? 'stacked, monthly' : `stacked, monthly · ${MONTHS[month]} marked`}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
                  <defs>
                    {markets.map((mk) => (
                      <linearGradient key={mk} id={`g-${mk.replace(/\s/g, '')}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor={marketColor(mk)} stopOpacity={0.55} />
                        <stop offset="1" stopColor={marketColor(mk)} stopOpacity={0.08} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} stroke={c.grid} />
                  <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtPesoCompact} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={58} />
                  <Tooltip content={<ChartTooltip valueFormatter={(v) => fmtPeso(v)} />} />
                  {month !== 'all' && <ReferenceLine x={MONTHS[month]} stroke={c.plum} strokeDasharray="4 4" />}
                  {markets.map((mk) => (
                    <Area key={mk} type="monotone" dataKey={mk} name={mk} stackId="1" stroke={marketColor(mk)} strokeWidth={2} fill={`url(#g-${mk.replace(/\s/g, '')})`} isAnimationActive={!reduced} animationDuration={600} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <div className="grid gap-4 lg:grid-cols-3">
            <ChartCard title="Top products" subtitle={month === 'all' ? 'full year' : MONTHS[month]} className="lg:col-span-1">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="sku" tick={{ fill: c.axis, fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={56} />
                    <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip labelFormatter={(_, p) => p?.[0]?.payload?.name} valueFormatter={(v) => fmtPeso(v)} />} />
                    <Bar dataKey="revenue" name="Revenue" fill={c.rose} radius={[0, 6, 6, 0]} isAnimationActive={!reduced} animationDuration={600} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Month-over-month growth" subtitle="total revenue, selected filters">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mom.slice(1)} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={c.grid} />
                    <XAxis dataKey="month" tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                    <YAxis tickFormatter={(v) => `${Math.round(v)}%`} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={0} stroke={c.axis} />
                    <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(v) => fmtSignedPct(v)} />} />
                    <Bar dataKey="growth" name="MoM" radius={[4, 4, 4, 4]} isAnimationActive={!reduced} animationDuration={600}>
                      {mom.slice(1).map((m) => (
                        <Cell key={m.month} fill={m.growth >= 0 ? c.sage : c.alert} fillOpacity={month === 'all' || MONTHS[month] === m.month ? 1 : 0.35} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Category contribution" subtitle="share of revenue in period">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={contribution} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="90%" paddingAngle={2} stroke="none" isAnimationActive={!reduced}>
                      {contribution.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip valueFormatter={(v) => `${fmtPeso(v)} · ${fmtPct((v / (revenue || 1)) * 100)}`} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
                {contribution.map((d) => (
                  <li key={d.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} aria-hidden="true" />
                    <span className="truncate text-muted">{d.name}</span>
                    <span className="ml-auto font-mono tabular-nums text-fg">{fmtPct((d.value / (revenue || 1)) * 100, 0)}</span>
                  </li>
                ))}
              </ul>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}
