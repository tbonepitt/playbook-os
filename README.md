# PlaybookOS

**Turn any source material into a structured micro-learning playbook.**

---

## What It Is

PlaybookOS is a creator tool that ingests source material — PDFs, GitHub repos, YouTube videos, articles, docs — and uses Claude to automatically extract concepts, build a named framework, generate a full course outline, write lesson cards, and publish a learner-facing microsite.

The core loop:

> Add sources → Claude analyzes → named framework is generated → modules + lessons are written → publish to the web

---

## Tech Stack

| Layer | Choice |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Web app | Next.js 15 (App Router) + TypeScript + Tailwind |
| Domain types | `packages/core` — plain TypeScript + Zod schemas |
| LLM | Anthropic Claude (`claude-sonnet-4-6`) with prompt caching |
| Source adapters | `packages/pipeline` — URL, GitHub, YouTube, PDF |
| Generators | `packages/generators` — concept extraction, framework, outline, lessons |
| Persistence | In-memory stub DB (Prisma + Postgres ready to drop in) |
| Deployment target | Vercel |

---

## Monorepo Structure

```
playbook-os/
├── apps/
│   ├── web/                          # Next.js creator app
│   └── microsite/                    # Published learner microsites (placeholder)
├── packages/
│   ├── core/                         # Domain types + Zod schemas
│   ├── ui/                           # Shared component library
│   ├── pipeline/                     # Source ingestion adapters
│   └── generators/                   # LLM-powered generation pipeline
├── docs/
│   ├── DESIGN.md                     # Component inventory + interaction notes
│   ├── PIPELINE.md                   # Generation pipeline spec
│   └── DATA_MODEL.md                 # Domain types
├── PlaybookOS Wireframe.html         # Reference wireframe (design source of truth)
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

---

## Domain Model

```
Source
  └── type: pdf | github | youtube | article | docs | markdown | gdoc | notion
  └── status: pending → validated → extracted → error
  └── extracted: { concepts[], examples[], citations[] }

Playbook
  ├── sourceIds[]
  ├── frameworkId
  ├── modules[]
  │     ├── lessons[]
  │     │     └── cards[] (concept | metaphor | example | mistake | quiz | apply | source)
  │     └── artifactIds[]
  ├── artifacts[]
  └── publishConfig { visibility, outputs[] }

Framework
  ├── name (e.g. "A.G.E.N.T.")
  ├── pillars[] { letter, name, description }
  └── alternateNames[]
