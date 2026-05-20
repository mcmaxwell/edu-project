<!-- cSpell:words Inkprint Newsreader grotesk wordmark Wordmark monoline kerning tracking parchment FERPA Fraunces Sectra Fraunces -->

# Inkprint — Brand Guidelines

> *"See the difference between effort and autocomplete."*

This document is the single source of truth for the Inkprint brand. It governs the name, voice, logo, color, typography, imagery, and how those elements compose across product, marketing, and communication surfaces.

---

## 1. Brand essence

### 1.1 Purpose
Help educators uphold the integrity of student work in the age of generative AI — through **evidence, not verdicts**.

### 1.2 Positioning
The teacher-first AI-detection platform that treats false positives as a feature problem, not a footnote. Inkprint is to AI-detection what a microscope is to a courtroom: it shows you the evidence, you draw the conclusion.

### 1.3 Brand promise
- **Evidence over verdicts.** Every score is explainable.
- **Pro-student, pro-teacher.** Never accusatory, never punitive in language.
- **Honest about uncertainty.** "Inconclusive" is a valid output.

### 1.4 Brand personality
| It is | It is not |
|---|---|
| Calm, literary, considered | Alarmist, breathless |
| Evidence-based, methodical | Black-box, magical |
| Warm and human | Corporate, sterile |
| Quietly confident | Loud, salesy |
| Academic | Bureaucratic |

### 1.5 Audience
Teachers, professors, TAs, academic-integrity officers. They are time-poor, principled, skeptical of shiny EdTech, and protective of their students.

---

## 2. Name & wordmark

### 2.1 The name
**Inkprint** — a portmanteau of *ink* (authorship, writing) and *fingerprint* (evidence, identity). The name carries the entire brand metaphor in two syllables: every writer leaves a print, and Inkprint reads it.

### 2.2 Spelling & usage
- Always one word, capital I: **Inkprint**.
- Never "InkPrint," "ink print," "INKPRINT," or "Ink-print."
- In running text it can be set in regular weight; in product titles and the wordmark it is set in **serif italic**.
- Possessive: *Inkprint's*. Plural: avoid — there is one Inkprint.

### 2.3 Tagline options
- Primary: *"See the difference between effort and autocomplete."*
- Short: *"Evidence for the AI era."*
- Institutional: *"Assessment integrity, with evidence."*

---

## 3. Logo

### 3.1 Concept
A stylized **fingerprint whose ridges resolve into ink strokes** — the ridges curl into a pen stroke at the bottom-right, where a single drop of ink falls. The mark unites the two halves of the name in one glyph.

### 3.2 Construction
- Built on a 24×24 grid; ridges sit on 1.5-unit strokes.
- Outer silhouette: an oval ≈ 5:6 width:height (a fingerprint, not a circle).
- The ink-drop sits below-right, sized at 1× ridge stroke.
- Optical balance, not mathematical centering — the mark leans 1px right of the bounding box center.

### 3.3 Lockups
- **Primary lockup:** mark left, wordmark right, separated by 1× cap-height of space.
- **Stacked lockup:** mark above wordmark, gap = 0.5× cap-height. For square avatars, social profile pictures.
- **Mark only:** favicons, app icons, watermarks. Minimum 16×16.
- **Wordmark only:** running text references where a logo would feel heavy.

### 3.4 Clear space
Minimum clear space around any lockup = the height of the lowercase "n" in *Inkprint*. Nothing — type, image edge, button — enters that zone.

### 3.5 Minimum sizes
- Mark only: 16×16 px digital, 8mm print.
- Primary lockup: 96px wide digital, 25mm print.

### 3.6 Color usage on the logo
- **Default:** Ink Blue mark + Ink Blue wordmark on Parchment background.
- **Inverted:** Parchment mark + Parchment wordmark on Ink Blue background.
- **Monochrome black:** for fax, photocopy, and single-color print.
- **Coral accent:** the ink-drop *only* may be set in Signal Coral when the brand wants extra warmth (e.g. holiday card, hero banner). Never the ridges.

### 3.7 Don'ts
- ❌ Don't recolor the ridges to coral or any non-brand color.
- ❌ Don't outline, emboss, or add drop shadows.
- ❌ Don't rotate, skew, or stretch the mark.
- ❌ Don't place the mark on busy photography without a parchment plate behind it.
- ❌ Don't substitute the wordmark typeface — it is set, not derived.

---

## 4. Color

### 4.1 Core palette

| Token | Name | Hex | RGB | Role |
|---|---|---|---|---|
| `--ink` | Ink Blue | `#1B2A4E` | 27 · 42 · 78 | Primary. Headings, logo, primary buttons. |
| `--parchment` | Parchment | `#F6F1E7` | 246 · 241 · 231 | Page background. The "paper." |
| `--coral` | Signal Coral | `#E26D5A` | 226 · 109 · 90 | Accent. Flags, key CTAs, highlighted spans. |
| `--slate` | Slate Gray | `#6B7280` | 107 · 114 · 128 | Body text. |
| `--paper` | Paper White | `#FFFFFF` | 255 · 255 · 255 | Cards, surfaces above parchment. |

