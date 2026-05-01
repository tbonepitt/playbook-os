# Notes for Claude Code

This project is a **micro-learning app** called **PlaybookOS**. The repo currently holds:

- `PlaybookOS Wireframe.html` — single-file React+Babel low-fi wireframe; the design source of truth
- `README.md` — overview + handoff notes
- `docs/DESIGN.md` — component inventory + interaction notes
- `docs/PIPELINE.md` — generation pipeline spec
- `docs/DATA_MODEL.md` — domain types

## Your job

Bootstrap a real codebase from the wireframe. Suggested:

1. **Monorepo:** pnpm workspaces + turborepo
2. **Web app:** Next.js (app router) + TypeScript + Tailwind
3. **Domain layer:** plain TS in `packages/core`, Zod for runtime validation
4. **Persistence:** Postgres + Prisma
5. **LLM:** Anthropic Claude SDK (`@anthropic-ai/sdk`)
6. **Source adapters:** modular under `packages/pipeline/adapters/{pdf,github,youtube,url,...}`
7. **Generators:** one folder per pipeline stage under `packages/generators`

## Build order

1. Repo scaffolding + lint/format/test setup
2. Domain types from `docs/DATA_MODEL.md`
3. App shell + sidebar + routing skeleton (just the chrome, empty pages)
4. Library screen + Playbook CRUD against a stub repository
5. Source intake + first adapter (start with PDF or URL)
6. Concept extraction stage + UI feedback
7. Framework generator
8. Outline + lesson generators
9. Lesson player (the cards UI is non-trivial)
10. Publish pipeline (microsite first)

## Style notes

The wireframe is intentionally low-fidelity grayscale. **Do not port the wireframe styles directly.** Instead, build a real design system. Keep the wireframe open as a reference for layout, hierarchy, and interactions, not for color/type.

## Things explicitly not designed yet

- Auth flow
- Settings screens
- Mobile lesson player
- Generation error / retry UI
- Lesson card editor (the wireframe lets you view but not edit individual cards)
- Diff view for regenerating sections
- Billing / quotas

Ask before inventing UI for these.
