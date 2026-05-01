import type { Concept } from '@playbook-os/core'
import { cachedMessages } from './client'

const MODEL = 'claude-sonnet-4-6'

/** Strip markdown code fences that Claude sometimes wraps JSON in. */
function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Extract 10–25 key concepts from raw source text.
 * Returns a `Concept[]` ready to attach to an ExtractedSource.
 */
export async function extractConcepts(
  rawText: string,
  sourceId: string,
): Promise<Concept[]> {
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

  let text = ''
  try {
    const msg = await cachedMessages.create({
      model: MODEL,
      max_tokens: 4096,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    })
    text = msg.content[0].type === 'text' ? msg.content[0].text : ''
  } catch (err) {
    throw new Error(`extractConcepts: Anthropic API call failed: ${String(err)}`)
  }

  let parsed: Array<{ label: string; citations: [] }>
  try {
    parsed = JSON.parse(stripCodeFences(text))
  } catch (err) {
    throw new Error(
      `extractConcepts: failed to parse JSON response from Claude. ` +
        `Raw response: ${text.slice(0, 300)}. Parse error: ${String(err)}`,
    )
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      `extractConcepts: expected a JSON array but got ${typeof parsed}`,
    )
  }

  return parsed.map((item) => ({
    id: newId(),
    label: item.label,
    citations: item.citations ?? [],
  }))
}
