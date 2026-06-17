# CLAUDE.md — MediSina Marketing Site

Read first. Trust code over this file; update if they diverge.

## What this repo is

The public marketing website for **MediSina**, the nonprofit hospital information system. **Not** the product code — that lives at `/home/cevheri/projects/hbys/medisina-app/` (sibling repo, separate project).

Live at https://medisina-health.github.io/ once deployed.

## Authoritative docs

1. `docs/superpowers/specs/2026-05-13-medisina-marketing-site-design.md` — design spec, brand, IA, content outlines
2. `docs/superpowers/plans/2026-05-13-medisina-marketing-site.md` — implementation plan
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
