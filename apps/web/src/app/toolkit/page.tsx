'use client'

import { useState } from 'react'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'

const ARTIFACTS = [
  'Agentic System Design Spec',
  'Agent Brief Builder',
  'Agent vs Workflow Decision Tree',
  'Memory & Context Policy Template',
  'Guardrails Checklist',
  'Evaluation Plan Template',
  'Human Escalation Rulebook',
  'Cost / Latency Constraint Sheet',
]

const SPEC_SECTIONS = [
  'Agent Purpose', 'User / Workflow', 'Autonomy Level', 'Pattern Selection',
  'Tools Required', 'Context / Memory Policy', 'Failure Modes', 'Guardrails',
  'Evaluation Plan', 'Human Escalation Rules', 'Cost / Latency Constraints', 'Launch Readiness',
]

export default function ToolkitPage() {
  const [selected, setSelected] = useState(ARTIFACTS[0])

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader
        title="Toolkit / Artifacts"
        subtitle="Practical generated assets from your playbooks"
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">← Back</Button>
            <Button size="sm">Continue to Publish →</Button>
          </div>
        }
      />

      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '260px 1fr' }}>
        {/* Artifact list */}
        <div className="border-r border-gray-200 bg-white overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Artifacts ({ARTIFACTS.length})
            </p>
          </div>
          {ARTIFACTS.map((a) => (
            <button
              key={a}
              onClick={() => setSelected(a)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between border-b border-gray-50 text-sm transition-colors ${
                selected === a
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{a}</span>
              <span className={selected === a ? 'text-gray-400' : 'text-gray-200'}>→</span>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="overflow-y-auto bg-gray-50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{selected}</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">Edit</Button>
              <Button size="sm" variant="secondary">Duplicate</Button>
              <Button size="sm" variant="secondary">Export</Button>
              <Button size="sm" variant="secondary">Link to Module</Button>
            </div>
          </div>

          {selected === 'Agentic System Design Spec' ? (
            <div>
              <p className="text-xs text-gray-400 italic mb-5">
                Template — fill in one per agent you design
              </p>
              <div className="space-y-3">
                {SPEC_SECTIONS.map((s, i) => (
                  <div
                    key={s}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      {String(i + 1).padStart(2, '0')} — {s}
                    </p>
                    <div className="h-8 border border-dashed border-gray-200 rounded flex items-center px-3">
                      <span className="text-xs font-mono text-gray-300">[ fill in for your agent ]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-400 italic mb-5">Select this artifact to view its template</p>
              <div className="h-56 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-300">
                [ {selected} template preview ]
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
