import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleCheck, FileText, LoaderCircle, Play, RotateCcw } from '../../ui/icons';
import { CATEGORIES, MONTHS, SALES_ROWS, YEAR } from '../../../data/demo/salesData';
import { useReducedMotion } from '../../../hooks';
import { fmtPeso, fmtSignedPct } from '../../../lib/format';
import { CodeBlock } from '../../ui/Code';
import { DemoLabel, cx } from '../../ui/primitives';

/**
 * Relative effort per step (illustrative units, chosen so the totals reflect the
 * approximate 60% reduction from my VBA automation work: 100 → 40).
 */
const BEFORE = [
  { step: 'Open & copy source workbooks', effort: 22 },
  { step: 'Clean and reformat data', effort: 24 },
  { step: 'Rebuild summaries & pivots', effort: 18 },
  { step: 'Type figures into memo', effort: 20 },
  { step: 'Format, check & save', effort: 16 },
];
const AFTER = [
  { step: 'Drop files into input folder', effort: 4 },
  { step: 'Run macro (consolidate, then format)', effort: 6 },
  { step: 'Review generated report & memo', effort: 22 },
  { step: 'Final edits & share', effort: 8 },
];

const VBA = `' Demonstrative snippet — simplified for readability
Sub BuildMonthlyReport()
    Dim ws As Worksheet, src As Workbook
    Set ws = ThisWorkbook.Sheets("Consolidated")
    ws.Cells.ClearContents

    For Each f In GetInputFiles("\\Inputs\\")
        Set src = Workbooks.Open(f)
        AppendRows src.Sheets(1).UsedRange, ws
        src.Close SaveChanges:=False
    Next f

    ValidateTotals ws          ' flag blanks & mismatches
    RefreshSummaries           ' pivots & KPI table
    GenerateSalesMemo "Memo_Template"
    MsgBox "Report ready for review."
End Sub`;

const STEPS = ['Open input files', 'Consolidate rows', 'Validate totals', 'Refresh summaries', 'Generate memo draft', 'Ready for review'];

