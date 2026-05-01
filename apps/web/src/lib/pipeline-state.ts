import type { Playbook, Source, Framework, Module } from '@playbook-os/core'

export type PipelineStage =
  | 'ingest'
  | 'extract'
  | 'cluster'
  | 'framework'
  | 'outline'
  | 'lessons'

export type StageStatus = 'waiting' | 'running' | 'done' | 'error'

export type PipelineState = {
  playbookId: string
  stages: Record<PipelineStage, { status: StageStatus; error?: string; completedAt?: Date }>
}

const STAGE_ORDER: PipelineStage[] = ['ingest', 'extract', 'cluster', 'framework', 'outline', 'lessons']

export const STAGE_LABELS: Record<PipelineStage, string> = {
  ingest: 'Ingest sources',
  extract: 'Extract concepts',
  cluster: 'Cluster themes',
  framework: 'Build framework',
  outline: 'Generate outline',
  lessons: 'Generate lessons',
}

const states = new Map<string, PipelineState>()

export function getPipelineState(playbookId: string): PipelineState {
  if (!states.has(playbookId)) {
    states.set(playbookId, {
      playbookId,
      stages: Object.fromEntries(
        STAGE_ORDER.map((s) => [s, { status: 'waiting' as StageStatus }])
      ) as PipelineState['stages'],
    })
  }
  return states.get(playbookId)!
}

export function updateStage(playbookId: string, stage: PipelineStage, status: StageStatus, error?: string) {
  const state = getPipelineState(playbookId)
  state.stages[stage] = {
    status,
    error,
    completedAt: status === 'done' ? new Date() : undefined,
  }
}
