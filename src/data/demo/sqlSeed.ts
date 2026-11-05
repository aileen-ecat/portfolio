/**
 * ILLUSTRATIVE DATA for the in-browser SQLite demo. Fictional and anonymised.
 * The queries below are demonstrative examples, not production queries.
 */
import { mulberry32 } from '../../lib/random';
import { DEMO_PRODUCTS } from './salesData';

const SEGMENTS = ['Key Account', 'Regional Reseller', 'Online Seller'] as const;
const REGIONS = ['NCR', 'Luzon', 'Visayas', 'Mindanao'] as const;

function buildSeed(): string {
  const rand = mulberry32(777);
  const lines: string[] = [
    'CREATE TABLE products (sku TEXT PRIMARY KEY, product_name TEXT, category TEXT, list_price REAL);',
    'CREATE TABLE partners (partner_id TEXT PRIMARY KEY, partner_name TEXT, segment TEXT, region TEXT);',
    'CREATE TABLE orders (order_id INTEGER PRIMARY KEY, order_date TEXT, partner_id TEXT, sku TEXT, qty INTEGER, unit_price REAL);',
  ];
  for (const p of DEMO_PRODUCTS) {
    lines.push(`INSERT INTO products VALUES ('${p.sku}', '${p.name.replace(/'/g, "''")}', '${p.category}', ${p.price});`);
  }
  const partners = Array.from({ length: 10 }, (_, i) => ({
    id: `P${String(i + 1).padStart(2, '0')}`,
    segment: SEGMENTS[i < 2 ? 0 : i < 6 ? 1 : 2],
    region: REGIONS[i % 4],
  }));
  for (const pt of partners) {
    lines.push(`INSERT INTO partners VALUES ('${pt.id}', 'Partner ${pt.id.slice(1)}', '${pt.segment}', '${pt.region}');`);
  }
  let id = 10001;
  for (let m = 1; m <= 6; m++) {
    const count = 14 + Math.floor(rand() * 8) + (m >= 5 ? 6 : 0);
    for (let k = 0; k < count; k++) {
      const day = 1 + Math.floor(rand() * 28);
      // Key accounts order more often and in larger quantities.
      const r = rand();
      const pt = partners[r < 0.35 ? Math.floor(rand() * 2) : 2 + Math.floor(rand() * 8)];
      const product = DEMO_PRODUCTS[Math.floor(rand() * DEMO_PRODUCTS.length)];
      const qty = (pt.segment === 'Key Account' ? 8 : pt.segment === 'Regional Reseller' ? 4 : 1) + Math.floor(rand() * 6);
      const price = Math.round(product.price * (0.9 + rand() * 0.08));
      const date = `2025-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      lines.push(`INSERT INTO orders VALUES (${id++}, '${date}', '${pt.id}', '${product.sku}', ${qty}, ${price});`);
    }
  }
  return lines.join('\n');
}

export const SQL_SEED = buildSeed();

export type PresetQuery = { id: string; label: string; concept: string; question: string; sql: string };

export const PRESET_QUERIES: PresetQuery[] = [
  {
    id: 'select',
    label: 'SELECT',
    concept: 'Explore raw rows',
    question: 'What do the latest orders look like?',
    sql: `-- Latest 10 orders with line revenue
SELECT order_id,
       order_date,
       sku,
       qty,
       unit_price,
       qty * unit_price AS line_revenue
FROM orders
ORDER BY order_date DESC
LIMIT 10;`,
  },
  {
    id: 'join',
    label: 'JOIN',
    concept: 'Enrich with context',
    question: 'Which partner bought which product?',
    sql: `-- Add product and partner context to each order
SELECT o.order_id,
       o.order_date,
       pa.partner_name,
       pa.segment,
       pr.product_name,
       o.qty
FROM orders o
JOIN products pr ON pr.sku = o.sku
JOIN partners pa ON pa.partner_id = o.partner_id
ORDER BY o.order_date DESC
LIMIT 12;`,
  },
  {
    id: 'sku',
    label: 'Revenue by SKU',
    concept: 'GROUP BY',
    question: 'Which SKUs generate the most revenue?',
    sql: `-- Revenue and units by SKU
SELECT pr.sku,
       pr.product_name,
       SUM(o.qty) AS units,
       ROUND(SUM(o.qty * o.unit_price), 0) AS revenue
FROM orders o
JOIN products pr ON pr.sku = o.sku
GROUP BY pr.sku, pr.product_name
ORDER BY revenue DESC;`,
  },
  {
    id: 'monthly',
    label: 'Monthly trend',
    concept: 'Dates + aggregation',
    question: 'How is revenue trending month to month?',
    sql: `-- Monthly revenue trend
SELECT strftime('%Y-%m', order_date) AS month,
       COUNT(*) AS orders,
       ROUND(SUM(qty * unit_price), 0) AS revenue
FROM orders
GROUP BY month
ORDER BY month;`,
  },
  {
    id: 'segment',
    label: 'Segmentation',
    concept: 'CASE + GROUP BY',
    question: 'How do partner segments compare?',
    sql: `-- Partner segments: revenue, orders and average order value
SELECT pa.segment,
       COUNT(DISTINCT pa.partner_id) AS partners,
       COUNT(*) AS orders,
       ROUND(SUM(o.qty * o.unit_price), 0) AS revenue,
       ROUND(SUM(o.qty * o.unit_price) / COUNT(*), 0) AS avg_order_value,
       CASE
         WHEN SUM(o.qty * o.unit_price) > 1000000 THEN 'Tier 1'
         WHEN SUM(o.qty * o.unit_price) > 400000 THEN 'Tier 2'
         ELSE 'Tier 3'
       END AS tier
FROM orders o
JOIN partners pa ON pa.partner_id = o.partner_id
GROUP BY pa.segment
ORDER BY revenue DESC;`,
  },
];
