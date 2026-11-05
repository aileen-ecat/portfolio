import type { CSSProperties } from 'react';
import type { DemoKey } from '../../data/projects';

/** Small abstract illustration for each project card (pure SVG, no data). */
export function ProjectPreview({ kind }: { kind: DemoKey }) {
  const common = { viewBox: '0 0 240 120', className: 'h-full w-full', 'aria-hidden': true } as const;
  switch (kind) {
    case 'sales':
      return (
        <svg {...common}>
          {[38, 62, 48, 80, 70, 96].map((h, i) => (
            <rect key={i} x={22 + i * 22} y={100 - h} width={14} height={h} rx={4} style={{ fill: i === 5 ? 'var(--rose-ink)' : 'var(--rose)', opacity: i === 5 ? 1 : 0.35 + i * 0.08 }} />
          ))}
          <path d="M170 86 C185 70, 195 78, 205 56 S 222 30, 228 26" fill="none" style={{ stroke: 'var(--mauve)' }} strokeWidth={2} strokeLinecap="round" />
          <circle cx={228} cy={26} r={4} style={{ fill: 'var(--mauve)' }} />
        </svg>
      );
    case 'pricing':
      return (
        <svg {...common}>
          <line x1={20} x2={220} y1={60} y2={60} style={{ stroke: 'var(--line-strong)' }} strokeDasharray="4 4" />
          <rect x={20} y={48} width={200} height={24} rx={6} style={{ fill: 'var(--sage)', opacity: 0.12 }} />
          {[[40, 58], [70, 64], [96, 40], [124, 61], [150, 88], [176, 57], [204, 92]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={6} style={{ fill: y > 74 || y < 46 ? 'var(--alert)' : 'var(--rose)', opacity: 0.85 }} />
          ))}
        </svg>
      );
    case 'automation':
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={14 + i * 58} y={42} width={40} height={36} rx={10} style={{ fill: i === 3 ? 'var(--rose-soft)' : 'var(--surface)', stroke: i === 3 ? 'var(--rose-ink)' : 'var(--line-strong)' }} />
              {i < 3 && <path d={`M${56 + i * 58} 60 H${70 + i * 58}`} style={{ stroke: 'var(--mauve)' }} strokeWidth={1.5} className="flow-dash" />}
            </g>
          ))}
          <text x={34} y={64} textAnchor="middle" style={{ fill: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>xlsx</text>
          <text x={208} y={64} textAnchor="middle" style={{ fill: 'var(--rose-ink)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>memo</text>
        </svg>
      );
    case 'ecommerce':
      return (
        <svg {...common}>
          <circle cx={70} cy={60} r={36} fill="none" style={{ stroke: 'var(--line)' }} strokeWidth={14} />
          {[
            ['var(--rose)', 0, 0.38],
            ['var(--mauve)', 0.38, 0.26],
            ['var(--lavender)', 0.64, 0.18],
            ['var(--gold)', 0.82, 0.18],
          ].map(([c, off, len], i) => (
            <circle
              key={i}
              cx={70}
              cy={60}
              r={36}
              fill="none"
              strokeWidth={14}
              pathLength={1}
              strokeDasharray={`${Number(len) - 0.01} 1`}
              strokeDashoffset={-Number(off)}
              transform="rotate(-90 70 60)"
              style={{ stroke: c as string } as CSSProperties}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={130} y={28 + i * 18} width={30 + (4 - i) * 16} height={9} rx={4.5} style={{ fill: ['var(--rose)', 'var(--mauve)', 'var(--lavender)', 'var(--gold)'][i], opacity: 0.8 }} />
          ))}
        </svg>
      );
    case 'sql':
      return (
        <svg {...common}>
          <rect x={16} y={16} width={208} height={88} rx={12} style={{ fill: 'var(--surface)', stroke: 'var(--line-strong)' }} />
          {[
            ['SELECT', 'sku, SUM(qty)', 34],
            ['FROM', 'orders', 54],
            ['GROUP BY', 'sku;', 74],
          ].map(([k, v, y]) => (
            <text key={k as string} x={30} y={y as number} style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              <tspan style={{ fill: 'var(--rose-ink)', fontWeight: 600 }}>{k}</tspan>
              <tspan style={{ fill: 'var(--fg)' }}> {v}</tspan>
            </text>
          ))}
          <rect x={30} y={84} width={6} height={12} style={{ fill: 'var(--rose)' }}>
            <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite" />
          </rect>
        </svg>
      );
    case 'monitoring':
      return (
        <svg {...common}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <circle cx={24 + i * 38} cy={60} r={11} style={{ fill: i === 3 ? 'var(--alert)' : i === 5 ? 'var(--sage)' : 'var(--surface)', stroke: i === 3 || i === 5 ? 'none' : 'var(--rose)', opacity: i === 3 ? 0.85 : 1 }} strokeWidth={2} />
              {i < 5 && <line x1={35 + i * 38} x2={51 + i * 38} y1={60} y2={60} style={{ stroke: 'var(--line-strong)' }} strokeWidth={2} />}
            </g>
          ))}
          <text x={138} y={64} textAnchor="middle" style={{ fill: '#fff', fontSize: 11, fontWeight: 700 }}>!</text>
          <path d="M209 60 l4 4 l7 -8" fill="none" stroke="#fff" strokeWidth={2} />
        </svg>
      );
  }
}
