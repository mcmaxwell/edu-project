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

## 10. Open technical questions

1. Do we run the process-capture extension as a Chrome MV3 add-on first, or start with a JS SDK embedded in a web editor (Tiptap/ProseMirror)? — *Recommend: web editor first, extension in Phase 2.*
2. Per-key spend caps require us to proxy LLM calls — adds latency and a hop. Worth it for the safety story? — *Recommend: ship pass-through first, add proxy in Phase 2.*
3. SSO providers for institutions: Google + Microsoft are table stakes; SAML adds a quarter of work. — *Defer to Institution plan.*
