/**
 * Verified employment history. Items marked `placeholder: true` are slots
 * to fill in later — they render with a dashed "to be added" style.
 */

export type Phase = { id: string; label: string; years: string };

export const phases: Phase[] = [
  { id: 'admin', label: 'Administrative Operations', years: '2018 – 2019' },
  { id: 'ecom', label: 'E-commerce Operations', years: '2019 – 2023' },
  { id: 'commercial', label: 'Commercial Analytics', years: '2023 – now' },
  { id: 'bi', label: 'BI & Automation', years: 'Now' },
];

export type Item = { text: string; placeholder?: boolean };

export type Role = {
  id: string;
  company: string;
  brand?: string;
  title: string;
  /** ISO month: YYYY-MM */
  start: string;
  end: string | 'present';
  /** Index range into `phases` this role represents. */
  phaseIds: string[];
  summary: string;
  responsibilities: Item[];
  accomplishments: Item[];
  tools: Item[];
};

export const roles: Role[] = [
  {
    id: 'tplink',
    company: 'TP-Link Philippines Ltd. Corporation',
    title: 'Sales Administration Officer',
    start: '2023-03',
    end: 'present',
    phaseIds: ['commercial', 'bi'],
    summary:
      'Commercial analytics, business intelligence and reporting automation for sales, pricing and e-commerce performance.',
    responsibilities: [
      { text: 'Develop and maintain Power BI dashboards covering over 500 SKUs.' },
      { text: 'Validate pricing and margin data across more than 1,000 reseller and partner accounts.' },
      { text: 'Automate recurring reports and sales memos with Excel VBA.' },
      { text: 'Conduct pricing compliance monitoring and identify discrepancies.' },
      { text: 'Analyze e-commerce and paid advertising performance across Shopee, Lazada, TikTok, Meta and Google.' },
      { text: 'Evaluate ROAS, conversion rates, campaign efficiency and sales trends.' },
      { text: 'Produce monthly performance analyses and recommendations.' },
    ],
    accomplishments: [
      { text: '~60% reduction in manual reporting work through VBA automation.' },
      { text: 'Supported major e-commerce campaigns that achieved up to 2× GMV growth.' },
      { text: 'Reporting coverage across a 500+ SKU product range.' },
    ],
    tools: [
      { text: 'Power BI' }, { text: 'Excel' }, { text: 'VBA' }, { text: 'Shopee' }, { text: 'Lazada' },
      { text: 'TikTok Shop' }, { text: 'Meta Ads' }, { text: 'Google Ads' },
    ],
  },
  {
    id: 'trus-ecom2',
    company: 'Robinsons Retail Holdings, Inc.',
    brand: 'Toys"R"Us',
    title: 'E-commerce Specialist II',
    start: '2022-08',
    end: '2023-02',
    phaseIds: ['ecom'],
    summary: 'Promoted to Specialist II, continuing to support the e-commerce operations of the Toys"R"Us business.',
    responsibilities: [
      { text: 'Add key responsibilities for this role in src/data/experience.ts', placeholder: true },
    ],
    accomplishments: [{ text: 'Add a confirmed accomplishment', placeholder: true }],
    tools: [{ text: 'Add tools used', placeholder: true }],
  },
  {
    id: 'trus-ecom1',
    company: 'Robinsons Retail Holdings, Inc.',
    brand: 'Toys"R"Us',
    title: 'E-commerce Specialist I',
    start: '2019-07',
    end: '2022-08',
    phaseIds: ['ecom'],
    summary: 'Moved from central administration into e-commerce, supporting the online retail operations of the Toys"R"Us business.',
    responsibilities: [
      { text: 'Add key responsibilities for this role in src/data/experience.ts', placeholder: true },
    ],
    accomplishments: [{ text: 'Add a confirmed accomplishment', placeholder: true }],
    tools: [{ text: 'Add tools used', placeholder: true }],
  },
  {
    id: 'trus-admin',
    company: 'Robinsons Retail Holdings, Inc.',
    brand: 'Toys"R"Us',
    title: 'Central Admin Staff',
    start: '2018-08',
    end: '2019-08',
    phaseIds: ['admin'],
    summary: 'Started in central administration — the operational foundation for the move into e-commerce.',
    responsibilities: [
      { text: 'Add key responsibilities for this role in src/data/experience.ts', placeholder: true },
    ],
    accomplishments: [],
    tools: [{ text: 'Add tools used', placeholder: true }],
  },
];
