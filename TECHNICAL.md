<!-- cSpell:words Inkprint BYOK Supabase Postgres Drizzle Neon Vercel Resend PostHog Plausible bcrypt argon2 OpenAI Anthropic Gemini keystroke keystrokes JWT Lucia OTP SMTP IDB IndexedDB Tiptap ProseMirror Turborepo pnpm shadcn FERPA GDPR DPA TOTP RBAC superadmin -->

# Inkprint — Technical Architecture

This document covers the stack, data model, registration flow, and the **bring-your-own-key (BYOK)** mechanism that lets each teacher (or institution) plug in their own LLM provider key.

---

## 1. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR + RSC, one repo for site + app + API routes. |
| Styling | **Tailwind CSS + shadcn/ui** | Brand tokens map cleanly; accessible primitives. |
| Database | **Postgres** (Neon or Supabase managed) | Relational data, row-level security, EU region option. |
| ORM | **Drizzle** | Type-safe, lightweight, plays well with Edge. |
| Auth | **Lucia v3** (or Auth.js) — email + password, magic link, optional Google SSO | Self-hosted sessions, no vendor lock-in. |
| File / blob storage | **Cloudflare R2** or Supabase Storage | Submission attachments, exported PDFs. |
| Background jobs | **Trigger.dev** or Inngest | Long-running analysis, report exports. |
| Email | **Resend** | Verification, magic links, reports. |
| Hosting | **Vercel** (web app + API routes, preview deploys per PR) + **Fly.io** or Cloudflare Workers for long-running analysis workers | Vercel is the deployment target for everything Next.js. |
| Analytics | **PostHog** (product) + **Plausible** (marketing) | Privacy-friendly. |
| Monorepo | **Turborepo + pnpm** | Web, browser-extension, docs-add-in share types. |

---

## 2. High-level architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       Browser / Editor                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ Marketing    │  │ Teacher App  │  │ Process-capture    │    │
│  │ site (Next)  │  │ (Next RSC)   │  │ extension / SDK    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────┘    │
└─────────┼─────────────────┼──────────────────────┼──────────────┘
          │                 │                      │
          ▼                 ▼                      ▼
┌────────────────────────────────────────────────────────────────┐
│                    Next.js API + Server Actions                 │
│  /api/auth   /api/keys   /api/submissions   /api/analyze        │
└──────┬──────────────────┬────────────────────┬──────────────────┘
       │                  │                    │
       ▼                  ▼                    ▼
┌────────────┐    ┌────────────────┐   ┌──────────────────────┐
│ Postgres   │    │ Encrypted KMS  │   │ Analysis workers     │
│ (users,    │    │ (per-user API  │   │ (process trace +     │
│ classes,   │    │  keys, AES-GCM │   │ baseline + optional  │
│ submissions│    │  at rest)      │   │ LLM call w/ BYOK)    │
│ traces)    │    └────────────────┘   └──────────────────────┘
└────────────┘
```

---

## 3. Data model (Postgres)

Minimal first-pass schema. Drizzle definitions, abbreviated.

```ts
// users
id              uuid pk
email           text unique
password_hash   text             // argon2id
role            enum('teacher','admin','superadmin','student')
institution_id  uuid? fk
status          enum('pending','active','suspended')  // admin-controlled
email_verified  timestamptz?
created_at      timestamptz

// access_grants  -- admin grants a user access to our pooled API key
id              uuid pk
user_id         uuid fk
provider        enum('openai','anthropic','gemini')
monthly_token_limit  int            // 0 = unlimited
tokens_used_this_month int default 0
granted_by      uuid fk -> users.id
granted_at      timestamptz
expires_at      timestamptz?
revoked_at      timestamptz?

// institutions (optional grouping)
id              uuid pk
name            text
plan            enum('free','pro','institution')
data_region     enum('us','eu')

// api_keys  -- the BYOK table
id              uuid pk
user_id         uuid fk
provider        enum('openai','anthropic','gemini','azure_openai')
label           text             // "My personal OpenAI"
ciphertext      bytea            // AES-256-GCM
iv              bytea
auth_tag        bytea
key_hash        text             // sha256 of plaintext, for dup detection only
last_used_at    timestamptz?
created_at      timestamptz
revoked_at      timestamptz?

// classes
id              uuid pk
teacher_id      uuid fk
name            text

