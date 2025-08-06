"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import CommunityHome from "@/components/community-home"

interface DashboardUser {
  id: string
  email?: string | null
  name?: string | null
  username: string
  image?: string | null
  healthConditions: string[]
  location: {
    region: string
    state?: string
  }
}

export default function DashboardPage() {
  const router = useRouter()

  // Check if user has completed onboarding
  useEffect(() => {
    const completedUser = localStorage.getItem('completed_user')
    const pendingUser = localStorage.getItem('pending_user')
    const onboardingData = localStorage.getItem('user_onboarding')
    
    if (!completedUser) {
      if (pendingUser) {
        // User completed profile but not guided onboarding
        router.push('/onboarding/guided')
      } else if (!onboardingData) {
        // User hasn't started onboarding at all
        router.push('/onboarding')
      } else {
        // User has onboarding data but no pending user, redirect to guided
        router.push('/onboarding/guided')
      }
    }
  }, [router])

  // For now, we'll use a mock user since we need client-side access
  // In a real app, you'd handle auth differently for client components
  const user: DashboardUser = {
    id: "current-user",
    email: "user@example.com",
    name: "Current User",
    username: "current_user",
    image: "/placeholder-user.jpg",
    healthConditions: ["Cystic Fibrosis"],
    location: {
      region: "United States",
      state: "California"
    }
  }

  // Transform user data to match CommunityHome interface
  const communityHomeUser = {
    username: user.username,
    conditions: user.healthConditions,
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    location: user.location
  }

  return <CommunityHome user={communityHomeUser} />
}
