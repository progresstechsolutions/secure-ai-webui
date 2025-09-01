"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ArrowLeft, MessageSquare, Heart, Eye, Clock, Plus, TrendingUp, Users, Share2, MoreHorizontal, Filter, Search, Copy, Check, Twitter, Facebook, Linkedin, X, MapPin, Tag, Lock, Globe, Sparkles, Settings, Star } from "lucide-react"
import { CreatePostModal } from "./create-post-modal"
import { PostDetail } from "./post-detail"
import { logUserActivity } from "@/lib/utils"
import { apiClient, Community, Post } from "@/lib/api-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCommunityWithPosts } from "@/hooks/use-api"

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  if (imagePath.startsWith('http')) {
    return imagePath // Already a full URL
  }
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001'
  return `${BACKEND_URL}${imagePath}`
}

interface CommunityFeedProps {
  communitySlug: string
  onBack: () => void
  user: any
}

export function CommunityFeed({ communitySlug, onBack, user }: CommunityFeedProps) {
  // Use the new hook for fetching community data and posts
  const { community: communityData, posts, isJoined, loading, error, refetch } = useCommunityWithPosts(communitySlug)
  
  // UI state
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent")
  const [shareModal, setShareModal] = useState<{ open: boolean; post: any | null }>({ open: false, post: null })
  const [copiedLink, setCopiedLink] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [selectedPostData, setSelectedPostData] = useState<Post | null>(null)

  // Helper function to extract user reactions from posts
  const extractUserReactions = useCallback((posts: Post[], currentUser: any): Record<string, string> => {
    const reactions: Record<string, string> = {}
    
    posts.forEach(post => {
      if (post.reactions && Array.isArray(post.reactions)) {
        const userReaction = post.reactions.find((reaction: any) => 
          reaction.user && (reaction.user.id === currentUser?.id || reaction.user.id === currentUser?.userId)
        )
        
        if (userReaction) {
          // Map backend reaction types to frontend types
          const frontendTypeMap: Record<string, string> = {
            'love': 'heart',
            'like': 'thumbsUp', 
            'laugh': 'hope'
          }
          reactions[post._id] = frontendTypeMap[userReaction.type] || userReaction.type
        }
      }
    })
    
    return reactions
  }, [])

  // Update user reactions when posts change
  useEffect(() => {
    if (posts.length > 0) {
      const reactions = extractUserReactions(posts, user)
      setUserReactions(reactions)
      console.log("🎯 User reactions extracted:", reactions)
    }
  }, [posts, user, extractUserReactions])

  // Handle joining the community
  const handleJoinCommunity = async () => {
    if (!communityData) return
    
    try {
      console.log("🌐 API Call: Joining community:", (communityData as Community).slug)
      const joinResponse = await apiClient.joinCommunity((communityData as Community)._id)
      
      if (joinResponse.error) {
        console.error("Failed to join community:", joinResponse.error)
        return
      }
      
      // Refresh data to get updated member count and membership status
      refetch()
      
    } catch (error) {
      console.log("❌ Error joining community:", error)
    }
  }

  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date()
    const postDate = new Date(timestamp)
    const diffInMilliseconds = now.getTime() - postDate.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return months === 1 ? "1 month ago" : `${months} months ago`
    }
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? "1 year ago" : `${years} years ago`
  }

  // Filter and sort posts when dependencies change
  const filteredAndSortedPosts = useMemo(() => {
    let filteredPosts = posts
    
    // Apply search filter
    if (searchTerm) {
      filteredPosts = posts.filter((post: Post) => {
        const searchText = (post.content || '').toLowerCase()
        const titleText = ((post as any).caption || post.title || '').toLowerCase()
        const authorText = (post.author?.name || '').toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        return searchText.includes(searchLower) || 
               titleText.includes(searchLower) || 
               authorText.includes(searchLower)
      })
    }
    
    // Apply sorting
    const sortedPosts = [...filteredPosts]
    if (sortBy === "popular") {
      sortedPosts.sort((a, b) => {
        const aScore = a.stats?.totalReactions || 0
        const bScore = b.stats?.totalReactions || 0
        return bScore - aScore
      })
    } else if (sortBy === "trending") {
      sortedPosts.sort((a, b) => {
        const aScore = (a.stats?.totalReactions || 0) + (a.stats?.totalComments || 0)
        const bScore = (b.stats?.totalReactions || 0) + (b.stats?.totalComments || 0)
        return bScore - aScore
      })
    } else {
      // Recent - sort by creation date
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    return sortedPosts
  }, [posts, searchTerm, sortBy])

  // Memoize post creation handler
  const handlePostCreated = useCallback(() => {
    // Refresh posts from API
    refetch()
  }, [refetch])

  // Listen for post creation events to refresh the feed
  useEffect(() => {
    window.addEventListener("post-created", handlePostCreated)
    return () => {
      window.removeEventListener("post-created", handlePostCreated)
    }
  }, [handlePostCreated])

  // Add post handler
  const handleAddPost = (newPost: any) => {
    const postWithMetadata = {
      ...newPost,
      community: { slug: communitySlug, name: (communityData as Community)?.title || communitySlug },
    }
    
    // Refresh posts from API after creation
    refetch()
    setShowCreatePostModal(false)
  }

  // Reaction handler with activity logging
  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const currentReaction = userReactions[postId]
      const isRemoving = currentReaction === reactionType
      
      // Update local state immediately for better UX
      setUserReactions((prev) => ({ 
        ...prev, 
        [postId]: isRemoving ? "" : reactionType 
      }))
      
      // Make API call
      if (isRemoving) {
        await apiClient.removeReactionFromPost(postId)
      } else {
        await apiClient.addReactionToPost(postId, reactionType as any)
      }
      
      // Update local posts state to reflect new reaction count
      refetch() // Use refetch to update the posts array in the hook
      
      const post = posts.find((p: Post) => p._id === postId)
      if (post) {
        const content = (post as any).caption || post.content || 'Untitled post'
        logUserActivity(`Reacted with ${reactionType} to post: "${content}"`)
      }
    } catch (error) {
      console.log("❌ Error updating reaction:", error)
      // Revert local state on error
      setUserReactions((prev) => ({ ...prev, [postId]: userReactions[postId] }))
    }
  }

  // Share handler
  const handleShare = (post: Post) => {
    console.log('Share button clicked for post:', post._id)
    setShareModal({ open: true, post })
    const content = (post as any).caption || post.content || 'Untitled post'
    logUserActivity(`Opened share modal for post: "${content}"`)
  }

  // Copy link to clipboard
  const handleCopyLink = async (postId: string) => {
    const postLink = `${window.location.origin}/community/${communitySlug}/post/${postId}`
    try {
      await navigator.clipboard.writeText(postLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
      logUserActivity(`Copied link for post: ${postId}`)
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = postLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Handle post click to open detail modal
  const handlePostClick = (post: Post) => {
    setSelectedPost(post._id)
    setSelectedPostData(post)
  }

  // Handle comment functionality for post detail
  const handleAddComment = (postId: string, comment: any) => {
    // Update local posts state with new comment
    refetch() // Use refetch to update the posts array in the hook
    
    // Update selected post data if it's currently open
    if (selectedPostData && selectedPostData._id === postId) {
      setSelectedPostData(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), comment],
        stats: {
          ...prev.stats,
          totalComments: (prev.stats?.totalComments || 0) + 1
        }
      } : null)
    }
  }

  // Handle reply functionality for post detail
  const handleAddReply = (postId: string, commentId: string, reply: any) => {
    // Update local posts state with new reply
    refetch() // Use refetch to update the posts array in the hook
  }

  // Social media share handlers
  const handleSocialShare = (platform: string, post: Post) => {
    const postLink = `${window.location.origin}/community/${communitySlug}/post/${post._id}`
    const content = (post as any).caption || post.content || ''
    const text = `Check out this post from ${communityData?.title || communitySlug}: "${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"`
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postLink)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postLink)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postLink)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      logUserActivity(`Shared post to ${platform}: ${post._id}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
          <span className="text-sm text-gray-500">Loading community...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !communityData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Community not found</h3>
          <p className="text-gray-600 mb-4">{error || "This community doesn't exist or you don't have access to it."}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600 hover:text-gray-900 p-2 md:px-4">
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Home</span>
            </Button>
            <div className="flex items-center gap-2 md:gap-3">
              {!isJoined && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleJoinCommunity}
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors px-3 md:px-4"
                >
                  <Plus className="h-4 w-4 md:mr-2" />
                  <span className="hidden sm:inline">Join Community</span>
                  <span className="sm:hidden">Join</span>
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowCreatePostModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-3 md:px-4"
              >
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden sm:inline">Create Post</span>
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-300 text-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32 bg-white border-gray-200 text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Community Banner */}
      <div className="max-w-6xl mx-auto mt-4 md:mt-6 mb-6 md:mb-8 px-3 md:px-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-1">{(communityData as Community).title}</h1>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {(communityData as Community).memberCount || 0} members
                      </span>
                      {(communityData as Community).location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {(communityData as Community).location.region}
                          {(communityData as Community).location.state && `, ${(communityData as Community).location.state}`}
                        </span>
                      )}
                      {(communityData as Community).isPrivate && (
                        <span className="flex items-center gap-1">
                          <Lock className="h-4 w-4" />
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-white/90 mb-4 leading-relaxed max-w-2xl">
                  {(communityData as Community).description}
                </p>
                
                {/* Community Tags */}
                {(communityData as Community).tags && (communityData as Community).tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(communityData as Community).tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="secondary" 
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Community Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {posts.length} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {posts.reduce((sum, post) => sum + (post.stats?.totalComments || 0), 0)} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {posts.reduce((sum, post) => sum + (post.stats?.totalReactions || 0), 0)} reactions
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Feed */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {filteredAndSortedPosts.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-12 md:py-16 px-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Be the first to share something with this community!
              </p>
              <Button 
                onClick={() => setShowCreatePostModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 md:py-4 border-b border-gray-200 gap-2">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Community Posts
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {filteredAndSortedPosts.length}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Filter className="h-4 w-4" />
                <span>Sorted by {sortBy}</span>
              </div>
            </div>
            
            {filteredAndSortedPosts.map((post) => {
              // Calculate total reactions for engagement display
              const getReactionScore = (post: Post) => {
                return post.stats?.totalReactions || 0
              }
              
              const totalReactions = getReactionScore(post)
              
              return (
                <article
                  key={post._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={(e) => {
                    // Prevent opening modal if clicking on interactive elements
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
                      return;
                    }
                    handlePostClick(post);
                  }}
                >
                  {/* Mobile-Optimized Post Header */}
                  <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-50">
                    <div className="flex items-center space-x-3">
                      {/* Avatar - Slightly smaller on mobile */}
                      <div className="flex-shrink-0">
                        <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                          <AvatarImage src={post.author.avatar || "/placeholder-user.jpg"} />
                          <AvatarFallback>{(post.author.name || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      {/* User Info - Responsive text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 overflow-hidden">
                          <h3 className="font-semibold text-gray-900 text-sm flex-shrink-0">
                            {post.author.name || 'Anonymous'}
                          </h3>
                          <span className="text-gray-400 flex-shrink-0">•</span>
                          <span className="text-blue-600 text-xs sm:text-sm font-medium truncate">
                            {communityData?.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <time>{formatRelativeTime(post.createdAt)}</time>
                        </div>
                      </div>
                      
                      {/* More Options - Larger touch target */}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-2 rounded-full touch-manipulation">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Post Content - Better mobile spacing */}
                  {((post as any).caption || post.content) && ((post as any).caption || post.content).trim() && (
                    <div className="px-3 sm:px-4 py-3">
                      <p className="text-gray-900 text-sm leading-relaxed">
                        {((post as any).caption || post.content).length > 200 ? (
                          <>
                            {((post as any).caption || post.content).slice(0, 200)}
                            <span className="text-gray-500">... </span>
                            <span className="text-blue-600 hover:text-blue-700 font-medium">
                              See more
                            </span>
                          </>
                        ) : (
                          (post as any).caption || post.content
                        )}
                      </p>
                    </div>
                  )}

                  {/* Media */}
                  {post.images && post.images.length > 0 && (
                    <div className="relative">
                      <div className={`${post.images.length === 1 ? '' : 'grid grid-cols-2 gap-0.5'}`}>
                        {post.images.slice(0, 4).map((image, index) => (
                          <div 
                            key={index} 
                            className="relative overflow-hidden"
                          >
                            <img
                              src={getImageUrl(image)}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                              style={{ 
                                maxHeight: post.images && post.images.length === 1 ? '400px' : '160px',
                                aspectRatio: post.images && post.images.length === 1 ? 'auto' : '1'
                              }}
                            />
                            {index === 3 && post.images && post.images.length > 4 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-lg font-semibold">+{post.images.length - 4}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  {(() => {
                    const hasEngagement = totalReactions > 0 || (post.stats?.totalComments || 0) > 0
                    
                    return hasEngagement ? (
                      <div className="px-4 py-2 border-b border-gray-50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {totalReactions > 0 && (
                            <div className="flex items-center space-x-1">
                              <div className="flex items-center -space-x-0.5">
                                <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                                  <span className="text-[8px]">❤️</span>
                                </div>
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-[8px]">💪</span>
                                </div>
                              </div>
                              <span className="ml-1">{totalReactions}</span>
                            </div>
                          )}
                          {(post.stats?.totalComments || 0) > 0 && (
                            <span className="hover:underline cursor-pointer">
                              {post.stats?.totalComments} comment{post.stats?.totalComments !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null
                  })()}

                  {/* Mobile-Optimized Action Buttons */}
                  <div className="px-3 sm:px-4 py-3">
                    <div className="flex items-center justify-around sm:justify-between">
                      {/* Reaction Button - Optimized for touch */}
                      <div className="relative">
                        <button
                          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                            userReactions[post._id] 
                              ? userReactions[post._id] === "heart" ? 'text-pink-600 bg-pink-50' :
                                userReactions[post._id] === "thumbsUp" ? 'text-blue-600 bg-blue-50' :
                                userReactions[post._id] === "hope" ? 'text-yellow-600 bg-yellow-50' :
                                userReactions[post._id] === "hug" ? 'text-purple-600 bg-purple-50' :
                                userReactions[post._id] === "grateful" ? 'text-green-600 bg-green-50' : 'text-pink-600 bg-pink-50'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                          onClick={() => {
                            const currentReaction = userReactions[post._id]
                            if (currentReaction === "heart") {
                              // If already hearted, remove reaction
                              handleReaction(post._id, "heart")
                            } else {
                              // Otherwise, add heart reaction
                              handleReaction(post._id, "heart")
                            }
                          }}
                          onTouchStart={(e) => {
                            // Show reaction picker on mobile long press
                            const button = e.currentTarget;
                            const touchTimer = setTimeout(() => {
                              const picker = document.getElementById(`reaction-picker-${post._id}`)
                              if (picker) picker.classList.remove('hidden')
                            }, 500);
                            (button as any)._touchTimer = touchTimer;
                          }}
                          onTouchEnd={(e) => {
                            const button = e.currentTarget;
                            if ((button as any)._touchTimer) {
                              clearTimeout((button as any)._touchTimer);
                              (button as any)._touchTimer = null;
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (window.innerWidth >= 768) {
                              const button = e.currentTarget;
                              const hoverTimer = setTimeout(() => {
                                if (button.matches(':hover')) {
                                  const picker = document.getElementById(`reaction-picker-${post._id}`)
                                  if (picker) picker.classList.remove('hidden')
                                }
                              }, 800);
                              (button as any)._hoverTimer = hoverTimer;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (window.innerWidth >= 768) {
                              const button = e.currentTarget;
                              if ((button as any)._hoverTimer) {
                                clearTimeout((button as any)._hoverTimer);
                                (button as any)._hoverTimer = null;
                              }
                              setTimeout(() => {
                                const picker = document.getElementById(`reaction-picker-${post._id}`)
                                if (picker && !picker.matches(':hover')) {
                                  picker.classList.add('hidden')
                                }
                              }, 100)
                            }
                          }}
                        >
                          <span className="text-base sm:text-lg">
                            {userReactions[post._id] === "heart" ? "❤️" : 
                             userReactions[post._id] === "thumbsUp" ? "💪" :
                             userReactions[post._id] === "hope" ? "🌟" :
                             userReactions[post._id] === "hug" ? "🤗" :
                             userReactions[post._id] === "grateful" ? "🙏" : "🤍"}
                          </span>
                          <span className="hidden sm:inline">
                            {userReactions[post._id] ? 
                              (userReactions[post._id] === "heart" ? "Love" :
                               userReactions[post._id] === "thumbsUp" ? "Strength" :
                               userReactions[post._id] === "hope" ? "Hope" :
                               userReactions[post._id] === "hug" ? "Hug" :
                               userReactions[post._id] === "grateful" ? "Grateful" : "Love") 
                              : "Love"
                            }
                          </span>
                        </button>
                        
                        {/* Mobile-Optimized Reaction Picker */}
                        <div 
                          id={`reaction-picker-${post._id}`}
                          className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg hidden z-50 p-2"
                          onMouseEnter={() => {
                            const picker = document.getElementById(`reaction-picker-${post._id}`)
                            if (picker) picker.classList.remove('hidden')
                          }}
                          onMouseLeave={() => {
                            const picker = document.getElementById(`reaction-picker-${post._id}`)
                            if (picker) picker.classList.add('hidden')
                          }}
                          onTouchStart={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center space-x-1">
                            {[
                              { emoji: "❤️", type: "heart", label: "Love" },
                              { emoji: "💪", type: "thumbsUp", label: "Strength" },
                              { emoji: "🌟", type: "hope", label: "Hope" },
                              { emoji: "🤗", type: "hug", label: "Hug" },
                              { emoji: "🙏", type: "grateful", label: "Grateful" }
                            ].map(({ emoji, type, label }) => (
                              <button
                                key={type}
                                className="w-10 h-10 sm:w-8 sm:h-8 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center text-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleReaction(post._id, type as string)
                                  document.getElementById(`reaction-picker-${post._id}`)?.classList.add('hidden')
                                }}
                                title={label}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Comment Button - Mobile optimized */}
                      <button 
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePostClick(post);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Comment</span>
                      </button>
                      
                      {/* Share Button - Mobile optimized */}
                      <button 
                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(post);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Share Modal */}
      <Dialog open={shareModal.open} onOpenChange={(open) => setShareModal({ open, post: open ? shareModal.post : null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Share Post</span>
            </DialogTitle>
            <DialogDescription>
              Share this post with others in the community
            </DialogDescription>
          </DialogHeader>
          
          {shareModal.post && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(shareModal.post._id)}
                  className="flex-1"
                >
                  {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copiedLink ? "Copied!" : "Copy Link"}
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('twitter', shareModal.post)}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="text-xs">Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('facebook', shareModal.post)}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="text-xs">Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialShare('linkedin', shareModal.post)}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="text-xs">LinkedIn</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreatePostModal
        open={showCreatePostModal}
        onOpenChange={setShowCreatePostModal}
        communityId={communityData._id}
        communityName={communityData.title}
        currentUser={{
          name: user.name || "You",
          avatar: user.avatar || "/placeholder-user.jpg"
        }}
        onPostCreated={handleAddPost}
      />

      {/* Post Detail Modal */}
      {selectedPost && selectedPostData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPost(null);
                setSelectedPostData(null);
              }}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Modal Content */}
            <div className="max-h-[90vh] overflow-y-auto">
              <PostDetail
                post={selectedPostData}
                onBack={() => {
                  setSelectedPost(null);
                  setSelectedPostData(null);
                }}
                user={user}
                onAddComment={handleAddComment}
                onAddReply={handleAddReply}
                onReaction={(postId: string, reactionType: string) => {
                  handleReaction(postId, reactionType);
                }}
                userReaction={userReactions[selectedPost] ? String(userReactions[selectedPost]) : ""}
                userReactions={userReactions}
                onReactionUpdate={(postId: string, reactionType: string) => handleReaction(postId, reactionType)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
