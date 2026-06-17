# HANDOFF — MediSina Marketing Site (Implementation Session)

> **You are starting a fresh Claude Code session in this folder.** This file briefs you. Read it top-to-bottom before touching anything else, then start work.

## TL;DR

You are about to execute a **35-task implementation plan** for `medisina-health.github.io` — the public marketing website for **MediSina**, the nonprofit hospital information system. Brainstorming and planning are done. The spec is approved. The plan is approved. Your job is to ship it task-by-task using **subagent-driven development**.

Two committed files contain everything you need:

1. **Spec** (authoritative on intent): `docs/superpowers/specs/2026-05-13-medisina-marketing-site-design.md` — 18 sections.
2. **Plan** (authoritative on steps): `docs/superpowers/plans/2026-05-13-medisina-marketing-site.md` — 35 tasks across 5 phases (A → E).

When the spec and the plan diverge, **the spec wins** — open a clarifying question to the user, do not drift silently.

When the plan and the actual code reality diverge (e.g., an Astro 6.3 API behaves differently than the plan assumes), **the code wins** — adjust the plan inline with a brief note, commit the adjustment in the same task, and continue.

---

## What this site IS (and isn't)

**IS:**
- A static marketing site for MediSina, the nonprofit hospital information system (HBYS).
- Deployed to GitHub Pages at `https://medisina-health.github.io/`.
- 8 pages: `/`, `/product`, `/ai`, `/for-hospitals`, `/for-donors`, `/about`, `/contact`, `/privacy` (+ `/thank-you` + `/404`).
- 4 locales: EN (full), TR/FR/AR (route shells + EN fallback for v1).

**ISN'T:**
- The HBYS product itself — that lives at `/home/cevheri/projects/hbys/medisina-app/` (a separate Next.js + PostgreSQL repo, do NOT modify it from this session).
- A blog / case studies / docs site — those are out of scope for v1.
- A customer portal — donors sign up via Formspree, that's it.

---

## Locked design decisions — DO NOT re-litigate

These were decided in brainstorming (see spec). Trust them; do not re-open in execution:

| | |
|--|--|
| **Audience** | Karma — operators (clinic admins, NGO IT) + donors (foundations), equal weight, separate funnels on the homepage. |
| **Tone** | Clinical authority — sober, data-led, professionally warm. Reference: healthytogether.co. No emoji. |
| **Brand** | Trust Blue palette (`#0c2461` / `#1e40af` / `#3b82f6` / `#dbeafe`), Inter variable for everything, wordmark logo "MediSina" for v1. |
| **Hero pillars (in order)** | 01 AI-Powered · 02 Mobile-first · 03 Standards-compliant · 04 Secure & auditable. |
| **Mission placement** | Top ribbon (always visible) + dedicated story section (warm-accent block below the pillars). |
| **CTAs** | "Schedule a demo" (primary, hospital lane) + "For donors" (secondary, donor lane). |
| **Tech stack** | Astro 6.3 static · Tailwind v4 CSS-first · `astro-icon` (Lucide) · Content Layer + MDX · Astro built-in i18n · Formspree forms · GA4 + custom consent banner · GitHub Actions → Pages. |
| **i18n v1 reality** | Only EN content is written. TR/FR/AR route files exist and render the `<TranslationBanner />` + fall back to EN body. No fake translations. Arabic is RTL. |
| **Domain** | `medisina-health.github.io` for v1. Custom domain is a Phase-2 decision (CNAME slot reserved in `public/`). |
| **Form backend** | Formspree (no backend). Hidden `_subject` field routed by Interest dropdown. |
| **Analytics** | GA4 (`gtag.js`), gated by a custom cookie banner (no GA before consent). |
| **Newsletter** | None in v1. |
| **Out of v1 scope** | Blog, press, case studies, team detail pages, careers, custom domain, PR preview deploys, real translations, donor portal. |

---

## Authoritative reading order

1. `docs/superpowers/specs/2026-05-13-medisina-marketing-site-design.md` (15-min read)
2. `docs/superpowers/plans/2026-05-13-medisina-marketing-site.md` (30-min read)
3. `CLAUDE.md` (created in Task 6 — refer back as you progress)
4. Reference design — open https://www.healthytogether.co/ in a browser so you can visually compare as you build.

If you only have time for one before starting Task 1: read **plan §Phase A** (Tasks 1-6) end-to-end. Tasks 1-6 are pure scaffolding; you can start typing immediately.

---

## Execution model — Subagent-Driven Development

The user explicitly chose subagent-driven execution. **Use the `superpowers:subagent-driven-development` skill.** Pattern per task:

1. **Read the task block** in the plan (`docs/superpowers/plans/2026-05-13-medisina-marketing-site.md`).
2. **Dispatch a fresh subagent** with the task as the prompt + the locked design decisions + the relevant code context. Use the general-purpose agent unless a specialized one fits (feature-dev for component design, code-reviewer for review stages).
3. **Two-stage review after subagent returns:**
   - **Spec review** — does the diff match the spec's intent for this task? Color, copy, structure, accessibility hooks?
   - **Code review** — does the code itself meet quality standards (types, no console.log, no hardcoded copy, logical Tailwind props for RTL)?
