'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { PipelineState, PipelineStage } from '@/lib/pipeline-state'
import { STAGE_LABELS } from '@/lib/pipeline-state'

const STAGE_ORDER: PipelineStage[] = ['ingest', 'extract', 'cluster', 'framework', 'outline', 'lessons']

function StageRow({ stage, state }: { stage: PipelineStage; state: PipelineState['stages'][PipelineStage] }) {
  const icons = {
    waiting: <span className="text-gray-300">○</span>,
    running: <span className="animate-spin text-blue-500">◌</span>,
    done: <span className="text-green-600">✓</span>,
    error: <span className="text-red-500">✕</span>,
  }

  return (
    <div className={`flex items-center gap-4 py-3 border-b border-gray-50 last:border-0`}>
      <span className="text-lg w-6 text-center">{icons[state.status]}</span>
      <span className={`text-sm flex-1 ${state.status === 'waiting' ? 'text-gray-400' : 'text-gray-900'}`}>
        {STAGE_LABELS[stage]}
      </span>
      {state.status === 'done' && state.completedAt && (
        <span className="text-xs text-gray-400">
          {state.completedAt.toLocaleTimeString()}
        </span>
      )}
      {state.status === 'running' && (
        <span className="text-xs text-blue-500 animate-pulse">Running…</span>
      )}
      {state.status === 'error' && (
        <span className="text-xs text-red-500">{state.error ?? 'Error'}</span>
      )}
    </div>
  )
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [pipelineState, setPipelineState] = useState<PipelineState | null>(null)
  const [running, setRunning] = useState(false)

  const fetchState = useCallback(async () => {
    const res = await fetch(`/api/pipeline?playbookId=${id}`)
    if (res.ok) setPipelineState(await res.json())
  }, [id])

  useEffect(() => {
    fetchState()
  }, [fetchState])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(async () => {
      await fetchState()
      const state = pipelineState
      if (!state) return
      const allDone = STAGE_ORDER.every((s) => ['done', 'error'].includes(state.stages[s].status))
      if (allDone) {
        setRunning(false)
        clearInterval(interval)
      }
    }, 1500)
    return () => clearInterval(interval)
  }, [running, fetchState, pipelineState])

  async function startPipeline() {
    setRunning(true)
    await fetch('/api/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playbookId: id }),
    })
    fetchState()
  }

  const outlineDone = pipelineState?.stages.outline.status === 'done'

  return (
    <div>
      <ScreenHeader
        title="Source Analysis"
        subtitle="Pipeline stages — track extraction and generation progress"
      />

      <div className="mx-8 grid grid-cols-3 gap-6 pb-12">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pipeline stages</h2>
              {!running && !outlineDone && (
                <Button size="sm" onClick={startPipeline}>
                  Run pipeline
                </Button>
              )}
              {outlineDone && (
                <Button size="sm" onClick={() => router.push(`/library/${id}/framework`)}>
                  View framework →
                </Button>
              )}
            </div>
            {pipelineState ? (
              <div>
                {STAGE_ORDER.map((stage) => (
                  <StageRow key={stage} stage={stage} state={pipelineState.stages[stage]} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center">Loading…</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">What happens</h2>
            <ol className="space-y-3 text-xs text-gray-500">
              {[
                ['Ingest', 'Fetches raw text from each source URL'],
                ['Extract', 'Claude identifies 10–25 key concepts'],
                ['Cluster', 'Groups concepts into themes'],
                ['Framework', 'Creates a named acronym framework'],
                ['Outline', 'Designs modules and lesson structure'],
                ['Lessons', 'Generates cards per lesson'],
              ].map(([label, desc]) => (
                <li key={label} className="flex gap-2">
                  <span className="font-semibold text-gray-700 w-16 shrink-0">{label}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  )
}
