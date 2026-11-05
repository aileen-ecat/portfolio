import { useEffect, useRef } from 'react';
import { Moon, Search, Sun } from '../ui/icons';
import { CareerGlyph, CaseGlyph, ContactGlyph, FlowGlyph, HomeGlyph, LearnGlyph, PlayGlyph, ToolkitGlyph, type AnyIcon } from '../ui/DataIcons';
import { navigation, type IconKey } from '../../data/navigation';
import { profile } from '../../data/profile';
import { useUI } from '../../context/UIContext';
import { cx } from '../ui/primitives';

export const NAV_ICONS: Record<IconKey, AnyIcon> = {
  overview: HomeGlyph,
  architecture: FlowGlyph,
  projects: CaseGlyph,
  playground: PlayGlyph,
  experience: CareerGlyph,
  skills: ToolkitGlyph,
  certifications: LearnGlyph,
  contact: ContactGlyph,
};

const isMac = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useUI();
  const dark = theme === 'dark';
  return (
    <button type="button" onClick={toggleTheme} className={cx('icon-btn', className)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>
      <span className="relative block h-[17px] w-[17px]">
        <Sun size={17} className={cx('absolute inset-0 transition-all duration-500', dark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100')} aria-hidden="true" />
        <Moon size={17} className={cx('absolute inset-0 transition-all duration-500', dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0')} aria-hidden="true" />
      </span>
    </button>
  );
}

/**
 * Masthead: name and expertise on the left, quick actions on the right, and a
 * strip of report-style page tabs underneath (like the page tabs of a BI
 * report). Sticky on every screen size; the tabs scroll sideways on phones.
 */
export function Masthead() {
  const { view, setPaletteOpen } = useUI();
  const ref = useRef<HTMLElement>(null);
  // Share the masthead's height so the hero can fill exactly one screen below it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty('--masthead-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <header ref={ref} className="no-print sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 pt-3 sm:px-6 lg:px-8">
        <a href="#overview" className="min-w-0 py-1 leading-tight" aria-label="Go to home">
          <span className="block truncate font-serif text-[1.35rem] text-fg sm:text-[1.85rem]">{profile.name}</span>
          <span className="mt-1 block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted sm:text-[11px]">Data · BI · Automation · {profile.location}</span>
        </a>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-full border border-line bg-surface py-2 pl-3 pr-2 text-sm text-muted transition-colors hover:border-rose hover:text-fg md:inline-flex"
          >
            <Search size={14} aria-hidden="true" /> Find anything
            <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px]">{isMac() ? '⌘F' : 'Ctrl F'}</kbd>
          </button>
          <button type="button" onClick={() => setPaletteOpen(true)} className="icon-btn md:hidden" aria-label="Open quick search">
            <Search size={16} aria-hidden="true" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      <nav aria-label="Sections" className="mx-auto mt-2 max-w-[1240px] px-2 sm:px-4 lg:px-6">
        <ul className="scrollbar-none -mb-px flex gap-1 overflow-x-auto">
          {navigation.map((n) => {
            const I = NAV_ICONS[n.icon];
            const on = n.id === view;
            return (
              <li key={n.id} className="shrink-0">
                <a
                  href={`#${n.id}`}
                  aria-current={on ? 'page' : undefined}
                  className={cx(
                    'group relative flex items-center gap-2 rounded-t-xl border border-b-0 px-3.5 pb-2.5 pt-2 text-[13px] transition-colors duration-300',
                    on ? 'border-line bg-surface font-semibold text-fg' : 'border-transparent text-muted hover:bg-surface/60 hover:text-fg',
                  )}
                >
                  {on && <span className="absolute inset-x-2 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-rose-ink to-gold" aria-hidden="true" />}
                  <I size={17} className={cx('shrink-0 transition-colors', on ? 'text-rose-ink' : 'text-muted group-hover:text-rose-ink')} />
                  <span>{n.label}</span>
                  {n.count !== undefined && <span className={cx('rounded-md px-1.5 py-px font-mono text-[10px]', on ? 'bg-rose-soft text-rose-ink' : 'bg-surface-2 text-muted')}>{n.count}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
