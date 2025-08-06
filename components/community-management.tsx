"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCommunityModal } from "./create-community-modal"
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
  name: string
  description: string
  color?: string
  memberCount: number
  admin?: string
  isUserCreated?: boolean
  category?: string
  region?: string
  isActive?: boolean
  lastActivity?: string
  posts?: number
  totalReactions?: number
}

interface CommunityManagementProps {
  user?: any
  mockCommunities?: Community[]
  allUserCommunities?: Community[]
  onJoinCommunity?: (community: Community) => void
  onLeaveCommunity?: (communityId: string) => void
  availableConditions?: string[]
  onBack?: () => void
}

export const CommunityManagement: React.FC<CommunityManagementProps> = ({
  user,
  mockCommunities = [],
  allUserCommunities = [],
  onJoinCommunity,
  onLeaveCommunity,
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

  // Sample data for demo
  const categories = ["Health Support", "Mental Health", "Chronic Conditions", "Wellness", "Family Support"]
  const regions = ["Global", "United States", "Europe", "Asia", "Canada", "Australia"]

  const handleCreateCommunity = (communityData: any) => {
    const newCommunity: Community = {
      ...communityData,
      id: `user-${Date.now()}`,
      slug: communityData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      color: "#3b82f6",
      memberCount: 1,
      admin: user?.username || "User",
      isUserCreated: true,
      category: "Health Support",
      region: "Global",
      isActive: true,
      lastActivity: "just now",
      posts: 0,
      totalReactions: 0
    }

    // Save to localStorage and update state
    const existingCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
    const updatedCommunities = [newCommunity, ...existingCommunities]
    localStorage.setItem('user_communities', JSON.stringify(updatedCommunities))
    
    // Trigger update event
    window.dispatchEvent(new CustomEvent('community-updated', { 
      detail: { action: 'created', community: newCommunity } 
    }))
  }

  const filteredDiscoverCommunities = mockCommunities.filter((community) => {
    // Don't show communities user is already in
    const isAlreadyMember = allUserCommunities.some(uc => uc.slug === community.slug)
    if (isAlreadyMember) return false
    
    // Apply search filters
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesQuery = (
        community.name.toLowerCase().includes(query) ||
        community.description?.toLowerCase().includes(query)
      )
      if (!matchesQuery) return false
    }
    
    if (searchFilters.condition && searchFilters.condition !== "all") {
      const conditionMatch = (
        community.name.toLowerCase().includes(searchFilters.condition.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchFilters.condition.toLowerCase())
      )
      if (!conditionMatch) return false
    }
    
    if (searchFilters.region && searchFilters.region !== "all" && searchFilters.region !== "Global") {
      if (community.region !== searchFilters.region) return false
    }
    
    if (searchFilters.category && searchFilters.category !== "all") {
      if (community.category !== searchFilters.category) return false
    }
    
    return true
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Overlay Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        {/* Header Content */}
        <div className="flex items-center justify-between px-4 py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">Communities</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-xl shadow-lg text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab Navigation - UI Designer Optimized */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="discover" 
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50 text-gray-600"
              >
                <Search className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Discover</span>
                <span className="sm:hidden text-xs">Find</span>
              </TabsTrigger>
              <TabsTrigger 
                value="my-communities" 
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm hover:bg-gray-50 text-gray-600"
              >
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">My Communities</span>
                <span className="sm:hidden text-xs">Mine</span>
              </TabsTrigger>
              <TabsTrigger 
                value="managing" 
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm hover:bg-gray-50 text-gray-600"
              >
                <Crown className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Managing</span>
                <span className="sm:hidden text-xs">Admin</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm hover:bg-gray-50 text-gray-600"
              >
                <TrendingUp className="h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden text-xs">Stats</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Discover Communities Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filters */}
            
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Main Search */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search communities by name, condition, or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-400 focus:ring-blue-200"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowExpandedSearch(!showExpandedSearch)}
                      className={showExpandedSearch ? "bg-blue-50 text-blue-600 border-blue-300" : ""}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>

                  {/* Expanded Filters - Mobile Optimized */}
                  {showExpandedSearch && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Health Condition</label>
                        <Select value={searchFilters.condition} onValueChange={(value) => setSearchFilters(prev => ({...prev, condition: value}))}>
                          <SelectTrigger>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                        <Select value={searchFilters.region} onValueChange={(value) => setSearchFilters(prev => ({...prev, region: value}))}>
                          <SelectTrigger>
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
                      <div className="sm:col-span-2 lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <Select value={searchFilters.category} onValueChange={(value) => setSearchFilters(prev => ({...prev, category: value}))}>
                          <SelectTrigger>
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
                  )}

                  {/* Active Filters */}
                  {(searchFilters.condition !== "all" || searchFilters.region !== "all" || searchFilters.category !== "all") && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {searchFilters.condition !== "all" && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {searchFilters.condition}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0.5 hover:bg-transparent"
                            onClick={() => setSearchFilters(prev => ({...prev, condition: "all"}))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {searchFilters.region !== "all" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {searchFilters.region}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0.5 hover:bg-transparent"
                            onClick={() => setSearchFilters(prev => ({...prev, region: "all"}))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {searchFilters.category !== "all" && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {searchFilters.category}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0.5 hover:bg-transparent"
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
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            

            {/* Communities Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDiscoverCommunities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or create a new community</p>
                  <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Community
                  </Button>
                </div>
              ) : (
                filteredDiscoverCommunities.map((community) => (
                  <Card key={community.slug} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ background: community.color || "#3b82f6" }}
                          >
                            {community.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                              {community.name}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{community.memberCount} members</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-2">{community.description}</p>
                      
                      <div className="flex items-center gap-2">
                        {community.category && (
                          <Badge variant="secondary" className="text-xs">
                            {community.category}
                          </Badge>
                        )}
                        {community.region && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {community.region}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => onJoinCommunity?.(community)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
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
          <TabsContent value="my-communities" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allUserCommunities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities yet</h3>
                  <p className="text-gray-600 mb-6">Join communities to connect with others</p>
                  <Button onClick={() => setActiveTab("discover")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Discover Communities
                  </Button>
                </div>
              ) : (
                allUserCommunities.map((community) => (
                  <Card key={community.slug} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                            style={{ background: community.color || "#3b82f6" }}
                          >
                            {community.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="text-lg line-clamp-1">{community.name}</CardTitle>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{community.memberCount} members</span>
                              {community.admin === user?.username && (
                                <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          <span>{community.posts || 0} posts</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Activity className="h-4 w-4 mr-2" />
                          <span>{community.lastActivity || "Active"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                        {community.admin === user?.username ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
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
          <TabsContent value="managing" className="space-y-6">
            {(() => {
              const managedCommunities = allUserCommunities.filter(c => c.admin === user?.username)
              
              return managedCommunities.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities to manage</h3>
                  <p className="text-gray-600 mb-6">Create your first community to become an admin</p>
                  <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Community
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {managedCommunities.map((community) => (
                    <Card key={community.slug} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                              style={{ background: community.color || "#3b82f6" }}
                            >
                              {community.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <CardTitle className="line-clamp-1">{community.name}</CardTitle>
                              <Badge className="bg-purple-100 text-purple-800 mt-1">
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{community.memberCount}</div>
                            <div className="text-xs text-gray-600">Members</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">{community.posts || 0}</div>
                            <div className="text-xs text-gray-600">Posts</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">{community.totalReactions || 0}</div>
                            <div className="text-xs text-gray-600">Reactions</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
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

          {/* Analytics Tab - Mobile Optimized */}
          <TabsContent value="analytics" className="space-y-6">
            {(() => {
              const createdCommunities = allUserCommunities.filter(c => c.admin === user?.username).length
              const hasCreatedCommunities = createdCommunities > 0
              
              if (!hasCreatedCommunities && allUserCommunities.length === 0) {
                // Complete beginner - no communities at all
                return (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="h-10 w-10 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Your Community Journey</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Join communities to see your engagement metrics, or create your own to start building your support network.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={() => setActiveTab("discover")} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Search className="h-4 w-4 mr-2" />
                        Discover Communities
                      </Button>
                      <Button onClick={() => setShowCreateModal(true)} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Community
                      </Button>
                    </div>
                  </div>
                )
              }
              
              if (!hasCreatedCommunities && allUserCommunities.length > 0) {
                // Member but not creator
                return (
                  <div className="space-y-6">
                    {/* Basic Stats */}
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardContent className="p-4 lg:p-6 text-center">
                          <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">{allUserCommunities.length}</div>
                          <div className="text-xs lg:text-sm text-gray-600">Communities Joined</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 lg:p-6 text-center">
                          <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">
                            {allUserCommunities.reduce((acc, c) => acc + (c.memberCount || 0), 0)}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-600">Network Reach</div>
                        </CardContent>
                      </Card>
                      <Card className="col-span-2 lg:col-span-2">
                        <CardContent className="p-4 lg:p-6 text-center">
                          <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">0</div>
                          <div className="text-xs lg:text-sm text-gray-600">Communities Created</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Encouragement to Create */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-6 text-center">
                        <Crown className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Lead?</h4>
                        <p className="text-gray-600 mb-4 max-w-md mx-auto">
                          You're part of {allUserCommunities.length} communities. Consider creating your own to share your unique perspective and help others.
                        </p>
                        <Button onClick={() => setShowCreateModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Community
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              }
              
              // Has created communities - full analytics
              return (
                <div className="space-y-6">
                  {/* Mobile-Optimized Stats Grid */}
                  <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="p-4 lg:p-6 text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">{allUserCommunities.length}</div>
                        <div className="text-xs lg:text-sm text-gray-600">Communities Joined</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 lg:p-6 text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-2">{createdCommunities}</div>
                        <div className="text-xs lg:text-sm text-gray-600">Communities Created</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 lg:p-6 text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">
                          {allUserCommunities.reduce((acc, c) => acc + (c.memberCount || 0), 0)}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600">Total Reach</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 lg:p-6 text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-orange-600 mb-2">
                          {allUserCommunities.reduce((acc, c) => acc + (c.posts || 0), 0)}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-600">Total Posts</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Activity Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg lg:text-xl">Community Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 lg:py-12 text-gray-500">
                        <TrendingUp className="h-8 w-8 lg:h-12 lg:w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm lg:text-base">Detailed analytics coming soon...</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Community Modal */}
      <CreateCommunityModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCommunity}
        availableConditions={availableConditions}
      />
    </div>
  )
}

export default CommunityManagement