export default function AutomationDemo() {
  const reduced = useReducedMotion();
  const [month, setMonth] = useState(9);
  const [step, setStep] = useState(-1);
  const [log, setLog] = useState<string[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const running = step >= 0 && step < STEPS.length;
  const done = step >= STEPS.length;

  const summary = useMemo(() => {
    const cur = SALES_ROWS.filter((r) => r.month === month);
    const prev = SALES_ROWS.filter((r) => r.month === month - 1);
    const rev = cur.reduce((s, r) => s + r.revenue, 0);
    const prevRev = prev.reduce((s, r) => s + r.revenue, 0);
    const byCat = CATEGORIES.map((c) => ({ c, v: cur.filter((r) => r.category === c).reduce((s, r) => s + r.revenue, 0) })).sort((a, b) => b.v - a.v);
    return { rows: cur.length, rev, mom: prevRev ? ((rev - prevRev) / prevRev) * 100 : null, top: byCat[0], second: byCat[1] };
  }, [month]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const run = () => {
    window.clearTimeout(timer.current);
    setLog([]);
    const msgs = [
      `Opened 3 input files for ${MONTHS[month]} ${YEAR}`,
      `Consolidated ${summary.rows} rows into "Consolidated"`,
      'Validation passed: 0 blank SKUs, totals reconcile',
      'Refreshed 4 summary tables',
      'Memo draft generated from template',
      'Done — awaiting human review',
    ];
    let i = 0;
    const tick = () => {
      setStep(i);
      setLog((l) => [...l, msgs[i]]);
      i += 1;
      if (i < msgs.length) timer.current = window.setTimeout(tick, reduced ? 0 : 520);
      else timer.current = window.setTimeout(() => setStep(STEPS.length), reduced ? 0 : 400);
    };
    tick();
  };

  const totalBefore = BEFORE.reduce((s, b) => s + b.effort, 0);
  const totalAfter = AFTER.reduce((s, b) => s + b.effort, 0);

  return (
    <div className="grid gap-4">
      <DemoLabel>Interactive demonstration using illustrative data. Not actual company records. Step efforts are relative units illustrating the ~60% reduction.</DemoLabel>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: 'Before · manual', steps: BEFORE, total: totalBefore, color: 'bg-mauve/70' },
          { title: 'After · VBA-assisted', steps: AFTER, total: totalAfter, color: 'bg-rose' },
        ].map((col) => (
          <div key={col.title} className="rounded-3xl border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-fg">{col.title}</p>
              <p className="font-mono text-xs text-muted">
                effort <span className="text-base font-semibold text-fg">{col.total}</span>
              </p>
            </div>
            <ul className="mt-4 grid gap-2.5">
              {col.steps.map((s) => (
                <li key={s.step} className="text-sm">
                  <div className="flex justify-between gap-2 text-xs">
                    <span className="text-fg">{s.step}</span>
                    <span className="font-mono text-muted">{s.effort}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-line">
                    <div className={cx('h-full rounded-full', col.color)} style={{ width: `${(s.effort / 25) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-rose-soft px-4 py-3 text-sm text-fg">
        <CircleCheck size={18} className="shrink-0 text-rose-ink" aria-hidden="true" />
        Relative effort drops from {totalBefore} to {totalAfter} — about {Math.round((1 - totalAfter / totalBefore) * 100)}% less manual work, with time shifting toward review.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="grid content-start gap-4 rounded-3xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-fg">Report month</span>
              <select value={month} onChange={(e) => { setMonth(Number(e.target.value)); setStep(-1); setLog([]); }} className="field !w-40" disabled={running}>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m} {YEAR}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={run} disabled={running} className="btn btn-primary">
              {running ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : done ? <RotateCcw size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
              {running ? 'Running…' : done ? 'Run again' : 'Run macro'}
            </button>
          </div>
          <ol className="grid gap-1.5" aria-label="Macro progress">
            {STEPS.map((s, i) => (
              <li key={s} className={cx('flex items-center gap-2.5 text-sm transition-colors', i <= step || done ? 'text-fg' : 'text-muted')}>
                <span className={cx('grid h-5 w-5 place-items-center rounded-full border text-[10px] transition-all duration-300', i < step || done ? 'border-transparent bg-sage text-white' : i === step ? 'border-rose-ink text-rose-ink' : 'border-line')}>
                  {i < step || done ? '✓' : i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <div className="min-h-[120px] rounded-2xl bg-ink p-4 font-mono text-[11.5px] leading-relaxed text-ink-fg" role="log" aria-live="polite" aria-label="Macro log">
            {log.length === 0 ? <span className="opacity-60">Immediate window — press “Run macro”.</span> : log.map((l, i) => <div key={i} className="fade-in">› {l}</div>)}
          </div>
        </div>

        <div className={cx('rounded-3xl border p-5 transition-all duration-500', done ? 'border-rose/60 bg-surface' : 'border-dashed border-line-strong bg-surface-2')}>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-rose-ink" aria-hidden="true" />
            <p className="text-sm font-semibold text-fg">Generated memo draft</p>
          </div>
          {done ? (
            <div className="pop-in mt-4 space-y-3 text-sm leading-relaxed text-fg">
              <p className="font-mono text-[11px] text-muted">
                DRAFT · {MONTHS[month]} {YEAR} sales summary · for internal review
              </p>
              <p>
                Total revenue for {MONTHS[month]} was <strong>{fmtPeso(summary.rev)}</strong>
                {summary.mom !== null ? (
                  <>
                    , <strong className={summary.mom >= 0 ? 'text-sage' : 'text-alert'}>{fmtSignedPct(summary.mom)}</strong> versus {MONTHS[month - 1]}.
                  </>
                ) : (
                  '.'
                )}
              </p>
              <p>
                {summary.top.c} led with {fmtPeso(summary.top.v)}, followed by {summary.second.c} at {fmtPeso(summary.second.v)}.
              </p>
              <p className="rounded-xl bg-surface-2 p-3 text-xs text-muted">Status: awaiting review. Nothing is sent automatically from this workflow.</p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted">The memo draft appears here once the macro finishes. Figures are calculated live from the illustrative dataset.</p>
          )}
        </div>
      </div>

      <CodeBlock code={VBA} lang="vba" title="BuildMonthlyReport.bas — demonstrative" />
    </div>
  );
}
