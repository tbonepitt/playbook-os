import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/stub-db'
import { CreateSourceSchema } from '@playbook-os/core'

export async function GET() {
  return NextResponse.json(db.sources.list())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CreateSourceSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const source = db.sources.create({ ...parsed.data, status: 'pending' })
  return NextResponse.json(source, { status: 201 })
}
