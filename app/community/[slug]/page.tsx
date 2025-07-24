"use client"
import { useRouter, useParams } from "next/navigation"
import { CommunityFeed } from "@/components/community-feed"
import { ArrowLeft, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CommunityPage() {
  const router = useRouter()
  const params = useParams()
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ""

  // Optionally, fetch user from context or props if needed
  const user = {} // Replace with actual user logic if available

  return (
   
   
        <CommunityFeed communitySlug={slug} onBack={() => router.back()} user={user} />
     
  
  )
} 