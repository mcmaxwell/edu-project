# Inkprint

A writing-process platform for educators. Inkprint captures *how* student work was made — keystrokes, pauses, revisions, paste events — and compares it against each student's own writing baseline.

It is **not** an output-based AI detector. The goal is evidence about process, surfaced to teachers, not a verdict.

## Documentation

| Doc | Owns |
|---|---|
| [`PLAN.md`](./PLAN.md) | Product vision, target users, features, roadmap, monetization. |
| [`BRANDING.md`](./BRANDING.md) | Name, voice, logo, color, typography, design tokens. |
| [`TECHNICAL.md`](./TECHNICAL.md) | Stack, data model, auth, BYOK, security baseline. |
| [`CLAUDE.md`](./CLAUDE.md) | Working rules for contributors (and Claude). |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind + shadcn/ui · Postgres + Drizzle · Lucia auth · Turborepo + pnpm. Full breakdown in [`TECHNICAL.md §1`](./TECHNICAL.md).

## Repository layout

```
apps/
  web/        Next.js app (marketing + product)
  workers/    Analysis workers
packages/
  ui/         shadcn-based branded primitives
  tokens/     Design tokens (single source for colors/type/radii)
  providers/  LLM provider adapters (BYOK)
  types/      Shared TS types
```

## Getting started

```bash
pnpm install
pnpm dev
```

Environment variables, database setup, and KMS configuration are documented in [`TECHNICAL.md §5`](./TECHNICAL.md).

## Contributing

Read [`CLAUDE.md`](./CLAUDE.md) before opening a PR. Brand decisions belong in `BRANDING.md`; architecture decisions in `TECHNICAL.md`. Don't duplicate — cross-reference.
