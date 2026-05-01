import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/stub-db'
import { getPipelineState, updateStage } from '@/lib/pipeline-state'

export async function GET(req: NextRequest) {
  const playbookId = req.nextUrl.searchParams.get('playbookId')
  if (!playbookId) return NextResponse.json({ error: 'Missing playbookId' }, { status: 400 })
  return NextResponse.json(getPipelineState(playbookId))
}

export async function POST(req: NextRequest) {
  const { playbookId } = await req.json()
  const playbook = db.playbooks.get(playbookId)
  if (!playbook) return NextResponse.json({ error: 'Playbook not found' }, { status: 404 })

  // Run pipeline async (fire and forget for now — streaming status via polling)
  runPipeline(playbookId).catch(console.error)

  return NextResponse.json({ started: true })
}

async function runPipeline(playbookId: string) {
  const { extractConcepts, generateFramework, generateOutline } = await import('@playbook-os/generators')
  const { urlAdapter } = await import('@playbook-os/pipeline')

  const playbook = db.playbooks.get(playbookId)!
  const sources = playbook.sourceIds.map((id) => db.sources.get(id)).filter(Boolean)

  updateStage(playbookId, 'ingest', 'running')
  let combinedText = ''

  for (const src of sources) {
    if (!src) continue
    try {
      if (src.type === 'article' || src.type === 'markdown') {
        const raw = await urlAdapter.fetch(src)
        combinedText += `\n\n## ${src.name}\n\n${raw.text}`
        db.sources.update(src.id, { status: 'extracted', rawText: raw.text })
      }
    } catch {
      db.sources.update(src.id, { status: 'error' })
    }
  }
  updateStage(playbookId, 'ingest', 'done')

  if (!combinedText.trim()) {
    combinedText = sources.map((s) => `Source: ${s?.name}`).join('\n')
  }

  updateStage(playbookId, 'extract', 'running')
  const concepts = await extractConcepts(combinedText, playbookId)
  updateStage(playbookId, 'extract', 'done')

  updateStage(playbookId, 'cluster', 'running')
  // Clustering is a pass-through for now; concepts already have themeId potential
  updateStage(playbookId, 'cluster', 'done')

  updateStage(playbookId, 'framework', 'running')
  const framework = await generateFramework(concepts, playbookId)
  db.playbooks.update(playbookId, { frameworkId: framework.id })
  // Store framework in a side-channel (extend stub-db if needed)
  updateStage(playbookId, 'framework', 'done')

  updateStage(playbookId, 'outline', 'running')
  const modules = await generateOutline(framework, concepts)
  db.playbooks.update(playbookId, { modules, status: 'reviewing' })
  updateStage(playbookId, 'outline', 'done')
}
