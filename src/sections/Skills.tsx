import { NAV_ICONS } from '../components/layout/Header';
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Briefcase, Lightbulb } from '../components/ui/icons';
import { allSkills, levelMeta, skillCategories, type SkillLevel } from '../data/skills';
import { projects } from '../data/projects';
import { useUI } from '../context/UIContext';
import { Reveal, SectionHeading, cx } from '../components/ui/primitives';

const LEVEL_STYLE: Record<SkillLevel, { dot: string; chip: string }> = {
  core: { dot: 'bg-rose-ink', chip: 'border-rose/60 bg-rose-soft text-fg' },
  working: { dot: 'bg-mauve', chip: 'border-line-strong bg-surface text-fg' },
  developing: { dot: 'border border-dashed border-mauve bg-transparent', chip: 'border-dashed border-line-strong bg-surface-2 text-fg' },
};

export function Skills() {
  const { setSkillFilter, scrollToSection, openProject } = useUI();
  const [cat, setCat] = useState<string>('all');
  const [level, setLevel] = useState<SkillLevel | 'all'>('all');
  const [selected, setSelected] = useState<string>('Power BI');
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = useMemo(
    () => allSkills.filter((s) => (cat === 'all' || skillCategories.find((c) => c.id === cat)?.label === s.category) && (level === 'all' || s.level === level)),
    [cat, level],
  );
  const focusName = hovered ?? selected;
  const skill = allSkills.find((s) => s.name === focusName) ?? allSkills[0];
  const related = projects.filter((p) => p.skills.includes(skill.name));

  const showProjects = (name: string) => {
    setSkillFilter(name);
    scrollToSection('projects');
  };

  return (
    <section id="skills" aria-labelledby="toolkit-title" className="relative overflow-hidden">
      <div>
        <SectionHeading
          index="05" icon={NAV_ICONS.skills}
          eyebrow="Skills & Toolkit"
          title={<span id="toolkit-title">My Analytics Toolkit</span>}
          subtitle="Hover or tap a skill to see how I use it and where. Selecting “show related projects” filters the case studies above. No ratings or percentages — just honest groupings."
        />

        <Reveal>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {[{ id: 'all', label: 'All skills' }, ...skillCategories].map((c) => (
                <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)} className={cx('rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300', cat === c.id ? 'border-transparent bg-ink text-ink-fg' : 'border-line bg-surface text-muted hover:border-rose hover:text-fg')}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by level">
              {(['all', 'core', 'working', 'developing'] as const).map((l) => (
                <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} className={cx('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors', level === l ? 'border-rose bg-surface text-fg' : 'border-transparent text-muted hover:text-fg')}>
                  {l !== 'all' && <span className={cx('h-2.5 w-2.5 rounded-full', LEVEL_STYLE[l].dot)} aria-hidden="true" />}
                  {l === 'all' ? 'All levels' : levelMeta[l].label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <Reveal>
            <div className="grid gap-5 rounded-[2rem] border border-line bg-surface/80 p-5 sm:p-6">
              {skillCategories.map((c) => {
                const items = visible.filter((s) => s.category === c.label);
                if (!items.length) return null;
                return (
                  <div key={c.id}>
                    <p className="eyebrow mb-3">{c.label}</p>
                    <ul className="flex flex-wrap gap-2">
                      {items.map((s, i) => {
                        const on = s.name === selected;
                        return (
                          <li key={s.name} className="fade-up" style={{ ['--d' as string]: `${i * 40}ms` }}>
                            <button
                              type="button"
                              aria-pressed={on}
                              onClick={() => setSelected(s.name)}
                              onMouseEnter={() => setHovered(s.name)}
                              onMouseLeave={() => setHovered(null)}
                              onFocus={() => setHovered(s.name)}
                              onBlur={() => setHovered(null)}
                              className={cx('inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-sm transition-all duration-300 hover:-translate-y-0.5', LEVEL_STYLE[s.level].chip, on && '!border-ink !bg-ink !text-ink-fg shadow-lg')}
                            >
                              <span className={cx('h-2 w-2 rounded-full', on ? 'bg-rose' : LEVEL_STYLE[s.level].dot)} aria-hidden="true" />
                              {s.name}
                              <span className="sr-only">({levelMeta[s.level].label})</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              {visible.length === 0 && <p className="py-10 text-center text-sm text-muted">No skills match these filters.</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
                {(Object.keys(levelMeta) as SkillLevel[]).map((l) => (
                  <span key={l} className="inline-flex items-center gap-2 text-xs text-muted">
                    <span className={cx('h-2.5 w-2.5 rounded-full', LEVEL_STYLE[l].dot)} aria-hidden="true" />
                    <span className="font-medium text-fg">{levelMeta[l].label}</span> — {levelMeta[l].description}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <aside aria-live="polite" className="sticky top-24 overflow-hidden rounded-[2rem] border border-line bg-surface">
              <div key={skill.name} className="fade-in">
                <div className="bg-gradient-to-br from-rose-soft via-surface to-lavender-soft p-6">
                  <span className="eyebrow">{skill.category}</span>
                  <h3 className="mt-2 font-serif text-4xl font-medium text-fg">{skill.name}</h3>
                  <span className={cx('mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs', LEVEL_STYLE[skill.level].chip)}>
                    <span className={cx('h-2 w-2 rounded-full', LEVEL_STYLE[skill.level].dot)} aria-hidden="true" />
                    {levelMeta[skill.level].label}
                  </span>
                </div>
                <div className="grid gap-5 p-6">
                  <div>
                    <p className="eyebrow mb-1.5 flex items-center gap-2 !text-[10px]">
                      <Lightbulb size={12} aria-hidden="true" /> Practical use
                    </p>
                    <p className="text-sm leading-relaxed text-fg">{skill.useCase}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-1.5 flex items-center gap-2 !text-[10px]">
                      <Briefcase size={12} aria-hidden="true" /> Where I've used it
                    </p>
                    <p className="text-sm leading-relaxed text-muted">{skill.experience}</p>
                  </div>
                  <div>
                    <p className="eyebrow mb-2 !text-[10px]">Related case studies</p>
                    {related.length ? (
                      <ul className="grid gap-1.5">
                        {related.map((p) => (
                          <li key={p.id}>
                            <button type="button" onClick={() => openProject(p.id)} className="group flex w-full items-center justify-between rounded-xl border border-line px-3 py-2 text-left text-sm transition-colors hover:border-rose">
                              <span className="truncate text-fg">{p.title}</span>
                              <ArrowUpRight size={14} className="shrink-0 text-muted group-hover:text-rose-ink" aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted">No featured case study uses this skill yet.</p>
                    )}
                  </div>
                  {related.length > 0 && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => showProjects(skill.name)}>
                      Show related projects <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
