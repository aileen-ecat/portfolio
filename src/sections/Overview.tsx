import { ArrowRight } from '../components/ui/icons';
import { CaseGlyph } from '../components/ui/DataIcons';
import { projects } from '../data/projects';
import { useUI } from '../context/UIContext';
import { MiniHeading } from '../components/ui/primitives';
import { Hero } from './Hero';
import { Services } from './Services';
import { ProjectCard } from './Projects';
import { About } from './Closing';

/** Number of case studies previewed on the overview. */
const FEATURED = 3;

export function Overview() {
  const { openProject } = useUI();
  return (
    <div className="grid gap-16 md:gap-20">
      <Hero />
      <Services />
      <section aria-labelledby="featured-title">
        <MiniHeading
          icon={CaseGlyph}
          id="featured-title"
          action={
            <a href="#projects" className="group inline-flex items-center gap-1.5 text-sm font-medium text-rose-ink">
              All projects <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          }
        >
          Featured projects
        </MiniHeading>
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, FEATURED).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => openProject(p.id)} />
          ))}
        </ul>
      </section>
      <About />
    </div>
  );
}
