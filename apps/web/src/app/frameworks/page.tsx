import { ScreenHeader } from '@/components/layout/ScreenHeader'
import { Card } from '@/components/ui/Card'

export default function FrameworksPage() {
  return (
    <div>
      <ScreenHeader
        title="Frameworks"
        subtitle="Named frameworks generated across your playbooks"
      />
      <div className="mx-8 pb-12">
        <Card className="p-6 text-center py-16">
          <p className="text-sm text-gray-400 mb-1">No frameworks yet.</p>
          <p className="text-xs text-gray-400">
            Frameworks are generated automatically when you run the pipeline on a playbook.
          </p>
        </Card>
      </div>
    </div>
  )
}
