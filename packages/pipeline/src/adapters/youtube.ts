import type { SourceAdapter, ValidationResult, RawSource } from './types'

const YOUTUBE_URL_RE =
  /^https?:\/\/(www\.)?(youtube\.com\/(watch|shorts|embed|playlist)|youtu\.be\/)/

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    // youtu.be/<id>
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null
    }
    // youtube.com/watch?v=<id>
    const v = parsed.searchParams.get('v')
    if (v) return v
    // youtube.com/shorts/<id> or /embed/<id>
    const pathParts = parsed.pathname.split('/').filter((s): s is string => Boolean(s))
    const idx = pathParts.findIndex((p) => ['shorts', 'embed'].includes(p))
    if (idx !== -1 && pathParts[idx + 1]) return pathParts[idx + 1]
    return null
  } catch {
    return null
  }
}

export const youtubeAdapter: SourceAdapter = {
  async validate(url: string): Promise<ValidationResult> {
    if (!YOUTUBE_URL_RE.test(url)) {
      return {
        valid: false,
        error:
          'URL does not appear to be a YouTube video (expected youtube.com or youtu.be link)',
      }
    }
    return { valid: true }
  },

  async fetch(source: { url: string; name: string }): Promise<RawSource> {
    const videoId = extractVideoId(source.url)

    return {
      text: [
        `[YouTube transcript placeholder for "${source.name}"]`,
        '',
        'Automatic transcript extraction for YouTube videos requires a dedicated',
        'transcript service (e.g. the youtube-transcript-api or a third-party',
        'caption service) because the YouTube Data API v3 does not expose captions',
        'without OAuth and channel ownership.',
        '',
        'To integrate:',
        '  1. Call a captions/transcript microservice with the video ID below.',
        '  2. Concatenate the timed text segments into a plain string.',
        '  3. Store the result as rawText on the Source record.',
        '',
        `Video ID : ${videoId ?? '(could not be parsed)'}`,
        `Source URL: ${source.url}`,
      ].join('\n'),
      metadata: {
        url: source.url,
        name: source.name,
        type: 'youtube',
        videoId: videoId ?? '',
        status: 'placeholder',
        fetchedAt: new Date().toISOString(),
      },
    }
  },
}
