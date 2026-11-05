import { useState } from 'react';
import { ArrowUpRight, BookOpen, Globe, Check, Copy, GraduationCap, Mail, MapPin, Quote } from '../components/ui/icons';
import { education, trainings, type Credential } from '../data/credentials';
import { profile } from '../data/profile';
import { roles } from '../data/experience';
import { useUI } from '../context/UIContext';
import { copyText } from '../lib/clipboard';
import { LinkedInIcon } from '../components/ui/Icon';
import { Magnetic, MiniHeading, Reveal, SectionHeading, asset, cx } from '../components/ui/primitives';
import { LearnGlyph, PersonGlyph } from '../components/ui/DataIcons';

function BadgeSlot({ c }: { c: Credential }) {
  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border border-line bg-white p-4 shadow-[0_10px_24px_-16px_rgb(var(--shadow-rgb)/0.5)]">
      {c.badgeImage ? (
        <img src={asset(c.badgeImage)} alt={`${c.issuer} logo`} className="h-full w-full object-contain" loading="lazy" />
      ) : (
        <BookOpen size={30} weight="duotone" className="text-rose-ink" aria-hidden="true" />
      )}
    </div>
  );
}

/** PUP seal from /public/badges/pup-logo.png, with a graduation cap if the file is missing. */
function SchoolLogo() {
  const [missing, setMissing] = useState(false);
  return (
    <span className="relative grid h-24 w-24 place-items-center rounded-full bg-white p-1.5 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.6)]">
      {missing ? (
        <GraduationCap size={44} weight="duotone" className="text-rose-ink" aria-hidden="true" />
      ) : (
        <img src={asset('badges/pup-logo.png')} alt="Polytechnic University of the Philippines seal" className="h-full w-full rounded-full object-contain" onError={() => setMissing(true)} />
      )}
    </span>
  );
}

