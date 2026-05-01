import { NextRequest, NextResponse } from 'next/server'
import { CreatePlaybookSchema } from '@playbook-os/core'
import { repo } from '@/lib/repo'

export async function GET() {
  return NextResponse.json(await repo.playbooks.list())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CreatePlaybookSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const playbook = await repo.playbooks.create(parsed.data)
  return NextResponse.json(playbook, { status: 201 })
}
