"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCommunityModal } from "./create-community-modal"
import { useSearchCommunities } from "@/hooks/use-api"
import { toast } from "@/hooks/use-toast"
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Settings, 
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
  Trash2,
  Edit,
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
  mockCommunities?: Community[]
  allUserCommunities?: Community[]
  onJoinCommunity?: (community: Community) => void
  onLeaveCommunity?: (communityId: string) => void
  onManageCommunity?: (community: Community) => void
  onEditCommunity?: (community: Community) => void
  onDeleteCommunity?: (communityId: string) => void
  availableConditions?: string[]
  onBack?: () => void
}

export const CommunityManagement: React.FC<CommunityManagementProps> = ({
  user,
  mockCommunities = [],
  allUserCommunities = [],
  onJoinCommunity,
  onLeaveCommunity,
  onManageCommunity,
  onEditCommunity,
  onDeleteCommunity,
  availableConditions = [],
  onBack
}) => {
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

  // Helper function to check if user is admin of a community
  const isUserAdmin = (community: Community) => {
    if (!user?.username) return false
    return community.admins.some(admin => admin.id === user.id || admin.name === user.username) ||
           community.createdBy.id === user.id || community.createdBy.name === user.username
  }

  // Helper function to check if user created the community
  const isUserCreator = (community: Community) => {
    if (!user?.username) return false
    return community.createdBy.id === user.id || community.createdBy.name === user.username
  }

  // Use backend search hook
  const { searchCommunities, loading: searchLoading } = useSearchCommunities()

  // Backend search function
  const performSearch = async () => {
    if (!searchQuery.trim() && searchFilters.condition === "all" && searchFilters.region === "all" && searchFilters.category === "all") {
      setSearchResults(mockCommunities)
      return
    }

    setIsSearching(true)
    try {
      const searchParams = {
        query: searchQuery.trim(),
        ...(searchFilters.condition !== "all" && { condition: searchFilters.condition }),
        ...(searchFilters.region !== "all" && { region: searchFilters.region }),
        ...(searchFilters.category !== "all" && { category: searchFilters.category })
      }

      const result = await searchCommunities(searchParams)
      if (result?.data?.communities) {
        // Map backend communities to local format
        const mappedCommunities = result.data.communities.map((c: any) => ({
          id: c._id,
          slug: c.slug,
          title: c.title || c.name || '', // Handle both old and new structure
          description: c.description,
          memberCount: c.memberCount || 0,
          location: c.location || { 
            region: c.tags?.find((tag: string) => regions.includes(tag)) || "Global",
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
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchFilters])

  // Initialize with all communities
  useEffect(() => {
    setSearchResults(mockCommunities)
  }, [mockCommunities])

  // Helper functions for community management
  const handleManageCommunity = (community: Community) => {
    // Navigate to community admin page
    if (typeof window !== 'undefined') {
      window.location.href = `/community-admin/${community.id}`
    }
    // Or call the parent callback if provided
    onManageCommunity?.(community)
  }

  const handleEditCommunity = (community: Community) => {
    // You could open an edit modal here or navigate to edit page
    onEditCommunity?.(community)
  }

  const handleDeleteCommunity = (communityId: string) => {
    // Show confirmation dialog then delete
    if (confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      // Remove from localStorage
      const existingCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
      const updatedCommunities = existingCommunities.filter((c: Community) => c.id !== communityId)
      localStorage.setItem('user_communities', JSON.stringify(updatedCommunities))
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('community-updated', { 
        detail: { action: 'deleted', communityId } 
      }))
      
      // Call parent callback
      onDeleteCommunity?.(communityId)
    }
  }

  const handleCreateCommunity = (communityData: any) => {
    const newCommunity: Community = {
      ...communityData,
      id: `user-${Date.now()}`,
      slug: communityData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      color: "#3b82f6",
      memberCount: 1,
      admin: user?.username || user?.name || "User",
      isUserCreated: true,
      category: communityData.category || "Health Support",
      region: communityData.region || "Global", 
      isActive: true,
      lastActivity: "just now",
      posts: 0,
      totalReactions: 0
    }

    // Save to localStorage and update state
    const existingCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
    const updatedCommunities = [newCommunity, ...existingCommunities]
    localStorage.setItem('user_communities', JSON.stringify(updatedCommunities))
    
    // Switch to managing tab to show the newly created community
    setActiveTab("managing")
    
    // Show success toast
    toast({
      title: "Community Created! 🎉",
      description: `${newCommunity.title} is now ready for members. You can manage it from the Managing tab.`,
      duration: 5000,
    })
    
    // Trigger update event
    window.dispatchEvent(new CustomEvent('community-updated', { 
      detail: { action: 'created', community: newCommunity } 
    }))
  }

  // Sample data for demo
  const categories = ["Health Support", "Mental Health", "Chronic Conditions", "Wellness", "Family Support"]
  const regions = ["Global", "United States", "Europe", "Asia", "Canada", "Australia"]

  const filteredDiscoverCommunities = searchResults.filter((community) => {
    // Don't show communities user is already in
    const isAlreadyMember = allUserCommunities.some(uc => uc.slug === community.slug)
    return !isAlreadyMember
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sleek Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Discover and manage your health communities</p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg text-sm font-semibold transition-all hover:shadow-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Robust Tab Navigation */}
          <div className="sticky top-[5rem] z-40 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-lg mb-8">
            <div className="p-2">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-50/80 rounded-xl p-1 gap-1">
                <TabsTrigger 
                  value="discover" 
                  className="flex items-center justify-center gap-2 px-2 sm:px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 min-h-[3rem]"
                >
                  <Search className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Discover</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="my-communities" 
                  className="flex items-center justify-center gap-2 px-2 sm:px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-green-50 text-gray-600 hover:text-green-600 min-h-[3rem]"
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline">My Communities</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="managing" 
                  className="flex items-center justify-center gap-2 px-2 sm:px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-purple-50 text-gray-600 hover:text-purple-600 min-h-[3rem]"
                >
                  <Crown className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Managing</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="flex items-center justify-center gap-2 px-2 sm:px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-orange-50 text-gray-600 hover:text-orange-600 min-h-[3rem]"
                >
                  <TrendingUp className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden xs:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content Container */}
          <div className="w-full min-h-[50vh]">
            {/* Discover Communities Tab */}
            <TabsContent value="discover" className="mt-0 space-y-6">
              {/* Enhanced Search Interface */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Discover Communities</h2>
                    <p className="text-gray-600 text-sm sm:text-base">Find your perfect health support community</p>
                  </div>
                
                <div className="space-y-6">
                  {/* Main Search Bar */}
                  <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-20"></div>
                    <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-gray-100">
                      <Search className="absolute left-6 h-6 w-6 text-gray-400" />
                      <Input
                        placeholder="Search by community name, health condition, or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-16 pr-6 py-6 text-lg border-0 bg-transparent focus:ring-0 rounded-2xl placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button
                      variant={showExpandedSearch ? "default" : "outline"}
                      onClick={() => setShowExpandedSearch(!showExpandedSearch)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                        showExpandedSearch 
                          ? "bg-blue-500 text-white shadow-lg hover:bg-blue-600" 
                          : "bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                      }`}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced Filters
                    </Button>
                  </div>

                  {/* Expanded Advanced Filters */}
                  {showExpandedSearch && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Health Condition</label>
                          <Select value={searchFilters.condition} onValueChange={(value) => setSearchFilters(prev => ({...prev, condition: value}))}>
                            <SelectTrigger className="h-12 border-gray-200 bg-white/90 rounded-xl shadow-sm">
                              <SelectValue placeholder="All conditions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All conditions</SelectItem>
                              {availableConditions.map((condition) => (
                                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Region</label>
                          <Select value={searchFilters.region} onValueChange={(value) => setSearchFilters(prev => ({...prev, region: value}))}>
                            <SelectTrigger className="h-12 border-gray-200 bg-white/90 rounded-xl shadow-sm">
                              <SelectValue placeholder="All regions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All regions</SelectItem>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>{region}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">Category</label>
                          <Select value={searchFilters.category} onValueChange={(value) => setSearchFilters(prev => ({...prev, category: value}))}>
                            <SelectTrigger className="h-12 border-gray-200 bg-white/90 rounded-xl shadow-sm">
                              <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Filters Display */}
                  {(searchFilters.condition !== "all" || searchFilters.region !== "all" || searchFilters.category !== "all") && (
                    <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
                      <span className="text-sm font-semibold text-gray-700">Active filters:</span>
                      {searchFilters.condition !== "all" && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2 rounded-full font-medium">
                          {searchFilters.condition}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-auto p-1 hover:bg-blue-200 rounded-full"
                            onClick={() => setSearchFilters(prev => ({...prev, condition: "all"}))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {searchFilters.region !== "all" && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 rounded-full font-medium">
                          {searchFilters.region}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-auto p-1 hover:bg-green-200 rounded-full"
                            onClick={() => setSearchFilters(prev => ({...prev, region: "all"}))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {searchFilters.category !== "all" && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2 rounded-full font-medium">
                          {searchFilters.category}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-auto p-1 hover:bg-purple-200 rounded-full"
                            onClick={() => setSearchFilters(prev => ({...prev, category: "all"}))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchFilters({ condition: "all", region: "all", category: "all" })}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full font-medium"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Premium Communities Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {isSearching || searchLoading ? (
                // Loading state
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-gray-200 bg-white rounded-3xl overflow-hidden animate-pulse">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-5 mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="h-6 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredDiscoverCommunities.length === 0 ? (
                <div className="col-span-full text-center py-24">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No communities found</h3>
                  <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg">Try adjusting your search criteria or create a new community to get started</p>
                  <Button onClick={() => setShowCreateModal(true)} size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-4 rounded-2xl shadow-lg text-lg font-semibold">
                    <Plus className="h-6 w-6 mr-3" />
                    Create Community
                  </Button>
                </div>
              ) : (
                filteredDiscoverCommunities.map((community) => (
                  <Card key={community.slug} className="group hover:shadow-2xl transition-all duration-500 border-gray-100 hover:border-blue-200 bg-white rounded-3xl overflow-hidden hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-5 mb-6">
                        <div className="relative">
                          <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg bg-blue-600"
                          >
                            {community.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                            {community.title}
                          </h3>
                          <div className="flex items-center text-gray-500 mb-3">
                            <Users className="h-5 w-5 mr-2" />
                            <span className="font-medium">Community</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-3 leading-relaxed mb-6 text-base">{community.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        {community.tags && community.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {community.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200 rounded-xl px-4 py-2 font-medium">
                                {tag}
                              </Badge>
                            ))}
                            {community.tags.length > 3 && (
                              <Badge className="bg-gray-50 text-gray-600 border-gray-200 rounded-xl px-4 py-2 font-medium">
                                +{community.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        {community.location?.region && (
                          <Badge variant="outline" className="border-gray-300 text-gray-600 rounded-xl px-4 py-2 font-medium">
                            <MapPin className="h-4 w-4 mr-2" />
                            {community.location.region}
                            {community.location.state && `, ${community.location.state}`}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 hover:bg-gray-50 border-gray-200 h-12 text-base rounded-xl font-medium"
                        >
                          <Eye className="h-5 w-5 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="lg"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white h-12 text-base rounded-xl font-semibold shadow-lg"
                          onClick={() => onJoinCommunity?.(community)}
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* My Communities Tab */}
          <TabsContent value="my-communities" className="mt-0 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allUserCommunities.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No communities yet</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">Join communities to connect with others who share your journey and experiences</p>
                  <Button onClick={() => setActiveTab("discover")} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl">
                    <Search className="h-5 w-5 mr-2" />
                    Discover Communities
                  </Button>
                </div>
              ) : (
                allUserCommunities.map((community) => (
                  <Card key={community.slug} className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-green-200 bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-sm"
                            style={{ background: "#3b82f6" }}
                          >
                            {community.title.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{community.title}</h3>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center text-sm text-gray-500">
                                <Users className="h-4 w-4 mr-1.5" />
                                <span>{community.memberCount} members</span>
                              </div>
                              {isUserAdmin(community) && (
                                <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200 px-2 py-1 rounded-md">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                          <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{community.posts || 0} posts</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3">
                          <Activity className="h-4 w-4 mr-2 text-green-500" />
                          <span className="truncate">{community.lastActivity || "Active"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-200 hover:bg-gray-50 h-9 text-sm rounded-lg"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                        {isUserAdmin(community) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 h-9 text-sm rounded-lg"
                            onClick={() => handleManageCommunity(community)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 h-9 text-sm rounded-lg"
                            onClick={() => onLeaveCommunity?.(community.id)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Leave
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
          <TabsContent value="managing" className="mt-0 space-y-6">
            {(() => {
              const managedCommunities = allUserCommunities.filter(c => 
                // For now, show all user communities as manageable
                // since we don't have admin/creator info in the simplified structure
                true
              )
              
              return managedCommunities.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Crown className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">No communities to manage</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">Create your first community to become an admin</p>
                  <Button onClick={() => setShowCreateModal(true)} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Community
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {managedCommunities.map((community) => (
                    <Card key={community.slug} className="hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-purple-200 bg-white relative">
                      {isUserCreator(community) && new Date(community.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse">
                            New!
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-sm"
                              style={{ background: "#3b82f6" }}
                            >
                              {community.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">{community.title}</h3>
                              <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-1 rounded-md">
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center mb-4">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-blue-600">{community.memberCount}</div>
                            <div className="text-xs text-gray-600">Members</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-green-600">{community.posts || 0}</div>
                            <div className="text-xs text-gray-600">Posts</div>
                          </div>
                          <div className="bg-orange-50 rounded-lg p-3">
                            <div className="text-lg font-bold text-orange-600">0</div>
                            <div className="text-xs text-gray-600">Reactions</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-gray-200 hover:bg-gray-50 h-9 text-sm rounded-lg"
                            onClick={() => handleEditCommunity(community)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-gray-200 hover:bg-gray-50 h-9 text-sm rounded-lg"
                            onClick={() => handleManageCommunity(community)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 border-red-200 hover:bg-red-50 h-9 px-3 rounded-lg"
                            onClick={() => handleDeleteCommunity(community.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
          <TabsContent value="analytics" className="mt-0 space-y-6">
            {(() => {
              const createdCommunities = allUserCommunities.filter(c => 
                isUserAdmin(c)
              ).length
              const hasCreatedCommunities = createdCommunities > 0
              
              if (!hasCreatedCommunities && allUserCommunities.length === 0) {
                return (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="h-8 w-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Your Community Journey</h3>
                    <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                      Join communities to see your engagement metrics, or create your own to start building your support network.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => setActiveTab("discover")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                        <Search className="h-4 w-4 mr-2" />
                        Discover Communities
                      </Button>
                      <Button onClick={() => setShowCreateModal(true)} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                      </Button>
                    </div>
                  </div>
                )
              }
              
              if (!hasCreatedCommunities && allUserCommunities.length > 0) {
                return (
                  <div className="space-y-6">
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                      <Card className="border-gray-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">{allUserCommunities.length}</div>
                          <div className="text-sm text-gray-600">Communities Joined</div>
                        </CardContent>
                      </Card>
                      <Card className="border-gray-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {allUserCommunities.reduce((acc, c) => acc + (c.memberCount || 0), 0)}
                          </div>
                          <div className="text-sm text-gray-600">Network Reach</div>
                        </CardContent>
                      </Card>
                      <Card className="col-span-2 border-gray-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                          <div className="text-sm text-gray-600">Communities Created</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-8 text-center">
                        <Crown className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Lead?</h4>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          You're part of {allUserCommunities.length} communities. Consider creating your own to share your unique perspective and help others.
                        </p>
                        <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Community
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              }
              
              return (
                <div className="space-y-6">
                  <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <Card className="border-gray-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{allUserCommunities.length}</div>
                        <div className="text-sm text-gray-600">Communities Joined</div>
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">{createdCommunities}</div>
                        <div className="text-sm text-gray-600">Communities Created</div>
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {allUserCommunities.reduce((acc, c) => acc + (c.memberCount || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Reach</div>
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {allUserCommunities.reduce((acc, c) => acc + (c.posts || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Posts</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle>Community Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-16 text-gray-500">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Detailed analytics coming soon...</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </TabsContent>
          </div>
        </Tabs>
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
