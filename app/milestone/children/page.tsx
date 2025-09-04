import { Suspense } from "react"
import { Navigation } from "@/components/navigation"
import { ChildProfiles } from "@/components/milestone/child-profiles"
import { MilestoneNavigation } from "@/components/milestone/milestone-navigation"
import { MilestoneBreadcrumbs } from "@/components/milestone/milestone-breadcrumbs"

export default function ChildrenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />
      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            <MilestoneBreadcrumbs />
            <MilestoneNavigation />
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600">Loading children profiles...</p>
                  </div>
                </div>
              }
            >
              <ChildProfiles />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