```

---

## Generation Pipeline (10 stages)

| # | Stage | What happens |
|---|---|---|
| 1 | **Ingest** | Fetches raw text from each source via type-specific adapter |
| 2 | **Extract concepts** | Claude identifies 10–25 key concepts with citations |
| 3 | **Cluster themes** | Groups concepts into thematic clusters |
| 4 | **Identify examples** | Finds examples, mistakes, metaphors per concept |
| 5 | **Build source map** | Creates concept graph across all sources |
| 6 | **Create framework** | Claude proposes a named acronym (e.g. A.G.E.N.T.) with 3–6 pillars |
| 7 | **Design outline** | One module per pillar, 2–4 lesson stubs each |
| 8 | **Generate lessons** | Full card decks per lesson (concept/metaphor/example/mistake/quiz/apply) |
| 9 | **Create artifacts** | Templates, worksheets, scorecards, specs |
| 10 | **Publish** | Microsite, PDF, Markdown, newsletter, deck, Notion export |

All LLM calls use **prompt caching** on the system message for cost efficiency.

---

## Source Adapters

```typescript
interface SourceAdapter {
  validate(url: string): Promise<ValidationResult>
  fetch(source: { url: string; name: string }): Promise<RawSource>
}
```

| Adapter | Status |
|---|---|
| `UrlAdapter` | ✅ Full — strips HTML, decodes entities, returns clean text |
| `GitHubAdapter` | ✅ Full — fetches README via GitHub API, decodes base64 |
| `YouTubeAdapter` | 🔲 Stub — validates URL, extracts video ID, awaits transcript service |
| `PdfAdapter` | 🔲 Stub — awaits file upload endpoint |
| `MarkdownAdapter` | 🔲 Planned |
| `GoogleDocAdapter` | 🔲 Planned |
| `NotionAdapter` | 🔲 Planned |

---

## Screens (14 total)

### Creator Flow

| Screen | Route | Description |
|---|---|---|
| Library | `/library` | Playbook table with search, status filters, modules/lessons counts, progress bars |
| First Run | `/library` (empty) | Onboarding with quick-start templates and how-it-works steps |
| Create Playbook | `/library/new` | Title, audience, goal, tone, output type picker |
| Add Sources | `/library/[id]/sources-add` | In-flow two-column source intake tied to a playbook |
| Source Analysis | `/library/[id]/analysis` | Live pipeline stage tracker with polling |
| Framework Builder | `/library/[id]/framework` | Inline-editable pillar cards, name cycling through alternates |
| Course Outline | `/library/[id]/outline` | Module table with drag handles, time, lessons, artifacts, status |
| Module Detail | `/library/[id]/outline/[moduleId]` | Module goal, lesson table, linked pillar, artifacts, citations |
| Lesson Player | `/library/[id]/outline/[moduleId]/lesson/[lessonId]` | 7 card types, dot navigation, quiz with check-answer feedback |
| Toolkit | `/toolkit` | Split-panel artifact viewer — list left, template detail right |
| Publish | `/library/[id]/publish` | Visibility, 7 output formats, pre-publish checklist, preview |

### Supporting Screens

| Screen | Route | Description |
|---|---|---|
| Sources Hub | `/sources` | Cross-playbook source library with search + type filters |
| Source Detail | `/sources/[id]` | Source info and extracted concepts |
| Frameworks Library | `/frameworks` | Cards showing all generated named frameworks |
| Learner Microsite | `/p/[slug]` | Public-facing page — hero, framework pillars, curriculum list |

### WorkflowBar

Appears across all creation screens as a top stepper:

```
1. New Playbook › 2. Sources › 3. Analysis › 4. Framework › 5. Outline › 6. Toolkit › 7. Publish
```

Done steps are underlined and clickable. Current step is bold. Future steps are faint.

---

## Lesson Card Types

| Type | Description |
|---|---|
| `concept` | Core idea with body text |
| `metaphor` | Analogy with image prompt placeholder |
| `example` | Real-world application |
| `mistake` | Common error to avoid |
| `quiz` | Multiple choice with check-answer feedback |
| `apply` | Reflection or action prompt |
| `source` | Citation references |

---

## Publish Outputs

| Output | Status |
|---|---|
| Public Microsite | ✅ Built (`/p/[slug]`) — hero, framework, curriculum |
| PDF Workbook | 🔲 Placeholder |
| Markdown Export | 🔲 Placeholder |
| Newsletter Sequence | 🔲 Placeholder |
| Workshop Deck | 🔲 Placeholder |
| Notion / Google Doc | 🔲 Placeholder |
| Lead Magnet Landing Page | 🔲 Placeholder |

---

## Running Locally

```bash
# Install
pnpm install

# Start dev server
pnpm --filter @playbook-os/web run dev
# → http://localhost:3000

# Typecheck all packages
pnpm typecheck
```

---

## Environment Variables

```bash
# apps/web/.env.local
ANTHROPIC_API_KEY=sk-ant-...     # Required for pipeline to run
GITHUB_TOKEN=ghp_...             # Optional — for private repo access
```

---

## Deploying to Vercel

1. Push to GitHub (`github.com/tbonepitt/playbook-os`)
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `apps/web`
4. Set **Build Command** to `cd ../.. && pnpm install && pnpm --filter @playbook-os/web build`
5. Add `ANTHROPIC_API_KEY` in Vercel Environment Variables
6. Deploy

> **Note:** The in-memory stub DB resets on each serverless cold start. Wire up Vercel Postgres or Neon before treating this as production.

---

## What's Not Built Yet

- **Auth** — no login/signup flow
- **Postgres / Prisma** — currently using an in-memory stub DB (resets on restart)
- **File upload** — PDF ingestion requires a `/api/upload` endpoint
- **Lesson editor** — player is view-only; no edit-the-cards surface
- **Real microsite hosting** — `/p/[slug]` renders a preview; subdomain deployment not wired
- **Transcript extraction** — YouTube adapter is a stub; needs a transcript API (e.g. Supadata, AssemblyAI)
- **Diff view** — no UI for regenerating a section and seeing what changed
- **Mobile lesson player** — not optimized for mobile
- **Error / retry UI** — pipeline failures surface in the stage tracker but no resume-from-step logic
- **Settings screen** — placeholder only
- **Billing / quotas** — not designed

---

## Reference Wireframe

`PlaybookOS Wireframe.html` — single-file React + Babel prototype demonstrating the full creator-to-learner flow across 14 screens. Open directly in a browser, no build step required. This is the design source of truth for layout, hierarchy, and interactions.

---

## License

Private / unpublished.
