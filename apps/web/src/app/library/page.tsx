import Link from 'next/link'
import { db } from '@/lib/stub-db'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Playbook } from '@playbook-os/core'

function SourceChips({ count }: { count: number }) {
  if (!count) return <span className="text-gray-400 text-xs">No sources</span>
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium">
      {count} source{count !== 1 ? 's' : ''}
    </span>
  )
}

function PlaybookRow({ playbook }: { playbook: Playbook }) {
  const progress = playbook.modules.length
    ? Math.round((playbook.modules.filter((m) => m.status === 'published').length / playbook.modules.length) * 100)
    : 0

  return (
    <tr className="group hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <Link
          href={`/library/${playbook.id}`}
          className="font-medium text-gray-900 hover:text-gray-600 group-hover:underline"
        >
          {playbook.title}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{playbook.audience}</p>
      </td>
      <td className="px-6 py-4">
        <Badge status={playbook.status} />
      </td>
      <td className="px-6 py-4">
        <SourceChips count={playbook.sourceIds.length} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-400">{progress}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <span className="text-xs text-gray-400">
          {playbook.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </td>
      <td className="px-6 py-4">
        <Link
          href={`/library/${playbook.id}`}
          className="text-xs text-gray-500 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Open →
        </Link>
      </td>
    </tr>
  )
}

export default function LibraryPage() {
  const playbooks = db.playbooks.list()

  return (
    <div>
      <ScreenHeader
        title="Library"
        subtitle="Your private collection of generated playbooks"
        action={
          <Link href="/library/new">
            <Button>+ New Playbook</Button>
          </Link>
        }
      />

      {playbooks.length === 0 ? (
        <div className="mx-8 mt-4 rounded-xl border-2 border-dashed border-gray-200 bg-white px-12 py-16 text-center">
          <p className="text-gray-500 text-sm mb-4">No playbooks yet. Create one to get started.</p>
          <Link href="/library/new">
            <Button>Create your first playbook</Button>
          </Link>
        </div>
      ) : (
        <div className="mx-8 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Playbook
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Sources
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Updated
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {playbooks.map((p) => (
                <PlaybookRow key={p.id} playbook={p} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
