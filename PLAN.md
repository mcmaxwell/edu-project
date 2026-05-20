<!-- cSpell:words Inkprint Verita Authentik Originly Proofroom Moodle Schoology Turnitin FERPA explainability burstiness grotesk Newsreader Wordmark wordmark keystroke keystrokes provenance C2PA Copyleaks GPTZero neurodivergent -->

# Inkprint — Product Plan

## 1. Vision

A web platform that gives teachers and institutions confidence in student work by capturing **how the work was made** — keystrokes, revisions, pauses, paste events — and comparing it against each student's own writing baseline. Inkprint is not an output classifier; it is a writing-process platform that treats AI as a collaborator to be evaluated, not an enemy to be detected.

**One-line pitch:** *"See the difference between effort and autocomplete."*

**Why this framing wins:** output-based AI detection is a losing arms race — every new frontier model breaks it, and the false-positive lawsuits are already piling up against incumbents. Process-based evidence is structurally defensible: a better LLM doesn't help a student fake a 90-minute writing session.

---

## 2. Target users

**Primary:** K-12 teachers, university professors, teaching assistants.
**Secondary:** Academic integrity offices, school administrators, EdTech procurement leads at institutions.
**Tertiary (later):** Online course platforms, certification bodies, hiring/admissions screeners.

### Key jobs-to-be-done
- "I have 80 essays to grade tonight — quickly flag the ones that need a closer look."
- "Give me evidence I can show a student during an academic-integrity conversation."
- "Integrate with our LMS (Canvas, Moodle, Google Classroom) so I don't change my workflow."
- "Protect student privacy and comply with FERPA / GDPR."

---

## 3. Core features (MVP)

Inkprint is **not another output-classifier**. Competing on "more accurate detection" is a losing arms race against frontier models. Inkprint competes on a different axis: it analyzes **how the work was made**, not what it looks like — and it reframes the problem from *catching cheaters* to *evaluating AI collaboration*.

1. **Writing-process capture (the core wedge)** — a lightweight editor and browser/Word/Docs extension that records keystrokes, pauses, revisions, and paste events while a student writes. The output is the literal "ink-print" of authorship. Pasted AI text leaves an unmistakably different process trace than written text. This sidesteps the detection arms race entirely — a better LLM doesn't help a student fake a 90-minute writing session.
2. **Per-student stylistic baseline** — every submission is compared against *that student's own verified prior work*, not a global AI-vs-human classifier. This is the antidote to the false-positive problem that has driven lawsuits against existing detectors (non-native English speakers, neurodivergent students). The baseline strengthens with every verified submission.
3. **AI-collaboration declaration** — students declare what they used AI for (brainstorming, outlining, grammar, drafting). Inkprint verifies the declaration matches the captured process. Teachers grade the *human contribution*, not the absence of AI. This is a new product category no incumbent owns.
4. **Provenance certificate** — every submission gets a cryptographically signed record (started at X, edited for Y minutes, N paste events, exported here). Think C2PA / content credentials for student writing. Auditable, exportable to LMS.
5. **Evidence sheet, not a score** — single-paragraph "AI text" detection still exists as a fallback for legacy submissions, but the default output is a **one-page evidence document built for the teacher-student conversation**, not an automated flag.
6. **Educator dashboard** — class roster, baseline strength per student, submission timeline, exportable PDF reports.
7. **Privacy mode** — content is processed in-memory, not used for training, deletable on demand. Process traces stored encrypted and shareable only with the student's teacher.

### Phase 2
- LMS integrations (Canvas, Google Classroom, Moodle, Schoology).
- Assignment-design assistant: helps teachers write AI-resilient prompts and explicit AI-collaboration rubrics.
- Code-specific process capture (IDE plugin) — the same wedge applied to programming assignments.
- Image / diagram capture via timestamped canvas history.
- Multilingual support.

### Phase 3
- Institution-wide analytics, policy templates, teacher-training content.
- Open-methodology research portal: published accuracy reports per model / language / grade level.
- API for partners (LMS vendors, certification bodies).

