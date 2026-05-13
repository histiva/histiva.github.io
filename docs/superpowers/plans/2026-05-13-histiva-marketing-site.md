# Histiva Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a static 8-page marketing site for Histiva (nonprofit HBYS) at `https://histiva.github.io/`, dual-funnel (operators + donors), clinical-authority tone, Trust Blue brand, Astro 6.3 + Tailwind v4 + built-in i18n, deployed via GitHub Actions to GitHub Pages.

**Architecture:** Static Astro site. EN at `/`, localized at `/tr/`, `/fr/`, `/ar/` with shell + EN-fallback content for v1. One body component per page reused by 4 thin route files per locale. Forms via Formspree (no backend), GA4 with custom consent banner, View Transitions for nav, Astro Content Layer for module/FAQ content.

**Tech Stack:** Astro 6.3 · TypeScript strict · Tailwind CSS v4 (CSS-first) · `astro-icon` (Lucide) · `@astrojs/sitemap` · `@astrojs/mdx` · `@fontsource-variable/inter` · Vitest (i18n util tests) · Playwright (smoke E2E) · GitHub Actions → Pages.

**Source-of-truth spec:** `docs/superpowers/specs/2026-05-13-histiva-marketing-site-design.md`. When the plan and spec diverge, the spec wins — open a question, don't drift silently.

---

## Phase A — Project Foundation (Tasks 1-6)

### Task 1: Initialize Astro project + dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `astro.config.mjs`
- Create: `.nvmrc`
- Create: `src/env.d.ts`

- [x] **Step 1: Create `.nvmrc`**

```
22
```

- [x] **Step 2: Create `package.json`**

```json
{
  "name": "histiva-marketing-site",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.0.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview --host",
    "check": "astro check",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "astro": "^6.3.0",
    "@astrojs/mdx": "^5.0.0",
    "@astrojs/sitemap": "^3.7.0",
    "@astrojs/check": "^0.9.0",
    "@fontsource-variable/inter": "^5.2.0",
    "astro-icon": "^1.1.0",
    "@iconify-json/lucide": "^1.2.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "^5.6.0",
    "sharp": "^0.34.0"
  },
  "devDependencies": {
    "@astrojs/ts-plugin": "^1.10.0",
    "eslint": "^9.0.0",
    "eslint-plugin-astro": "^1.3.0",
    "prettier": "^3.4.0",
    "prettier-plugin-astro": "^0.14.0",
    "vitest": "^4.1.0",
    "@playwright/test": "^1.49.0"
  }
}
```

_Note (impl 2026-05-13): version pins for `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/check`, and `astro-icon` adjusted from the original plan to match the current npm-registry state for Astro-6 compatibility._

- [x] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

- [x] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  readonly PUBLIC_FORMSPREE_ENDPOINT?: string;
  readonly PUBLIC_SITE_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [x] **Step 5: Create minimal `astro.config.mjs`** (i18n config comes in Task 2)

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://histiva.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap(), icon({ iconDir: 'src/icons' })],
  vite: { plugins: [tailwindcss()] },
});
```

- [x] **Step 6: Install deps + verify build**

Run: `npm install && npm run check`
Expected: zero errors. (Astro will warn about no pages yet — that's fine.)

- [x] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs .nvmrc src/env.d.ts
git commit -m "chore: scaffold astro 6.3 project with tailwind v4 + i18n deps"
```

---

### Task 2: Configure i18n routing

**Files:**
- Modify: `astro.config.mjs`

- [x] **Step 1: Add i18n config block to `astro.config.mjs`**

Replace the `defineConfig({...})` call body with:

```js
export default defineConfig({
  site: 'https://histiva.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'fr', 'ar'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
    fallback: { tr: 'en', fr: 'en', ar: 'en' },
  },
  integrations: [mdx(), sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en', tr: 'tr', fr: 'fr', ar: 'ar' },
    },
  }), icon({ iconDir: 'src/icons' })],
  vite: { plugins: [tailwindcss()] },
});
```

- [x] **Step 2: Verify config**

Run: `npm run check`
Expected: no TS errors. (Astro may warn about no pages — still fine.)

- [x] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: configure built-in i18n (en default, tr/fr/ar with en fallback)"
```

---

### Task 3: Tailwind v4 tokens + global CSS + Inter font

**Files:**
- Create: `src/styles/global.css`

- [x] **Step 1: Create `src/styles/global.css`** (Tailwind v4 CSS-first config)

```css
@import 'tailwindcss';
@import '@fontsource-variable/inter/index.css';

@theme {
  /* Trust Blue palette */
  --color-primary-900: #0c2461;
  --color-primary-700: #1e40af;
  --color-primary-500: #3b82f6;
  --color-primary-100: #dbeafe;

  --color-surface-50: #f8fafc;
  --color-ink-900: #0f172a;
  --color-ink-600: #475569;

  --color-success-700: #166534;
  --color-success-50: #f0fdf4;
  --color-warning-700: #92400e;
  --color-warning-50: #fff7ed;

  /* Typography */
  --font-sans: 'Inter Variable', system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, monospace;
}

@layer base {
  html {
    font-family: var(--font-sans);
    color: var(--color-ink-900);
    background: var(--color-surface-50);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  body { margin: 0; min-height: 100vh; }
  h1, h2, h3, h4 { letter-spacing: -0.01em; font-weight: 700; }
  a { color: var(--color-primary-700); text-decoration: none; }
  a:hover { text-decoration: underline; }
  :focus-visible { outline: 2px solid var(--color-primary-700); outline-offset: 2px; }

  /* RTL hooks */
  html[dir='rtl'] { /* Tailwind v4 logical props (ps/pe/ms/me) handle most */ }
}

@layer utilities {
  .container-page { width: 100%; max-width: 1200px; margin-inline: auto; padding-inline: 1.5rem; }
}
```

- [x] **Step 2: Sanity-check Tailwind compiles**

Create a throwaway `src/pages/index.astro`:

```astro
---
import '~/styles/global.css';
---
<html lang="en"><body><div class="container-page bg-primary-100 p-8">hi</div></body></html>
```

Run: `npm run build`
Expected: build succeeds; `dist/index.html` contains the styled div.

- [x] **Step 3: Delete throwaway index.astro** (will be created properly in Task 22)

```bash
rm src/pages/index.astro
```

- [x] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: tailwind v4 css-first tokens (trust blue palette) + inter font"
```

_Note (impl 2026-05-13): Task 3's `npm run build` surfaced a Vite-version conflict — `@tailwindcss/vite@4.3.0` accepts Vite 5–8 and npm hoisted Vite 8, but Astro 6.3 requires Vite 7. Build failed with `Missing field tsconfigPaths on BindingViteResolvePluginConfig.resolveOptions` (rolldown 1.0 in Vite 8). Astro's own dev server prints the exact fix: pin via `"overrides": { "vite": "^7" }` in `package.json`. Applied as a separate preceding commit (`689a55e`) before the Task 3 styling commit (`d276baa`) so the override is rollback-isolable from the design tokens._

---

### Task 4: ESLint + Prettier + Astro check tooling

**Files:**
- Create: `eslint.config.mjs`
- Create: `.prettierrc.json`
- Create: `.prettierignore`

- [x] **Step 1: Create `eslint.config.mjs`**

```js
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
```

- [x] **Step 2: Create `.prettierrc.json`**

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }],
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [x] **Step 3: Create `.prettierignore`**

```
dist
.astro
node_modules
package-lock.json
public/img
```

- [x] **Step 4: Run lint to verify config**

Run: `npm run lint`
Expected: passes with no errors (no source files yet).

- [x] **Step 5: Commit**

```bash
git add eslint.config.mjs .prettierrc.json .prettierignore
git commit -m "chore: eslint + prettier for astro"
```

---

### Task 5: GitHub Actions — CI + deploy to GitHub Pages

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`

- [x] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run check
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

- [x] **Step 2: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_GA_MEASUREMENT_ID: ${{ vars.PUBLIC_GA_MEASUREMENT_ID }}
          PUBLIC_FORMSPREE_ENDPOINT: ${{ vars.PUBLIC_FORMSPREE_ENDPOINT }}
          PUBLIC_SITE_URL: https://histiva.github.io
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [x] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml .github/workflows/deploy.yml
git commit -m "ci: github actions for build + pages deploy"
```

---

### Task 6: README + CLAUDE.md + public scaffolding

**Files:**
- Create: `README.md`
- Create: `CLAUDE.md`
- Create: `public/robots.txt`
- Create: `public/favicon.svg`

- [x] **Step 1: Create `README.md`**

````markdown
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
````

- [x] **Step 2: Create `CLAUDE.md`**

```markdown
# CLAUDE.md — Histiva Marketing Site

Read first. Trust code over this file; update if they diverge.

## What this repo is

The public marketing website for **Histiva**, the nonprofit hospital information system. **Not** the product code — that lives at `/home/cevheri/projects/hbys/histiva-app/` (sibling repo, separate project).

Live at https://histiva.github.io/ once deployed.

## Authoritative docs

1. `docs/superpowers/specs/2026-05-13-histiva-marketing-site-design.md` — design spec, brand, IA, content outlines
2. `docs/superpowers/plans/2026-05-13-histiva-marketing-site.md` — implementation plan
3. Reference design: https://www.healthytogether.co/

## Tech (pinned in package.json)

| | |
|--|--|
| Framework | Astro 6.3 (static) |
| Styles | Tailwind v4 (CSS-first via `@theme`) |
| Icons | astro-icon + Lucide |
| Content | Content Layer + MDX |
| i18n | Astro built-in; EN default at `/`, TR/FR/AR at `/tr/`, `/fr/`, `/ar/` |
| Forms | Formspree (no backend) |
| Analytics | GA4 + custom consent banner |
| Deploy | GitHub Actions → Pages |

## Critical conventions

- **i18n v1 reality:** Only EN content is fully written. TR/FR/AR route shells exist and render the `<TranslationBanner />` + fall back to EN body. Don't fake translations.
- **RTL:** Arabic locale sets `dir="rtl"` on `<html>`. Always use Tailwind logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`) — never `pl-*` / `pr-*`.
- **No third-party fonts via CDN.** Self-host Inter via `@fontsource-variable/inter`.
- **Cookie banner gates GA4.** No GA tags fire until user accepts.
- **Brand:** Trust Blue palette (see `src/styles/global.css` `@theme` block). Inter for everything.

## Anti-patterns (DON'T)

- ❌ Hardcoded Turkish/Arabic strings in components — use `t('key', locale)` from `~/i18n/utils.ts`
- ❌ Loading GA before consent
- ❌ Adding non-Astro JS frameworks (React/Vue/Svelte) — keep it Astro-only unless a real need
- ❌ Cross-locale page duplication beyond thin route files (one body component per page, reused)
```

- [x] **Step 3: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://histiva.github.io/sitemap-index.xml
```

- [x] **Step 4: Create placeholder `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0c2461"/><text x="16" y="22" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#dbeafe" text-anchor="middle">h</text></svg>
```

- [x] **Step 5: Commit**

```bash
git add README.md CLAUDE.md public/robots.txt public/favicon.svg
git commit -m "docs: readme + claude.md + robots + placeholder favicon"
```

---

## Phase B — Shared Shell + i18n (Tasks 7-13)

### Task 7: i18n utility module — failing test first

**Files:**
- Create: `tests/i18n.test.ts`
- Create: `src/i18n/en.json`
- Create: `src/i18n/tr.json`
- Create: `src/i18n/fr.json`
- Create: `src/i18n/ar.json`

- [x] **Step 1: Create empty locale JSONs (shells)**

`src/i18n/en.json`:

```json
{
  "nav": {
    "product": "Product",
    "ai": "AI",
    "for_hospitals": "For Hospitals",
    "for_donors": "For Donors",
    "about": "About",
    "contact": "Contact"
  },
  "common": {
    "schedule_demo": "Schedule a demo",
    "for_donors": "For donors"
  }
}
```

`src/i18n/tr.json`, `src/i18n/fr.json`, `src/i18n/ar.json` (identical empty shells):

```json
{}
```

- [x] **Step 2: Add Vitest config snippet to `package.json`** (vitest auto-discovers, no extra config needed for simple unit tests, but ensure `tests/` is in `tsconfig` includes via the `**/*` glob already present)

- [x] **Step 3: Write failing test in `tests/i18n.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { t, getLocaleDir, isValidLocale, withFallback } from '../src/i18n/utils';

describe('i18n utils', () => {
  it('returns translated value for known key', () => {
    expect(t('nav.product', 'en')).toBe('Product');
  });

  it('falls back to en when target locale missing key', () => {
    expect(t('nav.product', 'tr')).toBe('Product');
  });

  it('returns the key itself when missing in both target and en', () => {
    expect(t('does.not.exist', 'en')).toBe('does.not.exist');
  });

  it('returns rtl direction only for ar', () => {
    expect(getLocaleDir('ar')).toBe('rtl');
    expect(getLocaleDir('en')).toBe('ltr');
    expect(getLocaleDir('tr')).toBe('ltr');
    expect(getLocaleDir('fr')).toBe('ltr');
  });

  it('isValidLocale accepts en/tr/fr/ar and rejects others', () => {
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('ar')).toBe(true);
    expect(isValidLocale('de')).toBe(false);
    expect(isValidLocale('')).toBe(false);
  });

  it('withFallback returns true when locale has full content', () => {
    expect(withFallback('en')).toBe(false);
    expect(withFallback('tr')).toBe(true);
  });
});
```

