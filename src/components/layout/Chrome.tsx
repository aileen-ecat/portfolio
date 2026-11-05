import { useEffect, useRef } from 'react';
import { ArrowUp, Check } from '../ui/icons';
import { profile } from '../../data/profile';
import { useUI } from '../../context/UIContext';
import { LinkedInIcon } from '../ui/Icon';

/** Thin reading-progress bar at the very top of the page. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="no-print fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden="true">
      <div ref={ref} className="h-full origin-left bg-gradient-to-r from-rose via-mauve to-lavender" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}

export function Toast() {
  const { toast } = useUI();
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4" role="status" aria-live="polite">
      {toast && (
        <div key={toast} className="pop-in flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm text-ink-fg shadow-xl">
          <Check size={16} aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}

export function Footer() {
  const { scrollToSection } = useUI();
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-serif text-2xl italic text-fg">{profile.name}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Data Analytics · Business Intelligence · Automation</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-muted md:items-end">
          <div className="flex items-center gap-2">
            <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
              <LinkedInIcon size={16} />
            </a>
            <button type="button" className="icon-btn" onClick={() => scrollToSection('overview')} aria-label="Back to top">
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="max-w-md text-xs md:text-right">
            © {new Date().getFullYear()} {profile.name}. All dashboards, simulators and demo datasets on this site use illustrative data — not actual company records.
          </p>
        </div>
      </div>
    </footer>
  );
}
