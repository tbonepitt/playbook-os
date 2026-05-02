'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const OUTPUTS = [
  { id: 'microsite', label: 'Public Microsite', sub: 'Hosted on Vercel or custom domain' },
  { id: 'pdf', label: 'PDF Workbook', sub: 'Print-ready formatted export' },
  { id: 'markdown', label: 'Markdown Export', sub: 'Folder of .md files + assets' },
  { id: 'newsletter', label: 'Newsletter Sequence', sub: '7-part email drip' },
  { id: 'deck', label: 'Workshop Deck', sub: 'Slide deck for live delivery' },
  { id: 'notion', label: 'Notion / Google Doc Export', sub: 'Editable document export' },
  { id: 'leadmag', label: 'Lead Magnet Landing Page', sub: 'Single-page conversion asset' },
]

const CHECKLIST = [
  { label: 'All modules reviewed and approved', done: true },
  { label: 'Framework finalized', done: true },
  { label: 'All lessons generated', done: true },
  { label: 'Quizzes reviewed', done: false },
  { label: 'Artifacts ready for export', done: true },
  { label: 'Cover / title page configured', done: false },
  { label: 'SEO metadata set', done: false },
]

export default function PublishPlaybookPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [visibility, setVisibility] = useState<'private' | 'link' | 'published'>('link')
  const [selected, setSelected] = useState('microsite')
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const doneCount = CHECKLIST.filter((c) => c.done).length

  async function handlePublish() {
    setPublishing(true)
    await new Promise((r) => setTimeout(r, 1800))
    setPublished(true)
    setPublishing(false)
  }

  return (
    <div>
      <ScreenHeader
        title="Publish / Export"
        subtitle="Turn your playbook into a public or reusable asset"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push(`/library/${id}/toolkit`)}>← Back</Button>
            <Link href={`/p/${id}`} target="_blank">
              <Button variant="secondary" size="sm">Preview Site →</Button>
            </Link>
            <Button variant="secondary" size="sm">Export Bundle</Button>
            <Button size="sm" onClick={handlePublish} disabled={publishing}>
              {publishing ? 'Publishing…' : published ? '✓ Published' : 'Publish to Vercel →'}
            </Button>
          </div>
        }
      />

      <div className="mx-8 pb-12 space-y-5">
        {/* Title banner */}
        <Card className="p-5 bg-gray-50">
          <p className="font-bold text-base text-gray-900">Agentic Systems Builder Playbook</p>
          <p className="text-sm text-gray-500 mt-1">A practical microcourse for designing reliable AI agents from first principles.</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs font-bold text-gray-500">Visibility:</span>
            {(['private', 'link', 'published'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  visibility === v
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-500'
                }`}
              >
                {v === 'private' ? 'Private' : v === 'link' ? 'Share Link' : 'Published'}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Output types + preview */}
          <div className="col-span-2 space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Publishing Outputs</p>
              <div className="grid grid-cols-2 gap-3">
                {OUTPUTS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelected(o.id)}
                    className={`text-left p-4 rounded-lg border transition-colors ${
                      selected === o.id
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-900">{o.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{o.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <Card className="p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                {OUTPUTS.find((o) => o.id === selected)?.label} Preview
              </p>
              {selected === 'microsite' && published ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-semibold text-sm">Live!</p>
                  <Link href={`/p/${id}`} target="_blank" className="text-green-600 text-xs underline">
                    {id}.playbookos.app
                  </Link>
                </div>
              ) : (
                <div className="h-40 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-300">
                  [ {OUTPUTS.find((o) => o.id === selected)?.label} preview ]
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="secondary">Generate Landing Page</Button>
                <Button size="sm">Export →</Button>
              </div>
            </Card>
          </div>

          {/* Checklist */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pre-Publish Checklist</p>
            <Card className="p-5">
              <ul className="space-y-3">
                {CHECKLIST.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        c.done ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'
                      }`}
                    >
                      {c.done ? '✓' : ''}
                    </span>
                    <span className={`text-sm ${c.done ? 'text-gray-700' : 'text-gray-400'}`}>
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                {doneCount} of {CHECKLIST.length} items complete
                {doneCount < CHECKLIST.length && ' — resolve before publishing'}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
