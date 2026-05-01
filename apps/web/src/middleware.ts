import { NextRequest, NextResponse } from 'next/server'

const REALM = 'PlaybookOS'

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
    },
  })
}

function timingSafeEqualString(a: string, b: string) {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

export function middleware(req: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD

  // Keep local/dev and preview bootstrapping simple until env vars are present.
  if (!expectedUser || !expectedPassword) return NextResponse.next()

  const header = req.headers.get('authorization')
  if (!header?.startsWith('Basic ')) return unauthorized()

  const credentials = atob(header.slice('Basic '.length))
  const separatorIndex = credentials.indexOf(':')
  if (separatorIndex < 0) return unauthorized()

  const user = credentials.slice(0, separatorIndex)
  const password = credentials.slice(separatorIndex + 1)

  if (
    timingSafeEqualString(user, expectedUser) &&
    timingSafeEqualString(password, expectedPassword)
  ) {
    return NextResponse.next()
  }

  return unauthorized()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
