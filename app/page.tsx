"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { ChildProfileProvider } from "@/contexts/child-profile-context"
import { DocumentProvider } from "@/contexts/document-context"
import HealthBinderApp from "@/components/HealthBinderApp"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // For demo: simulate checking onboarding (could be from localStorage, API, etc.)
    const hasOnboarded = localStorage.getItem("hasOnboarded")

    if (hasOnboarded) {
      router.replace("/dashboard")
    }
  }, [router])

  return (
    <AuthProvider>
      <ChildProfileProvider>
        <DocumentProvider>
          <HealthBinderApp />
        </DocumentProvider>
      </ChildProfileProvider>
    </AuthProvider>
  )
}
