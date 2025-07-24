"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfilePicture } from "@/hooks/use-profile-picture"
import { UserAvatar } from "@/components/ui/user-avatar"
import {
  Users,
  Search,
  MessageSquare,
  Settings,
  User,
  Heart,
  ThumbsUp,
  Eye,
  Clock,
  Flag,
  Filter,
  Trophy,
  Plus,
  TrendingUp,
  Activity,
  Bookmark,
  Share2,
  MoreHorizontal,
  Star,
  ArrowUp,
  Home,
} from "lucide-react"

import { PostDetail } from "./post-detail"
import { CreatePostModal } from "./create-post-modal"
import type { Community as CommunityType, Post as PostType } from "@/components/mock-community-data"
import { mockCommunities, basePosts } from "@/components/mock-community-data"
import { AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { CreateCommunityModal } from "@/components/create-community-modal"
import { CommunityFeed } from "./community-feed"
import { JoinCommunity } from "@/components/join-community";
import { DMConversation } from "@/components/dm-conversation";

/**
 * CommunityHome - Main community hub and feed for the app.
 * @param user - The current user object (required)
 */
interface CommunityHomeProps {
  user: {
    username?: string
    conditions?: string[]
    [key: string]: any
  }
}

const availableConditions: string[] = [
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
  "Other Genetic Condition",
]

const communityMap: { [key: string]: string } = {
  "Phelan-McDermid Syndrome (PMS)": "pms-support",
  "Rett Syndrome": "rett-syndrome-support",
  "Fragile X Syndrome": "fragile-x-support",
  "Angelman Syndrome": "angelman-support",
  "Prader-Willi Syndrome": "prader-willi-support",
  "Down Syndrome": "down-syndrome-support",
  "Cystic Fibrosis": "cystic-fibrosis-support",
  "Sickle Cell Anemia": "sickle-cell-anemia-support",
  "Huntington's Disease": "huntingtons-disease-support",
  "Spinal Muscular Atrophy (SMA)": "sma-support",
  "Batten Disease": "batten-disease-support",
  "Tay-Sachs Disease": "tay-sachs-support",
  "Gaucher Disease": "gaucher-disease-support",
  "Maple Syrup Urine Disease (MSUD)": "msud-support",
  "Phenylketonuria (PKU)": "pku-support",
  "Other Genetic Condition": "general-genetic-conditions",
}

const CommunityHome: React.FC<CommunityHomeProps> = ({ user }) => {
  const { profilePicture } = useProfilePicture()
  
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

  // State
  const [currentView, setCurrentView] = useState<
    "home" | "community" | "profile" | "settings" | "dmInbox" | "dmConversation" | "milestoneFeed" | "guidedOnboarding"
  >("home")
  const [selectedCommunity, setSelectedCommunity] = useState<string>("")
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    posts: PostType[]
    communities: CommunityType[]
  }>({ posts: [], communities: [] })
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [personalizedPosts, setPersonalizedPosts] = useState<PostType[]>([])
  const [globalPopularPosts, setGlobalPopularPosts] = useState<PostType[]>([])
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [communityFilter, setCommunityFilter] = useState("all")
  const [userReactions, setUserReactions] = useState<Record<string, keyof PostType['reactions'] | "">>({})

  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false)

  const [userCommunities, setUserCommunities] = useState<CommunityType[]>([])
  const [userConditions, setUserConditions] = useState<string[]>([])
  const router = useRouter()

  // Community creation state
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    bio: "",
    description: "",
    conditions: [] as string[],
  });
  const [createStep, setCreateStep] = useState(0);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const totalSteps = 4;
  const [conditionSearch, setConditionSearch] = useState("");

  // Initialize both userCommunities and userConditions from localStorage on mount
  useEffect(() => {
    const storedCommunities = localStorage.getItem("user_communities");
    if (storedCommunities) {
      try {
        const parsed = JSON.parse(storedCommunities);
        if (Array.isArray(parsed)) {
          setUserCommunities(parsed);
        }
      } catch (error) {
        console.error("Error parsing user_communities from localStorage:", error);
        setUserCommunities([]);
      }
    }

    const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
    setUserConditions(userData.conditions || user.conditions || []);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save user-created communities to localStorage whenever userCommunities changes
  useEffect(() => {
    if (userCommunities.length > 0) {
      localStorage.setItem("user_communities", JSON.stringify(userCommunities));
    }
  }, [userCommunities]);

  // Data: Personalized and global posts
  const getPersonalizedFeedPosts = (userConditions: string[]): PostType[] => {
    // Get communities from conditions (mapped)
    const conditionCommunities = userConditions.map((condition) => communityMap[condition] || condition).filter(Boolean)
    
    // Get all user's communities (joined + created)
    const allUserCommunitySlugs = [
      ...userCommunities.map(c => c.slug),
      ...joinedCommunities.filter((jc: CommunityType) => !userCommunities.some((uc: CommunityType) => uc.slug === jc.slug)).map(c => c.slug),
      ...conditionCommunities
    ]
    
    // Remove duplicates
    const uniqueCommunitySlugs = [...new Set(allUserCommunitySlugs)]
    
    let userPosts: PostType[] = []
    try {
      const raw = localStorage.getItem('user_posts')
      if (raw) {
        const parsed = JSON.parse(raw)
        userPosts = Array.isArray(parsed) ? parsed as PostType[] : []
      }
    } catch {
      userPosts = []
    }
    
    return [
      ...basePosts.filter((post: PostType) => uniqueCommunitySlugs.includes(post.community)),
      ...userPosts.filter((post: PostType) => uniqueCommunitySlugs.includes(post.community)),
    ]
  }
  
  const getGlobalPopularPosts = (): PostType[] => {
    let userPosts: PostType[] = []
    try {
      const raw = localStorage.getItem('user_posts')
      if (raw) {
        const parsed = JSON.parse(raw)
        userPosts = Array.isArray(parsed) ? parsed as PostType[] : []
      }
    } catch {
      userPosts = []
    }
    return [...basePosts, ...userPosts]
      .sort((a: PostType, b: PostType) => {
        const aScore = Object.values(a.reactions).reduce((sum: number, count: number) => sum + (count as number), 0)
        const bScore = Object.values(b.reactions).reduce((sum: number, count: number) => sum + (count as number), 0)
        return bScore - aScore
      })
      .slice(0, 10)
  }

  // Effects for updating posts when conditions or communities change
  useEffect(() => {
    console.log("Refreshing feeds due to userConditions or userCommunities change")
    console.log("Current userConditions:", userConditions)
    console.log("Current userCommunities:", userCommunities.map(c => c.name))
    console.log("Current joinedCommunities:", joinedCommunities.map(c => c.name))
    setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
    setGlobalPopularPosts(getGlobalPopularPosts())
  }, [userConditions, userCommunities])

  // Listen for post creation events
  useEffect(() => {
    const handlePostCreated = () => {
      console.log("Post created event received, refreshing feeds...")
      setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
      setGlobalPopularPosts(getGlobalPopularPosts())
    }

    window.addEventListener("post-created", handlePostCreated)
    
    return () => {
      window.removeEventListener("post-created", handlePostCreated)
    }
  }, [userConditions])
  
  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const storageHandler = (e: StorageEvent) => {
      if (e.key === "user_communities") {
        const stored = e.newValue;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setUserCommunities(parsed);
            }
          } catch (error) {
            console.error("Error parsing user_communities from storage event:", error);
          }
        } else {
          setUserCommunities([]);
        }
      } else if (e.key === "user_posts") {
        // Refresh posts when posts are updated in other tabs
        console.log("Posts updated in another tab, refreshing feeds...")
        setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
        setGlobalPopularPosts(getGlobalPopularPosts())
      }
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, [userConditions]);

 

  // Community lists - memoized to prevent infinite re-renders
  const joinedCommunities: CommunityType[] = useMemo(() => 
    mockCommunities.filter((community: CommunityType) =>
      userConditions
        .map((condition: string) => communityMap[condition])
        .filter(Boolean)
        .includes(community.slug)
    ), [userConditions]
  )

  // Combined communities for Select component - memoized
  const allUserCommunities = useMemo(() => [
    ...userCommunities,
    ...joinedCommunities.filter((jc: CommunityType) => 
      !userCommunities.some((uc: CommunityType) => uc.slug === jc.slug)
    ),
  ], [userCommunities, joinedCommunities])

  // Post reactions/comments
  const handleReaction = (postId: string, reactionType: keyof PostType['reactions']) => {
    const updatePosts = (prevPosts: PostType[]) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions }
          const currentUserReaction = userReactions[postId] as keyof PostType['reactions'] | undefined
          if (currentUserReaction && newReactions[currentUserReaction] > 0) {
            newReactions[currentUserReaction]--
          }
          if (currentUserReaction === reactionType) {
            setUserReactions((prev) => ({ ...prev, [postId]: "" }))
          } else {
            newReactions[reactionType] = (newReactions[reactionType] || 0) + 1
            setUserReactions((prev) => ({ ...prev, [postId]: reactionType }))
          }
          return { ...post, reactions: newReactions }
        }
        return post
      })
    setPersonalizedPosts(updatePosts(personalizedPosts))
    setGlobalPopularPosts(updatePosts(globalPopularPosts))
  }
  const addComment = (postId: string, comment: any) => {
    const updatePosts = (prevPosts: PostType[]) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment],
            commentCount: post.commentCount + 1,
          }
        }
        return post
      })
    setPersonalizedPosts(updatePosts(personalizedPosts))
    setGlobalPopularPosts(updatePosts(globalPopularPosts))
  }
  const addReply = (postId: string, commentId: string, reply: any) => {
    const updatePosts = (prevPosts: PostType[]) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updateComments = (comments: any[]): any[] => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, reply],
                }
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateComments(comment.replies),
                }
              }
              return comment
            })
          }
          return {
            ...post,
            comments: updateComments(post.comments),
            commentCount: post.commentCount + 1,
          }
        }
        return post
      })
    setPersonalizedPosts(updatePosts(personalizedPosts))
    setGlobalPopularPosts(updatePosts(globalPopularPosts))
  }
 



  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      // Get current posts based on active tab
      const posts = activeTab === "suggested" ? globalPopularPosts : personalizedPosts
      
      // Search communities
      const searchedCommunities = mockCommunities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).filter(community => 
        // Exclude communities user is already part of
        !userCommunities.some(uc => uc.slug === community.slug) &&
        !joinedCommunities.some(jc => jc.slug === community.slug)
      )

      // Search posts
      const searchedPosts = posts.filter((post: PostType) => {
        const matchesSearch =
          (post.caption && post.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesSearch
      })

      setSearchResults({
        posts: searchedPosts,
        communities: searchedCommunities
      })
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
      setSearchResults({ posts: [], communities: [] })
    }
  }, [searchQuery, activeTab, globalPopularPosts, personalizedPosts, userCommunities, joinedCommunities])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container')
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSearchResults])

  // Handle joining a community from search
  const handleJoinCommunityFromSearch = (community: CommunityType) => {
    // Prevent duplicate join
    if (userCommunities.some((c) => c.slug === community.slug)) return;
    const updated = [community, ...userCommunities];
    setUserCommunities(updated);
    localStorage.setItem("user_communities", JSON.stringify(updated));
    
    // Update user conditions if this community corresponds to a condition they don't have
    const conditionForCommunity = Object.keys(communityMap).find(condition => communityMap[condition] === community.slug);
    if (conditionForCommunity && !userConditions.includes(conditionForCommunity)) {
      const updatedConditions = [...userConditions, conditionForCommunity];
      setUserConditions(updatedConditions);
      
      // Update localStorage with new condition
      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      userData.conditions = updatedConditions;
      localStorage.setItem("user_data", JSON.stringify(userData));
      
      console.log("Added condition for joined community:", conditionForCommunity);
    }
    
    // Refresh feeds immediately after joining
    setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
    setGlobalPopularPosts(getGlobalPopularPosts())
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('community-updated', { detail: { action: 'joined', community } }));
    
    // Clear search
    setSearchQuery("")
    setShowSearchResults(false)
    
    console.log("Joined community from search:", community.name)
  }
  
  const sortedPosts = useMemo(() => {
    const currentPosts = activeTab === "suggested" ? globalPopularPosts : personalizedPosts
    const filteredPosts = currentPosts.filter((post: PostType) => {
      const matchesCommunity = communityFilter === "all" || post.community === communityFilter
      const matchesSearch =
        searchQuery === "" ||
        (post.caption && post.caption.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCommunity && matchesSearch
    })
    
    return [...filteredPosts].sort((a: PostType, b: PostType) => {
      if (activeTab === "popular" || activeTab === "suggested") {
        const aScore = Object.values(a.reactions).reduce((sum: number, count: number) => sum + (count as number), 0)
        const bScore = Object.values(b.reactions).reduce((sum: number, count: number) => sum + (count as number), 0)
        return bScore - aScore
      }
      return 0
    })
  }, [activeTab, globalPopularPosts, personalizedPosts, communityFilter, searchQuery])

  if (selectedPost) {
    const posts = activeTab === "suggested" ? globalPopularPosts : personalizedPosts
    const post = posts.find((p: PostType) => p.id === selectedPost)
    return (
      <PostDetail
        post={post}
        onBack={() => setSelectedPost(null)}
        user={user}
        onAddComment={addComment}
        onAddReply={addReply}
        onReaction={(postId, reactionType) => handleReaction(postId, reactionType as keyof PostType['reactions'])}
        userReaction={userReactions[selectedPost]}
      />
    )
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header - Hidden on mobile when in DM views */}
      <header className={`bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm md:sticky md:top-0 z-50 ${(currentView === "dmInbox" || currentView === "dmConversation") ? 'hidden md:block' : ''}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Caregene
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                disabled={allUserCommunities.length === 0}
                title={allUserCommunities.length === 0 ? 'Join a community to create a post' : ''}
                onClick={() => setShowCreatePostModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/dms")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                DMs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/milestones")}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Milestones
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 p-2"
                onClick={() => setShowCreateCommunityModal(true)}
                title="Create Community"
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>

       
          
          </div>
        </div>
      </header>
      
      {/* DM Views - Only shown on mobile when in DM state */}
      {(currentView === "dmInbox" || currentView === "dmConversation") && (
        <div className="md:hidden min-h-screen bg-white">
          <DMConversation 
            onBack={() => {
              setCurrentView("home");
            }}
            onConversationChange={(hasConversation) => {
              setCurrentView(hasConversation ? "dmConversation" : "dmInbox");
            }}
          />
        </div>
      )}
      
      {/* Main Content - Hidden when in DM view on mobile */}
      <div className={`max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 md:pb-6 ${(currentView === "dmInbox" || currentView === "dmConversation") ? 'hidden md:block' : ''}`}>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Enhanced Sidebar - Hidden on mobile, shown in drawer */}
          <div className="hidden xl:block xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <UserAvatar 
                    profilePicture={profilePicture}
                    username={user?.username || 'User'}
                    size="lg" 
                    className="bg-white/20" 
                  />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Welcome To CareGene!</h3>
                
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{allUserCommunities.length}</div>
                    <div className="text-blue-200 text-xs">Communities</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{personalizedPosts.length}</div>
                    <div className="text-blue-200 text-xs">Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Communities */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Your Communities
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateCommunityModal(true)}
                    className="hover:bg-blue-50 hover:border-blue-300 p-1.5 sm:p-2"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {allUserCommunities.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">No communities yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateCommunityModal(true)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Create Community
                    </Button>
                  </div>
                ) : (
                  allUserCommunities.map((community: CommunityType) => (
                    <div
                      key={community.id || community.slug}
                      className="group p-2 sm:p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        router.push(`/community/${community.slug}`)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                          <div 
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                            style={{ background: community.color?.includes('bg-') ? '#3b82f6' : community.color || "#3b82f6" }} 
                          />
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-blue-600 block truncate">
                              {community.name}
                            </span>
                            {userCommunities.some((uc: CommunityType) => uc.id === community.id && uc.slug === community.slug && uc.id?.startsWith('user-')) && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs mt-1">
                                Admin
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          {community.memberCount || 0}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Join New Communities */}
            <JoinCommunity
              userCommunities={userCommunities}
              allCommunities={mockCommunities}
              onJoin={(community) => {
                // Prevent duplicate join
                if (userCommunities.some((c) => c.slug === community.slug)) return;
                const updated = [community, ...userCommunities];
                setUserCommunities(updated);
                localStorage.setItem("user_communities", JSON.stringify(updated));
                
                // Update user conditions if this community corresponds to a condition they don't have
                const conditionForCommunity = Object.keys(communityMap).find(condition => communityMap[condition] === community.slug);
                if (conditionForCommunity && !userConditions.includes(conditionForCommunity)) {
                  const updatedConditions = [...userConditions, conditionForCommunity];
                  setUserConditions(updatedConditions);
                  
                  // Update localStorage with new condition
                  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
                  userData.conditions = updatedConditions;
                  localStorage.setItem("user_data", JSON.stringify(userData));
                  
                  console.log("Added condition for joined community:", conditionForCommunity);
                }
                
                // Refresh feeds immediately after joining
                setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
                setGlobalPopularPosts(getGlobalPopularPosts())
                
                // Dispatch event to notify other components
                window.dispatchEvent(new CustomEvent('community-updated', { detail: { action: 'joined', community } }));
                
                console.log("Joined community and refreshed feeds:", community.name)
              }}
            />

            {/* Quick Stats - Simplified for mobile */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Popular Posts</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    {globalPopularPosts.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Your Feed</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {personalizedPosts.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Active Now</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-green-600">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-2 block text-gray-700">Community</label>
                  <Select value={communityFilter} onValueChange={setCommunityFilter}>
                    <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Communities</SelectItem>
                      {allUserCommunities.map((community: CommunityType) => (
                        <SelectItem key={community.slug} value={community.slug}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Enhanced Main Feed */}
          <div className="xl:col-span-3">
            {/* Search and Tabs */}
            <div className="mb-4 sm:mb-6 lg:mb-8 space-y-4 sm:space-y-6">
              {/* Search Bar */}
              <div id="search-container" className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  placeholder="Search posts, communities, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg"
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && (searchResults.communities.length > 0 || searchResults.posts.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {/* Communities Section */}
                    {searchResults.communities.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-600" />
                          Communities ({searchResults.communities.length})
                        </h4>
                        <div className="space-y-2">
                          {searchResults.communities.slice(0, 3).map((community) => (
                            <div
                              key={community.slug}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <div
                                className="flex items-center space-x-3 min-w-0 flex-1"
                                onClick={() => router.push(`/community/${community.slug}`)}
                              >
                                <div 
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                  style={{ background: community.color?.includes('bg-') ? '#3b82f6' : community.color || "#3b82f6" }} 
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">{community.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{community.description || `${community.memberCount || 0} members`}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 ml-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleJoinCommunityFromSearch(community)
                                }}
                              >
                                Join
                              </Button>
                            </div>
                          ))}
                          {searchResults.communities.length > 3 && (
                            <div className="text-center pt-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 text-xs">
                                View {searchResults.communities.length - 3} more communities
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Posts Section */}
                    {searchResults.posts.length > 0 && (
                      <div className="p-3">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                          Posts ({searchResults.posts.length})
                        </h4>
                        <div className="space-y-2">
                          {searchResults.posts.slice(0, 3).map((post) => {
                            const community = mockCommunities.find((c: CommunityType) => c.slug === post.community)
                            return (
                              <div
                                key={post.id}
                                className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => {
                                  setSelectedPost(post.id)
                                  setShowSearchResults(false)
                                  setSearchQuery("")
                                }}
                              >
                                <div className="flex items-start space-x-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Badge 
                                        className="bg-blue-100 text-blue-800 text-xs cursor-pointer hover:bg-blue-200"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          if (community) {
                                            router.push(`/community/${community.slug}`)
                                            setShowSearchResults(false)
                                            setSearchQuery("")
                                          }
                                        }}
                                      >
                                        {community?.name || "Community"}
                                      </Badge>
                                      <div className="flex items-center space-x-1">
                                        {!post.anonymous && (
                                          <UserAvatar 
                                            profilePicture={post.author === (user?.username || 'User') ? profilePicture : ''}
                                            username={post.author}
                                            size="sm"
                                          />
                                        )}
                                        <span className="text-xs text-gray-500">by {post.anonymous ? "Anonymous" : post.author}</span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-900 line-clamp-2">
                                      {post.caption && post.caption.length > 80 
                                        ? `${post.caption.slice(0, 80)}...` 
                                        : post.caption || "View post"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          {searchResults.posts.length > 3 && (
                            <div className="text-center pt-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 text-xs">
                                View {searchResults.posts.length - 3} more posts
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {searchResults.communities.length === 0 && searchResults.posts.length === 0 && (
                      <div className="p-4 text-center">
                        <p className="text-sm text-gray-500">No communities or posts found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Enhanced Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg h-10 sm:h-12">
                  <TabsTrigger 
                    value="home" 
                    className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 rounded-md h-8 sm:h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium text-xs sm:text-sm">Home</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="popular" 
                    className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 rounded-md h-8 sm:h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                  >
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium text-xs sm:text-sm">Popular</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="suggested" 
                    className="flex items-center justify-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 rounded-md h-8 sm:h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                  >
                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium text-xs sm:text-sm">Suggested</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                  {/* Results Header */}
                  

                  {sortedPosts.length === 0 ? (
                    <Card className="bg-white shadow-sm">
                      <CardContent className="text-center py-12 sm:py-16">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          {searchQuery ? "No posts found" : "No posts in your feed yet"}
                        </h3>
                        <p className="text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                          {searchQuery
                            ? "Try adjusting your search terms or community filter."
                            : joinedCommunities.length > 0
                              ? "Posts from your communities will appear here. Try checking the 'Suggested' tab for more content!"
                              : "Join communities to see posts in your personalized feed, or check out popular posts!"}
                        </p>
                        {!searchQuery && joinedCommunities.length > 0 && (
                          <Button
                            onClick={() => setShowCreatePostModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Post
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4 sm:space-y-6">
                      {sortedPosts.map((post) => {
                        const community = mockCommunities.find((communityItem: CommunityType) => communityItem.slug === post.community)
                        return (
                          <Card
                            key={post.id}
                            className="group hover:shadow-lg shadow-sm transition-all duration-300 ease-in-out rounded-lg sm:rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-blue-200"
                          >
                            {/* User Info Header - Always at top */}
                            <CardHeader className="pb-2 sm:pb-3">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600 overflow-hidden">
                                  <Badge 
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer text-xs flex-shrink-0"
                                    onClick={() => community && router.push(`/community/${community.slug}`)}
                                  >
                                    {community?.name || "Community"}
                                  </Badge>
                                  <span className="hidden sm:inline">•</span>
                                  <div className="flex items-center space-x-1 min-w-0">
                                    {!post.anonymous && (
                                      <UserAvatar 
                                        profilePicture={post.author === (user?.username || 'User') ? profilePicture : ''}
                                        username={post.author}
                                        size="sm"
                                      />
                                    )}
                                    {post.anonymous && <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />}
                                    <span className="font-medium truncate">{post.anonymous ? "Anonymous" : post.author}</span>
                                  </div>
                                  <span className="hidden sm:inline">•</span>
                                  <div className="flex items-center space-x-1 flex-shrink-0">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="text-xs">{formatRelativeTime(post.timestamp)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Caption for text-only posts (show in header area) */}
                              {post.caption && post.caption.trim() && 
                               ((!post.images || post.images.length === 0) && (!post.videos || post.videos.length === 0)) && (
                                <p 
                                  className="text-gray-800 leading-relaxed cursor-pointer hover:text-gray-900 transition-colors text-sm sm:text-base"
                                  onClick={() => setSelectedPost(post.id)}
                                >
                                  {post.caption.length > 200 ? `${post.caption.slice(0, 200)}...` : post.caption}
                                  {post.caption.length > 200 && (
                                    <span className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">
                                      See more
                                    </span>
                                  )}
                                </p>
                              )}
                            </CardHeader>

                            {/* Media Display - Images and Videos (no padding on sides) */}
                            {((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (
                              <div className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden -mx-0">
                                {/* Images */}
                                {post.images && post.images.length > 0 && (
                                  <div className={`grid gap-0.5 sm:gap-1 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                                    {post.images.slice(0, 4).map((image, index) => (
                                      <div key={index} className="relative overflow-hidden cursor-pointer" onClick={() => setSelectedPost(post.id)}>
                                        <img
                                          src={image}
                                          alt={`Post media ${index + 1}`}
                                          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                                          style={{ 
                                            maxHeight: post.images.length === 1 ? '80vh' : '400px',
                                            minHeight: post.images.length === 1 ? '200px' : '150px'
                                          }}
                                        />
                                        {index === 3 && post.images.length > 4 && (
                                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white text-lg sm:text-xl font-bold">+{post.images.length - 4}</span>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Videos */}
                                {post.videos && post.videos.length > 0 && (
                                  <div className="relative">
                                    <video
                                      src={post.videos[0]}
                                      className="w-full h-48 sm:h-80 object-cover"
                                      controls
                                      preload="metadata"
                                    />
                                  </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                              </div>
                            )}

                            <CardContent className="pt-2 sm:pt-3">
                              {/* Caption for posts with media (show after media) */}
                              {post.caption && post.caption.trim() && 
                               ((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (
                                <p 
                                  className="text-gray-800 leading-relaxed cursor-pointer hover:text-gray-900 transition-colors text-sm sm:text-base mb-3 sm:mb-4"
                                  onClick={() => setSelectedPost(post.id)}
                                >
                                  {post.caption.length > 160 ? `${post.caption.slice(0, 160)}...` : post.caption}
                                  {post.caption.length > 160 && (
                                    <span className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">
                                      See more
                                    </span>
                                  )}
                                </p>
                              )}
                              {/* Show fallback if no caption and no media */}
                              {(!post.caption || !post.caption.trim()) && 
                               (!post.images || post.images.length === 0) && 
                               (!post.videos || post.videos.length === 0) && (
                                <p 
                                  className="text-gray-500 mb-3 sm:mb-4 leading-relaxed cursor-pointer hover:text-gray-700 transition-colors italic text-sm sm:text-base"
                                  onClick={() => setSelectedPost(post.id)}
                                >
                                  This post has no content
                                </p>
                              )}
                              
                              <div className={`flex items-center justify-between ${post.caption && post.caption.trim() ? 'pt-3 sm:pt-4 border-t border-gray-100' : 'pt-0'}`}>
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                  <button
                                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full transition-all duration-200 ${
                                      userReactions[post.id] === "heart" 
                                        ? "bg-red-50 text-red-600 border border-red-200" 
                                        : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                                    }`}
                                    onClick={() => handleReaction(post.id, "heart" as keyof PostType['reactions'])}
                                  >
                                    <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="font-medium text-xs sm:text-sm">{post.reactions.heart}</span>
                                  </button>
                                  <button
                                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full transition-all duration-200 ${
                                      userReactions[post.id] === "thumbsUp" 
                                        ? "bg-blue-50 text-blue-600 border border-blue-200" 
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                    }`}
                                    onClick={() => handleReaction(post.id, "thumbsUp" as keyof PostType['reactions'])}
                                  >
                                    <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="font-medium text-xs sm:text-sm">{post.reactions.thumbsUp}</span>
                                  </button>
                                  <button
                                    className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 rounded-full transition-all duration-200 ${
                                      userReactions[post.id] === "eyes" 
                                        ? "bg-green-50 text-green-600 border border-green-200" 
                                        : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                                    }`}
                                    onClick={() => handleReaction(post.id, "eyes" as keyof PostType['reactions'])}
                                  >
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="font-medium text-xs sm:text-sm">{post.reactions.eyes}</span>
                                  </button>
                                </div>
                                
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 p-1 sm:p-2" onClick={() => setSelectedPost(post.id)}>
                                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
                                    <span className="hidden sm:inline text-xs sm:text-sm">{post.commentCount}</span>
                                    <span className="sm:hidden text-xs">{post.commentCount}</span>
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 sm:p-2">
                                    <Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 sm:p-2">
                                    <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-1 sm:p-2">
                                    <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only show on home page, hidden when in conversation view */}
      {currentView === "home" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex items-center justify-around py-2 px-4">
            {/* Home */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setCurrentView("home")}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </Button>

            {/* DMs */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setCurrentView("dmInbox")}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-medium">DMs</span>
            </Button>

            {/* Create Post - Center with special styling */}
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg rounded-full p-3 transform -translate-y-1"
              disabled={allUserCommunities.length === 0}
              title={allUserCommunities.length === 0 ? 'Join a community to create a post' : ''}
              onClick={() => setShowCreatePostModal(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </Button>

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Settings</span>
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>
      {showCreatePostModal && (
        <CreatePostModal
          open={showCreatePostModal}
          onOpenChange={setShowCreatePostModal}
          user={user}
          availableCommunities={Array.from(
            new Map(allUserCommunities.map(community => [community.slug, community])).values()
          )}
          onPostCreated={(newPost) => {
            // Save the post to localStorage
            try {
              const existingPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
              const updatedPosts = [newPost, ...existingPosts]
              localStorage.setItem('user_posts', JSON.stringify(updatedPosts))
              
              // Refresh the feeds immediately
              setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
              setGlobalPopularPosts(getGlobalPopularPosts())
              
              // Dispatch event to notify other components/tabs
              window.dispatchEvent(new CustomEvent('post-created', { detail: newPost }))
              
              console.log("Post created and saved:", newPost)
            } catch (error) {
              console.error("Error saving post:", error)
            }
            
            setShowCreatePostModal(false)
          }}
        />
      )}
      </AnimatePresence>
      <CreateCommunityModal
        open={showCreateCommunityModal}
        onClose={() => setShowCreateCommunityModal(false)}
        onCreate={(data) => {
          // Get the current username from localStorage to ensure we have the right one
          const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
          const currentUsername = userData.username || user?.username || ""
          
          console.log("Creating community - user object:", user)
          console.log("Creating community - userData from localStorage:", userData)
          console.log("Creating community - selected username:", currentUsername)
          
          const newCommunity = {
            ...data,
            id: `user-${Date.now()}`,
            slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
            color: "bg-gray-100 text-gray-800",
            memberCount: 1,
            admin: currentUsername,
          };
          
          console.log("Creating community - newCommunity object:", newCommunity)
          
          // Check for duplicate in current state
          if (userCommunities.some(c => c.slug === newCommunity.slug || c.id === newCommunity.id)) {
            alert('A community with this name already exists.');
            return;
          }
          
          // Update state first
          const updatedCommunities = [newCommunity, ...userCommunities];
          setUserCommunities(updatedCommunities);
          
          // Then save to localStorage
          localStorage.setItem('user_communities', JSON.stringify(updatedCommunities));
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('community-updated', { 
            detail: { action: 'created', community: newCommunity } 
          }));
        }}
        availableConditions={availableConditions}
      />
      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  )
}

export { CommunityHome }
export default CommunityHome