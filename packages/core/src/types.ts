export type ID = string

export type Source = {
  id: ID
  type: 'pdf' | 'github' | 'youtube' | 'article' | 'docs' | 'markdown' | 'gdoc' | 'notion'
  url: string
  name: string
  size?: string
  status: 'pending' | 'validated' | 'extracted' | 'error'
  rawText?: string
  extracted?: ExtractedSource
  createdAt: Date
  updatedAt: Date
}

export type ExtractedSource = {
  concepts: Concept[]
  examples: Example[]
  citations: Citation[]
}

export type Concept = {
  id: ID
  label: string
  citations: Citation[]
  themeId?: ID
}

export type Example = {
  id: ID
  conceptId: ID
  body: string
}

export type Citation = {
  sourceId: ID
  locator: string
  quote?: string
}

export type Theme = {
  id: ID
  label: string
  conceptIds: ID[]
}

export type Framework = {
  id: ID
  playbookId: ID
  name: string
  pillars: Pillar[]
  alternateNames: string[]
}

export type Pillar = {
  id: ID
  letter: string
  name: string
  description: string
  conceptIds: ID[]
}

export type Playbook = {
  id: ID
  title: string
  audience: string
  goal: string
  tone: string
  outputTypes: OutputType[]
  sourceIds: ID[]
  frameworkId?: ID
  modules: Module[]
  artifacts: Artifact[]
  status: 'draft' | 'reviewing' | 'published'
  publishConfig?: PublishConfig
  createdAt: Date
  updatedAt: Date
}

export type Module = {
  id: ID
  order: number
  title: string
  goal: string
  pillarId?: ID
  estimatedMinutes: number
  lessons: Lesson[]
  artifactIds: ID[]
  citationIds: ID[]
  status: 'draft' | 'ready' | 'published'
}

export type Lesson = {
  id: ID
  order: number
  title: string
  cards: LessonCard[]
  estimatedMinutes: number
  status: 'draft' | 'ready'
}

export type LessonCard =
  | { type: 'concept'; label: string; title: string; body: string }
  | { type: 'metaphor'; label: string; title: string; imagePrompt: string }
  | { type: 'example'; label: string; title: string; body: string }
  | { type: 'mistake'; label: string; title: string; body: string }
  | { type: 'quiz'; label: string; title: string; options: QuizOption[]; correctKey: string }
  | { type: 'apply'; label: string; title: string; body: string }
  | { type: 'source'; label: string; title: string; citationIds: ID[] }

export type QuizOption = { key: string; text: string }

export type Artifact = {
  id: ID
  name: string
  type: 'template' | 'worksheet' | 'checklist' | 'rubric' | 'matrix' | 'scorecard' | 'spec'
  sections: ArtifactSection[]
}

export type ArtifactSection = {
  id: ID
  order: number
  label: string
  prompt: string
}

export type OutputType =
  | 'private-course'
  | 'public-playbook'
  | 'lead-magnet'
  | 'workshop'
  | 'consulting-artifact'
  | 'newsletter'

export type PublishConfig = {
  visibility: 'private' | 'link' | 'public'
  publicTitle: string
  tagline: string
  outputs: PublishedOutput[]
}

export type PublishedOutput = {
  type: 'microsite' | 'pdf' | 'markdown' | 'newsletter' | 'deck' | 'notion' | 'lead-magnet'
  url?: string
  generatedAt?: Date
}
