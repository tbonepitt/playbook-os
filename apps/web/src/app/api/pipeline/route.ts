import { NextRequest, NextResponse } from 'next/server'
import type { PipelineState, PipelineStage, StageStatus } from '@/lib/pipeline-state'
import { repo } from '@/lib/repo'
import { prisma } from '@/lib/prisma'

const STAGE_ORDER: PipelineStage[] = ['ingest', 'extract', 'cluster', 'framework', 'outline', 'lessons']

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function initialState(playbookId: string): PipelineState {
  return {
    playbookId,
    stages: Object.fromEntries(STAGE_ORDER.map((s) => [s, { status: 'waiting' as StageStatus }])) as PipelineState['stages'],
  }
}

async function saveState(runId: string, state: PipelineState, status = 'running', error?: string) {
  await prisma.pipelineRun.update({ where: { id: runId }, data: { stages: state, status, error } })
}

async function mark(runId: string, state: PipelineState, stage: PipelineStage, status: StageStatus, error?: string) {
  state.stages[stage] = { status, error, completedAt: status === 'done' ? new Date() : undefined }
  await saveState(runId, state, error ? 'error' : 'running', error)
}

export async function GET(req: NextRequest) {
  const playbookId = req.nextUrl.searchParams.get('playbookId')
  if (!playbookId) return NextResponse.json({ error: 'Missing playbookId' }, { status: 400 })

  if (!process.env.DATABASE_URL) return NextResponse.json(initialState(playbookId))

  const run = await prisma.pipelineRun.findFirst({ where: { playbookId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(run ? run.stages : initialState(playbookId))
}

export async function POST(req: NextRequest) {
  const { playbookId } = await req.json()
  if (typeof playbookId !== 'string') return NextResponse.json({ error: 'Missing playbookId' }, { status: 400 })

  const playbook = await repo.playbooks.get(playbookId)
  if (!playbook) return NextResponse.json({ error: 'Playbook not found' }, { status: 404 })

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Generation is temporarily unavailable. Please try again later.' },
      { status: 503 },
    )
  }

  const state = initialState(playbookId)
  const run = await prisma.pipelineRun.create({ data: { id: makeId('run'), playbookId, stages: state, status: 'running' } })

  try {
    await runPipeline(run.id, playbookId, state)
    await saveState(run.id, state, 'done')
    return NextResponse.json({ started: true, completed: true, runId: run.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await saveState(run.id, state, 'error', message)
    return NextResponse.json({ error: message, runId: run.id }, { status: 500 })
  }
}

async function runPipeline(runId: string, playbookId: string, state: PipelineState) {
  const { extractConcepts, generateFramework, generateOutline, generateLessons } = await import('@playbook-os/generators')
  const { urlAdapter, githubAdapter } = await import('@playbook-os/pipeline')

  const playbook = await repo.playbooks.get(playbookId)
  if (!playbook) throw new Error('Playbook not found')
  const sources = await repo.playbooks.sources(playbookId)

  await mark(runId, state, 'ingest', 'running')
  let combinedText = ''
  for (const src of sources) {
    try {
      let text = src.rawText ?? ''
      if (!text && (src.type === 'article' || src.type === 'markdown')) text = (await urlAdapter.fetch(src)).text
      if (!text && src.type === 'github') text = (await githubAdapter.fetch(src)).text
      if (text.trim()) {
        combinedText += `\n\n## ${src.name}\n\n${text}`
        await repo.sources.update(src.id, { status: 'extracted', rawText: text, size: `${text.length.toLocaleString()} chars` })
      }
    } catch (err) {
      await repo.sources.update(src.id, { status: 'error' })
      throw err
    }
  }
  if (!combinedText.trim()) throw new Error('No extractable source text. Add a raw text/markdown, URL/article, or GitHub source first.')
  await mark(runId, state, 'ingest', 'done')

  await mark(runId, state, 'extract', 'running')
  const concepts = await extractConcepts(combinedText, playbookId)
  await mark(runId, state, 'extract', 'done')

  await mark(runId, state, 'cluster', 'running')
  await mark(runId, state, 'cluster', 'done')

  await mark(runId, state, 'framework', 'running')
  const framework = await generateFramework(concepts, playbookId)
  await repo.frameworks.upsert(framework)
  await mark(runId, state, 'framework', 'done')

  await mark(runId, state, 'outline', 'running')
  const outlineModules = await generateOutline(framework, concepts)
  await repo.playbooks.update(playbookId, { modules: outlineModules, status: 'reviewing' })
  await mark(runId, state, 'outline', 'done')

  await mark(runId, state, 'lessons', 'running')
  const lessonModules = []
  for (const mod of outlineModules) {
    lessonModules.push(await generateLessons(mod, concepts))
  }
  await repo.playbooks.update(playbookId, { modules: lessonModules, status: 'reviewing' })
  await mark(runId, state, 'lessons', 'done')
}
