import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/stub-db'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export default function ModuleDetailPage({ params }: { params: { id: string; moduleId: string } }) {
  const playbook = db.playbooks.get(params.id)
  if (!playbook) notFound()

  const mod = playbook.modules.find((m) => m.id === params.moduleId)
  if (!mod) notFound()

  return (
    <div>
      <ScreenHeader
        title={mod.title}
        subtitle={`${mod.estimatedMinutes} min · ${mod.lessons.length} lessons`}
        action={
          <Link
            href={`/library/${params.id}/outline`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            ← Outline
          </Link>
        }
      />

      <div className="mx-8 grid grid-cols-3 gap-6 pb-12">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Goal</h2>
            <p className="text-sm text-gray-800">{mod.goal}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Lessons</h2>
              <Badge status={mod.status} />
            </div>
            {mod.lessons.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No lessons generated yet.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {mod.lessons.map((lesson) => (
                  <li key={lesson.id} className="py-3 flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                      <p className="text-xs text-gray-400">
                        {lesson.cards.length} cards · {lesson.estimatedMinutes} min
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge status={lesson.status} />
                      <Link
                        href={`/library/${params.id}/outline/${params.moduleId}/lesson/${lesson.id}`}
                        className="text-xs text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Play →
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Artifacts</h2>
            {mod.artifactIds.length === 0 ? (
              <p className="text-sm text-gray-400">No artifacts yet.</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-700">
                {mod.artifactIds.map((aid) => <li key={aid}>{aid}</li>)}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
