import { archViews } from './architecture';
import { projects } from './projects';
import { trainings } from './credentials';

export type ViewId = 'overview' | 'architecture' | 'projects' | 'playground' | 'experience' | 'skills' | 'certifications' | 'contact';

export type IconKey = 'overview' | 'architecture' | 'projects' | 'playground' | 'experience' | 'skills' | 'certifications' | 'contact';

export type NavItem = {
  id: ViewId;
  label: string;
  /** Short label for the mobile tab bar. */
  short: string;
  icon: IconKey;
  /** Optional count badge shown in the sidebar. */
  count?: number;
  /** Browser tab title for this view. */
  title: string;
};

/**
 * The site is organised as views: one is shown at a time and selected from
 * the tab strip under the masthead. Each view has its own URL hash.
 */
export const navigation: NavItem[] = [
  { id: 'overview', label: 'Home', short: 'Home', icon: 'overview', title: 'Aileen Grace Ecat — Data Analytics, BI & Automation' },
  { id: 'architecture', label: 'Data Flows', short: 'Flows', icon: 'architecture', count: archViews.length, title: 'Data Flows · Aileen Grace Ecat' },
  { id: 'projects', label: 'Case Studies', short: 'Cases', icon: 'projects', count: projects.length, title: 'Case Studies · Aileen Grace Ecat' },
  { id: 'playground', label: 'Playground', short: 'Play', icon: 'playground', count: 3, title: 'Data Playground · Aileen Grace Ecat' },
  { id: 'experience', label: 'Career', short: 'Career', icon: 'experience', title: 'Experience · Aileen Grace Ecat' },
  { id: 'skills', label: 'Toolkit', short: 'Toolkit', icon: 'skills', title: 'Skills · Aileen Grace Ecat' },
  { id: 'certifications', label: 'Learning', short: 'Learning', icon: 'certifications', count: trainings.length + 1, title: 'Certifications & Education · Aileen Grace Ecat' },
  { id: 'contact', label: 'Contact', short: 'Contact', icon: 'contact', title: 'Contact · Aileen Grace Ecat' },
];

export const viewIds = navigation.map((n) => n.id);
export const isView = (id: string): id is ViewId => (viewIds as string[]).includes(id);
