import type { Concept, Module, Lesson, LessonCard, QuizOption } from '@playbook-os/core'
import { generate } from './client'

function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

type RawConceptCard  = { type: 'concept';  label: string; title: string; body: string }
type RawMetaphorCard = { type: 'metaphor'; label: string; title: string; imagePrompt: string }
type RawExampleCard  = { type: 'example';  label: string; title: string; body: string }
type RawMistakeCard  = { type: 'mistake';  label: string; title: string; body: string }
type RawQuizCard     = { type: 'quiz';     label: string; title: string; options: QuizOption[]; correctKey: string }
type RawApplyCard    = { type: 'apply';    label: string; title: string; body: string }
type RawCard = RawConceptCard | RawMetaphorCard | RawExampleCard | RawMistakeCard | RawQuizCard | RawApplyCard

type RawLesson = { title: string; cards: RawCard[] }

export async function generateLessons(module: Module, concepts: Concept[]): Promise<Module> {
  const systemPrompt = `You are an instructional designer who writes engaging micro-learning lesson cards. Given a module title, its learning goal, a list of lesson titles, and a set of source concepts, you write 5–8 cards per lesson.

Card types and their required fields:
- concept   : { type, label, title, body }          — explains a core idea
- metaphor  : { type, label, title, imagePrompt }   — a vivid analogy; imagePrompt is a DALL-E style image description
- example   : { type, label, title, body }          — a real-world example
- mistake   : { type, label, title, body }          — a common error and why it happens
- quiz      : { type, label, title, options: [{key, text}], correctKey } — 3–4 multiple-choice options
- apply     : { type, label, title, body }          — a reflection prompt or action the learner takes

Return ONLY a JSON array — no prose, no markdown fences — where each element corresponds to one lesson stub (in the same order) and has this shape:
{
  "title": "Lesson title",
  "cards": [ ...5–8 card objects... ]
}

Rules:
- Each lesson must have 5–8 cards; vary the card types (no more than 2 of the same type per lesson).
- label is a short category tag shown on the card (e.g. "Core Concept", "Watch Out", "Try This").
- Every quiz must have 3–4 options and exactly one correctKey matching an option key.
- Write in second person, present tense, active voice. Be concise but substantive.
- Output valid JSON only — an array, not a wrapped object.`

  const lessonList = module.lessons.map((l, i) => `${i + 1}. ${l.title}`).join('\n')
  const conceptList = concepts.map((c) => `• ${c.label}`).join('\n')
  const userPrompt = [
    `Module: "${module.title}"`,
    `Goal: ${module.goal}`,
    '',
    'Lessons to write cards for:',
    lessonList,
    '',
    'Relevant concepts from the source material:',
    conceptList,
  ].join('\n')

  let text: string
  try {
    text = await generate(systemPrompt, userPrompt)
  } catch (err) {
    throw new Error(`generateLessons: Gemini API call failed for module "${module.title}": ${String(err)}`)
  }

  let rawLessons: RawLesson[]
  try {
    rawLessons = JSON.parse(stripCodeFences(text))
  } catch (err) {
    throw new Error(
      `generateLessons: failed to parse JSON for module "${module.title}". Raw: ${text.slice(0, 300)}. Error: ${String(err)}`,
    )
  }

  if (!Array.isArray(rawLessons)) {
    throw new Error(`generateLessons: expected JSON array but got ${typeof rawLessons}`)
  }

  const populatedLessons: Lesson[] = module.lessons.map((lesson, idx) => {
    const rawLesson = rawLessons[idx]
    if (!rawLesson) return lesson

    const cards: LessonCard[] = (rawLesson.cards ?? []).map((rawCard): LessonCard => {
      switch (rawCard.type) {
        case 'concept':  return { type: 'concept',  label: rawCard.label, title: rawCard.title, body: rawCard.body }
        case 'metaphor': return { type: 'metaphor', label: rawCard.label, title: rawCard.title, imagePrompt: rawCard.imagePrompt }
        case 'example':  return { type: 'example',  label: rawCard.label, title: rawCard.title, body: rawCard.body }
        case 'mistake':  return { type: 'mistake',  label: rawCard.label, title: rawCard.title, body: rawCard.body }
        case 'quiz':     return { type: 'quiz',     label: rawCard.label, title: rawCard.title, options: rawCard.options, correctKey: rawCard.correctKey }
        case 'apply':    return { type: 'apply',    label: rawCard.label, title: rawCard.title, body: rawCard.body }
        default:
          return { type: 'concept', label: (rawCard as RawCard).label ?? 'Note', title: (rawCard as RawCard).title ?? 'Note', body: JSON.stringify(rawCard) }
      }
    })

    return { ...lesson, title: rawLesson.title ?? lesson.title, cards, status: 'ready' as const }
  })

  return { ...module, lessons: populatedLessons }
}
