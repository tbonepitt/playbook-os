import { notFound } from 'next/navigation'
import { db } from '@/lib/stub-db'
import { LessonPlayer } from '@/components/domain/LessonPlayer'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string; lessonId: string }>
}) {
  const { id, moduleId, lessonId } = await params
  const playbook = db.playbooks.get(id)
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
