import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { ChildProfiles } from "@/components/milestone/child-profiles"
import { MilestoneNavigation } from "@/components/milestone/milestone-navigation"
import { MilestoneBreadcrumbs } from "@/components/milestone/milestone-breadcrumbs"

export default function ChildrenPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="container mx-auto px-4 py-6">
          <MilestoneBreadcrumbs />
          <MilestoneNavigation />
          <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
            <ChildProfiles />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