export function Credentials() {
  return (
    <section id="certifications" aria-labelledby="cred-title">
      <div>
        <SectionHeading index="06" eyebrow="Certifications & Education" icon={LearnGlyph} title={<span id="cred-title">Certifications</span>} subtitle="Formal education and the training behind my analytics and marketing toolkit." />

        <div className="grid gap-5 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <article className="relative h-full overflow-hidden rounded-[2rem] bg-ink p-7 text-ink-fg">
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-rose/25 blur-3xl" aria-hidden="true" />
              <SchoolLogo />
              <p className="relative mt-8 font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">Education</p>
              <h3 className="relative mt-2 font-serif text-3xl font-medium leading-tight">{education.title}</h3>
              <p className="relative mt-2 text-sm opacity-80">{education.issuer}</p>
              <p className="relative mt-1 font-mono text-xs opacity-70">{education.date}</p>
              <p className="relative mt-6 text-sm leading-relaxed opacity-85">{education.description}</p>
            </article>
          </Reveal>
          <div className="grid gap-4 lg:col-span-3">
            {trainings.map((t, i) => (
              <Reveal key={t.id} delay={i * 90}>
                <article className="lift flex h-full gap-5 rounded-3xl border border-line bg-surface p-5">
                  <BadgeSlot c={t} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen size={13} className="text-rose-ink" aria-hidden="true" />
                      <span className="eyebrow !text-[10px]">Training · {t.issuer}</span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug text-fg">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted">{t.description}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {t.topics.map((x) => (
                        <li key={x} className="chip chip-mono !py-0.5">
                          {x}
                        </li>
                      ))}
                    </ul>
                    {t.verifyUrl && (
                      <a href={t.verifyUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-rose-ink hover:underline">
                        View credential <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const a = profile.about;
  const current = roles[0];
  const facts = [
    { k: 'Based in', v: profile.location },
    { k: 'Currently', v: `${current.title}, TP-Link Philippines` },
    { k: 'Studied', v: `${education.title}, PUP` },
    { k: 'Focus', v: 'BI · Analytics · Automation' },
  ];
  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      <MiniHeading icon={PersonGlyph}>About me</MiniHeading>
      <div className="grid gap-10 rounded-[2rem] border border-line bg-gradient-to-br from-surface via-surface to-blush p-6 sm:p-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
            {/* Circular headshot, cropped in on the face like a profile picture. */}
            <span className="relative block h-[88px] w-[88px] shrink-0 rounded-full bg-[linear-gradient(135deg,var(--rose),var(--gold))] p-[3px] sm:h-28 sm:w-28">
              <span className="block h-full w-full overflow-hidden rounded-full border-[3px] border-surface bg-surface">
                <img
                  src={asset(profile.portrait)}
                  alt={profile.name}
                  width={400}
                  height={400}
                  draggable={false}
                  className="h-full w-full object-cover"
                  style={{ transform: 'scale(1.25)', transformOrigin: '50% 38%' }}
                />
              </span>
            </span>
            <h2 id="about-title" className="display text-5xl text-fg">
              {a.title}
            </h2>
          </div>
          <Reveal>
            <div className="relative">
              <Quote size={36} className="absolute -left-2 -top-6 text-rose/40" aria-hidden="true" />
              <div className="grid gap-5 font-serif text-[1.55rem] leading-snug text-fg sm:text-[1.8rem]">
                {a.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-6 font-serif text-2xl italic text-rose-ink">— {profile.firstName}</p>
            </div>
          </Reveal>
        </div>
        <div className="grid content-end gap-4 lg:col-span-5">
          <Reveal>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {facts.map((f) => (
                <div key={f.k} className="bg-surface p-4">
                  <dt className="eyebrow !text-[10px]">{f.k}</dt>
                  <dd className="mt-1.5 text-sm font-medium text-fg">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          {a.principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="flex gap-4 rounded-3xl border border-line bg-surface p-5">
                <span className="font-serif text-3xl italic leading-none text-rose">{i + 1}</span>
                <div>
                  <p className="font-semibold text-fg">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { notify } = useUI();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const ok = await copyText(profile.email);
    if (ok) {
      setCopied(true);
      notify('Email copied to clipboard');
      window.setTimeout(() => setCopied(false), 2000);
    } else notify(`Copy unavailable — email: ${profile.email}`);
  };

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-ink-fg sm:px-12 md:py-24">
            <div className="aurora pointer-events-none absolute -inset-[20%] opacity-40" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] opacity-70">07 · Contact</p>
              <h2 id="contact-title" className="display mt-5 text-5xl sm:text-6xl md:text-7xl">
                {profile.contact.title.split(' ').slice(0, -1).join(' ')} <em className="text-rose">{profile.contact.title.split(' ').slice(-1)}</em>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-80">{profile.contact.subtitle}</p>

              <button
                type="button"
                onClick={copy}
                className="group mx-auto mt-10 inline-flex max-w-full items-center gap-4 rounded-3xl border border-white/15 bg-white/5 p-2 pl-6 text-left backdrop-blur transition-colors hover:border-rose/60 hover:bg-white/10 dark:border-black/10 dark:bg-black/5 dark:hover:bg-black/10"
                aria-label={`Copy email address ${profile.email}`}
                title="Click to copy"
              >
                <span className="min-w-0 truncate font-mono text-sm sm:text-base">{profile.email}</span>
                <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors', copied ? 'bg-sage text-white' : 'bg-ink-fg/10 group-hover:bg-rose group-hover:text-plum dark:group-hover:text-ink-fg')} aria-hidden="true">
                  {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
                </span>
              </button>
              <p className="mt-2 h-4 text-xs opacity-60" aria-live="polite">{copied ? 'Copied to clipboard' : 'Click the email to copy it'}</p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Magnetic>
                  <a href={`mailto:${profile.email}`} className="btn bg-rose text-plum hover:bg-rose/90 dark:text-ink-fg">
                    <Mail size={16} aria-hidden="true" /> Open email app
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn border border-ink-fg/25 text-ink-fg hover:bg-ink-fg/10">
                    <LinkedInIcon size={15} /> LinkedIn
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href={profile.company.url} target="_blank" rel="noopener noreferrer" className="btn border border-ink-fg/25 text-ink-fg hover:bg-ink-fg/10">
                    <Globe size={16} aria-hidden="true" /> {profile.company.name}
                  </a>
                </Magnetic>
              </div>
              <p className="mt-10 inline-flex items-center gap-1.5 text-xs opacity-60">
                <MapPin size={12} aria-hidden="true" /> {profile.location} · open to analytics & BI conversations
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
