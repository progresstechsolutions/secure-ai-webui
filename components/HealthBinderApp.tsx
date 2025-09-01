"use client"

import { useState, useEffect } from "react"
import { HamburgerNavigation } from "./layout/HamburgerNavigation"
import { useChildProfile } from "../contexts/child-profile-context"
import { UploadTab } from "./features/upload/UploadTab"
import { DocumentsTab } from "./features/documents/DocumentsTab"
import { DashboardTab } from "./features/dashboard/DashboardTab"
import { ManageChildren } from "./features/manage-children/ManageChildren"
import { Toaster } from "./ui/toaster"

export default function HealthBinderApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { children, activeChild, setActiveChild } = useChildProfile()

  useEffect(() => {
    // Set active tab based on URL hash on initial load
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        setActiveTab(hash)
      } else {
        setActiveTab("dashboard")
      }
    }

    // Handle custom navigation events
    const handleNavigationChange = (event: CustomEvent) => {
      setActiveTab(event.detail.tab)
    }

    handleHashChange() // Call on mount
    window.addEventListener("hashchange", handleHashChange)
    window.addEventListener("navigation-change", handleNavigationChange as EventListener)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("navigation-change", handleNavigationChange as EventListener)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HamburgerNavigation />
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {activeTab === "upload" && <UploadTab />}
        {activeTab === "documents" && <DocumentsTab />}
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "patient-management" && (
          <ManageChildren
            children={children}
            activeChildId={activeChild?.id}
            onChildrenChange={(newChildren) => {
              // This would need to be implemented in the context
              console.log("Children updated:", newChildren)
            }}
            onActiveChildChange={(childId) => {
              const child = children.find(c => c.id === childId)
              setActiveChild(child || null)
            }}
            onNavigateToDocuments={() => setActiveTab("documents")}
          />
        )}
        {/* Add other tabs as needed */}
      </main>
      <Toaster />
    </div>
  )
}
