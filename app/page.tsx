"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold text-foreground">
                Welcome to Secure AI WebUI
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                A modern web interface for secure document analysis and AI chat
              </p>
              <div className="space-x-4">
                <Link href="/auth/signin">
                  <Button size="lg">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <HealthBinderApp />
        </DocumentProvider>
      </ChildProfileProvider>
    </AuthProvider>
  )
}
