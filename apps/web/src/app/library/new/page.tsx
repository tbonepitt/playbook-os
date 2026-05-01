'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import type { OutputType } from '@playbook-os/core'

const OUTPUT_OPTIONS: { value: OutputType; label: string; desc: string }[] = [
  { value: 'private-course', label: 'Private Course', desc: 'Internal team training' },
  { value: 'public-playbook', label: 'Public Playbook', desc: 'Share with your audience' },
  { value: 'lead-magnet', label: 'Lead Magnet', desc: 'Gated content for lead gen' },
  { value: 'workshop', label: 'Workshop', desc: 'Live facilitation materials' },
  { value: 'consulting-artifact', label: 'Consulting Artifact', desc: 'Client deliverables' },
  { value: 'newsletter', label: 'Newsletter', desc: 'Email series or digest' },
]

const TONE_OPTIONS = ['Practical', 'Energetic', 'Executive', 'Academic', 'Conversational']

export default function NewPlaybookPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    audience: '',
    goal: '',
    tone: 'Practical',
    outputTypes: ['private-course'] as OutputType[],
  })

  function toggleOutput(v: OutputType) {
    setForm((f) => ({
      ...f,
      outputTypes: f.outputTypes.includes(v) ? f.outputTypes.filter((x) => x !== v) : [...f.outputTypes, v],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const pb = await res.json()
        router.push(`/library/${pb.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <ScreenHeader title="Create New Playbook" subtitle="Define your playbook's purpose and audience" />

      <form onSubmit={handleSubmit} className="mx-8 max-w-2xl space-y-6 pb-12">
        <Card className="p-6 space-y-5">
          <Input
            id="title"
            label="Playbook title"
            placeholder="e.g. Agentic AI Systems Playbook"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <Input
            id="audience"
            label="Target audience"
            placeholder="e.g. Product managers & engineers"
            value={form.audience}
            onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
          />
          <Textarea
            id="goal"
            label="Learning goal"
            placeholder="What should learners be able to do after completing this playbook?"
            rows={3}
            value={form.goal}
            onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
          />
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Tone</p>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, tone: t }))}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  form.tone === t
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Output types</p>
          <div className="grid grid-cols-2 gap-3">
            {OUTPUT_OPTIONS.map(({ value, label, desc }) => {
              const active = form.outputTypes.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleOutput(value)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                    active ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <p className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-700'}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving || !form.title.trim()}>
            {saving ? 'Creating…' : 'Create Playbook →'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