- [x] **Step 4: Run test and verify it FAILS**

Run: `npm test`
Expected: FAIL — `utils.ts` does not exist yet.

- [x] **Step 5: Commit failing test**

```bash
git add tests/i18n.test.ts src/i18n/en.json src/i18n/tr.json src/i18n/fr.json src/i18n/ar.json
git commit -m "test: failing i18n util tests + locale shells"
```

---

### Task 8: i18n utils — minimal implementation to pass tests

**Files:**
- Create: `src/i18n/utils.ts`

- [x] **Step 1: Create `src/i18n/utils.ts`**

```ts
import en from './en.json' assert { type: 'json' };
import tr from './tr.json' assert { type: 'json' };
import fr from './fr.json' assert { type: 'json' };
import ar from './ar.json' assert { type: 'json' };

export const LOCALES = ['en', 'tr', 'fr', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const dicts: Record<Locale, Record<string, unknown>> = { en, tr, fr, ar };

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getLocaleDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** True if the locale falls back to EN content (i.e., not fully translated yet). */
export function withFallback(locale: Locale): boolean {
  return locale !== DEFAULT_LOCALE && Object.keys(dicts[locale]).length === 0;
}

function getNested(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function t(key: string, locale: Locale): string {
  const fromLocale = getNested(dicts[locale], key);
  if (typeof fromLocale === 'string') return fromLocale;
  const fromEn = getNested(dicts[DEFAULT_LOCALE], key);
  if (typeof fromEn === 'string') return fromEn;
  return key;
}

/** Build a localized URL path; EN returns `/path`, others return `/{locale}/path`. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean === '/' ? '/' : clean;
  return clean === '/' ? `/${locale}/` : `/${locale}${clean}`;
}
```

- [x] **Step 2: Run tests and verify they PASS**

Run: `npm test`
Expected: all 6 i18n tests PASS.

- [x] **Step 3: Commit**

```bash
git add src/i18n/utils.ts
git commit -m "feat: i18n utils (t, getLocaleDir, isValidLocale, withFallback, localizedPath)"
```

---

### Task 9: Layout shell — `<Layout.astro>` with head, lang, dir, slots

**Files:**
- Create: `src/layouts/Layout.astro`

- [x] **Step 1: Create `src/layouts/Layout.astro`**

```astro
---
import '~/styles/global.css';
import { type Locale, getLocaleDir, DEFAULT_LOCALE, isValidLocale } from '~/i18n/utils';

interface Props {
  title: string;
  description: string;
  locale?: Locale;
  ogImage?: string;
  noindex?: boolean;
}

const {
  title,
  description,
  locale = DEFAULT_LOCALE,
  ogImage = '/og/default.png',
  noindex = false,
} = Astro.props;

const safeLocale: Locale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
const dir = getLocaleDir(safeLocale);
const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://histiva.github.io';
const canonical = new URL(Astro.url.pathname, siteUrl).toString();
---
<!doctype html>
<html lang={safeLocale} dir={dir}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} · Histiva</title>
    <meta name="description" content={description} />
    {noindex && <meta name="robots" content="noindex,nofollow" />}
    <link rel="canonical" href={canonical} />

    <meta property="og:type" content="website" />
    <meta property="og:title" content={`${title} · Histiva`} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={new URL(ogImage, siteUrl).toString()} />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- hreflang alternates -->
    <link rel="alternate" hreflang="en" href={new URL(Astro.url.pathname.replace(/^\/(tr|fr|ar)/, ''), siteUrl).toString()} />
    <link rel="alternate" hreflang="tr" href={new URL('/tr' + Astro.url.pathname.replace(/^\/(tr|fr|ar)/, ''), siteUrl).toString()} />
    <link rel="alternate" hreflang="fr" href={new URL('/fr' + Astro.url.pathname.replace(/^\/(tr|fr|ar)/, ''), siteUrl).toString()} />
    <link rel="alternate" hreflang="ar" href={new URL('/ar' + Astro.url.pathname.replace(/^\/(tr|fr|ar)/, ''), siteUrl).toString()} />
  </head>
  <body class="min-h-screen flex flex-col">
    <slot name="ribbon" />
    <slot name="nav" />
    <slot name="translation-banner" />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <slot name="footer" />
    <slot name="cookie-banner" />
    <slot name="analytics" />
  </body>
</html>
```

- [x] **Step 2: Verify type-check passes**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: Layout shell with locale, dir, og meta, hreflang"
```

_Note (impl 2026-05-13): Task 9 surfaced a latent Task 4 tooling gap — `eslint-plugin-astro`'s recommended config auto-detects `@typescript-eslint/parser` for TS-script blocks in `.astro` frontmatter but doesn't declare it as a peerDependency. Without it, `import type { ... }` in any `.astro` file fails lint with "Parsing error: Unexpected token". Installed as a devDependency in a separate preceding commit (`8bbb790`) before the Layout commit (`a901ef1`)._

---

### Task 10: `<TopRibbon>`, `<TranslationBanner>` components

**Files:**
- Create: `src/components/TopRibbon.astro`
- Create: `src/components/TranslationBanner.astro`

- [x] **Step 1: Create `src/components/TopRibbon.astro`**

```astro
---
import { type Locale, t } from '~/i18n/utils';
interface Props { locale: Locale; }
const { locale } = Astro.props;
---
<div class="bg-primary-900 text-primary-100 text-xs">
  <div class="container-page flex items-center gap-2 py-2">
    <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.18)]" aria-hidden="true"></span>
    <span>{t('ribbon.tagline', locale)}</span>
  </div>
</div>
```

- [x] **Step 2: Add ribbon key to `src/i18n/en.json`** under `nav` block sibling (top-level key `ribbon`)

```json
{
  "ribbon": {
    "tagline": "A nonprofit hospital information system · built for low-resource clinics"
  },
  "nav": { ... existing ... },
  "common": { ... existing ... }
}
```

Merge with existing `en.json` — don't overwrite.

- [x] **Step 3: Create `src/components/TranslationBanner.astro`**

```astro
---
import { type Locale, t, withFallback } from '~/i18n/utils';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const show = withFallback(locale);
---
{show && (
  <div class="bg-amber-50 border-y border-amber-200 text-amber-900">
    <div class="container-page py-2 text-sm text-center">
      {t('banner.translation_pending', locale)}
    </div>
  </div>
)}
```

- [x] **Step 4: Add banner key to `en.json`**

```json
"banner": {
  "translation_pending": "Translation in progress. Showing English content."
}
```

- [x] **Step 5: Verify check**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 6: Commit**

```bash
git add src/components/TopRibbon.astro src/components/TranslationBanner.astro src/i18n/en.json
git commit -m "feat: TopRibbon + TranslationBanner components"
```

---

### Task 11: `<SiteNav>` + `<LanguageSwitcher>`

**Files:**
- Create: `src/components/SiteNav.astro`
- Create: `src/components/LanguageSwitcher.astro`

- [x] **Step 1: Create `src/components/LanguageSwitcher.astro`**

```astro
---
import { LOCALES, type Locale, localizedPath } from '~/i18n/utils';
interface Props { current: Locale; pathname: string; }
const { current, pathname } = Astro.props;
const stripped = pathname.replace(/^\/(tr|fr|ar)/, '') || '/';
const labels: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  fr: 'Français',
  ar: 'العربية',
};
---
<details class="relative">
  <summary class="cursor-pointer list-none px-3 py-1.5 rounded-md text-sm text-ink-900 hover:bg-primary-100 inline-flex items-center gap-2">
    <span>{labels[current]}</span>
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
  </summary>
  <ul class="absolute end-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[160px] z-10">
    {LOCALES.map((loc) => (
      <li>
        <a href={localizedPath(stripped, loc)} class={`block px-3 py-1.5 text-sm hover:bg-primary-100 ${loc === current ? 'font-semibold text-primary-700' : 'text-ink-900'}`}>
          {labels[loc]}
        </a>
      </li>
    ))}
  </ul>
</details>
```

- [x] **Step 2: Create `src/components/SiteNav.astro`**

```astro
---
import { type Locale, t, localizedPath } from '~/i18n/utils';
import LanguageSwitcher from './LanguageSwitcher.astro';
import { Icon } from 'astro-icon/components';
interface Props { locale: Locale; pathname: string; }
const { locale, pathname } = Astro.props;
const navItems = [
  { key: 'nav.product', href: '/product' },
  { key: 'nav.ai', href: '/ai' },
  { key: 'nav.for_hospitals', href: '/for-hospitals' },
  { key: 'nav.for_donors', href: '/for-donors' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.contact', href: '/contact' },
];
---
<header class="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-slate-200">
  <nav class="container-page flex items-center justify-between py-3 gap-4">
    <a href={localizedPath('/', locale)} class="text-xl font-bold text-primary-900 tracking-tight">Histiva</a>
    <ul class="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <li><a href={localizedPath(item.href, locale)} class="px-3 py-1.5 rounded-md text-sm text-ink-900 hover:bg-primary-100">{t(item.key, locale)}</a></li>
      ))}
    </ul>
    <div class="flex items-center gap-2">
      <LanguageSwitcher current={locale} pathname={pathname} />
      <a href="https://github.com/histiva" rel="noopener" class="p-2 rounded-md hover:bg-primary-100" aria-label="GitHub">
        <Icon name="lucide:github" size={18} />
      </a>
    </div>
  </nav>
</header>
```

- [x] **Step 3: Verify check + build**

Run: `npm run check && npm run build`
Expected: 0 errors. (Build still warns "no pages found" — pages come later.)

- [x] **Step 4: Commit**

```bash
git add src/components/SiteNav.astro src/components/LanguageSwitcher.astro
git commit -m "feat: SiteNav with sticky header + LanguageSwitcher dropdown"
```

---

### Task 12: `<SiteFooter>` component

**Files:**
- Create: `src/components/SiteFooter.astro`

- [x] **Step 1: Create `src/components/SiteFooter.astro`**

```astro
---
import { type Locale, t, localizedPath } from '~/i18n/utils';
import LanguageSwitcher from './LanguageSwitcher.astro';
interface Props { locale: Locale; pathname: string; }
const { locale, pathname } = Astro.props;
const year = new Date().getFullYear();
---
<footer class="mt-16 bg-primary-900 text-primary-100">
  <div class="container-page py-12 grid gap-8 md:grid-cols-4">
    <div>
      <p class="text-xl font-bold text-white">Histiva</p>
      <p class="text-sm mt-2 opacity-80">{t('footer.tagline', locale)}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider opacity-60 mb-3">{t('footer.about', locale)}</p>
      <ul class="space-y-2 text-sm">
        <li><a href={localizedPath('/about', locale)} class="hover:underline">{t('nav.about', locale)}</a></li>
        <li><a href={localizedPath('/ai', locale)} class="hover:underline">{t('nav.ai', locale)}</a></li>
        <li><a href={localizedPath('/product', locale)} class="hover:underline">{t('nav.product', locale)}</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider opacity-60 mb-3">{t('footer.connect', locale)}</p>
      <ul class="space-y-2 text-sm">
        <li><a href={localizedPath('/contact', locale)} class="hover:underline">{t('nav.contact', locale)}</a></li>
        <li><a href="https://github.com/histiva" rel="noopener" class="hover:underline">GitHub</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider opacity-60 mb-3">{t('footer.legal', locale)}</p>
      <ul class="space-y-2 text-sm">
        <li><a href={localizedPath('/privacy', locale)} class="hover:underline">{t('footer.privacy', locale)}</a></li>
        <li class="opacity-80">{t('footer.license', locale)}</li>
      </ul>
      <div class="mt-4"><LanguageSwitcher current={locale} pathname={pathname} /></div>
    </div>
  </div>
  <div class="border-t border-primary-700/40">
    <div class="container-page py-4 text-xs opacity-70 flex flex-wrap items-center justify-between gap-2">
      <span>© {year} Histiva · {t('footer.builtwith', locale)}</span>
      <span>{t('footer.opensource', locale)}</span>
    </div>
  </div>
