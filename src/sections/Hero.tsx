import { type CSSProperties } from 'react';
import { ArrowRight } from '../components/ui/icons';
import { heroMetrics, metricsFootnote, profile } from '../data/profile';
import { ParticleMorph } from '../components/hero/ParticleMorph';
import { CaseGlyph, FlowGlyph } from '../components/ui/DataIcons';
import { CountUp, Magnetic, Reveal, cx } from '../components/ui/primitives';

const TOOL_CHIPS: { label: string; tone?: 'rose' | 'gold' }[] = [
  { label: 'Power BI', tone: 'rose' },
  { label: 'Excel VBA', tone: 'rose' },
  { label: 'SQL' },
  { label: 'Power Query' },
  { label: 'DAX' },
  { label: 'Shopee', tone: 'gold' },
  { label: 'Lazada', tone: 'gold' },
  { label: 'TikTok Shop', tone: 'gold' },
  { label: 'Meta Ads' },
  { label: 'Google Ads' },
];

function AnimatedHeadline({ text, accent }: { text: string; accent: string }) {
  const words = text.split(' ');
  return (
    <h1 className="display text-[3rem] leading-[0.98] text-fg sm:text-[4.2rem] xl:text-[5rem]">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const isAccent = accent.split(' ').includes(w);
          return (
            <span key={`${w}-${i}`}>
              <span className="word-mask">
                <span className={cx('word', isAccent && 'italic text-gradient pr-2')} style={{ '--d': `${150 + i * 110}ms` } as CSSProperties}>
                  {w}
                </span>
              </span>
              {i === 1 ? <br /> : null}{' '}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

export function Hero() {
  const h = profile.hero;

  return (
    <section id="hero" aria-label="Introduction" className="relative">
      <div className="grid min-h-[calc(100svh-var(--masthead-h,140px)-2.5rem)] items-center gap-10 pb-10 lg:min-h-[calc(100svh-var(--masthead-h,140px)-3.5rem)] lg:grid-cols-[1fr_1.08fr] lg:gap-10">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-rose-ink">
              <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true" className="shrink-0">
                <rect x="0" y="8" width="4" height="6" rx="1" className="fill-rose" />
                <rect x="6" y="4" width="4" height="10" rx="1" className="fill-gold" />
                <rect x="12" y="6" width="4" height="8" rx="1" className="fill-lavender" />
                <rect x="18" y="0" width="4" height="14" rx="1" className="fill-rose-ink" />
              </svg>
              {h.status}
            </p>
          </Reveal>

          <div className="mt-6">
            <AnimatedHeadline text={h.headline} accent={h.accentWord} />
          </div>

          <Reveal delay={550}>
            <p className="mt-6 border-l-2 border-gold pl-4 font-mono text-xs uppercase tracking-[0.18em] text-mauve">{h.subheadline}</p>
          </Reveal>
          <Reveal delay={650}>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted text-pretty">{h.intro}</p>
          </Reveal>

          <Reveal delay={800}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#projects" className="btn btn-primary group">
                  <CaseGlyph size={17} /> See Case Studies
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#architecture" className="btn btn-secondary group">
                  <FlowGlyph size={17} /> How My Data Flows
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={900}>
            <div className="mt-9">
              <p className="eyebrow !text-[10px]">Works with</p>
              <ul className="mt-3 flex flex-wrap gap-x-1.5 gap-y-2" aria-label="Core tools and platforms">
                {TOOL_CHIPS.map((t) => (
                  <li
                    key={t.label}
                    className={cx(
                      'rounded-md border-b-2 px-2 py-1 font-mono text-[11px]',
                      t.tone === 'rose' ? 'border-rose bg-rose-soft text-rose-ink' : t.tone === 'gold' ? 'border-gold bg-champagne/70 text-fg' : 'border-line-strong bg-surface text-fg',
                    )}
                  >
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={250}>
          <div className="relative mx-auto w-full max-w-[620px]">
            <ParticleMorph />
          </div>
        </Reveal>
      </div>

      <div className="mt-6">
        <div className="ledger overflow-hidden rounded-[1.75rem] border border-transparent bg-ink text-ink-fg dark:border-line">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-fg/10 px-6 py-4 sm:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-fg/70">Impact ledger · TP-Link Philippines</p>
            <p className="font-mono text-[10px] text-ink-fg/50">2023 – present</p>
          </div>
          <ul className="grid sm:grid-cols-2 xl:grid-cols-4" aria-label="Verified impact metrics">
            {heroMetrics.map((m, i) => (
              <Reveal as="li" key={m.id} delay={i * 90} className="group relative border-ink-fg/10 px-6 py-7 sm:px-8 [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l xl:[&:not(:first-child)]:border-l xl:[&:not(:first-child)]:border-t-0">
                <div className="font-serif text-[2.75rem] leading-none tracking-tight">
                  <CountUp value={m.value} prefix={m.prefix} suffix={m.suffix} grouped={m.grouped} />
                </div>
                <span className="mt-4 flex h-1.5 gap-0.5" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, k) => (
                    <span key={k} className={cx('flex-1 rounded-full transition-colors duration-700', k < 4 + i * 2 ? (i % 2 ? 'bg-gold' : 'bg-rose') : 'bg-ink-fg/15')} />
                  ))}
                </span>
                <p className="mt-4 text-sm font-semibold">{m.label}</p>
                <p className="mt-1 text-sm leading-snug text-ink-fg/65">{m.detail}</p>
              </Reveal>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-xs text-muted">{metricsFootnote}</p>
      </div>
    </section>
  );
}
