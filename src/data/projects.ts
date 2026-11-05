/**
 * Featured projects & case studies.
 *
 * Result `kind`:
 *  - 'verified'     → a fact from Aileen's verified work history
 *  - 'qualitative'  → a neutral description of the value, without a number
 *  - 'placeholder'  → a slot to fill in later with a confirmed outcome
 *
 * All demo data is fictional and anonymised. No proprietary data is used.
 */

export type DemoKey = 'sales' | 'pricing' | 'automation' | 'ecommerce' | 'sql' | 'monitoring';

export type ProjectResult = {
  kind: 'verified' | 'qualitative' | 'placeholder';
  label: string;
  note?: string;
};

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  tools: string[];
  /** Skill names (must match src/data/skills.ts) used for filtering. */
  skills: string[];
  context: string;
  summary: string;
  challenge: string;
  role: string;
  approach: string[];
  workflow: { label: string; detail: string }[];
  results: ProjectResult[];
  learnings: string[];
  demo: DemoKey;
  /** Extra sections specific to the project (e.g. data sources, model). */
  facets?: { title: string; body: string }[];
};

export const projects: Project[] = [
  {
    id: 'sales-intelligence',
    number: '01',
    title: 'Sales Intelligence Dashboard',
    category: 'Business Intelligence',
    tools: ['Power BI', 'Excel', 'Power Query', 'DAX'],
    skills: ['Power BI', 'DAX', 'Power Query', 'KPI Reporting', 'Data Modeling', 'Excel', 'Sales Performance', 'Trend Analysis'],
    context: 'A reporting environment covering 500+ SKUs.',
    summary: 'A Power BI reporting environment that turns recurring sales files into a single, filterable view of product and revenue performance.',
    challenge:
      'With a product range of more than 500 SKUs, sales information arrives in several files and formats. Answering simple questions — which products are growing, which categories are slipping — means stitching data together by hand each time.',
    role: 'I develop and maintain the Power BI dashboards: preparing the source data, building the model and measures, designing the report pages and keeping them current.',
    approach: [
      'Agree the core questions and KPIs the dashboard must answer.',
      'Standardise and clean recurring sales exports with Power Query.',
      'Map product names and variants to a consistent SKU and category list.',
      'Build a simple star-schema model with a calendar table.',
      'Write reusable DAX measures for revenue, units and growth.',
      'Design pages from summary to detail, with slicers for drill-down.',
    ],
    workflow: [
      { label: 'Sales exports', detail: 'Excel & order files' },
      { label: 'Power Query', detail: 'clean · map · append' },
      { label: 'Data model', detail: 'facts + dimensions' },
      { label: 'DAX measures', detail: 'revenue · growth' },
      { label: 'Dashboard', detail: 'summary to detail' },
    ],
    facets: [
      { title: 'Data sources', body: 'Recurring Excel sales reports and order exports, plus a product/SKU reference list.' },
      { title: 'Data preparation', body: 'Trimming and typing columns, standardising dates, removing duplicates and mapping listing names to SKUs.' },
      { title: 'Data model', body: 'A sales fact table related to product, category, channel and calendar dimensions.' },
      { title: 'Dashboard design', body: 'KPI cards first, then trend and category views, then a product table for detail — consistent filters on every page.' },
    ],
    results: [
      { kind: 'verified', label: 'Dashboards covering 500+ SKUs', note: 'Developed and maintained in my current role.' },
      { kind: 'qualitative', label: 'One consistent view of product performance', note: 'Replaces ad-hoc consolidation of separate files.' },
    ],
    learnings: [
      'Most dashboard quality is decided in the SKU mapping, long before the visuals.',
      'A few well-named measures beat many one-off calculations inside visuals.',
      'Designing from summary to detail keeps reports usable for different audiences.',
    ],
    demo: 'sales',
  },
  {
    id: 'pricing-margin',
    number: '02',
    title: 'Pricing & Margin Intelligence',
    category: 'Pricing Analytics',
    tools: ['Excel', 'Power BI', 'Validation logic'],
    skills: ['Pricing & Margin Analysis', 'Data Validation', 'Excel', 'Power BI', 'Data Cleaning'],
    context: 'Pricing and margin validation across 1,000+ partner accounts.',
    summary: 'Validation logic that checks reseller and partner pricing against authorized guidelines and surfaces the exceptions worth reviewing.',
    challenge:
      'Across more than 1,000 reseller and partner accounts, pricing and margin data must stay consistent with guidelines. Checking every line manually is slow, and discrepancies are easy to miss.',
    role: 'I validate pricing and margin data across reseller and partner accounts, monitor pricing compliance and identify discrepancies for follow-up.',
    approach: [
      'Use the authorized price list as the single reference table.',
      'Normalise prices to a comparable per-unit basis.',
      'Calculate absolute and percentage variance for every line.',
      'Apply a tolerance threshold so only meaningful gaps are flagged.',
      'Summarise compliance by partner and by product.',
    ],
    workflow: [
      { label: 'Price guidelines', detail: 'authorized prices' },
      { label: 'Partner pricing', detail: 'observed / submitted' },
      { label: 'Normalise', detail: 'per-unit net price' },
      { label: 'Variance logic', detail: 'abs · % · tolerance' },
      { label: 'Exceptions', detail: 'by partner & SKU' },
    ],
    results: [
      { kind: 'verified', label: 'Validation coverage across 1,000+ accounts', note: 'Reseller and partner pricing and margin data.' },
      { kind: 'verified', label: 'Discrepancies identified through compliance monitoring' },
      { kind: 'verified', label: 'Stable distributor margins across 1,000+ resellers and partners', note: 'Monthly margin calculations plus deal-margin vs revenue checks.' },
    ],
    learnings: [
      'A tolerance threshold turns a noisy list into a focused review queue.',
      'Normalising bundles and promos first prevents false exceptions.',
      'Compliance views work best when they lead to a clear next step.',
    ],
    demo: 'pricing',
  },
  {
    id: 'automated-reporting',
    number: '03',
    title: 'Automated Sales Reporting System',
    category: 'Workflow Automation',
    tools: ['Excel', 'VBA'],
    skills: ['VBA', 'Reporting Automation', 'Workflow Automation', 'Excel'],
    context: 'Automation of repetitive reporting and sales memo preparation.',
    summary: 'Excel VBA macros that consolidate recurring report inputs and generate formatted reports and sales memo drafts.',
    challenge:
      'Recurring reports and sales memos followed the same manual steps every cycle — copying data between workbooks, reformatting, recalculating and typing memo details — which consumed time and invited errors.',
    role: 'I automated recurring reports and sales memos with Excel VBA, reducing the manual work by approximately 60%.',
    approach: [
      'Document each manual step and where the inputs come from.',
      'Standardise templates and input layouts so they can be automated.',
      'Write VBA routines to consolidate, validate and format data.',
      'Generate memo drafts from the template with the latest figures.',
      'Keep a human review step before anything is shared.',
    ],
    workflow: [
      { label: 'Input files', detail: 'standard templates' },
      { label: 'Consolidate', detail: 'VBA loops' },
      { label: 'Validate', detail: 'checks & totals' },
      { label: 'Format & build', detail: 'report + memo' },
      { label: 'Review', detail: 'before sharing' },
    ],
    results: [
      { kind: 'verified', label: '~60% reduction in manual work', note: 'Approximate, for the automated recurring reports and memos.' },
      { kind: 'qualitative', label: 'More consistent formatting and fewer copy-paste steps' },
      { kind: 'verified', label: 'Faster turnaround for sales communications', note: 'Recurring reports and memos generated with Excel VBA.' },
    ],
    learnings: [
      'Automation starts with standardising the inputs, not with code.',
      'Small, single-purpose macros are easier to maintain than one giant routine.',
      'Keeping a review step builds trust in automated output.',
    ],
    demo: 'automation',
  },
  {
    id: 'ecommerce-performance',
    number: '04',
    title: 'E-commerce Performance Intelligence',
    category: 'Marketing Analytics',
    tools: ['Shopee', 'Lazada', 'TikTok Shop', 'Meta Ads', 'Google Ads', 'Excel', 'Power BI'],
    skills: ['ROAS Analysis', 'CVR Analysis', 'E-commerce Analytics', 'Shopee', 'Lazada', 'TikTok Shop', 'Meta Ads', 'Google Ads', 'Sales Performance'],
    context: 'Performance analysis across Shopee, Lazada, TikTok, Meta and Google.',
    summary: 'Cross-platform analysis of advertising spend, attributed revenue, ROAS and conversion to compare campaign efficiency.',
    challenge:
      'Each marketplace and ad platform reports performance differently. Without aligned definitions, it is hard to see which channels and campaigns are actually efficient.',
    role: 'I analyse e-commerce and paid-advertising performance across Shopee, Lazada, TikTok, Meta and Google — evaluating ROAS, conversion rates, campaign efficiency and sales trends — and produce monthly analyses with recommendations.',
    approach: [
      'Collect exports from each marketplace and ad platform.',
      'Align periods, campaign names and currency.',
      'Calculate ROAS, CVR and cost metrics on the same definitions.',
      'Compare platforms and campaigns side by side.',
      'Summarise findings and recommendations monthly.',
    ],
    workflow: [
      { label: 'Platform exports', detail: '5 sources' },
      { label: 'Align', detail: 'dates · names · PHP' },
      { label: 'KPIs', detail: 'ROAS · CVR · CPA' },
      { label: 'Compare', detail: 'platform × campaign' },
      { label: 'Recommend', detail: 'monthly analysis' },
    ],
    results: [
      { kind: 'verified', label: 'Supported campaigns reaching up to 2× GMV growth', note: 'A team result during major e-commerce campaigns.' },
      { kind: 'verified', label: 'Monthly performance analyses and recommendations' },
      { kind: 'verified', label: '₱40M+ monthly revenue from managed campaigns', note: 'Across Meta, Google, TikTok, Shopee and Lazada.' },
      { kind: 'verified', label: '15% conversion improvement on under-performing SKUs', note: 'SKUs below 5% CVR, after pricing, creative or targeting changes.' },
    ],
    learnings: [
      'ROAS without conversion and order context can be misleading.',
      'Aligning campaign naming across platforms saves hours each month.',
      'Attribution differs by platform — comparisons need clear caveats.',
    ],
    demo: 'ecommerce',
  },
  {
    id: 'sql-analysis',
    number: '05',
    title: 'SQL Sales Analysis',
    category: 'Data Analysis',
    tools: ['SQL', 'Excel', 'SQLite'],
    skills: ['SQL Fundamentals', 'Trend Analysis', 'Excel', 'Sales Performance'],
    context: 'A demonstrative SQL analysis on a fictional order dataset.',
    summary: 'A runnable SQL workspace showing SELECT, JOIN and GROUP BY analysis of revenue by SKU, monthly trends and partner segments.',
    challenge:
      'Spreadsheet analysis becomes slow and fragile as order data grows. SQL makes filtering, joining and aggregating repeatable and transparent.',
    role: 'This is a learning and demonstration project building on my SQL fundamentals training. The queries are demonstrative examples, not production queries.',
    approach: [
      'Model a small fictional dataset: orders, products and partners.',
      'Explore it with SELECT and filtering.',
      'JOIN tables to add product and partner context.',
      'Aggregate with GROUP BY for revenue by SKU and month.',
      'Segment partners by revenue contribution.',
    ],
    workflow: [
      { label: 'Tables', detail: 'orders · products · partners' },
      { label: 'SELECT', detail: 'explore' },
      { label: 'JOIN', detail: 'enrich' },
      { label: 'GROUP BY', detail: 'aggregate' },
      { label: 'Insight', detail: 'trend & segments' },
    ],
    results: [
      { kind: 'qualitative', label: 'Runnable SQL examples in the browser', note: 'Powered by SQLite compiled to WebAssembly.' },
      { kind: 'qualitative', label: 'Demonstrates SQL fundamentals applied to sales questions' },
    ],
    learnings: [
      'Writing the business question as a comment first keeps queries focused.',
      'GROUP BY + JOIN covers a surprising share of everyday sales questions.',
      'Checking row counts after each JOIN catches duplication early.',
    ],
    demo: 'sql',
  },
  {
    id: 'price-monitoring',
    number: '06',
    title: 'Online Pricing Monitoring',
    category: 'Pricing Intelligence & Automation',
    tools: ['Excel', 'Web monitoring', 'Reporting automation'],
    skills: ['Web Monitoring', 'Pricing & Margin Analysis', 'Reporting Automation', 'Data Validation', 'Shopee', 'Lazada'],
    context: 'Comparing observed online prices to pricing guidelines.',
    summary: 'A monitoring workflow that collects observed online prices, matches products, compares them to guidelines and prepares an exception report for review.',
    challenge:
      'Online selling prices change often and appear under many listing names. Spotting deviations from pricing guidelines requires consistent collection, matching and comparison.',
    role: 'I conduct pricing compliance monitoring and identify discrepancies. Exception reports are reviewed before any communication is sent — nothing is sent automatically.',
    approach: [
      'Collect observed prices for monitored products.',
      'Match listings to the correct SKU.',
      'Compare against the pricing guideline with a tolerance.',
      'Flag discrepancies and prepare an exception report.',
      'Review the report before any communication.',
    ],
    workflow: [
      { label: 'Collect', detail: 'observed prices' },
      { label: 'Match', detail: 'listing to SKU' },
      { label: 'Compare', detail: 'vs guideline' },
      { label: 'Flag', detail: 'outside tolerance' },
      { label: 'Report', detail: 'exception list' },
      { label: 'Review', detail: 'human check' },
    ],
    results: [
      { kind: 'verified', label: 'Pricing compliance monitoring with discrepancy identification' },
      { kind: 'qualitative', label: 'A review-first workflow — no automatic external messages' },
      { kind: 'verified', label: 'Daily pricing audits across all online resellers', note: 'Run with a custom-built web crawler.' },
    ],
    learnings: [
      'Listing-to-SKU matching is the hardest — and most important — step.',
      'A human review gate keeps partner communication accurate and fair.',
      'Consistent snapshots make trends in compliance visible over time.',
    ],
    demo: 'monitoring',
  },
];

export const projectCategories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
