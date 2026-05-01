import Anthropic from '@anthropic-ai/sdk'

// Typed access to Node/edge-runtime env without requiring @types/node
declare const process: { env: Record<string, string | undefined> }

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * Convenience wrapper: call the prompt-caching beta endpoint.
 * In SDK v0.32 this lives at anthropic.beta.promptCaching.messages.create().
 */
export const cachedMessages = anthropic.beta.promptCaching.messages
