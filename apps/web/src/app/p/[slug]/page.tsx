import Link from 'next/link'

const PILLARS = [
  { letter: 'A', name: 'Aim', desc: 'Define outcomes, users, boundaries, and autonomy level' },
  { letter: 'G', name: 'Ground', desc: 'Establish context, constraints, and knowledge sources' },
  { letter: 'E', name: 'Equip', desc: 'Choose tools, APIs, and memory patterns' },
  { letter: 'N', name: 'Navigate', desc: 'Design planning, branching, and recovery loops' },
  { letter: 'T', name: 'Test', desc: 'Build evals, guardrails, and human escalation paths' },
]

const MODULES = [
  { n: '01', title: 'Agents Are Systems, Not Prompts', lessons: 5, time: '22 min' },
  { n: '02', title: 'Goals, Boundaries, and Autonomy', lessons: 4, time: '18 min' },
  { n: '03', title: 'The Agentic Design Stack', lessons: 6, time: '25 min' },
  { n: '04', title: 'Choosing the Right Pattern', lessons: 5, time: '20 min' },
  { n: '05', title: 'Tool Use and MCP', lessons: 7, time: '28 min' },
  { n: '06', title: 'Memory, State, and Context', lessons: 5, time: '22 min' },
  { n: '07', title: 'Planning, Reflection, and Recovery', lessons: 6, time: '24 min' },
  { n: '08', title: 'Guardrails, Evals, and Human Control', lessons: 6, time: '26 min' },
  { n: '09', title: 'Production Readiness', lessons: 4, time: '20 min' },
]

export default async function MicrositePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const totalLessons = MODULES.reduce((n, m) => n + m.lessons, 0)

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      {/* Preview chrome bar */}
      <div className="bg-gray-900 text-gray-400 px-4 py-2 flex items-center gap-3 text-xs">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          ))}
        </div>
        <span className="font-mono">{slug}.playbookos.app</span>
        <span className="ml-auto text-gray-600">Learner-facing preview</span>
        <Link
          href={`/publish`}
          className="text-gray-400 hover:text-white border border-gray-700 rounded px-2 py-0.5 transition-colors"
        >
          ← Back to Publish
        </Link>
      </div>

      {/* Hero */}
      <div className="px-10 py-16 bg-white border-b border-gray-200 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">A PlaybookOS Microcourse</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 max-w-2xl mx-auto leading-tight mb-4">
          Agentic Systems Builder Playbook
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          A practical microcourse for designing reliable AI agents from first principles —{' '}
          {MODULES.length} modules, {totalLessons} lessons, ~3.5 hours.
        </p>
        <div className="flex gap-3 justify-center mb-6">
          <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
            Start the Course →
          </button>
          <button className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Download PDF
          </button>
        </div>
        <div className="flex gap-8 justify-center text-xs text-gray-400">
          <span>{MODULES.length} modules</span>
          <span>{totalLessons} lessons</span>
          <span>3.5 hours</span>
          <span>Free</span>
        </div>
      </div>

      {/* Framework */}
      <div className="px-10 py-14 border-b border-gray-200 text-center">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">The Framework</p>
        <div className="font-mono font-black text-5xl tracking-widest text-gray-900 mb-6">
          A.G.E.N.T.
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-5 gap-3">
          {PILLARS.map((p) => (
            <div key={p.letter} className="border border-gray-200 rounded-lg p-4 text-left">
              <div className="text-2xl font-black text-gray-900 mb-2">{p.letter}</div>
              <div className="text-sm font-bold text-gray-800 mb-1">{p.name}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum */}
      <div className="px-10 py-14 max-w-3xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-gray-400 mb-4">Curriculum</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {MODULES.length} modules to build reliable agents
        </h2>
        <div className="divide-y divide-gray-100">
          {MODULES.map((m) => (
            <div
              key={m.n}
              className="py-5 flex items-center gap-5 hover:bg-gray-50 -mx-4 px-4 rounded-lg cursor-pointer transition-colors"
            >
              <span className="font-mono text-sm text-gray-300 w-7 shrink-0">{m.n}</span>
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-900">{m.title}</p>
                <p className="text-xs text-gray-400 mt-1">{m.lessons} lessons · {m.time}</p>
              </div>
              <span className="text-gray-300">→</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-100 py-14 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to start?</h3>
        <p className="text-sm text-gray-400 mb-6">Free. No account required.</p>
        <button className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
          Start the Course →
        </button>
      </div>
    </div>
  )
}
