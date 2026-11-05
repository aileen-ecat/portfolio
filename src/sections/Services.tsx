import { useState } from 'react';
import { ArrowUpRight, ChevronRight, Plus } from '../components/ui/icons';
import { services } from '../data/services';
import { projects } from '../data/projects';
import { useUI } from '../context/UIContext';
import { Icon } from '../components/ui/Icon';
import { InsightGlyph } from '../components/ui/DataIcons';
import { MiniHeading, Reveal, cx } from '../components/ui/primitives';

export function Services() {
  const [openId, setOpenId] = useState<string>(services[0].id);
  const { openProject } = useUI();
  const open = services.find((s) => s.id === openId) ?? services[0];

  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      <div>
        <MiniHeading icon={InsightGlyph} id="services-title">
          What I do
        </MiniHeading>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Expertise areas">
          {services.map((s, i) => {
            const active = s.id === openId;
            return (
              <Reveal key={s.id} delay={i * 80}>
                <button
                  type="button"
                  role="tab"
                  id={`svc-tab-${s.id}`}
                  aria-selected={active}
                  aria-controls="svc-panel"
                  onClick={() => setOpenId(s.id)}
                  className={cx(
                    'lift group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border p-6 text-left',
                    active ? 'border-rose bg-surface shadow-[0_30px_60px_-30px_rgb(var(--shadow-rgb)/0.45)]' : 'border-line bg-surface/70',
                  )}
                >
                  <span className={cx('absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-opacity duration-700', active ? 'bg-rose/30 opacity-100' : 'bg-lavender/30 opacity-0 group-hover:opacity-100')} aria-hidden="true" />
                  <div className="relative flex items-center justify-between">
                    <span className={cx('grid h-12 w-12 place-items-center rounded-2xl border transition-colors duration-500', active ? 'border-transparent bg-ink text-ink-fg' : 'border-line bg-surface-2 text-rose-ink')}>
                      <Icon name={s.icon} size={20} />
                    </span>
                    <span className="font-mono text-xs text-muted">{s.number}</span>
                  </div>
                  <h3 className="relative mt-8 font-serif text-[1.75rem] font-medium leading-tight text-fg">{s.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted">{s.summary}</p>
                  <span className={cx('relative mt-6 inline-flex items-center gap-1.5 text-xs font-medium transition-colors', active ? 'text-rose-ink' : 'text-muted group-hover:text-fg')}>
                    <Plus size={14} className={cx('transition-transform duration-500', active && 'rotate-45')} aria-hidden="true" />
                    {active ? 'Showing details' : 'Explore'}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${open.id}`} className="mt-5">
          <div key={open.id} className="pop-in card grid gap-8 overflow-hidden p-6 md:p-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="eyebrow">Tools</div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {open.tools.map((t, i) => (
                  <li key={t} className="chip fade-up" style={{ ['--d' as string]: `${i * 50}ms` }}>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="eyebrow mt-7">Related case studies</div>
              <ul className="mt-3 grid gap-2">
                {open.projects.map((pid) => {
                  const p = projects.find((x) => x.id === pid);
                  if (!p) return null;
                  return (
                    <li key={pid}>
                      <button type="button" onClick={() => openProject(pid)} className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-left text-sm transition-colors hover:border-rose">
                        <span>
                          <span className="font-mono text-[10px] text-rose-ink">{p.number}</span> <span className="font-medium text-fg">{p.title}</span>
                        </span>
                        <ArrowUpRight size={16} className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-rose-ink" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <div className="eyebrow">Typical workflow</div>
              <ol className="relative mt-4 grid gap-3">
                <span className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-rose via-mauve to-lavender" aria-hidden="true" />
                {open.workflow.map((step, i) => (
                  <li key={step} className="fade-up relative flex items-center gap-3" style={{ ['--d' as string]: `${80 + i * 90}ms` }}>
                    <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-[11px] text-rose-ink">{i + 1}</span>
                    <span className="text-sm text-fg">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-4">
              <div className="eyebrow">In practice</div>
              <ul className="mt-4 grid gap-3">
                {open.examples.map((ex, i) => (
                  <li key={ex} className="fade-up flex gap-3 rounded-2xl bg-blush/70 p-4 text-sm leading-relaxed text-fg" style={{ ['--d' as string]: `${120 + i * 90}ms` }}>
                    <ChevronRight size={16} className="mt-0.5 shrink-0 text-rose-ink" aria-hidden="true" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
