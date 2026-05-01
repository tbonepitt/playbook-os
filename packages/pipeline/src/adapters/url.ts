import type { SourceAdapter, ValidationResult, RawSource } from './types'

function stripHtml(html: string): string {
  // Remove script and style blocks entirely
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '')
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

export const urlAdapter: SourceAdapter = {
  async validate(url: string): Promise<ValidationResult> {
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { valid: false, error: 'URL must use http or https protocol' }
      }
      return { valid: true }
    } catch {
      return { valid: false, error: 'Invalid URL format' }
    }
  },

  async fetch(source: { url: string; name: string }): Promise<RawSource> {
    let response: Response
    try {
      response = await fetch(source.url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; PlaybookOS/1.0; +https://playbookos.com/bot)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
    } catch (err) {
      throw new Error(`URL adapter: failed to fetch "${source.url}": ${String(err)}`)
    }

    if (!response.ok) {
      throw new Error(
        `URL adapter: HTTP ${response.status} ${response.statusText} for "${source.url}"`,
      )
    }

    const contentType = response.headers.get('content-type') ?? ''
    const html = await response.text()
    const text = stripHtml(html)

    return {
      text,
      metadata: {
        url: source.url,
        name: source.name,
        contentType,
        fetchedAt: new Date().toISOString(),
        charCount: String(text.length),
      },
    }
  },
}
