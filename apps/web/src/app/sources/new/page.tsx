'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { Source } from '@playbook-os/core'

const SOURCE_TYPES: { value: Source['type']; label: string; placeholder: string }[] = [
  { value: 'article', label: 'URL / Article', placeholder: 'https://example.com/article' },
  { value: 'github', label: 'GitHub Repo', placeholder: 'https://github.com/owner/repo' },
  { value: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/watch?v=...' },
  { value: 'pdf', label: 'PDF', placeholder: 'Upload or paste a URL to a PDF' },
  { value: 'notion', label: 'Notion', placeholder: 'https://notion.so/...' },
  { value: 'gdoc', label: 'Google Doc', placeholder: 'https://docs.google.com/...' },
  { value: 'markdown', label: 'Markdown', placeholder: 'https://raw.githubusercontent.com/...' },
]

export default function NewSourcePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [type, setType] = useState<Source['type']>('article')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')

  const selectedType = SOURCE_TYPES.find((t) => t.value === type)!

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, url, name: name || url }),
      })
      if (res.ok) {
        const src = await res.json()
        router.push(`/sources/${src.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <ScreenHeader title="Add Source" subtitle="Add a source to your library for use in any playbook" />

      <form onSubmit={handleSubmit} className="mx-8 max-w-xl space-y-6 pb-12">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Source type</p>
          <div className="grid grid-cols-4 gap-2">
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
            id="url"
            label="URL"
            placeholder={selectedType.placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Input
            id="name"
            label="Name (optional)"
            placeholder="Human-readable name for this source"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving || !url.trim()}>
            {saving ? 'Adding…' : 'Add Source'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
