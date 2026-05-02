import { Suspense } from 'react'
import Link from 'next/link'
import { repo } from '@/lib/repo'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Source } from '@playbook-os/core'

export const dynamic = 'force-dynamic'

function isExternalUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//i.test(value))
}

const TYPE_LABEL: Record<Source['type'], string> = {
  pdf: 'PDF',
  github: 'GH',
  youtube: 'YT',
  article: 'URL',
  docs: 'DOC',
  markdown: 'MD',
  gdoc: 'GD',
  notion: 'NT',
}

async function SourcesTable() {
  const sources = await repo.sources.list()
  const playbooks = await repo.playbooks.list()

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-16">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Source</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Used in</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Size</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Added</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sources.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                No sources yet. Add your first source to get started.
              </td>
            </tr>
          ) : (
            sources.map((src) => {
              const usedIn = playbooks.filter((p) => p.sourceIds.includes(src.id)).length
              return (
                <tr key={src.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="w-8 h-8 rounded bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center uppercase">
                      {TYPE_LABEL[src.type]}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <Link href={`/sources/${src.id}`} className="font-medium text-gray-900 hover:underline">
                      {src.name}
                    </Link>
                    {src.url && (
                      <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                        {isExternalUrl(src.url) ? (
                          <a href={src.url} target="_blank" rel="noreferrer" className="hover:text-gray-700 hover:underline">
                            {src.url}
                          </a>
                        ) : (
                          'Pasted text / markdown'
                        )}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-sm">
                    {usedIn > 0 ? (
                      <span className="text-gray-600">{usedIn} playbook{usedIn > 1 ? 's' : ''}</span>
                    ) : (
                      <span className="text-gray-300 italic">unused</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-400">{src.size ?? '—'}</td>
                  <td className="px-6 py-3.5">
                    <Badge status={src.status} />
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-400">
                    {src.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isExternalUrl(src.url) && (
                        <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-gray-900">
                          Original ↗
                        </a>
                      )}
                      <Link href={`/sources/${src.id}`} className="text-xs text-gray-400 hover:text-gray-900">
                        View →
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function SourcesPage() {
  return (
    <div>
      <ScreenHeader
        title="Sources"
        subtitle="Reusable across playbooks — add once, reference anywhere"
        action={
          <Link href="/sources/new">
            <Button>+ Add Source</Button>
          </Link>
        }
      />
      <div className="mx-8 pb-12">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-sm text-gray-400">
              Loading sources…
            </div>
          }
        >
          <SourcesTable />
        </Suspense>
      </div>
    </div>
  )
}
