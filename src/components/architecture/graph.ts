import { archNodes, stages, type ArchView, type StageId } from '../../data/architecture';

export const COL_W = 176;
export const NODE_H = 50;
export const ROW = 64;
export const GAP = 46;
export const PAD_X = 22;
export const HEAD = 74;

export type Point = { x: number; y: number };
export type Layout = { pos: Record<string, Point>; width: number; height: number; colX: number[] };

export function layoutView(view: ArchView): Layout {
  const cols = stages.map((s) => view.nodes.filter((id) => archNodes[id]?.stage === s.id));
  const maxRows = Math.max(...cols.map((c) => c.length));
  const bodyH = maxRows * ROW;
  const pos: Record<string, Point> = {};
  const colX: number[] = [];
  cols.forEach((col, ci) => {
    const x = PAD_X + ci * (COL_W + GAP);
    colX.push(x);
    const offset = (bodyH - col.length * ROW) / 2;
    col.forEach((id, ri) => {
      pos[id] = { x, y: HEAD + offset + ri * ROW + (ROW - NODE_H) / 2 };
    });
  });
  return { pos, width: PAD_X * 2 + stages.length * COL_W + (stages.length - 1) * GAP, height: HEAD + bodyH + 18, colX };
}

export function edgePath(a: Point, b: Point) {
  const x1 = a.x + COL_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const c = (x2 - x1) * 0.5;
  return `M${x1},${y1} C${x1 + c},${y1} ${x2 - c},${y2} ${x2},${y2}`;
}

export const edgeKey = (e: [string, string]) => `${e[0]}>${e[1]}`;

/** All nodes and edges upstream and downstream of `id`. */
export function lineage(id: string, edges: [string, string][]) {
  const nodes = new Set<string>([id]);
  const keys = new Set<string>();
  const walk = (start: string, dir: 'down' | 'up') => {
    const stack = [start];
    const seen = new Set<string>();
    while (stack.length) {
      const cur = stack.pop()!;
      if (seen.has(cur)) continue;
      seen.add(cur);
      for (const e of edges) {
        const [from, to] = e;
        const next = dir === 'down' ? (from === cur ? to : null) : to === cur ? from : null;
        if (next) {
          keys.add(edgeKey(e));
          nodes.add(next);
          stack.push(next);
        }
      }
    }
  };
  walk(id, 'down');
  walk(id, 'up');
  return { nodes, keys };
}

export function neighbours(id: string, edges: [string, string][]) {
  return {
    upstream: edges.filter(([, to]) => to === id).map(([from]) => from),
    downstream: edges.filter(([from]) => from === id).map(([, to]) => to),
  };
}

export function stageOf(id: string): StageId {
  return archNodes[id].stage;
}

/** Split a label into at most two lines of ~maxChars. */
export function wrapLabel(label: string, maxChars = 21): string[] {
  if (label.length <= maxChars) return [label];
  const words = label.split(' ');
  let line1 = '';
  let i = 0;
  while (i < words.length && (line1 + ' ' + words[i]).trim().length <= maxChars) {
    line1 = (line1 + ' ' + words[i]).trim();
    i++;
  }
  return [line1, words.slice(i).join(' ')];
}