---

## 4. Differentiation

Most existing detectors (Turnitin, GPTZero, Copyleaks, Originality.ai) optimize for a single output-based score and have well-publicized false-positive problems that hurt students — non-native English speakers in particular. Inkprint's differentiation is **structural, not cosmetic**:

| Axis | Incumbents | Inkprint |
|---|---|---|
| What's analyzed | The finished text | The writing process itself |
| What it's compared to | Global AI-vs-human model | The student's own prior work |
| Framing | Catch cheaters | Evaluate AI collaboration |
| Output | A percentage | An evidence sheet for a conversation |
| Defensibility vs. new LLMs | Erodes with each frontier model | Unaffected — process can't be faked easily |
| Lawsuit exposure | High (false positives) | Low (process evidence + per-student baseline) |

**Supporting principles** that show up across surfaces:
- **Evidence over verdicts** — every signal is explainable.
- **Teacher-first UX** — built around grading workflow, not flag-and-punish.
- **Transparency about uncertainty** — confidence intervals, "inconclusive" as a valid output.
- **Pro-student** — language and product design assume students are not suspects.
- **Open methodology** — accuracy reports published publicly, the GPTZero-killer move on transparency.

---

## 5. Branding

### Name candidates
1. **Verita** — from *veritas* (truth). Short, memorable, .com may be tight but variants available.
2. **Lumen** — light, clarity, used in education ("Lumen Learning" exists — needs check).
3. **Stylus** — the writing instrument; evokes authorship.
4. **Authentik** — direct, "authentic work."
5. **Originly** — a tongue-in-cheek nod to "originality."
6. **Proofroom** — a place where work is examined, calm and academic.
7. **Inkprint** — every writer has a fingerprint.

**Recommended starting point: Inkprint** — concrete metaphor, easy to draw a logo from, suggests evidence-based detection rather than judgment.

### Tone of voice
- Calm, academic, evidence-based. Not alarmist.
- Plain language, never accusatory. "Flagged for review," not "caught cheating."
- Pro-student, pro-teacher. AI is a tool, not an enemy.

### Visual identity — *Literary & Academic* (locked)

**Palette**

| Token | Hex | Role |
|---|---|---|
| Ink Blue | `#1B2A4E` | Primary — headings, primary buttons, logo |
| Parchment | `#F6F1E7` | Page background |
| Signal Coral | `#E26D5A` | Accent — flags, highlights, key CTAs (used sparingly) |
| Slate Gray | `#6B7280` | Body text |
| Paper White | `#FFFFFF` | Cards, surfaces |

**Typography**
- Headlines: *Source Serif* or *Newsreader* — literary, classroom-friendly.
- UI / body: *Inter* — clean grotesk for legibility.
- Code / mono: *JetBrains Mono* — for code-detection screenshots.

**Logo**
Stylized fingerprint where the ridge lines resolve into ink strokes. Wordmark set in serif italic: *Inkprint*. Mark works monochrome on parchment or ink-blue background.

**Mood & imagery**
Annotated essays, margins with handwritten notes, microscope-on-text close-ups. Quiet authority. **Avoid:** robots, neural-net diagrams, glowing-blue AI clichés, red "alert" UI (too punitive).

**Assets (already produced)**
Brand assets are committed under `/design/`:
- `design/assets/` — logo (primary + inverted + mark, SVG + PNG), favicons (SVG + ICO + 16/32 PNG), Apple touch icon.
- `design/images/` — six editorial photographs (pen on paper, annotated books, dictionary close-up) for marketing surfaces.

Full inventory and per-asset usage rules live in `BRANDING.md §13`. These files are the source of truth — implementation copies from `/design/` into `apps/web/public/`, never the other way around.

---

## 6. Website plan

### Stack
- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** for styling, with a small design-token layer for brand colors/typography
- **shadcn/ui** for accessible primitives
- **Vercel** for hosting (preview deploys per PR)
- **Resend** or similar for transactional email; **PostHog** for analytics; **Plausible** as a privacy-friendlier alternative

