"use client"

import { GlobalHeader } from "@/components/global-header"

interface PageLayoutProps {
  children: React.ReactNode
  user?: any
  currentPage?: string
  showSearch?: boolean
  onSearchToggle?: () => void
  showHeaderOnMobile?: boolean
}

export function PageLayout({ 
  children, 
  user, 
  currentPage, 
  showSearch = false, 
  onSearchToggle,
  showHeaderOnMobile = false
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <GlobalHeader 
        user={user} 
        currentPage={currentPage}
        showSearch={showSearch}
        onSearchToggle={onSearchToggle}
        showOnMobile={showHeaderOnMobile}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
