import { NAV_ICONS } from '../components/layout/Header';
import { useState } from 'react';
import { Info, Minus, MousePointerClick, Plus, PresentationChart, ScanSearch, Storefront, Tag, type AnyIcon } from '../components/ui/icons';
import { archViews, stages, type ArchView } from '../data/architecture';
import { ArchitectureDiagram } from '../components/architecture/ArchitectureDiagram';
import { NodeDetail, RecordTrace, StackedArchitecture } from '../components/architecture/panels';
import { Reveal, SectionHeading, cx } from '../components/ui/primitives';

const ZOOMS = [1, 1.25, 1.5];

const VIEW_ICONS: Record<ArchView['id'], AnyIcon> = {
  powerbi: PresentationChart,
  ecommerce: Storefront,
  pricing: Tag,
};

export function Architecture() {
  const [viewId, setViewId] = useState(archViews[0].id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [zoomIdx, setZoomIdx] = useState(0);
  const view = archViews.find((v) => v.id === viewId)!;
  const activeStage = step >= 0 ? view.trace[step]?.stage ?? null : null;
  const ViewIcon = VIEW_ICONS[view.id];

  const switchView = (id: typeof viewId) => {
    setViewId(id);
    setSelectedId(null);
    setHoverId(null);
    setStep(-1);
  };

  return (
    <section id="architecture" aria-labelledby="arch-title" className="relative overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" aria-hidden="true" />
      <div className="relative">
        <SectionHeading
          index="01" icon={NAV_ICONS.architecture}
          eyebrow="Interactive Data Architecture"
          title={<span id="arch-title">Behind the Insights</span>}
          subtitle="Explore how raw business data becomes actionable intelligence. Hover a component to trace its lineage, click it for details, or follow a single record end to end."
        />

        <Reveal>
          <div className="grid gap-4">
            <div role="tablist" aria-label="Architecture views" className="seg grid w-full grid-cols-1 !rounded-3xl sm:grid-cols-3 sm:!rounded-full">
              {archViews.map((v) => (
                <button key={v.id} type="button" role="tab" aria-selected={v.id === viewId} onClick={() => switchView(v.id)} className="!px-4 text-center">
                  {v.label}
                </button>
              ))}
            </div>
            <p className="inline-flex max-w-md items-start gap-2 text-xs text-muted">
              <Info size={14} className="mt-0.5 shrink-0 text-rose-ink" aria-hidden="true" />
              Representative workflow architecture based on my experience — not a verified production infrastructure diagram.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-6 overflow-hidden rounded-[2rem] border border-line bg-surface/80 shadow-[0_40px_80px_-50px_rgb(var(--shadow-rgb)/0.45)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-soft text-rose-ink" aria-hidden="true">
                  <ViewIcon size={20} weight="duotone" />
                </span>
                <p key={view.id} className="fade-in min-w-0 text-sm text-muted">
                  <span className="font-semibold text-fg">{view.label}.</span> {view.description}
                </p>
              </div>
              <div className="hidden items-center gap-1.5 md:flex">
                <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-muted">Zoom</span>
                <button type="button" className="icon-btn !h-8 !w-8" onClick={() => setZoomIdx((z) => Math.max(0, z - 1))} disabled={zoomIdx === 0} aria-label="Zoom out">
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-10 text-center font-mono text-[11px] text-fg">{Math.round(ZOOMS[zoomIdx] * 100)}%</span>
                <button type="button" className="icon-btn !h-8 !w-8" onClick={() => setZoomIdx((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoomIdx === ZOOMS.length - 1} aria-label="Zoom in">
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Desktop / tablet: interactive SVG, horizontally scrollable for pan */}
            <div className="scrollbar-thin hidden overflow-x-auto p-4 md:block" tabIndex={-1}>
              <ArchitectureDiagram
                view={view}
                hoverId={hoverId}
                selectedId={selectedId}
                activeStage={activeStage}
                zoom={ZOOMS[zoomIdx]}
                onHover={setHoverId}
                onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
              />
            </div>
            <div className="hidden items-center justify-between gap-3 border-t border-line px-5 py-3 md:flex">
              <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Stage legend">
                {stages.map((s) => (
                  <li key={s.id} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                    {s.label}
                  </li>
                ))}
              </ul>
              <span className="flex shrink-0 flex-col items-end gap-1 font-mono text-[10px] text-muted">
                <span className="inline-flex items-center gap-1.5 text-fg/80">
                  <MousePointerClick size={13} className="text-rose-ink" aria-hidden="true" /> hover to trace connections · click for details
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ScanSearch size={13} aria-hidden="true" /> scroll sideways to pan when zoomed
                </span>
              </span>
            </div>

            {/* Mobile: stacked representation */}
            <div className="p-4 md:hidden">
              <StackedArchitecture view={view} activeStage={activeStage} />
            </div>
          </div>
        </Reveal>

        {/* Record trace spans the full width; a clicked component's details open beside it. */}
        <div className={cx('mt-5 grid gap-5', selectedId && 'md:grid-cols-2')}>
          {selectedId && (
            <div className="hidden h-full md:block">
              <NodeDetail nodeId={selectedId} view={view} onSelect={setSelectedId} onClose={() => setSelectedId(null)} />
            </div>
          )}
          <Reveal delay={120} className="h-full">
            <RecordTrace view={view} step={Math.max(0, step)} setStep={setStep} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
