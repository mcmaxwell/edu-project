<!-- cSpell:words Inkprint OpenAI Anthropic Gemini JSONL Tiptap ProseMirror Mammoth pdfjs unfurl burstiness cliches autocomplete -->

# Inkprint — Analysis Prompts

This file holds the prompts and input-handling contracts for every analysis Inkprint runs. Prompts are versioned (see §6); change them here, not inline in code. The code imports them from `packages/prompts/`.

---

## 1. What we analyze

Two input modes:

1. **Text** — pasted or typed directly into the analyze form.
2. **Files** — uploaded by the teacher (one submission per file, or a folder for a bulk scan).

Optionally, every submission can carry a **process trace** (the keystroke/paste/pause stream — see `TECHNICAL.md §7`). When a trace is present, it's the primary evidence; the LLM prompt is enriched but not the source of truth.

### 1.1 Supported file types (MVP)

| Type | Extensions | Parser | Notes |
|---|---|---|---|
| Plain text | `.txt`, `.md` | native | Pass through. |
| Word | `.docx` | `mammoth` | Strip styles, keep paragraph structure. |
| PDF | `.pdf` | `pdfjs-dist` | Page-aware; preserves paragraph breaks. Reject scanned PDFs without text layer (Phase 2: OCR). |
| Rich text | `.rtf` | `rtf-parser` | Best-effort. |
| Code | `.py .js .ts .java .cpp .go .rs .rb .cs .sql .html .css` | native | Treated as code → routed to the code-specific prompt. |
| Google Docs | via OAuth import | Google API | Future. |

### 1.2 Limits (per submission, MVP)
- Max file size: **10 MB**.
- Max text length: **80,000 characters** (~12k words). Longer is chunked.
- Max files per bulk scan: **200**.
- Rejected: images-only PDFs, password-protected files, executables, archives.

### 1.3 Pre-processing pipeline

```
upload ─► virus scan ─► type detect ─► parser ─►
   normalize (NFC, strip BOM, collapse whitespace) ─►
   length check ─► chunker (if > 12k chars) ─►
   PII redact (optional, institution flag) ─►
   route to prompt
```

Chunking strategy: split on paragraph boundaries with a 200-char overlap. Each chunk gets analyzed; results are merged by `evidence-merge.ts` before the evidence sheet renders.

---

## 2. Prompt taxonomy

| Prompt | Purpose | Input | Output |
|---|---|---|---|
| `baseline.extract.v1` | Build a stylistic baseline from a student's prior verified work | 3–10 verified samples | `StyleBaseline` JSON |
| `submission.text.v1` | Analyze a single prose submission against the baseline | Text + (optional) trace summary + baseline | `SubmissionAnalysis` JSON |
| `submission.code.v1` | Same, for source code | Code + baseline | `SubmissionAnalysis` JSON |
| `evidence.sheet.v1` | Produce the human-readable one-pager from raw analysis | `SubmissionAnalysis` | Markdown |
| `assignment.design.v1` | (Phase 2) Suggest AI-resilient prompts for a given learning objective | Teacher's brief | Markdown |

All prompts are **JSON-mode** when the provider supports it (OpenAI, Gemini). For Anthropic, we instruct the model to emit JSON inside a fenced block and parse with a tolerant parser.

---

## 3. Shared system preamble

Every analysis prompt prepends this block:

```
You are Inkprint, an evidence-first analyst that helps teachers evaluate student work in the age of generative AI.

Operating rules:
1. You are NOT a verdict machine. You produce evidence and confidence, not accusations.
2. Never say a passage "is AI" — say it "shows patterns consistent with AI-generated text" and explain why.
3. "Inconclusive" is a valid and often correct output. Use it when signals conflict.
4. Compare against the provided student baseline whenever one exists. The baseline is the primary reference, not a global classifier.
5. Be specific. Quote short spans (≤ 25 words) when you flag something.
6. Do not invent stylistic features that aren't grounded in the text. Every claim must point at a span.
7. Output strictly the JSON schema requested. No prose outside the JSON.
8. Language: respond in the same language as the submission.
```

