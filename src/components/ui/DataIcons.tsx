/**
 * Named icons for navigation, section headings and services. All are
 * Phosphor duotone icons (a soft tinted fill plus a crisp outline).
 */
import {
  BookOpenTextIcon,
  CertificateIcon,
  ChartLineUpIcon,
  ChatCircleTextIcon,
  FolderOpenIcon,
  LightbulbIcon,
  LightningIcon,
  PathIcon,
  PresentationChartIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  StorefrontIcon,
  ToolboxIcon,
  TreeStructureIcon,
  UserCircleIcon,
} from '@phosphor-icons/react';
import { wrap } from './icons';

export type { AnyIcon, IconProps as GlyphProps } from './icons';

export const HomeGlyph = wrap(SquaresFourIcon, 'duotone');
export const FlowGlyph = wrap(TreeStructureIcon, 'duotone');
export const CaseGlyph = wrap(FolderOpenIcon, 'duotone');
export const PlayGlyph = wrap(SlidersHorizontalIcon, 'duotone');
export const CareerGlyph = wrap(PathIcon, 'duotone');
export const ToolkitGlyph = wrap(ToolboxIcon, 'duotone');
export const LearnGlyph = wrap(CertificateIcon, 'duotone');
export const ContactGlyph = wrap(ChatCircleTextIcon, 'duotone');
export const DashboardGlyph = wrap(PresentationChartIcon, 'duotone');
export const TrendGlyph = wrap(ChartLineUpIcon, 'duotone');
export const AutomateGlyph = wrap(LightningIcon, 'duotone');
export const BasketGlyph = wrap(StorefrontIcon, 'duotone');
export const InsightGlyph = wrap(LightbulbIcon, 'duotone');
export const PersonGlyph = wrap(UserCircleIcon, 'duotone');
export const StoryGlyph = wrap(BookOpenTextIcon, 'duotone');
