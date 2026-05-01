# Generation Pipeline

The 10-stage pipeline that turns sources into a publishable playbook.

## Stages

| # | Stage | Inputs | Outputs | Notes |
|---|-------|--------|---------|-------|
| 1 | Ingest source | Source URL/file | Raw text + metadata | Type-specific adapter (PDF, GitHub, YouTube transcript, URL scraper, Markdown) |
| 2 | Extract concepts | Raw text | List of concepts with citations | LLM call; aim for 10–25 concepts |
| 3 | Cluster themes | Concepts | Theme groups | Semantic clustering |
| 4 | Identify examples | Concepts + raw text | Examples, mistakes, metaphors per concept | Used later in lesson cards |
| 5 | Build source map | All extracted artifacts | Concept graph (nodes + edges + citations) | Drives the source map preview UI |
| 6 | Create framework | Theme groups + concepts | Named acronym + N pillars (3–6) | Multi-shot LLM call; offer alternates |
| 7 | Design course outline | Framework + concepts | Modules with goals, est. time, artifact slots | Map pillars → modules |
| 8 | Generate lessons | Module + concepts + examples | Lesson cards (concept / metaphor / example / mistake / quiz / apply / source) | One pass per lesson |
| 9 | Create templates | Modules + framework | Artifacts (templates, worksheets, scorecards) | Domain-specific |
| 10 | Prepare publishable playbook | Everything | Compiled microsite, PDF, markdown export | Static generation |

## Source Adapters

Each source type needs an adapter implementing:

```ts
interface SourceAdapter {
  validate(url: string): Promise<ValidationResult>;
  fetch(url: string): Promise<RawSource>;
  extract(raw: RawSource): Promise<ExtractedSource>;
}
```

Required adapters:
- `PdfAdapter`
- `GitHubAdapter` (repo → README + key markdown + code structure)
- `YouTubeAdapter` (transcript)
- `UrlAdapter` (article scraper)
- `MarkdownFolderAdapter`
- `GoogleDocAdapter`
- `NotionAdapter`

## LLM Prompts

Each stage that calls an LLM should live in `packages/generators/<stage>/prompt.ts` with:
- System prompt (role + style guide)
- User prompt template
- Output schema (Zod)
- Retry / repair logic
- Eval cases

## Caching

- Stage outputs are cacheable by `(source_id, stage_version)`.
- Re-running a later stage should not re-run earlier stages unless the source or stage version changed.
- Show stage status in the UI (Source Analysis screen).

## Errors

The wireframe does not yet show an error state. Production needs:
- Per-stage error capture
- "Resume from stage N" UI
- Clear messaging for partial failures (e.g. "monitoring concept has low coverage")