Cache this preamble as a system message — it never changes per request, which lets us hit OpenAI/Anthropic prompt-caching on every call.

---

## 4. The prompts

### 4.1 `baseline.extract.v1`

**Purpose:** condense 3–10 verified samples from a single student into a stylistic baseline used by every future analysis for that student.

**User message template:**

```
STUDENT_ID: {{student_id}}
LANGUAGE: {{language}}

I will provide {{n}} samples of this student's verified prior work.
Build a stylistic baseline capturing:
- sentence length distribution (mean, sd, p10, p90)
- vocabulary richness (type-token ratio band)
- common syntactic patterns (3–5)
- characteristic discourse markers / connectives
- punctuation habits (em dashes, semicolons, oxford commas, etc.)
- typical error patterns (recurring spelling, agreement, register)
- voice notes in plain English (2–3 sentences a teacher could read)

Samples follow, each delimited by <<<SAMPLE n>>> … <<<END>>>.

<<<SAMPLE 1>>>
{{sample_1}}
<<<END>>>
…
```

**Output schema:** `StyleBaseline`

```ts
type StyleBaseline = {
  student_id: string
  language: string
  sample_count: number
  sentence_length: { mean: number; sd: number; p10: number; p90: number }
  vocabulary: { ttr_band: 'low'|'mid'|'high'; notable_words: string[] }
  syntactic_patterns: string[]    // human-readable
  discourse_markers: string[]
  punctuation_habits: string[]
  recurring_errors: string[]
  voice_notes: string             // 2–3 sentence prose
  confidence: 'low'|'medium'|'high'
}
```

### 4.2 `submission.text.v1`

**Purpose:** analyze a single prose submission. The wedge prompt.

**User message template:**

```
LANGUAGE: {{language}}
ASSIGNMENT_CONTEXT: {{assignment_brief_or_none}}

BASELINE:
{{style_baseline_json_or_"none"}}

PROCESS_TRACE_SUMMARY:
{{trace_summary_json_or_"none"}}
  // includes: duration_ms, event_count, paste_event_count,
  //          largest_paste_chars, edit_ratio, pause_histogram

DECLARED_AI_USE:
{{student_declaration_or_"none"}}
  // e.g. "I used Gemini to brainstorm and grammar-check, no full drafting"

SUBMISSION:
<<<BEGIN>>>
{{submission_text}}
<<<END>>>

Tasks:
A. Compare the submission to the baseline. Note specific, span-level divergences.
B. Cross-reference any process-trace signals (large pastes, near-zero edit ratio, suspiciously even pause distribution).
C. Identify passages with patterns consistent with AI-generated text. For each, quote the span, list the indicators (perplexity feel, burstiness, generic phrasing, register shift), and give a per-passage confidence.
D. Reconcile against DECLARED_AI_USE — does the evidence match what the student declared?
E. Produce an overall verdict: 'aligned' | 'partial_concern' | 'high_concern' | 'inconclusive'.
F. List two suggested questions the teacher could ask the student in a follow-up conversation.

Output strictly the SubmissionAnalysis JSON schema. No prose outside it.
```

**Output schema:** `SubmissionAnalysis`

```ts
type Span = { start: number; end: number; quote: string }

type FlaggedPassage = {
  span: Span
  indicators: string[]             // human-readable
  baseline_divergence: string[]    // optional, present iff baseline given
  confidence: 'low'|'medium'|'high'
  note: string                     // 1 sentence in teacher voice
}

type SubmissionAnalysis = {
  language: string
  verdict: 'aligned'|'partial_concern'|'high_concern'|'inconclusive'
  overall_confidence: 'low'|'medium'|'high'
  baseline_used: boolean
  trace_used: boolean
  process_signals: {               // null if no trace
    paste_event_count: number
    largest_paste_chars: number
    edit_ratio: number
    notes: string[]
  } | null
  declaration_alignment: 'aligned'|'partial'|'contradicted'|'no_declaration'
  flagged_passages: FlaggedPassage[]
  baseline_alignment_notes: string[]
  conversation_questions: string[] // 2 items
  caveats: string[]                // anything the teacher should know about uncertainty
}
```

