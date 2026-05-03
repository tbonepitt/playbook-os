import { GoogleGenerativeAI } from '@google/generative-ai'

// Typed access to Node/edge-runtime env without requiring @types/node
declare const process: { env: Record<string, string | undefined> }

const MODEL = 'gemini-1.5-flash'

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set')
  return new GoogleGenerativeAI(apiKey)
}

/**
 * Call Gemini with a system prompt and user message.
 * Returns the raw text response.
 */
export async function generate(systemPrompt: string, userPrompt: string): Promise<string> {
  const genAI = getClient()
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
  })
  const result = await model.generateContent(userPrompt)
  return result.response.text()
}
