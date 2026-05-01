'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { Framework, Pillar } from '@playbook-os/core'

function PillarCard({
  pillar,
  onSave,
}: {
  pillar: Pillar
  onSave: (updated: Pillar) => void
}) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: pillar.name, description: pillar.description })

  function handleSave() {
    onSave({ ...pillar, ...form })
    setEditing(false)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="flex items-start gap-4">
        <span className="text-2xl font-black font-mono text-gray-900 w-8 shrink-0">{pillar.letter}</span>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-3">
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Pillar name"
              />
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                placeholder="Pillar description"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-gray-900">{pillar.name}</p>
              <p className="text-sm text-gray-500 mt-1">{pillar.description}</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 text-xs text-gray-400 hover:text-gray-700 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FrameworkPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [framework, setFramework] = useState<Framework | null>(null)
  const [altIndex, setAltIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/playbooks/${id}/framework`)
      .then((r) => r.json())
      .then((f) => { setFramework(f); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function cycleName() {
    if (!framework) return
    const alts = framework.alternateNames
    if (!alts.length) return
    const next = (altIndex + 1) % alts.length
    setAltIndex(next)
    setFramework({ ...framework, name: alts[next] })
  }

  function updatePillar(updated: Pillar) {
    if (!framework) return
    setFramework({
      ...framework,
      pillars: framework.pillars.map((p) => (p.id === updated.id ? updated : p)),
    })
  }

  if (loading) {
    return (
      <div className="mx-8 mt-8 text-sm text-gray-400">Loading framework…</div>
    )
  }

  if (!framework) {
    return (
      <div className="mx-8 mt-8">
        <Card className="p-8 text-center">
          <p className="text-sm text-gray-500 mb-3">No framework generated yet.</p>
          <Button onClick={() => router.push(`/library/${id}/analysis`)}>
            Run pipeline first →
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader
        title="Framework Builder"
        subtitle="Your named framework — edit pillars inline"
        action={
          <Button onClick={() => router.push(`/library/${id}/outline`)}>
            Build outline →
          </Button>
        }
      />

      <div className="mx-8 space-y-6 pb-12 max-w-3xl">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl font-black font-mono tracking-widest text-gray-900">
              {framework.name}
            </span>
            {framework.alternateNames.length > 0 && (
              <button
                onClick={cycleName}
                className="text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 hover:border-gray-400 transition-colors"
              >
                Try another name ↻
              </button>
            )}
          </div>
          {framework.alternateNames.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Alternates: {framework.alternateNames.join(' · ')}
            </p>
          )}
        </Card>

        <div className="space-y-3">
          {framework.pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} onSave={updatePillar} />
          ))}
        </div>
      </div>
    </div>
  )
}
