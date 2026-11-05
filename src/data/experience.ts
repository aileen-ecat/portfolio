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
    summary:
      'Promoted to Specialist II, owning Lazada listings, SKU data, pricing accuracy and daily order fulfilment for the Toys"R"Us online store.',
    responsibilities: [
      { text: 'Managed and updated product listings on Lazada, keeping content and availability accurate.' },
      { text: 'Maintained and configured SKUs: data encoding, system updates and product categorisation.' },
      { text: 'Ensured pricing accuracy and consistency across all Lazada product listings.' },
      { text: 'Processed daily orders and coordinated fulfilment to meet shipping deadlines.' },
      { text: 'Provided operational support for warehouse management and day-to-day logistics.' },
    ],
    accomplishments: [
      { text: 'Promoted from E-commerce Specialist I in August 2022.' },
      { text: 'Completed Excel, SQL & Power BI for Data Analytics (Refocus Digital Academy, February 2023).' },
    ],
    tools: [
      { text: 'Lazada Seller Center' },
      { text: 'Excel' },
      { text: 'Order management' },
    ],
  },
  {
    id: 'trus-ecom1',
    company: 'Robinsons Retail Holdings, Inc.',
    brand: 'Toys"R"Us',
    title: 'E-commerce Specialist I',
    start: '2019-07',
    end: '2022-08',
    phaseIds: ['ecom'],
    summary:
      'Moved from central administration into e-commerce, supporting customers, listings and order dispatch for the Toys"R"Us online store.',
    responsibilities: [
      { text: 'Handled customer inquiries via Lazada chat, resolving product, service and delivery issues promptly.' },
      { text: 'Onboarded new products to Lazada with complete, optimised listings.' },
      { text: 'Supported the processing, packing and coordination of online orders for fast dispatch.' },
    ],
    accomplishments: [
      { text: 'Three years of hands-on marketplace operations, leading to promotion to Specialist II.' },
    ],
    tools: [
      { text: 'Lazada Seller Center' },
      { text: 'Lazada chat' },
      { text: 'Order management' },
    ],
  },
  {
    id: 'trus-admin',
    company: 'Robinsons Retail Holdings, Inc.',
    brand: 'Toys"R"Us',
    title: 'Central Admin Staff',
    start: '2018-08',
    end: '2019-08',
    phaseIds: ['admin'],
    summary:
      'Started in central administration, keeping store documents and tax compliance in order: the operational foundation for the move into e-commerce.',
    responsibilities: [
      { text: 'Oversaw the flow and filing of internal documents across store operations.' },
      { text: 'Prepared, compiled and submitted BIR requirements for in-store tax compliance.' },
      { text: 'Assisted in printing and organising financial books and ledgers for annual BIR audits.' },
    ],
    accomplishments: [
      { text: 'Completed Microsoft Excel Training (Robinsons Retail Holdings, May 2019).' },
      { text: 'Moved into the e-commerce team in July 2019.' },
    ],
    tools: [
      { text: 'Excel' },
      { text: 'Document management' },
    ],
  },
];