### 4.2 Extended palette

| Token | Name | Hex | Role |
|---|---|---|---|
| `--ink-700` | Ink 700 | `#2A3B66` | Hover state on Ink. |
| `--ink-300` | Ink 300 | `#8C97B5` | Disabled / tertiary. |
| `--coral-200` | Coral 200 | `#F7C9C0` | Highlight background under flagged text. |
| `--moss` | Moss | `#3F6B4E` | "Inconclusive / safe" badges. |
| `--sand` | Sand | `#EADFC6` | Dividers, subtle borders on parchment. |
| `--charcoal` | Charcoal | `#111827` | Hard text on light surfaces; code. |

### 4.3 Semantic mapping
- **Flagged passage background:** Coral 200, 60% opacity.
- **Flagged passage underline:** Signal Coral, 2px wavy.
- **Inconclusive badge:** Moss text on Sand background.
- **Confidence high:** Ink Blue. **Confidence medium:** Slate. **Confidence low:** Ink 300.

### 4.4 Color rules
- **Coral is rare.** No surface should be more than ~8% coral. It's a highlighter, not a wall paint.
- **Never red.** Red signals punishment; we are not punishment.
- **Parchment, not pure white.** The page should feel like paper. Pure white only for cards floating above it.

### 4.5 Accessibility
- Body text (Slate on Parchment) ≥ 4.5:1. Verified.
- Ink on Parchment ≥ 12:1.
- Coral on Parchment is **not** AA-compliant for body text — use it only for ≥18px bold or as a background under text.
- Every state has a non-color cue (icon, underline, weight). We never communicate by color alone.

---

## 5. Typography

### 5.1 Type families

| Role | Family | Weights | Source |
|---|---|---|---|
| Display & headlines | **Newsreader** | 400, 500, 600 + italics | Google Fonts |
| UI & body | **Inter** | 400, 500, 600, 700 | Google Fonts |
| Monospace / code | **JetBrains Mono** | 400, 600 | Google Fonts |

Newsreader is the chosen serif — slightly literary, slightly modern, readable at all sizes. Source Serif is an acceptable substitute if Newsreader is unavailable.

### 5.2 Type scale (web, base 16px)

| Token | Size / Line | Use |
|---|---|---|
| `display` | 60 / 64, Newsreader 500 | Landing hero |
| `h1` | 44 / 52, Newsreader 500 | Page titles |
| `h2` | 32 / 40, Newsreader 500 | Section titles |
| `h3` | 24 / 32, Newsreader 500 | Sub-sections |
| `h4` | 20 / 28, Inter 600 | Card titles |
| `body-lg` | 18 / 28, Inter 400 | Lead paragraphs |
| `body` | 16 / 26, Inter 400 | Default body |
| `body-sm` | 14 / 22, Inter 400 | Captions, table cells |
| `mono` | 14 / 22, JetBrains Mono 400 | Code, IDs |
| `eyebrow` | 12 / 16, Inter 600, tracking +0.08em, UPPERCASE | Section eyebrows |

### 5.3 Rules
- **Headlines in Newsreader, UI in Inter.** Never the reverse.
- Italics are part of the brand voice — use them in display headlines (*"effort and autocomplete"*) but sparingly in UI.
- Tracking: tighten display sizes (-1% to -2%); loosen eyebrows (+8%).
- Line length: 60–75 characters for body. Never full-width paragraphs.
- Numerals: use **tabular** figures in tables and dashboards; **proportional** elsewhere.

---

## 6. Voice & tone

### 6.1 Voice (constant)
- **Clear over clever.** Plain words first.
- **Evidence-led.** Show, then tell.
- **Calm.** No exclamation points outside of explicit celebratory moments.
- **Pro-student.** Never refer to students as suspects.

### 6.2 Tone (varies by context)
| Surface | Tone |
|---|---|
| Marketing site hero | Confident, literary, a little aspirational |
| Product UI | Plain, helpful, declarative |
| Error states | Patient, never blaming the user |
| Academic integrity reports | Neutral, evidence-only, no adjectives |
| Educational blog | Curious, generous, anti-doom |

### 6.3 Vocabulary

**Use:**
- "Flagged for review," "warrants a closer look," "high stylistic similarity to AI-generated text"
- "Inconclusive"
- "The teacher decides"
- "Evidence," "signal," "passage"

**Avoid:**
- "Caught," "cheater," "guilty," "busted"
- "AI-proof," "100% accurate," "guaranteed"
- "Plagiarism" used interchangeably with "AI use" — they are different.
- Emoji in product UI. (Marketing may use a single ✦ or ✧ sparingly.)

### 6.4 Examples

**Don't:** "Caught! This essay is 97% AI-generated."
**Do:** "Several passages show patterns consistent with AI-generated text. Review the highlighted sections."

**Don't:** "Don't worry — our detector is never wrong."
**Do:** "No detector is perfect. Inkprint shows you the evidence so you can decide."

