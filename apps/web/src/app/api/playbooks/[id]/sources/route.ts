import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/stub-db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { sourceId } = await req.json()
  const playbook = db.playbooks.get(params.id)
  if (!playbook) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (!playbook.sourceIds.includes(sourceId)) {
    db.playbooks.update(params.id, { sourceIds: [...playbook.sourceIds, sourceId] })
  }
  return NextResponse.json({ ok: true })
}
