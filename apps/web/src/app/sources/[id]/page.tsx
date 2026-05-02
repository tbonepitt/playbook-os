import Link from 'next/link'
import { notFound } from 'next/navigation'
import { repo } from '@/lib/repo'
import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

function isExternalUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\//i.test(value))
}

export default async function SourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const source = await repo.sources.get(id)
  if (!source) notFound()

  const hasExternalUrl = isExternalUrl(source.url)
  const sourceText = source.rawText || (source.type === 'markdown' ? source.url : undefined)

  return (
    <div>
      <ScreenHeader
        title={source.name}
        subtitle={source.type}
        action={
          <div className="flex items-center gap-3">
            {hasExternalUrl && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
              >
                Open original ↗
              </a>
            )}
            <Badge status={source.status} />
          </div>
        }
      />

      <div className="mx-8 space-y-6 pb-12">
        <Card className="space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Details</h2>
          <div className="grid gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-gray-400">Original source</p>
              {hasExternalUrl ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {source.url}
                </a>
              ) : (
                <p className="text-gray-800 break-all">{source.url ? 'Pasted text / markdown' : '—'}</p>
              )}
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400">Size</p>
              <p className="text-gray-800">{source.size ?? '—'}</p>
            </div>
          </div>
        </Card>

        {sourceText && (
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Source content</h2>
              {hasExternalUrl && (
                <a href={source.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                  View original ↗
                </a>
              )}
            </div>
            <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-800">
              {sourceText}
            </pre>
          </Card>
        )}

        {source.extracted && (
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Extracted concepts ({source.extracted.concepts.length})
            </h2>
            <ul className="space-y-2">
              {source.extracted.concepts.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  {c.label}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!source.extracted && (
          <Card className="p-6 py-12 text-center">
            <p className="mb-1 text-sm text-gray-400">No extraction data yet.</p>
            <p className="text-xs text-gray-400">Run the pipeline from a linked playbook to extract concepts.</p>
          </Card>
        )}

        <Link href="/sources" className="inline-flex text-sm font-medium text-gray-500 hover:text-gray-900">
          ← Back to sources
        </Link>
      </div>
    </div>
  )
}
