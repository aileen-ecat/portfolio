import { useEffect, useRef, useState } from 'react';
import type { Database, SqlValue } from 'sql.js';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Database as DbIcon, LoaderCircle, Play, RotateCcw, TriangleExclamationPoint } from '../../ui/icons';
import wasmUrl from 'sql.js/dist/sql-wasm-browser.wasm?url';
import { PRESET_QUERIES, SQL_SEED } from '../../../data/demo/sqlSeed';
import { useChartColors } from '../../../context/UIContext';
import { useReducedMotion } from '../../../hooks';
import { highlight } from '../../ui/Code';
import { ChartTooltip } from '../../ui/chart';
import { DemoLabel, cx } from '../../ui/primitives';

type Result = { columns: string[]; values: SqlValue[][]; ms: number };

let dbPromise: Promise<Database> | null = null;
function getDb() {
  if (!dbPromise) {
    dbPromise = import('sql.js').then(async ({ default: initSqlJs }) => {
      const SQL = await initSqlJs({ locateFile: () => wasmUrl });
      const db = new SQL.Database();
      db.run(SQL_SEED);
      return db;
    });
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }
  return dbPromise;
}

function SqlEditor({ value, onChange, onRun }: { value: string; onChange: (v: string) => void; onRun: () => void }) {
  const preRef = useRef<HTMLPreElement>(null);
  return (
    <div className="relative h-64 overflow-hidden rounded-2xl border border-line bg-surface-2 font-mono text-[12.5px] leading-[1.6] focus-within:border-rose">
      <pre ref={preRef} aria-hidden="true" className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap break-words p-4 text-fg">
        {highlight(value, 'sql')}
        {'\n'}
      </pre>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (preRef.current) preRef.current.scrollTop = e.currentTarget.scrollTop;
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onRun();
          }
        }}
        spellCheck={false}
        aria-label="SQL query editor. Press Ctrl+Enter to run."
        className="absolute inset-0 h-full w-full resize-none overflow-auto whitespace-pre-wrap break-words bg-transparent p-4 text-transparent caret-[var(--rose-ink)] outline-none selection:bg-rose/30"
      />
    </div>
  );
}

