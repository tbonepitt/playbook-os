'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { db } from '@/lib/stub-db'
import type { Source } from '@playbook-os/core'

const SOURCE_TYPES: Source['type'][] = ['pdf', 'github', 'docs', 'youtube', 'article', 'markdown', 'gdoc']
const TYPE_LABELS: Record<Source['type'], string> = {
  pdf: 'PDF', github: 'GitHub', youtube: 'YouTube', article: 'Article',
  docs: 'Docs site', markdown: 'Markdown', gdoc: 'Google Doc / Notion', notion: 'Notion',
}
const TYPE_PLACEHOLDERS: Partial<Record<Source['type'], string>> = {
  pdf: 'https:// or drag & drop',
  github: 'github.com/owner/repo',
  youtube: 'youtube.com/watch?v=…',
  docs: 'https://docs.example.com',
  article: 'https://example.com/article',
  markdown: 'https://raw.githubusercontent.com/…',
  gdoc: 'https://docs.google.com/…',
}

export default function AddSourcesPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const playbook = db.playbooks.get(id)

  const [type, setType] = useState<Source['type']>('pdf')
  const [url, setUrl] = useState('')
  const [adding, setAdding] = useState(false)

  const attachedSources = (playbook?.sourceIds ?? [])
    .map((sid) => db.sources.get(sid))
    .filter(Boolean) as Source[]

  async function handleAdd() {
    if (!url.trim()) return
    setAdding(true)
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url, name: url }),
      })
      if (res.ok) {
        const src = await res.json()
        await fetch(`/api/playbooks/${id}/sources`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId: src.id }),
        })
        setUrl('')
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <ScreenHeader
        title="Add Sources"
        subtitle={playbook?.title ?? 'Playbook'}
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push(`/library/${id}`)}>
              ← Back
            </Button>
            <Button size="sm" onClick={() => router.push(`/library/${id}/analysis`)}>
              Continue to Analysis →
            </Button>
          </div>
        }
      />

      <div className="mx-8 pb-12">
        <div className="grid grid-cols-2 gap-6 items-start">
          {/* Add form */}
          <Card className="p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Source Type</p>
              <div className="flex flex-wrap gap-2">
                {SOURCE_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                      type === t
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-500'
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL or File Path</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={TYPE_PLACEHOLDERS[type] ?? 'https://'}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button variant="secondary" size="sm">Browse</Button>
              </div>
            </div>

            <Button
              onClick={handleAdd}
              disabled={adding || !url.trim()}
              className="w-full justify-center"
            >
              {adding ? 'Adding…' : '+ Add Source'}
            </Button>

            <p className="text-xs text-gray-400">
              Supported: PDF, GitHub repo, docs site, YouTube, article, Markdown folder, Notion / Google Doc export
            </p>
          </Card>

          {/* Added sources list */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Added Sources ({attachedSources.length})
            </p>
            {attachedSources.length === 0 ? (
              <Card className="p-6 text-center text-sm text-gray-400">
                No sources added yet.
              </Card>
            ) : (
              <div className="space-y-2">
                {attachedSources.map((src) => (
                  <Card key={src.id} className="p-3 flex items-center gap-3">
                    <span className="w-8 h-8 rounded bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center shrink-0 uppercase">
                      {src.type.slice(0, 2)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{src.name}</p>
                      <p className="text-xs text-gray-400 truncate">{src.url}</p>
                    </div>
                    <Badge status={src.status} />
                  </Card>
                ))}
                <button className="text-xs text-gray-400 hover:text-gray-700 mt-1">
                  Validate all sources
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
