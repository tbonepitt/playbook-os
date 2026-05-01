import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/stub-db'
import { CreatePlaybookSchema } from '@playbook-os/core'

export async function GET() {
  return NextResponse.json(db.playbooks.list())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CreatePlaybookSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const playbook = db.playbooks.create({ ...parsed.data, sourceIds: [], status: 'draft' })
  return NextResponse.json(playbook, { status: 201 })
}
