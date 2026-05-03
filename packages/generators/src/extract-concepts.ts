import type { Concept } from '@playbook-os/core'
import { generate } from './client'

function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export async function extractConcepts(rawText: string, sourceId: string): Promise<Concept[]> {
  const systemPrompt = `You are a knowledge-extraction specialist. Your job is to read a source text and identify the 10–25 most important, distinct, and teachable concepts it contains.

Return ONLY a JSON array — no prose, no markdown fences — where each element has this shape:
{
  "label": "short concept name (3–7 words)",
  "citations": []
}

Rules:
- Extract between 10 and 25 concepts. Prefer quality over quantity.
- Each label must be unique and self-explanatory out of context.
- Focus on actionable, learnable ideas rather than vague themes.
- Do not include author names, book titles, or publication metadata as concepts.
- Output valid JSON only.`

  const userPrompt = `Extract the key concepts from this source text (sourceId: ${sourceId}):\n\n${rawText}`

  let text: string
  try {
    text = await generate(systemPrompt, userPrompt)
  } catch (err) {
    throw new Error(`extractConcepts: Gemini API call failed: ${String(err)}`)
  }

  let parsed: Array<{ label: string; citations: [] }>
  try {
    parsed = JSON.parse(stripCodeFences(text))
  } catch (err) {
    throw new Error(
      `extractConcepts: failed to parse JSON response. Raw: ${text.slice(0, 300)}. Error: ${String(err)}`,
    )
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`extractConcepts: expected JSON array but got ${typeof parsed}`)
  }

  return parsed.map((item) => ({
    id: newId(),
    label: item.label,
    citations: item.citations ?? [],
  }))
}
