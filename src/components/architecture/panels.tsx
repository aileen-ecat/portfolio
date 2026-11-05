import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Pause, Play, RotateCcw, StepBack, StepForward, X } from '../ui/icons';
import { archNodes, stages, type ArchView, type StageId } from '../../data/architecture';
import { cx } from '../ui/primitives';
import { neighbours } from './graph';

const stageById = (id: StageId) => stages.find((s) => s.id === id)!;

function NodeLinks({ ids, label, onSelect }: { ids: string[]; label: string; onSelect: (id: string) => void }) {
  if (!ids.length) return null;
  return (
    <div>
      <div className="eyebrow !text-[10px]">{label}</div>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {ids.map((id) => (
          <li key={id}>
            <button type="button" onClick={() => onSelect(id)} className="chip transition-colors hover:border-rose hover:text-rose-ink">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: stageById(archNodes[id].stage).color }} aria-hidden="true" />
              {archNodes[id].label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NodeDetail({ nodeId, view, onSelect, onClose }: { nodeId: string; view: ArchView; onSelect: (id: string) => void; onClose: () => void }) {
  const node = archNodes[nodeId];
  if (!node) return null;
  const stage = stageById(node.stage);
  const { upstream, downstream } = neighbours(nodeId, view.edges);
  return (
    <div key={nodeId} className="pop-in h-full rounded-3xl border border-line bg-surface p-6" aria-live="polite">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: stage.color }} aria-hidden="true" />
        <span className="eyebrow">
          Stage {stage.index} · {stage.label}
        </span>
        <button type="button" className="icon-btn ml-auto !h-8 !w-8" onClick={onClose} aria-label="Close details">
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <h3 className="mt-3 font-serif text-3xl font-medium text-fg">{node.label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{node.description}</p>

      <div className="mt-5 grid items-stretch gap-2 font-mono text-[11.5px] sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-line bg-surface-2 p-3">
          <div className="mb-1 text-[9.5px] uppercase tracking-widest text-muted">Before</div>
          <div className="text-fg">{node.example.before}</div>
        </div>
        <div className="grid place-items-center text-rose-ink" aria-hidden="true">
          <ArrowRight size={16} className="rotate-90 sm:rotate-0" weight="bold" />
        </div>
        <div className="rounded-2xl border border-rose/50 bg-rose-soft p-3">
          <div className="mb-1 text-[9.5px] uppercase tracking-widest text-rose-ink">After</div>
          <div className="text-fg">{node.example.after}</div>
        </div>
      </div>

      {node.tools.length > 0 && (
        <div className="mt-5">
          <div className="eyebrow !text-[10px]">Tools</div>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {node.tools.map((t) => (
              <li key={t} className="chip chip-mono">
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-5 grid gap-4">
        <NodeLinks ids={upstream} label="Receives from" onSelect={onSelect} />
        <NodeLinks ids={downstream} label="Feeds into" onSelect={onSelect} />
      </div>
    </div>
  );
}

export function RecordTrace({ view, step, setStep }: { view: ArchView; step: number; setStep: (n: number) => void }) {
  const [playing, setPlaying] = useState(false);
  const last = view.trace.length - 1;

  useEffect(() => setPlaying(false), [view.id]);
  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep(step + 1), 2000);
    return () => window.clearTimeout(t);
  }, [playing, step, last, setStep]);

  const current = view.trace[Math.max(0, step)];
  const stage = stageById(current.stage);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow">Follow one record</div>
          <p className="mt-1 text-sm text-muted">Watch a single row become a business decision.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className="icon-btn !h-9 !w-9" onClick={() => setStep(Math.max(0, step - 1))} disabled={step <= 0} aria-label="Previous stage">
            <StepBack size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn !h-9 !w-9 !border-transparent !bg-ink !text-ink-fg"
            onClick={() => {
              setStep(step >= last ? 0 : step);
              setPlaying((p) => !p);
            }}
            aria-label={playing ? 'Pause trace' : step >= last ? 'Replay trace' : 'Play trace'}
          >
            {playing ? <Pause size={15} aria-hidden="true" /> : step >= last ? <RotateCcw size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          </button>
          <button type="button" className="icon-btn !h-9 !w-9" onClick={() => setStep(Math.min(last, step + 1))} disabled={step >= last} aria-label="Next stage">
            <StepForward size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-6 gap-1.5" aria-label="Trace stages">
        {view.trace.map((t, i) => (
          <li key={t.stage}>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setStep(i);
              }}
              aria-current={i === step ? 'step' : undefined}
              aria-label={`Stage ${i + 1}: ${t.title}`}
              className="group block w-full py-2"
            >
              <span className={cx('block h-1.5 rounded-full transition-all duration-500', i <= step ? 'bg-rose-ink' : 'bg-line group-hover:bg-line-strong')} />
            </button>
          </li>
        ))}
      </ol>

      <div key={`${view.id}-${step}`} className="pop-in mt-3 flex-1" aria-live="polite">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: stage.color }} aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {stage.index} {stage.label}
          </span>
        </div>
        <p className="mt-2 font-serif text-2xl text-fg">{current.title}</p>
        <pre className="scrollbar-thin mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-line bg-surface-2 p-4 font-mono text-[12px] leading-relaxed text-fg">{current.record}</pre>
      </div>
      <p className="mt-3 text-[11px] text-muted">Sample values are illustrative.</p>
    </div>
  );
}

/** Mobile-friendly stacked representation that keeps the connections. */
export function StackedArchitecture({ view, activeStage }: { view: ArchView; activeStage: StageId | null }) {
  const [openId, setOpenId] = useState<string | null>(null);
  useEffect(() => setOpenId(null), [view.id]);
  return (
    <ol className="relative grid gap-4">
      {stages.map((s, si) => {
        const ids = view.nodes.filter((id) => archNodes[id].stage === s.id);
        if (!ids.length) return null;
        return (
          <li key={s.id} className={cx('relative rounded-3xl border p-4 transition-colors duration-500', activeStage === s.id ? 'border-rose bg-rose-soft/60' : 'border-line bg-surface-2/70')}>
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-full font-mono text-[10px] text-white" style={{ background: s.color }}>
                {s.index}
              </span>
              <span className="text-sm font-semibold text-fg">{s.label}</span>
            </div>
            <ul className="grid gap-2">
              {ids.map((id) => {
                const node = archNodes[id];
                const open = openId === id;
                const { upstream, downstream } = neighbours(id, view.edges);
                return (
                  <li key={id} className="overflow-hidden rounded-2xl border border-line bg-surface">
                    <button type="button" className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left" aria-expanded={open} onClick={() => setOpenId(open ? null : id)}>
                      <span>
                        <span className="block text-sm font-medium text-fg">{node.label}</span>
                        <span className="font-mono text-[10.5px] text-muted">{node.tag}</span>
                      </span>
                      <ChevronDown size={16} className={cx('shrink-0 text-muted transition-transform duration-300', open && 'rotate-180')} aria-hidden="true" />
                    </button>
                    <div className="accordion" data-open={open}>
                      <div>
                        <div className="grid gap-3 px-4 pb-4 text-sm">
                          <p className="text-muted">{node.description}</p>
                          <p className="rounded-xl bg-surface-2 p-3 font-mono text-[11.5px] text-fg">
                            {node.example.before} <ArrowRight size={12} weight="bold" className="inline text-rose-ink" aria-hidden="true" /> {node.example.after}
                          </p>
                          {upstream.length > 0 && (
                            <p className="text-xs text-muted">
                              <span className="font-semibold text-fg">Receives from:</span> {upstream.map((u) => archNodes[u].label).join(', ')}
                            </p>
                          )}
                          {downstream.length > 0 && (
                            <p className="text-xs text-muted">
                              <span className="font-semibold text-fg">Feeds into:</span> {downstream.map((u) => archNodes[u].label).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {si < stages.length - 1 && (
              <span className="absolute -bottom-4 left-1/2 z-10 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border border-line bg-surface text-rose-ink" aria-hidden="true">
                <ChevronDown size={14} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
