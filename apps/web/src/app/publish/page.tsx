import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'

export default function PublishPage() {
  return (
    <div>
      <ScreenHeader
        title="Publish"
        subtitle="Export and publish your playbooks"
      />
      <div className="mx-8 pb-12">
        <Card className="p-6 text-center py-16">
          <p className="text-sm text-gray-400 mb-1">Select a playbook to publish.</p>
          <p className="text-xs text-gray-400">
            Supports microsite, PDF, markdown, newsletter, and more.
          </p>
        </Card>
      </div>
    </div>
  )
}
