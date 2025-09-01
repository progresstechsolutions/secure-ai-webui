"use client"

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
  // For now, we'll use a mock user since we need client-side access
  // In a real app, you'd handle auth differently for client components
  const user = {
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

  return (
    <div>
      
      <CommunityHome user={communityHomeUser} />
    </div>
  )
}
