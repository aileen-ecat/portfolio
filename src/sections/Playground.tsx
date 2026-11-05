import { NAV_ICONS } from '../components/layout/Header';
import { lazy, Suspense, useState } from 'react';
import { ChartArea, Gauge, Scale } from '../components/ui/icons';
import { LoadingPanel, Reveal, SectionHeading, cx } from '../components/ui/primitives';

const RoasSimulator = lazy(() => import('../components/playground/RoasSimulator'));
const SalesExplorer = lazy(() => import('../components/playground/SalesExplorer'));
const ComplianceChecker = lazy(() => import('../components/playground/ComplianceChecker'));

const DEMOS = [
  { id: 'roas', letter: 'A', title: 'Marketing ROAS Simulator', blurb: 'Budget, traffic, CVR & AOV in; ROAS, ACoS and CPA out', icon: Gauge, Cmp: RoasSimulator },
  { id: 'sales', letter: 'B', title: 'Sales Performance Explorer', blurb: 'Filter months, categories & marketplaces', icon: ChartArea, Cmp: SalesExplorer },
  { id: 'compliance', letter: 'C', title: 'Pricing Compliance Checker', blurb: 'Authorized vs observed price, with tolerance', icon: Scale, Cmp: ComplianceChecker },
];

export function Playground() {
  const [active, setActive] = useState(DEMOS[0].id);
  const demo = DEMOS.find((d) => d.id === active)!;
  const Cmp = demo.Cmp;

  return (
    <section id="playground" aria-labelledby="playground-title" className="relative">
      <div>
        <SectionHeading index="03" icon={NAV_ICONS.playground} eyebrow="Data Playground" title={<span id="playground-title">Explore the Numbers</span>} subtitle="Analytics is easier to understand when you can interact with it. Every control below recalculates instantly in your browser." />

        <Reveal>
          <div role="tablist" aria-label="Simulators" className="grid gap-3 md:grid-cols-3">
            {DEMOS.map((d) => {
              const on = d.id === active;
              const I = d.icon;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  id={`pg-tab-${d.id}`}
                  aria-selected={on}
                  aria-controls="pg-panel"
                  onClick={() => setActive(d.id)}
                  className={cx('group flex items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-500', on ? 'border-transparent bg-ink text-ink-fg shadow-xl' : 'border-line bg-surface hover:border-rose')}
                >
                  <span className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors', on ? 'bg-rose text-plum dark:text-ink-fg' : 'bg-rose-soft text-rose-ink')}>
                    <I size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className={cx('block font-mono text-[10px] uppercase tracking-widest', on ? 'opacity-70' : 'text-muted')}>Demo {d.letter}</span>
                    <span className="block font-semibold">{d.title}</span>
                    <span className={cx('block truncate text-xs', on ? 'opacity-70' : 'text-muted')}>{d.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div id="pg-panel" role="tabpanel" aria-labelledby={`pg-tab-${demo.id}`} className="mt-6">
          <div key={demo.id} className="pop-in rounded-[2rem] border border-line bg-canvas/70 p-4 backdrop-blur sm:p-6">
            <Suspense fallback={<LoadingPanel label="Loading simulator…" />}>
              <Cmp />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
