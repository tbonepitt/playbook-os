import type { SourceAdapter, ValidationResult, RawSource } from './types'

// Typed access to Node/edge-runtime env without requiring @types/node
declare const process: { env: Record<string, string | undefined> }

const GITHUB_URL_RE = /^https?:\/\/(www\.)?github\.com\/([^/]+)\/([^/]+)/

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = GITHUB_URL_RE.exec(url)
  if (!match) return null
  return { owner: match[2], repo: match[3].replace(/\.git$/, '') }
}

export const githubAdapter: SourceAdapter = {
  async validate(url: string): Promise<ValidationResult> {
    if (!parseGitHubUrl(url)) {
      return {
        valid: false,
        error: 'URL does not appear to be a GitHub repository (expected https://github.com/owner/repo)',
      }
    }
    return { valid: true }
  },

  async fetch(source: { url: string; name: string }): Promise<RawSource> {
    const parsed = parseGitHubUrl(source.url)
    if (!parsed) {
      throw new Error(`GitHub adapter: cannot parse owner/repo from URL "${source.url}"`)
    }

    const { owner, repo } = parsed
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`

    let response: Response
    try {
      response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'PlaybookOS/1.0',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      })
    } catch (err) {
      throw new Error(
        `GitHub adapter: network error fetching readme for "${owner}/${repo}": ${String(err)}`,
      )
    }

    if (response.status === 404) {
      throw new Error(
        `GitHub adapter: no README found for "${owner}/${repo}". ` +
          'The repository may be private, empty, or have no README file.',
      )
    }

    if (!response.ok) {
      throw new Error(
        `GitHub adapter: GitHub API returned HTTP ${response.status} ${response.statusText} ` +
          `for "${owner}/${repo}"`,
      )
    }

    let data: { content?: string; name?: string; encoding?: string; html_url?: string }
    try {
      data = await response.json()
    } catch (err) {
      throw new Error(
        `GitHub adapter: failed to parse GitHub API JSON response for "${owner}/${repo}": ${String(err)}`,
      )
    }

    if (!data.content) {
      throw new Error(
        `GitHub adapter: GitHub API response for "${owner}/${repo}" contained no content field`,
      )
    }

    // GitHub returns base64-encoded content, potentially with line breaks.
    // atob() is available in Node 16+, browsers, and edge runtimes.
    const rawBase64 = data.content.replace(/\n/g, '')
    const text = decodeURIComponent(
      atob(rawBase64)
        .split('')
        .map((ch) => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )

    return {
      text,
      metadata: {
        url: source.url,
        name: source.name,
        owner,
        repo,
        readmeFile: data.name ?? 'README.md',
        readmeUrl: data.html_url ?? '',
        fetchedAt: new Date().toISOString(),
        charCount: String(text.length),
      },
    }
  },
}
