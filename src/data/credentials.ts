/**
 * Education & training. `badgeImage` is the logo shown on each card (official
 * product marks in /public/badges/). Swap in a photo of the actual certificate
 * the same way if you'd like.
 * `verifyUrl` is optional — only add one you can actually link to.
 */

export type Credential = {
  id: string;
  kind: 'education' | 'training';
  title: string;
  issuer: string;
  date?: string;
  description: string;
  topics: string[];
  badgeImage?: string;
  verifyUrl?: string;
};

export const education: Credential = {
  id: 'pup',
  kind: 'education',
  title: 'Bachelor of Arts in English',
  issuer: 'Polytechnic University of the Philippines',
  date: 'Graduated May 2018',
  description: 'A foundation in language and communication — useful every time a number needs to become a clear story.',
  topics: ['Communication', 'Writing', 'Critical reading'],
};

export const trainings: Credential[] = [
  {
    id: 'refocus',
    kind: 'training',
    title: 'Excel, SQL & Power BI for Data Analytics',
    issuer: 'Refocus Digital Academy',
    description: 'Training in the core analytics toolkit: spreadsheet analysis, SQL querying and Power BI reporting.',
    topics: ['Excel', 'SQL', 'Power BI'],
    badgeImage: 'badges/power-bi.svg',
  },
  {
    id: 'google-ads',
    kind: 'training',
    title: 'Google Ads & Performance Max',
    issuer: 'Google Ads training',
    description: 'Training on Google Ads campaigns and Performance Max.',
    topics: ['Google Ads', 'Performance Max'],
    badgeImage: 'badges/google-ads.svg',
  },
  {
    id: 'meta',
    kind: 'training',
    title: 'Campaign & Reels Ads Optimization',
    issuer: 'Meta Blueprint',
    description: 'Training on Meta campaign setup and Reels ads optimization.',
    topics: ['Meta Ads', 'Reels Ads'],
    badgeImage: 'badges/meta.svg',
  },
];
