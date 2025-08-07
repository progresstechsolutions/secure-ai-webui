"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CommunityFeed } from "@/components/community-feed"

interface CommunityPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const router = useRouter()
  
  // Mock user data - in a real app, you'd get this from your auth system
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

  // Extract slug from params
  const [slug, setSlug] = useState<string>("")
  
  useEffect(() => {
    params.then(p => setSlug(p.slug))
  }, [params])

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading community...</span>
      </div>
    )
  }

  return (
    <CommunityFeed 
      communitySlug={slug} 
      user={user}
      onBack={() => window.history.back()}
    />
  )
} 