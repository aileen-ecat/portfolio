import { NAV_ICONS } from '../components/layout/Header';
import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from '../components/ui/icons';
import { projectCategories, projects, type Project } from '../data/projects';
import { useUI } from '../context/UIContext';
import { ProjectPreview } from '../components/projects/ProjectPreview';
import { Reveal, SectionHeading, cx } from '../components/ui/primitives';

export function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <li className="fade-up" style={{ ['--d' as string]: `${index * 70}ms` }}>
      <button type="button" onClick={onOpen} className="lift group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-surface text-left" aria-label={`Open case study: ${project.title}`}>
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-blush via-surface-2 to-lavender-soft p-6">
          <div className="bg-dots absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative h-full transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-[1.04]">
            <ProjectPreview kind={project.demo} />
          </div>
          <span className="absolute left-5 top-4 font-mono text-[11px] text-rose-ink">{project.number}</span>
          <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-fg shadow-sm transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-ink-fg">
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="eyebrow !text-[10px] !text-mauve">{project.category}</span>
          <h3 className="mt-2 font-serif text-[1.65rem] font-medium leading-tight text-fg">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>
          <p className="mt-3 text-xs font-medium text-fg/80">{project.context}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.tools.slice(0, 4).map((t) => (
              <li key={t} className="chip chip-mono !py-0.5">
                {t}
              </li>
            ))}
            {project.tools.length > 4 && <li className="chip chip-mono !py-0.5">+{project.tools.length - 4}</li>}
          </ul>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-ink">
            Open case study & live demo
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </button>
    </li>
  );
}

export function Projects() {
  const { openProject, skillFilter, setSkillFilter } = useUI();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (skillFilter && !p.skills.includes(skillFilter)) return false;
      if (!q) return true;
      return [p.title, p.category, p.summary, p.context, ...p.tools, ...p.skills].join(' ').toLowerCase().includes(q);
    });
  }, [query, category, skillFilter]);

  const filterKey = `${query}|${category}|${skillFilter}`;
  const clearAll = () => {
    setQuery('');
    setCategory('All');
    setSkillFilter(null);
  };

  return (
    <section id="projects" aria-labelledby="work-title">
      <div>
        <SectionHeading
          index="02" icon={NAV_ICONS.projects}
          eyebrow="Featured Projects"
          title={
            <span id="work-title">
              Selected Work <em className="text-gradient">&amp;</em> Case Studies
            </span>
          }
          subtitle="Six projects drawn from my work in BI, pricing, automation and e-commerce analytics. Each case study includes an interactive demonstration built with fictional, anonymised data."
        />

        <Reveal>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {projectCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={cx('rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300', category === c ? 'border-transparent bg-ink text-ink-fg' : 'border-line bg-surface text-muted hover:border-rose hover:text-fg')}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="relative block w-full lg:w-72">
              <span className="sr-only">Search projects</span>
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, tools…" className="field !rounded-full !pl-10" />
            </label>
          </div>
        </Reveal>

        {skillFilter && (
          <div className="pop-in mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            Showing projects using
            <button type="button" onClick={() => setSkillFilter(null)} className="chip !border-rose !bg-rose-soft !text-rose-ink" aria-label={`Remove skill filter ${skillFilter}`}>
              {skillFilter} <X size={12} aria-hidden="true" />
            </button>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {filtered.length} project{filtered.length === 1 ? '' : 's'} shown
        </p>

        {filtered.length ? (
          <ul key={filterKey} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={() => openProject(p.id)} />
            ))}
          </ul>
        ) : (
          <div className="pop-in grid place-items-center rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center">
            <Search className="text-rose-ink" size={24} aria-hidden="true" />
            <p className="mt-3 font-medium text-fg">No projects match these filters</p>
            <p className="mt-1 text-sm text-muted">Try a different keyword or clear the filters.</p>
            <button type="button" onClick={clearAll} className="btn btn-secondary btn-sm mt-5">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