// students          -- pseudonymous within a class
id              uuid pk
class_id        uuid fk
display_name    text
external_id     text?            // LMS id

// submissions
id              uuid pk
student_id      uuid fk
title           text
final_text      text
created_at      timestamptz

// process_traces   -- the "ink-print"
id              uuid pk
submission_id   uuid fk
duration_ms     int
event_count     int
paste_event_count int
events_blob_url text             // gz-jsonl in R2
summary_json    jsonb            // pause histogram, edit ratio, etc.

// analyses
id              uuid pk
submission_id   uuid fk
api_key_id      uuid? fk         // which BYOK key (if any) was used
score           numeric
confidence      enum('low','medium','high','inconclusive')
evidence_json   jsonb
created_at      timestamptz
```

Row-level security is on for `submissions`, `process_traces`, and `analyses` — a teacher only sees rows where `classes.teacher_id = auth.uid()`.

---

## 4. Registration flow (simple)

The goal is the lowest-friction signup that still lets a teacher start a real analysis within 60 seconds.

### 4.1 Steps

1. **Signup** — `email` + `password` (min 12 chars) on `/signup`. Argon2id hash. Optional Google SSO.
2. **Verification email** — Resend sends a tokenized link (15-minute TTL). Account is usable for read-only browsing before verification; analysis is gated until verified.
3. **Onboarding wizard** (first login, 3 short steps):
   - **Step 1 — Role:** "I'm a teacher" / "I'm evaluating for an institution."
   - **Step 2 — Add API key (optional but recommended):** see §5. A "Skip for now, use the free tier" option uses our pooled key with strict rate limits.
   - **Step 3 — Create your first class:** name only. Roster import comes later.
4. **Dashboard** — empty state with a single CTA: *"Analyze your first submission."*

### 4.2 Auth surface

| Route | Purpose |
|---|---|
| `POST /api/auth/signup` | Create user, hash password, send verification email. |
| `POST /api/auth/login` | Verify password, issue session cookie (HttpOnly, SameSite=Lax). |
| `POST /api/auth/logout` | Destroy session. |
| `GET  /api/auth/verify?token=…` | Mark email verified. |
| `POST /api/auth/reset` | Send reset email. |
| `POST /api/auth/reset/confirm` | Set new password. |
| `POST /api/auth/2fa/enroll` | TOTP enrollment (institutional plan). |

Sessions are stored server-side (Lucia) so we can revoke them. Cookies are HttpOnly, Secure, SameSite=Lax, 14-day rolling expiry.

### 4.3 Password policy
- Minimum 12 characters.
- Checked against the HaveIBeenPwned k-anonymity API on signup and reset.
- No mandatory rotation, no forced complexity beyond length (NIST 800-63B guidance).

---

## 5. Bring-Your-Own-Key (BYOK)

### 5.1 Why BYOK
- Shifts LLM inference cost to the user — sustainable free tier.
- Lets institutions use their own contracted/Azure-hosted models for data-residency reasons.
- Reduces our blast radius if there is a billing dispute or quota exhaustion.
- Common, well-understood pattern (Cursor, Continue, OpenWebUI all do this).

### 5.2 Supported providers (MVP)
- **OpenAI** (`gpt-4o-mini` and up)
- **Anthropic** (Claude Haiku / Sonnet)
- **Google Gemini** (`gemini-2.5-flash` and up)
- **Azure OpenAI** (institutional plan)

Each provider has a small adapter behind a common interface:

```ts
interface LlmProvider {
  id: 'openai' | 'anthropic' | 'gemini' | 'azure_openai'
  validateKey(plaintext: string): Promise<{ ok: boolean; modelList?: string[] }>
  analyze(input: AnalyzeRequest, key: string): Promise<AnalyzeResult>
}
```

Adapters live in `packages/providers/{openai,anthropic,gemini,azure}.ts`. Adding a new provider = drop a new file implementing the interface and register it in the provider map.

### 5.3 Add-key UI

On `/settings/keys`:

```
┌─────────────────────────────────────────────────────────┐
│  API keys                                       + Add   │
├─────────────────────────────────────────────────────────┤
│  Provider     Label              Last used   Status     │
│  OpenAI       My personal key    2 min ago   ● Active   │
│  Anthropic    School account     —           ● Active   │
└─────────────────────────────────────────────────────────┘
```

Add-key dialog:

```
Provider:   ( ◉ OpenAI    ◯ Anthropic    ◯ Azure OpenAI )
Label:      [ My personal key                            ]
API key:    [ sk-•••••••••••••••••••••••••••••••••••••• ]
            ↳ validated against the provider on submit
