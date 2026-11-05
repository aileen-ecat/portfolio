/**
 * Representative workflow architectures based on Aileen's experience.
 * These are conceptual diagrams — not verified production infrastructure.
 */

export type StageId = 'sources' | 'ingestion' | 'preparation' | 'modeling' | 'reporting' | 'decisions';

export type Stage = {
  id: StageId;
  index: string;
  label: string;
  description: string;
  /** CSS colour variable used for the stage accent. */
  color: string;
};

export const stages: Stage[] = [
  { id: 'sources', index: '01', label: 'Data Sources', description: 'Where raw business data originates.', color: 'var(--lavender)' },
  { id: 'ingestion', index: '02', label: 'Ingestion', description: 'How data is brought into the workspace.', color: 'var(--mauve)' },
  { id: 'preparation', index: '03', label: 'Preparation', description: 'Cleaning, mapping and validating.', color: 'var(--rose)' },
  { id: 'modeling', index: '04', label: 'Modeling & Analytics', description: 'Turning tables into measures.', color: 'var(--plum-node)' },
  { id: 'reporting', index: '05', label: 'Reporting & Automation', description: 'Delivering the insight.', color: 'var(--gold)' },
  { id: 'decisions', index: '06', label: 'Business Decisions', description: 'What the business does with it.', color: 'var(--rose-ink)' },
];

export type ArchNode = {
  id: string;
  stage: StageId;
  label: string;
  /** Short mono tag shown under the label. */
  tag: string;
  description: string;
  tools: string[];
  example: { before: string; after: string };
};

const n = (node: ArchNode) => node;

