import Link from 'next/link'
import { repo } from '@/lib/repo'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { Source } from '@playbook-os/core'

export const dynamic = 'force-dynamic'

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

export default async function SourcesPage() {
  const sources = await repo.sources.list()

  return (
    <div>
      <ScreenHeader
        title="Sources"
        subtitle="Reusable source library across all playbooks"
        action={
          <Link href="/sources/new">
            <Button>+ Add Source</Button>
          </Link>
        }
      />

      <div className="mx-8 pb-12">
        {sources.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white px-12 py-16 text-center">
            <p className="text-sm text-gray-500">No sources yet. Add a PDF, URL, GitHub repo, or YouTube link.</p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Added</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sources.map((src) => (
                  <tr key={src.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded bg-gray-100 text-gray-600 text-[10px] font-bold flex items-center justify-center">
                          {TYPE_LABEL[src.type]}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{src.name}</p>
                          {src.url && <p className="text-xs text-gray-400 truncate max-w-xs">{src.url}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{src.type}</td>
                    <td className="px-6 py-4 text-gray-400">{src.size ?? '—'}</td>
                    <td className="px-6 py-4">
                      <Badge status={src.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {src.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/sources/${src.id}`}
                        className="text-xs text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
