import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { SummaryExport } from "@/components/milestone/summary-export"
import { MilestoneNavigation } from "@/components/milestone/milestone-navigation"
import { MilestoneBreadcrumbs } from "@/components/milestone/milestone-breadcrumbs"
import { RouteGuard } from "@/components/milestone/route-guard"

interface SummaryPageProps {
  params: {
    childId: string
  }
}

export default function SummaryPage({ params }: SummaryPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="container mx-auto px-4 py-6">
          <RouteGuard childId={params.childId}>
            <MilestoneBreadcrumbs childId={params.childId} />
            <MilestoneNavigation childId={params.childId} />
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <SummaryExport childId={params.childId} />
            </Suspense>
          </RouteGuard>
        </div>
      </main>
    </div>
  )
}
