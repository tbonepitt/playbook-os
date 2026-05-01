import { notFound } from 'next/navigation'
import { repo } from '@/lib/repo'
import { LessonPlayer } from '@/components/domain/LessonPlayer'

export const dynamic = 'force-dynamic'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string; lessonId: string }>
}) {
  const { id, moduleId, lessonId } = await params
  const playbook = await repo.playbooks.get(id)
  if (!playbook) notFound()

  const mod = playbook.modules.find((m) => m.id === moduleId)
  if (!mod) notFound()

  const lesson = mod.lessons.find((l) => l.id === lessonId)
  if (!lesson) notFound()

  return (
    <LessonPlayer
      lesson={lesson}
      backHref={`/library/${id}/outline/${moduleId}`}
    />
  )
}
