/**
 * Skills & toolkit. Levels are self-assessed groupings, not scores:
 *  - core:       used regularly in day-to-day work
 *  - working:    applied in real work, still deepening
 *  - developing: currently building through training and practice
 * Adjust levels freely — no percentages or ratings are shown anywhere.
 */

export type SkillLevel = 'core' | 'working' | 'developing';

export const levelMeta: Record<SkillLevel, { label: string; description: string }> = {
  core: { label: 'Core competency', description: 'Used regularly in day-to-day work.' },
  working: { label: 'Working knowledge', description: 'Applied in real work; still deepening.' },
  developing: { label: 'Currently developing', description: 'Building through training and practice.' },
};

export type Skill = {
  name: string;
  level: SkillLevel;
  useCase: string;
  experience: string;
};

export type SkillCategory = { id: string; label: string; skills: Skill[] };

const TPL = 'TP-Link Philippines · 2023 – present';

export const skillCategories: SkillCategory[] = [
  {
    id: 'bi',
    label: 'Business Intelligence',
    skills: [
      { name: 'Power BI', level: 'core', useCase: 'Building and maintaining sales dashboards for a 500+ SKU range.', experience: TPL },
      { name: 'DAX', level: 'working', useCase: 'Measures for revenue, growth and KPI calculations.', experience: `${TPL} · Refocus Digital Academy training` },
      { name: 'Power Query', level: 'working', useCase: 'Repeatable cleaning and shaping of recurring source files.', experience: `${TPL} · Refocus Digital Academy training` },
      { name: 'KPI Reporting', level: 'core', useCase: 'Monthly performance summaries and KPI views.', experience: TPL },
      { name: 'Data Modeling', level: 'working', useCase: 'Fact and dimension tables with a calendar for time analysis.', experience: TPL },
    ],
  },
  {
    id: 'analysis',
    label: 'Data Analysis',
    skills: [
      { name: 'Excel', level: 'core', useCase: 'Analysis, validation, lookups and reporting across every workflow.', experience: `${TPL} · Robinsons Retail Holdings` },
      { name: 'SQL Fundamentals', level: 'developing', useCase: 'SELECT, JOIN and GROUP BY for sales aggregation.', experience: 'Refocus Digital Academy — Excel, SQL & Power BI' },
      { name: 'Data Cleaning', level: 'core', useCase: 'Fixing types, blanks, duplicates and inconsistent labels.', experience: TPL },
      { name: 'Data Validation', level: 'core', useCase: 'Pricing and margin checks across 1,000+ partner accounts.', experience: TPL },
      { name: 'Trend Analysis', level: 'core', useCase: 'Sales trends and month-over-month performance.', experience: TPL },
    ],
  },
  {
    id: 'automation',
    label: 'Automation',
    skills: [
      { name: 'VBA', level: 'core', useCase: 'Macros for recurring reports and sales memos (~60% less manual work).', experience: TPL },
      { name: 'Reporting Automation', level: 'core', useCase: 'Turning repeat reporting cycles into one-click routines.', experience: TPL },
      { name: 'Workflow Automation', level: 'working', useCase: 'Standardising inputs and steps so processes can be automated.', experience: TPL },
      { name: 'Web Monitoring', level: 'working', useCase: 'Collecting observed online prices for compliance checks.', experience: TPL },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial & Marketing Analytics',
    skills: [
      { name: 'ROAS Analysis', level: 'core', useCase: 'Comparing return on ad spend across platforms and campaigns.', experience: `${TPL} · Google Ads & Meta Blueprint training` },
      { name: 'CVR Analysis', level: 'core', useCase: 'Conversion-rate comparisons by platform and campaign.', experience: TPL },
      { name: 'Sales Performance', level: 'core', useCase: 'Revenue, units and product performance tracking.', experience: TPL },
      { name: 'Pricing & Margin Analysis', level: 'core', useCase: 'Variance and margin checks against pricing guidelines.', experience: TPL },
      { name: 'E-commerce Analytics', level: 'core', useCase: 'Marketplace and campaign performance analysis.', experience: `${TPL} · Robinsons Retail Holdings (e-commerce)` },
    ],
  },
  {
    id: 'platforms',
    label: 'Platforms',
    skills: [
      { name: 'Shopee', level: 'core', useCase: 'Marketplace sales and ads performance analysis.', experience: TPL },
      { name: 'Lazada', level: 'core', useCase: 'Marketplace sales and campaign performance analysis.', experience: TPL },
      { name: 'TikTok Shop', level: 'working', useCase: 'Social-commerce performance analysis.', experience: TPL },
      { name: 'Meta Ads', level: 'working', useCase: 'Campaign and Reels ads performance review.', experience: `${TPL} · Meta Blueprint training` },
      { name: 'Google Ads', level: 'working', useCase: 'Search and Performance Max results review.', experience: `${TPL} · Google Ads & PMax training` },
    ],
  },
];

export const allSkills = skillCategories.flatMap((c) => c.skills.map((s) => ({ ...s, category: c.label })));
