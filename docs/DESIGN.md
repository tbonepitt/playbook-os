# Design Spec

Reference: [`PlaybookOS Wireframe.html`](../PlaybookOS%20Wireframe.html)

## Visual System (current = wireframe)

The current prototype uses a deliberate low-fidelity grayscale aesthetic:
- Helvetica / system sans
- Surface `#fff`, body `#f4f4f4`, borders `#ccc`/`#999`
- Dark sidebar `#1e1e1e`
- Status chips: draft (gray), reviewing (mid-gray), published (black)
- Placeholder boxes use diagonal hatching to mark unfinished imagery
- Monospace for framework acronyms (A.G.E.N.T.)

## Hi-Fi Direction (TBD)

Open questions for hi-fi:
- Brand color direction (currently undecided — wireframe is intentionally neutral)
- Type system (display face for framework names? body font?)
- Iconography style (line / filled / custom marks)
- Density (current is comfortable; could go denser for power users)
- Motion / transitions

## Component Inventory

Pulled from the wireframe — these are the components Claude Code should build out:

### Layout
- `<AppShell>` — sidebar + main + workflow bar
- `<Sidebar>` — sectioned nav (Workspace / Build / System)
- `<WorkflowBar>` — top progress stepper across creation flow
- `<ScreenHeader>` — title + subtitle + action area
- `<Breadcrumb>`

### Data display
- `<Table>` — sortable, with status chips, progress bars, action column
- `<Card>` — generic surface
- `<StatChip>` (draft / reviewing / published)
- `<ProgressBar>`
- `<SourceIcon>` — 2-letter type badge
- `<Chip>` — selectable / passive variants

### Inputs
- `<TextField>` / `<Textarea>` / `<Select>`
- `<ChipPicker>` — multi-select chip group
- `<RadioGroup>` (chip-style)

### Domain components
- `<PillarCard>` — letter + name + desc, inline-editable
- `<LessonCard>` — typed (concept / metaphor / example / mistake / quiz / apply / source)
- `<QuizOption>` — selectable, correct/incorrect states
- `<ArtifactRow>` — list-item in toolkit
- `<ModuleRow>` — outline table row with drag handle
- `<OutputCard>` — selectable publish target tile
- `<ChecklistItem>` — pre-publish checklist
- `<StageRow>` — pipeline stage indicator (done / active / waiting)

### Special
- `<MicrositeShell>` — public-facing learner view; different visual language from creator app

## Interaction Notes

- Quiz: select → Check Answer → reveal correct + feedback line
- Pillar edit: inline form with Save/Cancel
- Framework name regenerate: cycles through alternates list
- Workflow stepper: clickable, shows done (underlined) / current (bold) / future (faint)
- Drag handles on module/lesson rows for reordering (not yet wired)

## States Still to Design

- [ ] Generation error / retry
- [ ] Mid-generation "come back later" state with ETA
- [ ] Mobile lesson player
- [ ] Lesson editor (currently jumps to player; needs an edit-the-cards surface)
- [ ] Source detail view (re-extract, view extracted text, citation list)
- [ ] Diff view when regenerating (show what changed)
- [ ] Empty states for Sources Hub, Frameworks Library
