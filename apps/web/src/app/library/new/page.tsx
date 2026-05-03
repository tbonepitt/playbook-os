'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'

const STAGE_LABELS = [
  { key: 'ingest',    label: 'Reading source'       },
  { key: 'extract',   label: 'Extracting concepts'  },
  { key: 'cluster',   label: 'Clustering themes'    },
  { key: 'framework', label: 'Building framework'   },
  { key: 'outline',   label: 'Generating outline'   },
  { key: 'lessons',   label: 'Writing lesson cards' },
]

type StageStatus = 'waiting' | 'running' | 'done' | 'error'
type Stages = Record<string, { status: StageStatus; error?: string }>

function ProgressView({ stages, error }: { stages: Stages; error: string | null }) {
  return (
    <div className="max-w-xs mx-auto mt-6 space-y-3 text-left">
      {STAGE_LABELS.map(({ key, label }) => {
        const s = stages[key] ?? { status: 'waiting' }
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-5 text-center text-base shrink-0">
              {s.status === 'done'    ? '✓' :
               s.status === 'running' ? '⟳' :
               s.status === 'error'   ? '✕' : '○'}
            </span>
            <span className={`text-sm ${
              s.status === 'done'    ? 'text-gray-900 font-medium' :
              s.status === 'running' ? 'text-blue-600 font-medium animate-pulse' :
              s.status === 'error'   ? 'text-red-600' :
              'text-gray-400'
            }`}>
              {label}
            </span>
          </div>
        )
      })}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}

export default function NewPlaybookPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [generating, setGenerating] = useState(false)
  const [stages, setStages] = useState<Stages>({})
  const [error, setError] = useState<string | null>(null)

  const isUrl = /^https?:\/\//i.test(url.trim())
  const autoTitle = isUrl
    ? url.trim().replace(/^https?:\/\/(www\.)?/i, '').split('/')[0]
    : 'My Playbook'

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setGenerating(true)
    setError(null)
    let pollInterval: ReturnType<typeof setInterval> | null = null

    try {
      // 1. Create playbook with sensible defaults
      const pbRes = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || autoTitle,
          audience: 'Professionals and practitioners',
          goal: 'Learn and apply the key concepts from this source',
          tone: 'Practical',
          outputTypes: ['public-playbook'],
        }),
      })
      if (!pbRes.ok) throw new Error('Could not create playbook')
      const playbook = await pbRes.json()

      // 2. Create + attach source
      const srcRes = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isUrl ? 'article' : 'markdown',
          url: url.trim(),
          name: title.trim() || autoTitle,
          playbookId: playbook.id,
        }),
      })
      if (!srcRes.ok) throw new Error('Could not add source')

      // 3. Start polling for progress (pipeline can take 30-90s)
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/pipeline?playbookId=${playbook.id}`)
          if (!res.ok) return
          const state = await res.json()
          setStages(state.stages ?? {})

          const allDone = STAGE_LABELS.every(({ key }) =>
            ['done', 'error'].includes(state.stages?.[key]?.status)
          )
          if (!allDone) return

          clearInterval(pollInterval!)
          const errStage = STAGE_LABELS.find(({ key }) => state.stages?.[key]?.status === 'error')
          if (errStage) {
            setError(state.stages[errStage.key]?.error ?? 'Generation failed — check your source and try again')
            setGenerating(false)
          } else {
            router.push(`/library/${playbook.id}`)
          }
        } catch {
          // ignore transient poll errors
        }
      }, 1500)

      // 4. Kick off pipeline — awaited so errors surface; polling handles live updates
      const runRes = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playbookId: playbook.id }),
      })
      clearInterval(pollInterval!)
      const result = await runRes.json()
      if (!runRes.ok) {
        throw new Error(result.error ?? 'Pipeline failed')
      }
      router.push(`/library/${playbook.id}`)

    } catch (err) {
      if (pollInterval) clearInterval(pollInterval)
      setError(err instanceof Error ? err.message : String(err))
      setGenerating(false)
    }
  }

  return (
    <div>
      <ScreenHeader
        title="New Playbook"
        subtitle="Drop in a URL or paste text — we'll handle everything else"
      />

      <div className="mx-8 max-w-xl pb-12">
        {!generating ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Source <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={"https://example.com/article\n\n— or paste raw text, a transcript, notes, or markdown"}
                  rows={5}
                  required
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={autoTitle}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!url.trim()}
              className="w-full py-3.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Generate Playbook →
            </button>

            <p className="text-xs text-center text-gray-400">
              Reads source · extracts concepts · builds framework · writes lessons · ~60 sec
            </p>
          </form>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-5">
              <span className="text-white text-xl animate-spin inline-block">⟳</span>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Building your playbook…</h2>
            <p className="text-sm text-gray-400">Takes about 30–60 seconds</p>
            <ProgressView stages={stages} error={error} />
            {error && (
              <button
                onClick={() => { setGenerating(false); setStages({}); setError(null) }}
                className="mt-6 text-sm text-gray-500 underline hover:text-gray-900"
              >
                ← Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
