import type { Prisma } from '@prisma/client'
import type { Artifact, Framework, Module, Playbook, Source } from '@playbook-os/core'
import { prisma } from './prisma'
import { db as stubDb } from './stub-db'

const hasDatabase = Boolean(process.env.DATABASE_URL)
const fallbackFrameworks = new Map<string, Framework>()

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function asModules(value: Prisma.JsonValue | null | undefined): Module[] {
  return Array.isArray(value) ? (value as unknown as Module[]) : []
}

function asArtifacts(value: Prisma.JsonValue | null | undefined): Artifact[] {
  return Array.isArray(value) ? (value as unknown as Artifact[]) : []
}

function toSource(row: {
  id: string
  type: string
  url: string
  name: string
  size: string | null
  status: string
  rawText: string | null
  extracted: Prisma.JsonValue | null
  createdAt: Date
  updatedAt: Date
}): Source {
  return {
    id: row.id,
    type: row.type as Source['type'],
    url: row.url,
    name: row.name,
    size: row.size ?? undefined,
    status: row.status as Source['status'],
    rawText: row.rawText ?? undefined,
    extracted: row.extracted ? (row.extracted as Source['extracted']) : undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

function toFramework(row: {
  id: string
  playbookId: string
  name: string
  pillars: Prisma.JsonValue
  alternateNames: Prisma.JsonValue
}): Framework {
  return {
    id: row.id,
    playbookId: row.playbookId,
    name: row.name,
    pillars: Array.isArray(row.pillars) ? (row.pillars as unknown as Framework['pillars']) : [],
    alternateNames: asStringArray(row.alternateNames),
  }
}

function toPlaybook(row: {
  id: string
  title: string
  audience: string
  goal: string
  tone: string
  outputTypes: Prisma.JsonValue
  status: string
  frameworkId: string | null
  modules: Prisma.JsonValue
  artifacts: Prisma.JsonValue
  publishConfig: Prisma.JsonValue | null
  createdAt: Date
  updatedAt: Date
  sources?: { sourceId: string }[]
}): Playbook {
  return {
    id: row.id,
    title: row.title,
    audience: row.audience,
    goal: row.goal,
    tone: row.tone,
    outputTypes: asStringArray(row.outputTypes) as Playbook['outputTypes'],
    sourceIds: row.sources?.map((s) => s.sourceId) ?? [],
    frameworkId: row.frameworkId ?? undefined,
    modules: asModules(row.modules),
    artifacts: asArtifacts(row.artifacts),
    status: row.status as Playbook['status'],
    publishConfig: row.publishConfig ? (row.publishConfig as unknown as Playbook['publishConfig']) : undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }
}

export const repo = {
  playbooks: {
    async list(): Promise<Playbook[]> {
      if (!hasDatabase) return stubDb.playbooks.list()
      const rows = await prisma.playbook.findMany({ orderBy: { updatedAt: 'desc' }, include: { sources: true } })
      return rows.map(toPlaybook)
    },
    async get(id: string): Promise<Playbook | undefined> {
      if (!hasDatabase) return stubDb.playbooks.get(id)
      const row = await prisma.playbook.findUnique({ where: { id }, include: { sources: true } })
      return row ? toPlaybook(row) : undefined
    },
    async create(data: Pick<Playbook, 'title' | 'audience' | 'goal' | 'tone' | 'outputTypes'>): Promise<Playbook> {
      if (!hasDatabase) return stubDb.playbooks.create({ ...data, sourceIds: [], status: 'draft' })
      const row = await prisma.playbook.create({
        data: {
          id: makeId('pb'),
          title: data.title,
          audience: data.audience,
          goal: data.goal,
          tone: data.tone,
          outputTypes: data.outputTypes,
          modules: [],
          artifacts: [],
          status: 'draft',
        },
        include: { sources: true },
      })
      return toPlaybook(row)
    },
    async update(id: string, patch: Partial<Playbook>): Promise<Playbook | undefined> {
      if (!hasDatabase) return stubDb.playbooks.update(id, patch)
      const row = await prisma.playbook.update({
        where: { id },
        data: {
          title: patch.title,
          audience: patch.audience,
          goal: patch.goal,
          tone: patch.tone,
          outputTypes: patch.outputTypes,
          status: patch.status,
          frameworkId: patch.frameworkId,
          modules: patch.modules as Prisma.InputJsonValue | undefined,
          artifacts: patch.artifacts as Prisma.InputJsonValue | undefined,
          publishConfig: patch.publishConfig as Prisma.InputJsonValue | undefined,
        },
        include: { sources: true },
      }).catch(() => null)
      return row ? toPlaybook(row) : undefined
    },
    async attachSource(playbookId: string, sourceId: string) {
      if (!hasDatabase) {
        const playbook = stubDb.playbooks.get(playbookId)
        if (playbook && !playbook.sourceIds.includes(sourceId)) {
          stubDb.playbooks.update(playbookId, { sourceIds: [...playbook.sourceIds, sourceId] })
        }
        return
      }
      await prisma.playbookSource.upsert({
        where: { playbookId_sourceId: { playbookId, sourceId } },
        update: {},
        create: { playbookId, sourceId },
      })
    },
    async sources(playbookId: string): Promise<Source[]> {
      if (!hasDatabase) {
        const playbook = stubDb.playbooks.get(playbookId)
        return playbook?.sourceIds.map((id) => stubDb.sources.get(id)).filter((s): s is Source => Boolean(s)) ?? []
      }
      const rows = await prisma.playbookSource.findMany({ where: { playbookId }, include: { source: true }, orderBy: { createdAt: 'desc' } })
      return rows.map((r) => toSource(r.source))
    },
  },
  sources: {
    async list(): Promise<Source[]> {
      if (!hasDatabase) return stubDb.sources.list()
      const rows = await prisma.source.findMany({ orderBy: { createdAt: 'desc' } })
      return rows.map(toSource)
    },
    async get(id: string): Promise<Source | undefined> {
      if (!hasDatabase) return stubDb.sources.get(id)
      const row = await prisma.source.findUnique({ where: { id } })
      return row ? toSource(row) : undefined
    },
    async create(data: Omit<Source, 'id' | 'createdAt' | 'updatedAt'>): Promise<Source> {
      if (!hasDatabase) return stubDb.sources.create(data)
      const row = await prisma.source.create({
        data: {
          id: makeId('src'),
          type: data.type,
          url: data.url,
          name: data.name,
          size: data.size,
          status: data.status,
          rawText: data.rawText,
          extracted: data.extracted as Prisma.InputJsonValue | undefined,
        },
      })
      return toSource(row)
    },
    async update(id: string, patch: Partial<Source>): Promise<Source | undefined> {
      if (!hasDatabase) return stubDb.sources.update(id, patch)
      const row = await prisma.source.update({
        where: { id },
        data: {
          type: patch.type,
          url: patch.url,
          name: patch.name,
          size: patch.size,
          status: patch.status,
          rawText: patch.rawText,
          extracted: patch.extracted as Prisma.InputJsonValue | undefined,
        },
      }).catch(() => null)
      return row ? toSource(row) : undefined
    },
  },
  frameworks: {
    async get(playbookId: string): Promise<Framework | undefined> {
      if (!hasDatabase) return fallbackFrameworks.get(playbookId)
      const row = await prisma.framework.findUnique({ where: { playbookId } })
      return row ? toFramework(row) : undefined
    },
    async upsert(framework: Framework): Promise<Framework> {
      if (!hasDatabase) {
        fallbackFrameworks.set(framework.playbookId, framework)
        stubDb.playbooks.update(framework.playbookId, { frameworkId: framework.id })
        return framework
      }
      const row = await prisma.framework.upsert({
        where: { playbookId: framework.playbookId },
        update: { name: framework.name, pillars: framework.pillars as unknown as Prisma.InputJsonValue, alternateNames: framework.alternateNames },
        create: {
          id: framework.id,
          playbookId: framework.playbookId,
          name: framework.name,
          pillars: framework.pillars as unknown as Prisma.InputJsonValue,
          alternateNames: framework.alternateNames,
        },
      })
      await prisma.playbook.update({ where: { id: framework.playbookId }, data: { frameworkId: row.id } }).catch(() => null)
      return toFramework(row)
    },
  },
}
