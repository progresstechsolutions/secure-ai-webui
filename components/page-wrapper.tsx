"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { GlobalHeader } from "@/components/global-header"
import { useNavigation } from "@/components/navigation-context"
import { cn } from "@/lib/utils"

interface PageWrapperProps {
  children: React.ReactNode
  selectedChildId?: string
  onChildSelect?: (childId: string) => void
  showChildSelector?: boolean
}

export function PageWrapper({ children, selectedChildId, onChildSelect, showChildSelector = true }: PageWrapperProps) {
  const { isPinned } = useNavigation() // Get pinned state from navigation context

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <GlobalHeader
        selectedChildId={selectedChildId}
        onChildSelect={onChildSelect}
        showChildSelector={showChildSelector}
      />
      <main
        className={cn(
          "pt-16 transition-all duration-300 ease-in-out", // Added transition for smooth adjustment
          isPinned
            ? "pl-52 lg:pl-56 xl:pl-60" // Adjust padding when navigation is pinned
            : "pl-12 lg:pl-14", // Default padding when navigation is collapsed
        )}
      >
        {children}
      </main>
    </div>
  )
}

export default PageWrapper
