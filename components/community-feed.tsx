"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { ArrowLeft, MessageSquare, User, Heart, ThumbsUp, Eye, Clock, Flag, Video, Plus, TrendingUp, Users, Activity, Bookmark, Share2, MoreHorizontal, Filter, Search, Copy, Check, Twitter, Facebook, Linkedin, X } from "lucide-react"
import { CreatePostModal } from "./create-post-modal"
import { logUserActivity } from "@/lib/utils"

interface CommunityFeedProps {
  communitySlug: string
  onBack: () => void
  user: any
}

const initialMockPosts = [
  {
    id: "1",
    caption: "It's been a challenging road since our daughter's Phelan-McDermid Syndrome diagnosis. Looking for others who have been through similar experiences.",
    author: "ParentOfWarrior",
    timestamp: "2 hours ago",
    reactions: { heart: 12, thumbsUp: 8, thinking: 2, eyes: 15 },
    commentCount: 7,
    anonymous: false,
    images: ["/placeholder.svg?height=200&width=300"],
    videos: [],
    community: "pms-support",
    comments: [
      {
        id: "c1",
        content: "So sorry to hear that. My son was diagnosed last year. It gets easier, I promise. Reach out if you need to talk.",
        author: "SupportiveMom",
        timestamp: "1 hour ago",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    caption: "What communication therapies have you found most effective for individuals with Rett Syndrome? We're exploring new options.",
    author: "RettAdvocate",
    timestamp: "4 hours ago",
    tags: ["Rett Syndrome", "therapy", "communication"],
    reactions: { heart: 23, thumbsUp: 15, thinking: 3, eyes: 45 },
    commentCount: 12,
    anonymous: false,
    images: [],
    videos: [],
    community: "rett-syndrome-support",
    comments: [],
  },
  {
    id: "3",
    caption: "New research on Fragile X treatments - Exciting news from the latest conference! Sharing a summary of promising new research directions for Fragile X Syndrome.",
    author: "ScienceGeek",
    timestamp: "6 hours ago",
    tags: ["Fragile X", "research", "treatment"],
    reactions: { heart: 34, thumbsUp: 28, thinking: 1, eyes: 67 },
    commentCount: 18,
    anonymous: false,
    images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    videos: [],
    community: "fragile-x-support",
    comments: [],
  },
  {
    id: "4",
    caption: "Managing sleep issues with Angelman Syndrome - Our child with Angelman Syndrome struggles with sleep. Any tips or strategies that have worked for your family?",
    author: "SleepyParent",
    timestamp: "8 hours ago",
    tags: ["Angelman Syndrome", "sleep", "parenting"],
    reactions: { heart: 18, thumbsUp: 12, thinking: 8, eyes: 32 },
    commentCount: 24,
    anonymous: true,
    images: [],
    videos: [],
    community: "angelman-support",
    comments: [],
  },
  {
    id: "5",
    caption: "Celebrating a milestone: First independent steps! After years of therapy, our son with Prader-Willi Syndrome took his first independent steps today! So proud! 🎉",
    author: "ProudPWParent",
    timestamp: "12 hours ago",
    tags: ["Prader-Willi", "milestone", "progress"],
    reactions: { heart: 89, thumbsUp: 67, thinking: 2, eyes: 134 },
    commentCount: 45,
    anonymous: false,
    images: [],
    videos: [],
    community: "prader-willi-support",
    comments: [],
  },
  {
    id: "6",
    caption: "Inclusive activities for kids with Down Syndrome - Looking for ideas for inclusive summer activities in our area for children with Down Syndrome. Any recommendations?",
    author: "InclusiveMom",
    timestamp: "1 day ago",
    tags: ["Down Syndrome", "activities", "inclusion"],
    reactions: { heart: 15, thumbsUp: 22, thinking: 12, eyes: 38 },
    commentCount: 16,
    anonymous: false,
    images: [],
    videos: [],
    community: "down-syndrome-support",
    comments: [],
  },
  {
    id: "7",
    caption: "Cystic Fibrosis diet tips and recipes - Sharing some high-calorie, nutrient-dense recipes that have been great for managing CF. What are your go-to meals?",
    author: "CFChef",
    timestamp: "1 day ago",
    tags: ["Cystic Fibrosis", "diet", "nutrition"],
    reactions: { heart: 20, thumbsUp: 18, thinking: 5, eyes: 50 },
    commentCount: 10,
    anonymous: false,
    images: [],
    videos: [],
    community: "cystic-fibrosis-support",
    comments: [],
  },
  {
    id: "8",
    caption: "Living with Sickle Cell: Managing pain crises - For those with Sickle Cell Anemia, what are your most effective strategies for managing pain crises at home?",
    author: "SickleCellStrong",
    timestamp: "2 days ago",
    tags: ["Sickle Cell Anemia", "pain management", "coping"],
    reactions: { heart: 25, thumbsUp: 30, thinking: 10, eyes: 60 },
    commentCount: 20,
    anonymous: true,
    images: [],
    videos: [],
    community: "sickle-cell-anemia-support",
    comments: [],
  },
  {
    id: "9",
    caption: "Huntington's Disease research updates - Attended a webinar on the latest breakthroughs in Huntington's Disease research. Feeling hopeful about the future!",
    author: "HDHope",
    timestamp: "3 days ago",
    tags: ["Huntington's Disease", "research", "hope"],
    reactions: { heart: 40, thumbsUp: 35, thinking: 3, eyes: 80 },
    commentCount: 15,
    anonymous: false,
    images: [],
    videos: [],
    community: "huntingtons-disease-support",
    comments: [],
  },
  {
    id: "10",
    caption: "SMA treatment journey: Zolgensma experience - Sharing our family's experience with Zolgensma for SMA Type 1. It's been a long road but seeing progress.",
    author: "SMAFamily",
    timestamp: "1 day ago",
    tags: ["SMA", "Zolgensma", "treatment"],
    reactions: { heart: 30, thumbsUp: 25, thinking: 7, eyes: 70 },
    commentCount: 11,
    anonymous: false,
    images: [],
    videos: [],
    community: "sma-support",
    comments: [],
  },
  {
    id: "11",
    caption: "Batten Disease: Early symptoms and diagnosis - Concerned about potential early symptoms of Batten Disease in our child. What were your experiences with diagnosis?",
    author: "WorriedParent",
    timestamp: "2 days ago",
    tags: ["Batten Disease", "symptoms", "diagnosis"],
    reactions: { heart: 15, thumbsUp: 10, thinking: 5, eyes: 25 },
    commentCount: 8,
    anonymous: true,
    images: [],
    videos: [],
    community: "batten-disease-support",
    comments: [],
  },
  {
    id: "12",
    caption: "Tay-Sachs: Navigating genetic testing results - Just received our genetic testing results for Tay-Sachs. Feeling overwhelmed. Any advice on next steps?",
    author: "NewParent",
    timestamp: "1 day ago",
    tags: ["Tay-Sachs", "genetic testing", "diagnosis"],
    reactions: { heart: 22, thumbsUp: 18, thinking: 6, eyes: 40 },
    commentCount: 9,
    anonymous: false,
    images: [],
    videos: [],
    community: "tay-sachs-support",
    comments: [],
  },
  {
    id: "13",
    caption: "Enzyme replacement therapy for Gaucher Disease - Sharing my experience with enzyme replacement therapy for Type 1 Gaucher Disease. It's made a huge difference.",
    author: "GaucherWarrior",
    timestamp: "3 days ago",
    tags: ["Gaucher Disease", "treatment", "ERT"],
    reactions: { heart: 28, thumbsUp: 20, thinking: 4, eyes: 55 },
    commentCount: 14,
    anonymous: false,
    images: [],
    videos: [],
    community: "gaucher-disease-support",
    comments: [],
  },
  {
    id: "14",
    caption: "MSUD diet management: low-leucine recipes - Looking for creative and tasty low-leucine recipes for Maple Syrup Urine Disease. Share your favorites!",
    author: "MSUDChef",
    timestamp: "1 day ago",
    tags: ["MSUD", "diet", "recipes"],
    reactions: { heart: 18, thumbsUp: 15, thinking: 3, eyes: 30 },
    commentCount: 10,
    anonymous: false,
    images: [],
    videos: [],
    community: "msud-support",
    comments: [],
  },
  {
    id: "15",
    caption: "PKU formula challenges for toddlers - My toddler with PKU is refusing their formula. Any tips or tricks to make it more palatable?",
    author: "PKUMom",
    timestamp: "2 days ago",
    tags: ["PKU", "toddler", "formula"],
    reactions: { heart: 20, thumbsUp: 12, thinking: 8, eyes: 35 },
    commentCount: 16,
    anonymous: true,
    images: [],
    videos: [],
    community: "pku-support",
    comments: [],
  },
  {
    id: "16",
    caption: "General discussion: Advocating for rare diseases - What are effective ways to advocate for rare genetic conditions in your local community or at a national level?",
    author: "RareDiseaseVoice",
    timestamp: "4 days ago",
    tags: ["advocacy", "rare disease", "genetic conditions"],
    reactions: { heart: 30, thumbsUp: 25, thinking: 7, eyes: 70 },
    commentCount: 11,
    anonymous: false,
    images: [],
    videos: [],
    community: "general-genetic-conditions",
    comments: [],
  },
  {
    id: "17",
    caption: "Coping with a new diagnosis of a rare genetic condition - Just received a diagnosis for a very rare genetic condition. Feeling lost and overwhelmed. How do you cope with the emotional toll?",
    author: "SeekingSupport",
    timestamp: "5 hours ago",
    tags: ["new diagnosis", "emotional support", "rare disease"],
    reactions: { heart: 45, thumbsUp: 30, thinking: 10, eyes: 80 },
    commentCount: 25,
    anonymous: true,
    images: [],
    videos: [],
    community: "general-genetic-conditions",
    comments: [],
  },
  {
    id: "18",
    caption: "Sharing resources for undiagnosed genetic conditions - For those still on the diagnostic journey, I've compiled a list of resources that helped us. Happy to share!",
    author: "DiagnosticJourney",
    timestamp: "1 day ago",
    tags: ["undiagnosed", "resources", "genetic testing"],
    reactions: { heart: 38, thumbsUp: 28, thinking: 5, eyes: 60 },
    commentCount: 15,
    anonymous: false,
    images: [],
    videos: [],
    community: "general-genetic-conditions",
    comments: [],
  },
]

// Add a type guard at the top of the file:
function hasBioAndConditions(obj: any): obj is { bio: string; conditions: string[] } {
  return typeof obj === 'object' && obj !== null && 'bio' in obj && 'conditions' in obj && Array.isArray(obj.conditions);
}

export function CommunityFeed({ communitySlug, onBack, user }: CommunityFeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent")
  const [isJoined, setIsJoined] = useState(false)
  const [shareModal, setShareModal] = useState<{ open: boolean; post: any | null }>({ open: false, post: null })
  const [copiedLink, setCopiedLink] = useState(false)

  // Community info mock (could be fetched in real app)
  const communityInfo = useMemo(() => {
    const map: Record<string, { name: string; description: string; memberCount: number; color: string }> = {
      "pms-support": { name: "PMS Support", description: "A supportive community for people managing Phelan-McDermid Syndrome", memberCount: 850, color: "bg-blue-100 text-blue-800" },
      "rett-syndrome-support": { name: "Rett Syndrome Community", description: "Connecting families and individuals affected by Rett Syndrome", memberCount: 620, color: "bg-purple-100 text-purple-800" },
      "fragile-x-support": { name: "Fragile X Forum", description: "Discussions and resources for Fragile X Syndrome", memberCount: 710, color: "bg-green-100 text-green-800" },
      "angelman-support": { name: "Angelman Syndrome Connect", description: "Support and information for Angelman Syndrome", memberCount: 480, color: "bg-yellow-100 text-yellow-800" },
      "prader-willi-support": { name: "Prader-Willi Life", description: "Navigating life with Prader-Willi Syndrome", memberCount: 350, color: "bg-orange-100 text-orange-800" },
      "down-syndrome-support": { name: "Down Syndrome Network", description: "A community for individuals and families with Down Syndrome", memberCount: 1500, color: "bg-pink-100 text-pink-800" },
      "cystic-fibrosis-support": { name: "Cystic Fibrosis Warriors", description: "Fighting CF together, sharing experiences and support", memberCount: 920, color: "bg-teal-100 text-teal-800" },
      "sickle-cell-anemia-support": { name: "Sickle Cell Strong", description: "Empowering those with Sickle Cell Anemia", memberCount: 550, color: "bg-red-100 text-red-800" },
      "huntingtons-disease-support": { name: "Huntington's Hope", description: "Support and research for Huntington's Disease", memberCount: 280, color: "bg-indigo-100 text-indigo-800" },
      "sma-support": { name: "SMA Family Support", description: "Connecting families affected by Spinal Muscular Atrophy", memberCount: 400, color: "bg-lime-100 text-lime-800" },
      "batten-disease-support": { name: "Batten Disease Alliance", description: "A community for support and advocacy for Batten Disease", memberCount: 180, color: "bg-rose-100 text-rose-800" },
      "tay-sachs-support": { name: "Tay-Sachs Connect", description: "Support and resources for Tay-Sachs Disease families.", memberCount: 120, color: "bg-cyan-100 text-cyan-800" },
      "gaucher-disease-support": { name: "Gaucher Disease Community", description: "A place for individuals and families with Gaucher Disease.", memberCount: 200, color: "bg-amber-100 text-amber-800" },
      "msud-support": { name: "MSUD Support Group", description: "Connecting those affected by Maple Syrup Urine Disease.", memberCount: 90, color: "bg-fuchsia-100 text-fuchsia-800" },
      "pku-support": { name: "PKU Life", description: "Living with Phenylketonuria: tips, recipes, and support.", memberCount: 300, color: "bg-emerald-100 text-emerald-800" },
      "general-genetic-conditions": { name: "General Genetic Conditions", description: "A broad community for various genetic conditions", memberCount: 2500, color: "bg-gray-100 text-gray-800" },
    }
    return map[communitySlug] || { name: communitySlug, description: "A rare disease community", memberCount: 0, color: "bg-gray-100 text-gray-800" }
  }, [communitySlug])

  // Check if user is already in the community
  useEffect(() => {
    try {
      const userCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
      const isAlreadyMember = userCommunities.includes(communitySlug)
      setIsJoined(isAlreadyMember)
    } catch (error) {
      console.error('Error checking community membership:', error)
      // Default to not joined if there's an error
      setIsJoined(false)
    }
  }, [communitySlug, user])

  // Handle joining the community
  const handleJoinCommunity = () => {
    try {
      const userCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
      
      // Check if already joined to prevent duplicates
      if (!userCommunities.includes(communitySlug)) {
        const updatedCommunities = [...userCommunities, communitySlug]
        localStorage.setItem('user_communities', JSON.stringify(updatedCommunities))
        logUserActivity(`Joined community: ${communityInfo.name}`)
      }
      
      // Always set joined state to true when button is clicked
      setIsJoined(true)
    } catch (error) {
      console.error('Error joining community:', error)
      // Still set as joined in UI even if localStorage fails
      setIsJoined(true)
    }
  }

  // Memoize post creation handler
  const handlePostCreated = useCallback(() => {
    // Force refresh by re-running the post filtering logic
    const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
    const filteredMock = initialMockPosts.filter((post) => post.community === communitySlug)
    const filteredUser = userPosts.filter((post: any) => post.community === communitySlug)
    let allPosts = [...filteredUser, ...filteredMock]
    if (searchTerm) {
      allPosts = allPosts.filter(post => {
        const searchText = (post.caption || '').toLowerCase()
        return searchText.includes(searchTerm.toLowerCase())
      })
    }
    if (sortBy === "popular") {
      allPosts.sort((a, b) => {
        const aScore = Object.values(a.reactions).reduce((sum: number, val: any) => sum + val, 0)
        const bScore = Object.values(b.reactions).reduce((sum: number, val: any) => sum + val, 0)
        return bScore - aScore
      })
    } else if (sortBy === "trending") {
      allPosts.sort((a, b) => b.commentCount - a.commentCount)
    }
    // Only update if posts actually changed
    setPosts(prev => JSON.stringify(prev) !== JSON.stringify(allPosts) ? allPosts : prev)
  }, [communitySlug, searchTerm, sortBy])

  // Filter and sort posts when dependencies change
  useEffect(() => {
    handlePostCreated()
  }, [handlePostCreated])

  // Listen for post creation events to refresh the feed
  useEffect(() => {
    window.addEventListener("post-created", handlePostCreated)
    return () => {
      window.removeEventListener("post-created", handlePostCreated)
    }
  }, [handlePostCreated])

  // Top contributors (by post count)
  const topContributors = useMemo(() => {
    const userCount: Record<string, number> = {}
    posts.forEach(post => { userCount[post.author] = (userCount[post.author] || 0) + 1 })
    return Object.entries(userCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([author]) => author)
  }, [posts])

  // Featured post (most reactions)
  const featuredPost = useMemo(() => {
    if (posts.length === 0) return null
    return posts.reduce((max, post) => {
      const maxScore: number = (Object.values(max.reactions) as number[]).reduce((a, b) => a + b, 0)
      const postScore: number = (Object.values(post.reactions) as number[]).reduce((a, b) => a + b, 0)
      return postScore > maxScore ? post : max
    }, posts[0])
  }, [posts])

  // Add post handler
  const handleAddPost = (newPost: any) => {
    const postWithComments = {
      ...newPost,
      comments: [],
      community: communitySlug,
    }
    // Save to localStorage user_posts
    const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
    localStorage.setItem('user_posts', JSON.stringify([postWithComments, ...userPosts]))
    setPosts((prev) => [postWithComments, ...prev])
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('post-created', { detail: postWithComments }))
    
    setShowCreatePostModal(false)
  }

  // Reaction handler with activity logging
  const handleReaction = (postId: string, reactionType: string) => {
    setUserReactions((prev) => ({ ...prev, [postId]: reactionType }))
    const post = posts.find((p) => p.id === postId)
    if (post) {
      const content = post.caption || 'Untitled post'
      logUserActivity(`Reacted with ${reactionType} to post: "${content}"`)
    }
    // You can add your existing reaction logic here if needed
  }

  // Share handler
  const handleShare = (post: any) => {
    console.log('Share button clicked for post:', post.id)
    setShareModal({ open: true, post })
    const content = post.caption || 'Untitled post'
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

  // Social media share handlers
  const handleSocialShare = (platform: string, post: any) => {
    const postLink = `${window.location.origin}/community/${communitySlug}/post/${post.id}`
    const content = post.caption || ''
    const text = `Check out this post from ${communityInfo.name}: "${content.slice(0, 100)}${content.length > 100 ? '...' : ''}"`
    
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
      logUserActivity(`Shared post to ${platform}: ${post.id}`)
    }
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading posts...</span>
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
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:flex-none"
              >
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Community Banner */}
      <div className="max-w-6xl mx-auto mt-4 md:mt-6 mb-6 md:mb-8 px-3 md:px-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl overflow-hidden">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex-1 mb-4 md:mb-6 lg:mb-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl md:text-4xl font-bold mb-2">{communityInfo.name}</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <Users className="h-3 w-3 mr-1" />
                      {communityInfo.memberCount.toLocaleString()} members
                    </Badge>
                  </div>
                </div>
                
                <p className="text-blue-100 text-sm md:text-lg mb-3 md:mb-4 max-w-2xl text-center sm:text-left">
                  {communityInfo.description}
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 md:gap-6 text-xs md:text-sm">
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <Activity className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{posts.length} posts</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                    <span>Active community</span>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                    <span>
                      {posts.reduce((sum, post) => sum + post.commentCount, 0)} comments
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
                <div className="text-center lg:text-right mb-4">
                  <span className="text-blue-200 text-xs md:text-sm font-medium block">Top Contributors</span>
                  <div className="flex justify-center lg:justify-end -space-x-2 mt-2">
                    {topContributors.slice(0, 5).map((author, idx) => (
                      <div 
                        key={author} 
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 text-white font-semibold text-xs md:text-sm shadow-lg hover:scale-110 transition-transform" 
                        style={{ zIndex: 10 - idx }}
                        title={author}
                      >
                        {author[0].toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Featured Post */}
      {featuredPost && (
        <div className="max-w-6xl mx-auto mb-6 md:mb-8 px-3 md:px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 md:mb-4 gap-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Featured Post</h3>
              <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 text-xs">
                ⭐ Trending
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
              <Eye className="h-3 w-3 md:h-4 md:w-4" />
              <span>Most engaged</span>
            </div>
          </div>
          
          <Card className="group hover:shadow-2xl shadow-lg transition-all duration-300 ease-in-out rounded-xl border border-gray-200 bg-white overflow-hidden relative">
            {/* Featured Badge */}
            <div className="absolute top-3 md:top-4 right-3 md:right-4 z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg text-xs">
                ⭐ Featured
              </Badge>
            </div>
            
            {/* Banner Image */}
            {featuredPost.images && featuredPost.images.length > 0 && (
              <div className="relative w-full h-48 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={featuredPost.images[0]}
                  alt="Post banner"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
            
            <CardHeader className="pb-3 md:pb-4 p-3 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-medium">{featuredPost.anonymous ? "Anonymous" : featuredPost.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    <span>{featuredPost.timestamp}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
              <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                {featuredPost.caption && featuredPost.caption.length > 200 ? `${featuredPost.caption.slice(0, 200)}...` : featuredPost.caption}
                {featuredPost.caption && featuredPost.caption.length > 200 && (
                  <button className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">
                    Read more
                  </button>
                )}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                <div className="flex items-center space-x-3 md:space-x-6 overflow-x-auto">
                  <button
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                      userReactions[featuredPost.id] === "heart" 
                        ? "bg-red-50 text-red-600 border border-red-200" 
                        : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                    }`}
                    onClick={() => handleReaction(featuredPost.id, "heart")}
                  >
                    <Heart className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-medium text-xs md:text-sm">{featuredPost.reactions.heart}</span>
                  </button>
                  <button
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                      userReactions[featuredPost.id] === "thumbsUp" 
                        ? "bg-blue-50 text-blue-600 border border-blue-200" 
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={() => handleReaction(featuredPost.id, "thumbsUp")}
                  >
                    <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-medium text-xs md:text-sm">{featuredPost.reactions.thumbsUp}</span>
                  </button>
                  <button
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                      userReactions[featuredPost.id] === "eyes" 
                        ? "bg-green-50 text-green-600 border border-green-200" 
                        : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                    }`}
                    onClick={() => handleReaction(featuredPost.id, "eyes")}
                  >
                    <Eye className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-medium text-xs md:text-sm">{featuredPost.reactions.eyes}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 p-1 md:p-2">
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="text-xs md:text-sm">{featuredPost.commentCount}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
                    <Bookmark className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-800 p-1 md:p-2"
                    onClick={() => handleShare(featuredPost)}
                  >
                    <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
                    <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Posts Feed */}
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {posts.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-12 md:py-16 px-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? "No posts found" : "No posts in this community yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm md:text-base">
                {searchTerm 
                  ? "Try adjusting your search to find more content."
                  : "Be the first to share something with this community!"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreatePostModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 md:py-4 border-b border-gray-200 gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  {searchTerm ? `Search results for "${searchTerm}"` : "Community Posts"}
                </h2>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 w-fit text-xs">
                  {posts.filter(p => !featuredPost || p.id !== featuredPost.id).length} posts
                </Badge>
              </div>
              <div className="text-xs md:text-sm text-gray-500">
                Sorted by {sortBy}
              </div>
            </div>
            
            {posts.filter(p => !featuredPost || p.id !== featuredPost.id).map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-lg shadow-sm transition-all duration-300 ease-in-out rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-blue-200"
              >
                {/* Banner Image */}
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt="Post banner"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                )}
                
                <CardHeader className="pb-2 md:pb-3 p-3 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 md:space-x-3 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-medium">{post.anonymous ? "Anonymous" : post.author}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 p-3 md:p-6 md:pt-0">
                  <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">
                    {post.caption && post.caption.length > 180 ? `${post.caption.slice(0, 180)}...` : post.caption}
                    {post.caption && post.caption.length > 180 && (
                      <button className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">
                        Read more
                      </button>
                    )}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
                    <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto">
                      <button
                        className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                          userReactions[post.id] === "heart" 
                            ? "bg-red-50 text-red-600 border border-red-200" 
                            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                        onClick={() => handleReaction(post.id, "heart")}
                      >
                        <Heart className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-medium text-xs md:text-sm">{post.reactions.heart}</span>
                      </button>
                      <button
                        className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                          userReactions[post.id] === "thumbsUp" 
                            ? "bg-blue-50 text-blue-600 border border-blue-200" 
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                        onClick={() => handleReaction(post.id, "thumbsUp")}
                      >
                        <ThumbsUp className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-medium text-xs md:text-sm">{post.reactions.thumbsUp}</span>
                      </button>
                      <button
                        className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1 rounded-full transition-all duration-200 whitespace-nowrap ${
                          userReactions[post.id] === "eyes" 
                            ? "bg-green-50 text-green-600 border border-green-200" 
                            : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                        }`}
                        onClick={() => handleReaction(post.id, "eyes")}
                      >
                        <Eye className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="font-medium text-xs md:text-sm">{post.reactions.eyes}</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 p-1 md:p-2">
                        <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        <span className="text-xs md:text-sm">{post.commentCount}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
                        <Bookmark className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-800 p-1 md:p-2"
                        onClick={() => handleShare(post)}
                      >
                        <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 md:p-2">
                        <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              {/* Post Preview */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {shareModal.post.anonymous ? "Anonymous" : shareModal.post.author}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{shareModal.post.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {shareModal.post.caption?.length > 100 
                    ? `${shareModal.post.caption.slice(0, 100)}...` 
                    : shareModal.post.caption}
                </p>
              </div>

              {/* Copy Link Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Copy Link</label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/community/${communitySlug}/post/${shareModal.post.id}`}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleCopyLink(shareModal.post.id)}
                    className="px-3"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Social Media Share Buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Share on Social Media</label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('twitter', shareModal.post)}
                    className="flex-1"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('facebook', shareModal.post)}
                    className="flex-1"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('linkedin', shareModal.post)}
                    className="flex-1"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              {/* Additional Share Options */}
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Link will direct to the post in {communityInfo.name}</p>
                  <p>• Recipients can view the post and join the community</p>
                  <p>• Your privacy settings will be respected</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CreatePostModal
        open={showCreatePostModal}
        onOpenChange={setShowCreatePostModal}
        communityId={communitySlug}
        communityName={communityInfo.name}
        onPostCreated={handleAddPost}
      />
    </div>
  )
}
