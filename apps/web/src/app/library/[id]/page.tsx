import { notFound } from 'next/navigation'
import Link from 'next/link'
import { repo } from '@/lib/repo'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function PlaybookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const playbook = await repo.playbooks.get(id)
  if (!playbook) notFound()

  const sources = await repo.playbooks.sources(id)

  return (
    <div>
      <ScreenHeader
        title={playbook.title}
        subtitle={playbook.audience}
        action={
          <div className="flex gap-2 items-center">
            <Badge status={playbook.status} />
            <Button variant="secondary" size="sm">Edit</Button>
          </div>
        }
      />

      <div className="mx-8 grid grid-cols-3 gap-6 pb-12">
        <div className="col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">Goal</p>
                <p className="text-gray-800">{playbook.goal || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Tone</p>
                <p className="text-gray-800">{playbook.tone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Output types</p>
                <p className="text-gray-800">{playbook.outputTypes.join(', ')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Created</p>
                <p className="text-gray-800">
                  {playbook.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Modules</h2>
              <Button size="sm" variant="secondary">Add module</Button>
            </div>
            {playbook.modules.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400 mb-3">No modules yet.</p>
                <p className="text-xs text-gray-400">
                  Add sources and run the pipeline to auto-generate modules.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {playbook.modules.map((mod) => (
                  <li key={mod.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{mod.title}</p>
                      <p className="text-xs text-gray-400">{mod.estimatedMinutes} min · {mod.lessons.length} lessons</p>
                    </div>
                    <Badge status={mod.status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Sources</h2>
              <Link href={`/sources/new?playbookId=${id}`}>
                <Button size="sm" variant="ghost">+ Add</Button>
              </Link>
            </div>
            {sources.length === 0 ? (
              <p className="text-sm text-gray-400">No sources attached.</p>
            ) : (
              <ul className="space-y-2">
                {sources.map((src) => src && (
                  <li key={src.id} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center uppercase">
                      {src.type.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate">{src.name}</p>
                      {src.size && <p className="text-xs text-gray-400">{src.size}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Workflow</h2>
            <div className="space-y-2">
              {[
                { label: 'Source analysis', href: `/library/${playbook.id}/analysis` },
                { label: 'Framework builder', href: `/library/${playbook.id}/framework` },
                { label: 'Course outline', href: `/library/${playbook.id}/outline` },
                { label: 'Publish', href: `/library/${playbook.id}/publish` },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm text-gray-700 group"
                >
                  {label}
                  <span className="text-gray-300 group-hover:text-gray-500">→</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
