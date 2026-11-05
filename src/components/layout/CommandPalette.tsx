import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Copy, CornerDownLeft, Mail, Moon, Search, Sparkles, Sun } from '../ui/icons';
import { NAV_ICONS } from './Header';
import { navigation } from '../../data/navigation';
import { projects } from '../../data/projects';
import { profile } from '../../data/profile';
import { useUI } from '../../context/UIContext';
import { Modal } from '../ui/Modal';
import { LinkedInIcon } from '../ui/Icon';
import { cx } from '../ui/primitives';
import { copyText } from '../../lib/clipboard';

type Cmd = { id: string; group: string; label: string; hint?: string; icon: ReactNode; keywords?: string; run: () => void };

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, scrollToSection, openProject, toggleTheme, notify, theme } = useUI();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Only keyboard moves should scroll the list; hovering shouldn't drag it around under the pointer.
  const scrollOnChange = useRef(false);

  // Global shortcut: Ctrl/⌘ + F (replacing the browser's find bar), and "/" when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable="true"]');
      if ((e.key === 'f' || e.key === 'F') && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      } else if (e.key === '/' && !typing && !paletteOpen) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, setPaletteOpen]);

  useEffect(() => {
    if (paletteOpen) {
      setQuery('');
      setIndex(0);
    }
  }, [paletteOpen]);

  const commands = useMemo<Cmd[]>(() => {
    const close = () => setPaletteOpen(false);
    return [
      ...navigation.map((n) => {
        const Glyph = NAV_ICONS[n.icon];
        return {
        id: `nav-${n.id}`,
        group: 'Pages',
        label: n.label,
        hint: n.count !== undefined ? String(n.count) : undefined,
        icon: <Glyph size={16} />,
        run: () => {
          close();
          setTimeout(() => scrollToSection(n.id), 60);
        },
        };
      }),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: 'Case studies',
        label: p.title,
        hint: p.category,
        keywords: p.tools.join(' '),
        icon: <Sparkles size={15} />,
        run: () => {
          close();
          setTimeout(() => openProject(p.id), 60);
        },
      })),
      { id: 'act-email', group: 'Actions', label: 'Copy email address', hint: profile.email, icon: <Copy size={15} />, run: async () => { close(); notify((await copyText(profile.email)) ? 'Email copied to clipboard' : `Copy failed — email: ${profile.email}`); } },
      { id: 'act-mail', group: 'Actions', label: 'Write an email', icon: <Mail size={15} />, run: () => { close(); window.location.href = `mailto:${profile.email}`; } },
      { id: 'act-linkedin', group: 'Actions', label: 'Open LinkedIn profile', icon: <LinkedInIcon size={15} />, run: () => { close(); window.open(profile.linkedin, '_blank', 'noopener'); } },
      { id: 'act-theme', group: 'Actions', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`, icon: theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />, run: () => { toggleTheme(); close(); } },
    ];
  }, [setPaletteOpen, scrollToSection, openProject, notify, toggleTheme, theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint ?? ''} ${c.group} ${c.keywords ?? ''}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    setIndex(0);
    listRef.current?.scrollTo({ top: 0 });
  }, [query]);
  useEffect(() => {
    if (!scrollOnChange.current) return;
    scrollOnChange.current = false;
    listRef.current?.querySelector(`[data-index="${index}"]`)?.closest('li')?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!filtered.length) return;
      scrollOnChange.current = true;
      // wrap around at either end
      setIndex((i) => (e.key === 'ArrowDown' ? (i + 1) % filtered.length : (i - 1 + filtered.length) % filtered.length));
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      filtered[index]?.run();
    }
  };

  let lastGroup = '';

  return (
    <Modal open={paletteOpen} onClose={() => setPaletteOpen(false)} labelledBy="palette-title" align="top" className="w-full max-w-xl">
      <div className="glass overflow-hidden rounded-3xl shadow-2xl" onKeyDown={onKeyDown}>
        <h2 id="palette-title" className="sr-only">Quick navigation</h2>
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={18} className="text-muted" aria-hidden="true" />
          <input
            data-autofocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a section, case study or action…"
            className="h-14 w-full bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
            aria-label="Search commands"
          />
          <kbd className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted">Esc</kbd>
        </div>
        <ul id="palette-list" ref={listRef} role="listbox" aria-label="Commands" className="scrollbar-thin max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted">
              No matches for “{query}”. Try “dashboard”, “SQL” or “contact”.
            </li>
          )}
          {filtered.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header && <div className="eyebrow px-3 pb-1.5 pt-3 !text-[10px]">{header}</div>}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  onMouseMove={() => i !== index && setIndex(i)}
                  onClick={() => c.run()}
                  className={cx('flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors', i === index ? 'bg-rose-soft text-fg' : 'text-fg/85')}
                >
                  <span className={cx('grid h-8 w-8 place-items-center rounded-xl border border-line bg-surface', i === index && 'border-rose text-rose-ink')} aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="flex-1 truncate">{c.label}</span>
                  {c.hint && <span className="hidden truncate font-mono text-[11px] text-muted sm:block">{c.hint}</span>}
                  {i === index ? <CornerDownLeft size={14} className="text-rose-ink" aria-hidden="true" /> : <ArrowRight size={14} className="opacity-0" aria-hidden="true" />}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-line px-5 py-2.5 font-mono text-[10px] text-muted">
          <span>Arrow keys to move · Enter to select</span>
          <span>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span>
        </div>
      </div>
    </Modal>
  );
}
