import { z } from 'zod'

export const CitationSchema = z.object({
  sourceId: z.string(),
  locator: z.string(),
  quote: z.string().optional(),
})

export const ConceptSchema = z.object({
  id: z.string(),
  label: z.string(),
  citations: z.array(CitationSchema),
  themeId: z.string().optional(),
})

export const ExampleSchema = z.object({
  id: z.string(),
  conceptId: z.string(),
  body: z.string(),
})

export const ExtractedSourceSchema = z.object({
  concepts: z.array(ConceptSchema),
  examples: z.array(ExampleSchema),
  citations: z.array(CitationSchema),
})

export const SourceSchema = z.object({
  id: z.string(),
  type: z.enum(['pdf', 'github', 'youtube', 'article', 'docs', 'markdown', 'gdoc', 'notion']),
  url: z.string(),
  name: z.string(),
  size: z.string().optional(),
  status: z.enum(['pending', 'validated', 'extracted', 'error']),
  rawText: z.string().optional(),
  extracted: ExtractedSourceSchema.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const PillarSchema = z.object({
  id: z.string(),
  letter: z.string(),
  name: z.string(),
  description: z.string(),
  conceptIds: z.array(z.string()),
})

export const FrameworkSchema = z.object({
  id: z.string(),
  playbookId: z.string(),
  name: z.string(),
  pillars: z.array(PillarSchema),
  alternateNames: z.array(z.string()),
})

export const QuizOptionSchema = z.object({
  key: z.string(),
  text: z.string(),
})

export const LessonCardSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('concept'), label: z.string(), title: z.string(), body: z.string() }),
  z.object({
    type: z.literal('metaphor'),
    label: z.string(),
    title: z.string(),
    imagePrompt: z.string(),
  }),
  z.object({ type: z.literal('example'), label: z.string(), title: z.string(), body: z.string() }),
  z.object({ type: z.literal('mistake'), label: z.string(), title: z.string(), body: z.string() }),
  z.object({
    type: z.literal('quiz'),
    label: z.string(),
    title: z.string(),
    options: z.array(QuizOptionSchema),
    correctKey: z.string(),
  }),
  z.object({ type: z.literal('apply'), label: z.string(), title: z.string(), body: z.string() }),
  z.object({
    type: z.literal('source'),
    label: z.string(),
    title: z.string(),
    citationIds: z.array(z.string()),
  }),
])

export const LessonSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  cards: z.array(LessonCardSchema),
  estimatedMinutes: z.number(),
  status: z.enum(['draft', 'ready']),
})

export const ArtifactSectionSchema = z.object({
  id: z.string(),
  order: z.number(),
  label: z.string(),
  prompt: z.string(),
})

export const ArtifactSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['template', 'worksheet', 'checklist', 'rubric', 'matrix', 'scorecard', 'spec']),
  sections: z.array(ArtifactSectionSchema),
})

export const ModuleSchema = z.object({
  id: z.string(),
  order: z.number(),
  title: z.string(),
  goal: z.string(),
  pillarId: z.string().optional(),
  estimatedMinutes: z.number(),
  lessons: z.array(LessonSchema),
  artifactIds: z.array(z.string()),
  citationIds: z.array(z.string()),
  status: z.enum(['draft', 'ready', 'published']),
})

export const OutputTypeSchema = z.enum([
  'private-course',
  'public-playbook',
  'lead-magnet',
  'workshop',
  'consulting-artifact',
  'newsletter',
])

export const PublishedOutputSchema = z.object({
  type: z.enum(['microsite', 'pdf', 'markdown', 'newsletter', 'deck', 'notion', 'lead-magnet']),
  url: z.string().optional(),
  generatedAt: z.coerce.date().optional(),
})

export const PublishConfigSchema = z.object({
  visibility: z.enum(['private', 'link', 'public']),
  publicTitle: z.string(),
  tagline: z.string(),
  outputs: z.array(PublishedOutputSchema),
})

export const PlaybookSchema = z.object({
  id: z.string(),
  title: z.string(),
  audience: z.string(),
  goal: z.string(),
  tone: z.string(),
  outputTypes: z.array(OutputTypeSchema),
  sourceIds: z.array(z.string()),
  frameworkId: z.string().optional(),
  modules: z.array(ModuleSchema),
  artifacts: z.array(ArtifactSchema),
  status: z.enum(['draft', 'reviewing', 'published']),
  publishConfig: PublishConfigSchema.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export const CreatePlaybookSchema = PlaybookSchema.pick({
  title: true,
  audience: true,
  goal: true,
  tone: true,
  outputTypes: true,
})

export const CreateSourceSchema = SourceSchema.pick({
  type: true,
  url: true,
  name: true,
})
