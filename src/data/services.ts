import type { IconName } from '../components/ui/Icon';

export type Service = {
  id: string;
  number: string;
  title: string;
  icon: IconName;
  summary: string;
  tools: string[];
  workflow: string[];
  examples: string[];
  /** Project ids to link from the expanded card. */
  projects: string[];
};

export const services: Service[] = [
  {
    id: 'bi',
    number: '01',
    title: 'Business Intelligence',
    icon: 'dashboard',
    summary: 'Power BI reporting, KPI dashboards, performance monitoring, and data storytelling.',
    tools: ['Power BI', 'DAX', 'Power Query', 'Excel'],
    workflow: ['Define the KPIs', 'Model the data', 'Design the views', 'Monitor & refine'],
    examples: [
      'Sales dashboards covering a 500+ SKU product range',
      'KPI views for revenue, units and product performance',
      'Monthly performance summaries for management review',
    ],
    projects: ['sales-intelligence'],
  },
  {
    id: 'analytics',
    number: '02',
    title: 'Data Analytics',
    icon: 'chartLine',
    summary: 'Sales trends, pricing and margin analysis, marketing performance, and SQL-based analysis.',
    tools: ['Excel', 'SQL', 'Power BI', 'Pivot analysis'],
    workflow: ['Frame the question', 'Clean & validate', 'Analyse trends', 'Recommend actions'],
    examples: [
      'Pricing and margin validation across 1,000+ partner accounts',
      'Month-over-month sales trend analysis',
      'SQL aggregation of orders by SKU, month and segment',
    ],
    projects: ['pricing-margin', 'sql-analysis'],
  },
  {
    id: 'automation',
    number: '03',
    title: 'Reporting Automation',
    icon: 'workflow',
    summary: 'Excel VBA, repeatable data preparation, web monitoring, and workflow automation.',
    tools: ['Excel VBA', 'Power Query', 'Templates', 'Web monitoring'],
    workflow: ['Map the manual steps', 'Standardise inputs', 'Automate with VBA', 'Review the output'],
    examples: [
      'Recurring reports and sales memos generated with VBA (~60% less manual work)',
      'Repeatable data-prep routines for monthly reporting',
      'Online price monitoring feeding exception reports',
    ],
    projects: ['automated-reporting', 'price-monitoring'],
  },
  {
    id: 'ecommerce',
    number: '04',
    title: 'E-commerce Intelligence',
    icon: 'shoppingBag',
    summary: 'Lazada, Shopee, TikTok Shop, Meta Ads, Google Ads, ROAS and CVR analysis.',
    tools: ['Shopee', 'Lazada', 'TikTok Shop', 'Meta Ads', 'Google Ads'],
    workflow: ['Collect platform data', 'Align metrics', 'Compare ROAS & CVR', 'Advise on budget'],
    examples: [
      'Cross-platform ROAS, conversion and campaign efficiency reviews',
      'Support for major campaigns that reached up to 2× GMV growth',
      'Monthly performance analyses with recommendations',
    ],
    projects: ['ecommerce-performance'],
  },
];
