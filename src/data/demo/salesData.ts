/**
 * ILLUSTRATIVE DATA — fictional products and figures generated with a fixed
 * seed. Not actual company records.
 */
import { mulberry32, round } from '../../lib/random';

export const YEAR = 2025;
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export const CATEGORIES = ['Routers', 'Mesh Wi-Fi', 'Smart Home', 'Accessories'] as const;
export const MARKETPLACES = ['Shopee', 'Lazada', 'TikTok Shop'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Marketplace = (typeof MARKETPLACES)[number];

export type DemoProduct = { sku: string; name: string; category: Category; price: number; baseUnits: number };

export const DEMO_PRODUCTS: DemoProduct[] = [
  { sku: 'RT-210', name: 'Dual-Band Router 210', category: 'Routers', price: 1299, baseUnits: 120 },
  { sku: 'RT-300', name: 'Wi-Fi 6 Router 300', category: 'Routers', price: 2499, baseUnits: 85 },
  { sku: 'RT-550', name: 'Gaming Router 550', category: 'Routers', price: 5990, baseUnits: 22 },
  { sku: 'MS-2', name: 'Mesh Kit · 2-pack', category: 'Mesh Wi-Fi', price: 3990, baseUnits: 40 },
  { sku: 'MS-3', name: 'Mesh Kit · 3-pack', category: 'Mesh Wi-Fi', price: 5490, baseUnits: 26 },
  { sku: 'SH-CAM', name: 'Indoor Smart Camera', category: 'Smart Home', price: 1490, baseUnits: 110 },
  { sku: 'SH-PLG', name: 'Smart Plug · 2-pack', category: 'Smart Home', price: 899, baseUnits: 150 },
  { sku: 'SH-BLB', name: 'Smart Bulb Colour', category: 'Smart Home', price: 599, baseUnits: 130 },
  { sku: 'AC-USB', name: 'USB Wi-Fi Adapter', category: 'Accessories', price: 499, baseUnits: 180 },
  { sku: 'AC-EXT', name: 'Range Extender', category: 'Accessories', price: 1190, baseUnits: 95 },
  { sku: 'AC-SW5', name: '5-Port Switch', category: 'Accessories', price: 690, baseUnits: 100 },
];

/** Seasonality index — double-date campaigns lift Sep–Dec. */
const SEASON = [0.86, 0.8, 0.95, 0.9, 0.98, 1.05, 0.97, 1.0, 1.18, 1.22, 1.45, 1.38];
const MARKET_WEIGHT: Record<Marketplace, number> = { Shopee: 1.0, Lazada: 0.72, 'TikTok Shop': 0.38 };
/** TikTok Shop grows through the year in this fictional set. */
const MARKET_TREND: Record<Marketplace, number> = { Shopee: 0.006, Lazada: -0.004, 'TikTok Shop': 0.06 };

export type SalesRow = { month: number; sku: string; category: Category; marketplace: Marketplace; units: number; revenue: number };

function build(): SalesRow[] {
  const rand = mulberry32(20251111);
  const rows: SalesRow[] = [];
  MONTHS.forEach((_, m) => {
    for (const p of DEMO_PRODUCTS) {
      for (const mk of MARKETPLACES) {
        const noise = 0.85 + rand() * 0.3;
        const trend = 1 + MARKET_TREND[mk] * m;
        const units = Math.max(1, Math.round(p.baseUnits * SEASON[m] * MARKET_WEIGHT[mk] * trend * noise));
        const discount = 1 - (m >= 8 ? 0.06 : 0.02) - rand() * 0.03;
        rows.push({ month: m, sku: p.sku, category: p.category, marketplace: mk, units, revenue: round(units * p.price * discount) });
      }
    }
  });
  return rows;
}

export const SALES_ROWS = build();
export const productBySku: Record<string, DemoProduct> = Object.fromEntries(DEMO_PRODUCTS.map((p) => [p.sku, p]));