export const archNodes: Record<string, ArchNode> = Object.fromEntries(
  [
    // ── Sources
    n({ id: 'src-excel', stage: 'sources', label: 'Excel sales reports', tag: '.xlsx', description: 'Periodic sales workbooks with units, revenue and product lines — often with inconsistent layouts between periods.', tools: ['Excel'], example: { before: 'Sales_Oct_FINAL_v3.xlsx', after: '12 sheets · mixed headers' } }),
    n({ id: 'src-erp', stage: 'sources', label: 'ERP / order exports', tag: 'export', description: 'System order exports used as the transactional backbone for sales reporting.', tools: ['ERP export', 'CSV'], example: { before: 'orders_2025-10.csv', after: '~ order-level rows' } }),
    n({ id: 'src-shopee', stage: 'sources', label: 'Shopee Seller Center', tag: 'marketplace', description: 'Marketplace order, traffic and ads performance reports.', tools: ['Shopee'], example: { before: 'Shop stats export', after: 'GMV · orders · visitors' } }),
    n({ id: 'src-lazada', stage: 'sources', label: 'Lazada Seller Center', tag: 'marketplace', description: 'Marketplace sales, campaign and sponsored-solutions reports.', tools: ['Lazada'], example: { before: 'Business advisor export', after: 'revenue · CVR · traffic' } }),
    n({ id: 'src-tiktok', stage: 'sources', label: 'TikTok Shop', tag: 'social commerce', description: 'Shop orders and live/short-video commerce performance data.', tools: ['TikTok Shop'], example: { before: 'Shop analytics export', after: 'GMV · content sales' } }),
    n({ id: 'src-meta', stage: 'sources', label: 'Meta Ads', tag: 'paid social', description: 'Campaign spend, reach, clicks and attributed conversions from Meta.', tools: ['Meta Ads Manager'], example: { before: 'Ads report (daily)', after: 'spend · clicks · purchases' } }),
    n({ id: 'src-google', stage: 'sources', label: 'Google Ads', tag: 'search · PMax', description: 'Search and Performance Max campaign results.', tools: ['Google Ads'], example: { before: 'Campaign report', after: 'cost · conv. value' } }),
    n({ id: 'src-pricing', stage: 'sources', label: 'Reseller pricing files', tag: 'price lists', description: 'Authorized price lists and partner pricing guidelines used as the reference for validation.', tools: ['Excel'], example: { before: 'Price_Guideline_Q4.xlsx', after: 'SKU matched to authorized price' } }),

    // ── Ingestion
    n({ id: 'in-excel', stage: 'ingestion', label: 'Excel imports', tag: 'workbook', description: 'Structured import of workbook ranges into a consistent working table.', tools: ['Excel', 'VBA'], example: { before: 'Ranges across 12 sheets', after: '1 consolidated table' } }),
    n({ id: 'in-csv', stage: 'ingestion', label: 'CSV files', tag: '.csv', description: 'Flat-file exports from platforms and systems, loaded with consistent delimiters and encodings.', tools: ['CSV', 'Power Query'], example: { before: 'Mixed encodings', after: 'UTF-8, typed columns' } }),
    n({ id: 'in-pq', stage: 'ingestion', label: 'Power Query', tag: 'M · refreshable', description: 'Repeatable, refreshable queries that load and shape source files the same way every time.', tools: ['Power Query'], example: { before: 'Manual copy-paste', after: 'One-click refresh' } }),
    n({ id: 'in-sql', stage: 'ingestion', label: 'SQL imports', tag: 'SELECT …', description: 'Pulling structured tables with SQL for filtering and joining at the source.', tools: ['SQL'], example: { before: 'Full table dump', after: 'Filtered, joined extract' } }),
    n({ id: 'in-web', stage: 'ingestion', label: 'Web monitoring', tag: 'observed prices', description: 'Collecting publicly listed online selling prices for monitored products.', tools: ['Web monitoring', 'Excel'], example: { before: 'Listing pages', after: 'SKU · seller · observed price' } }),

    // ── Preparation
    n({ id: 'prep-clean', stage: 'preparation', label: 'Data cleaning', tag: 'trim · fix · type', description: 'Removing blanks, fixing text-as-numbers, trimming whitespace and standardising labels.', tools: ['Power Query', 'Excel'], example: { before: '" 1,299.00 " (text)', after: '1299.00 (number)' } }),
    n({ id: 'prep-dedup', stage: 'preparation', label: 'Deduplication', tag: 'unique keys', description: 'Removing duplicate rows created by overlapping exports or repeated uploads.', tools: ['Power Query', 'SQL'], example: { before: '2 × order #10482', after: '1 × order #10482' } }),
    n({ id: 'prep-sku', stage: 'preparation', label: 'Product / SKU mapping', tag: 'SKU master', description: 'Matching platform listing names and model variants to a single SKU master.', tools: ['Excel lookups', 'Power Query'], example: { before: '"WiFi Router AX 3000 Dual"', after: 'SKU RT-300' } }),
    n({ id: 'prep-valid', stage: 'preparation', label: 'Data validation', tag: 'rules · checks', description: 'Rule checks for missing values, impossible figures and mismatches against reference data.', tools: ['Excel', 'Validation logic'], example: { before: 'margin = 140%', after: 'flagged for review' } }),
    n({ id: 'prep-price', stage: 'preparation', label: 'Pricing normalization', tag: 'net · per unit', description: 'Converting bundle, promo and gross prices into a comparable per-unit net price.', tools: ['Excel'], example: { before: '2-pack ₱2,598 promo', after: '₱1,299 / unit' } }),
    n({ id: 'prep-date', stage: 'preparation', label: 'Date standardization', tag: 'YYYY-MM-DD', description: 'Aligning date formats and time zones so periods line up across platforms.', tools: ['Power Query'], example: { before: '10/11/25 · 11-Oct', after: '2025-10-11' } }),

    // ── Modeling
    n({ id: 'mod-sql', stage: 'modeling', label: 'SQL queries', tag: 'GROUP BY', description: 'Aggregations and joins that summarise transactions by SKU, month and partner.', tools: ['SQL'], example: { before: 'order lines', after: 'revenue by SKU × month' } }),
    n({ id: 'mod-model', stage: 'modeling', label: 'Power BI data model', tag: 'star schema', description: 'Fact and dimension tables (sales, products, calendar, channels) with clean relationships.', tools: ['Power BI'], example: { before: 'flat sheets', after: 'facts + dimensions' } }),
    n({ id: 'mod-dax', stage: 'modeling', label: 'DAX measures', tag: 'CALCULATE()', description: 'Reusable measures for revenue, growth, margin and time intelligence.', tools: ['DAX'], example: { before: 'SUM in every visual', after: '[Revenue MoM %]' } }),
    n({ id: 'mod-kpi', stage: 'modeling', label: 'KPI calculations', tag: 'ROAS · CVR · var%', description: 'Business KPIs such as ROAS, conversion rate, margin and price variance.', tools: ['Excel', 'DAX'], example: { before: 'spend, revenue', after: 'ROAS 6.2×' } }),
    n({ id: 'mod-analysis', stage: 'modeling', label: 'Sales & marketing analysis', tag: 'trends · mix', description: 'Trend, contribution and efficiency analysis that explains what changed and why.', tools: ['Excel', 'Power BI'], example: { before: 'KPIs by platform', after: 'insight + recommendation' } }),

    // ── Reporting
    n({ id: 'rep-pbi', stage: 'reporting', label: 'Power BI dashboards', tag: 'interactive', description: 'Self-serve dashboards with slicers for category, period and channel.', tools: ['Power BI'], example: { before: 'static tables', after: 'filterable dashboard' } }),
    n({ id: 'rep-vba', stage: 'reporting', label: 'Excel / VBA reports', tag: 'macro', description: 'Formatted recurring reports produced by macros instead of manual steps.', tools: ['Excel VBA'], example: { before: 'manual formatting', after: 'one-click report' } }),
    n({ id: 'rep-memo', stage: 'reporting', label: 'Automated sales memos', tag: 'template', description: 'Sales memos assembled from templates and data, ready for review before sending.', tools: ['Excel VBA'], example: { before: 'typed per memo', after: 'generated draft' } }),
    n({ id: 'rep-exception', stage: 'reporting', label: 'Pricing exception reports', tag: 'flags only', description: 'A focused list of listings or accounts that fall outside pricing guidelines.', tools: ['Excel'], example: { before: '1,000+ rows', after: 'only the exceptions' } }),
    n({ id: 'rep-campaign', stage: 'reporting', label: 'Campaign reporting', tag: 'pre / during / post', description: 'Campaign performance packs comparing platforms, spend and results.', tools: ['Excel', 'Power BI'], example: { before: '5 platform exports', after: '1 campaign view' } }),

    // ── Decisions
    n({ id: 'dec-revenue', stage: 'decisions', label: 'Revenue tracking', tag: 'targets', description: 'Monitoring revenue against targets and spotting gaps early.', tools: [], example: { before: 'end-of-month surprise', after: 'early visibility' } }),
    n({ id: 'dec-compliance', stage: 'decisions', label: 'Pricing compliance', tag: 'guidelines', description: 'Reviewing exceptions so the right follow-up can happen with partners.', tools: [], example: { before: 'unknown deviations', after: 'reviewed exception list' } }),
    n({ id: 'dec-budget', stage: 'decisions', label: 'Marketing budget optimization', tag: 'allocation', description: 'Shifting spend toward the channels and campaigns that convert efficiently.', tools: [], example: { before: 'even split', after: 'ROAS-informed split' } }),
    n({ id: 'dec-product', stage: 'decisions', label: 'Product performance analysis', tag: 'mix', description: 'Understanding which products drive volume, revenue and margin.', tools: [], example: { before: 'gut feel', after: 'ranked contribution' } }),
    n({ id: 'dec-ops', stage: 'decisions', label: 'Operational efficiency', tag: 'time saved', description: 'Less time on manual preparation, more time on analysis and follow-up.', tools: [], example: { before: 'hours of copy-paste', after: 'time for analysis' } }),
  ].map((node) => [node.id, node]),
);

