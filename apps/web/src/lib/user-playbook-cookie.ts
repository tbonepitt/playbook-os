import type { Playbook } from '@playbook-os/core'

export const USER_PLAYBOOKS_COOKIE = 'playbookos_user_playbooks'

const MAX_COOKIE_PLAYBOOKS = 20

type SerializedPlaybook = Omit<Playbook, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

function serialize(playbook: Playbook): SerializedPlaybook {
  return {
    ...playbook,
    createdAt: playbook.createdAt.toISOString(),
    updatedAt: playbook.updatedAt.toISOString(),
  }
}

function deserialize(playbook: SerializedPlaybook): Playbook {
  return {
    ...playbook,
    createdAt: new Date(playbook.createdAt),
    updatedAt: new Date(playbook.updatedAt),
  }
}

export function encodeUserPlaybooks(playbooks: Playbook[]) {
  return encodeURIComponent(JSON.stringify(playbooks.slice(0, MAX_COOKIE_PLAYBOOKS).map(serialize)))
}

export function decodeUserPlaybooks(value?: string): Playbook[] {
  if (!value) return []

  try {
    const decoded = decodeURIComponent(value)
    const parsed = JSON.parse(decoded) as SerializedPlaybook[]
    if (!Array.isArray(parsed)) return []
    return parsed.map(deserialize)
  } catch {
    return []
  }
}

export function upsertUserPlaybook(playbooks: Playbook[], playbook: Playbook) {
  return [playbook, ...playbooks.filter((p) => p.id !== playbook.id)].slice(0, MAX_COOKIE_PLAYBOOKS)
}