### Information architecture (marketing site, MVP)
- `/` — Landing: hero, how it works (3 steps), evidence-based screenshot, teacher testimonial, CTA to pilot
- `/product` — Feature deep-dive with screenshots
- `/for-teachers` — Use cases by role
- `/for-institutions` — Procurement, security, FERPA/GDPR
- `/pricing` — Free trial, per-teacher, institutional
- `/research` — Methodology, accuracy benchmarks, false-positive rate transparency
- `/about` — Mission, team, principles
- `/blog` — AI-in-education content marketing
- `/login` + `/signup` + `/app/*` — The actual product (gated)

### Landing page sections (priority order)
1. **Hero** — headline ("See the difference between effort and autocomplete."), subhead, primary CTA "Start a free pilot," secondary "Watch 60-second demo."
2. **Social proof strip** — institutional logos (when available).
3. **How it works** — 3 steps with annotated screenshots, not abstract icons.
4. **The evidence panel** — animated example of the explainability UI; this is our wedge.
5. **Built for the classroom workflow** — LMS integrations, bulk scan, PDF reports.
6. **Privacy & ethics** — clear statement on data handling and false-positive policy.
7. **Pricing teaser** — three tiers.
8. **FAQ** — false positives, student rights, accuracy, comparison vs. other tools.
9. **Final CTA.**

### SEO

Education buyers (teachers, integrity officers, procurement) start in search. Inkprint needs to rank for category-defining queries *and* the comparison queries that incumbents currently own.

- **Target query clusters**
  - Category: *"writing process detection,"* *"AI collaboration grading,"* *"keystroke evidence essay."*
  - Comparison: *"Turnitin alternative,"* *"GPTZero false positives,"* *"AI detector for teachers."*
  - Problem-led: *"how to tell if a student used ChatGPT,"* *"AI detector accuracy non-native English."*
  - Compliance: *"FERPA AI detector,"* *"GDPR student data writing analysis."*
- **On-page baseline (every route)**
  - Unique `<title>` (≤60 chars) and `<meta name="description">` (≤155 chars), written per page — no templated stuffing.
  - Open Graph + Twitter card tags with a per-page OG image generated via `@vercel/og`.
  - JSON-LD: `Organization` + `WebSite` site-wide; `Product`, `FAQPage`, `Article` where applicable.
  - Canonical URL set on every page; `/blog/*` posts have author + datePublished + dateModified.
- **Technical SEO**
  - Static generation (RSC) for all marketing routes; ISR for `/blog/*`.
  - `sitemap.xml` and `robots.txt` generated at build (`app/sitemap.ts`, `app/robots.ts`).
  - Lighthouse SEO ≥ 95 on every marketing route — gated in CI via Lighthouse-CI.
  - Core Web Vitals budget: LCP < 2.0s, INP < 200ms, CLS < 0.05 (mobile 4G). Images via `next/image` with explicit dimensions; fonts via `next/font` to prevent CLS.
  - No client-side-only marketing content — anything that should rank must be in the SSR'd HTML.
- **Content engine (`/blog`, `/research`)**
  - Pillar articles: methodology, accuracy reports, false-positive case studies, AI-collaboration rubrics.
  - Internal linking from blog → product pages with descriptive anchor text.
- **Off-page**
  - `/research` is the link-magnet — publish open methodology and accuracy data; expect citations from EdTech press.

### Accessibility

Accessibility is not optional for an education product. Public schools in the US (Section 508), EU (EAA, in force June 2025), and UK (PSBAR) procure against accessibility standards, and many of our target users are themselves disabled or neurodivergent.