---

## 7. Imagery & iconography

### 7.1 Photography
- **Subjects:** annotated essays, fountain pens on paper, hands marking margins, soft-lit classrooms with no faces visible, close-ups of printed text.
- **Treatment:** warm white-balance, natural light, slight grain. No stock-photo gloss.
- **Avoid:** robots, glowing brains, neural-net visualizations, blue-tinted "tech" photography, students looking guilty.

### 7.2 Illustration
- Line-based, single-weight strokes, occasional parchment-tone fills. Think botanical-textbook or vintage academic diagram.
- Annotations and margin notes are a recurring motif — handwritten arrows, brackets, underlines.

### 7.3 Icons
- **Lucide** icon set as the base — 1.5px strokes, rounded joins.
- Color: Ink Blue. Disabled: Ink 300. Never coral except on flag-state icons.
- Custom icons must match Lucide weight and join style.

### 7.4 Logo / mark in compositions
- Treat the mark as a **stamp**, not a sticker. It can appear faintly watermarked behind hero text, large and quiet in the corner of a report, or as a small lockup in headers.

---

## 8. Layout & motion

### 8.1 Grid & spacing
- 4px base unit. All spacing in multiples of 4.
- Container max-width: 1200px. Reading column: 680px.
- Generous whitespace — the page should feel like a book margin, not a dashboard.

### 8.2 Surfaces & elevation
- Default surface: Parchment.
- Cards: Paper White on Parchment, 1px Sand border, no shadow.
- Hover elevation: a 1px Ink-300 border, *not* a drop shadow.
- Modals: Paper White, 2xl rounded corners (16px), soft ink-tinted shadow.

### 8.3 Borders & radii
- Buttons: 8px radius.
- Cards: 12px radius.
- Modals & hero panels: 16px radius.
- Avatars & marks: full circle.

### 8.4 Motion
- **Easing:** `cubic-bezier(0.2, 0.8, 0.2, 1)` — quietly confident.
- **Duration:** 150ms for state changes, 250ms for entrances, 400ms for hero reveals. Never longer.
- **Principle:** motion clarifies, never decorates. No parallax. No floating particles. Highlight reveals on the evidence panel can use a typewriter-style stagger — that's our one signature flourish.

---

## 9. Component principles (preview)

These are direction-setting; full specs live in the design system once built.

- **Buttons:** Primary = Ink fill, Parchment text. Secondary = Ink 1px outline on Parchment. Tertiary = text-only with underline on hover.
- **Inputs:** 1px Sand border, Paper White fill, 8px radius. Focus = 2px Ink ring.
- **Flag pill:** Coral 200 background, Signal Coral text, no border, 999px radius.
- **Score gauge:** semi-circle, Ink fill on Sand track. Numbers in tabular Inter 600.
- **Highlight (in evidence panel):** Coral 200 background at 60% opacity, with a 2px Signal Coral wavy underline.

---

## 10. Applications

### 10.1 Marketing site
- Hero: parchment background, large Newsreader display headline with one italicized phrase, Ink Blue primary CTA, single coral highlight on the wordmark in the headline.
- "How it works" uses the annotated-document motif — real essay screenshots with margin notes.
- Footer is Ink Blue with Parchment text, mark watermark at 6% opacity bottom-right.

### 10.2 Product UI
- Two-pane default: roster left (240px), detail right.
- Evidence panel is the hero of the product — make it feel like a microscope view, not a dashboard widget.

### 10.3 Reports (PDF export)
- Letter / A4. Parchment background. Newsreader headlines. Inkprint mark + report title in header. Quote-style pull-outs for flagged passages.

### 10.4 Email
- Plain-text-first. When HTML, parchment background and a single Ink Blue button. No marketing banners in transactional mail.

### 10.5 Social
- Avatar: stacked mark on Ink Blue.
- Post template: parchment with a single Newsreader pull-quote, mark bottom-right.

---

## 11. Naming conventions for design tokens

CSS variables, Tailwind config, and Figma styles all use the same names. One source of truth.

```
--color-ink            #1B2A4E
--color-ink-700        #2A3B66
--color-ink-300        #8C97B5
--color-parchment      #F6F1E7
--color-paper          #FFFFFF
--color-coral          #E26D5A
--color-coral-200      #F7C9C0
--color-slate          #6B7280
--color-moss           #3F6B4E
--color-sand           #EADFC6
--color-charcoal       #111827

--font-display         "Newsreader", serif
--font-sans            "Inter", system-ui, sans-serif
--font-mono            "JetBrains Mono", ui-monospace, monospace

--radius-sm            8px
--radius-md            12px
--radius-lg            16px

--ease-brand           cubic-bezier(0.2, 0.8, 0.2, 1)
```

---

## 12. Governance

- Brand updates land here first. Code and Figma styles follow this document, not the other way around.
- Any deviation requires a written exception in this file's *Exceptions* section (none yet).
- Questions on edge cases: default to the more *literary, calm, evidence-based* option.

### Exceptions
*None.*
