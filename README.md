# Aileen Grace Ecat — Data Analytics Portfolio

*Where data meets elegance.* An interactive portfolio for Data Analytics, Business Intelligence and Reporting Automation.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS v4 · Recharts · Phosphor Icons · sql.js (SQLite in WebAssembly).
No backend, no paid APIs — everything runs in the browser.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Layout

The site is organised as **views**, one shown at a time: Home, Data Flows, Case Studies, Playground, Career, Toolkit, Learning and Contact. A sticky masthead (photo, name, search with Ctrl/⌘ K, LinkedIn, email, theme) sits above a strip of report-style page tabs; on phones the tabs scroll sideways. Each view has its own URL hash (e.g. `#projects`), so links can point straight at one. Case studies open in a slide-in drawer. The Home hero is an abstract vector animation (`src/components/hero/DataMotion.tsx`): scattered data points settle into a trend, a fitted curve draws through them and the latest point lights up, over a slowly flowing layered chart. Icons are [Phosphor](https://phosphoricons.com), imported through `src/components/ui/icons.tsx` and `src/components/ui/DataIcons.tsx`. The view list lives in `src/data/navigation.ts`.

## Edit content without touching components

All copy lives in `src/data/`:

| File | What it controls |
| --- | --- |
| `profile.ts` | Hero text, email, LinkedIn, portrait, impact metrics, About copy |
| `services.ts` | The four "What I Do" cards |
| `architecture.ts` | Architecture stages, nodes, the three pipeline views and the "follow one record" traces |
| `projects.ts` | The six case studies (challenge, role, approach, workflow, results, learnings) |
| `experience.ts` | Career timeline. Items with `placeholder: true` show as dashed "to be added" slots |
| `skills.ts` | Toolkit categories and levels (core / working / developing) |
| `credentials.ts` | Education & training. Add `badgeImage` to show a real certificate |
| `demo/*.ts` | Fictional, seeded datasets used by the demos |

Common tasks:

- **Portrait:** replace `public/images/portrait.jpg`.
- **Badges:** the training cards show the official Power BI, Google Ads and Meta logos from `public/badges/`. To show a certificate image instead, put it in `public/badges/` and set `badgeImage` in `credentials.ts`.
- **Placeholders to fill:** responsibilities/tools for the Robinsons Retail roles (`experience.ts`) and the "Add a confirmed outcome" results in `projects.ts`.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and publishes on every push to `main`. The site appears at `https://<your-username>.github.io/<repo-name>/`.

Asset paths are relative (`base: './'` in `vite.config.ts`), so it works for both project and user sites without changes.

After deploying, update `og:image` in `index.html` to the absolute URL of an image (e.g. `https://<user>.github.io/<repo>/images/portrait.jpg`) so link previews show correctly.

## Project structure

```
src/
  components/
    architecture/   SVG architecture diagram, node detail, record trace, mobile stacked view
    layout/         Masthead and tabs, command palette (Ctrl/⌘ K), scroll progress, cursor, footer
    playground/     ROAS simulator, sales explorer, compliance checker
    projects/       Project previews, case-study modal, demos/ (one per project)
    ui/             Reveal, CountUp, Magnetic, Modal, code highlighting, chart helpers
  context/          Theme, modal state, toast, chart colours
  data/             All editable content + fictional demo datasets
  hooks/            In-view, reduced motion, active section, media query
  lib/              Formatting, clipboard and the pure business formulas (calc.ts)
  sections/         One file per page section
```

## Notes

- Motion is built with CSS and the Web Animations-style rAF loops — no animation library — and respects `prefers-reduced-motion`.
- All dashboards, simulators and demo datasets use illustrative data, labelled as such on the page. No proprietary or company data is included.
- Architecture diagrams are representative workflows based on experience, not production infrastructure.
