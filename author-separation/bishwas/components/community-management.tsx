"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCommunityModal } from "./create-community-modal"
import { 
  useSearchCommunities, 
  useCreateCommunity, 
  useUserCommunities, 
  useJoinCommunity, 
  useLeaveCommunity,
  useSearchUsers
} from "@/hooks/use-api"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Crown,
  UserCheck,
  UserX,
  TrendingUp,
  Heart,
  MessageSquare,
  Star,
  MapPin,
  Calendar,
  Activity,
  MoreVertical,
  ExternalLink,
  X,
  ArrowLeft
} from "lucide-react"

interface Community {
  id: string
  slug: string
  title: string
  description: string
  location: {
    region: string
    state?: string
  }
  tags: string[]
  memberCount: number
  lastActivity: string
  posts: number
  admins: Array<{ id: string; name: string; email?: string }>
  createdBy: { id: string; name: string; email?: string }
  createdAt: string
  isPrivate?: boolean
}

interface CommunityManagementProps {
  user?: any
  onBack?: () => void
}

export const CommunityManagement: React.FC<CommunityManagementProps> = ({
  user,
  onBack
}) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("discover")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    condition: "all",
    region: "all",
    category: "all"
  })
  const [showExpandedSearch, setShowExpandedSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<Community[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // Track if user has performed a search

  // Refs for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Backend API hooks
  const { createCommunity, loading: creatingCommunity } = useCreateCommunity()
  const { communities: userCommunities, loading: loadingUserCommunities, refetch: refetchUserCommunities } = useUserCommunities()
  const { joinCommunity, loading: joiningCommunity } = useJoinCommunity()
  const { leaveCommunity, loading: leavingCommunity } = useLeaveCommunity()
  const { searchCommunities, loading: searchLoading } = useSearchCommunities()
  
  // Load filter options with fallbacks
  const availableConditions = [
    'Diabetes', 'Heart Disease', 'Cancer', 'Autism', 'ADHD', 'Depression', 
    'Anxiety', 'Asthma', 'Allergies', 'Other'
  ]
  const availableRegions = [
    'North America', 'South America', 'Europe', 'Asia', 'Africa', 
    'Australia', 'Antarctica', 'Global'
  ]
  const availableCategories = [
    'Support', 'Medical', 'Research', 'Social', 'Educational', 'Advocacy'
  ]

  // Transform user communities to match local interface - memoized
  const allUserCommunities = useMemo(() => {
    return userCommunities.map(community => ({
      ...community,
      id: community._id,
      title: community.title || '',
      location: community.location || { region: "Global", state: '' },
      tags: community.tags || [],
      posts: community.posts || 0,
      lastActivity: community.lastActivity || 'Active',
      admins: community.admins || [],
      createdBy: community.createdBy || { id: '', name: 'Unknown' },
      createdAt: community.createdAt || new Date().toISOString(),
    }))
  }, [userCommunities])

  // Manual search function - only called when user explicitly searches
  const performSearch = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    // Check if we should search
    const hasSearchQuery = searchQuery.trim().length > 0
    const hasActiveFilters = searchFilters.condition !== "all" || 
                           searchFilters.region !== "all" || 
                           searchFilters.category !== "all"

    if (!hasSearchQuery && !hasActiveFilters) {
      setSearchResults([])
      setIsSearching(false)
      setHasSearched(false)
      return
    }

    // Don't search if we're already searching or if there's no search API available
    if (isSearching || !searchCommunities) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const searchParams = {
        query: searchQuery.trim(),
        ...(searchFilters.condition !== "all" && { condition: searchFilters.condition }),
        ...(searchFilters.region !== "all" && { region: searchFilters.region }),
        ...(searchFilters.category !== "all" && { category: searchFilters.category })
      }

      const result = await searchCommunities(searchParams)
      
      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      if (result?.data?.communities) {
        const mappedCommunities = result.data.communities.map((c: any) => ({
          id: c._id,
          slug: c.slug,
          title: c.title || '', 
          description: c.description,
          memberCount: c.memberCount || 0,
          location: c.location || { 
            region: c.tags?.find((tag: string) => availableRegions.includes(tag)) || "Global",
            state: ''
          },
          tags: c.tags || [],
          posts: c.posts || 0,
          lastActivity: c.lastActivity || new Date().toISOString(),
          admins: c.admins || [],
          createdBy: c.createdBy || { id: '', name: 'Unknown' },
          createdAt: c.createdAt || new Date().toISOString(),
          isPrivate: c.isPrivate || false
        }))
        setSearchResults(mappedCommunities)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      // Don't log cancelled requests
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Search failed:', error)
        setSearchResults([])
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsSearching(false)
      }
    }
  }, [searchQuery, searchFilters, searchCommunities, isSearching, availableRegions])

  // Handle Enter key press
  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      performSearch()
    }
  }, [performSearch])

  // Handle search button click
  const handleSearchClick = useCallback(() => {
    performSearch()
  }, [performSearch])

  // Clear search results when tab changes
  useEffect(() => {
    if (activeTab !== "discover") {
      setSearchResults([])
      setIsSearching(false)
      setHasSearched(false)
    }
  }, [activeTab])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Helper functions for community management
  const isUserAdmin = (community: typeof allUserCommunities[0]) => {
    if (!user?.username) return false
    return community.userRole === 'admin' || community.userRole === 'creator'
  }

  const isUserCreator = (community: typeof allUserCommunities[0]) => {
    if (!user?.username) return false
    return community.userRole === 'creator'
  }

  // Filter discovered communities (don't show communities user is already in) - memoized
  const filteredDiscoverCommunities = useMemo(() => {
    return searchResults.filter((community) => {
      const isAlreadyMember = allUserCommunities.some(uc => uc.slug === community.slug)
      return !isAlreadyMember
    })
  }, [searchResults, allUserCommunities])

  // Helper functions for community management
  const handleAdminControl = (community: typeof allUserCommunities[0]) => {
    const communityId = (community as any)._id || (community as any).id
    if (communityId) {
      router.push(`/community-admin/${communityId}`)
    }
  }

  const handleJoinCommunity = async (community: Community) => {
    try {
      const result = await joinCommunity(community.id)
      if (result.data) {
        refetchUserCommunities()
      }
    } catch (error) {}
  }

  const handleLeaveCommunity = async (communityId: string) => {
    if (confirm('Are you sure you want to leave this community?')) {
      try {
        const result = await leaveCommunity(communityId)
        if (result.data) {
          refetchUserCommunities()
        }
      } catch (error) {}
    }
  }

  const handleCreateCommunity = async (communityData: any) => {
    try {
      const result = await createCommunity({
        title: communityData.title.trim(),
        description: communityData.description.trim(),
        tags: communityData.tags && communityData.tags.length > 0 ? communityData.tags : ['Other Genetic Condition'],
        location: {
          region: communityData.location?.region?.trim() || "Global",
          state: communityData.location?.state?.trim() || undefined
        },
        isPrivate: communityData.isPrivate || false,
        settings: {
          allowMemberPosts: true,
          allowMemberInvites: true,
          requireApproval: communityData.isPrivate || false
        }
      })

      if (result.data) {
        refetchUserCommunities()
        setShowCreateModal(false)
        
        setTimeout(() => {
          const communityId = (result.data as any)?._id || (result.data as any)?.id
          if (communityId) {
            router.push(`/community-admin/${communityId}`)
          }
        }, 1500)
      }
    } catch (error) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Communities</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Discover and manage your health communities</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-semibold transition-all hover:shadow-xl flex-shrink-0"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create Community</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative p-1 sm:p-2">
  {/* Outer container with gradient + glass */}
  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/30 shadow-xl backdrop-blur-md bg-white/80">
    
    {/* Decorative floating orbs */}
    <div className="absolute top-2 left-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
    <div className="absolute bottom-2 right-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-xl opacity-50 animate-pulse delay-1000"></div>

    {/* Tabs container */}
    <div className="relative p-2 sm:p-3">
      <TabsList 
        className="flex justify-evenly w-full bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-y-hidden p-1.5 sm:p-2 gap-1.5 sm:gap-2 border border-white/40 shadow-sm"
      >
        {/* Discover */}
        <TabsTrigger
          value="discover"
          className="group inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-inner
          hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-700 min-h-[2.75rem] sm:min-h-[3rem]"
        >
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium">Discover</span>
        </TabsTrigger>

        {/* My Communities */}
        <TabsTrigger
          value="my-communities"
          className="group inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-inner
          hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-100 text-gray-700 hover:text-green-700 min-h-[2.75rem] sm:min-h-[3rem]"
        >
          <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">My Communities</span>
          <span className="text-xs font-medium sm:hidden">My</span>
        </TabsTrigger>

        {/* Managing */}
        <TabsTrigger
          value="managing"
          className="group inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-inner
          hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-100 text-gray-700 hover:text-purple-700 min-h-[2.75rem] sm:min-h-[3rem]"
        >
          <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Managing</span>
          <span className="text-xs font-medium sm:hidden">Admin</span>
        </TabsTrigger>

        {/* Analytics */}
        <TabsTrigger
          value="analytics"
          className="group inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 
          data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-inner
          hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-100 text-gray-700 hover:text-orange-700 min-h-[2.75rem] sm:min-h-[3rem]"
        >
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Analytics</span>
          <span className="text-xs font-medium sm:hidden">Stats</span>
        </TabsTrigger>
      </TabsList>
    </div>
  </div>
</div>


          {/* Tab Content Container */}
          <div className="w-full min-h-[50vh]">
            {/* Discover Communities Tab */}
            <TabsContent value="discover" className="mt-0 space-y-4 sm:space-y-6">
              {/* Mobile-First Search Interface */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl sm:rounded-3xl border border-blue-100 shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Discover Communities</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Find your perfect health support community</p>
                  </div>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Mobile-First Search Bar */}
                  <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl sm:rounded-2xl blur opacity-20"></div>
                    <div className="relative flex items-center bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                      <Search className="absolute left-4 sm:left-6 h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                      <Input
                        placeholder="Search communities, topics... (Press Enter to search)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        className="pl-12 sm:pl-16 pr-20 sm:pr-24 py-4 sm:py-6 text-base sm:text-lg border-0 bg-transparent focus:ring-0 rounded-xl sm:rounded-2xl placeholder:text-gray-400"
                      />
                      <Button
                        onClick={handleSearchClick}
                        disabled={isSearching}
                        className="absolute right-2 sm:right-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg text-xs sm:text-sm font-semibold transition-all hover:shadow-xl flex-shrink-0"
                      >
                        {isSearching ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Search</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Mobile-First Filter Toggle */}
                  <div className="flex justify-center">
                    <Button
                      variant={showExpandedSearch ? "default" : "outline"}
                      onClick={() => setShowExpandedSearch(!showExpandedSearch)}
                      className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 ${
                        showExpandedSearch 
                          ? "bg-blue-500 text-white shadow-lg hover:bg-blue-600" 
                          : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span className="text-sm sm:text-base">Filters</span>
                    </Button>
                  </div>

                  {/* Mobile-First Expanded Filters */}
                  {showExpandedSearch && (
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Health Condition</label>
                          <Select value={searchFilters.condition} onValueChange={(value) => {
                            setSearchFilters(prev => ({...prev, condition: value}))
                            // Auto-search when filters change
                            setTimeout(() => performSearch(), 100)
                          }}>
                            <SelectTrigger className="h-10 sm:h-12 border-gray-200 bg-white/90 rounded-lg sm:rounded-xl shadow-sm">
                              <SelectValue placeholder="All conditions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All conditions</SelectItem>
                              {availableConditions.map((condition: string) => (
                                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Region</label>
                          <Select value={searchFilters.region} onValueChange={(value) => {
                            setSearchFilters(prev => ({...prev, region: value}))
                            // Auto-search when filters change
                            setTimeout(() => performSearch(), 100)
                          }}>
                            <SelectTrigger className="h-10 sm:h-12 border-gray-200 bg-white/90 rounded-lg sm:rounded-xl shadow-sm">
                              <SelectValue placeholder="All regions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All regions</SelectItem>
                              {availableRegions.map((region: string) => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Category</label>
                          <Select value={searchFilters.category} onValueChange={(value) => {
                            setSearchFilters(prev => ({...prev, category: value}))
                            // Auto-search when filters change
                            setTimeout(() => performSearch(), 100)
                          }}>
                            <SelectTrigger className="h-10 sm:h-12 border-gray-200 bg-white/90 rounded-lg sm:rounded-xl shadow-sm">
                              <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All categories</SelectItem>
                              {availableCategories.map((category: string) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mobile-First Active Filters Display */}
                  {(searchFilters.condition !== "all" || searchFilters.region !== "all" || searchFilters.category !== "all") && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">Active filters:</span>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                        {searchFilters.condition !== "all" && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm">
                            {searchFilters.condition}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1.5 sm:ml-2 h-auto p-0.5 sm:p-1 hover:bg-blue-200 rounded-full"
                              onClick={() => {
                                setSearchFilters(prev => ({...prev, condition: "all"}))
                                setTimeout(() => performSearch(), 100)
                              }}
                            >
                              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                          </Badge>
                        )}
                        {searchFilters.region !== "all" && (
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm">
                            {searchFilters.region}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1.5 sm:ml-2 h-auto p-0.5 sm:p-1 hover:bg-green-200 rounded-full"
                              onClick={() => {
                                setSearchFilters(prev => ({...prev, region: "all"}))
                                setTimeout(() => performSearch(), 100)
                              }}
                            >
                              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                          </Badge>
                        )}
                        {searchFilters.category !== "all" && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm">
                            {searchFilters.category}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-1.5 sm:ml-2 h-auto p-0.5 sm:p-1 hover:bg-purple-200 rounded-full"
                              onClick={() => {
                                setSearchFilters(prev => ({...prev, category: "all"}))
                                setTimeout(() => performSearch(), 100)
                              }}
                            >
                              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            </Button>
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchFilters({ condition: "all", region: "all", category: "all" })
                            // Auto-search when filters are cleared
                            setTimeout(() => performSearch(), 100)
                          }}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
                        >
                          Clear all
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile-First Communities Grid */}
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {isSearching || searchLoading ? (
                // Mobile-First Loading state
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-gray-200 bg-white rounded-2xl sm:rounded-3xl overflow-hidden animate-pulse">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-start space-x-3 sm:space-x-5 mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="h-4 sm:h-6 bg-gray-200 rounded"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/5"></div>
                      </div>
                      <div className="flex gap-2 sm:gap-3">
                        <div className="flex-1 h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                        <div className="flex-1 h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : !hasSearched ? (
                <div className="col-span-full text-center py-12 sm:py-16 lg:py-24 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-lg">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Ready to discover communities?</h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-md mx-auto text-sm sm:text-base lg:text-lg">Enter your search terms above and press Enter or click the search button to find communities that match your interests</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => setShowExpandedSearch(true)} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg text-sm sm:text-base lg:text-lg font-semibold">
                      <Filter className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 sm:mr-3" />
                      Use Filters
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} variant="outline" size="lg" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg font-semibold">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 sm:mr-3" />
                      Create Community
                    </Button>
                  </div>
                </div>
              ) : filteredDiscoverCommunities.length === 0 ? (
                <div className="col-span-full text-center py-12 sm:py-16 lg:py-24 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-lg">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">No communities found</h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 lg:mb-10 max-w-md mx-auto text-sm sm:text-base lg:text-lg">Try adjusting your search criteria or create a new community to get started</p>
                  <Button onClick={() => setShowCreateModal(true)} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg text-sm sm:text-base lg:text-lg font-semibold">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-2 sm:mr-3" />
                    Create Community
                  </Button>
                </div>
              ) : (
                filteredDiscoverCommunities.map((community) => (
                  <Card key={community.slug} className="group hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 border-gray-100 hover:border-blue-200 bg-white rounded-2xl sm:rounded-3xl overflow-hidden hover:-translate-y-1 touch-manipulation">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-start space-x-3 sm:space-x-5 mb-4 sm:mb-6">
                        <div className="relative flex-shrink-0">
                          <div 
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg bg-blue-600"
                          >
                            {community.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 sm:mb-2">
                            {community.title}
                          </h3>
                          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="font-medium">Community</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-3 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{community.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {community.tags && community.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {community.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-medium text-xs sm:text-sm">
                                {tag}
                              </Badge>
                            ))}
                            {community.tags.length > 2 && (
                              <Badge className="bg-gray-50 text-gray-600 border-gray-200 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-medium text-xs sm:text-sm">
                                +{community.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        {community.location?.region && (
                          <Badge variant="outline" className="border-gray-300 text-gray-600 rounded-lg sm:rounded-xl px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 font-medium text-xs sm:text-sm">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="truncate max-w-20 sm:max-w-none">
                              {community.location.region}
                              {community.location.state && `, ${community.location.state}`}
                            </span>
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-gray-50 border-gray-200 h-10 sm:h-12 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl font-medium"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Preview</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-10 sm:h-12 text-xs sm:text-sm lg:text-base rounded-lg sm:rounded-xl font-semibold shadow-lg"
                          onClick={() => handleJoinCommunity(community)}
                          disabled={joiningCommunity}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                          {joiningCommunity ? 'Joining...' : 'Join'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* My Communities Tab */}
          <TabsContent value="my-communities" className="mt-0 space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {loadingUserCommunities ? (
                // Loading state for user communities
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="border-gray-200 bg-white rounded-xl sm:rounded-2xl animate-pulse">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 sm:h-9 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 h-8 sm:h-9 bg-gray-200 rounded-lg"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : allUserCommunities.length === 0 ? (
                <div className="col-span-full text-center py-12 sm:py-16 lg:py-20 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No communities yet</h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">Join communities to connect with others who share your journey and experiences</p>
                  <Button onClick={() => setActiveTab("discover")} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Discover Communities
                  </Button>
                </div>
              ) : (
                allUserCommunities.map((community) => (
                  <Card key={community.slug} className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-green-200 bg-white rounded-xl sm:rounded-2xl touch-manipulation">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div 
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-semibold text-sm sm:text-lg shadow-sm flex-shrink-0"
                            style={{ background: "#3b82f6" }}
                          >
                            {community.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1 mb-1">{community.title}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                                <span>{community.memberCount} members</span>
                              </div>
                              {isUserAdmin(community) && (
                                <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200 px-2 py-0.5 sm:py-1 rounded-md w-fit">
                                  <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-500" />
                          <span>{community.posts || 0} posts</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3">
                          <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-500" />
                          <span className="truncate">{community.lastActivity || "Active"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-200 hover:bg-gray-50 h-8 sm:h-9 text-xs sm:text-sm rounded-lg"
                          onClick={() => router.push(`/community/${community.slug}`)}
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Visit</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        {isUserAdmin(community) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 h-8 sm:h-9 text-xs sm:text-sm rounded-lg"
                            onClick={() => handleAdminControl(community)}
                          >
                            <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Admin Control</span>
                            <span className="sm:hidden">Admin</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 h-8 sm:h-9 text-xs sm:text-sm rounded-lg"
                            onClick={() => handleLeaveCommunity(community.id)}
                            disabled={leavingCommunity}
                          >
                            <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            {leavingCommunity ? 'Leaving...' : 'Leave'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Managing Tab */}
          <TabsContent value="managing" className="mt-0 space-y-4 sm:space-y-6">
            {loadingUserCommunities ? (
              // Loading state for managed communities
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="border-gray-200 bg-white rounded-xl sm:rounded-2xl animate-pulse">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                        <div className="h-12 bg-gray-200 rounded-lg"></div>
                      </div>
                      <div className="h-8 sm:h-9 bg-gray-200 rounded-lg"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (() => {
              const managedCommunities = allUserCommunities.filter(c => 
                // For now, show all user communities as manageable
                // since we don't have admin/creator info in the simplified structure
                true
              )
              
              return managedCommunities.length === 0 ? (
                <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No communities to manage</h3>
                  <p className="text-gray-600 mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">Create your first community to become an admin</p>
                  <Button onClick={() => setShowCreateModal(true)} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Create Community
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {managedCommunities.map((community) => (
                    <Card key={community.slug} className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-purple-200 bg-white relative rounded-xl sm:rounded-2xl touch-manipulation">
                      {isUserCreator(community) && new Date(community.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse text-xs px-2 py-1">
                            New!
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                            <div 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-semibold text-sm sm:text-lg shadow-sm flex-shrink-0"
                              style={{ background: "#3b82f6" }}
                            >
                              {community.title.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1 mb-1">{community.title}</h3>
                              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-0.5 sm:py-1 rounded-md w-fit">
                                <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                Admin
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center mb-3 sm:mb-4">
                          <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                            <div className="text-sm sm:text-lg font-bold text-blue-600">{community.memberCount}</div>
                            <div className="text-xs text-gray-600">Members</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                            <div className="text-sm sm:text-lg font-bold text-green-600">{community.posts || 0}</div>
                            <div className="text-xs text-gray-600">Posts</div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                            <div className="text-sm sm:text-lg font-bold text-orange-600">0</div>
                            <div className="text-xs text-gray-600">Reactions</div>
                          </div>
                        </div>

                        <div className="flex gap-1.5 sm:gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-blue-200 hover:bg-blue-50 text-blue-600 h-8 sm:h-9 text-xs sm:text-sm rounded-lg"
                            onClick={() => handleAdminControl(community)}
                          >
                            <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Admin Control</span>
                            <span className="sm:hidden">Admin</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            })()}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-0 space-y-4 sm:space-y-6">
            {(() => {
              const createdCommunities = allUserCommunities.filter(c => 
                isUserAdmin(c)
              ).length
              const hasCreatedCommunities = createdCommunities > 0
              
              if (!hasCreatedCommunities && allUserCommunities.length === 0) {
                return (
                  <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Start Your Community Journey</h3>
                    <p className="text-gray-600 mb-6 sm:mb-8 max-w-sm mx-auto text-sm sm:text-base">
                      Join communities to see your engagement metrics, or create your own to start building your support network.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => setActiveTab("discover")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                        <Search className="h-4 w-4 mr-2" />
                        Discover Communities
                      </Button>
                      <Button onClick={() => setShowCreateModal(true)} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                      </Button>
                    </div>
                  </div>
                )
              }
              
              if (!hasCreatedCommunities && allUserCommunities.length > 0) {
                return (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                      <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{allUserCommunities.length}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Communities Joined</div>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                            {allUserCommunities.reduce((acc, c) => acc + (c.memberCount || 0), 0)}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">Network Reach</div>
                        </CardContent>
                      </Card>
                      <Card className="col-span-2 border-gray-200 rounded-xl sm:rounded-2xl">
                        <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">0</div>
                          <div className="text-xs sm:text-sm text-gray-600">Communities Created</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-xl sm:rounded-2xl">
                      <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                        <Crown className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Ready to Lead?</h4>
                        <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                          You're part of {allUserCommunities.length} communities. Consider creating your own to share your unique perspective and help others.
                        </p>
                        <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Community
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              }
              
              return (
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                    <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                      <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{allUserCommunities.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Communities Joined</div>
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                      <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">{createdCommunities}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Communities Created</div>
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                      <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                          {allUserCommunities.reduce((acc, c) => acc + (c.memberCount || 0), 0)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Reach</div>
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                      <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                          {allUserCommunities.reduce((acc, c) => acc + (c.posts || 0), 0)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Posts</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-gray-200 rounded-xl sm:rounded-2xl">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-base sm:text-lg">Community Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="text-center py-8 sm:py-12 lg:py-16 text-gray-500">
                        <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                        <p className="text-sm sm:text-base">Detailed analytics coming soon...</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </TabsContent>
          </div>
        </Tabs>

        {/* Mobile Bottom Spacing */}
        <div className="h-safe-area-inset-bottom sm:hidden"></div>
      </div>

      {/* Create Community Modal */}
      <CreateCommunityModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateCommunity}
        availableConditions={availableConditions}
      />
    </div>
  )
}

export default CommunityManagement
