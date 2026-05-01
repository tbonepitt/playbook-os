'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    section: 'WORKSPACE',
    items: [
      { label: 'Library', href: '/library' },
      { label: 'Sources', href: '/sources' },
      { label: 'Playbooks', href: '/library' },
    ],
  },
  {
    section: 'BUILD',
    items: [
      { label: 'Frameworks', href: '/frameworks' },
      { label: 'Toolkit', href: '/toolkit' },
      { label: 'Publish', href: '/publish' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-60 shrink-0 bg-[#1e1e1e] text-white h-screen">
      <div className="px-5 py-5 border-b border-white/10">
        <span className="text-base font-bold tracking-tight">
          <span className="font-black">PLAYBOOK</span>OS
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <p className="px-2 mb-2 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              {section}
            </p>
            <ul className="space-y-0.5">
              {items.map(({ label, href }) => {
                const active = pathname === href || (href !== '/library' && pathname.startsWith(href))
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors ${
                        active
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-white' : 'bg-white/20'}`}
                      />
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-5 py-3 border-t border-white/10">
        <span className="text-[11px] text-white/20">v0.1</span>
      </div>
    </aside>
  )
}