- **Standard:** WCAG 2.2 Level **AA** is the floor for both marketing and product surfaces. AAA where it doesn't constrain the design (e.g., body copy contrast on `parchment`).
- **Principles**
  - Keyboard-operable end-to-end. Every interactive element reachable, focus visible (custom focus ring using `accent-coral` at ≥3:1 contrast), no keyboard traps.
  - Screen-reader-first: semantic HTML, ARIA only where semantics fall short. shadcn/ui primitives (Radix under the hood) give us a correct baseline — don't strip the ARIA.
  - Color is never the only signal. The evidence sheet uses icons + text labels alongside coral highlights — colorblind users get the same information.
  - Motion respects `prefers-reduced-motion`; the "animated evidence panel" on the landing page has a static fallback.
  - Form fields have visible labels (no placeholder-as-label), inline error text linked via `aria-describedby`, and submit errors are summarized at the top of the form.
  - Target sizes ≥ 24×24 CSS px (WCAG 2.2 §2.5.8).
- **Brand-specific contrast rules** (cross-reference `BRANDING.md §4`)
  - `text-ink` (`#1B2A4E`) on `parchment` (`#F6F1E7`): contrast ≥ 12:1 ✓ for body.
  - `accent-coral` (`#E26D5A`) must never be used for body text on `parchment` (fails AA). Restrict to icons, borders, large headings, and CTA buttons with white text.
- **Process**
  - `eslint-plugin-jsx-a11y` enforced in CI, `axe-core` run on every Playwright E2E route, manual NVDA + VoiceOver pass before any public launch.
  - Lighthouse Accessibility ≥ 95 on every marketing route, gated in CI.
  - Accessibility statement published at `/accessibility` with a contact route for issues; required for public-sector procurement.
- **Inclusive content**
  - Plain-language copy. Avoid idioms in product strings (translatable, and friendlier to non-native English speakers — the population most harmed by output-based detectors).
  - Dyslexia-friendly defaults: generous line-height (1.6+ body), no justified text, no all-caps for paragraphs.

---

## 7. Roadmap (first 90 days)

| Week | Milestone |
|---|---|
| 1 | Finalize name & domain, lock brand basics (logo v0, palette, type). |
| 2 | Ship marketing site v0 (landing + product + pricing + about). |
| 3–4 | Build detection API v0 around a base model + perplexity/burstiness features. |
| 5–6 | Educator dashboard MVP: single-submission analysis with explainability. |
| 7 | Bulk upload + PDF export. |
| 8 | Closed pilot with 5–10 teachers; instrument feedback. |
| 9–10 | Iterate on false-positive rate; add comparison-to-prior-work feature. |
| 11 | First LMS integration (Google Classroom). |
| 12 | Public beta + pricing live. |

---

## 8. Monetization

- **Free** — 20 submissions/month, single teacher.
- **Teacher Pro** — ~$12/mo, unlimited submissions, PDF reports, history.
- **Institution** — per-seat or site license, SSO, admin dashboard, FERPA DPA, custom retention.
- Avoid student-pays models — that conflicts with the mission.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| False positives harm students | Per-student baseline (not global classifier), confidence intervals, "inconclusive" output, public accuracy reporting. |
| Detection arms race with new models | **Structurally mitigated** — process capture is unaffected by model quality. Output-classifier is a fallback only. |
| Privacy concerns / FERPA | In-memory processing, no training on submissions, signed DPAs, EU data residency option, process traces encrypted and teacher-scoped. |
| Students refuse to install editor extension | Offer browser/Docs/Word add-ins (low friction), in-app web editor, and a fallback "paste your draft history" flow. Frame as proof-of-work that *protects* the student. |
| Crowded market (Turnitin, GPTZero, etc.) | Different category entirely — process & collaboration evaluation, not output classification. |
| Reputational risk if marketed as "catch cheaters" | Brand language is pro-teacher, pro-student; "review," not "catch." Evidence sheet replaces score. |

---

## 10. Next steps (decision points for you)

1. **Confirm or change the name** (Inkprint is my recommendation — say the word and I'll lock it in).
2. **Confirm visual direction** (ink-blue + parchment + coral). I can produce a tighter style tile if helpful.
3. **Decide deliverable order:** do you want me to (a) produce Figma-style mockups of the landing page next, or (b) jump straight into scaffolding the Next.js + Tailwind site?
4. **Domain availability check** — I can't browse, but tell me the candidate name(s) you like and I'll structure naming alternatives if the .com is taken.
