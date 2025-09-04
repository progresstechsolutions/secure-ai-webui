"use client"

import { Suspense, useState } from "react"
import { MilestoneDashboard } from "@/components/milestone/milestone-dashboard"
import PageWrapper from "@/components/page-wrapper"

export default function MilestonePage() {
  const [selectedChildId, setSelectedChildId] = useState<string>("")

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
  }

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={handleChildSelect}>
      <div className="container mx-auto px-4 py-6">
        <Suspense fallback={<div className="flex items-center justify-center h-64">Loading...</div>}>
          <MilestoneDashboard selectedChildId={selectedChildId} />
        </Suspense>
      </div>
    </PageWrapper>
  )
}
