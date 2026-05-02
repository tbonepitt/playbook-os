import { Suspense } from 'react'
import Link from 'next/link'
import { repo } from '@/lib/repo'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Playbook } from '@playbook-os/core'

export const dynamic = 'force-dynamic'

function SourceChips({ count }: { count: number }) {
  if (!count) return <span className="text-gray-300 text-xs">—</span>
  return (
    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[11px] rounded font-medium">
      {count} source{count !== 1 ? 's' : ''}
    </span>
  )
}

function PlaybookRow({ playbook }: { playbook: Playbook }) {
  const progress = playbook.modules.length
    ? Math.round(
        (playbook.modules.filter((m) => m.status === 'published').length / playbook.modules.length) * 100
      )
    : 0

  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="px-6 py-3.5">
        <Link href={`/library/${playbook.id}`} className="font-medium text-gray-900 hover:underline text-sm">
          {playbook.title}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{playbook.audience}</p>
      </td>
      <td className="px-6 py-3.5">
        <SourceChips count={playbook.sourceIds.length} />
      </td>
      <td className="px-6 py-3.5">
        <Badge status={playbook.status} />
      </td>
      <td className="px-6 py-3.5 text-sm text-gray-600">{playbook.modules.length || '—'}</td>
      <td className="px-6 py-3.5 text-sm text-gray-600">
        {playbook.modules.reduce((n, m) => n + m.lessons.length, 0) || '—'}
      </td>
      <td className="px-6 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-400">{progress}%</span>
        </div>
      </td>
      <td className="px-6 py-3.5 text-xs text-gray-400">
        {playbook.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </td>
      <td className="px-6 py-3.5">
        <Link
          href={`/library/${playbook.id}`}
          className="text-xs text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Open →
        </Link>
      </td>
    </tr>
  )
}

async function LibraryTable() {
  const playbooks = await repo.playbooks.list()

  if (playbooks.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['Playbook', 'Sources', 'Status', 'Modules', 'Lessons', 'Progress', 'Updated', ''].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {playbooks.map((p) => (
              <PlaybookRow key={p.id} playbook={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function LibraryPage() {
  return (
    <div>
      <ScreenHeader
        title="Library"
        subtitle="Your private collection of generated playbooks"
        action={
          <Link href="/library/new">
            <Button>+ Create New Playbook</Button>
          </Link>
        }
      />
      <div className="mx-8 pb-12">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
              Loading playbooks…
            </div>
          }
        >
          <LibraryTable />
        </Suspense>
      </div>
    </div>
  )
}

function EmptyState() {
  const templates = [
    { name: 'AI / LLM topic', desc: 'Research papers, docs, code repos' },
    { name: 'Product / strategy', desc: 'PDFs, articles, frameworks' },
    { name: 'Engineering topic', desc: 'Docs sites, GitHub, blog posts' },
    { name: 'Research synthesis', desc: 'Multiple papers, notes, talks' },
    { name: 'Workshop or course', desc: 'Slides, transcripts, examples' },
    { name: 'Start blank', desc: 'No template' },
  ]

  return (
    <div>
      <div className="max-w-2xl mx-auto text-center py-10">
        <div className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-6 text-gray-300 text-sm">
          illustration placeholder
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your first playbook starts here.</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-6">
          Bring 1–4 sources (PDFs, GitHub repos, articles, YouTube, docs). PlaybookOS extracts the ideas, builds a
          named framework, and structures everything into bite-sized lessons.
        </p>
        <Link href="/library/new">
          <Button className="px-6 py-2.5 text-sm">+ Create Your First Playbook</Button>
        </Link>
        <p className="text-xs text-gray-400 mt-2">or pick a starting template below</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Start Templates</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {templates.map((t) => (
            <Link key={t.name} href="/library/new">
              <div className="p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-400 cursor-pointer transition-colors">
                <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-5 bg-white border border-gray-200 rounded-xl">
          <p className="text-xs font-bold text-gray-700 mb-4">How it works</p>
          <div className="grid grid-cols-4 gap-4">
            {[
              { n: '1', t: 'Add sources', d: 'PDFs, repos, URLs' },
              { n: '2', t: 'Auto-analyze', d: 'Concepts + framework' },
              { n: '3', t: 'Review outline', d: 'Edit modules + lessons' },
              { n: '4', t: 'Publish', d: 'Microsite, PDF, more' },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center text-[11px] font-bold shrink-0 text-gray-600">
                  {s.n}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{s.t}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
