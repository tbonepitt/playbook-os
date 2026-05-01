import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'

export default function ToolkitPage() {
  return (
    <div>
      <ScreenHeader
        title="Toolkit"
        subtitle="Artifacts, templates, and worksheets from your playbooks"
      />
      <div className="mx-8 pb-12">
        <Card className="p-6 text-center py-16">
          <p className="text-sm text-gray-400 mb-1">No artifacts yet.</p>
          <p className="text-xs text-gray-400">
            Templates and worksheets appear here after the pipeline generates lessons.
          </p>
        </Card>
      </div>
    </div>
  )
}
