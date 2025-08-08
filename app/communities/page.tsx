"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CommunityManagement } from "@/components/community-management"
import { apiClient, Community } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function CommunitiesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userCommunities, setUserCommunities] = useState<Community[]>([])
  const [allCommunities, setAllCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Convert API Community to component Community interface
  const convertApiCommunity = (apiCommunity: Community): any => ({
    id: apiCommunity._id,
    slug: apiCommunity.slug,
    title: apiCommunity.title || (apiCommunity as any).name || '', // Handle both old and new structure
    description: apiCommunity.description,
    location: apiCommunity.location || { region: '', state: '' },
    tags: apiCommunity.tags || [],
    memberCount: apiCommunity.memberCount || 0,
    lastActivity: apiCommunity.lastActivity || new Date().toISOString(),
    posts: apiCommunity.posts || 0,
    admins: apiCommunity.admins || [],
    createdBy: apiCommunity.createdBy || { id: '', name: 'Unknown' },
    createdAt: apiCommunity.createdAt || new Date().toISOString(),
    isPrivate: apiCommunity.isPrivate || false
  })

  // Fetch user communities and all communities from API
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch user's communities
        const userCommunitiesResponse = await apiClient.getUserCommunities()
        if (userCommunitiesResponse.data) {
          setUserCommunities(userCommunitiesResponse.data.communities || [])
        }
        
        // Fetch all communities for discovery
        const allCommunitiesResponse = await apiClient.getCommunities({ limit: 50 })
        if (allCommunitiesResponse.data) {
          setAllCommunities(allCommunitiesResponse.data.communities || [])
        }
      } catch (err) {
        console.error('Error fetching communities:', err)
        setError('Failed to load communities. Please try again.')
        toast({
          title: "Error",
          description: "Failed to load communities. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCommunities()
  }, [])

  // Listen for community updates from other components
  useEffect(() => {
    const handleCommunityUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent
      const { action, community } = customEvent.detail || {}
      
      if (action === 'created' && community) {
        // Add the new community to user communities
        setUserCommunities(prev => [community, ...prev])
        
        // Also add to all communities if not already there
        setAllCommunities(prev => {
          const exists = prev.some(c => c._id === community._id)
          return exists ? prev : [community, ...prev]
        })
      } else {
        // For other actions, refresh the communities
        try {
          const userCommunitiesResponse = await apiClient.getUserCommunities()
          if (userCommunitiesResponse.data) {
            setUserCommunities(userCommunitiesResponse.data.communities || [])
          }
        } catch (err) {
          console.error('Error refreshing communities:', err)
        }
      }
    }

    window.addEventListener('community-updated', handleCommunityUpdate)
    
    return () => {
      window.removeEventListener('community-updated', handleCommunityUpdate)
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

  const handleJoinCommunity = async (community: any) => {
    try {
      const response = await apiClient.joinCommunity(community.id)
      if (response.data || response.message) {
        // Add to user communities
        const newJoinedCommunity = {
          ...community,
          memberCount: (community.memberCount || 0) + 1,
        }
        
        // Update local state
        setUserCommunities(prev => [newJoinedCommunity, ...prev])
        
        toast({
          title: "Success",
          description: `Successfully joined ${community.name}!`,
        })
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('community-updated', { 
          detail: { action: 'joined', community: newJoinedCommunity } 
        }))
      }
    } catch (err) {
      console.error('Error joining community:', err)
      toast({
        title: "Error",
        description: `Failed to join ${community.name}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleLeaveCommunity = async (communityId: string) => {
    try {
      const response = await apiClient.leaveCommunity(communityId)
      if (response.data || response.message) {
        // Remove from user communities
        setUserCommunities(prev => prev.filter(c => c._id !== communityId))
        
        toast({
          title: "Success",
          description: "Successfully left the community!",
        })
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('community-updated', { 
          detail: { action: 'left', communityId } 
        }))
      }
    } catch (err) {
      console.error('Error leaving community:', err)
      toast({
        title: "Error",
        description: "Failed to leave community. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading communities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <CommunityManagement
        user={user}
        mockCommunities={allCommunities.map(convertApiCommunity)}
        allUserCommunities={userCommunities.map(convertApiCommunity)}
        onBack={() => window.history.back()}
        onJoinCommunity={handleJoinCommunity}
        onLeaveCommunity={handleLeaveCommunity}
        availableConditions={availableConditions}
      />
    </div>
  )
}
