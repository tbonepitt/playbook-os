import { GoogleGenAI } from '@google/genai'

// Typed access to Node/edge-runtime env without requiring @types/node
declare const process: { env: Record<string, string | undefined> }

// Model priority list — first available wins (flash/lite only, no pro)
const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-latest',
]

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set')
  return new GoogleGenAI({ apiKey })
}

/**
 * Call Gemini with a system prompt and user message.
 * Tries models in priority order, falling back on 404/model errors.
 */
export async function generate(systemPrompt: string, userPrompt: string): Promise<string> {
  const ai = getClient()
  let lastError: unknown

  for (const model of MODELS) {
    try {
      const result = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: { systemInstruction: systemPrompt },
      })
      const text = result.text ?? ''
      if (text) return text
    } catch (err) {
      const msg = String(err)
      // Only fall through on model-not-found errors
      if (msg.includes('404') || msg.includes('not found') || msg.includes('not supported') || msg.includes('no longer available')) {
        lastError = err
        continue
      }
      throw err
    }
  }

  throw new Error(`All Gemini models failed. Last error: ${String(lastError)}`)
}
