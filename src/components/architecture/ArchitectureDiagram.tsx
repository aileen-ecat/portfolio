import { useMemo, type CSSProperties, type KeyboardEvent } from 'react';
import { archNodes, stages, type ArchView, type StageId } from '../../data/architecture';
import { useReducedMotion } from '../../hooks';
import { COL_W, NODE_H, edgeKey, edgePath, layoutView, lineage, wrapLabel } from './graph';

const stageColor = (id: StageId) => stages.find((s) => s.id === id)!.color;

type Props = {
  view: ArchView;
  hoverId: string | null;
  selectedId: string | null;
  activeStage: StageId | null;
  zoom: number;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export function ArchitectureDiagram({ view, hoverId, selectedId, activeStage, zoom, onHover, onSelect }: Props) {
  const reduced = useReducedMotion();
  const layout = useMemo(() => layoutView(view), [view]);
  const focusId = hoverId ?? selectedId;
  const related = useMemo(() => (focusId ? lineage(focusId, view.edges) : null), [focusId, view.edges]);

  const onKey = (e: KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      style={{ width: `${zoom * 100}%`, minWidth: `${1060 * zoom}px` }}
      className="block h-auto select-none"
      role="group"
      aria-label={`${view.label} — interactive architecture diagram`}
    >
      <defs>
        <filter id="nodeShadow" x="-20%" y="-30%" width="140%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgb(53,39,54)" floodOpacity="0.10" />
        </filter>
      </defs>

      {/* Stage columns */}
      {stages.map((s, i) => {
        const x = layout.colX[i];
        const on = activeStage === s.id;
        return (
          <g key={s.id}>
            <rect
              x={x - 10}
              y={8}
              width={COL_W + 20}
              height={layout.height - 12}
              rx={20}
              style={{ fill: on ? 'var(--rose-soft)' : 'var(--surface-2)', opacity: on ? 0.95 : 0.55, transition: 'fill .5s, opacity .5s' }}
            />
            <text x={x + 4} y={34} style={{ fill: 'var(--rose-ink)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em' }}>
              {s.index}
            </text>
            <text x={x + 28} y={34} style={{ fill: 'var(--fg)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {s.label.toUpperCase()}
            </text>
            <line x1={x + 4} x2={x + COL_W - 4} y1={48} y2={48} style={{ stroke: s.color, strokeWidth: 1.5, opacity: 0.6 }} />
          </g>
        );
      })}

      {/* Edges */}
      <g fill="none">
        {view.edges.map((e, i) => {
          const a = layout.pos[e[0]];
          const b = layout.pos[e[1]];
          if (!a || !b) return null;
          const k = edgeKey(e);
          const on = related?.keys.has(k);
          const dim = related && !on;
          return (
            <path
              key={`${view.id}-${k}`}
              d={edgePath(a, b)}
              pathLength={1}
              className="draw-path"
              style={
                {
                  '--d': `${150 + i * 28}ms`,
                  stroke: on ? 'var(--rose-ink)' : 'var(--line-strong)',
                  strokeWidth: on ? 2.2 : 1.4,
                  opacity: dim ? 0.18 : 1,
                  transition: 'stroke .3s, stroke-width .3s, opacity .35s',
                } as CSSProperties
              }
            />
          );
        })}
      </g>

      {/* Data packets travelling along the edges */}
      {!reduced && (
        <g>
          {view.edges.map((e, i) => {
            const a = layout.pos[e[0]];
            const b = layout.pos[e[1]];
            if (!a || !b) return null;
            const k = edgeKey(e);
            if (related && !related.keys.has(k)) return null;
            const color = stageColor(archNodes[e[0]].stage);
            const dur = 2.6 + (i % 4) * 0.35;
            return (
              <circle key={`${view.id}-p-${k}-${focusId ?? 'all'}`} r={related ? 3.6 : 2.8} style={{ fill: color }}>
                <animateMotion dur={`${dur}s`} begin={`${-((i * 0.37) % dur)}s`} repeatCount="indefinite" path={edgePath(a, b)} />
              </circle>
            );
          })}
        </g>
      )}

      {/* Nodes */}
      {view.nodes.map((id, i) => {
        const node = archNodes[id];
        const p = layout.pos[id];
        if (!node || !p) return null;
        const color = stageColor(node.stage);
        const isFocus = id === focusId;
        const isSelected = id === selectedId;
        const dim = related ? !related.nodes.has(id) : false;
        const lines = wrapLabel(node.label);
        return (
          <g
            key={`${view.id}-${id}`}
            transform={`translate(${p.x},${p.y})`}
            className="arch-node cursor-pointer outline-none"
            style={{ opacity: dim ? 0.3 : 1, transition: 'opacity .35s' }}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`${node.label} — ${stages.find((s) => s.id === node.stage)!.label}. Press Enter for details.`}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(id)}
            onKeyDown={(e) => onKey(e, id)}
          >
            <g className="fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            <rect
              className="node-bg"
              width={COL_W}
              height={NODE_H}
              rx={14}
              filter={isFocus ? 'url(#nodeShadow)' : undefined}
              style={{
                fill: isSelected ? 'var(--rose-soft)' : 'var(--surface)',
                stroke: isFocus || isSelected ? color : 'var(--line-strong)',
                strokeWidth: isFocus || isSelected ? 1.8 : 1,
                transition: 'fill .3s, stroke .3s',
              }}
            />
            <rect x={0.5} y={13} width={3} height={NODE_H - 26} rx={1.5} style={{ fill: color }} />
            <circle cx={0} cy={NODE_H / 2} r={3} style={{ fill: 'var(--surface)', stroke: color, strokeWidth: 1.4 }} />
            <circle cx={COL_W} cy={NODE_H / 2} r={3} style={{ fill: color }} />
            {lines.length === 1 ? (
              <>
                <text x={14} y={22} style={{ fill: 'var(--fg)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                  {lines[0]}
                </text>
                <text x={14} y={38} style={{ fill: 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}>
                  {node.tag}
                </text>
              </>
            ) : (
              <text x={14} y={21} style={{ fill: 'var(--fg)', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                <tspan x={14}>{lines[0]}</tspan>
                <tspan x={14} dy={15}>
                  {lines[1]}
                </tspan>
              </text>
            )}
            </g>
          </g>
        );
      })}

      <text x={layout.width - 22} y={layout.height - 2} textAnchor="end" style={{ fill: 'var(--muted)', fontSize: 9.5, fontFamily: 'var(--font-mono)' }}>
        {`${view.nodes.length} components · ${view.edges.length} data flows`}
      </text>
    </svg>
  );
}