[Cancel]                                          [Save]
```

### 5.4 Storage & encryption

**Never store the plaintext key.** Flow on save:

1. Server receives the plaintext over TLS.
2. Server calls `provider.validateKey(plaintext)` — a cheap models-list call. Reject on failure.
3. Generate a random 12-byte IV.
4. Encrypt with **AES-256-GCM** using a per-environment master key held in the KMS (Cloudflare KMS, AWS KMS, or `gcloud kms` — never in env vars in plaintext).
5. Store `ciphertext`, `iv`, `auth_tag`, and `sha256(plaintext)` for duplicate detection.
6. Discard plaintext from memory.

At analysis time:
1. Worker fetches the row, decrypts in-memory with the master key.
2. Calls the provider, streaming response back.
3. Plaintext lives only inside the worker process for the request lifetime.

### 5.5 Key safety guarantees we ship
- Never log a request body that contains a key.
- Never include keys in error reports or telemetry.
- Revocation is one click — sets `revoked_at`, decryption refuses thereafter.
- Last-used timestamp is shown to the user so they can spot anomalies.
- Failed-validation key submissions are rate-limited (5 / hour / IP).
- Optional **per-key spend cap** (Phase 2) — proxy provider calls through our worker, count tokens, and cut off at the user's monthly limit.

### 5.6 API surface

| Route | Purpose |
|---|---|
| `POST /api/keys` | Validate + store an encrypted key. Body: `{ provider, label, plaintext }`. |
| `GET  /api/keys` | List keys (no ciphertext returned — only metadata). |
| `POST /api/keys/:id/test` | Re-validate against the provider. |
| `DELETE /api/keys/:id` | Revoke. Soft-delete; ciphertext purged after 7 days. |

Response shape from `GET /api/keys`:

```json
[
  {
    "id": "k_01J…",
    "provider": "openai",
    "label": "My personal key",
    "last_four": "••••a93f",
    "last_used_at": "2026-05-19T14:22:11Z",
    "status": "active"
  }
]
```

`last_four` is computed at encryption time and stored as a separate plaintext column — it lets the UI show recognizable identifiers without ever decrypting.

---

## 6. Admin panel

A separate, internal-only surface for our team (and, on the Institution plan, the institution's own admin). Mounted at `/admin/*` and gated by `role IN ('admin','superadmin')`.

### 6.1 Capabilities

| Capability | `admin` | `superadmin` |
|---|---|---|
| View user list, search, filter by status/role/institution | ✓ | ✓ |
| Inspect a user's submissions, traces, audit log | ✓ | ✓ |
| Activate / suspend a user | ✓ | ✓ |
| Grant or revoke access to **our pooled API key** | ✓ | ✓ |
| Set per-user monthly token limit | ✓ | ✓ |
| Change a user's role (teacher ↔ admin) | — | ✓ |
| Manage institutions (create, change plan, set data region) | — | ✓ |
| View provider spend dashboards | ✓ | ✓ |
| Impersonate user (read-only, audit-logged) | — | ✓ |

### 6.2 Pooled-API-key grant flow

The pooled key is Inkprint's own OpenAI/Anthropic/Gemini account. We never expose it to users — we proxy calls through our worker, count tokens, and enforce the per-user limit.

1. User signs up. `status = 'pending'`, no `access_grant`, no BYOK key → analysis routes return `403 needs_access`.
2. Admin opens `/admin/users/:id`, clicks **Grant access**.
3. Admin picks provider (OpenAI / Anthropic / Gemini), monthly token limit (default 100k), optional expiry.
4. Row inserted into `access_grants`. `users.status = 'active'`.
5. User can now run analyses. The worker:
   - Looks up `access_grants` for the user.
   - If present and within limit, uses the pooled key for that provider.
   - If absent, falls back to the user's BYOK key.
   - If neither, returns `403`.
6. Each call increments `tokens_used_this_month`. A nightly job resets monthly counters on the 1st.

### 6.3 Admin UI surfaces

```
/admin                       Dashboard: signups, active users, spend
/admin/users                 Searchable user table
/admin/users/:id             User detail: profile, status, grants, submissions, audit log
/admin/users/:id/grant       Grant access dialog
/admin/institutions          Institution management (superadmin)
/admin/spend                 Pooled-key spend by provider, week-over-week
/admin/audit                 Audit log viewer (filter by actor, action, target)
```

### 6.4 Admin API surface

| Route | Role | Purpose |
|---|---|---|
| `GET  /api/admin/users` | admin | List/search users. |
| `GET  /api/admin/users/:id` | admin | User detail incl. grants. |
| `PATCH /api/admin/users/:id` | admin | Update `status`. Role changes require superadmin. |
| `POST /api/admin/users/:id/grants` | admin | Create access grant. |
| `DELETE /api/admin/grants/:id` | admin | Revoke grant. |
| `POST /api/admin/users/:id/impersonate` | superadmin | Returns short-lived read-only session. |

### 6.5 Audit log

Every admin mutation writes an `audit_events` row: `{ actor_id, action, target_type, target_id, before, after, ip, ua, created_at }`. Append-only; never edited. Visible at `/admin/audit`.

### 6.6 Hard rules

- The pooled API key is **never** sent to the browser. It lives in KMS-encrypted env vars on the analysis worker only.
- Admin actions are RLS-bypassed via a `SECURITY DEFINER` Postgres function — not by giving the admin role access to all rows. This keeps the audit-log trail clean.
- Impersonation is read-only and logged on both ends (the impersonated user sees a "viewed by admin" entry in their own activity feed).
- Suspending a user invalidates all their sessions immediately.

---

## 7. Process-capture data shape (preview)

Quick note since this is the core wedge — full spec to follow.

```jsonl
{"t":0,"type":"focus"}
{"t":412,"type":"insert","pos":0,"text":"T"}
{"t":498,"type":"insert","pos":1,"text":"h"}
…
{"t":94120,"type":"paste","pos":3120,"len":847,"source":"clipboard"}
{"t":94380,"type":"pause","duration":12400}
{"t":138210,"type":"submit"}
```

Stored as gzipped JSONL in R2 (cheap, append-only). A `summary_json` is computed at submit time so the dashboard can render fast without re-streaming the trace.

---

## 8. Security & compliance baseline

- TLS 1.3 everywhere, HSTS, secure cookies.
- Argon2id for passwords. AES-256-GCM + KMS for API keys and the pooled key.
- Row-level security in Postgres; teacher scope enforced at DB layer, not just app layer.
- Audit log for any key create/test/delete event and every admin mutation.
- EU and US data regions selectable at signup; data does not cross.
- FERPA-friendly defaults: no training on submissions, retention configurable, signed DPA on the Institution plan.
- Bug-bounty program once GA.

---

## 9. Deployment (Vercel)

The Next.js app — marketing site, product, API routes, and admin panel — deploys to **Vercel**. Analysis workers (long-running, per-call LLM streaming) run on Fly.io or Cloudflare Workers; the Vercel app calls them over signed internal RPC.

### 9.1 Environments

| Environment | Branch | URL pattern | Notes |
|---|---|---|---|
| Production | `main` | `inkprint.com` | Manual promote from staging. |
| Staging | `staging` | `staging.inkprint.com` | Auto-deploy. Mirrors prod env. |
| Preview | every PR | `inkprint-<sha>.vercel.app` | Auto-deploy. Uses a shared preview database. |
| Local | — | `localhost:3000` | `vercel dev` or `next dev`. |

### 9.2 Vercel configuration
- **Framework preset:** Next.js (auto-detected).
- **Node version:** 20.x LTS (set in `package.json` `engines`).
- **Install command:** `pnpm install --frozen-lockfile`.
- **Build command:** `pnpm turbo build --filter=web`.
- **Output:** `apps/web/.next` (App Router, serverful where needed).
- **Regions:** `iad1` (US-East) for the US app, `fra1` (Frankfurt) for the EU app. EU app is a separate Vercel project, not a route.
- **Edge runtime:** used for marketing pages and lightweight auth checks. Node runtime for anything touching Drizzle, KMS, or BYOK decryption.
- **Image optimization:** Vercel's, restricted to the configured asset hosts.
- **Cron:** Vercel Cron for the monthly token-counter reset (`0 0 1 * *`).

### 9.3 Environment variables (Vercel project)

All set per-environment in Vercel's dashboard; nothing secret in git. Categories:

- **Database:** `DATABASE_URL`, `DIRECT_DATABASE_URL` (Drizzle migrations).
- **Auth:** `SESSION_SECRET`, `RESEND_API_KEY`, `GOOGLE_OAUTH_CLIENT_ID/SECRET`.
- **KMS:** `KMS_KEY_ID`, `KMS_REGION`, IAM via Vercel's OIDC federation (no long-lived AWS keys).
- **Pooled provider keys:** `POOLED_OPENAI_KEY`, `POOLED_ANTHROPIC_KEY`, `POOLED_GEMINI_KEY` — only present in the **worker** environment, never in the Vercel web project.
- **Worker RPC:** `WORKER_URL`, `WORKER_SHARED_SECRET`.
- **Observability:** `POSTHOG_KEY`, `SENTRY_DSN`.

### 9.4 Domains & DNS
- Apex `inkprint.com` → Vercel.
- `app.inkprint.com` → product (same Vercel project, route group).
- `admin.inkprint.com` → admin panel (same project, gated route group with extra middleware check).
- Email (Resend) uses `mail.inkprint.com` with verified DKIM/SPF/DMARC.

### 9.5 Promotion flow
1. PR → preview deploy → review on the preview URL.
2. Merge to `staging` → auto-deploy to staging.
3. Smoke tests + Playwright against staging.
4. Promote staging build to prod via Vercel CLI (`vercel promote`) — no rebuild, same artifact.
5. Post-deploy: PostHog release marker, Sentry release tag.

### 9.6 Rollback
- One-click rollback in Vercel to any previous prod deployment.
- DB migrations are forward-only — if a rollback would require a schema revert, treat it as a forward-fix instead.

---

## 10. Implementation steps

Step-by-step build order. Each step is a single, mergeable slice — finish and verify it before starting the next. **Do not parallelize.** Tell the agent (or yourself) which step number you are on.

### Step 1 — Repo & tooling — ✅ DONE
- [x] `pnpm init`, set `engines.node = "20.x"` and `packageManager`.
- [x] Initialize Turborepo with `apps/web` and `packages/{tokens,ui,types,providers,prompts}`.
- [x] Add `.editorconfig`, `.gitignore`, `.nvmrc`, `tsconfig.base.json` (strict mode on).
- [x] ESLint + Prettier + `cspell` configs at the repo root.
- [x] `pnpm install` clean, `pnpm turbo build` runs (even if empty).
- **Verified:** `pnpm install` → 212 packages; `pnpm turbo build` → 6/6 successful; `pnpm turbo typecheck` → 6/6 successful.

### Step 2 — Next.js app skeleton — ✅ DONE
- [x] `apps/web` = Next 15 App Router + TypeScript strict.
- [x] Tailwind v3 + `tailwind.config.ts` importing brand tokens from `packages/tokens`.
- [x] Brand colors mapped to Tailwind theme + CSS variables (shadcn primitives land in Step 4).
- [x] Root layout, base font loading (`Newsreader`, `Inter`, `JetBrains Mono` via `next/font`).
- [x] Global CSS sets `bg-parchment text-slate font-sans`.
- **Verified:** `next build` succeeds; dev server returns HTTP 200 on `/`; landing page renders the headline "See the difference between *effort* and *autocomplete*" with the brand fonts and parchment background.

### Step 3 — Brand assets wired in — ✅ DONE
- [x] Copy `design/assets/*` → `apps/web/public/brand/` (logo + inverted + mark, SVG + PNG).
- [x] Add favicons via Next 15 metadata API (`app/icon.svg`, `app/apple-icon.png`, `app/favicon.ico`) — auto-registered as routes.
- [x] Hero imagery copied to `apps/web/public/brand/images/` and consumed via `next/image`.
- [x] `Logo` and `LogoMark` React components in `packages/ui` reading from `/brand/`; `cn()` utility added.
- **Verified:** dev server returns `200` for `/`, `/brand/logo.svg`, `/icon.svg`, `/apple-icon.png`, `/favicon.ico`, and `/brand/images/01-fountain-pen-on-paper.jpg`; landing page renders the logo in the header and the hero photo in the right column.

### Step 4 — Design system primitives (`packages/ui`) — ✅ DONE
- [x] Tokens exported as a TS object from `@inkprint/tokens` and as CSS variables in `globals.css`.
- [x] `Button` (primary / secondary / tertiary / coral, three sizes), `Input`, `Textarea`, `Card`, `Badge` + `FlagPill`, `ScoreGauge`, `Highlight`, `Dialog` (Radix), `Tabs` (Radix) — brand-themed via `cva`.
- [x] `/showcase` route in the web app for visual review (chosen over Storybook/Ladle — same value, far less tooling weight; decision noted).
- [x] `Toast` deferred until we have a real surface that needs it (no notifications in current screens).
- **Verified:** `pnpm turbo typecheck` → 8/8; `next build` includes `/showcase` as a static route (125 kB First Load); dev server returns `200` on `/showcase` and the page contains every primitive (logo, buttons, inputs, cards, badges, flag pill, score gauge, highlight, dialog trigger, tabs).

### Step 5 — Marketing site (public) — ✅ DONE
- [x] Routes: `/`, `/product`, `/for-teachers`, `/for-institutions`, `/pricing`, `/research`, `/about`, `/blog`, `/legal/privacy`, `/legal/terms`, `/legal/dpa`. All under a `(marketing)` route group with shared `SiteHeader` + `SiteFooter`.
- [x] Landing-page sections from `PLAN.md §6` in priority order — hero, social proof, how-it-works, evidence panel demo, classroom workflow, privacy & ethics, pricing teaser, FAQ, final CTA — using the editorial photos from `design/images/`.
- [x] Legal pages shipped as TSX with on-brand copy. **Decision:** deferred `@next/mdx` until real long-form content exists; not worth the extra dep for three legal pages.
- [x] SEO: per-route `metadata`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (edge runtime, brand-themed).
- **Verified:** `pnpm turbo typecheck --force` clean; `next build` produces 14 routes (11 marketing pages + `/sitemap.xml` + `/robots.txt` + `/opengraph-image`) all statically prerendered except the Edge-runtime OG image; dev server returns `200` on every marketing route, sitemap renders valid XML, shared header/footer visible across pages.

### Step 6 — Database & ORM — ✅ DONE
- [x] `packages/db` workspace package: Drizzle schema for **10 tables** — `institutions`, `users`, `api_keys`, `access_grants`, `audit_events`, `classes`, `students`, `submissions`, `process_traces`, `analyses` — plus 8 enums.
- [x] First migration generated at `packages/db/migrations/0000_romantic_kingpin.sql` (194 lines).
- [x] RLS policies in `packages/db/sql/rls.sql` covering the five teacher-scoped tables, keyed off `current_setting('app.user_id')`.
- [x] **Two-role model:** `DATABASE_URL` (owner) handles migrations + admin paths; `APP_DATABASE_URL` (non-bypassrls `inkprint_app` role) handles regular traffic so RLS actually engages. Neon's default `neondb_owner` has `BYPASSRLS`, which is why a second role is mandatory — added `pnpm db:setup-app-role` to provision it.
- [x] Scripts: `db:generate`, `db:push`, `db:migrate` (schema + RLS), `db:apply-rls`, `db:setup-app-role`, `db:studio`, `db:verify`.
- **Verified:** Neon project provisioned; `pnpm db:migrate` applied; `pnpm db:setup-app-role` created the `inkprint_app` role; `pnpm db:verify` returns `ok: true` proving: Alice sees only her class, Bob sees only his, anon sees nothing, and Alice cannot insert a class assigned to Bob (`WITH CHECK` rejection).

### Step 7 — Auth & registration
- [ ] Lucia v3 wired with Postgres adapter.
- [ ] `POST /api/auth/signup` (email + password, Argon2id, HIBP check).
- [ ] `POST /api/auth/login`, `POST /api/auth/logout`.
- [ ] Verification email via Resend.
- [ ] `GET /api/auth/verify`, reset-password flow.
- [ ] Middleware that gates `/app/*` and `/admin/*` by role.
- **Done when:** a new user can sign up, verify, log in, log out, and see the empty dashboard.

### Step 8 — Onboarding wizard
- [ ] 3 steps from `TECHNICAL.md §4.1`: role pick → API key (skippable) → first class.
- [ ] State persisted server-side, resumable.
- **Done when:** the first-login flow drops the user at the dashboard with at least one class created.

### Step 9 — BYOK (own API key)
- [ ] KMS master key provisioned (AWS KMS via Vercel OIDC).
- [ ] `packages/providers/{openai,anthropic,gemini,azure}.ts` adapters implementing `LlmProvider`.
- [ ] `POST /api/keys`: validate against provider → encrypt with AES-256-GCM → store.
- [ ] `GET /api/keys`, `POST /api/keys/:id/test`, `DELETE /api/keys/:id`.
- [ ] `/settings/keys` UI matching the mockup in `TECHNICAL.md §5.3`.
- **Done when:** a user can add an OpenAI key, see it validated, and revoke it; ciphertext is never logged.

### Step 10 — Analysis pipeline (text first)
- [ ] File-parsing pipeline (txt, md, docx, pdf) — `TECHNICAL.md §1`.
- [ ] Prompt loader from `packages/prompts/` with versioning.
- [ ] `POST /api/submissions` accepts text or file → parses → runs `submission.text.v1` against the user's available provider (pooled grant or BYOK).
- [ ] Stores `SubmissionAnalysis` row.
- **Done when:** a teacher can paste an essay, get back a structured analysis, and see the flagged passages highlighted in the UI.

### Step 11 — Evidence sheet
- [ ] `evidence.sheet.v1` prompt invoked on submission complete.
- [ ] Markdown → React render in-app, print-ready PDF export via `react-pdf`.
- **Done when:** the evidence sheet renders on screen and downloads as a one-page PDF.

### Step 12 — Admin panel
- [ ] `/admin/*` routes gated by `role IN ('admin','superadmin')`.
- [ ] User list, user detail, grant-access dialog, audit log viewer.
- [ ] `POST /api/admin/users/:id/grants` with the pooled-key flow from `TECHNICAL.md §6.2`.
- [ ] Spend dashboard reading from the worker's token-count table.
- **Done when:** an admin can grant a new user access to the pooled OpenAI key, see their token usage tick up, and revoke access.

### Step 13 — Process capture (MVP, web editor)
- [ ] Tiptap-based editor at `/app/write/:assignment_id`.
- [ ] Captures keystrokes, paste events, focus changes, pauses → JSONL → POST to worker → gzipped in R2.
- [ ] `process_traces` row with `summary_json` written on submit.
- [ ] Submission UI shows trace summary alongside the LLM analysis.
- **Done when:** a draft written in the in-app editor produces a real trace that visibly influences the analysis verdict.

### Step 14 — Deployment hardening
- [ ] Vercel projects for US and EU regions.
- [ ] Environment variables set per `TECHNICAL.md §9.3`.
- [ ] Cron job (Vercel) for monthly token-counter reset.
- [ ] PostHog + Sentry instrumented.
- [ ] Playwright E2E covering: signup, BYOK add, analyze text, admin grant.
- **Done when:** all E2E tests pass against the staging Vercel deployment.

### Step 15 — Closed pilot
- [ ] 5–10 teachers onboarded manually.
- [ ] Feedback loop: weekly survey + PostHog session replays + a `/feedback` route inside the app.
- [ ] Track false-positive rate against a hand-labeled gold set.
- **Done when:** there is real teacher usage on the platform and a written postmortem of what to fix before public beta.

> **Working agreement:** at each step, the agent reports "starting Step N," does the work, then reports "Step N done, here is what changed." No skipping steps. No bundling. **After every step, mark it ✅ DONE in this list with a one-line "Verified:" summary of the check that confirmed it.** If a step is too large, split it in this list before starting.

---

## 11. SEO implementation

Product strategy and target queries live in [`PLAN.md §6 → SEO`](./PLAN.md). This section is the *how*.

### 11.1 Metadata
- Per-route `export const metadata: Metadata` in every `page.tsx` / `layout.tsx`. No site-wide fallbacks beyond `app/layout.tsx`.
- `metadataBase` set from `NEXT_PUBLIC_SITE_URL` so OG/canonical URLs resolve correctly across preview deploys.
- Open Graph images generated dynamically via `@vercel/og` in `app/(marketing)/opengraph-image.tsx` and per-route overrides.
- JSON-LD injected via `<script type="application/ld+json">` in the relevant layout:
  - `Organization` + `WebSite` in `app/layout.tsx`.
  - `Product` on `/product`, `/pricing`.
  - `FAQPage` on landing FAQ + `/for-teachers` FAQ.
  - `Article` + `BreadcrumbList` on `/blog/[slug]`.

### 11.2 Rendering & routing
- All marketing routes are RSC + static (`export const dynamic = 'force-static'` where appropriate). Blog uses ISR with `revalidate = 3600`.
- `app/sitemap.ts` enumerates static routes + Drizzle-queried blog slugs.
- `app/robots.ts` allows everything except `/app/*`, `/api/*`, `/settings/*`, `/admin/*`.
- Canonical URLs set explicitly on any route with query-string variants.

### 11.3 Performance budgets (enforced in CI)
- Lighthouse-CI runs against `/`, `/product`, `/for-teachers`, `/for-institutions`, `/pricing`, `/research` on every PR.
- Hard fail if: Performance < 90, SEO < 95, Best Practices < 95.
- Core Web Vitals budget (mobile 4G simulation): LCP < 2.0s, INP < 200ms, CLS < 0.05.
- Fonts via `next/font` with `display: 'swap'`, preloaded, subset.
- Images via `next/image` with explicit `width`/`height` and `sizes`. Hero images use `priority`.
- No client components in the marketing tree unless they need interactivity — keeps the SSR payload rankable.

---

## 12. Accessibility implementation

Standard and principles live in [`PLAN.md §6 → Accessibility`](./PLAN.md). This section is the *how*.

### 12.1 Standard
- **WCAG 2.2 Level AA** is the build target for marketing and product.
- Public statement at `/accessibility` (required for US/EU/UK public-sector procurement).

### 12.2 Component baseline
- All interactive primitives come from `packages/ui/`, built on **shadcn/ui + Radix**. Do not bypass the underlying Radix component to "simplify" markup — it owns the ARIA contract.
- Custom focus ring: `focus-visible:ring-2 focus-visible:ring-accent-coral focus-visible:ring-offset-2 focus-visible:ring-offset-parchment`. Contrast verified ≥ 3:1.
- Minimum target size: 24×24 CSS px (WCAG 2.2 §2.5.8). Buttons in `packages/ui/button.tsx` enforce this via `min-h-[44px]` on the default variant for comfortable touch targets.

### 12.3 Forms
- Every field has a visible `<label>`. No placeholder-as-label.
- Validation errors:
  - Inline error rendered with `aria-describedby` linking the field to the message.
  - On submit failure, a top-of-form summary with `role="alert"` and focus moved to it.
  - Voice follows `BRANDING.md §6` — patient, never blaming.

### 12.4 Color & contrast
- Body text on parchment: `text-ink` only (12:1 — AAA).
- `accent-coral` is **never** used for body text on `parchment` (fails AA). Allowed uses: icons, borders, large display text (≥ 24px bold), and CTA buttons with `text-paper-white` (≥ 4.5:1).
- Any new token added to `packages/tokens` ships with a contrast matrix in the PR description.
- Information is never carried by color alone — pair coral highlights with an icon and a text label, especially in the evidence sheet.

### 12.5 Motion
- All non-essential motion wrapped in `@media (prefers-reduced-motion: no-preference)`.
- The landing-page evidence-panel animation has a static fallback rendered for `prefers-reduced-motion: reduce`.

### 12.6 Tooling & CI
- `eslint-plugin-jsx-a11y` at `recommended` in `eslint.config.mjs`; CI fails on warnings.
- `@axe-core/playwright` asserted on every E2E test — zero serious/critical violations allowed.
- Lighthouse-CI Accessibility budget ≥ 95 on every marketing route.
- Manual pass before any public launch: NVDA on Windows + VoiceOver on macOS + keyboard-only traversal of the golden paths (signup, add key, analyze submission, view report).

### 12.7 Content
- Plain-language product strings; idioms avoided (translation-ready + friendlier to non-native English speakers).
- Dyslexia-friendly defaults: body `leading-relaxed` (1.625), no `text-justify`, no all-caps paragraphs (`uppercase` allowed only for short labels with `tracking-wide`).

---

## 13. Open technical questions

1. Do we run the process-capture extension as a Chrome MV3 add-on first, or start with a JS SDK embedded in a web editor (Tiptap/ProseMirror)? — *Recommend: web editor first, extension in Phase 2.*
2. Per-key spend caps require us to proxy LLM calls — adds latency and a hop. Worth it for the safety story? — *Recommend: ship pass-through first, add proxy in Phase 2.*
3. SSO providers for institutions: Google + Microsoft are table stakes; SAML adds a quarter of work. — *Defer to Institution plan.*
