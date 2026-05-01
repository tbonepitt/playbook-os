'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

type OutputTarget = {
  type: string
  label: string
  desc: string
  icon: string
  available: boolean
}

const OUTPUT_TARGETS: OutputTarget[] = [
  { type: 'microsite', label: 'Microsite', desc: 'Public learner-facing web page', icon: '🌐', available: true },
  { type: 'pdf', label: 'PDF Export', desc: 'Download as formatted PDF', icon: '📄', available: true },
  { type: 'markdown', label: 'Markdown', desc: 'Raw markdown files for docs/GitHub', icon: '📝', available: true },
  { type: 'newsletter', label: 'Newsletter', desc: 'Email series format', icon: '✉️', available: false },
  { type: 'deck', label: 'Slide Deck', desc: 'Presentation slides', icon: '🎞️', available: false },
  { type: 'notion', label: 'Notion Export', desc: 'Import directly to Notion', icon: '🗒️', available: false },
]

const CHECKLIST = [
  { id: 'title', label: 'Playbook has a title' },
  { id: 'modules', label: 'At least one module' },
  { id: 'lessons', label: 'Lessons have cards' },
  { id: 'framework', label: 'Framework is defined' },
]

export default function PublishPlaybookPage() {
  const { id } = useParams<{ id: string }>()
  const [selected, setSelected] = useState<Set<string>>(new Set(['microsite']))
  const [visibility, setVisibility] = useState<'private' | 'link' | 'public'>('link')
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  function toggle(type: string, available: boolean) {
    if (!available) return
    setSelected((s) => {
      const next = new Set(s)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
  }

  async function handlePublish() {
    setPublishing(true)
    await new Promise((r) => setTimeout(r, 1800))
    setPublished(true)
    setPublishing(false)
  }

  return (
    <div>
      <ScreenHeader
        title="Publish"
        subtitle="Choose your output formats and go live"
      />

      <div className="mx-8 grid grid-cols-3 gap-6 pb-12">
        <div className="col-span-2 space-y-6">
          {/* Visibility */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Visibility</h2>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'private', label: 'Private', desc: 'Only you' },
                { value: 'link', label: 'Link only', desc: 'Anyone with the link' },
                { value: 'public', label: 'Public', desc: 'Discoverable' },
              ] as const).map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setVisibility(value)}
                  className={`text-left p-4 rounded-lg border transition-colors ${
                    visibility === value ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Output formats */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Output formats</h2>
            <div className="grid grid-cols-2 gap-3">
              {OUTPUT_TARGETS.map(({ type, label, desc, icon, available }) => {
                const active = selected.has(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggle(type, available)}
                    disabled={!available}
                    className={`text-left p-4 rounded-lg border transition-colors ${
                      !available
                        ? 'border-gray-100 opacity-40 cursor-not-allowed'
                        : active
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{icon}</span>
                      <p className="font-medium text-sm text-gray-900">{label}</p>
                      {!available && (
                        <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1">soon</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </button>
                )
              })}
            </div>
          </Card>

          {published ? (
            <div className="p-5 rounded-xl bg-green-50 border border-green-200 text-center">
              <p className="text-green-800 font-semibold text-sm">Published!</p>
              <p className="text-green-600 text-xs mt-1">
                Your playbook is live at{' '}
                <span className="font-mono">playbookos.app/p/{id}</span>
              </p>
            </div>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={publishing || selected.size === 0}
              className="w-full justify-center py-3"
            >
              {publishing ? 'Publishing…' : `Publish ${selected.size} format${selected.size !== 1 ? 's' : ''}`}
            </Button>
          )}
        </div>

        {/* Checklist */}
        <div>
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Pre-publish checklist</h2>
            <ul className="space-y-3">
              {CHECKLIST.map(({ id: cid, label }) => (
                <li key={cid} className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
