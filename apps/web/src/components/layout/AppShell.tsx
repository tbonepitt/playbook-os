'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'

const PUBLIC_PATHS = ['/', '/sign-in', '/sign-up']

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || (path !== '/' && pathname.startsWith(path)))
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (isPublicPath(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <Link href="/library" className="text-sm font-semibold text-gray-900">
            PlaybookOS
          </Link>
          <UserButton />
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
