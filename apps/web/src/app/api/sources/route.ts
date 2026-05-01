import { NextRequest, NextResponse } from 'next/server'
import { repo } from '@/lib/repo'
import { CreateSourceSchema } from '@playbook-os/core'

export async function GET() {
  return NextResponse.json(await repo.sources.list())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const playbookId = typeof body.playbookId === 'string' ? body.playbookId : undefined
  const parsed = CreateSourceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const source = await repo.sources.create({
    ...parsed.data,
    status: parsed.data.type === 'markdown' ? 'extracted' : 'pending',
    rawText: parsed.data.type === 'markdown' ? parsed.data.url : undefined,
  })

  if (playbookId) await repo.playbooks.attachSource(playbookId, source.id)
  return NextResponse.json(source, { status: 201 })
}
