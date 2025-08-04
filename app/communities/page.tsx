"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockCommunities } from "@/components/mock-community-data"
import type { Community as CommunityType } from "@/components/mock-community-data"
import { CommunityManagement } from "@/components/community-management"

export default function CommunitiesPage() {
  const router = useRouter()
  const [userCommunities, setUserCommunities] = useState<CommunityType[]>([])

  // Get user communities from localStorage
  useEffect(() => {
    const savedCommunities = localStorage.getItem('user_communities')
    if (savedCommunities) {
      setUserCommunities(JSON.parse(savedCommunities))
    }
  }, [])

  // Mock user data - in a real app, you'd get this from your auth system
  const user = {
    id: "current-user",
    username: "current_user",
    healthConditions: ["Cystic Fibrosis"],
    location: { region: "United States" }
  }

  const availableConditions = user.healthConditions || [
    "Phelan-McDermid Syndrome (PMS)",
    "Rett Syndrome",
    "Fragile X Syndrome",
    "Angelman Syndrome",
    "Prader-Willi Syndrome",
    "Down Syndrome",
    "Cystic Fibrosis",
    "Sickle Cell Anemia",
    "Huntington's Disease",
    "Spinal Muscular Atrophy (SMA)",
    "Batten Disease",
    "Tay-Sachs Disease",
    "Gaucher Disease",
    "Maple Syrup Urine Disease (MSUD)",
    "Phenylketonuria (PKU)",
    "Other Genetic Condition"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <CommunityManagement
        user={user}
        mockCommunities={mockCommunities}
        allUserCommunities={userCommunities}
        onBack={() => router.back()}
        onJoinCommunity={(community) => {
          // Handle joining community
          const newJoinedCommunity: CommunityType = {
            ...community,
            id: community.id || `joined-${Date.now()}`,
            memberCount: (community.memberCount || 0) + 1,
            color: community.color || "#3b82f6",
            region: community.region ?? "", // Ensure region is always a string
          }
          
          // Update user communities
          const updatedCommunities = [newJoinedCommunity, ...userCommunities]
          setUserCommunities(updatedCommunities)
          localStorage.setItem('user_communities', JSON.stringify(updatedCommunities))
          
          // Dispatch event
          window.dispatchEvent(new CustomEvent('community-updated', { 
            detail: { action: 'joined', community: newJoinedCommunity } 
          }))
        }}
        onLeaveCommunity={(communityId) => {
          // Handle leaving community
          const updatedCommunities = userCommunities.filter(c => c.id !== communityId)
          setUserCommunities(updatedCommunities)
          localStorage.setItem('user_communities', JSON.stringify(updatedCommunities))
          
          // Dispatch event
          window.dispatchEvent(new CustomEvent('community-updated', { 
            detail: { action: 'left', communityId } 
          }))
        }}
        availableConditions={availableConditions}
      />
    </div>
  )
}