export type TraceStep = { stage: StageId; title: string; record: string };

export type ArchView = {
  id: 'powerbi' | 'ecommerce' | 'pricing';
  label: string;
  description: string;
  nodes: string[];
  edges: [string, string][];
  trace: TraceStep[];
};

export const archViews: ArchView[] = [
  {
    id: 'powerbi',
    label: 'Power BI Reporting Pipeline',
    description: 'From scattered sales workbooks and order exports to a refreshable Power BI model covering a 500+ SKU range.',
    nodes: ['src-excel', 'src-erp', 'in-excel', 'in-csv', 'in-pq', 'in-sql', 'prep-clean', 'prep-dedup', 'prep-sku', 'prep-date', 'mod-sql', 'mod-model', 'mod-dax', 'mod-kpi', 'rep-pbi', 'rep-vba', 'rep-memo', 'dec-revenue', 'dec-product', 'dec-ops'],
    edges: [
      ['src-excel', 'in-excel'], ['src-excel', 'in-pq'], ['src-erp', 'in-csv'], ['src-erp', 'in-sql'],
      ['in-excel', 'prep-clean'], ['in-csv', 'prep-clean'], ['in-pq', 'prep-sku'], ['in-pq', 'prep-dedup'], ['in-sql', 'prep-dedup'], ['in-sql', 'prep-date'],
      ['prep-clean', 'mod-model'], ['prep-dedup', 'mod-sql'], ['prep-sku', 'mod-model'], ['prep-date', 'mod-dax'], ['prep-dedup', 'mod-model'],
      ['mod-model', 'rep-pbi'], ['mod-dax', 'rep-pbi'], ['mod-kpi', 'rep-pbi'], ['mod-sql', 'rep-vba'], ['mod-kpi', 'rep-memo'], ['prep-clean', 'mod-kpi'],
      ['rep-pbi', 'dec-revenue'], ['rep-pbi', 'dec-product'], ['rep-vba', 'dec-ops'], ['rep-memo', 'dec-revenue'], ['rep-memo', 'dec-ops'],
    ],
    trace: [
      { stage: 'sources', title: 'Raw export row', record: 'Order# 10482 | 11-Oct | "WiFi Router AX 3000 Dual " | qty "2" | amt "2,598.00"' },
      { stage: 'ingestion', title: 'Loaded by Power Query', record: '{ order: 10482, date: "11-Oct", item: "WiFi Router AX 3000 Dual ", qty: "2", amount: "2,598.00" }' },
      { stage: 'preparation', title: 'Cleaned & mapped', record: '{ order: 10482, date: 2025-10-11, sku: "RT-300", qty: 2, amount: 2598.00 }' },
      { stage: 'modeling', title: 'Modeled as a measure', record: 'FactSales[RT-300, 2025-10]: [Revenue] = ₱2,598 · [Units] = 2' },
      { stage: 'reporting', title: 'Surfaced in a dashboard', record: 'Routers ▸ RT-300 ▸ Oct revenue ₱2.6K (+12% MoM)' },
      { stage: 'decisions', title: 'Informs a decision', record: 'RT-300 trending up, so review stock cover before 11.11' },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce Performance Analytics',
    description: 'Aligning marketplace and paid-media exports so ROAS, CVR and campaign efficiency can be compared like-for-like.',
    nodes: ['src-shopee', 'src-lazada', 'src-tiktok', 'src-meta', 'src-google', 'in-csv', 'in-excel', 'in-pq', 'prep-clean', 'prep-sku', 'prep-date', 'prep-valid', 'mod-kpi', 'mod-analysis', 'mod-model', 'rep-campaign', 'rep-pbi', 'dec-budget', 'dec-product', 'dec-revenue'],
    edges: [
      ['src-shopee', 'in-csv'], ['src-lazada', 'in-csv'], ['src-tiktok', 'in-excel'], ['src-meta', 'in-pq'], ['src-google', 'in-pq'],
      ['in-csv', 'prep-clean'], ['in-csv', 'prep-sku'], ['in-excel', 'prep-clean'], ['in-pq', 'prep-date'], ['in-pq', 'prep-valid'],
      ['prep-clean', 'mod-kpi'], ['prep-sku', 'mod-model'], ['prep-date', 'mod-model'], ['prep-valid', 'mod-kpi'], ['prep-sku', 'mod-analysis'],
      ['mod-kpi', 'rep-campaign'], ['mod-analysis', 'rep-campaign'], ['mod-model', 'rep-pbi'], ['mod-kpi', 'rep-pbi'],
      ['rep-campaign', 'dec-budget'], ['rep-campaign', 'dec-revenue'], ['rep-pbi', 'dec-product'], ['rep-pbi', 'dec-budget'],
    ],
    trace: [
      { stage: 'sources', title: 'Platform exports', record: 'Meta: spend 18,400 · purchases 96   |   Shopee: GMV 142,300 · visitors 9,870' },
      { stage: 'ingestion', title: 'Loaded side by side', record: '[meta_ads, shopee_stats, lazada_stats, tiktok_shop, google_ads] loaded as 5 tables' },
      { stage: 'preparation', title: 'Aligned definitions', record: 'date as ISO week · campaign names as "11.11 Mega Sale" · currency in PHP' },
      { stage: 'modeling', title: 'KPIs calculated', record: 'ROAS = revenue ÷ spend · CVR = orders ÷ clicks · per platform & campaign' },
      { stage: 'reporting', title: 'Campaign view', record: '11.11 ▸ Shopee ROAS 7.4× · Meta ROAS 3.1× · TikTok CVR 2.9%' },
      { stage: 'decisions', title: 'Budget conversation', record: 'Consider shifting spend toward higher-ROAS placements for 12.12' },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing Monitoring & Reporting Automation',
    description: 'Comparing observed selling prices against authorized guidelines, then preparing an exception report for human review.',
    nodes: ['src-pricing', 'src-erp', 'src-shopee', 'src-lazada', 'in-web', 'in-excel', 'in-sql', 'prep-sku', 'prep-price', 'prep-valid', 'mod-sql', 'mod-kpi', 'rep-exception', 'rep-vba', 'rep-memo', 'dec-compliance', 'dec-ops'],
    edges: [
      ['src-pricing', 'in-excel'], ['src-erp', 'in-sql'], ['src-shopee', 'in-web'], ['src-lazada', 'in-web'],
      ['in-web', 'prep-sku'], ['in-web', 'prep-price'], ['in-excel', 'prep-valid'], ['in-sql', 'prep-valid'],
      ['prep-sku', 'mod-kpi'], ['prep-price', 'mod-kpi'], ['prep-valid', 'mod-sql'], ['prep-valid', 'mod-kpi'],
      ['mod-kpi', 'rep-exception'], ['mod-sql', 'rep-vba'], ['mod-kpi', 'rep-memo'],
      ['rep-exception', 'dec-compliance'], ['rep-vba', 'dec-ops'], ['rep-memo', 'dec-compliance'],
    ],
    trace: [
      { stage: 'sources', title: 'Guideline + listing', record: 'Guideline: RT-300 authorized ₱1,299   |   Listing: "AX3000 Router 2pcs" ₱2,398' },
      { stage: 'ingestion', title: 'Observed price captured', record: '{ seller: "Partner 07", listing: "AX3000 Router 2pcs", price: 2398 }' },
      { stage: 'preparation', title: 'Matched & normalised', record: '{ sku: "RT-300", unit_price: 1199.00, authorized: 1299.00 }' },
      { stage: 'modeling', title: 'Variance calculated', record: 'variance = 1199 − 1299 = −₱100 · −7.7% (tolerance ±3%)' },
      { stage: 'reporting', title: 'Exception listed', record: 'EXCEPTION ▸ Partner 07 · RT-300 · −7.7% below authorized' },
      { stage: 'decisions', title: 'Reviewed by a person', record: 'Analyst verifies listing; follow-up decided by the team (no auto-send)' },
    ],
  },
];
