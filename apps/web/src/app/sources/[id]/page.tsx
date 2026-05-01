import { notFound } from 'next/navigation'
import { db } from '@/lib/stub-db'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export default async function SourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const source = db.sources.get(id)
  if (!source) notFound()

  return (
    <div>
      <ScreenHeader
        title={source.name}
        subtitle={source.type}
        action={<Badge status={source.status} />}
      />

      <div className="mx-8 space-y-6 pb-12">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-1">URL</p>
              <p className="text-gray-800 break-all">{source.url || '—'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Size</p>
              <p className="text-gray-800">{source.size ?? '—'}</p>
            </div>
          </div>
        </Card>

        {source.extracted && (
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Extracted concepts ({source.extracted.concepts.length})
            </h2>
            <ul className="space-y-2">
              {source.extracted.concepts.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  {c.label}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!source.extracted && (
          <Card className="p-6 text-center py-12">
            <p className="text-sm text-gray-400 mb-1">No extraction data yet.</p>
            <p className="text-xs text-gray-400">Run the pipeline from a linked playbook to extract concepts.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
