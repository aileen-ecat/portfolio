/**
 * Core profile content. Edit this file to update the hero, contact details,
 * impact metrics and about copy — no component changes needed.
 */

export const profile = {
  name: 'Aileen Grace Ecat',
  firstName: 'Aileen',
  initials: 'AG',
  role: 'Data Analytics & BI Professional',
  positioning: ['Data Analytics', 'Business Intelligence', 'Reporting Automation', 'E-commerce Analytics'],
  location: 'Philippines',
  email: 'aileen.ecat@outlook.com',
  linkedin: 'https://www.linkedin.com/in/aileengraceecat/',
  /** Shown as a button in the Contact section. */
  company: { name: 'Vantelyra', url: 'https://vantelyra.com/' },
  /** Path inside /public. Replace the file to change the portrait. */
  portrait: 'images/portrait.jpg',
  hero: {
    status: 'Data Analytics & BI Professional',
    headline: 'Turning Data Into Decisions.',
    /** Word(s) from the headline rendered in the italic accent style. */
    accentWord: 'Decisions.',
    subheadline: 'Business Intelligence, Analytics & Automation.',
    intro:
      "Hi, I'm Aileen. I transform complex sales, pricing, and e-commerce data into meaningful insights, intelligent dashboards, and automated workflows that help businesses make smarter decisions.",
  },
  summary:
    'A data analytics and business intelligence professional with experience in sales performance, pricing analysis, marketing analytics, e-commerce operations, dashboard development, and process automation. Experienced in translating complex operational and commercial datasets into clear business insights and decision-support tools.',
  technicalStrengths: [
    'Power BI',
    'Excel',
    'VBA automation',
    'SQL fundamentals',
    'Data validation',
    'KPI reporting',
    'Multi-platform performance analysis',
  ],
  about: {
    title: 'Beyond the Dashboard',
    paragraphs: [
      "I've always been curious about what numbers can tell us. My career began in operations and e-commerce, where I saw firsthand how better reporting, cleaner data, and thoughtful analysis can change the way decisions are made.",
      'Today, I combine business understanding with analytics and automation to make information more useful, accessible, and actionable.',
    ],
    principles: [
      {
        title: 'Start with the business question',
        body: 'A dashboard is only useful if it answers something a team actually needs to decide.',
      },
      {
        title: 'Trust is built in the preparation',
        body: 'Clean, validated, consistently mapped data is what makes a number worth acting on.',
      },
      {
        title: 'Automate the repeatable',
        body: 'Time saved on manual reporting is time returned to analysis and follow-through.',
      },
    ],
  },
  contact: {
    title: "Let's Make Data Meaningful.",
    subtitle:
      "Have a question, an opportunity, or an interesting analytics challenge? I'd love to hear about it.",
  },
};

export type Metric = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  /** Format the counter with thousands separators. */
  grouped?: boolean;
  label: string;
  detail: string;
};

/** Verified impact metrics. Wording is deliberately precise about scope. */
export const heroMetrics: Metric[] = [
  {
    id: 'skus',
    value: 500,
    suffix: '+',
    label: 'SKUs monitored',
    detail: 'through the Power BI dashboards I develop and maintain',
  },
  {
    id: 'accounts',
    value: 1000,
    suffix: '+',
    grouped: true,
    label: 'Partner accounts',
    detail: 'covered by my pricing & margin data validation',
  },
  {
    id: 'automation',
    value: 60,
    prefix: '~',
    suffix: '%',
    label: 'Less manual reporting',
    detail: 'approximate reduction from Excel VBA report automation',
  },
  {
    id: 'gmv',
    value: 2,
    prefix: 'Up to ',
    suffix: '×',
    label: 'GMV growth supported',
    detail: 'in major e-commerce campaigns I supported as part of the team',
  },
];

export const metricsFootnote =
  'Scope of work at TP-Link Philippines (2023 – present). Campaign growth reflects team results that I supported through analysis and reporting.';
