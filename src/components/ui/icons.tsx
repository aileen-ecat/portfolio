/**
 * The site's icon set: Phosphor icons (https://phosphoricons.com), a modern,
 * rounded family. Components import icons from here instead of from the
 * library directly. The exported names are kept from the earlier icon set so
 * no component had to change; each one maps to the Phosphor icon noted.
 * There are deliberately no arrow icons: 'ArrowRight' and friends render
 * soft carets instead.
 */
import type { ComponentType } from 'react';
import {
  ArrowCounterClockwiseIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CalculatorIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CertificateIcon,
  ChartBarIcon,
  ChartLineUpIcon,
  CheckIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  CopyIcon,
  CursorClickIcon,
  DatabaseIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  FileTextIcon,
  FunnelIcon,
  GaugeIcon,
  GlobeIcon,
  GraduationCapIcon,
  HashIcon,
  ImageSquareIcon,
  InfoIcon,
  KeyReturnIcon,
  LightbulbIcon,
  ListChecksIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  MinusIcon,
  MoonIcon,
  PauseIcon,
  PencilSimpleLineIcon,
  PlayIcon,
  PlusIcon,
  PresentationChartIcon,
  PrinterIcon,
  QuotesIcon,
  ScalesIcon,
  ScanIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SparkleIcon,
  StorefrontIcon,
  SunIcon,
  TagIcon,
  WarningIcon,
  WrenchIcon,
  XIcon,
  XCircleIcon,
  type Icon as PhIcon,
  type IconWeight,
} from '@phosphor-icons/react';

export type IconProps = {
  size?: number | string;
  className?: string;
  /** Accepted for compatibility; Phosphor uses `weight` instead. */
  strokeWidth?: number | string;
  weight?: IconWeight;
  'aria-hidden'?: boolean | 'true' | 'false';
  style?: React.CSSProperties;
};

/** Any icon component that can be passed around (e.g. to a heading). */
export type LucideIcon = ComponentType<IconProps>;
export type AnyIcon = LucideIcon;

export function wrap(C: PhIcon, defaultWeight: IconWeight = 'regular'): LucideIcon {
  const I = ({ strokeWidth: _sw, weight, ...p }: IconProps) => <C weight={weight ?? defaultWeight} {...p} />;
  I.displayName = C.displayName;
  return I;
}

export const ArrowRight = wrap(CaretRightIcon);  // CaretRight
export const ArrowUpRight = wrap(CaretRightIcon);  // CaretRight
export const ArrowLeft = wrap(CaretLeftIcon);  // CaretLeft
export const ArrowUp = wrap(CaretUpIcon);  // CaretUp
export const ChevronDown = wrap(CaretDownIcon);  // CaretDown
export const ChevronRight = wrap(CaretRightIcon);  // CaretRight
export const RotateCcw = wrap(ArrowCounterClockwiseIcon);  // ArrowCounterClockwise
export const Play = wrap(PlayIcon);  // Play
export const CircleCheck = wrap(CheckCircleIcon);  // CheckCircle
export const X = wrap(XIcon);  // X
export const Search = wrap(MagnifyingGlassIcon);  // MagnifyingGlass
export const Mail = wrap(EnvelopeSimpleIcon);  // EnvelopeSimple
export const LoaderCircle = wrap(CircleNotchIcon);  // CircleNotch
export const TriangleExclamationPoint = wrap(WarningIcon);  // Warning
export const Sparkles = wrap(SparkleIcon);  // Sparkle
export const Plus = wrap(PlusIcon);  // Plus
export const PenLine = wrap(PencilSimpleLineIcon);  // PencilSimpleLine
export const Moon = wrap(MoonIcon);  // Moon
export const Lightbulb = wrap(LightbulbIcon);  // Lightbulb
export const Info = wrap(InfoIcon);  // Info
export const FileText = wrap(FileTextIcon);  // FileText
export const Copy = wrap(CopyIcon);  // Copy
export const Check = wrap(CheckIcon);  // Check
export const Briefcase = wrap(BriefcaseIcon);  // Briefcase
export const Wrench = wrap(WrenchIcon);  // Wrench
export const Sun = wrap(SunIcon);  // Sun
export const StepForward = wrap(SkipForwardIcon);  // SkipForward
export const StepBack = wrap(SkipBackIcon);  // SkipBack
export const ScanSearch = wrap(ScanIcon);  // Scan
export const Scale = wrap(ScalesIcon);  // Scales
export const Quote = wrap(QuotesIcon);  // Quotes
export const Printer = wrap(PrinterIcon);  // Printer
export const Pause = wrap(PauseIcon);  // Pause
export const MousePointerClick = wrap(CursorClickIcon);  // CursorClick
export const Minus = wrap(MinusIcon);  // Minus
export const MapPin = wrap(MapPinIcon);  // MapPin
export const Lock = wrap(LockIcon);  // Lock
export const ListChecks = wrap(ListChecksIcon);  // ListChecks
export const ImagePlus = wrap(ImageSquareIcon);  // ImageSquare
export const Hash = wrap(HashIcon);  // Hash
export const GraduationCap = wrap(GraduationCapIcon);  // GraduationCap
export const Gauge = wrap(GaugeIcon);  // Gauge
export const Filter = wrap(FunnelIcon);  // Funnel
export const Eye = wrap(EyeIcon);  // Eye
export const Download = wrap(DownloadSimpleIcon);  // DownloadSimple
export const Database = wrap(DatabaseIcon);  // Database
export const CornerDownLeft = wrap(KeyReturnIcon);  // KeyReturn
export const CircleX = wrap(XCircleIcon);  // XCircle
export const ChartArea = wrap(ChartLineUpIcon);  // ChartLineUp
export const Calculator = wrap(CalculatorIcon);  // Calculator
export const BookOpen = wrap(BookOpenIcon);  // BookOpen
export const BarChart3 = wrap(ChartBarIcon);  // ChartBar
export const Award = wrap(CertificateIcon);  // Certificate
export const Globe = wrap(GlobeIcon);  // Globe
export const PresentationChart = wrap(PresentationChartIcon);  // PresentationChart
export const Storefront = wrap(StorefrontIcon);  // Storefront
export const Tag = wrap(TagIcon);  // Tag
