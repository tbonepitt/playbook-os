'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import type { Source } from '@playbook-os/core'

export const dynamic = 'force-dynamic'

const SOURCE_TYPES: { value: Source['type']; label: string; placeholder: string }[] = [
  { value: 'markdown', label: 'Raw Text / Markdown', placeholder: 'Paste source material, transcript, notes, or markdown here' },
  { value: 'article', label: 'URL / Article', placeholder: 'https://example.com/article' },
  { value: 'github', label: 'GitHub Repo', placeholder: 'https://github.com/owner/repo' },
  { value: 'pdf', label: 'PDF URL', placeholder: 'https://example.com/document.pdf' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/watch?v=...' },
]

function NewSourceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const playbookId = searchParams.get('playbookId')
  const [saving, setSaving] = useState(false)
  const [type, setType] = useState<Source['type']>('markdown')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const selectedType = SOURCE_TYPES.find((t) => t.value === type)!
  const inputLabel = type === 'markdown' ? 'Source text' : 'URL'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url, name: name || (type === 'markdown' ? 'Pasted source' : url), playbookId }),
      })
      if (!res.ok) {
        setError('Could not save source. Check the input and try again.')
        return
      }
      const src = await res.json()
      router.push(playbookId ? `/library/${playbookId}` : `/sources/${src.id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <ScreenHeader title="Add Source" subtitle={playbookId ? 'Attach source material to this playbook' : 'Add a source to your library'} />

      <form onSubmit={handleSubmit} className="mx-8 max-w-2xl space-y-6 pb-12">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Source type</p>
          <div className="grid grid-cols-2 gap-2">
            {SOURCE_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setType(value)}
                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                  type === value
                    ? 'border-gray-900 bg-gray-900 text-white font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <Input
            id="name"
            label="Name"
            placeholder="Human-readable name for this source"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {type === 'markdown' ? (
            <Textarea
              id="url"
              label={inputLabel}
              placeholder={selectedType.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              rows={12}
              required
            />
          ) : (
            <Input
              id="url"
              label={inputLabel}
              placeholder={selectedType.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving || !url.trim()}>
            {saving ? 'Adding…' : playbookId ? 'Add to Playbook' : 'Add Source'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}


export default function NewSourcePage() {
  return (
    <Suspense fallback={<div className="mx-8 mt-8 text-sm text-gray-400">Loading source form…</div>}>
      <NewSourceForm />
    </Suspense>
  )
}
