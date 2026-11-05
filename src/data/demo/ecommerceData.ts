/**
 * ILLUSTRATIVE DATA — fictional campaign results. Not actual company records.
 */
import { mulberry32 } from '../../lib/random';

export const PLATFORMS = ['Shopee', 'Lazada', 'TikTok Shop', 'Meta Ads', 'Google Ads'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const CAMPAIGNS = ['Payday Sale', '9.9 Super Sale', '11.11 Mega Sale', '12.12 Year-End'] as const;
export type Campaign = (typeof CAMPAIGNS)[number];

export type CampaignRow = { campaign: Campaign; platform: Platform; spend: number; revenue: number; clicks: number; orders: number };

const BASE: Record<Platform, { spend: number; roas: number; cvr: number; aov: number }> = {
  Shopee: { spend: 42000, roas: 7.2, cvr: 3.1, aov: 1850 },
  Lazada: { spend: 31000, roas: 5.6, cvr: 2.6, aov: 1990 },
  'TikTok Shop': { spend: 24000, roas: 4.8, cvr: 2.2, aov: 1350 },
  'Meta Ads': { spend: 28000, roas: 3.2, cvr: 1.4, aov: 2100 },
  'Google Ads': { spend: 19000, roas: 4.1, cvr: 1.9, aov: 2350 },
};
const LIFT: Record<Campaign, number> = { 'Payday Sale': 0.7, '9.9 Super Sale': 1.0, '11.11 Mega Sale': 1.55, '12.12 Year-End': 1.35 };

const to100 = (v: number) => Math.round(v / 100) * 100;

function build(): CampaignRow[] {
  const rand = mulberry32(1111);
  const rows: CampaignRow[] = [];
  for (const c of CAMPAIGNS) {
    for (const p of PLATFORMS) {
      const b = BASE[p];
      const spend = to100(b.spend * LIFT[c] * (0.9 + rand() * 0.2));
      const roas = b.roas * (0.85 + rand() * 0.3) * (c === '11.11 Mega Sale' ? 1.12 : 1);
      const revenue = to100(spend * roas);
      const orders = Math.round(revenue / (b.aov * (0.92 + rand() * 0.16)));
      const clicks = Math.round(orders / ((b.cvr * (0.85 + rand() * 0.3)) / 100));
      rows.push({ campaign: c, platform: p, spend, revenue, clicks, orders });
    }
  }
  return rows;
}

export const CAMPAIGN_ROWS = build();
