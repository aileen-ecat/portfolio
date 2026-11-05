import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowLeft, ArrowRight, CircleCheck, Lightbulb, PenLine, Sparkles, X } from '../ui/icons';
import { projects, type DemoKey, type Project, type ProjectResult } from '../../data/projects';
import { useUI } from '../../context/UIContext';
import { Modal } from '../ui/Modal';
import { LoadingPanel, cx } from '../ui/primitives';

const demos: Record<DemoKey, React.LazyExoticComponent<ComponentType>> = {
  sales: lazy(() => import('./demos/SalesDashboardDemo')),
  pricing: lazy(() => import('./demos/PricingAnalyzerDemo')),
  automation: lazy(() => import('./demos/AutomationDemo')),
  ecommerce: lazy(() => import('./demos/EcommerceDemo')),
  sql: lazy(() => import('./demos/SqlDemo')),
  monitoring: lazy(() => import('./demos/MonitoringDemo')),
};

const SECTIONS = [
  { id: 'challenge', label: 'The Challenge' },
  { id: 'role', label: 'My Role' },
  { id: 'tools', label: 'Tools & Technologies' },
  { id: 'approach', label: 'The Approach' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'results', label: 'Results & Impact' },
  { id: 'demo', label: 'Interactive Demo' },
  { id: 'learnings', label: 'Key Learnings' },
];