### 4.3 `submission.code.v1`

Same shape as `submission.text.v1` but the indicators list is code-specific:
- Idiomatic vs. textbook patterns (e.g. always uses `for i in range(len(...))` instead of `enumerate`).
- Variable-naming consistency with baseline.
- Comment density and style (AI-generated code tends toward verbose, restating comments).
- Library-import patterns matching the student's prior work.
- Test scaffolding patterns.
- Whitespace/format quirks (tabs vs. spaces, trailing commas).

The trace summary additionally surfaces: time-on-task, number of compile/run cycles, paste-to-edit ratio in the editor.

### 4.4 `evidence.sheet.v1`

**Purpose:** render the one-page teacher-facing document from a `SubmissionAnalysis`. This is the output that prints to PDF.

**System addition:**

```
You write in calm, evidence-led teacher voice (see brand voice rules):
- Never use "caught", "cheater", "guilty", "busted".
- "Flagged for review", "warrants a closer look", "patterns consistent with".
- Plain language. No emoji.
- Short paragraphs. Bulleted indicators.
- End with the suggested conversation questions, framed as supportive.
```

**User message template:**

```
Render a one-page evidence sheet from this SubmissionAnalysis JSON.
Sections, in order:
1. Header line with verdict and overall confidence.
2. One-paragraph summary (≤ 80 words).
3. "What the process trace shows" (omit if no trace).
4. "Passages flagged for review" — for each, the quote, indicators, and the one-sentence note. Cap at 5 passages.
5. "Baseline alignment notes" (omit if no baseline).
6. "Suggested conversation questions" — the two items, verbatim.
7. "Caveats" — bullet list.

Output: Markdown only. No JSON, no commentary.

INPUT:
{{submission_analysis_json}}
```

---

## 5. Provider-specific notes

| Provider | Model (default) | JSON mode | Caching | Notes |
|---|---|---|---|---|
| OpenAI | `gpt-4o-mini` | `response_format: json_schema` | Auto on system prompt | Use the schema, not free-form JSON. |
| Anthropic | `claude-haiku-4-5` | Instructed | Explicit `cache_control: ephemeral` on system + baseline | Cheaper at scale; tool-use mode is an alternative to schema. |
| Gemini | `gemini-2.5-flash` | `responseSchema` + `responseMimeType: application/json` | N/A | Strong on structured output; cheapest token rate. |
| Azure OpenAI | matches OpenAI | same | same | Institutional accounts only. |

Model choice is per-request: admin can default an institution to Gemini for cost, OpenAI for quality. Per-user override allowed when BYOK is present.

---

## 6. Versioning

- Every prompt has a version suffix (`.v1`, `.v2`).
- `SubmissionAnalysis.prompt_version` is stamped on the row at write-time. Never overwrite — append a new version row.
- When changing a prompt: bump the suffix, keep the old prompt file, register both in `packages/prompts/index.ts`.
- A/B testing routes a % of traffic to a new version; results compared by `verdict` agreement rate against the prior version on a held-out set.

---

## 7. Safety rails

- **No accusations.** Post-process every model response to strip phrases on the banned list (`caught`, `cheater`, `guilty`, `busted`, `100% AI`, `plagiarist`). If the model emits them, regenerate once; if it persists, fall back to a template evidence sheet that says "the model produced output we don't allow — please review the raw analysis."
- **No identity inference.** Never infer student demographics, language background, or disability status from the writing.
- **Refuse on missing baseline + no trace + short text.** Under 200 words with no baseline and no trace → return `inconclusive` automatically without calling the model. This is the single biggest false-positive trap and costs us nothing to avoid.
- **Token-level redaction** of names, emails, and student IDs before sending to third-party providers when the institution flag `redact_pii = true` is set.

---

## 8. Test fixtures

Every prompt has a golden-set of inputs in `packages/prompts/fixtures/<prompt>/<case>.json` with expected output bands (not exact strings — verdict + flagged-span overlap ≥ 0.7). CI runs them against a frozen model snapshot weekly to catch drift.
