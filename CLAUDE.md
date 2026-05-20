<!-- cSpell:words Inkprint Drizzle Lucia BYOK Tiptap shadcn Newsreader parchment Turborepo pnpm Vercel Postgres Resend PostHog Plausible -->

# CLAUDE.md — Instructions for Claude working on Inkprint

> Read this file first, every session. It points to the source-of-truth docs and the rules you must follow.

## 1. Project at a glance

**Inkprint** is a writing-process platform for educators. It captures *how* student work was made (keystrokes, pauses, revisions, paste events) and compares it against each student's own writing baseline. It is **not** an output-based AI detector.

If anything you're about to do contradicts that framing, stop and re-read §4 of `PLAN.md`.

## 2. Source-of-truth documents

Always defer to these. If you change behavior, update the doc that owns it.

| Doc | Owns |
|---|---|
| `PLAN.md` | Product vision, target users, features, roadmap, risks, monetization. |
| `BRANDING.md` | Name, voice, logo, color, typography, imagery, motion, design tokens. |
| `TECHNICAL.md` | Stack, data model, auth/registration, BYOK, security baseline. |
| `CLAUDE.md` | (this file) How to work in the repo. |

**Rule:** brand decisions live in `BRANDING.md`. Architecture decisions live in `TECHNICAL.md`. Don't duplicate; cross-reference.

## 3. Working principles

- **Read before you write.** Before editing or scaffolding, read the relevant doc section. Quote it back if the user's request seems to conflict with it.
- **One file per concern.** Don't dump architecture into `BRANDING.md` or branding into `TECHNICAL.md`. Create a new doc if a concern doesn't fit.
- **Update the docs as the code moves.** If you ship a new route, add it to `TECHNICAL.md §5.6` or the relevant section. Docs are not write-once.
- **Ask before scaffolding.** Don't generate large amounts of code without confirming scope. A bug fix doesn't need surrounding cleanup; a new feature shouldn't smuggle in refactors.
- **No half-finished implementations.** Either complete the slice or leave it un-started.

## 4. Code standards

### 4.1 Language & framework
- **TypeScript strict mode.** No `any` without a `// reason:` comment.
- **Next.js App Router**, React Server Components by default. Add `'use client'` only when you need state, effects, or browser APIs.
- **Server Actions** for mutations from the app. Public/extension traffic goes through `/api/*` routes.
- Prefer **named exports**. Default exports only where Next.js requires them (`page.tsx`, `layout.tsx`).

### 4.2 File layout

```
apps/
  web/                 Next.js app (marketing + product)
    app/               App Router routes
    components/        Shared React components
    lib/               Domain logic, no React
    db/                Drizzle schema + queries
    server/            Server-only utilities (auth, kms, providers)
  workers/             Analysis workers (separate runtime)
packages/
  ui/                  shadcn-based primitives, branded
  tokens/              Design tokens — single source for colors/type/radii
  providers/           LLM provider adapters (BYOK)
  types/               Shared TS types
```

### 4.3 Styling
- Tailwind classes only. **Never inline `style={{…}}` for colors, type, or spacing** — use tokens.
- Brand tokens live in `packages/tokens` and are imported by `tailwind.config.ts`. If you need a color that isn't a token, add it to `BRANDING.md §4` first.
- Use `cn()` (from `clsx` + `tailwind-merge`) for conditional classes.
- Component variants via `cva` (class-variance-authority).

### 4.4 Data layer
- **Drizzle** is the only way to talk to Postgres. No raw SQL except in migrations.
- All tables use UUID primary keys (`uuid v7` preferred for sortability).
- **Row-level security** is enforced at the DB layer, not just in app code. Every new table needs an RLS policy in the migration.
- Migrations are forward-only. Never edit a merged migration; write a new one.

### 4.5 Auth & sessions
- Sessions live server-side via Lucia. Cookies: `HttpOnly`, `Secure`, `SameSite=Lax`.
- Never store passwords as anything other than Argon2id.
- API keys (BYOK): never logged, never returned in plaintext, encrypted with AES-256-GCM via KMS. See `TECHNICAL.md §5`.

### 4.6 Errors & validation
- Validate every external input with **Zod** at the route/action boundary.
- Throw typed errors; never throw strings. Use a small `AppError` discriminated union.
- Don't add try/catch unless you have a real recovery path. Let unexpected errors bubble to the global handler.
- User-facing error messages follow the voice rules in `BRANDING.md §6` — patient, never blaming.

### 4.7 Testing
- **Vitest** for unit tests, **Playwright** for E2E.
- Test the boundary, not the implementation: server actions, API routes, critical UI flows.
- Don't mock Postgres in integration tests — run against a real test database in CI.

### 4.8 Comments
- Default to **no comments**. Names should carry the meaning.
- Add a one-line comment only when the *why* is non-obvious (a workaround, a non-trivial invariant, a security-relevant constraint).
- Never write a comment that restates the code or references the current task.

### 4.9 Logging & telemetry
- Use the shared logger. Never `console.log` in committed code.
- **Never log:** API keys, password hashes, raw process traces, student identifiers in marketing analytics.
- PostHog events use `snake_case` event names and a stable property schema.

## 5. Brand discipline in code

- All colors via tokens: `text-ink`, `bg-parchment`, `accent-coral`. No hex literals in components.
- Headlines: `font-display` (Newsreader). UI: `font-sans` (Inter). Code: `font-mono`.
- No emojis in product UI. Marketing surfaces may use a single `✦` sparingly.
- Coral is a highlighter, not a wall paint — no surface > ~8% coral.
- Never use red for errors. Use Signal Coral with an icon and a clear message.

## 6. Security checklist (run mentally on every PR)

- [ ] No secrets in code or env-committed files.
- [ ] All new inputs validated with Zod.
- [ ] New DB tables have RLS policies.
- [ ] No API key, password, or process trace appears in any log line.
- [ ] User-supplied HTML/Markdown is sanitized before render.
- [ ] New external HTTP calls have a timeout and a retry policy.

## 7. Git & commits

- Branches: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
- Commit messages: imperative mood, one-line subject, optional body. Reference the doc section if the change is doc-driven (`feat(auth): add magic link — TECHNICAL.md §4.2`).
- Never commit `.env*` files. Never amend a pushed commit. Never `--no-verify`.
- Only create commits when the user explicitly asks.

## 8. When in doubt

1. Re-read the relevant section of `PLAN.md` / `BRANDING.md` / `TECHNICAL.md`.
2. If the docs are silent or contradictory, ask the user before deciding.
3. If you make a judgment call, write it down — either in the relevant doc or as a one-line code comment with a `// decision:` prefix.
