import { notFound } from 'next/navigation'
import { db } from '@/lib/stub-db'
import { LessonPlayer } from '@/components/domain/LessonPlayer'

export default function LessonPage({
  params,
}: {
  params: { id: string; moduleId: string; lessonId: string }
}) {
  const playbook = db.playbooks.get(params.id)
  if (!playbook) notFound()

  const mod = playbook.modules.find((m) => m.id === params.moduleId)
  if (!mod) notFound()

  const lesson = mod.lessons.find((l) => l.id === params.lessonId)
  if (!lesson) notFound()

  return (
    <LessonPlayer
      lesson={lesson}
      backHref={`/library/${params.id}/outline/${params.moduleId}`}
    />
  )
}
