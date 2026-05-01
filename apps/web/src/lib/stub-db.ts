import type { Playbook, Source } from '@playbook-os/core'

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

const PLAYBOOKS: Playbook[] = [
  {
    id: 'pb-1',
    title: 'Agentic Systems: Build Your First AI Workflow',
    audience: 'Product managers & engineers',
    goal: 'Understand and deploy agentic AI workflows',
    tone: 'Practical',
    outputTypes: ['private-course'],
    sourceIds: ['src-1', 'src-2'],
    frameworkId: 'fw-1',
    modules: [],
    artifacts: [],
    status: 'reviewing',
    createdAt: new Date('2024-11-12'),
    updatedAt: new Date('2024-11-14'),
  },
  {
    id: 'pb-2',
    title: 'AI Product Builder Playbook',
    audience: 'Startup founders',
    goal: 'Ship AI-powered products faster',
    tone: 'Energetic',
    outputTypes: ['public-playbook', 'lead-magnet'],
    sourceIds: ['src-2'],
    modules: [],
    artifacts: [],
    status: 'draft',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-10'),
  },
  {
    id: 'pb-3',
    title: 'Product Strategy for the AI Age — Spring 2025 Playbook',
    audience: 'Senior product leaders',
    goal: 'Adapt product strategy for the AI era',
    tone: 'Executive',
    outputTypes: ['workshop', 'consulting-artifact'],
    sourceIds: ['src-3'],
    modules: [],
    artifacts: [],
    status: 'published',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-11-05'),
  },
]

const SOURCES: Source[] = [
  {
    id: 'src-1',
    type: 'pdf',
    url: '',
    name: 'Agentic AI System Design Handbook.pdf',
    size: '48 pages',
    status: 'extracted',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10'),
  },
  {
    id: 'src-2',
    type: 'github',
    url: 'https://github.com/anthropics/anthropic-cookbook',
    name: 'anthropic-cookbook',
    size: '34 files',
    status: 'extracted',
    createdAt: new Date('2024-11-08'),
    updatedAt: new Date('2024-11-08'),
  },
  {
    id: 'src-3',
    type: 'youtube',
    url: 'https://youtube.com/watch?v=example',
    name: 'Building With Claude — Dev Day Talk',
    size: '42 min',
    status: 'validated',
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-18'),
  },
]

// In-memory store (replace with Prisma when DB is wired)
let playbooks = [...PLAYBOOKS]
let sources = [...SOURCES]

export const db = {
  playbooks: {
    list: (): Playbook[] => [...playbooks].sort((a, b) => +b.updatedAt - +a.updatedAt),
    get: (id: string): Playbook | undefined => playbooks.find((p) => p.id === id),
    create: (data: Omit<Playbook, 'id' | 'modules' | 'artifacts' | 'createdAt' | 'updatedAt'>): Playbook => {
      const now = new Date()
      const p: Playbook = { ...data, id: `pb-${makeId()}`, modules: [], artifacts: [], createdAt: now, updatedAt: now }
      playbooks.push(p)
      return p
    },
    update: (id: string, patch: Partial<Playbook>): Playbook | undefined => {
      const idx = playbooks.findIndex((p) => p.id === id)
      if (idx < 0) return undefined
      playbooks[idx] = { ...playbooks[idx], ...patch, updatedAt: new Date() }
      return playbooks[idx]
    },
    delete: (id: string): boolean => {
      const before = playbooks.length
      playbooks = playbooks.filter((p) => p.id !== id)
      return playbooks.length < before
    },
  },
  sources: {
    list: (): Source[] => [...sources].sort((a, b) => +b.createdAt - +a.createdAt),
    get: (id: string): Source | undefined => sources.find((s) => s.id === id),
    create: (data: Omit<Source, 'id' | 'createdAt' | 'updatedAt'>): Source => {
      const now = new Date()
      const s: Source = { ...data, id: `src-${makeId()}`, createdAt: now, updatedAt: now }
      sources.push(s)
      return s
    },
    update: (id: string, patch: Partial<Source>): Source | undefined => {
      const idx = sources.findIndex((s) => s.id === id)
      if (idx < 0) return undefined
      sources[idx] = { ...sources[idx], ...patch, updatedAt: new Date() }
      return sources[idx]
    },
  },
}
