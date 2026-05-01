type BadgeVariant = 'draft' | 'reviewing' | 'published' | 'ready' | 'error' | 'pending' | 'extracted'

const styles: Record<BadgeVariant, string> = {
  draft: 'bg-gray-100 text-gray-600',
  reviewing: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  published: 'bg-gray-900 text-white',
  ready: 'bg-green-50 text-green-700 border border-green-200',
  error: 'bg-red-50 text-red-700 border border-red-200',
  pending: 'bg-gray-100 text-gray-500',
  extracted: 'bg-blue-50 text-blue-700 border border-blue-200',
}

export function Badge({ status }: { status: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