</footer>
```

- [x] **Step 2: Add footer keys to `src/i18n/en.json`**

```json
"footer": {
  "tagline": "A nonprofit hospital information system for low-resource clinics.",
  "about": "About",
  "connect": "Connect",
  "legal": "Legal",
  "privacy": "Privacy",
  "license": "Apache-2.0 (HBYS source)",
  "builtwith": "Built with Astro",
  "opensource": "Open source on GitHub"
}
```

- [x] **Step 3: Verify**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 4: Commit**

```bash
git add src/components/SiteFooter.astro src/i18n/en.json
git commit -m "feat: SiteFooter with 4-col layout + language switcher"
```

_Phase D follow-up: `<LanguageSwitcher>` was designed for light backgrounds (`text-ink-900`, `hover:bg-primary-100`). It renders inside SiteFooter's dark Trust Blue column with no styling adjustment — expect a low-contrast appearance when pages start rendering. Verify visually in Task 22 and either (a) add a `variant` prop to the switcher, (b) override classes inline from the footer, or (c) accept the visual as-is if it reads acceptably. Not blocking; the plan prescribed the current reuse._

---

### Task 13: `<CookieBanner>` + GA4 conditional snippet

**Files:**
- Create: `src/components/CookieBanner.astro`
- Create: `src/components/Analytics.astro`

- [x] **Step 1: Create `src/components/CookieBanner.astro`**

```astro
---
import { type Locale, t } from '~/i18n/utils';
interface Props { locale: Locale; }
const { locale } = Astro.props;
---
<div id="cookie-banner" class="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 shadow-lg hidden" role="dialog" aria-labelledby="cookie-title">
  <div class="container-page py-4 flex flex-wrap items-center justify-between gap-4">
    <div class="text-sm max-w-2xl">
      <p id="cookie-title" class="font-semibold text-ink-900 mb-1">{t('cookie.title', locale)}</p>
      <p class="text-ink-600">{t('cookie.body', locale)} <a href="/privacy" class="underline">{t('cookie.learn_more', locale)}</a></p>
    </div>
    <div class="flex gap-2">
      <button type="button" id="cookie-decline" class="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50">{t('cookie.decline', locale)}</button>
      <button type="button" id="cookie-accept" class="px-4 py-2 text-sm rounded-md bg-primary-700 text-white hover:bg-primary-900">{t('cookie.accept', locale)}</button>
    </div>
  </div>
</div>
<script>
  const KEY = 'histiva.consent';
  const banner = document.getElementById('cookie-banner');
  const stored = localStorage.getItem(KEY);
  if (banner && stored === null) banner.classList.remove('hidden');

  function setConsent(value: 'accept' | 'decline') {
    localStorage.setItem(KEY, value);
    banner?.classList.add('hidden');
    if (value === 'accept') {
      document.dispatchEvent(new CustomEvent('histiva:consent-accepted'));
    }
  }

  document.getElementById('cookie-accept')?.addEventListener('click', () => setConsent('accept'));
  document.getElementById('cookie-decline')?.addEventListener('click', () => setConsent('decline'));
</script>
```

- [x] **Step 2: Create `src/components/Analytics.astro`**

```astro
---
const GA_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
---
{GA_ID && (
  <script is:inline define:vars={{ GA_ID }}>
    const KEY = 'histiva.consent';
    function load() {
      if (window.__histivaGaLoaded) return;
      window.__histivaGaLoaded = true;
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, { anonymize_ip: true });
    }
    if (localStorage.getItem(KEY) === 'accept') load();
    document.addEventListener('histiva:consent-accepted', load);
  </script>
)}
```

- [x] **Step 3: Add cookie keys to `src/i18n/en.json`**

```json
"cookie": {
  "title": "We use cookies for analytics",
  "body": "Histiva uses Google Analytics to understand how the site is used. Nothing personal is shared.",
  "learn_more": "Learn more",
  "accept": "Accept",
  "decline": "Decline"
}
```

- [x] **Step 4: Verify check**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 5: Commit**

```bash
git add src/components/CookieBanner.astro src/components/Analytics.astro src/i18n/en.json
git commit -m "feat: cookie consent banner gating GA4 load"
```

---

## Phase C — Content Components (Tasks 14-21)

### Task 14: `<Hero>` component

**Files:**
- Create: `src/components/Hero.astro`

- [x] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { Image } from 'astro:assets';
interface Props {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { src: ImageMetadata; alt: string };
}
const { eyebrow, title, subtitle, primaryCta, secondaryCta, image } = Astro.props;
---
<section class="bg-gradient-to-b from-primary-100/40 to-transparent">
  <div class="container-page py-16 md:py-20 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
    <div>
      {eyebrow && <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold mb-3">{eyebrow}</p>}
      <h1 class="text-4xl md:text-5xl text-primary-900 leading-tight">{title}</h1>
      <p class="mt-5 text-lg text-ink-600 max-w-xl leading-relaxed">{subtitle}</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href={primaryCta.href} class="inline-flex items-center px-5 py-2.5 rounded-md bg-primary-700 text-white font-semibold hover:bg-primary-900 transition-colors">{primaryCta.label}</a>
        {secondaryCta && (
          <a href={secondaryCta.href} class="inline-flex items-center px-5 py-2.5 rounded-md border border-primary-700 text-primary-700 font-semibold hover:bg-primary-100 transition-colors">{secondaryCta.label}</a>
        )}
      </div>
    </div>
    {image && (
      <div class="rounded-xl overflow-hidden shadow-xl bg-slate-100 aspect-[4/3]">
        <Image src={image.src} alt={image.alt} class="w-full h-full object-cover" widths={[400, 800, 1200]} sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
    )}
  </div>
</section>
```

- [x] **Step 2: Verify check**

Run: `npm run check`
Expected: 0 errors. (`ImageMetadata` is built into Astro.)

- [x] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: Hero component with eyebrow/title/subtitle/dual-CTA/image"
```

---

### Task 15: `<PillarCard>` + pillar grid

**Files:**
- Create: `src/components/PillarCard.astro`
- Create: `src/components/PillarGrid.astro`

- [x] **Step 1: Create `src/components/PillarCard.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
interface Props {
  index: string;
  iconName: string;
  title: string;
  body: string;
  href?: string;
  learnMoreLabel?: string;
}
const { index, iconName, title, body, href, learnMoreLabel } = Astro.props;
---
<article class="bg-white border border-slate-200 rounded-xl p-6 hover:border-primary-500 transition-colors flex flex-col">
  <div class="flex items-center gap-3 mb-4">
    <span class="text-xs font-bold tracking-[0.12em] text-ink-600">{index}</span>
    <Icon name={iconName} size={22} class="text-primary-700" />
  </div>
  <h3 class="text-lg text-primary-900 mb-2">{title}</h3>
  <p class="text-sm text-ink-600 leading-relaxed flex-1">{body}</p>
  {href && learnMoreLabel && (
    <a href={href} class="mt-4 text-sm font-semibold text-primary-700 inline-flex items-center gap-1">
      {learnMoreLabel} <span aria-hidden="true">→</span>
    </a>
  )}
</article>
```

- [x] **Step 2: Create `src/components/PillarGrid.astro`**

```astro
---
import PillarCard from './PillarCard.astro';
import { type Locale, t, localizedPath } from '~/i18n/utils';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const pillars = [
  { index: '01', iconName: 'lucide:brain-circuit', titleKey: 'pillars.ai.title', bodyKey: 'pillars.ai.body', href: '/ai' },
  { index: '02', iconName: 'lucide:smartphone', titleKey: 'pillars.mobile.title', bodyKey: 'pillars.mobile.body', href: '/product' },
  { index: '03', iconName: 'lucide:globe', titleKey: 'pillars.standards.title', bodyKey: 'pillars.standards.body', href: '/product' },
  { index: '04', iconName: 'lucide:shield-check', titleKey: 'pillars.security.title', bodyKey: 'pillars.security.body', href: '/product' },
];
---
<section class="container-page py-12">
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {pillars.map((p) => (
      <PillarCard
        index={p.index}
        iconName={p.iconName}
        title={t(p.titleKey, locale)}
        body={t(p.bodyKey, locale)}
        href={localizedPath(p.href, locale)}
        learnMoreLabel={t('common.learn_more', locale)}
      />
    ))}
  </div>
</section>
```

- [x] **Step 3: Add pillar keys to `src/i18n/en.json`**

```json
"pillars": {
  "ai": {
    "title": "AI-Powered",
    "body": "Cloud or local LLM. Triage suggestions, clinical summaries, decision support — running offline when needed."
  },
  "mobile": {
    "title": "Mobile-first",
    "body": "Any browser, any device. From doctors' phones to nurses' aging tablets."
  },
  "standards": {
    "title": "Standards-compliant",
    "body": "HL7/FHIR-ready, ICD-10, multilingual. Interoperable with international healthcare tooling."
  },
  "security": {
    "title": "Secure & auditable",
    "body": "Role-based access, full audit trail, row-level security, KVKK/GDPR-ready data model."
  }
},
"common": {
  "schedule_demo": "Schedule a demo",
  "for_donors": "For donors",
  "learn_more": "Learn more"
}
```

- [x] **Step 4: Verify**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 5: Commit**

```bash
git add src/components/PillarCard.astro src/components/PillarGrid.astro src/i18n/en.json
git commit -m "feat: PillarCard + PillarGrid (AI/Mobile/Standards/Security)"
```

---

### Task 16: `<StorySection>` + `<TwoPathCTA>` + `<ModuleCard>`

**Files:**
- Create: `src/components/StorySection.astro`
- Create: `src/components/TwoPathCTA.astro`
- Create: `src/components/ModuleCard.astro`

- [x] **Step 1: Create `src/components/StorySection.astro`**

```astro
---
interface Props {
  eyebrow: string;
  title: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
}
const { eyebrow, title, body, imageSrc, imageAlt } = Astro.props;
---
<section class="bg-warning-50 border-y border-amber-200">
  <div class="container-page py-14 grid md:grid-cols-[1fr_1.2fr] gap-10 items-center">
    {imageSrc && imageAlt && <img src={imageSrc} alt={imageAlt} class="rounded-xl shadow-lg w-full" loading="lazy" />}
    <div>
      <p class="text-xs uppercase tracking-[0.12em] text-warning-700 font-semibold mb-2">{eyebrow}</p>
      <h2 class="text-3xl text-warning-700 leading-tight">{title}</h2>
      <p class="mt-4 text-ink-900 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  </div>
</section>
```

- [x] **Step 2: Create `src/components/TwoPathCTA.astro`**

```astro
---
import { type Locale, t, localizedPath } from '~/i18n/utils';
interface Props { locale: Locale; }
const { locale } = Astro.props;
---
<section class="container-page py-12">
  <div class="grid md:grid-cols-2 gap-4">
    <a href={localizedPath('/for-hospitals', locale)} class="bg-primary-100 hover:bg-primary-100/70 rounded-xl p-6 transition-colors">
      <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold">{t('paths.hospital_eyebrow', locale)}</p>
      <h3 class="text-xl text-primary-900 mt-1">{t('paths.hospital_title', locale)}</h3>
      <p class="text-sm text-ink-600 mt-2">{t('paths.hospital_body', locale)}</p>
      <span class="mt-4 inline-block text-sm font-semibold text-primary-700">{t('paths.hospital_cta', locale)} →</span>
    </a>
    <a href={localizedPath('/for-donors', locale)} class="bg-success-50 hover:bg-success-50/70 rounded-xl p-6 transition-colors">
      <p class="text-xs uppercase tracking-[0.12em] text-success-700 font-semibold">{t('paths.donor_eyebrow', locale)}</p>
      <h3 class="text-xl text-success-700 mt-1">{t('paths.donor_title', locale)}</h3>
      <p class="text-sm text-ink-600 mt-2">{t('paths.donor_body', locale)}</p>
      <span class="mt-4 inline-block text-sm font-semibold text-success-700">{t('paths.donor_cta', locale)} →</span>
    </a>
  </div>
</section>
```

- [x] **Step 3: Create `src/components/ModuleCard.astro`**

```astro
---
import { Icon } from 'astro-icon/components';
interface Props {
  iconName: string;
  title: string;
  body: string;
  status?: 'shipping' | 'in-development';
}
const { iconName, title, body, status = 'shipping' } = Astro.props;
---
<article class="bg-white border border-slate-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-sm transition-all">
  <Icon name={iconName} size={20} class="text-primary-700 mb-3" />
  <h4 class="text-sm font-semibold text-primary-900 flex items-center gap-2">
    {title}
    {status === 'in-development' && <span class="text-[10px] uppercase tracking-wider text-warning-700 bg-warning-50 px-1.5 py-0.5 rounded">In dev</span>}
  </h4>
  <p class="text-xs text-ink-600 leading-relaxed mt-1">{body}</p>
