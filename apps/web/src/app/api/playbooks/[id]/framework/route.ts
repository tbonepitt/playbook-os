import { NextRequest, NextResponse } from 'next/server'
import { repo } from '@/lib/repo'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const framework = await repo.frameworks.get(id)
  if (!framework) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(framework)
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await req.json()
  const framework = await repo.frameworks.upsert({ ...body, playbookId: id })
  return NextResponse.json(framework)
}
