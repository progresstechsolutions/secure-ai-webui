import type React from "react"
import { OfflineBanner } from "@/components/milestone/offline-banner"

export default function MilestoneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineBanner />
      {children}
    </div>
  )
}
