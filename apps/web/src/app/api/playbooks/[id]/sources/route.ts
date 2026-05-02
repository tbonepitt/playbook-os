import { NextRequest, NextResponse } from 'next/server'
import { repo } from '@/lib/repo'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const { sourceId } = await req.json()
  if (typeof sourceId !== 'string') return NextResponse.json({ error: 'Missing sourceId' }, { status: 400 })

  const playbook = await repo.playbooks.get(id)
  const source = await repo.sources.get(sourceId)
  if (!playbook || !source) return NextResponse.json({ error: 'Playbook or source not found' }, { status: 404 })

  await repo.playbooks.attachSource(id, sourceId)
  return NextResponse.json({ attached: true })
}