function Block({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={`cs-${id}`} data-cs={id} className="scroll-mt-6 border-t border-line py-9 first:border-t-0 first:pt-2">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-rose-ink">{String(n).padStart(2, '0')}</span>
        <h3 className="font-serif text-[1.9rem] font-medium leading-none text-fg">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function ResultCard({ r }: { r: ProjectResult }) {
  if (r.kind === 'placeholder') {
    return (
      <li className="rounded-2xl border border-dashed border-line-strong p-4 text-sm">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          <PenLine size={13} aria-hidden="true" /> Placeholder
        </div>
        <p className="mt-2 font-medium text-muted">{r.label}</p>
        {r.note && <p className="mt-1 text-xs text-muted">{r.note}</p>}
      </li>
    );
  }
  const verified = r.kind === 'verified';
  return (
    <li className={cx('rounded-2xl border p-4 text-sm', verified ? 'border-rose/50 bg-rose-soft/60' : 'border-line bg-surface-2')}>
      <div className={cx('flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest', verified ? 'text-rose-ink' : 'text-mauve')}>
        {verified ? <CircleCheck size={13} aria-hidden="true" /> : <Sparkles size={13} aria-hidden="true" />}
        {verified ? 'From my work history' : 'Qualitative'}
      </div>
      <p className="mt-2 font-semibold text-fg">{r.label}</p>
      {r.note && <p className="mt-1 text-xs text-muted">{r.note}</p>}
    </li>
  );
}

function CaseStudy({ project, onClose, onNavigate }: { project: Project; onClose: () => void; onNavigate: (id: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('challenge');
  const idx = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  const Demo = demos[project.demo];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setActive('challenge');
  }, [project.id]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.cs!);
      },
      { root, rootMargin: '-15% 0px -75% 0px' },
    );
    root.querySelectorAll('[data-cs]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [project.id]);

  const jump = (id: string) => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`#cs-${id}`);
    if (el && scrollRef.current) scrollRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-canvas shadow-2xl">
      {/* Header */}
      <div className="relative shrink-0 overflow-hidden border-b border-line bg-gradient-to-r from-blush via-surface to-lavender-soft px-5 py-5 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="eyebrow flex flex-wrap items-center gap-2">
              <span className="text-rose-ink">Case study {project.number}</span>
              <span aria-hidden="true">·</span>
              <span>{project.category}</span>
            </div>
            <h2 id="case-title" className="display mt-2 text-3xl text-fg sm:text-[2.6rem]">
              {project.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">{project.context}</p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn shrink-0" aria-label="Close case study" data-autofocus>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Section nav */}
        <nav aria-label="Case study sections" className="hidden w-56 shrink-0 border-r border-line p-5 lg:block">
          <ol className="grid gap-1">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jump(s.id)}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors', active === s.id ? 'bg-rose-soft text-fg' : 'text-muted hover:text-fg')}
                >
                  <span className={cx('font-mono text-[10px]', active === s.id ? 'text-rose-ink' : 'text-muted')}>{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div ref={scrollRef} className="scrollbar-thin min-w-0 flex-1 overflow-y-auto px-5 sm:px-8">
          <Block id="challenge" n={1} title="The Challenge">
            <p className="max-w-3xl text-[15px] leading-relaxed text-fg/90">{project.challenge}</p>
          </Block>

          <Block id="role" n={2} title="My Role">
            <p className="max-w-3xl text-[15px] leading-relaxed text-fg/90">{project.role}</p>
          </Block>

          <Block id="tools" n={3} title="Tools & Technologies">
            <ul className="flex flex-wrap gap-2">
              {project.tools.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="approach" n={4} title="The Approach">
            <ol className="grid gap-3 md:grid-cols-2">
              {project.approach.map((a, i) => (
                <li key={a} className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-fg">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-soft font-mono text-[10px] text-rose-ink">{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
            {project.facets && (
              <dl className="mt-5 grid gap-3 md:grid-cols-2">
                {project.facets.map((f) => (
                  <div key={f.title} className="rounded-2xl bg-blush/70 p-4">
                    <dt className="eyebrow !text-[10px] !text-rose-ink">{f.title}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-fg">{f.body}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Block>

          <Block id="workflow" n={5} title="The Workflow">
            <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">
              {project.workflow.map((w, i) => (
                <li key={w.label} className="flex flex-1 items-center gap-2 md:flex-col md:items-stretch">
                  <div className="fade-up flex-1 rounded-2xl border border-line bg-surface p-4" style={{ ['--d' as string]: `${i * 90}ms` }}>
                    <div className="font-mono text-[10px] text-rose-ink">{String(i + 1).padStart(2, '0')}</div>
                    <div className="mt-1 text-sm font-semibold text-fg">{w.label}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted">{w.detail}</div>
                  </div>
                  {i < project.workflow.length - 1 && (
                    <ArrowRight size={16} className="mx-auto shrink-0 rotate-90 text-rose-ink md:hidden" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-3 hidden h-1 overflow-hidden rounded-full bg-line md:block" aria-hidden="true">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-rose to-lavender motion-safe:animate-[flow-bar_3s_ease-in-out_infinite]" />
            </div>
          </Block>

          <Block id="results" n={6} title="Results & Business Impact">
            <ul className="grid gap-3 md:grid-cols-3">
              {project.results.map((r) => (
                <ResultCard key={r.label} r={r} />
              ))}
            </ul>
          </Block>

          <Block id="demo" n={7} title="Interactive Demonstration">
            <Suspense fallback={<LoadingPanel />}>
              <Demo />
            </Suspense>
          </Block>

          <Block id="learnings" n={8} title="Key Learnings">
            <ul className="grid gap-3 md:grid-cols-3">
              {project.learnings.map((l) => (
                <li key={l} className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-fg">
                  <Lightbulb size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {l}
                </li>
              ))}
            </ul>
          </Block>
          <div className="h-6" />
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line bg-surface/80 px-5 py-3 sm:px-8">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNavigate(prev.id)}>
          <ArrowLeft size={15} aria-hidden="true" />
          <span className="hidden sm:inline">{prev.title}</span>
          <span className="sm:hidden">Previous</span>
        </button>
        <span className="font-mono text-[11px] text-muted">
          {idx + 1} / {projects.length}
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onNavigate(next.id)}>
          <span className="hidden sm:inline">{next.title}</span>
          <span className="sm:hidden">Next</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function CaseStudyModal() {
  const { activeProjectId, closeProject, openProject } = useUI();
  const project = projects.find((p) => p.id === activeProjectId) ?? null;
  return (
    <Modal open={!!project} onClose={closeProject} labelledBy="case-title" align="center" className="h-[min(88vh,900px)] w-full max-w-[1080px]">
      {project && <CaseStudy project={project} onClose={closeProject} onNavigate={openProject} />}
    </Modal>
  );
}
