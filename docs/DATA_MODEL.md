# Data Model

Domain types lifted from the wireframe. Fill in fields as production needs.

## Entities

```ts
type ID = string;

type Source = {
  id: ID;
  type: 'pdf' | 'github' | 'youtube' | 'article' | 'docs' | 'markdown' | 'gdoc' | 'notion';
  url: string;
  name: string;
  size?: string;            // "48 pages", "12 min", etc
  status: 'pending' | 'validated' | 'extracted' | 'error';
  rawText?: string;
  extracted?: ExtractedSource;
  createdAt: Date;
  updatedAt: Date;
};

type ExtractedSource = {
  concepts: Concept[];
  examples: Example[];
  citations: Citation[];
};

type Concept = {
  id: ID;
  label: string;
  citations: Citation[];
  themeId?: ID;
};

type Citation = {
  sourceId: ID;
  locator: string;          // "p.34–41" or "section 2"
  quote?: string;
};

type Theme = {
  id: ID;
  label: string;
  conceptIds: ID[];
};

type Framework = {
  id: ID;
  playbookId: ID;
  name: string;             // "A.G.E.N.T."
  pillars: Pillar[];
  alternateNames: string[];
};

type Pillar = {
  id: ID;
  letter: string;
  name: string;
  description: string;
  conceptIds: ID[];
};

type Playbook = {
  id: ID;
  title: string;
  audience: string;
  goal: string;
  tone: string;
  outputTypes: OutputType[];
  sourceIds: ID[];
  frameworkId?: ID;
  modules: Module[];
  artifacts: Artifact[];
  status: 'draft' | 'reviewing' | 'published';
  publishConfig?: PublishConfig;
  createdAt: Date;
  updatedAt: Date;
};

type Module = {
  id: ID;
  order: number;
  title: string;
  goal: string;
  pillarId?: ID;
  estimatedMinutes: number;
  lessons: Lesson[];
  artifactIds: ID[];
  citationIds: ID[];
  status: 'draft' | 'ready' | 'published';
};

type Lesson = {
  id: ID;
  order: number;
  title: string;
  cards: LessonCard[];
  estimatedMinutes: number;
  status: 'draft' | 'ready';
};

type LessonCard =
  | { type: 'concept';   label: string; title: string; body: string; }
  | { type: 'metaphor';  label: string; title: string; imagePrompt: string; }
  | { type: 'example';   label: string; title: string; body: string; }
  | { type: 'mistake';   label: string; title: string; body: string; }
  | { type: 'quiz';      label: string; title: string; options: QuizOption[]; correctKey: string; }
  | { type: 'apply';     label: string; title: string; body: string; }
  | { type: 'source';    label: string; title: string; citationIds: ID[]; };

type QuizOption = { key: string; text: string; };

type Artifact = {
  id: ID;
  name: string;
  type: 'template' | 'worksheet' | 'checklist' | 'rubric' | 'matrix' | 'scorecard' | 'spec';
  sections: ArtifactSection[];
};

type ArtifactSection = {
  id: ID;
  order: number;
  label: string;
  prompt: string;           // instruction for the user filling it in
};

type OutputType =
  | 'private-course' | 'public-playbook' | 'lead-magnet'
  | 'workshop' | 'consulting-artifact' | 'newsletter';

type PublishConfig = {
  visibility: 'private' | 'link' | 'public';
  publicTitle: string;
  tagline: string;
  outputs: PublishedOutput[];
};

type PublishedOutput = {
  type: 'microsite' | 'pdf' | 'markdown' | 'newsletter' | 'deck' | 'notion' | 'lead-magnet';
  url?: string;
  generatedAt?: Date;
};
```

## Indices / queries

- Library list: `Playbook by user, ordered by updatedAt desc`
- Sources hub: `Source by user, with `playbookCount` aggregate`
- Frameworks library: `Framework by user, joined to playbook for context`

## Suggested storage

- Postgres + Prisma for relational data
- Object storage (S3/R2) for raw source files + extracted text
- Vector store (pgvector or similar) for concept embeddings if doing semantic clustering / search later
