# PlaybookOS — Micro-Learning App

Turn any source material (PDFs, GitHub repos, articles, YouTube, docs) into a structured microlearning playbook with a named framework, modules, lessons, quizzes, and publishable outputs.

## Status

**Stage:** Low-fidelity wireframe prototype, ready for hi-fi build.

The wireframe at [`PlaybookOS Wireframe.html`](./PlaybookOS%20Wireframe.html) is a single-file React + Babel prototype that demonstrates the full creator-to-learner flow across 14 screens. It is intended as a design spec, not production code.

## Wireframed Screens

### Creator flow
1. **Library** — list of all playbooks, status, progress, source chips
2. **Empty Library / First Run** — onboarding for new users with quick-start templates
3. **Create New Playbook** — title, audience, goal, tone, output type
4. **Add Sources** — in-flow source intake (PDF, GitHub, YouTube, etc.)
5. **Sources Hub** — reusable cross-playbook source library
6. **Source Analysis** — pipeline stages, extracted concepts, source map preview
7. **Framework Builder** — generated named framework (A.G.E.N.T.), editable pillars, alternates
8. **Frameworks Library** — saved named frameworks across all playbooks
9. **Course Outline Editor** — module table with drag handles, time, lessons, artifacts
10. **Module Detail** — module goal, lesson list, linked pillar, artifacts, citations
11. **Micro Lesson Player** — 8-card lesson with concept / metaphor / example / mistake / quiz / apply / source
12. **Toolkit / Artifacts** — split-panel artifact viewer (e.g. Agentic System Design Spec)
13. **Publish / Export** — visibility, output types (microsite / PDF / markdown / etc.), pre-publish checklist
14. **Learner Microsite** — public-facing view of a published playbook

### Working interactions
- Quiz answer → check → correct/wrong feedback (Lesson Player, card 6)
- Inline edit pillar names + descriptions (Framework Builder)
- Regenerate framework name from alternates (Framework Builder)
- Notes + Sources drawers (Lesson Player)
- Workflow breadcrumb stepper across the top
- Sidebar nav between sections

## Architecture (proposed for production build)

```
playbook-os/
├── apps/
│   ├── web/              # Next.js creator app (this wireframe → real)
│   └── microsite/        # Static published playbook microsites
├── packages/
│   ├── ui/               # Shared component library
│   ├── core/             # Domain models: Playbook, Framework, Module, Lesson
│   ├── pipeline/         # Source ingestion + analysis pipeline
│   └── generators/       # Framework, outline, lesson, artifact generators
├── docs/
│   ├── DESIGN.md         # Design system + component spec
│   ├── PIPELINE.md       # Generation pipeline architecture
│   └── DATA_MODEL.md     # Domain model spec
└── PlaybookOS Wireframe.html   # Reference wireframe
```

## Domain Model (sketch)

- **Source** — PDF, GitHub repo, URL, etc. Reusable across playbooks.
- **Playbook** — top-level container; has sources, framework, modules, artifacts, publish config.
- **Framework** — named acronym (e.g. A.G.E.N.T.) with N pillars; serves as course spine.
- **Pillar** — letter, name, description; maps to one or more modules.
- **Module** — has goal, lessons, artifacts, source citations; linked to a pillar.
- **Lesson** — sequence of cards (concept, metaphor, example, mistake, quiz, apply, source).
- **Artifact** — template / worksheet / spec generated alongside lessons.
- **Publish target** — microsite, PDF, markdown, newsletter, deck, lead magnet.

## Generation Pipeline (sketch)

1. Ingest sources → text extraction
2. Extract concepts (LLM)
3. Cluster themes
4. Identify examples / mistakes / metaphors per concept
5. Build source map
6. Propose framework (named acronym + pillars)
7. Design course outline (modules → lessons)
8. Generate lesson cards
9. Generate artifacts / templates
10. Prepare publishable outputs

## Next Steps for Claude Code

- [ ] Bootstrap monorepo (pnpm + turbo or similar)
- [ ] Stand up Next.js creator app with sidebar shell
- [ ] Implement domain models in `packages/core`
- [ ] Port wireframe screens to real components in `apps/web`
- [ ] Build source ingestion adapters (PDF, GitHub, YouTube, URL)
- [ ] Wire up generation pipeline against Claude API
- [ ] Implement publish targets (microsite first)
- [ ] Add auth, persistence (Postgres + Prisma suggested)

See `docs/DESIGN.md` and `docs/PIPELINE.md` for more detail.

## Running the Wireframe

Open `PlaybookOS Wireframe.html` directly in a browser. No build step required — it uses CDN React + Babel standalone.

## License

Private / unpublished.