</article>
```

- [x] **Step 4: Add story + paths keys to `src/i18n/en.json`**

```json
"story": {
  "eyebrow": "Why we built this",
  "title": "Built for the clinics that need it most.",
  "body": "Most hospital software is built for wealthy hospitals in stable economies. Histiva exists because the clinics that need it most — in Chad, Somalia, and beyond — deserve software that works for them, not against them.\n\nNonprofit. Built by clinicians and engineers. Funded by people who care."
},
"paths": {
  "hospital_eyebrow": "For hospitals & NGOs",
  "hospital_title": "Bring Histiva to your clinic",
  "hospital_body": "See how Histiva fits your operation. Walk through deployment with our team.",
  "hospital_cta": "Schedule a demo",
  "donor_eyebrow": "For donors & funders",
  "donor_title": "Fund a deployment",
  "donor_body": "Sponsor a single clinic or a multi-hospital program. See where your support goes.",
  "donor_cta": "Start a conversation"
}
```

- [x] **Step 5: Verify check**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 6: Commit**

```bash
git add src/components/StorySection.astro src/components/TwoPathCTA.astro src/components/ModuleCard.astro src/i18n/en.json
git commit -m "feat: StorySection + TwoPathCTA + ModuleCard"
```

---

### Task 17: `<ModuleGrid>` for homepage module tour

**Files:**
- Create: `src/components/ModuleGrid.astro`

- [x] **Step 1: Create `src/components/ModuleGrid.astro`**

```astro
---
import ModuleCard from './ModuleCard.astro';
import { type Locale, t, localizedPath } from '~/i18n/utils';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const modules = [
  { iconName: 'lucide:user-round', key: 'patient' },
  { iconName: 'lucide:clipboard-check', key: 'admission' },
  { iconName: 'lucide:stethoscope', key: 'outpatient' },
  { iconName: 'lucide:siren', key: 'emergency' },
  { iconName: 'lucide:bed', key: 'inpatient' },
  { iconName: 'lucide:flask-conical', key: 'lab' },
  { iconName: 'lucide:scan-line', key: 'radiology' },
  { iconName: 'lucide:pill', key: 'pharmacy' },
  { iconName: 'lucide:package', key: 'inventory' },
  { iconName: 'lucide:receipt', key: 'billing', status: 'in-development' as const },
];
---
<section class="container-page py-14">
  <div class="flex items-end justify-between mb-6">
    <div>
      <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold">{t('modules.eyebrow', locale)}</p>
      <h2 class="text-2xl text-primary-900 mt-1">{t('modules.title', locale)}</h2>
    </div>
    <a href={localizedPath('/product', locale)} class="text-sm font-semibold text-primary-700 hover:underline hidden md:inline">{t('modules.see_all', locale)} →</a>
  </div>
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
    {modules.map((m) => (
      <ModuleCard
        iconName={m.iconName}
        title={t(`modules.items.${m.key}.title`, locale)}
        body={t(`modules.items.${m.key}.body`, locale)}
        status={m.status}
      />
    ))}
  </div>
</section>
```

- [x] **Step 2: Add module keys to `src/i18n/en.json`**

```json
"modules": {
  "eyebrow": "What's inside",
  "title": "Ten modules. One coherent system.",
  "see_all": "See full product",
  "items": {
    "patient": { "title": "Patient", "body": "Records, history, allergies, vitals." },
    "admission": { "title": "Admission & Visits", "body": "Registration, episodes, visit routing." },
    "outpatient": { "title": "Outpatient", "body": "Exams, diagnoses, prescriptions." },
    "emergency": { "title": "Emergency", "body": "Triage, orders, fast workflows." },
    "inpatient": { "title": "Inpatient", "body": "Beds, observations, discharge." },
    "lab": { "title": "Laboratory", "body": "Test orders, samples, results." },
    "radiology": { "title": "Radiology", "body": "Imaging orders, reports." },
    "pharmacy": { "title": "Pharmacy", "body": "Prescriptions, dispense, stock-linked." },
    "inventory": { "title": "Inventory", "body": "Stock, batches, expiry tracking." },
    "billing": { "title": "Billing & Cashier", "body": "Invoices, payments, receipts." }
  }
}
```

- [x] **Step 3: Verify check**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 4: Commit**

```bash
git add src/components/ModuleGrid.astro src/i18n/en.json
git commit -m "feat: ModuleGrid with 10-module tour"
```

---

### Task 18: `<FAQItem>` + `<FAQList>` components

**Files:**
- Create: `src/components/FAQItem.astro`
- Create: `src/components/FAQList.astro`

- [x] **Step 1: Create `src/components/FAQItem.astro`**

```astro
---
interface Props { question: string; answer: string; }
const { question, answer } = Astro.props;
---
<details class="bg-white border border-slate-200 rounded-lg p-4 group">
  <summary class="cursor-pointer list-none flex items-center justify-between gap-4">
    <span class="font-semibold text-primary-900">{question}</span>
    <span class="text-primary-700 group-open:rotate-45 transition-transform" aria-hidden="true">+</span>
  </summary>
  <p class="mt-3 text-ink-600 leading-relaxed whitespace-pre-line">{answer}</p>
</details>
```

- [x] **Step 2: Create `src/components/FAQList.astro`**

```astro
---
import FAQItem from './FAQItem.astro';
interface Props {
  items: { q: string; a: string }[];
  title?: string;
}
const { items, title } = Astro.props;
---
<section class="container-page py-12">
  {title && <h2 class="text-2xl text-primary-900 mb-6">{title}</h2>}
  <div class="space-y-3 max-w-3xl">
    {items.map((item) => <FAQItem question={item.q} answer={item.a} />)}
  </div>
</section>
```

- [x] **Step 3: Verify**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 4: Commit**

```bash
git add src/components/FAQItem.astro src/components/FAQList.astro
git commit -m "feat: FAQItem + FAQList using native disclosure"
```

---

### Task 19: `<ContactForm>` (Formspree)

**Files:**
- Create: `src/components/ContactForm.astro`

- [x] **Step 1: Create `src/components/ContactForm.astro`**

```astro
---
import { type Locale, t, localizedPath } from '~/i18n/utils';
interface Props { locale: Locale; defaultInterest?: 'hospital' | 'donor' | 'press' | 'opensource' | 'other'; }
const { locale, defaultInterest = 'hospital' } = Astro.props;
const endpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT;
const thankYou = new URL(localizedPath('/thank-you', locale), import.meta.env.PUBLIC_SITE_URL ?? 'https://histiva.github.io').toString();
---
{!endpoint && (
  <div class="bg-warning-50 border border-amber-300 rounded-lg p-4 text-warning-700 text-sm">
    {t('form.endpoint_missing', locale)}
  </div>
)}

{endpoint && (
  <form action={endpoint} method="POST" class="grid gap-4 max-w-2xl" id="contact-form">
    <input type="hidden" name="_redirect" value={thankYou} />
    <input type="hidden" name="_subject" id="form-subject" value="Histiva contact — hospital" />
    <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

    <label class="grid gap-1">
      <span class="text-sm font-semibold">{t('form.name', locale)} <span class="text-red-600">*</span></span>
      <input type="text" name="name" required minlength="2" class="border border-slate-300 rounded-md px-3 py-2" />
    </label>

    <label class="grid gap-1">
      <span class="text-sm font-semibold">{t('form.email', locale)} <span class="text-red-600">*</span></span>
      <input type="email" name="email" required class="border border-slate-300 rounded-md px-3 py-2" />
    </label>

    <label class="grid gap-1">
      <span class="text-sm font-semibold">{t('form.organization', locale)}</span>
      <input type="text" name="organization" class="border border-slate-300 rounded-md px-3 py-2" />
    </label>

    <label class="grid gap-1">
      <span class="text-sm font-semibold">{t('form.country', locale)}</span>
      <input type="text" name="country" class="border border-slate-300 rounded-md px-3 py-2" />
    </label>

    <label class="grid gap-1">
      <span class="text-sm font-semibold">{t('form.interest', locale)} <span class="text-red-600">*</span></span>
      <select name="interest" id="form-interest" required class="border border-slate-300 rounded-md px-3 py-2 bg-white">
        <option value="hospital" selected={defaultInterest === 'hospital'}>{t('form.interest_hospital', locale)}</option>
        <option value="donor" selected={defaultInterest === 'donor'}>{t('form.interest_donor', locale)}</option>
        <option value="press" selected={defaultInterest === 'press'}>{t('form.interest_press', locale)}</option>
        <option value="opensource" selected={defaultInterest === 'opensource'}>{t('form.interest_opensource', locale)}</option>
        <option value="other" selected={defaultInterest === 'other'}>{t('form.interest_other', locale)}</option>
      </select>
    </label>

    <label class="grid gap-1">
      <span class="text-sm font-semibold">{t('form.message', locale)} <span class="text-red-600">*</span></span>
      <textarea name="message" required minlength="30" rows="6" class="border border-slate-300 rounded-md px-3 py-2"></textarea>
    </label>

    <label class="flex items-start gap-2 text-sm">
      <input type="checkbox" name="consent" required class="mt-1" />
      <span>{t('form.consent', locale)} <a href={localizedPath('/privacy', locale)} class="underline">{t('form.privacy_link', locale)}</a>.</span>
    </label>

    <button type="submit" class="justify-self-start px-5 py-2.5 rounded-md bg-primary-700 text-white font-semibold hover:bg-primary-900">{t('form.submit', locale)}</button>
  </form>

  <script>
    const interest = document.getElementById('form-interest') as HTMLSelectElement | null;
    const subject = document.getElementById('form-subject') as HTMLInputElement | null;
    if (interest && subject) {
      const update = () => { subject.value = `Histiva contact — ${interest.value}`; };
      interest.addEventListener('change', update);
      update();
    }
  </script>
)}
```

- [x] **Step 2: Add form keys to `src/i18n/en.json`**

```json
"form": {
  "name": "Your name",
  "email": "Email",
  "organization": "Organization",
  "country": "Country",
  "interest": "I'd like to",
  "interest_hospital": "Bring Histiva to our clinic",
  "interest_donor": "Sponsor a deployment",
  "interest_press": "Press inquiry",
  "interest_opensource": "Contribute / open source",
  "interest_other": "Other",
  "message": "Message",
  "consent": "I consent to Histiva storing my submission to respond.",
  "privacy_link": "Privacy notice",
  "submit": "Send message",
  "endpoint_missing": "Contact form not configured yet. Please email contact@histiva.org directly."
}
```

- [x] **Step 3: Verify**

Run: `npm run check`
Expected: 0 errors.

- [x] **Step 4: Commit**

```bash
git add src/components/ContactForm.astro src/i18n/en.json
git commit -m "feat: ContactForm with Formspree + interest routing via _subject"
```

_Note (impl 2026-05-13): the conditional `{endpoint && (<form>...</form><script>...</script>)}` requires wrapping the two sibling elements in `<Fragment>...</Fragment>` — Astro's JSX-like expressions need a single root. Plan snippet copies through unchanged otherwise._

---

### Task 20: Content collections — module + FAQ schemas

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/modules/patient.mdx`
- Create: `src/content/modules/admission.mdx`
- (Create stubs for the other 8 modules)
- Create: `src/content/faqs/for-hospitals.yaml`

- [x] **Step 1: Create `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const modules = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    icon: z.string(),
    summary: z.string(),
    status: z.enum(['shipping', 'in-development']).default('shipping'),
    capabilities: z.array(z.string()).min(2).max(6),
  }),
});

const faqs = defineCollection({
  type: 'data',
  schema: z.object({
    section: z.string(),
    items: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
  }),
});

export const collections = { modules, faqs };
```

- [x] **Step 2: Create `src/content/modules/patient.mdx`**

```mdx
---
title: Patient Management
order: 1
icon: lucide:user-round
summary: One record per patient — history, allergies, allergies, vitals, vitals trends.
capabilities:
  - Search by name, ID, phone, or visit number
  - Allergy and chronic condition tracking
  - Vitals trend chart (last 90 days)
  - Audit trail on every read and write
---

The patient module is the spine of Histiva. Every other module — admission, lab, pharmacy, billing — references back to a single canonical patient record.
```

- [x] **Step 3: Create stubs for remaining 9 modules** (admission, outpatient, emergency, inpatient, laboratory, radiology, pharmacy, inventory, billing) following the same template. Use 2-4 capabilities each, drawn from the `histiva-app/docs/rfp.md` §3.2-3.4 and `CLAUDE.md` module list. Each stub is ~10 lines. For billing, set `status: in-development`.

- [x] **Step 4: Create `src/content/faqs/for-hospitals.yaml`**

```yaml
section: for-hospitals
items:
  - q: How long does deployment take?
    a: From discovery call to go-live, typical pilots take 4–6 weeks. The on-site install itself is 1–2 days; training is roughly a week of part-time workshops.
  - q: What hardware do we need?
    a: At minimum one server-grade laptop or small server, a router, and two client devices (any modern browser). For larger clinics we size up.
  - q: Does Histiva work without internet?
    a: Yes. Histiva can run fully on-premise on the clinic's local network. Cloud sync and AI features are optional and configurable per-clinic.
  - q: What does Histiva cost?
    a: The software is free to nonprofit clinics. Deployment cost — installation, training, year-one support — is typically funded by a sponsor; we can help match you with one.
  - q: Who owns our data?
    a: You do. Patient data stays on infrastructure you control. Our role is the software and support around it.
```

- [x] **Step 5: Verify check + build**

Run: `npm run check && npm run build`
Expected: build succeeds; content collections type-validate.

- [x] **Step 6: Commit**

```bash
git add src/content/config.ts src/content/modules/ src/content/faqs/
git commit -m "feat: content collections (10 modules + for-hospitals FAQ)"
```

_Note (impl 2026-05-13): two divergences shipped with this task:_
_1. Astro 6 deprecated the legacy `src/content/config.ts` + `type: 'content'`/`type: 'data'` pattern. Config file MUST live at `src/content.config.ts` (project root) AND each collection MUST declare an explicit `loader: glob({ pattern, base })` from `astro/loaders`. Schema bodies unchanged. Consumer API (`getEntry('modules', '<slug>')`) is preserved, so downstream Tasks 23/27/etc. need no changes — but the actual file path used by `git add` is `src/content.config.ts`, not `src/content/config.ts`._
_2. `patient.mdx` summary in the plan had a duplicated `"allergies, allergies"` — clearly an editing typo. Shipped as `"One record per patient — history, allergies, vitals, and vitals trends."` (single allergies + connecting `and`)._

