import type { Concept, Framework, Module, Lesson } from '@playbook-os/core'
import { generate } from './client'

function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

type RawLesson = { title: string; estimatedMinutes?: number }
type RawModule = { title: string; goal: string; estimatedMinutes: number; lessons: RawLesson[] }

export async function generateOutline(framework: Framework, concepts: Concept[]): Promise<Module[]> {
  const systemPrompt = `You are a curriculum architect. Given a framework with named pillars and a list of source concepts, you design a complete course outline.

Produce one module per pillar. Each module should have 2–4 lesson stubs — enough to fully cover the pillar without padding.

Return ONLY a JSON array — no prose, no markdown fences — where each element has this shape:
{
  "title": "Module title (mirrors the pillar name)",
  "goal": "One-sentence learning goal for this module",
  "estimatedMinutes": 20,
  "lessons": [
    { "title": "Lesson title", "estimatedMinutes": 5 }
  ]
}

Rules:
- Each module maps to exactly one pillar (same order as pillars in input).
- 2–4 lessons per module. Lessons should be focused and completable in 3–8 minutes each.
- estimatedMinutes for the module should equal the sum of its lessons' estimatedMinutes.
- Output valid JSON only — an array, not a wrapped object.`

  const pillarList = framework.pillars.map((p) => `${p.letter} — ${p.name}: ${p.description}`).join('\n')
  const conceptList = concepts.map((c) => `• ${c.label}`).join('\n')
  const userPrompt = `Generate a course outline for the "${framework.name}" framework.\n\nPillars:\n${pillarList}\n\nSource concepts to cover:\n${conceptList}`

  let text: string
  try {
    text = await generate(systemPrompt, userPrompt)
  } catch (err) {
    throw new Error(`generateOutline: Gemini API call failed: ${String(err)}`)
  }

  let rawModules: RawModule[]
  try {
    rawModules = JSON.parse(stripCodeFences(text))
  } catch (err) {
    throw new Error(
      `generateOutline: failed to parse JSON response. Raw: ${text.slice(0, 300)}. Error: ${String(err)}`,
    )
  }

  if (!Array.isArray(rawModules)) {
    throw new Error(`generateOutline: expected JSON array but got ${typeof rawModules}`)
  }

  return rawModules.map((rawMod, modIdx) => {
    const pillar = framework.pillars[modIdx]
    const lessons: Lesson[] = (rawMod.lessons ?? []).map((rawLesson, lessonIdx) => ({
      id: newId(),
      order: lessonIdx + 1,
      title: rawLesson.title,
      cards: [],
      estimatedMinutes: rawLesson.estimatedMinutes ?? 5,
      status: 'draft' as const,
    }))

    return {
      id: newId(),
      order: modIdx + 1,
      title: rawMod.title,
      goal: rawMod.goal,
      pillarId: pillar?.id,
      estimatedMinutes: rawMod.estimatedMinutes,
      lessons,
      artifactIds: [],
      citationIds: [],
      status: 'draft' as const,
    } satisfies Module
  })
}
