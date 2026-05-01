import { NextRequest, NextResponse } from 'next/server'

// In-memory framework store keyed by playbookId (replace with Prisma later).
// Keep helper state private to this module: Next.js route handlers may only
// export HTTP methods and route config fields.
const frameworkStore = new Map<string, object>()

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const framework = frameworkStore.get(id)
  if (!framework) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(framework)
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await req.json()
  frameworkStore.set(id, body)
  return NextResponse.json(body)
}
