import type { ExtractedSource } from '@playbook-os/core'

export type ValidationResult = { valid: boolean; error?: string }
export type RawSource = { text: string; metadata: Record<string, string> }

export interface SourceAdapter {
  validate(url: string): Promise<ValidationResult>
  fetch(source: { url: string; name: string }): Promise<RawSource>
}