4. **If review surfaces issues**: dispatch a fix-pass subagent with the specific issues quoted. Do not hand-fix unless the change is one-line.
5. **Commit per task** (the plan steps each task to its own commit message). Frequent commits = easy rollback if a later task uncovers a regression.
6. **Update the plan's checkbox** for that task before moving on. The plan uses `- [ ]` syntax — flip to `- [x]` per completed step.

**Do NOT** batch multiple tasks into one subagent dispatch. The reviews and commits depend on per-task granularity.

---

## Quick-start commands (after Phase A is done)

```bash
nvm use            # node 22 per .nvmrc
npm install
npm run dev        # http://localhost:4321

# Quality gates — ALL must pass before declaring a task complete:
npm run check      # astro check + tsc
npm run lint       # eslint flat config
npm test           # vitest (i18n util tests)
npm run build      # production build
npm run test:e2e   # playwright smoke (after Phase E starts)
```

If a gate fails, fix root cause — do NOT bypass (no `--no-verify`, no `eslint-disable`, no `@ts-ignore`).

---

## GitHub repository setup

The remote is already configured:

```
origin  https://github.com/medisina/medisina-health.github.io.git
```

**Before your first push, the user must set these repo Variables** (Settings → Secrets and variables → Actions → Variables tab, not Secrets):

| Variable | Value | When |
|----------|-------|------|
| `PUBLIC_GA_MEASUREMENT_ID` | The GA4 ID from the user's Google Analytics property (`G-XXXXXXXXXX`) | Before Task 35 (deploy) |
| `PUBLIC_FORMSPREE_ENDPOINT` | The Formspree form endpoint URL from the user's Formspree dashboard (`https://formspree.io/f/xxxxxxxx`) | Before Task 35 (deploy) |

Also: under Settings → Pages, source = **GitHub Actions** (not "Deploy from branch"). The user said the repo is open and public, but they may not have flipped this toggle. Confirm before Task 35.

**Authentication for `git push`:** the remote is HTTPS. If `git push -u origin main` prompts for credentials, the user needs `gh auth login` (or a PAT). Ask them in the terminal — do not store credentials yourself.

---

## Open questions — bring to the user, DO NOT decide alone

The spec §17 captured 6 business questions that intentionally did NOT get answered during brainstorming. Until they're answered, the plan ships placeholder text. **Do not invent answers.** When you hit one of these in implementation, surface it to the user and continue with the placeholder if they're not ready to decide.

1. **Legal entity name + jurisdiction.** Placeholder: "MediSina, a nonprofit in formation". Affects: `/privacy`, `/about` governance section, footer.
2. **Contact email address(es).** Placeholder: `contact@medisina.health`, `privacy@medisina.health`. Affects: form fallback messaging, privacy policy.
3. **First-partner hospital naming consent.** Until obtained: "First pilot joining Q3 2026" copy on the homepage logo strip.
4. **OG image illustrator.** Default in plan: unDraw-derived templates. Switch to a designer-DIY in Figma if the user prefers.
5. **Cookie banner wording — legal review.** v1 ships plain-language self-drafted; flag to user before going live if a lawyer should review.

_Resolved 2026-05-13: HBYS is closed-source proprietary software. Open-source / Apache-2.0 references were removed from the site (commit `a768b0b`). No public license decision needed._

---

## Sequencing notes (read once, then follow the plan)

- **Phase A (Tasks 1-6)** is pure scaffolding. Should take 30-60 min. End state: `npm run build` produces an empty dist, CI workflow exists, README/CLAUDE.md committed.
- **Phase B (Tasks 7-13)** builds the shell + i18n utilities **with real TDD on the i18n module** (Task 7 writes failing tests, Task 8 makes them pass). Do not skip Task 7's failing-test step; that's the discipline.
- **Phase C (Tasks 14-21)** is component-building. Each task = 1-3 components. Pure component, no routing concerns yet.
- **Phase D (Tasks 22-31)** is page assembly. Each page task creates 1 body component + 4 thin locale-route files. The pattern is shown completely in Task 22 (homepage); subsequent page tasks reference that pattern. Tasks 26, 27, 29 say "mirror Task 22's scaffolding" — that means literally copy the import block + Layout slot pattern, then swap content.
- **Phase E (Tasks 32-35)** is E2E + Lighthouse + the first production deploy. Task 35 is "operational" — you'll be coordinating with the user (env vars, Pages settings, smoke-test the live URL).

**Do not skip Task 31 (image assets).** Without curated Unsplash photos and unDraw illustrations, the site looks like a half-finished template. The plan tells you exactly which 6 photos and 4 illustrations to source.

