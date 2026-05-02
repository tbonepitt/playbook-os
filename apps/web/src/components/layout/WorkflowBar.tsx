'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Step = { label: string; pathSuffix: string }

const STEPS: Step[] = [
  { label: 'New Playbook', pathSuffix: '' },
  { label: 'Sources', pathSuffix: '/sources-add' },
  { label: 'Analysis', pathSuffix: '/analysis' },
  { label: 'Framework', pathSuffix: '/framework' },
  { label: 'Outline', pathSuffix: '/outline' },
  { label: 'Toolkit', pathSuffix: '/toolkit' },
  { label: 'Publish', pathSuffix: '/publish' },
]

function getPlaybookId(pathname: string): string | null {
  const m = pathname.match(/^\/library\/([^\/]+)/)
  return m ? m[1] : null
}

function getCurrentStep(pathname: string): number {
  if (pathname.endsWith('/publish')) return 6
  if (pathname.includes('/toolkit')) return 5
  if (pathname.includes('/outline')) return 4
  if (pathname.includes('/framework')) return 3
  if (pathname.includes('/analysis')) return 2
  if (pathname.includes('/sources-add')) return 1
  if (pathname.match(/^\/library\/new$/) || pathname.match(/^\/library\/[^\/]+$/)) return 0
  return -1
}

export function WorkflowBar() {
  const pathname = usePathname()
  const playbookId = getPlaybookId(pathname)
  const currentStep = getCurrentStep(pathname)

  if (currentStep < 0 || !playbookId) return null

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-1.5 flex items-center gap-0 overflow-x-auto shrink-0">
      {STEPS.map((step, i) => {
        const href =
          i === 0 ? `/library/${playbookId}` : `/library/${playbookId}${step.pathSuffix}`
        const done = i < currentStep
        const active = i === currentStep

        return (
          <div key={step.label} className="flex items-center">
            <Link
              href={href}
              className={`text-[11px] whitespace-nowrap px-0.5 py-1 transition-colors ${
                active
                  ? 'font-bold text-gray-900'
                  : done
                  ? 'font-medium text-gray-500 underline underline-offset-2 hover:text-gray-900'
                  : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              {i + 1}. {step.label}
            </Link>
            {i < STEPS.length - 1 && (
              <span className="mx-2 text-gray-200 text-[11px]">›</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
