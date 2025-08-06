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
    return <div>Loading...</div>
  }

  return (
    <CommunityFeed 
      communitySlug={slug} 
      user={user}
      onBack={() => router.back()}
    />
  )
} 