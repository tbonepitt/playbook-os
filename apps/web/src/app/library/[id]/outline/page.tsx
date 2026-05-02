import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/stub-db'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export default function OutlinePage({ params }: { params: { id: string } }) {
  const playbook = db.playbooks.get(params.id)
  if (!playbook) notFound()

  const totalMinutes = playbook.modules.reduce((sum, m) => sum + m.estimatedMinutes, 0)
  const totalLessons = playbook.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const hours = (totalMinutes / 60).toFixed(1)

  return (
    <div>
      <ScreenHeader
        title="Course Outline Editor"
        subtitle={`${playbook.title} — review and reorder modules before finalizing lessons`}
        action={
          <div className="flex gap-2">
            <Link href={`/library/${params.id}/framework`}>
              <Button variant="secondary" size="sm">← Back</Button>
            </Link>
            <Button variant="secondary" size="sm">Regenerate Outline</Button>
            <Link href={`/library/${params.id}/outline/${playbook.modules[0]?.id ?? ''}`}>
              <Button size="sm">Approve & Continue →</Button>
            </Link>
          </div>
        }
      />

      <div className="mx-8 pb-12">
        {playbook.modules.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-500 mb-3">No modules yet.</p>
            <Link href={`/library/${params.id}/analysis`}>
              <Button>Run pipeline →</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Summary card */}
            <Card className="p-4 mb-4 bg-gray-50 border-gray-100">
              <p className="font-bold text-sm text-gray-900">{playbook.title}</p>
              <p className="text-xs text-gray-500 mt-1">{playbook.goal}</p>
              <div className="flex gap-5 mt-3 text-xs text-gray-400">
                <span>{playbook.modules.length} modules</span>
                <span>{totalLessons} lessons</span>
                <span>~{hours} hours total</span>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 w-8" />
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-10">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Module Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Est. Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Lessons</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Artifacts</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {playbook.modules.map((mod, i) => (
                    <tr key={mod.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-300 text-base cursor-grab">⠿</td>
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{mod.title}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{mod.estimatedMinutes} min</td>
                      <td className="px-4 py-3 text-gray-600">{mod.lessons.length}</td>
                      <td className="px-4 py-3 text-gray-600">{mod.artifactIds.length || '—'}</td>
                      <td className="px-4 py-3">
                        <Badge status={mod.status} />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/library/${params.id}/outline/${mod.id}`}
                          className="text-xs text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-gray-50">
                <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  + Add Module
                </button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
