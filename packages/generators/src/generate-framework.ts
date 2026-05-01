import type { Concept, Framework, Pillar } from '@playbook-os/core'
import { cachedMessages } from './client'

const MODEL = 'claude-sonnet-4-6'

function stripCodeFences(raw: string): string {
  return raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

type RawFramework = {
  name: string
  pillars: Array<{ letter: string; name: string; description: string }>
  alternateNames: string[]
}

/**
 * Generate a named acronym framework from a list of concepts.
 * Returns a `Framework` ready to attach to a Playbook.
 */
export async function generateFramework(
  concepts: Concept[],
  playbookId: string,
): Promise<Framework> {
  const systemPrompt = `You are a curriculum-design expert who specialises in creating memorable teaching frameworks. Given a list of key concepts, you create a concise acronym framework (3–6 pillars) that organises those concepts into a coherent, teachable structure.

Return ONLY a JSON object — no prose, no markdown fences — with this shape:
{
  "name": "ACRONYM (full expanded name)",
  "pillars": [
    { "letter": "A", "name": "Pillar Name", "description": "1–2 sentence description of what this pillar covers" }
  ],
  "alternateNames": ["Alternative Framework Name 1", "Alternative Framework Name 2"]
}

Rules:
- The acronym must be 3–6 letters.
- Each letter maps to exactly one pillar.
- The acronym should be a real word or pronounceable abbreviation — memorable matters.
- Pillar names should be action-oriented or noun phrases (not single letters).
- Provide 2–3 alternate framework names in alternateNames.
- Output valid JSON only.`

  const conceptList = concepts.map((c) => `• ${c.label}`).join('\n')
  const userPrompt = `Create an acronym framework for a playbook (playbookId: ${playbookId}) based on these concepts:\n\n${conceptList}`

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
    throw new Error(`generateFramework: Anthropic API call failed: ${String(err)}`)
  }

  let raw: RawFramework
  try {
    raw = JSON.parse(stripCodeFences(text))
  } catch (err) {
    throw new Error(
      `generateFramework: failed to parse JSON response from Claude. ` +
        `Raw response: ${text.slice(0, 300)}. Parse error: ${String(err)}`,
    )
  }

  const pillars: Pillar[] = raw.pillars.map((p) => ({
    id: newId(),
    letter: p.letter,
    name: p.name,
    description: p.description,
    conceptIds: [],
  }))

  const framework: Framework = {
    id: newId(),
    playbookId,
    name: raw.name,
    pillars,
    alternateNames: raw.alternateNames ?? [],
  }

  return framework
}
