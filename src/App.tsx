import type { ReactNode } from 'react';
import type { ViewId } from './data/navigation';
import { useUI } from './context/UIContext';
import { Masthead } from './components/layout/Header';
import { CommandPalette } from './components/layout/CommandPalette';
import { Footer, ScrollProgress, Toast } from './components/layout/Chrome';
import { CaseStudyModal } from './components/projects/CaseStudyModal';
import { Overview } from './sections/Overview';
import { Architecture } from './sections/Architecture';
import { Projects } from './sections/Projects';
import { Playground } from './sections/Playground';
import { Experience } from './sections/Experience';
import { Skills } from './sections/Skills';
import { Contact, Credentials } from './sections/Closing';

const VIEWS: Record<ViewId, () => ReactNode> = {
  overview: () => <Overview />,
  architecture: () => <Architecture />,
  projects: () => <Projects />,
  playground: () => <Playground />,
  experience: () => <Experience />,
  skills: () => <Skills />,
  certifications: () => <Credentials />,
  contact: () => <Contact />,
};

export default function App() {
  const { view } = useUI();

  return (
    <>
      <ScrollProgress />
      <Masthead />

      <div className="relative min-h-screen">
        {/* Soft ambient background shared by every view */}
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
          <div className="aurora absolute -inset-[10%] opacity-50" />
          <div className="bg-ledger absolute inset-0 opacity-80 [mask-image:linear-gradient(180deg,#000,transparent_75%)]" />
        </div>

        <main id="main" tabIndex={-1} className="outline-none">
          <div key={view} className="container-page fade-up pb-16 pt-10 lg:pt-14">
            {VIEWS[view]()}
          </div>
        </main>
        <Footer />
      </div>

      <CommandPalette />
      <CaseStudyModal />
      <Toast />
    </>
  );
}
