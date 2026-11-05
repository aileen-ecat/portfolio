import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Social previews (og:image, twitter:image) need absolute URLs. The GitHub
// Pages workflow passes the published address in SITE_URL; locally it falls
// back to relative paths.
const siteUrl = (() => {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return './';
  return raw.endsWith('/') ? raw : `${raw}/`;
})();

// `base: './'` keeps every asset path relative, so the build works on
// GitHub Pages project sites (username.github.io/repo/) and user sites alike.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    },
  ],
  build: {
    chunkSizeWarningLimit: 900,
  },
});