---

### Task 21: Locale shells for tr/fr/ar (empty JSONs already exist)

**Files:**
- Modify: `src/i18n/tr.json` (still empty per Task 7 — keep empty for v1)
- Modify: `src/i18n/fr.json` (empty)
- Modify: `src/i18n/ar.json` (empty)

Already shipped in Task 7. **No-op task** kept as a marker so the order of operations in subagent-driven-development matches the spec. Move to Task 22.

---

## Phase D — Pages (Tasks 22-31)

Each page has two parts:
1. **Body component** at `src/components/pages/<Name>Body.astro` — does the layout work, accepts `locale` prop.
2. **Route files** at `src/pages/<slug>.astro` (EN) and `src/pages/{tr,fr,ar}/<slug>.astro` (others). Each route is a 5-line thin wrapper.

### Task 22: Homepage `/` (and tr/fr/ar variants)

**Files:**
- Create: `src/components/pages/HomeBody.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/tr/index.astro`
- Create: `src/pages/fr/index.astro`
- Create: `src/pages/ar/index.astro`

- [x] **Step 1: Create `src/components/pages/HomeBody.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import Hero from '~/components/Hero.astro';
import PillarGrid from '~/components/PillarGrid.astro';
import StorySection from '~/components/StorySection.astro';
import ModuleGrid from '~/components/ModuleGrid.astro';
import TwoPathCTA from '~/components/TwoPathCTA.astro';
import { type Locale, t, localizedPath } from '~/i18n/utils';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
---
<Layout title={t('home.meta_title', locale)} description={t('home.meta_description', locale)} locale={locale}>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <Hero
    title={t('home.hero_title', locale)}
    subtitle={t('home.hero_subtitle', locale)}
    primaryCta={{ label: t('common.schedule_demo', locale), href: localizedPath('/contact', locale) }}
    secondaryCta={{ label: t('common.for_donors', locale), href: localizedPath('/for-donors', locale) }}
  />

  <PillarGrid locale={locale} />

  <StorySection
    eyebrow={t('story.eyebrow', locale)}
    title={t('story.title', locale)}
    body={t('story.body', locale)}
  />

  <ModuleGrid locale={locale} />

  <TwoPathCTA locale={locale} />

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 2: Add home meta keys to `src/i18n/en.json`**

```json
"home": {
  "meta_title": "Hospital records, everywhere they're needed",
  "meta_description": "A modern, AI-powered hospital information system for nonprofit clinics in low-resource settings — modular, mobile-ready, and built to international healthcare standards.",
  "hero_title": "Hospital records, everywhere they're needed.",
  "hero_subtitle": "A modern, AI-powered hospital information system for nonprofit clinics in low-resource settings — modular, mobile-ready, and built to international healthcare standards."
}
```

- [x] **Step 3: Create `src/pages/index.astro`**

```astro
---
import HomeBody from '~/components/pages/HomeBody.astro';
---
<HomeBody locale="en" />
```

- [x] **Step 4: Create `src/pages/tr/index.astro`**

```astro
---
import HomeBody from '~/components/pages/HomeBody.astro';
---
<HomeBody locale="tr" />
```

- [x] **Step 5: Create `src/pages/fr/index.astro` and `src/pages/ar/index.astro` analogously** (3-line wrappers, `locale="fr"` and `locale="ar"` respectively).

- [x] **Step 6: Run build + verify**

Run: `npm run build && npm run preview &` then visit `http://localhost:4321/` and `http://localhost:4321/ar/`.
Expected: EN homepage renders fully. AR page shows TranslationBanner, same content, `<html lang="ar" dir="rtl">` on inspect.

- [x] **Step 7: Commit**

```bash
git add src/components/pages/HomeBody.astro src/pages/index.astro src/pages/tr/ src/pages/fr/ src/pages/ar/ src/i18n/en.json
git commit -m "feat: homepage body + 4-locale route wrappers"
```

_Note (impl 2026-05-13): build emits per-page WARN logs of the form `Could not render /tr from route /tr/ as it conflicts with higher priority route /tr` (one per non-EN locale). These come from Astro's `fallback: { tr: 'en', fr: 'en', ar: 'en' }` config trying to auto-emit fallback routes while our explicit `src/pages/<locale>/index.astro` files win precedence. Output is correct — 4 HTML files per page, one per locale. The warnings are benign noise but will recur for every page in Tasks 23-29. To silence before Task 33 Lighthouse: remove the `fallback` block from `astro.config.mjs` (we handle fallback semantically via `<TranslationBanner />` + EN content rendering, not via route-level redirect)._

---

### Task 23: `/product` page (and locale variants)

**Files:**
- Create: `src/components/pages/ProductBody.astro`
- Create: `src/pages/product.astro`
- Create: `src/pages/tr/product.astro`
- Create: `src/pages/fr/product.astro`
- Create: `src/pages/ar/product.astro`

