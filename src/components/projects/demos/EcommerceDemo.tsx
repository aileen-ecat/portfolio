import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CAMPAIGNS, CAMPAIGN_ROWS, PLATFORMS, type Campaign, type Platform } from '../../../data/demo/ecommerceData';
import { seriesColors, useChartColors } from '../../../context/UIContext';
import { useReducedMotion } from '../../../hooks';
import { fmtPct, fmtPeso, fmtPesoCompact, fmtRatio } from '../../../lib/format';
import { ChartCard, ChartTooltip } from '../../ui/chart';
import { DemoLabel, Kpi, ToggleChip } from '../../ui/primitives';

export default function EcommerceDemo() {
  const c = useChartColors();
  const reduced = useReducedMotion();
  const palette = seriesColors(c);
  const colorOf = (p: Platform) => palette[PLATFORMS.indexOf(p)];
  const [campaign, setCampaign] = useState<Campaign>('11.11 Mega Sale');
  const [platforms, setPlatforms] = useState<Platform[]>([...PLATFORMS]);

  const toggle = (p: Platform) => setPlatforms((cur) => (cur.includes(p) ? (cur.length > 1 ? cur.filter((x) => x !== p) : cur) : PLATFORMS.filter((x) => x === p || cur.includes(x))));

  const rows = useMemo(() => CAMPAIGN_ROWS.filter((r) => r.campaign === campaign && platforms.includes(r.platform)), [campaign, platforms]);
  const totals = useMemo(() => {
    const spend = rows.reduce((s, r) => s + r.spend, 0);
    const revenue = rows.reduce((s, r) => s + r.revenue, 0);
    const orders = rows.reduce((s, r) => s + r.orders, 0);
    const clicks = rows.reduce((s, r) => s + r.clicks, 0);
    return { spend, revenue, orders, clicks, roas: spend ? revenue / spend : 0, cvr: clicks ? (orders / clicks) * 100 : 0 };
  }, [rows]);

  const perPlatform = rows.map((r) => ({ platform: r.platform, spend: r.spend, revenue: r.revenue, roas: r.revenue / r.spend, cvr: (r.orders / r.clicks) * 100, color: colorOf(r.platform) }));
  const best = [...perPlatform].sort((a, b) => b.roas - a.roas)[0];

  const comparison = CAMPAIGNS.map((camp) => {
    const entry: Record<string, string | number> = { campaign: camp.replace(' Sale', '').replace(' Year-End', '') };
    for (const p of platforms) {
      const r = CAMPAIGN_ROWS.find((x) => x.campaign === camp && x.platform === p)!;
      entry[p] = Number((r.revenue / r.spend).toFixed(2));
    }
    return entry;
  });

  return (
    <div className="grid gap-4">
      <DemoLabel>Interactive demonstration using illustrative data. Not actual company records. Revenue is platform-attributed and attribution rules differ by platform.</DemoLabel>

      <div className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <div className="seg flex-wrap !rounded-2xl" role="tablist" aria-label="Campaign">
          {CAMPAIGNS.map((camp) => (
            <button key={camp} type="button" role="tab" aria-selected={camp === campaign} onClick={() => setCampaign(camp)}>
              {camp}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Platforms">
          {PLATFORMS.map((p) => (
            <ToggleChip key={p} active={platforms.includes(p)} onClick={() => toggle(p)} color={colorOf(p)}>
              {p}
            </ToggleChip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Ad spend" value={fmtPesoCompact(totals.spend)} />
        <Kpi label="Attributed revenue" value={fmtPesoCompact(totals.revenue)} tone="accent" />
        <Kpi label="Blended ROAS" value={fmtRatio(totals.roas)} hint={best ? `Best: ${best.platform} ${fmtRatio(best.roas, 1)}` : undefined} />
        <Kpi label="Conversion rate" value={fmtPct(totals.cvr, 2)} hint={`${totals.orders.toLocaleString()} orders`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend vs attributed revenue" subtitle="by platform">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perPlatform} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={c.grid} />
                <XAxis dataKey="platform" tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tickFormatter={fmtPesoCompact} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={56} />
                <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(v) => fmtPeso(v)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: c.axis }} />
                <Bar dataKey="spend" name="Spend" fill={c.lavender} radius={[5, 5, 0, 0]} isAnimationActive={!reduced} />
                <Bar dataKey="revenue" name="Revenue" fill={c.rose} radius={[5, 5, 0, 0]} isAnimationActive={!reduced} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="ROAS by platform" subtitle="dashed line = blended ROAS">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perPlatform} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={c.grid} />
                <XAxis type="number" tickFormatter={(v) => `${v}×`} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="platform" tick={{ fill: c.axis, fontSize: 11 }} axisLine={false} tickLine={false} width={86} />
                <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(v) => fmtRatio(v)} />} />
                <ReferenceLine x={totals.roas} stroke={c.plum} strokeDasharray="4 4" />
                <Bar dataKey="roas" name="ROAS" radius={[0, 6, 6, 0]} isAnimationActive={!reduced}>
                  {perPlatform.map((p) => (
                    <Cell key={p.platform} fill={p.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Platform contribution" subtitle="share of attributed revenue">
          <div className="grid h-60 grid-cols-[1fr_auto] items-center gap-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={perPlatform} dataKey="revenue" nameKey="platform" innerRadius="58%" outerRadius="88%" paddingAngle={2} stroke="none" isAnimationActive={!reduced}>
                  {perPlatform.map((p) => (
                    <Cell key={p.platform} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip valueFormatter={(v) => `${fmtPeso(v)} · ${fmtPct((v / totals.revenue) * 100)}`} />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="grid gap-1.5 pr-2 text-xs">
              {perPlatform.map((p) => (
                <li key={p.platform} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                  <span className="text-muted">{p.platform}</span>
                  <span className="ml-auto pl-2 font-mono tabular-nums text-fg">{fmtPct((p.revenue / totals.revenue) * 100, 0)}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard title="Campaign comparison" subtitle="ROAS across campaigns, selected platforms">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparison} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={c.grid} />
                <XAxis dataKey="campaign" tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v}×`} tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip valueFormatter={(v) => fmtRatio(v)} />} />
                {platforms.map((p) => (
                  <Line key={p} type="monotone" dataKey={p} name={p} stroke={colorOf(p)} strokeWidth={2.2} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive={!reduced} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
