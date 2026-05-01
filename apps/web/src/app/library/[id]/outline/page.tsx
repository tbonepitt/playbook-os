import { notFound } from 'next/navigation'
import Link from 'next/link'
import { repo } from '@/lib/repo'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function OutlinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const playbook = await repo.playbooks.get(id)
  if (!playbook) notFound()

  const totalMinutes = playbook.modules.reduce((sum, m) => sum + m.estimatedMinutes, 0)
  const totalLessons = playbook.modules.reduce((sum, m) => sum + m.lessons.length, 0)

  return (
    <div>
      <ScreenHeader
        title="Course Outline"
        subtitle={`${playbook.modules.length} modules · ${totalLessons} lessons · ${totalMinutes} min`}
        action={
          <Link href={`/library/${id}`}>
            <Button variant="secondary" size="sm">← Back to playbook</Button>
          </Link>
        }
      />

      <div className="mx-8 pb-12">
        {playbook.modules.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-500 mb-3">No modules yet.</p>
            <Link href={`/library/${id}/analysis`}>
              <Button>Run pipeline →</Button>
            </Link>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide w-8">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Module</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Lessons</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {playbook.modules.map((mod) => (
                  <tr key={mod.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 text-xs">{mod.order}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{mod.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{mod.goal}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{mod.lessons.length}</td>
                    <td className="px-6 py-4 text-gray-500">{mod.estimatedMinutes} min</td>
                    <td className="px-6 py-4">
                      <Badge status={mod.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/library/${id}/outline/${mod.id}`}
                        className="text-xs text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Open →
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
