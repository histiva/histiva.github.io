# Histiva Marketing Site — Design Spec

**Status:** Draft for approval
**Date:** 2026-05-13
**Project root:** `/home/cevheri/projects/hbys/histiva.github.io/`
**Live URL (target):** `https://histiva.github.io/`
**Related product:** Histiva ClinicFlow HBYS (`/home/cevheri/projects/hbys/histiva-app/`)
**Reference design:** [healthytogether.co](https://www.healthytogether.co/)

---

## 1. Purpose

Build a static marketing website for **Histiva**, the nonprofit hospital information system (HBYS) deployed in low-resource clinics in Africa and similar regions. The site exists to:

1. **Bring in operators** — clinic administrators, NGOs (MSF, faith-based mission hospitals, Red Crescent partners) who want to evaluate, schedule a demo, and ultimately deploy Histiva.
2. **Bring in funders** — foundations, individual donors, philanthropic programs who want to sponsor a deployment for a specific clinic or region.

The product itself (HBYS) ships in parallel with site launch; the first hospital pilot will be live within weeks of site go-live. The site speaks in **present tense** — "Histiva runs hospital operations" — not "we're building". No mock case studies; the first real partner is referenced (anonymized or named, per partner consent).

---

## 2. Audience Strategy — Karma (Dual-Funnel)

Two co-equal primary audiences. The homepage holds both in tension via a **mission ribbon at the top**, **shared hero**, and **separate path CTA section** ("For hospitals & NGOs" / "For donors & funders") near the bottom.

| Audience | Job-to-be-done | Page they live on | Conversion |
|----------|----------------|-------------------|------------|
| Clinic admin / NGO IT | "Will this fit our clinic? How hard to install?" | `/for-hospitals` | Demo request via Contact form |
| Donor / foundation | "What does my money do? Who runs this?" | `/for-donors` | Sponsorship interest via Contact form (different track) |
| Secondary: clinician | "Is this safe? Is the workflow sane?" | `/product`, `/ai` | Reads, hopefully shares with admin |
| Secondary: tech evaluator | "What stack? Open source? Extensible?" | `/ai`, `/product` | GitHub link, contact form |

The Contact form is **one form**, with a hidden "interest type" select (default to "use Histiva at our clinic", or "fund a deployment", or "other") so we route incoming Formspree submissions to the right inbox internally.

---

## 3. Tone & Brand

**Tone:** Clinical authority — sober, data-led, professionally warm. Reference comp: [healthytogether.co](https://www.healthytogether.co/). Government-credible without being cold. No emoji, no marketing fluff. Sentences are direct. Numbers when we have them, principles when we don't.

**Voice rules:**

- Lead with what the system does for the clinic, not what the clinic should do.
- "Built for clinics where infrastructure is unreliable" not "for poor hospitals".
- Use named geographies (Chad, Somalia, Türkiye) only when we have a real partner there. Generic until then: "low-resource settings", "underserved regions".
- AI is **a feature, not the headline.** Mentioned in pillar #1, deep-dived in `/ai`; never the lead promise.

**Brand identity — A · Trust Blue (locked):**

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary-900` | `#0c2461` | Headings, footer bg |
| `--color-primary-700` | `#1e40af` | Primary buttons, links |
| `--color-primary-500` | `#3b82f6` | Hover, accents |
| `--color-primary-100` | `#dbeafe` | Surface tint, ribbon dark-on-light |
| `--color-surface-50` | `#f8fafc` | Page bg |
| `--color-ink-900` | `#0f172a` | Body text |
| `--color-ink-600` | `#475569` | Secondary text |
| `--color-success-700` | `#166534` | "For donors" lane |
| `--color-success-50` | `#f0fdf4` | Donor lane bg |
| `--color-warning-700` | `#92400e` | Story section accent (warm contrast) |

**Typography:**

- **Inter** (variable) for both headings and body. Self-hosted via `@fontsource-variable/inter`. No external font CDN (privacy + perf).
- Headings: weight 700, letter-spacing -0.01em.
- Body: weight 400, line-height 1.55.
- Monospace fallback for code samples: system `ui-monospace` stack.

**Logo:** Wordmark for v1 — "Histiva" set in Inter 700, primary-900, optical-sized for nav. A small clinical glyph (lowercase "h" in a rounded square, or a stethoscope-derived mark) may be added later by a designer; not blocking v1.

---

## 4. Information Architecture (8 pages)

```
/                           Home
/product                    Product (module tour)
/ai                         AI & Local LLM (deep dive)
/for-hospitals              For Hospitals & NGOs (deployment story)
/for-donors                 For Donors & Funders (impact, sponsorship)
/about                      About / Mission / Team
/contact                    Contact (single form, dual-track)
/privacy                    Privacy Policy
```

**Localized routes:** `/tr/...`, `/fr/...`, `/ar/...` — same shells; v1 ships EN content only, others fall back to EN with a "Translation coming soon" banner.

**Footer-only links:** Sitemap (`/sitemap-index.xml`), RSS (none v1), GitHub repo, License (Apache-2.0 or MIT — TBD with legal counsel; v1 footer says "Open source · Apache-2.0").

**Excluded from v1** (Phase-2 candidates): Blog, Press, Case studies, Resources/Docs, Team detail pages, Roadmap, Careers.

---

## 5. Page-by-Page Content Outline

### 5.1 `/` — Home

| Section | Content notes |
|---------|---------------|
| Top ribbon | Subtle dark bar: "A nonprofit hospital information system · built for low-resource clinics" + tiny dot indicator. Dismissible? No (always visible — it's the brand line). |
| Nav | Logo · Product · AI · For Hospitals · For Donors · About · Contact · Language switcher · GitHub icon link |
| Hero | H1: "Hospital records, everywhere they're needed." Sub: "A modern, AI-powered hospital information system for nonprofit clinics in low-resource settings — modular, mobile-ready, and built to international healthcare standards." CTAs: [Schedule a demo] (primary) · [For donors] (secondary). Visual: clinical photo (Unsplash, curated — clinician with tablet, real-feeling setting) + soft illustration overlay. |
| Logo strip | "Early partner" + first hospital's anonymized logo (or "First pilot — joining 2026-Q3"). Min 1 logo, max 4. |
| Pillars | 4 cards (locked order): 01 AI-Powered · 02 Mobile-first · 03 Standards-compliant · 04 Secure & auditable. Each: icon + 30-word description + "Learn more →" link. |
| Story section | "Why we built this" — warm accent (light cream bg, primary-900 heading). 2 paragraphs. Photo. Closes with line: "Nonprofit. Built by clinicians and engineers. Funded by people who care." |
| Module tour | Grid of 10 cards (Patient · Admission · Outpatient · Emergency · Inpatient · Lab · Radiology · Pharmacy · Inventory · Billing). Each card: 24px icon + name + one-line. Whole grid links to `/product`. |
| Two-path CTA | Side-by-side: blue card "For hospitals & NGOs → Schedule a demo"; green card "For donors & funders → Sponsor a clinic". Each links to its respective page. |
| Footer | 4-column: About / Resources / Legal / Connect. Language switcher. Copyright + "Built with Astro · Open source on GitHub". |

### 5.2 `/product` — Product (module tour)

Single page, anchored sections (one per module). TOC at top. For each module (10 modules from `histiva-app` per `rfp.md` §3): short description, 2-3 bullet capabilities, screenshot or illustration, link to `/contact` for "see it live".

Module list (English names; source: `CLAUDE.md` repo layout + `rfp.md` §3.2-3.4):
- Patient Management
- Admission & Visits
- Outpatient
- Emergency
- Inpatient (beds, observations, discharge)
- Laboratory
- Radiology
- Pharmacy & Prescriptions
- Inventory & Stock
- Billing & Cashier (Phase-6, marked "in development")

Each module gets one screenshot (or wireframe-style illustration until real UI captures available). No personal data in screenshots (synthetic data or blurred names).

### 5.3 `/ai` — AI & Local LLM (deep dive)

Sections:
- **Hero:** "AI that works where the internet doesn't." Sub: explains cloud + local LLM split.
- **The two modes:** Cloud (OpenAI/Anthropic API) for connected clinics, with cost/privacy trade-off table. Local (Ollama / llama.cpp on hospital server) for offline / privacy-strict environments. Diagram showing both paths.
- **Capabilities:** Triage suggestions, clinical-note summarization, decision support hints, multilingual transcription. Each: 50-word description + safety note ("suggestions, not diagnoses — clinician always decides").
- **Agentic features:** Automated workflows (e.g., "if lab result critical, draft notification"), with human approval required.
- **Responsibility section:** What AI does NOT do (no autonomous prescriptions, no PII leaving site unless cloud explicitly chosen, audit trail on every AI call).
- **CTA:** "Want to evaluate the AI features in your clinic? Schedule a demo."

### 5.4 `/for-hospitals` — Deployment story

Sections:
- Hero: "Bring Histiva to your clinic in days, not months."
- "Who this is for" — list of hospital profiles (small private hospital, NGO-operated clinic, faith-based mission, rural district hospital).
- "How deployment works" — 4-step timeline: (1) Discovery call, (2) Site assessment + sizing, (3) Install + data setup (1-2 days on-site or remote), (4) Training + go-live (1 week).
- "What you need" — hardware minimums (1 server-grade laptop or small server, router, ≥2 client devices). "What we provide" — installation, training, ongoing support model.
- Cost section — transparent: "Histiva software is free to nonprofit clinics. Deployment cost (installation, training, year-one support) is typically funded by a sponsor — we'll help you find one if needed."
- FAQ — 5-6 items.
- CTA: "Schedule a demo" → contact form pre-filled with interest=hospital.

### 5.5 `/for-donors` — Sponsorship & impact

Sections:
- Hero: "Fund a hospital. Not a feature."
- "What your support funds" — concrete cost breakdown: installation per clinic ($X), training program ($Y), year-one support ($Z), software development time ($W). Numbers placeholder until financial model finalized.
- "Where it goes" — pilot regions map (low-fi SVG of focus countries — placeholder until partners confirmed).
- "Transparency" — link to financial reporting (when nonprofit legal entity registers and publishes first annual report — likely Phase-2).
- "Sponsorship tiers" (no hard numbers v1; soft tiers like Individual Donor / Partner Foundation / Implementation Sponsor).
- CTA: "Start a conversation" → contact form pre-filled with interest=donor.

### 5.6 `/about` — Mission, team, history

- Mission statement (3-4 paragraphs). The story of why Histiva exists. Written in plain language, no jargon.
- Principles (5-6 short statements: open-source-first, clinician-led, privacy-by-default, low-resource-tested, nonprofit-governed, AI-with-guardrails).
- Team — initially small (founders / core contributors). Photos + 1-line bios. Open to growth (v1 ships with whoever is on the team today).
- Governance — nonprofit structure (when registered). Until then, generic: "Operated by the Histiva working group, in the process of forming a nonprofit legal entity." Specific framework (e.g., Türkiye dernek, US 501(c)(3), UK CIC) decided with counsel before launch — open question §17.
- Open source — Apache-2.0 (default), link to GitHub org.

### 5.7 `/contact` — Single form, dual-track

Form fields (Formspree-hosted):
- Name (required)
- Email (required)
- Organization
- Country
- Interest (**required dropdown**): "Bring Histiva to our clinic" / "Sponsor a deployment" / "Press inquiry" / "Open source / contribute" / "Other"
- Message (required, min 30 chars)
- GDPR consent checkbox (required) — "I consent to Histiva storing my submission to respond. See Privacy."

On submit: Formspree sends email to a routed inbox (we configure routing rules by `_subject` field). Success page: thank-you message + "we respond within 3 business days" + link to GitHub.

No file upload v1 (Formspree free tier limits).

### 5.8 `/privacy`

- What data we collect on the site (analytics, cookies, contact form submissions).
- Cookie banner explanation — GA4, with opt-out.
- Data retention: contact submissions kept 24 months, then purged.
- Children's data — not collected. Site not aimed at <18.
- Contact for privacy questions: `privacy@histiva.org` (mailto).
- Linked legal entity once formed.

---

## 6. Components / UI Patterns

Astro components in `src/components/` — kebab-case files, PascalCase exports. Composition over inheritance.

| Component | Purpose |
|-----------|---------|
| `<TopRibbon />` | Mission ribbon, always visible at top of every page |
| `<SiteNav />` | Sticky header, transparent → solid on scroll |
| `<Hero />` | Configurable hero with H1/sub/CTAs/image slot |
| `<PillarCard />` | One of the 4 hero-area pillars |
| `<StorySection />` | Warm-toned narrative block with photo |
| `<ModuleCard />` | Module-tour grid item |
| `<TwoPathCTA />` | Side-by-side hospital/donor cards |
| `<SiteFooter />` | Footer with link columns + language switcher |
| `<LanguageSwitcher />` | Dropdown of EN/TR/FR/AR; non-EN shows "(translation coming)" |
| `<TranslationBanner />` | Appears on non-EN pages until that locale has content |
| `<ContactForm />` | Formspree-wired form with interest routing |
| `<CookieBanner />` | GA4 consent banner (accept / decline), persists choice in localStorage |
| `<FAQItem />` | Disclosure component (uses native `<details>`) |
| `<CountryMap />` | Low-fi SVG world map highlighting focus regions |
| `<ImpactStat />` | Big-number stat with caption (used sparingly until real data) |

Shared `<Layout.astro>` wraps everything: html `lang` + `dir` (RTL for `ar`), `<head>` meta, ribbon, nav, slot, footer, cookie banner.

---

## 7. i18n Strategy

**Astro built-in i18n routing.** `astro.config.mjs` configures:

```ts
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'tr', 'fr', 'ar'],
  routing: { prefixDefaultLocale: false },  // EN at /, others at /tr/, /fr/, /ar/
  fallback: { tr: 'en', fr: 'en', ar: 'en' },
}
```

**Content storage:** UI strings live in `src/i18n/{locale}.json`. Page content (long-form copy on `/about`, `/ai`, etc.) lives in MDX files keyed by locale: `src/content/pages/{slug}.{locale}.mdx`.

**v1 reality:** Only `en.json` and `*.en.mdx` populated. `tr.json`, `fr.json`, `ar.json` exist with empty values; MDX `*.tr.mdx` etc. don't exist yet — fallback resolver returns EN content.

**`<TranslationBanner />`** shows on any non-EN page where the requested MDX doesn't exist: "Translation in progress. Showing English content."

**Arabic RTL:** Layout sets `dir="rtl"` on `<html>` when locale is `ar`. Tailwind v4's logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`) used throughout — no hardcoded `pl-*` / `pr-*`. Validated with `ar` smoke test.

**Language switcher** is a dropdown in the nav and footer. Non-EN labels show the language name in its own script (Türkçe / Français / العربية).

---

## 8. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Astro 6.3 | Static site, MPA, fast, content-first |
| Output | Static (`output: 'static'`) | GitHub Pages requires static |
| Styles | Tailwind CSS v4 (CSS-first config) | Matches `histiva-app` stack, modern tokens |
| Icons | `astro-icon` + Lucide pack | Consistent stroke icons |
| Images | Astro `<Image />` + Sharp | Auto-optimize Unsplash + local |
| Fonts | `@fontsource-variable/inter` | Self-hosted (privacy) |
| Content | Content Layer + MDX | Type-safe collections for modules, FAQ |
| i18n | Astro built-in | Native, no extra dep |
| Transitions | Astro View Transitions (`<ViewTransitions />`) | Smooth nav, default Astro 6.x |
| Form | Formspree (form `action` POST) | No backend, free tier |
| Analytics | Google Analytics 4 (gtag.js) | User choice; gated by consent |
| Cookie banner | Custom `<CookieBanner />` (no 3rd party) | Lightweight, in our control |
| Lint | ESLint + Astro plugin + Prettier | |
| Type-check | `astro check` (TS strict) | |
| CI | GitHub Actions | Build + deploy to gh-pages |

**No npm dependencies for:** state management, animation libraries (View Transitions + CSS only), heavy UI kit, CMS. Site is content-first; complexity should live in content, not code.

---

## 9. Forms (Formspree) Details

**Setup:**
1. Create Formspree account (free tier: 50 submissions/month).
2. Create one form: "Histiva Contact". Note the endpoint: `https://formspree.io/f/XXXXX`.
3. In Formspree dashboard, enable email forwarding + spam filter (Akismet built-in).
4. Configure inbox routing rules by `_subject` field (set client-side from "Interest" dropdown).

**Client form:** Plain HTML `<form action="https://formspree.io/f/XXXXX" method="POST">`. Hidden `_subject` field auto-fills from interest dropdown. Hidden `_redirect` field points to `/thank-you` page. Honeypot field for bots.

**Privacy:** Form submissions are stored by Formspree in the US; this is disclosed in `/privacy`.

**Failure mode:** If Formspree is down, form shows inline error after 10s timeout: "Submission failed — please email contact@histiva.org directly". This is the documented escape hatch.

---

## 10. Analytics (GA4) + Consent

**Tag:** Standard GA4 gtag.js, loaded conditionally after user accepts consent. GA4 measurement ID stored as build-time env var `PUBLIC_GA_MEASUREMENT_ID`; if absent, GA is not loaded (e.g., on PR previews).

**Consent banner (`<CookieBanner />`):** Slides in from bottom on first visit. Two buttons: "Accept all" / "Decline non-essential". Choice persists in `localStorage` (key: `histiva.consent`). Decline disables GA4 entirely.

**No third-party consent platforms** (Cookiebot, OneTrust, etc.) — overkill for current scope.

**Event tracking minimum:**
- `page_view` (default)
- `cta_click` with `cta_label` param (Schedule a demo, For donors, etc.)
- `form_submit_success` and `form_submit_error`
- `language_switch` with `from` and `to`

---

## 11. Deployment — GitHub Pages + Actions

**Repo:** `histiva/histiva.github.io` (organization GitHub Pages).

**Branching:** `main` is source of truth. Deploy on push to `main`.

**Workflow:** `.github/workflows/deploy.yml`
1. Checkout
2. Setup Node 22 (Astro 6.3 supports 20.3+)
3. `npm ci`
4. `npm run build`
5. Upload `dist/` as Pages artifact (using `actions/upload-pages-artifact@v3`)
6. Deploy via `actions/deploy-pages@v4`

**Branch protection:** `main` requires passing build + at least one review before merge (once contributors join; v1 single-author OK).

**Preview deploys:** Not in v1. (Future: surge.sh or Netlify previews per PR.)

**Custom domain:** Out of v1. When ready, add `public/CNAME` containing the apex domain; Astro copies it into `dist/` on build, and GitHub Pages reads it on deploy.

---

## 12. SEO + Meta

- Per-page `<title>` and `<meta name="description">` defined in front-matter.
- OpenGraph + Twitter Card images: 1200x630 PNGs in `public/og/`, one per page.
- Canonical URLs (per locale).
- `sitemap-index.xml` auto-generated via `@astrojs/sitemap`.
- `robots.txt` allows all crawlers, lists sitemap URL.
- Structured data (`Organization` + `NGO` schema.org) in homepage.
- `hreflang` tags on every page for locale alternates (even if non-EN serves EN fallback).

---

## 13. Accessibility (WCAG 2.1 AA target)

- Semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`).
- Skip-to-content link.
- All interactive elements keyboard-reachable, focus rings visible.
- Color contrast ratios meet AA (verified via Lighthouse in CI).
- Form fields have associated `<label>`s; error messages programmatically linked via `aria-describedby`.
- Images have meaningful `alt` text (decorative images use `alt=""`).
- Language switcher updates `<html lang>` correctly.
- RTL flow tested with Arabic locale, even if content placeholder.

---

## 14. Visual Asset Sources

| Asset type | Source | License |
|------------|--------|---------|
| Stock photos | Unsplash | Unsplash License (free, attribution appreciated) |
| Illustrations | unDraw.co | MIT |
| Icons | Lucide (via astro-icon) | ISC |
| Logos (partner) | Provided by partners with permission, fallback "joining soon" | — |

Curated photo set (committed to repo `public/img/photos/`): 8-10 photos covering clinical settings, mobile use, software-on-screen scenes. Each photo's URL + Unsplash photographer credit stored in `src/content/photo-credits.json`.

Illustrations exported as SVG, lightly recolored to match Trust Blue palette (primary-700 / primary-100 swaps).

---

## 15. Project Structure

```
histiva.github.io/
├── astro.config.mjs              # i18n + integrations + sitemap
├── package.json
├── tsconfig.json
├── tailwind.config.mjs           # Tailwind v4 token bridge if needed
├── public/
│   ├── og/                       # 8 OG images (1 per page)
│   ├── img/photos/               # Curated Unsplash photos
│   ├── img/illustrations/        # unDraw SVGs, recolored
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── product.astro
│   │   ├── ai.astro
│   │   ├── for-hospitals.astro
│   │   ├── for-donors.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── thank-you.astro
│   │   ├── privacy.astro
│   │   ├── 404.astro
│   │   └── [...path].astro       # Optional fallback for locale routes
│   ├── layouts/
│   │   └── Layout.astro
│   ├── components/               # See §6 component list
│   ├── content/
│   │   ├── config.ts             # Content collections schema
│   │   ├── modules/              # Per-module MDX
│   │   ├── faqs/
│   │   └── pages/                # Long-form page MDX (about, ai)
│   ├── i18n/
│   │   ├── en.json
│   │   ├── tr.json
│   │   ├── fr.json
│   │   ├── ar.json
│   │   └── utils.ts              # t(), getLocale(), getLocalizedPath()
│   ├── styles/
│   │   └── global.css            # Tailwind v4 entry + tokens
│   └── env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-13-histiva-marketing-site-design.md   # THIS FILE
├── .gitignore
├── .nvmrc
├── README.md
└── CLAUDE.md                     # Project context (created after first commit)
```

---

## 16. Out of Scope (v1 — deferred to Phase-2)

- Blog / Press / News (waiting for real content)
- Case studies (waiting for 2nd+ deployment)
- Open-source docs site (`docs.histiva.org` style)
- Team detail pages
- Roadmap page
- Careers / Volunteer page
- Real-time stats (deployment count, lives served) — pulled from a private dashboard, not v1
- Custom domain
- PR preview deploys
- Real translations for TR/FR/AR (shells only v1)
- Newsletter signup
- Search
- Donor portal (logged-in area)
- Real Org schema with audited financials (waiting for legal entity)

---

## 17. Risks & Open Questions

| Risk | Mitigation |
|------|-----------|
| Formspree 50/month limit hit if traffic spikes | Monitor; upgrade to $10/mo at first sign |
| GA4 consent banner reduces analytics signal | Accept the trade-off; mission-aligned |
| Stock photos look generic | Curate carefully; lean on illustrations where photo would be cliché |
| AI hype overshadows mission | `/ai` page is opt-in deep dive; pillar #1 is restrained |
| No partner logo at launch | Use "First pilot joining Q3 2026" copy until consent obtained |
| i18n shell mis-design | Build full Arabic RTL smoke page in week 1 to validate |
| Wordmark looks too plain | Acceptable v1; commission proper mark in Phase-2 |

**Open questions to resolve before implementation:**

1. Legal entity name + jurisdiction for Privacy / About copy? (placeholder: "Histiva, a nonprofit in formation")
2. Contact email address(es) — `contact@`, `privacy@`, `press@`?
3. Apache-2.0 or MIT for the HBYS code license footer reference? Default Apache-2.0.
4. First partner hospital — anonymized or named in launch copy? Need partner consent.
5. OG image illustrator — DIY in Figma or use unDraw-derived templates? Default: unDraw-derived for v1.
6. Cookie banner exact wording (legally-reviewable) — for v1, plain-language self-drafted; consider lawyer review pre-launch.

---

## 18. Acceptance Criteria for Implementation

When the site is "done v1":

- All 8 pages render with Lighthouse score ≥95 (Performance, Accessibility, Best Practices, SEO) on a clean install.
- Form submits end-to-end through Formspree to a real inbox (verified twice).
- Cookie banner accept/decline state persists and gates GA4 correctly.
- Language switcher works: EN renders full content; TR/FR/AR render shell + translation banner.
- Arabic RTL renders without layout breaks on hero + module grid.
- GitHub Actions deploys on push to `main`, site live at `https://histiva.github.io/` within 90s of push.
- README documents local dev (`npm install`, `npm run dev`) and content-editing workflow.
- CLAUDE.md (root) gives future Claude sessions the project context.

---

**Next step:** invoke `superpowers:writing-plans` to produce the implementation plan (file structure, task order, dependencies, ~20-30 discrete tasks for subagent execution).