---

## Critical gotchas (from the plan + spec)

- **`<Image>` from Astro requires importing** `import { Image } from 'astro:assets'` AND the image being imported as an ImageMetadata (`import hero from '~/public/img/...'`). Cannot use string paths for the optimization pipeline.
- **Tailwind v4 logical properties** — always `ps-*`/`pe-*`/`ms-*`/`me-*` instead of `pl-*`/`pr-*`/`ml-*`/`mr-*`. This is what makes RTL work for Arabic. Lint rule does NOT catch this; reviewer must.
- **Cookie banner gates GA4 strictly.** The `<Analytics />` component checks `localStorage.getItem('medisina.consent') === 'accept'` before loading gtag. Listens for `medisina:consent-accepted` event after the user accepts. Test in a clean profile that no GA request fires on first load.
- **i18n fallback semantics.** With `prefixDefaultLocale: false`, `/about` serves EN. `/tr/about` serves a TR route file that loads the same body component with `locale="tr"`. The `<TranslationBanner />` only shows when `withFallback(locale)` is true (defined in `src/i18n/utils.ts`). EN never shows the banner.
- **Astro `getEntry('pages', 'ai.en')`** — the entry ID is `<slug>.<locale>` because we filename them `ai.en.mdx`, etc. When TR content arrives in Phase 2, it'll be `ai.tr.mdx` and the body component will need a `getEntry('pages', \`ai.${locale}\`)` lookup with fallback to `.en`.
- **Lighthouse a11y threshold = 95.** Color contrast on the warm story-section (warning-50 bg + warning-700 text) is the riskiest combo. Verify with Lighthouse before Task 33.

---

## First action

1. Confirm you're in `/home/cevheri/projects/hbys/medisina-health.github.io` (run `pwd`).
2. Confirm `git log --oneline` shows 2-3 existing commits (spec, plan, and possibly this HANDOFF).
3. Confirm `npm` and `node 22+` are available (`node --version`, `npm --version`).
4. Open the plan and read **Task 1** carefully.
5. Dispatch a subagent for Task 1 with the prompt template below.

### Subagent dispatch template (use for every task)

```
You are implementing one task from a 35-task plan for a static Astro marketing site.

Spec: docs/superpowers/specs/2026-05-13-medisina-marketing-site-design.md
Plan: docs/superpowers/plans/2026-05-13-medisina-marketing-site.md

Locked design decisions (do not re-litigate):
- Audience: Karma (operators + donors)
- Tone: clinical authority (healthytogether.co reference)
- Brand: Trust Blue (#0c2461 / #1e40af) + Inter
- Hero pillars in order: 01 AI · 02 Mobile · 03 Standards · 04 Security
- Tech: Astro 6.3 + Tailwind v4 + Content Layer + Astro built-in i18n
- i18n v1: EN only; TR/FR/AR are route shells with EN fallback + TranslationBanner

Your task: <PASTE TASK N HEADING + ALL STEPS FROM THE PLAN HERE>

Constraints:
- Implement every step in order, including the failing-test step for TDD tasks
- Use exact file paths from the task
- Use Tailwind logical properties (ps/pe/ms/me) for RTL compatibility
- Do NOT hardcode user-facing strings; use t('key', locale) from ~/i18n/utils
- Do NOT bypass quality gates with --no-verify, eslint-disable, or @ts-ignore
- Commit at the end of the task with the message specified in the plan's final step
- If something in the plan diverges from actual code reality, fix the plan in the same commit

Quality gates that MUST pass before commit:
- npm run check  (astro check + tsc)
- npm run lint
- npm test       (if i18n utility tests apply)
- npm run build  (must succeed)

Return: a summary of what was created/changed + confirmation all gates pass.
```

After the subagent returns, **review the diff against the spec + plan** before accepting the work. If issues, dispatch a fix-pass.

---

## Memory note

The user's auto-memory (`~/.claude/projects/.../medisina-app/memory/`) is keyed to the **medisina-app** repo, not this one. **In this fresh session in `medisina-health.github.io`, your memory dir will be different and start empty.** Don't expect prior context to load. This HANDOFF.md is the bridge.

If you want to save useful patterns as you work (e.g., "Astro Image with content collections needs X"), write them to your local memory in this session — the auto-memory system will create the dir on first save.

---

## Done? What "done" means

When Task 35 is green:
- All 8 pages render at https://medisina-health.github.io/
- Lighthouse ≥92 perf / 95 a11y / 95 best-practices / 95 SEO on a clean install
- Form delivers a real submission to Formspree
- Cookie banner gates GA4
- Arabic RTL renders without overflow
- CI + Lighthouse + Playwright pipelines green on `main`
- The user can demo the site to the first hospital partner

When you reach that state, **post a short victory summary to the user**, then stop. Phase-2 (case studies, blog, custom domain, real TR/FR/AR translations) is a separate engagement.

Good luck. Build something honest.
