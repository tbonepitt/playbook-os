import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/stub-db'

// In-memory framework store keyed by playbookId (replace with Prisma later)
const frameworkStore = new Map<string, object>()

export function setFramework(playbookId: string, framework: object) {
  frameworkStore.set(playbookId, framework)
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const framework = frameworkStore.get(params.id)
  if (!framework) return NextResponse.json(null, { status: 404 })
  return NextResponse.json(framework)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  frameworkStore.set(params.id, body)
  return NextResponse.json(body)
}