- [x] **Step 1: Create `src/components/pages/ProductBody.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import { getCollection } from 'astro:content';
import { Icon } from 'astro-icon/components';
import { type Locale, t, localizedPath } from '~/i18n/utils';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
const modules = (await getCollection('modules')).sort((a, b) => a.data.order - b.data.order);
---
<Layout title={t('product.meta_title', locale)} description={t('product.meta_description', locale)} locale={locale}>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <section class="container-page py-16">
    <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold mb-2">{t('product.eyebrow', locale)}</p>
    <h1 class="text-4xl text-primary-900 max-w-3xl">{t('product.title', locale)}</h1>
    <p class="mt-4 text-lg text-ink-600 max-w-3xl">{t('product.subtitle', locale)}</p>
  </section>

  <section class="container-page pb-8">
    <nav aria-label="Module table of contents" class="bg-primary-100/40 rounded-lg p-4">
      <p class="text-xs uppercase tracking-wider text-primary-700 font-semibold mb-2">{t('product.toc', locale)}</p>
      <ul class="flex flex-wrap gap-2 text-sm">
        {modules.map((m) => (
          <li><a href={`#${m.slug}`} class="px-2 py-1 rounded bg-white border border-primary-100 hover:bg-primary-100">{m.data.title}</a></li>
        ))}
      </ul>
    </nav>
  </section>

  {modules.map(async (m) => {
    const { Content } = await m.render();
    return (
      <section id={m.slug} class="container-page py-10 border-t border-slate-200">
        <div class="flex items-center gap-3 mb-3">
          <Icon name={m.data.icon} size={24} class="text-primary-700" />
          <h2 class="text-2xl text-primary-900">{m.data.title}</h2>
          {m.data.status === 'in-development' && <span class="text-xs uppercase tracking-wider bg-warning-50 text-warning-700 px-2 py-0.5 rounded">{t('product.in_dev', locale)}</span>}
        </div>
        <p class="text-ink-600 mb-4 max-w-3xl">{m.data.summary}</p>
        <ul class="grid sm:grid-cols-2 gap-2 mb-4 max-w-3xl">
          {m.data.capabilities.map((c) => (
            <li class="text-sm text-ink-900 flex items-start gap-2">
              <Icon name="lucide:check" size={16} class="text-primary-700 mt-0.5 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <div class="prose prose-sm text-ink-600 max-w-3xl"><Content /></div>
      </section>
    );
  })}

  <section class="container-page py-12 text-center">
    <a href={localizedPath('/contact', locale)} class="inline-flex items-center px-6 py-3 rounded-md bg-primary-700 text-white font-semibold hover:bg-primary-900">{t('product.see_in_action', locale)} →</a>
  </section>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 2: Add product keys to `en.json`**

```json
"product": {
  "meta_title": "Product · Histiva",
  "meta_description": "Ten modules covering patient management, admission, lab, radiology, pharmacy, inventory, and billing.",
  "eyebrow": "Product",
  "title": "Ten modules. One coherent system.",
  "subtitle": "From patient intake to billing, every workflow lives in the same audit trail and the same role-based permission model.",
  "toc": "Modules",
  "in_dev": "In development",
  "see_in_action": "See it in your clinic"
}
```

- [x] **Step 3: Create 4 thin route files** at `src/pages/product.astro`, `src/pages/tr/product.astro`, `src/pages/fr/product.astro`, `src/pages/ar/product.astro` following Task 22 pattern.

- [x] **Step 4: Build + verify**

Run: `npm run build`
Expected: `/product` renders 10 module sections with TOC.

- [x] **Step 5: Commit**

```bash
git add src/components/pages/ProductBody.astro src/pages/product.astro src/pages/tr/product.astro src/pages/fr/product.astro src/pages/ar/product.astro src/i18n/en.json
git commit -m "feat: /product page with module TOC + MDX content"
```

_Note (impl 2026-05-13): adapted snippet for Content Layer API (per Task 20). Replaced `await m.render()` with `await render(m)` (top-level `render` imported from `astro:content`), and `m.slug` with `m.id` for the anchor IDs and TOC hrefs. Same pattern applies to Tasks 24/27 where they use MDX rendering._

---

### Task 24: `/ai` page (and locale variants)

**Files:**
- Create: `src/content/pages/ai.en.mdx`
- Create: `src/components/pages/AiBody.astro`
- Create: `src/pages/ai.astro` (+ tr/fr/ar variants)

- [x] **Step 1: Create `src/content/pages/ai.en.mdx`**

```mdx
---
title: AI & Local LLM
description: How Histiva uses AI — cloud or local — and what it explicitly does not do.
---

## The two modes

Histiva supports **cloud AI** (OpenAI, Anthropic, others) for clinics with reliable internet, and **local LLM** (Ollama, llama.cpp) for clinics where data must stay on-premise or where bandwidth is unreliable. Each clinic chooses at install time and can switch later.

### Cloud mode

- Lower setup cost — no GPU required on-site.
- Higher quality (frontier models).
- Tradeoff: requires internet and a per-call cost.

### Local mode

- Data never leaves the hospital network.
- Works offline.
- Tradeoff: needs a modest GPU server; quality is good but not frontier.

## What the AI does

- **Triage assistance.** Surfaces concerning findings in vitals and free-text notes for a clinician to confirm. Never makes the diagnosis.
- **Clinical-note summarization.** Compresses long admission notes into a structured handoff summary, with the original preserved.
- **Decision-support hints.** Flags drug interactions, missing tests, and standards-of-care gaps. Always optional, never blocking.
- **Multilingual transcription.** Doctor speaks in any language; structured note appears in the patient record.

## What the AI does *not* do

- **No autonomous prescriptions, orders, or referrals.** Every action is human-confirmed.
- **No PII leaves the site unless cloud mode is explicitly enabled.**
- **No audit gaps.** Every AI call is logged: who asked, what was sent, what came back, what was accepted.

## Agentic workflows (preview)

In limited contexts, Histiva can run multi-step workflows on the clinician's behalf — e.g., "if a critical lab value comes back, draft the patient notification and route to the on-call doctor for approval." All steps are visible, reversible, and audited.

## Want to see it?

[Schedule a demo](/contact) — we'll walk you through both modes with anonymized examples.
```

- [x] **Step 2: Add ai collection to `src/content/config.ts`**

Update `collections` export:

```ts
const pages = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string(), description: z.string() }),
});

export const collections = { modules, faqs, pages };
```

- [x] **Step 3: Create `src/components/pages/AiBody.astro`** — uses Layout + nav + footer chrome and renders the MDX content from the `pages` collection (entry `aien` — see impl-note below). Pattern mirrors Task 23 with single-content rendering.

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import Hero from '~/components/Hero.astro';
import { getEntry } from 'astro:content';
import { type Locale, t, localizedPath } from '~/i18n/utils';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
const entry = await getEntry('pages', 'ai.en');
const { Content } = await entry!.render();
---
<Layout title={t('ai.meta_title', locale)} description={t('ai.meta_description', locale)} locale={locale}>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <Hero
    eyebrow={t('ai.eyebrow', locale)}
    title={t('ai.hero_title', locale)}
    subtitle={t('ai.hero_subtitle', locale)}
    primaryCta={{ label: t('common.schedule_demo', locale), href: localizedPath('/contact', locale) }}
  />

  <article class="container-page py-12 prose prose-slate max-w-3xl">
    <Content />
  </article>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 4: Add AI keys to `en.json`**

```json
"ai": {
  "meta_title": "AI & Local LLM · Histiva",
  "meta_description": "AI that works where the internet doesn't — cloud or local, clinician-supervised.",
  "eyebrow": "AI & Local LLM",
  "hero_title": "AI that works where the internet doesn't.",
  "hero_subtitle": "Histiva runs on cloud or on-premise local LLMs. The clinic chooses. The clinician decides. Every AI call is auditable."
}
```

- [x] **Step 5: Create 4 thin route files** at `src/pages/ai.astro`, `src/pages/tr/ai.astro`, `src/pages/fr/ai.astro`, `src/pages/ar/ai.astro`.

- [x] **Step 6: Build + verify**

Run: `npm run build`
Expected: success. `/ai` renders MDX content.

- [x] **Step 7: Commit**

```bash
git add src/content/pages/ai.en.mdx src/content/config.ts src/components/pages/AiBody.astro src/pages/ai.astro src/pages/tr/ai.astro src/pages/fr/ai.astro src/pages/ar/ai.astro src/i18n/en.json
git commit -m "feat: /ai page with MDX deep-dive content"
```

_Note (impl 2026-05-13): TWO important findings (supersedes HANDOFF "Critical gotchas" §i18n fallback semantics line):_
_1. Config still lives at `src/content.config.ts` (project root, per Task 20 deviation) — when this task says "add to `src/content/config.ts`", read it as "add to the project-root content.config.ts file"._
_2. **Content Layer glob loader strips dots from filenames.** Files named `ai.en.mdx`, `about.en.mdx`, etc. produce IDs `aien`, `abouten`, etc. (NOT `ai.en`/`about.en`). All `getEntry('pages', '<id>')` calls in this task and any future page (Task 27 etc.) must use the dotless form. When TR content arrives in Phase 2 as `ai.tr.mdx`, its id will be `aitr`. The HANDOFF "Critical gotchas" line `getEntry('pages', 'ai.en')` is incorrect under Content Layer; the correct call is `getEntry('pages', 'aien')`._

---

### Task 25: `/for-hospitals` page

**Files:**
- Create: `src/components/pages/ForHospitalsBody.astro`
- Create: `src/pages/for-hospitals.astro` (+ 3 locale variants)

- [x] **Step 1: Create `src/components/pages/ForHospitalsBody.astro`**

Structure: Layout → Hero → "Who this is for" section → "How deployment works" 4-step timeline (numbered cards) → "What you need / what we provide" two-column → Cost section (transparent) → FAQList (uses `for-hospitals` FAQ data collection from Task 20) → ContactForm with `defaultInterest="hospital"`.

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import Hero from '~/components/Hero.astro';
import FAQList from '~/components/FAQList.astro';
import ContactForm from '~/components/ContactForm.astro';
import { getEntry } from 'astro:content';
import { type Locale, t, localizedPath } from '~/i18n/utils';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
const faq = await getEntry('faqs', 'for-hospitals');
const steps = [
  { n: '01', titleKey: 'for_hospitals.step1.title', bodyKey: 'for_hospitals.step1.body' },
  { n: '02', titleKey: 'for_hospitals.step2.title', bodyKey: 'for_hospitals.step2.body' },
  { n: '03', titleKey: 'for_hospitals.step3.title', bodyKey: 'for_hospitals.step3.body' },
  { n: '04', titleKey: 'for_hospitals.step4.title', bodyKey: 'for_hospitals.step4.body' },
];
---
<Layout title={t('for_hospitals.meta_title', locale)} description={t('for_hospitals.meta_description', locale)} locale={locale}>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <Hero
    eyebrow={t('for_hospitals.eyebrow', locale)}
    title={t('for_hospitals.hero_title', locale)}
    subtitle={t('for_hospitals.hero_subtitle', locale)}
    primaryCta={{ label: t('common.schedule_demo', locale), href: localizedPath('/contact', locale) }}
  />

  <section class="container-page py-12">
    <h2 class="text-2xl text-primary-900 mb-6">{t('for_hospitals.steps_title', locale)}</h2>
    <ol class="grid md:grid-cols-2 gap-4">
      {steps.map((s) => (
        <li class="bg-white border border-slate-200 rounded-xl p-5">
          <span class="text-xs font-bold tracking-[0.12em] text-primary-700">{s.n}</span>
          <h3 class="text-lg text-primary-900 mt-2">{t(s.titleKey, locale)}</h3>
          <p class="text-sm text-ink-600 mt-1 leading-relaxed">{t(s.bodyKey, locale)}</p>
        </li>
      ))}
    </ol>
  </section>

  <section class="container-page py-8 grid md:grid-cols-2 gap-6">
    <div class="bg-primary-100/40 rounded-xl p-6">
      <h3 class="text-lg text-primary-900 mb-2">{t('for_hospitals.need_title', locale)}</h3>
      <ul class="text-sm text-ink-900 space-y-1.5 list-disc list-inside">
        <li>{t('for_hospitals.need_1', locale)}</li>
        <li>{t('for_hospitals.need_2', locale)}</li>
        <li>{t('for_hospitals.need_3', locale)}</li>
      </ul>
    </div>
    <div class="bg-success-50 rounded-xl p-6">
      <h3 class="text-lg text-success-700 mb-2">{t('for_hospitals.provide_title', locale)}</h3>
      <ul class="text-sm text-ink-900 space-y-1.5 list-disc list-inside">
        <li>{t('for_hospitals.provide_1', locale)}</li>
        <li>{t('for_hospitals.provide_2', locale)}</li>
        <li>{t('for_hospitals.provide_3', locale)}</li>
      </ul>
    </div>
  </section>

  <section class="container-page py-8">
    <div class="bg-white border border-slate-200 rounded-xl p-6 max-w-3xl">
      <p class="text-xs uppercase tracking-[0.12em] text-warning-700 font-semibold">{t('for_hospitals.cost_eyebrow', locale)}</p>
      <h3 class="text-xl text-primary-900 mt-1">{t('for_hospitals.cost_title', locale)}</h3>
      <p class="text-ink-600 mt-2 leading-relaxed whitespace-pre-line">{t('for_hospitals.cost_body', locale)}</p>
    </div>
  </section>

  {faq && <FAQList title={t('for_hospitals.faq_title', locale)} items={faq.data.items} />}

  <section class="container-page py-12">
    <h2 class="text-2xl text-primary-900 mb-4">{t('for_hospitals.cta_title', locale)}</h2>
    <ContactForm locale={locale} defaultInterest="hospital" />
  </section>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 2: Add for_hospitals keys to `en.json`**

```json
"for_hospitals": {
  "meta_title": "For Hospitals & NGOs · Histiva",
  "meta_description": "Bring Histiva to your clinic. Deployment timeline, hardware requirements, costs, and FAQs.",
  "eyebrow": "For hospitals & NGOs",
  "hero_title": "Bring Histiva to your clinic in days, not months.",
  "hero_subtitle": "Discovery, install, training, go-live — typically 4 to 6 weeks. The software is free to nonprofit clinics; deployment cost is usually sponsor-funded.",
  "steps_title": "How deployment works",
  "step1": { "title": "Discovery call", "body": "30-minute conversation to understand your clinic's workflow, scale, and constraints." },
  "step2": { "title": "Site assessment + sizing", "body": "We size hardware, network, and training needs. Quoted as a sponsor-funded package." },
  "step3": { "title": "Install + data setup", "body": "On-site or remote, typically 1–2 days. Initial users, departments, master data loaded." },
  "step4": { "title": "Training + go-live", "body": "One week of role-based workshops for clinicians, admin, and IT. Then live operations." },
  "need_title": "What you'll need",
  "need_1": "One server-grade laptop or small server + a router",
  "need_2": "Two or more client devices (any modern browser)",
  "need_3": "An on-site staff member willing to be the in-clinic admin",
  "provide_title": "What we provide",
  "provide_1": "Installation, training, and year-one support",
  "provide_2": "Help finding a sponsor to fund the deployment",
  "provide_3": "Ongoing software updates and security patches",
  "cost_eyebrow": "Transparent cost",
  "cost_title": "Software free. Deployment sponsor-funded.",
  "cost_body": "Histiva software is free to nonprofit clinics under the project license. Deployment — installation, training, and year-one support — is typically covered by a donor or foundation sponsor. We help match you with one.",
  "faq_title": "Common questions",
  "cta_title": "Start a conversation"
}
```

- [x] **Step 3: Create 4 thin route files** at `src/pages/for-hospitals.astro` + 3 locale variants.

- [x] **Step 4: Build + verify**

Run: `npm run build`
Expected: page renders with hero, 4-step grid, two-column need/provide, cost block, FAQ, form.

- [x] **Step 5: Commit**

```bash
git add src/components/pages/ForHospitalsBody.astro src/pages/for-hospitals.astro src/pages/tr/for-hospitals.astro src/pages/fr/for-hospitals.astro src/pages/ar/for-hospitals.astro src/i18n/en.json
git commit -m "feat: /for-hospitals page with deployment timeline + FAQ + form"
```

---

### Task 26: `/for-donors` page

**Files:**
- Create: `src/components/pages/ForDonorsBody.astro`
- Create: `src/pages/for-donors.astro` (+ 3 locale variants)

- [x] **Step 1: Create `src/components/pages/ForDonorsBody.astro`**

Same import block + slot wiring as `ForHospitalsBody.astro` (Task 25 Step 1) — replicate the Layout/TopRibbon/SiteNav/SiteFooter/TranslationBanner/CookieBanner/Analytics scaffolding verbatim, swap the `Hero` and replace the steps + need/provide + cost + FAQ sections with the four sections below.

Hero block:

```astro
<Hero
  eyebrow={t('for_donors.eyebrow', locale)}
  title={t('for_donors.hero_title', locale)}
  subtitle={t('for_donors.hero_subtitle', locale)}
  primaryCta={{ label: t('for_donors.cta', locale), href: localizedPath('/contact', locale) }}
/>
```

"What your support funds" — 4-card grid:

```astro
<section class="container-page py-12">
  <h2 class="text-2xl text-primary-900 mb-6">{t('for_donors.funds_title', locale)}</h2>
  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {['install', 'training', 'support', 'development'].map((key) => (
      <article class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xl font-bold text-success-700">$—</p>
        <h3 class="text-base text-primary-900 mt-1">{t(`for_donors.fund_${key}.title`, locale)}</h3>
        <p class="text-sm text-ink-600 mt-1">{t(`for_donors.fund_${key}.body`, locale)}</p>
      </article>
    ))}
  </div>
  <p class="text-xs text-ink-600 mt-3 italic">{t('for_donors.funds_note', locale)}</p>
</section>
```

"Sponsorship tiers" — 3-card grid:

```astro
<section class="container-page py-8">
  <h2 class="text-2xl text-primary-900 mb-6">{t('for_donors.tiers_title', locale)}</h2>
  <div class="grid md:grid-cols-3 gap-4">
    {['individual', 'partner', 'implementation'].map((key) => (
      <article class="bg-success-50 border border-emerald-200 rounded-xl p-5">
        <h3 class="text-lg text-success-700">{t(`for_donors.tier_${key}.title`, locale)}</h3>
        <p class="text-sm text-ink-900 mt-2 leading-relaxed">{t(`for_donors.tier_${key}.body`, locale)}</p>
      </article>
    ))}
  </div>
</section>
```

"Transparency" block + ContactForm:

```astro
<section class="container-page py-8">
  <div class="bg-primary-100/40 rounded-xl p-6 max-w-3xl">
    <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold">{t('for_donors.transparency_eyebrow', locale)}</p>
    <h3 class="text-xl text-primary-900 mt-1">{t('for_donors.transparency_title', locale)}</h3>
    <p class="text-ink-600 mt-2">{t('for_donors.transparency_body', locale)}</p>
  </div>
</section>

<section class="container-page py-12">
  <h2 class="text-2xl text-primary-900 mb-4">{t('for_donors.cta_title', locale)}</h2>
  <ContactForm locale={locale} defaultInterest="donor" />
</section>
```

- [x] **Step 2: Add for_donors keys to `en.json`**

```json
"for_donors": {
  "meta_title": "For Donors & Funders · Histiva",
  "meta_description": "Fund a hospital deployment. Transparent cost breakdown, sponsorship tiers, and how to start.",
  "eyebrow": "For donors & funders",
  "hero_title": "Fund a hospital. Not a feature.",
  "hero_subtitle": "Your support brings Histiva to one clinic — installation, training, and a year of support. Concrete impact, transparent numbers.",
  "cta": "Start a conversation",
  "funds_title": "What your support funds",
  "fund_install": { "title": "Installation", "body": "Hardware sizing, on-site install, initial data load." },
  "fund_training": { "title": "Training", "body": "Role-based workshops for clinicians, admin, and IT." },
  "fund_support": { "title": "Year-one support", "body": "12 months of bug fixes, patches, and help-desk access." },
  "fund_development": { "title": "Software development", "body": "Ongoing improvements that benefit every clinic in the program." },
  "funds_note": "Per-line numbers finalized after the first full deployment closes its books — expected Q3 2026.",
  "tiers_title": "Ways to engage",
  "tier_individual": { "title": "Individual donor", "body": "Smaller contributions pool with others to fund a deployment. Recognized on the supporters page (with permission)." },
  "tier_partner": { "title": "Partner foundation", "body": "Multi-clinic programs. Quarterly reports, named recognition, optional advisory seat." },
  "tier_implementation": { "title": "Implementation sponsor", "body": "Fund a specific clinic end-to-end. Direct line to the deployment team, on-the-ground updates." },
  "transparency_eyebrow": "Transparency",
  "transparency_title": "Where the money goes — visible.",
  "transparency_body": "Once our nonprofit legal entity is formed and the first annual financial report is published, that report will live on this page. Until then, every sponsorship engagement is documented in a private quarterly update shared with the funder.",
  "cta_title": "Sponsor a deployment"
}
```

- [x] **Step 3: Create 4 thin route files** at `src/pages/for-donors.astro` + `src/pages/{tr,fr,ar}/for-donors.astro`, each a 3-line wrapper following the Task 22 pattern.

- [x] **Step 4: Build + verify, commit:**

```bash
git add src/components/pages/ForDonorsBody.astro src/pages/for-donors.astro src/pages/tr/for-donors.astro src/pages/fr/for-donors.astro src/pages/ar/for-donors.astro src/i18n/en.json
git commit -m "feat: /for-donors page with funding breakdown + tiers + form"
```

---

### Task 27: `/about` page

**Files:**
- Create: `src/content/pages/about.en.mdx`
- Create: `src/components/pages/AboutBody.astro`
- Create: `src/pages/about.astro` (+ 3 locale variants)

- [x] **Step 1: Create `src/content/pages/about.en.mdx`**

```mdx
---
title: About Histiva
description: A nonprofit hospital information system for clinics where care happens despite the infrastructure.
---

## Mission

Histiva exists for one reason: most hospital software is built for wealthy hospitals in stable economies, and that's exactly where it isn't needed most. The clinics that carry the heaviest care load — the small mission hospital in a rural district, the NGO outpost in a refugee settlement, the church-run maternity ward — are running on paper, on Excel, or on inherited systems abandoned by their original vendors a decade ago.

We are building a modern, modular hospital information system for those clinics. It is mobile-ready because that's what doctors and nurses there actually use. It works offline because the internet doesn't, sometimes for days. It speaks multiple languages because the teams do. And it is free to nonprofit clinics — the deployment cost is borne by sponsors who care about the outcome.

## Team

Histiva is operated by a small, multidisciplinary working group of clinicians, software engineers, and program managers. The team is intentionally small for v1 to keep decisions fast and aligned with the first clinic's lived reality.

We will publish full team biographies once our nonprofit legal entity is registered and team membership is locked. Until then, we're a working group — and the work is what matters.

## Governance

Operated by the Histiva working group, in the process of forming a nonprofit legal entity. The specific framework (Türkiye dernek, US 501(c)(3), UK CIC, or equivalent) is being decided with legal counsel based on where the first major funding originates and which jurisdiction is most efficient for the clinics we serve. We expect to finalize structure by Q3 2026.

## Open source

The product code is published on GitHub under the [Apache-2.0 license](https://github.com/histiva/histiva-app). Pull requests are welcomed — read `CONTRIBUTING.md` first.

## Get in touch

- Bring Histiva to your clinic: [/for-hospitals](/for-hospitals)
- Sponsor a deployment: [/for-donors](/for-donors)
- Anything else: [/contact](/contact)
```

- [x] **Step 2: Create `src/components/pages/AboutBody.astro`**

Same Layout/chrome scaffolding pattern as Task 24's `AiBody.astro` (replicate the import block, the Layout slots, the `getEntry('pages', 'abouten')` MDX load — note the dotless entry id per Task 24 impl-note). Add a "Principles" grid section BETWEEN the Hero and the MDX `<Content />` block:

```astro
<section class="container-page py-12">
  <h2 class="text-2xl text-primary-900 mb-6">{t('about.principles_title', locale)}</h2>
  <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {['opensource', 'clinician_led', 'privacy_default', 'low_resource_tested', 'nonprofit_governed', 'ai_guardrails'].map((key) => (
      <li class="bg-white border border-slate-200 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-primary-900">{t(`about.principle_${key}.title`, locale)}</h3>
        <p class="text-sm text-ink-600 mt-1 leading-relaxed">{t(`about.principle_${key}.body`, locale)}</p>
      </li>
    ))}
  </ul>
</section>
```

- [x] **Step 3: Add about keys to `en.json`**

```json
"about": {
  "meta_title": "About · Histiva",
  "meta_description": "A nonprofit hospital information system for clinics where care happens despite the infrastructure.",
  "eyebrow": "About",
  "hero_title": "A hospital system for the clinics that need it most.",
  "hero_subtitle": "Histiva is operated by a small working group of clinicians and engineers, supported by donors who believe modern hospital software shouldn't be a luxury.",
  "principles_title": "What we hold to",
  "principle_opensource": { "title": "Open-source first", "body": "Code is published. Trust through visibility." },
  "principle_clinician_led": { "title": "Clinician-led", "body": "Every feature passes a real clinician's smell test." },
  "principle_privacy_default": { "title": "Privacy by default", "body": "Patient data stays where the hospital wants it." },
  "principle_low_resource_tested": { "title": "Low-resource tested", "body": "If it doesn't work on an old tablet over flaky wifi, it's not done." },
  "principle_nonprofit_governed": { "title": "Nonprofit-governed", "body": "Mission outranks revenue. Always." },
  "principle_ai_guardrails": { "title": "AI with guardrails", "body": "The clinician always decides. The audit log never lies." }
}
```

- [x] **Step 4: Create 4 route files** (`/about.astro` + 3 locale variants). Build, verify, commit:

```bash
git add src/content/pages/about.en.mdx src/components/pages/AboutBody.astro src/pages/about.astro src/pages/tr/about.astro src/pages/fr/about.astro src/pages/ar/about.astro src/i18n/en.json
git commit -m "feat: /about page with mission + principles + MDX narrative"
```

---

### Task 28: `/contact` + `/thank-you`

**Files:**
- Create: `src/components/pages/ContactBody.astro`
- Create: `src/components/pages/ThankYouBody.astro`
- Create: `src/pages/contact.astro` (+ 3 locale variants)
- Create: `src/pages/thank-you.astro` (+ 3 locale variants)

- [x] **Step 1: Create `src/components/pages/ContactBody.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import ContactForm from '~/components/ContactForm.astro';
import { type Locale, t } from '~/i18n/utils';

interface Props { locale: Locale; defaultInterest?: 'hospital' | 'donor' | 'press' | 'opensource' | 'other'; }
const { locale, defaultInterest = 'hospital' } = Astro.props;
const pathname = Astro.url.pathname;
---
<Layout title={t('contact.meta_title', locale)} description={t('contact.meta_description', locale)} locale={locale}>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <section class="container-page py-12 max-w-3xl">
    <h1 class="text-4xl text-primary-900 mb-3">{t('contact.title', locale)}</h1>
    <p class="text-lg text-ink-600 mb-8">{t('contact.subtitle', locale)}</p>
    <ContactForm locale={locale} defaultInterest={defaultInterest} />
  </section>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 2: Create `src/components/pages/ThankYouBody.astro`**

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import { type Locale, t, localizedPath } from '~/i18n/utils';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
---
<Layout title={t('thank_you.meta_title', locale)} description={t('thank_you.meta_description', locale)} locale={locale} noindex>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <section class="container-page py-16 max-w-2xl text-center">
    <h1 class="text-4xl text-primary-900 mb-4">{t('thank_you.title', locale)}</h1>
    <p class="text-lg text-ink-600 mb-8">{t('thank_you.body', locale)}</p>
    <div class="flex justify-center gap-3">
      <a href={localizedPath('/', locale)} class="px-5 py-2.5 rounded-md bg-primary-700 text-white font-semibold">{t('thank_you.home', locale)}</a>
      <a href="https://github.com/histiva" rel="noopener" class="px-5 py-2.5 rounded-md border border-primary-700 text-primary-700 font-semibold">{t('thank_you.github', locale)}</a>
    </div>
  </section>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 3: Add contact + thank_you keys to `en.json`**

```json
"contact": {
  "meta_title": "Contact · Histiva",
  "meta_description": "Get in touch — clinic admin, donor, press, or contributor. We respond within 3 business days.",
  "title": "Get in touch",
  "subtitle": "Tell us a bit about you and we'll route your message to the right person. We respond within 3 business days."
},
"thank_you": {
  "meta_title": "Thanks for reaching out",
  "meta_description": "Your message has been received.",
  "title": "Thanks for reaching out.",
  "body": "We received your message and will respond within 3 business days. In the meantime, feel free to explore the project on GitHub or read the AI deep-dive.",
  "home": "Back to home",
  "github": "Histiva on GitHub"
}
```

- [x] **Step 4: Create 8 route files** (`/contact.astro`, `/thank-you.astro`, + 3 locale variants of each).

- [x] **Step 5: Build + verify, commit:**

```bash
git add src/components/pages/ContactBody.astro src/components/pages/ThankYouBody.astro src/pages/contact.astro src/pages/thank-you.astro src/pages/tr/contact.astro src/pages/tr/thank-you.astro src/pages/fr/contact.astro src/pages/fr/thank-you.astro src/pages/ar/contact.astro src/pages/ar/thank-you.astro src/i18n/en.json
git commit -m "feat: /contact + /thank-you (noindex)"
```

---

### Task 29: `/privacy` page

**Files:**
- Create: `src/content/pages/privacy.en.mdx`
- Create: `src/components/pages/PrivacyBody.astro`
- Create: `src/pages/privacy.astro` (+ 3 locale variants)

- [x] **Step 1: Create `src/content/pages/privacy.en.mdx`**

```mdx
---
title: Privacy
description: How Histiva handles the data we collect on this website.
---

_Last updated: 2026-05-13. This policy covers only **histiva.github.io** — the marketing site. The Histiva HBYS product, deployed inside hospitals, has its own data governance and is not in scope here._

## What we collect

- **Analytics.** When you accept cookies, Google Analytics 4 collects anonymized page-view and interaction data. We use this to understand how the site is read. We do not connect analytics data to identifiable individuals.
- **Contact form submissions.** When you submit the contact form, we receive the name, email, organization, country, interest type, and message you provide. These are stored by [Formspree](https://formspree.io/) (a third-party service based in the United States) and forwarded to a private inbox we operate.

## Cookies

The site uses one essential cookie/localStorage value (`histiva.consent`) to remember your cookie preference. No analytics cookies are set unless you click "Accept" on the banner. You can change your preference by clearing your browser storage for this site; the banner will reappear.

## How long we keep things

- **Contact submissions:** retained for 24 months, then permanently deleted.
- **Analytics:** retained in Google Analytics per GA's default 14-month policy.

## Children's data

This site is not directed at children under 18 and we do not knowingly collect data from them.

## Your rights

You can request access to, correction of, or deletion of any data we hold about you by emailing **privacy@histiva.org** (placeholder — see legal entity note below). We will respond within 30 days.

## Legal entity

Histiva is in the process of forming a nonprofit legal entity. Until that is finalized, this policy is operated by the Histiva working group. The final legal entity name and jurisdiction will appear here once registered.

## Changes

Material changes to this policy will be noted at the top of this page and announced in the GitHub repository.
```

- [x] **Step 2: Create `src/components/pages/PrivacyBody.astro`**

Same Layout/chrome scaffolding pattern as Task 24's `AiBody.astro`, but with:
- No `<Hero>` (replace with a small section that renders `<h1>{t('privacy.title', locale)}</h1>` + sub).
- MDX loaded via `await getEntry('pages', 'privacyen')` (dotless id per Task 24 impl-note).
- Prose container `max-w-3xl`.

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import TranslationBanner from '~/components/TranslationBanner.astro';
import CookieBanner from '~/components/CookieBanner.astro';
import Analytics from '~/components/Analytics.astro';
import { getEntry } from 'astro:content';
import { type Locale, t } from '~/i18n/utils';

interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
const entry = await getEntry('pages', 'privacy.en');
const { Content } = await entry!.render();
---
<Layout title={t('privacy.meta_title', locale)} description={t('privacy.meta_description', locale)} locale={locale}>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />
  <TranslationBanner slot="translation-banner" locale={locale} />

  <section class="container-page py-12 max-w-3xl">
    <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold">{t('privacy.eyebrow', locale)}</p>
    <h1 class="text-4xl text-primary-900 mt-1">{t('privacy.title', locale)}</h1>
  </section>

  <article class="container-page pb-16 prose prose-slate max-w-3xl">
    <Content />
  </article>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
  <CookieBanner slot="cookie-banner" locale={locale} />
  <Analytics slot="analytics" />
</Layout>
```

- [x] **Step 3: Add privacy keys to `en.json`**

```json
"privacy": {
  "meta_title": "Privacy · Histiva",
  "meta_description": "How Histiva handles data collected on histiva.github.io.",
  "eyebrow": "Privacy",
  "title": "Privacy policy"
}
```

- [x] **Step 4: Create 4 route files** (`/privacy.astro` + 3 locale variants). Build, verify, commit:

```bash
git add src/content/pages/privacy.en.mdx src/components/pages/PrivacyBody.astro src/pages/privacy.astro src/pages/tr/privacy.astro src/pages/fr/privacy.astro src/pages/ar/privacy.astro src/i18n/en.json
git commit -m "feat: /privacy page with MDX policy content"
```

---

### Task 30: `404` page

**Files:**
- Create: `src/pages/404.astro`

- [x] **Step 1: Create `src/pages/404.astro`** (single file; Astro auto-routes locale-aware 404s via the `i18n.fallback` behavior for missing localized pages; for hard 404s this file is the shared one.)

```astro
---
import Layout from '~/layouts/Layout.astro';
import TopRibbon from '~/components/TopRibbon.astro';
import SiteNav from '~/components/SiteNav.astro';
import SiteFooter from '~/components/SiteFooter.astro';
import { DEFAULT_LOCALE, t } from '~/i18n/utils';
const locale = DEFAULT_LOCALE;
const pathname = Astro.url.pathname;
---
<Layout title="Not found" description="Page not found." locale={locale} noindex>
  <TopRibbon slot="ribbon" locale={locale} />
  <SiteNav slot="nav" locale={locale} pathname={pathname} />

  <section class="container-page py-24 text-center">
    <p class="text-xs uppercase tracking-[0.12em] text-primary-700 font-semibold">404</p>
    <h1 class="text-4xl text-primary-900 mt-2">{t('not_found.title', locale)}</h1>
    <p class="text-ink-600 mt-3">{t('not_found.body', locale)}</p>
    <a href="/" class="mt-6 inline-block px-5 py-2.5 rounded-md bg-primary-700 text-white font-semibold">{t('not_found.home', locale)}</a>
  </section>

  <SiteFooter slot="footer" locale={locale} pathname={pathname} />
</Layout>
```

- [x] **Step 2: Add not_found keys to `en.json`**

```json
"not_found": {
  "title": "We couldn't find that page.",
  "body": "The link may be old, or the page may have moved. Head back home or check the language version.",
  "home": "Back to home"
}
```

- [x] **Step 3: Build + verify, commit:**

```bash
git add src/pages/404.astro src/i18n/en.json
git commit -m "feat: shared 404 page"
```

---

### Task 31: Image assets — curated photos + OG defaults + illustrations

**Files:**
- Create: `public/img/photos/*` (commit chosen Unsplash images, optimized to ~200kB each)
- Create: `public/img/illustrations/*` (downloaded unDraw SVGs, recolored Trust Blue)
- Create: `public/og/default.png` (1200x630 OG image with wordmark)
- Create: `src/content/photo-credits.json`

- [ ] **Step 1: Curate 6 Unsplash photos** — clinical settings, mobile use, group of clinicians, server room (humble), patient hands (anonymized), tablet on hospital cart. Save each as `<topic>.jpg` in `public/img/photos/`. Optimize via `npx @squoosh/cli` (or hand-resize to 1600px wide @ 80% quality).

- [ ] **Step 2: Pull 4 illustrations from unDraw.co** — "Hospital", "Doctor with tablet", "Charity giving", "Around the world". Save as SVG in `public/img/illustrations/`. Recolor: replace `#6c63ff` (unDraw default) with `#1e40af`; leave other colors.

- [ ] **Step 3: Create `src/content/photo-credits.json`**

```json
[
  { "file": "clinician-tablet.jpg", "source": "Unsplash", "photographer": "...", "url": "https://unsplash.com/photos/..." }
]
```

Fill one row per image actually committed. Track here so credits stay accurate.

- [ ] **Step 4: Create `public/og/default.png`** — 1200x630px, Trust Blue background (#0c2461), centered white "Histiva" wordmark + tagline. Easiest: build in Figma or PowerPoint and export. (One image is enough for v1; per-page OG images deferred.)

- [ ] **Step 5: Wire the hero image into HomeBody.astro** — import `clinician-tablet.jpg` and pass to `<Hero image={...} />` in Task 22's component. This is an Edit to that file.

- [ ] **Step 6: Build + verify, commit:**

```bash
git add public/img/ public/og/ src/content/photo-credits.json src/components/pages/HomeBody.astro
git commit -m "feat: curated photos + unDraw illustrations + default OG image"
```

---

> **Impl-note (Task 31 partial — stubs landed, human curation outstanding):**
>
> Steps 1, 2, and 5 of Task 31 are blocked on human work and were **not**
> completed in the stub commit. What is on disk after the stub commit:
>
> - `public/og/default.png` — programmatically generated 1200x630 placeholder
>   (Trust Blue + white "Histiva" wordmark + subtitle). Generator lives at
>   `scripts/gen-og-default.mjs`; re-run with `node scripts/gen-og-default.mjs`.
>   A human can overwrite this PNG with a designed export (Figma/PowerPoint)
>   without changing any wiring — `Layout.astro` references the path directly.
> - `public/img/photos/.gitkeep`, `public/img/illustrations/.gitkeep` — empty
>   placeholders so git tracks the directory structure.
> - `src/content/photo-credits.json` — empty JSONC array (`[]`) with a
>   header comment describing the future entry shape. No code imports it
>   today; it is a human-curated registry only.
>
> Deferred to a human (NOT done by the AI agent):
>
> 1. **Curate 6 Unsplash photos** per Step 1's shot list, optimize to
>    ~200kB each, save under `public/img/photos/`.
> 2. **Download 4 unDraw illustrations** per Step 2, recolor `#6c63ff` →
>    `#1e40af`, save under `public/img/illustrations/`.
> 3. **Fill `src/content/photo-credits.json`** with one entry per committed
>    image; strip the header comment block once entries are added so the
>    file becomes strict valid JSON.
> 4. **Replace `public/og/default.png`** with a designed export if more
>    polish is desired beyond the SVG-rendered placeholder.
> 5. **Wire the hero image into `HomeBody.astro`** (Step 5) — only after
>    `clinician-tablet.jpg` actually exists. Until then, `HomeBody.astro`
>    intentionally remains image-less (matches Task 22's shipped version).

---

## Phase E — E2E + Polish (Tasks 32-35)

### Task 32: Playwright smoke E2E

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/homepage.spec.ts`
- Create: `tests/e2e/language-switch.spec.ts`
- Create: `tests/e2e/form-shape.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  use: { baseURL: 'http://localhost:4321', headless: true },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
```

- [ ] **Step 2: Create `tests/e2e/homepage.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('homepage renders hero + pillars + module grid + dual CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Hospital records');
  await expect(page.getByRole('link', { name: /Schedule a demo/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /For donors/i }).first()).toBeVisible();
  const pillars = page.locator('article').filter({ hasText: /AI-Powered|Mobile-first|Standards-compliant|Secure/ });
  await expect(pillars).toHaveCount(4);
});

test('arabic homepage sets dir=rtl and shows translation banner', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.getByText(/Translation in progress/i)).toBeVisible();
});

test('cookie banner appears on first visit and dismisses', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog', { name: /cookies/i })).toBeVisible();
  await page.getByRole('button', { name: /Decline/i }).click();
  await expect(page.getByRole('dialog', { name: /cookies/i })).toBeHidden();
  await page.reload();
  await expect(page.getByRole('dialog', { name: /cookies/i })).toBeHidden();
});
```

- [ ] **Step 3: Create `tests/e2e/language-switch.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('language switcher navigates EN → TR → AR with correct URL prefix', async ({ page }) => {
  await page.goto('/about');
  await page.locator('details').first().click();
  await page.getByRole('link', { name: 'Türkçe' }).first().click();
  await expect(page).toHaveURL(/\/tr\/about/);
  await page.locator('details').first().click();
  await page.getByRole('link', { name: 'العربية' }).first().click();
  await expect(page).toHaveURL(/\/ar\/about/);
});
```

- [ ] **Step 4: Create `tests/e2e/form-shape.spec.ts`** (no live submission — we only check the form's structure and that Formspree action is set correctly when endpoint env is provided.)

```ts
import { test, expect } from '@playwright/test';

test.beforeAll(() => {
  if (!process.env.PUBLIC_FORMSPREE_ENDPOINT) {
    process.env.PUBLIC_FORMSPREE_ENDPOINT = 'https://formspree.io/f/test';
  }
});

test('contact form has all required fields and honeypot', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('select[name="interest"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('input[name="_gotcha"]')).toBeHidden();
  await expect(page.locator('form')).toHaveAttribute('action', /formspree\.io/);
});
```

- [ ] **Step 5: Install playwright browsers**

Run: `npx playwright install chromium`

- [ ] **Step 6: Run E2E suite**

Run: `npm run build && npm run test:e2e`
Expected: all three specs pass.

- [ ] **Step 7: Add E2E to CI**

Update `.github/workflows/ci.yml` — add a job step:

```yaml
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
        env:
          PUBLIC_FORMSPREE_ENDPOINT: https://formspree.io/f/test
```

- [ ] **Step 8: Commit**

```bash
git add playwright.config.ts tests/e2e/ .github/workflows/ci.yml
git commit -m "test(e2e): playwright smoke for homepage, language switch, form shape"
```

---

### Task 33: Lighthouse CI threshold gate

**Files:**
- Create: `.github/workflows/lighthouse.yml`
- Create: `lighthouserc.json`

- [ ] **Step 1: Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4321/", "http://localhost:4321/product", "http://localhost:4321/contact"],
      "startServerCommand": "npm run preview",
      "startServerReadyPattern": "Local",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.92 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

- [ ] **Step 2: Create `.github/workflows/lighthouse.yml`**

```yaml
name: Lighthouse

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run build
      - run: npx -y @lhci/cli@0.14 autorun
```

- [ ] **Step 3: Run locally first to confirm thresholds**

Run: `npm run build && npx @lhci/cli@0.14 autorun`
If any score below threshold, fix (image sizes, missing alt text, color contrast) before merging.

- [ ] **Step 4: Commit**

```bash
git add lighthouserc.json .github/workflows/lighthouse.yml
git commit -m "ci: lighthouse audit gating perf/a11y/best-practices/seo"
```

---

### Task 34: Final self-check + sitemap verification

**Files:** none directly — verification only.

- [ ] **Step 1: Local production build + preview**

Run: `npm run build && npm run preview`
Open `http://localhost:4321` and click through every nav link, language switcher, every two-path CTA, and the form. Note any visual regression.

- [ ] **Step 2: Verify sitemap**

Open `http://localhost:4321/sitemap-index.xml` — confirm all 8 EN pages + 3 × 8 = 24 locale pages listed.

- [ ] **Step 3: Verify hreflang on a sample page**

Run: `curl -s http://localhost:4321/about | grep hreflang`
Expected: 4 `<link rel="alternate" hreflang="...">` lines.

- [ ] **Step 4: Verify Arabic RTL renders without overflow**

Open `http://localhost:4321/ar/`. Resize browser to 360px width (mobile). Confirm hero + pillar grid + module grid + form do not overflow horizontally; text aligns to the right.

- [ ] **Step 5: Verify GA4 doesn't fire before consent**

In a fresh browser profile, open `http://localhost:4321/` (with `PUBLIC_GA_MEASUREMENT_ID` set). Network tab: confirm NO request to `googletagmanager.com`. Click "Accept" in the banner — now the request fires.

- [ ] **Step 6: Address any issue inline; commit fixes individually with descriptive messages.**

No commit if no issues found — this is a verification task only.

---

### Task 35: First production deploy + smoke-test live URL

**Files:** none — operational.

- [ ] **Step 1: Configure repo settings**

In the GitHub repo (`histiva/histiva.github.io`), under Settings:
- Pages → Source: GitHub Actions
- Variables (under "Secrets and variables" → Actions → Variables):
  - `PUBLIC_GA_MEASUREMENT_ID` = (the GA4 ID)
  - `PUBLIC_FORMSPREE_ENDPOINT` = (the Formspree URL from Formspree dashboard)

- [ ] **Step 2: Push `main`**

```bash
git push -u origin main
```

- [ ] **Step 3: Watch the deploy workflow**

Open the Actions tab. The deploy workflow should complete in ~90s.

- [ ] **Step 4: Smoke-test live site**

Visit `https://histiva.github.io/`:
- Hero loads, font is Inter
- All nav links resolve to 200
- Cookie banner appears, accepts/declines correctly
- Language switcher works; `/ar/` is RTL
- Form on `/contact` accepts a real submission (use a throwaway email; verify the Formspree inbox receives it)

- [ ] **Step 5: Document in `README.md` that production is live**

Add at top:

```markdown
**Status:** Live at https://histiva.github.io/ since 2026-MM-DD.
```

- [ ] **Step 6: Commit + push the README update**

```bash
git add README.md
git commit -m "docs: mark production live"
git push
```

---

## Acceptance Gate

The plan is complete when, with `main` deployed:

- ✅ All 8 EN pages render (Lighthouse ≥92 perf / 95 a11y / 95 best-practices / 95 SEO).
- ✅ TR/FR/AR locale variants of all pages render with the TranslationBanner; Arabic is RTL without layout breaks.
- ✅ Language switcher in nav + footer works on every page.
- ✅ Cookie banner gates GA4 correctly.
- ✅ Contact form successfully delivers a test submission to a real inbox via Formspree.
- ✅ CI pipeline (typecheck + lint + vitest + build + Lighthouse + Playwright) passes on `main`.
- ✅ Deploy workflow completes <2 minutes from push.
- ✅ Repository has the documented variables set; the README is updated to reflect live status.

When acceptance gate green: close out with one final commit tagging the milestone, then move scope to spec §17 "open questions" (legal entity, license, partner consent) and content fills.

---

## Open Items Carried From Spec §17

These are NOT plan tasks (they're business decisions, not engineering work), but listed here so the engineer notices them while executing:

1. Legal entity name + jurisdiction (placeholder text shipped — needs replacement before legal exposure).
2. Contact email addresses (`contact@`, `privacy@`, `press@`) need to be set up at the chosen domain (currently `histiva.org` is referenced as a placeholder).
3. Open-source license confirmation (default Apache-2.0).
4. First-partner hospital consent for naming.
5. OG image illustrator decision (DIY in Figma vs. unDraw-derived templates).
6. Cookie-banner legal-review pass.

If any of these resolve during implementation, update the relevant content file + spec §17 in the same commit.
