import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'

const SAMPLE_FRAMEWORKS = [
  { name: 'A.G.E.N.T.', playbook: 'Agentic Systems Builder Playbook', pillars: 5, used: 'Course spine' },
  { name: 'P.A.T.H.', playbook: 'AI Product Builder Playbook', pillars: 4, used: 'Course spine' },
  { name: 'S.P.R.I.N.T.', playbook: 'Product Strategy Sprint Playbook', pillars: 6, used: 'Course spine' },
  { name: 'L.O.O.P.', playbook: 'Customer Discovery Playbook', pillars: 4, used: 'Lesson cluster' },
  { name: 'E.V.A.L.', playbook: 'LLM Evaluation Playbook', pillars: 4, used: 'Course spine' },
]

export default function FrameworksPage() {
  return (
    <div>
      <ScreenHeader
        title="Frameworks"
        subtitle="Named frameworks generated from your playbooks"
        action={<Button>+ Generate Framework</Button>}
      />

      <div className="mx-8 pb-12">
        <div className="grid grid-cols-3 gap-4">
          {SAMPLE_FRAMEWORKS.map((f) => (
            <div
              key={f.name}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 cursor-pointer transition-colors"
            >
              <div className="font-mono font-black text-2xl tracking-widest text-gray-900 mb-3">
                {f.name}
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">{f.playbook}</p>
              <p className="text-xs text-gray-400">{f.pillars} pillars · {f.used}</p>
              <div className="flex gap-2 mt-5">
                <Button size="sm" variant="secondary">Open</Button>
                <Button size="sm" variant="ghost">Reuse →</Button>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center min-h-[160px] text-gray-400 hover:border-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
            <span className="text-3xl font-light mb-2">+</span>
            <p className="text-sm">Generate new framework</p>
            <p className="text-xs text-gray-300 mt-1">From sources or scratch</p>
          </div>
        </div>
      </div>
    </div>
  )
}
