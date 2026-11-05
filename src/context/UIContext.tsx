import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '../hooks';
import { isView, navigation, type ViewId } from '../data/navigation';

const viewFromHash = (): ViewId => {
  const h = typeof window === 'undefined' ? '' : decodeURIComponent(window.location.hash.slice(1));
  return isView(h) ? h : 'overview';
};

type Theme = 'light' | 'dark';

type UIValue = {
  view: ViewId;
  theme: Theme;
  toggleTheme: () => void;
  activeProjectId: string | null;
  openProject: (id: string) => void;
  closeProject: () => void;
  skillFilter: string | null;
  setSkillFilter: (skill: string | null) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (message: string) => void;
  scrollToSection: (id: string) => void;
};

const UIContext = createContext<UIValue | null>(null);

const THEME_KEY = 'age-theme';

export function UIProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', theme === 'dark' ? '#161117' : '#FAF8F6'));
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* storage unavailable — theme still applies for this visit */
      }
      return next;
    });
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const [view, setView] = useState<ViewId>(() => viewFromHash());

  useEffect(() => {
    const onHash = () => {
      const next = viewFromHash();
      setView((cur) => {
        if (cur !== next) window.scrollTo({ top: 0 });
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const item = navigation.find((n) => n.id === view);
    if (item) document.title = item.title;
  }, [view]);

  /** Go to a view (e.g. "projects") or scroll to an element inside the current view. */
  const scrollToSection = useCallback((id: string) => {
    if (isView(id)) {
      if (window.location.hash !== `#${id}`) window.location.hash = id;
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, []);

  const value = useMemo<UIValue>(
    () => ({
      view,
      theme,
      toggleTheme,
      activeProjectId,
      openProject: setActiveProjectId,
      closeProject: () => setActiveProjectId(null),
      skillFilter,
      setSkillFilter,
      paletteOpen,
      setPaletteOpen,
      toast,
      notify,
      scrollToSection,
    }),
    [view, theme, toggleTheme, activeProjectId, skillFilter, paletteOpen, toast, notify, scrollToSection],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside <UIProvider>');
  return ctx;
}

/** Hex colours for charts (SVG chart libraries need concrete values). */
const CHART = {
  light: { rose: '#C98FA7', roseInk: '#9A5573', mauve: '#8F7189', lavender: '#A99BC9', gold: '#C4A265', plum: '#5B4560', sage: '#7FA58F', grid: '#EEE4E9', axis: '#8A818B', alert: '#B4475A', ok: '#4B7A61', surface: '#FFFFFF' },
  dark: { rose: '#E2A9C0', roseInk: '#ECBCCF', mauve: '#C2A5BB', lavender: '#BCAFDD', gold: '#D9BA7F', plum: '#9C80A0', sage: '#8CC4A6', grid: '#372C3A', axis: '#A99EA8', alert: '#F0909F', ok: '#8CC4A6', surface: '#231B25' },
};

export type ChartColors = typeof CHART.light;

export function useChartColors(): ChartColors {
  const { theme } = useUI();
  return CHART[theme];
}

export function seriesColors(c: ChartColors) {
  return [c.rose, c.mauve, c.lavender, c.gold, c.plum, c.sage];
}
