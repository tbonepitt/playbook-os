import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/stub-db'
import { CreatePlaybookSchema } from '@playbook-os/core'
import {
  USER_PLAYBOOKS_COOKIE,
  decodeUserPlaybooks,
  encodeUserPlaybooks,
  upsertUserPlaybook,
} from '@/lib/user-playbook-cookie'

export async function GET(req: NextRequest) {
  const userPlaybooks = decodeUserPlaybooks(req.cookies.get(USER_PLAYBOOKS_COOKIE)?.value)
  return NextResponse.json([...userPlaybooks, ...db.playbooks.list()])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CreatePlaybookSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const playbook = db.playbooks.create({ ...parsed.data, sourceIds: [], status: 'draft' })
  const userPlaybooks = decodeUserPlaybooks(req.cookies.get(USER_PLAYBOOKS_COOKIE)?.value)
  const res = NextResponse.json(playbook, { status: 201 })

  res.cookies.set(USER_PLAYBOOKS_COOKIE, encodeUserPlaybooks(upsertUserPlaybook(userPlaybooks, playbook)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return res
}
