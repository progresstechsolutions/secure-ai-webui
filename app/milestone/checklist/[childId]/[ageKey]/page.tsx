import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { MilestoneChecklist } from "@/components/milestone/milestone-checklist"
import { MilestoneNavigation } from "@/components/milestone/milestone-navigation"
import { MilestoneBreadcrumbs } from "@/components/milestone/milestone-breadcrumbs"
import { RouteGuard } from "@/components/milestone/route-guard"

interface ChecklistPageProps {
  params: {
    childId: string
    ageKey: string
  }
}

export default function ChecklistPage({ params }: ChecklistPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="container mx-auto px-4 py-6">
          <RouteGuard childId={params.childId}>
            <MilestoneBreadcrumbs childId={params.childId} ageKey={params.ageKey} />
            <MilestoneNavigation childId={params.childId} ageKey={params.ageKey} />
            <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
              <MilestoneChecklist childId={params.childId} ageKey={params.ageKey} />
            </Suspense>
          </RouteGuard>
        </div>
      </main>
    </div>
  )
}
