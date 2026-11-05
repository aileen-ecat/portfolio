/**
 * ILLUSTRATIVE DATA — fictional products, anonymised partner labels and
 * invented prices. Not actual company pricing or reseller information.
 */
import { mulberry32 } from '../../lib/random';

export type PricedProduct = { sku: string; name: string; authorized: number; unitCost: number };

export const PRICED_PRODUCTS: PricedProduct[] = [
  { sku: 'RT-210', name: 'Dual-Band Router 210', authorized: 1299, unitCost: 980 },
  { sku: 'RT-300', name: 'Wi-Fi 6 Router 300', authorized: 2499, unitCost: 1890 },
  { sku: 'MS-2', name: 'Mesh Kit · 2-pack', authorized: 3990, unitCost: 3020 },
  { sku: 'SH-CAM', name: 'Indoor Smart Camera', authorized: 1490, unitCost: 1080 },
  { sku: 'AC-EXT', name: 'Range Extender', authorized: 1190, unitCost: 860 },
];

export type Partner = { id: string; name: string; channel: 'Marketplace' | 'Retail' | 'Online store' };

const CHANNELS = ['Marketplace', 'Retail', 'Online store'] as const;

export const PARTNERS: Partner[] = Array.from({ length: 12 }, (_, i) => ({
  id: `P${String(i + 1).padStart(2, '0')}`,
  name: `Partner ${String(i + 1).padStart(2, '0')}`,
  channel: CHANNELS[i % 3],
}));

export type ObservedPrice = { partnerId: string; sku: string; observed: number };

function build(): ObservedPrice[] {
  const rand = mulberry32(4242);
  const out: ObservedPrice[] = [];
  for (const p of PRICED_PRODUCTS) {
    for (const partner of PARTNERS) {
      const r = rand();
      // Most partners sit near the authorized price; a few deviate.
      let factor = 1 + (rand() - 0.5) * 0.03;
      if (r < 0.14) factor = 0.88 + rand() * 0.07; // clear under-pricing
      else if (r < 0.22) factor = 0.955 + rand() * 0.02; // borderline
      else if (r < 0.28) factor = 1.04 + rand() * 0.06; // above
      const observed = Math.round((p.authorized * factor) / 10) * 10 - 1;
      out.push({ partnerId: partner.id, sku: p.sku, observed });
    }
  }
  return out;
}

export const OBSERVED_PRICES = build();

/** Observed online listings used by the monitoring workflow demo. */
export type Listing = { id: string; seller: string; title: string; price: number; pack: number };

export const LISTINGS: Listing[] = [
  { id: 'L-101', seller: 'Partner 02', title: 'Dual Band Router 210 (Official)', price: 1299, pack: 1 },
  { id: 'L-102', seller: 'Partner 07', title: 'WiFi6 Router 300 BIG SALE', price: 2199, pack: 1 },
  { id: 'L-103', seller: 'Partner 04', title: 'Mesh Kit 2pcs Whole Home', price: 3990, pack: 1 },
  { id: 'L-104', seller: 'Partner 11', title: 'Smart Camera Indoor 2-Pack', price: 2580, pack: 2 },
  { id: 'L-105', seller: 'Partner 05', title: 'Range Extender Wi-Fi Booster', price: 1190, pack: 1 },
  { id: 'L-106', seller: 'Partner 09', title: 'Router 210 dual band', price: 1249, pack: 1 },
  { id: 'L-107', seller: 'Partner 03', title: 'Wi-Fi 6 Router 300 x2 units', price: 4998, pack: 2 },
  { id: 'L-108', seller: 'Partner 12', title: 'Mesh 2-pack (open box)', price: 3290, pack: 1 },
  { id: 'L-109', seller: 'Partner 06', title: 'Wireless Keyboard K2', price: 899, pack: 1 },
];

/** Keyword rules used to match a listing title to a SKU (deliberately simple). */
export const MATCH_RULES: { sku: string; keywords: string[] }[] = [
  { sku: 'RT-300', keywords: ['300'] },
  { sku: 'RT-210', keywords: ['210'] },
  { sku: 'MS-2', keywords: ['mesh'] },
  { sku: 'SH-CAM', keywords: ['camera'] },
  { sku: 'AC-EXT', keywords: ['extender'] },
];