export default function SqlDemo() {
  const c = useChartColors();
  const reduced = useReducedMotion();
  const [presetId, setPresetId] = useState(PRESET_QUERIES[2].id);
  const [sql, setSql] = useState(PRESET_QUERIES[2].sql);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [queryError, setQueryError] = useState('');
  const preset = PRESET_QUERIES.find((p) => p.id === presetId);

  const run = async (text = sql) => {
    try {
      const db = await getDb();
      const t0 = performance.now();
      const res = db.exec(text);
      const ms = performance.now() - t0;
      setQueryError('');
      const last = res[res.length - 1];
      setResult(last ? { columns: last.columns, values: last.values, ms } : { columns: [], values: [], ms });
    } catch (err) {
      setQueryError(err instanceof Error ? err.message : String(err));
      setResult(null);
    }
  };

  useEffect(() => {
    let alive = true;
    getDb()
      .then(() => {
        if (!alive) return;
        setStatus('ready');
        run(PRESET_QUERIES[2].sql);
      })
      .catch((err) => {
        if (!alive) return;
        setStatus('error');
        setLoadError(err instanceof Error ? err.message : 'Could not load the SQL engine.');
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (id: string) => {
    const p = PRESET_QUERIES.find((q) => q.id === id)!;
    setPresetId(id);
    setSql(p.sql);
    if (status === 'ready') run(p.sql);
  };

  // Auto-chart when the result has a text label column and a numeric last column.
  const chartable =
    result && result.values.length > 1 && result.values.length <= 16 && result.columns.length >= 2 && typeof result.values[0][result.columns.length - 1] === 'number' && typeof result.values[0][0] === 'string';
  const chartData = chartable ? result!.values.map((row) => ({ label: String(row[0]), value: Number(row[row.length - 1]) })) : [];

  return (
    <div className="grid gap-4">
      <DemoLabel>Demonstrative SQL running on a fictional dataset in your browser (SQLite via WebAssembly). Not production queries or company records.</DemoLabel>

      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Example queries">
          {PRESET_QUERIES.map((q) => (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={q.id === presetId}
              onClick={() => choose(q.id)}
              className={cx('rounded-xl border px-3 py-2 text-left transition-colors', q.id === presetId ? 'border-rose bg-rose-soft' : 'border-line hover:border-rose')}
            >
              <span className="block font-mono text-xs font-semibold text-fg">{q.label}</span>
              <span className="block text-[11px] text-muted">{q.concept}</span>
            </button>
          ))}
        </div>
        {preset && <p className="mt-3 text-sm text-muted">Business question: <span className="text-fg">{preset.question}</span></p>}

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
          <SqlEditor value={sql} onChange={(v) => { setSql(v); setPresetId(''); }} onRun={() => run()} />
          <div className="rounded-2xl border border-line p-4 text-xs">
            <div className="flex items-center gap-2 font-semibold text-fg">
              <DbIcon size={14} className="text-rose-ink" aria-hidden="true" /> Schema
            </div>
            <dl className="mt-3 grid gap-3 font-mono text-[11px]">
              <div>
                <dt className="text-rose-ink">orders</dt>
                <dd className="text-muted">order_id, order_date, partner_id, sku, qty, unit_price</dd>
              </div>
              <div>
                <dt className="text-rose-ink">products</dt>
                <dd className="text-muted">sku, product_name, category, list_price</dd>
              </div>
              <div>
                <dt className="text-rose-ink">partners</dt>
                <dd className="text-muted">partner_id, partner_name, segment, region</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => run()} disabled={status !== 'ready'}>
            {status === 'loading' ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
            {status === 'loading' ? 'Loading SQLite…' : 'Run query'}
          </button>
          {preset === undefined && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => choose(PRESET_QUERIES[2].id)}>
              <RotateCcw size={14} aria-hidden="true" /> Reset
            </button>
          )}
          <span className="font-mono text-[11px] text-muted">Ctrl / ⌘ + Enter to run · edit freely</span>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-4 sm:p-5" aria-live="polite">
        {status === 'error' && (
          <div className="flex items-start gap-3 rounded-2xl bg-alert/10 p-4 text-sm text-alert">
            <TriangleExclamationPoint size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">The SQL engine could not be loaded.</p>
              <p className="mt-1 text-xs opacity-80">{loadError}</p>
            </div>
          </div>
        )}
        {status === 'loading' && <div className="shimmer h-40 rounded-2xl" />}
        {queryError && (
          <div className="flex items-start gap-3 rounded-2xl bg-alert/10 p-4 text-sm text-alert">
            <TriangleExclamationPoint size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">Query error</p>
              <p className="mt-1 font-mono text-xs">{queryError}</p>
            </div>
          </div>
        )}
        {result && (
          <div className="grid gap-4">
            <p className="font-mono text-[11px] text-muted">
              {result.values.length} row{result.values.length === 1 ? '' : 's'} · {result.ms.toFixed(1)} ms
            </p>
            {result.columns.length === 0 ? (
              <p className="text-sm text-muted">Statement executed. No rows returned.</p>
            ) : (
              <div className="scrollbar-thin max-h-72 overflow-auto rounded-2xl border border-line">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="sticky top-0 bg-surface-2">
                    <tr>
                      {result.columns.map((col) => (
                        <th key={col} className="whitespace-nowrap px-3 py-2 font-mono text-[10.5px] font-medium uppercase tracking-wider text-muted">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.values.map((row, i) => (
                      <tr key={i} className="border-t border-line/60">
                        {row.map((v, j) => (
                          <td key={j} className={cx('whitespace-nowrap px-3 py-1.5', typeof v === 'number' ? 'text-right tabular-nums' : 'text-fg')}>
                            {v === null ? <span className="text-muted">NULL</span> : typeof v === 'number' ? v.toLocaleString('en-US') : String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {chartable && (
              <div className="h-56 rounded-2xl border border-line p-3">
                <p className="mb-1 text-xs font-semibold text-fg">
                  {result.columns[result.columns.length - 1]} by {result.columns[0]} <span className="font-normal text-muted">· auto-chart</span>
                </p>
                <ResponsiveContainer width="100%" height="88%">
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: c.axis, fontSize: 10 }} axisLine={false} tickLine={false} width={60} tickFormatter={(v) => Intl.NumberFormat('en', { notation: 'compact' }).format(v)} />
                    <Tooltip cursor={{ fill: c.grid, opacity: 0.5 }} content={<ChartTooltip valueFormatter={(v) => v.toLocaleString('en-US')} />} />
                    <Bar dataKey="value" name={result.columns[result.columns.length - 1]} fill={c.rose} radius={[5, 5, 0, 0]} isAnimationActive={!reduced} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
