import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { CreatePlaybookSchema } from '@playbook-os/core'
import { repo } from '@/lib/repo'

async function getUserId(): Promise<string | undefined> {
  try {
    const { userId } = await auth()
    return userId ?? undefined
  } catch {
    return undefined
  }
}

export async function GET() {
  const userId = await getUserId()
  return NextResponse.json(await repo.playbooks.list(userId))
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  const body = await req.json()
  const parsed = CreatePlaybookSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const playbook = await repo.playbooks.create({ ...parsed.data, userId })
  return NextResponse.json(playbook, { status: 201 })
}
