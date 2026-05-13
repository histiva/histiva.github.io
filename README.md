# Histiva Marketing Site

Static marketing site for Histiva — a nonprofit hospital information system for low-resource clinics.

**Production:** https://histiva.github.io/

## Tech

Astro 6.3 · TypeScript · Tailwind CSS v4 · Built-in i18n (EN default; TR/FR/AR shells). Deployed to GitHub Pages via Actions.

## Develop

```bash
nvm use            # node 22
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run check      # astro check + tsc
npm run lint
npm test           # vitest
npm run build      # outputs dist/
npm run preview    # serve dist/ locally
npm run test:e2e   # playwright smoke
```

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages within ~90s.

Required repo-level **Variables** (Settings → Variables → Actions):
- `PUBLIC_GA_MEASUREMENT_ID` (e.g., `G-XXXXXXXXXX`)
- `PUBLIC_FORMSPREE_ENDPOINT` (e.g., `https://formspree.io/f/xxxxxxxx`)

If either is absent, the feature degrades gracefully (GA off, form shows "configure endpoint" notice).

## Documentation

- Spec: `docs/superpowers/specs/2026-05-13-histiva-marketing-site-design.md`
- Plan: `docs/superpowers/plans/2026-05-13-histiva-marketing-site.md`
