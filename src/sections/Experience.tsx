import { NAV_ICONS } from '../components/layout/Header';
import { useState } from 'react';
import { ArrowRight, Award, Briefcase, ChevronDown, ListChecks, PenLine, Wrench } from '../components/ui/icons';
import { phases, roles, type Item } from '../data/experience';
import { durationLabel, monthLabel } from '../lib/format';
import { Reveal, SectionHeading, cx } from '../components/ui/primitives';

function ItemList({ items, icon }: { items: Item[]; icon: 'check' | 'award' }) {
  return (
    <ul className="grid gap-2">
      {items.map((it) =>
        it.placeholder ? (
          <li key={it.text} className="flex items-start gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2 text-xs text-muted">
            <PenLine size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-mono uppercase tracking-wider">Placeholder · </span>
              {it.text}
            </span>
          </li>
        ) : (
          <li key={it.text} className="flex items-start gap-2.5 text-sm leading-relaxed text-fg">
            {icon === 'award' ? <Award size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" /> : <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-ink" aria-hidden="true" />}
            {it.text}
          </li>
        ),
      )}
    </ul>
  );
}

export function Experience() {
  const [openId, setOpenId] = useState<string | null>(roles[0].id);
  const openRole = roles.find((r) => r.id === openId);
  const activePhases = new Set(openRole?.phaseIds ?? []);

  return (
    <section id="experience" aria-labelledby="exp-title">
      <div>
        <SectionHeading
          index="04" icon={NAV_ICONS.experience}
          eyebrow="Professional Experience"
          title={<span id="exp-title">Experience &amp; Career Journey</span>}
          subtitle="Seven-plus years moving from operations into analytics — each role adding a layer: process discipline, e-commerce context, commercial analysis, and finally BI and automation."
        />

        {/* Journey */}
        <Reveal>
          <ol className="mb-14 grid gap-3 md:grid-cols-4" aria-label="Career progression">
            {phases.map((p, i) => {
              const on = activePhases.has(p.id);
              return (
                <li key={p.id} className="relative">
                  <div className={cx('h-full rounded-2xl border p-4 transition-all duration-500', on ? 'border-rose bg-rose-soft shadow-md' : 'border-line bg-surface')}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-rose-ink">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-[10px] text-muted">{p.years}</span>
                    </div>
                    <p className="mt-2 font-serif text-xl font-medium leading-tight text-fg">{p.label}</p>
                  </div>
                  {i < phases.length - 1 && (
                    <ArrowRight size={16} className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-canvas text-rose-ink md:block" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* Timeline */}
        <ol className="relative">
          <span className="absolute bottom-6 left-[19px] top-6 w-px bg-gradient-to-b from-rose via-mauve to-lavender md:left-[calc(11rem+19px)]" aria-hidden="true" />
          {roles.map((r, i) => {
            const open = openId === r.id;
            const current = r.end === 'present';
            return (
              <Reveal as="li" key={r.id} delay={i * 80} className="relative pb-6 last:pb-0">
                <div className="md:grid md:grid-cols-[11rem_1fr] md:gap-0">
                  <div className="hidden pr-8 pt-5 text-right md:block">
                    <p className="font-mono text-xs text-fg">{monthLabel(r.start)}</p>
                    <p className="font-mono text-xs text-muted">– {monthLabel(r.end)}</p>
                    <p className="mt-1 text-[11px] text-muted">{durationLabel(r.start, r.end)}</p>
                  </div>
                  <div className="relative pl-14">
                    <span className={cx('absolute left-0 top-4 grid h-10 w-10 place-items-center rounded-full border-4 border-canvas transition-colors duration-500', open || current ? 'bg-ink text-ink-fg' : 'bg-rose-soft text-rose-ink')}>
                      <Briefcase size={15} aria-hidden="true" />
                      {current && <span className="pulse-dot absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-canvas bg-sage" aria-hidden="true" />}
                    </span>
                    <div className={cx('overflow-hidden rounded-3xl border transition-all duration-500', open ? 'border-rose/60 bg-surface shadow-[0_30px_60px_-40px_rgb(var(--shadow-rgb)/0.5)]' : 'border-line bg-surface/70 hover:border-line-strong')}>
                      <button type="button" className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6" aria-expanded={open} aria-controls={`role-${r.id}`} onClick={() => setOpenId(open ? null : r.id)}>
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] text-muted md:hidden">
                            {monthLabel(r.start)} – {monthLabel(r.end)} · {durationLabel(r.start, r.end)}
                          </p>
                          <h3 className="font-serif text-2xl font-medium leading-tight text-fg sm:text-[1.75rem]">{r.title}</h3>
                          <p className="mt-1 text-sm text-muted">
                            {r.company}
                            {r.brand && <span className="text-fg/80"> — {r.brand}</span>}
                          </p>
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg/85">{r.summary}</p>
                        </div>
                        <span className={cx('icon-btn mt-1 shrink-0 transition-transform duration-500', open && 'rotate-180 !bg-rose-soft')} aria-hidden="true">
                          <ChevronDown size={16} />
                        </span>
                      </button>
                      <div id={`role-${r.id}`} className="accordion" data-open={open}>
                        <div>
                          <div className="grid gap-6 border-t border-line p-5 sm:p-6 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                              <p className="eyebrow mb-3 flex items-center gap-2">
                                <ListChecks size={13} aria-hidden="true" /> Responsibilities
                              </p>
                              <ItemList items={r.responsibilities} icon="check" />
                            </div>
                            <div className="grid content-start gap-6">
                              {r.accomplishments.length > 0 && (
                                <div>
                                  <p className="eyebrow mb-3 flex items-center gap-2">
                                    <Award size={13} aria-hidden="true" /> Key accomplishments
                                  </p>
                                  <ItemList items={r.accomplishments} icon="award" />
                                </div>
                              )}
                              <div>
                                <p className="eyebrow mb-3 flex items-center gap-2">
                                  <Wrench size={13} aria-hidden="true" /> Tools
                                </p>
                                <ul className="flex flex-wrap gap-1.5">
                                  {r.tools.map((t) =>
                                    t.placeholder ? (
                                      <li key={t.text} className="rounded-full border border-dashed border-line-strong px-3 py-1 text-[11px] text-muted">
                                        {t.text}
                                      </li>
                                    ) : (
                                      <li key={t.text} className="chip chip-mono">
                                        {t.text}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
