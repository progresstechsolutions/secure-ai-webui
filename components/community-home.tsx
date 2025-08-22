"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"

// UI Components
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { UserAvatar } from "./ui/user-avatar"

// Icons
import {
  Users,
  Search,
  MessageSquare,
  MessageCircle,
  Heart,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  X,
  User,
  Clock,
  Share2,
  Home,
  Image as ImageIcon,
} from "lucide-react"

// Custom Components
import { PostDetail } from "./post-detail"
import { CreatePostModal } from "./create-post-modal"
import { GlobalHeader } from "./global-header"
import { CreateCommunityModal } from "./create-community-modal"

// Hooks
import { useProfilePicture } from "../hooks/use-profile-picture"

// Types and Data
import type { Community as CommunityType, Post as PostType } from "./mock-community-data"
import { mockCommunities, basePosts } from "./mock-community-data"

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

  // Helper function to safely calculate reaction score
  const getReactionScore = (post: PostType): number => {
    if (!post || !post.reactions || typeof post.reactions !== 'object') {
      return 0
    }
    return Object.values(post.reactions).reduce((sum: number, count: number) => sum + (count || 0), 0)
  }

  // Core state
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    posts: PostType[]
    communities: CommunityType[]
  }>({ posts: [], communities: [] })
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Search and filters
  const [showExpandedSearch, setShowExpandedSearch] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    condition: "",
    region: "",
    state: ""
  })

  // Post data
  const [personalizedPosts, setPersonalizedPosts] = useState<PostType[]>([])
  const [discoverPosts, setDiscoverPosts] = useState<PostType[]>([])

  // UI state  
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [userReactions, setUserReactions] = useState<Record<string, keyof PostType['reactions'] | "">>({})

  // User data
  const [userCommunities, setUserCommunities] = useState<CommunityType[]>([])
  const [userConditions, setUserConditions] = useState<string[]>([])
  const router = useRouter()

  // Filter options data
  const conditionOptions = [
    "Down Syndrome", "Turner Syndrome", "Klinefelter Syndrome", "Autism Spectrum Disorder", 
    "Cerebral Palsy", "Rett Syndrome", "Angelman Syndrome", "Phenylketonuria (PKU)", 
    "Cystic Fibrosis", "Gaucher Disease", "Muscular Dystrophy", "Spinal Muscular Atrophy", 
    "Sickle Cell Disease", "Thalassemia", "Other Genetic Condition"
  ]
  
  const regionOptions = ["United States", "Europe", "Asia", "South America"]

  const stateOptions = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
    "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
    "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming", "District of Columbia"
  ]

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
    // Get user data for region filtering
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
    const userRegion = userData.region || "United States"
    
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
    
    // Filter posts by user's communities and prioritize by region/relevance
    const relevantPosts = [
      ...basePosts.filter((post: PostType) => uniqueCommunitySlugs.includes(post.community)),
      ...userPosts.filter((post: PostType) => uniqueCommunitySlugs.includes(post.community)),
    ]
    
    // Sort by relevance - posts from same region first, then by engagement
    return relevantPosts.sort((a: PostType, b: PostType) => {
      // Prioritize user's own posts
      if (a.author === (userData.username || user?.username) && b.author !== (userData.username || user?.username)) return -1
      if (b.author === (userData.username || user?.username) && a.author !== (userData.username || user?.username)) return 1
      
      // Then prioritize by engagement
      const aScore = getReactionScore(a)
      const bScore = getReactionScore(b)
      return bScore - aScore
    })
  }
  
  const getDiscoverPosts = (): PostType[] => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
    const userConditions = userData.conditions || []
    const userRegion = userData.region || "United States"
    
    // Get communities user is NOT part of
    const userCommunitySlugs = [
      ...userCommunities.map(c => c.slug),
      ...joinedCommunities.map(c => c.slug),
      ...userConditions.map((condition: string) => communityMap[condition]).filter(Boolean)
    ]
    
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
    
    // Get posts from communities user hasn't joined, prioritizing similar conditions
    const discoverPosts = [
      ...basePosts.filter((post: PostType) => !userCommunitySlugs.includes(post.community)),
      ...userPosts.filter((post: PostType) => !userCommunitySlugs.includes(post.community)),
    ]
    
    return discoverPosts
      .sort((a: PostType, b: PostType) => {
        // Prioritize posts from similar condition communities
        const aSimilar = userConditions.some((condition: string) => {
          const relatedConditions = getRelatedConditions(condition)
          return relatedConditions.some((related: string) => communityMap[related] === a.community)
        })
        const bSimilar = userConditions.some((condition: string) => {
          const relatedConditions = getRelatedConditions(condition)
          return relatedConditions.some((related: string) => communityMap[related] === b.community)
        })
        
        if (aSimilar && !bSimilar) return -1
        if (bSimilar && !aSimilar) return 1
        
        // Then by engagement
        const aScore = getReactionScore(a)
        const bScore = getReactionScore(b)
        return bScore - aScore
      })
      .slice(0, 15)
  }
  
  // Helper function to get related conditions for discovery
  const getRelatedConditions = (condition: string): string[] => {
    const relatedMap: Record<string, string[]> = {
      "Huntington's Disease": ["Parkinson's Disease", "Other Neurological Conditions"],
      "Cystic Fibrosis": ["Other Respiratory Conditions"],
      "Sickle Cell Disease": ["Thalassemia", "Other Blood Disorders"],
      "Down Syndrome": ["Other Chromosomal Conditions"],
      "Fragile X Syndrome": ["Autism Spectrum Disorder", "Other Developmental Delays"],
      "Duchenne Muscular Dystrophy": ["Spinal Muscular Atrophy", "Other Muscular Disorders"],
      "BRCA1/BRCA2 Mutations": ["Lynch Syndrome", "Other Cancer Genetic Conditions"]
    }
    return relatedMap[condition] || ["Other Genetic Condition"]
  }

  // Effects for updating posts when conditions or communities change
  useEffect(() => {
    console.log("Refreshing feeds due to userConditions or userCommunities change")
    console.log("Current userConditions:", userConditions)
    console.log("Current userCommunities:", userCommunities.map(c => c.name))
    setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
    setDiscoverPosts(getDiscoverPosts())
  }, [userConditions, userCommunities])

  // Listen for post creation events
  useEffect(() => {
    const handlePostCreated = () => {
      console.log("Post created event received, refreshing feeds...")
      setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
      setDiscoverPosts(getDiscoverPosts())
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
        setDiscoverPosts(getDiscoverPosts())
      }
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("storage", storageHandler);
    };
  }, [userConditions]);

 

  // Community lists - memoized to prevent infinite re-renders
  const joinedCommunities: CommunityType[] = useMemo(() => {
    // Get communities based on user's health conditions from the mock data
    const conditionBasedCommunities = mockCommunities.filter((community: CommunityType) =>
      userConditions
        .map((condition: string) => communityMap[condition])
        .filter(Boolean)
        .includes(community.slug)
    );
    
    console.log('=== Joined Communities Debug ===');
    console.log('User Conditions:', userConditions);
    console.log('Mapped Community Slugs:', userConditions.map(c => communityMap[c]).filter(Boolean));
    console.log('Found Mock Communities:', conditionBasedCommunities.map(c => ({ name: c.name, slug: c.slug, id: c.id })));
    console.log('=== End Debug ===');
    
    return conditionBasedCommunities;
  }, [userConditions])

  // Combined communities for Select component - memoized with robust duplicate prevention
  const allUserCommunities = useMemo(() => {
    // Use a Set to track slugs we've already seen for simpler deduplication
    const seenSlugs = new Set<string>();
    const result: CommunityType[] = [];
    
    // Debug logging
    console.log('=== Community Deduplication Debug ===');
    console.log('User Communities:', userCommunities.map(c => ({ name: c.name, slug: c.slug, id: c.id })));
    console.log('Joined Communities:', joinedCommunities.map(c => ({ name: c.name, slug: c.slug, id: c.id })));
    
    // Add user communities first (they have priority)
    userCommunities.forEach(community => {
      if (!seenSlugs.has(community.slug)) {
        seenSlugs.add(community.slug);
        result.push(community);
        console.log(`Added user community: ${community.name} (slug: ${community.slug})`);
      } else {
        console.log(`Skipping duplicate user community: ${community.name} (slug: ${community.slug})`);
      }
    });
    
    // Add joined communities only if their slug hasn't been seen
    joinedCommunities.forEach(community => {
      if (!seenSlugs.has(community.slug)) {
        seenSlugs.add(community.slug);
        result.push(community);
        console.log(`Added joined community: ${community.name} (slug: ${community.slug})`);
      } else {
        console.log(`Skipping duplicate joined community: ${community.name} (slug: ${community.slug})`);
      }
    });
    
    console.log('Final Combined Communities:', result.map(c => ({ name: c.name, slug: c.slug, id: c.id })));
    console.log('=== End Debug ===');
    
    return result;
  }, [userCommunities, joinedCommunities])

  // Post reactions/comments
  const handleReaction = (postId: string, reactionType: keyof PostType['reactions'] | 'hope' | 'hug' | 'grateful') => {
    const updatePosts = (prevPosts: PostType[]) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          // Ensure reactions object exists
          const newReactions = { ...((post.reactions) || { heart: 0, thumbsUp: 0 }) }
          const currentUserReaction = userReactions[postId] as keyof PostType['reactions'] | 'hope' | 'hug' | 'grateful' | undefined
          
          // Remove previous reaction if exists
          if (currentUserReaction && newReactions[currentUserReaction as keyof PostType['reactions']] !== undefined && newReactions[currentUserReaction as keyof PostType['reactions']]! > 0) {
            newReactions[currentUserReaction as keyof PostType['reactions']] = newReactions[currentUserReaction as keyof PostType['reactions']]! - 1
          }
          
          // If clicking same reaction, remove it (toggle off)
          if (currentUserReaction === reactionType) {
            setUserReactions((prev) => ({ ...prev, [postId]: "" }))
          } else {
            // Add new reaction
            if (reactionType in newReactions) {
              newReactions[reactionType as keyof PostType['reactions']] = (newReactions[reactionType as keyof PostType['reactions']] || 0) + 1
            } else {
              // Handle new reaction types
              (newReactions as any)[reactionType] = ((newReactions as any)[reactionType] || 0) + 1
            }
            setUserReactions((prev) => ({ ...prev, [postId]: reactionType }))
          }
          
          return { ...post, reactions: newReactions }
        }
        return post
      })
    setPersonalizedPosts(updatePosts(personalizedPosts))
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
  }
 



  // Enhanced Search functionality with filters
  useEffect(() => {
    if (searchQuery.trim() || searchFilters.condition || searchFilters.region || searchFilters.state) {
      // Get current posts based on active tab
      const posts = activeTab === "suggested" ? discoverPosts : personalizedPosts
      
      // Search ALL communities with enhanced filters (including user's own communities)
      const searchedCommunities = mockCommunities.filter(community => {
        // Text search - check name and description
        const matchesQuery = !searchQuery.trim() || (
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        // Condition filter - enhanced matching
        const matchesCondition = !searchFilters.condition || (
          community.name.toLowerCase().includes(searchFilters.condition.toLowerCase()) ||
          community.description?.toLowerCase().includes(searchFilters.condition.toLowerCase()) ||
          // Also check if the condition maps to this community slug
          (communityMap[searchFilters.condition] === community.slug)
        )
        
        // Region filter - enhanced matching using the new region field
        const matchesRegion = !searchFilters.region || (
          community.region === searchFilters.region ||
          community.name.toLowerCase().includes(searchFilters.region.toLowerCase()) ||
          community.description?.toLowerCase().includes(searchFilters.region.toLowerCase())
        )
        
        // State filter - enhanced matching using the new state field
        const matchesState = !searchFilters.state || (
          community.state === searchFilters.state ||
          community.name.toLowerCase().includes(searchFilters.state.toLowerCase()) ||
          community.description?.toLowerCase().includes(searchFilters.state.toLowerCase())
        )
        
        return matchesQuery && matchesCondition && matchesRegion && matchesState
      })
      
      // Sort communities: user's communities first, then joined communities, then others
      const sortedCommunities = searchedCommunities.sort((a, b) => {
        const aIsUserCommunity = userCommunities.some(uc => uc.slug === a.slug)
        const bIsUserCommunity = userCommunities.some(uc => uc.slug === b.slug)
        const aIsJoined = joinedCommunities.some(jc => jc.slug === a.slug)
        const bIsJoined = joinedCommunities.some(jc => jc.slug === b.slug)
        
        if (aIsUserCommunity && !bIsUserCommunity) return -1
        if (bIsUserCommunity && !aIsUserCommunity) return 1
        if (aIsJoined && !bIsJoined) return -1
        if (bIsJoined && !aIsJoined) return 1
        
        // Sort by member count for discoverability
        return (b.memberCount || 0) - (a.memberCount || 0)
      })

      // Enhanced post search with community context
      const searchedPosts = searchQuery.trim() ? posts.filter((post: PostType) => {
        const community = mockCommunities.find((c: CommunityType) => c.slug === post.community)
        const matchesSearch =
          (post.caption && post.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (community && community.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesSearch
      }) : []

      setSearchResults({
        posts: searchedPosts,
        communities: sortedCommunities
      })
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
      setSearchResults({ posts: [], communities: [] })
    }
  }, [searchQuery, searchFilters, activeTab, discoverPosts, personalizedPosts, userCommunities, joinedCommunities, mockCommunities])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container')
      const mobileSearchContainer = document.getElementById('search-container-mobile')
      const target = event.target as Node
      
      const isOutsideSearch = searchContainer && !searchContainer.contains(target)
      const isOutsideMobileSearch = mobileSearchContainer && !mobileSearchContainer.contains(target)
      
      if ((isOutsideSearch || !searchContainer) && (isOutsideMobileSearch || !mobileSearchContainer)) {
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
    setDiscoverPosts(getDiscoverPosts())
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('community-updated', { detail: { action: 'joined', community } }));
    
    // Clear search
    setSearchQuery("")
    setShowSearchResults(false)
    
    console.log("Joined community from search:", community.name)
  }
  
  const sortedPosts = useMemo(() => {
    const currentPosts = activeTab === "suggested" ? discoverPosts : personalizedPosts
    const filteredPosts = currentPosts.filter((post: PostType) => {
      const matchesSearch =
        searchQuery === "" ||
        (post.caption && post.caption.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesSearch
    })
    
    return [...filteredPosts].sort((a: PostType, b: PostType) => {
      if (activeTab === "popular" || activeTab === "suggested") {
        const aScore = getReactionScore(a)
        const bScore = getReactionScore(b)
        return bScore - aScore
      }
      return 0
    })
  }, [activeTab, discoverPosts, personalizedPosts, searchQuery])

  if (selectedPost) {
    const posts = activeTab === "suggested" ? discoverPosts : personalizedPosts
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Global Header */}
      <GlobalHeader 
        user={user} 
        currentPage="dashboard" 
        showSearch={true}
        onSearchToggle={() => setShowExpandedSearch(!showExpandedSearch)}
        showOnMobile={true}
      />
       
      {/* Mobile-Optimized Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex gap-3 sm:gap-6">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4 space-y-4">
              {/* Communities Card */}
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      Communities
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowCreateCommunityModal(true)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 h-auto"
                      title="Create Community"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  

                 
                  {/* Your Communities */}
                  {allUserCommunities.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-2">
                      Communities ({allUserCommunities.length})
                      </div>
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {allUserCommunities.slice(0, 8).map((community, index) => (
                          <button
                            key={`${community.slug}-${community.id || index}`}
                            onClick={() => {
                              router.push(`/community/${community.slug}`)
                            }}
                            className="w-full flex items-center space-x-3 p-2 rounded-lg text-left hover:bg-gray-50 transition-colors group"
                          >
                            <div 
                              className="w-6 h-6 rounded-full flex-shrink-0"
                              style={{ 
                                background: community.color?.includes('bg-') 
                                  ? '#3b82f6' 
                                  : community.color || "#3b82f6" 
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate group-hover:text-blue-600">
                                {community.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {community.memberCount || 0} members
                              </div>
                            </div>
                          </button>
                        ))}
                        {allUserCommunities.length > 8 && (
                          <button
                            onClick={() => setShowCreateCommunityModal(true)}
                            className="w-full text-center text-xs text-blue-600 hover:text-blue-700 py-2"
                          >
                            View all {allUserCommunities.length} communities
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* No Communities State */}
                  {allUserCommunities.length === 0 && (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        No communities yet
                      </p>
                      <Button
                        size="sm"
                        onClick={() => router.push("/communities")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5"
                      >
                        <Users className="h-3 w-3 mr-1" />
                        Find Communities
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Clean Content Focus - No distractions */}
            <div className="mb-6">
              {/* Only show if user has no communities - onboarding help */}
              {allUserCommunities.length === 0 && (
                <div className="text-center py-8 mb-6 lg:hidden">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Community</h3>
                  <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">
                    Connect with others who understand your journey by joining relevant support communities.
                  </p>
                  <Button
                    onClick={() => router.push("/communities")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Discover Communities
                  </Button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="space-y-4 sm:space-y-6">
              
              {/* Mobile-Optimized Search and Navigation Bar */}
              <div className="block">
                {/* Compact Navigation Row - Mobile */}
                <div className="md:hidden">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-3 mb-4">
                    {/* Search Icon */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowExpandedSearch(!showExpandedSearch)}
                      className={`p-2 rounded-lg transition-all touch-manipulation w-fit ${
                      showExpandedSearch ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                    
                    {/* Tab Navigation - Space around for equal width */}
                    <div className="flex items-center flex-1 gap-2">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("home")}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors touch-manipulation flex-1 ${
                        activeTab === "home" 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      >
                      Your Stories
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("suggested")}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors touch-manipulation flex-1 ${
                        activeTab === "suggested" 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      >
                      Discover
                      </Button>
                    </div>
                    </div>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("home")}
                      className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "home" 
                          ? "border-blue-600 text-blue-600 bg-blue-50" 
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Your Stories
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab("suggested")}
                      className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "suggested" 
                          ? "border-blue-600 text-blue-600 bg-blue-50" 
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Discover
                    </Button>
                  </div>
                  
                  {/* Desktop Share Button */}
                  {allUserCommunities.length > 0 && (
                    <Button
                      onClick={() => setShowCreatePostModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Share Story
                    </Button>
                  )}
                </div>
              </div>
          
          {/* Expandable Search - Mobile */}
          {showExpandedSearch && (
            <div id="search-container-mobile" className="mb-4 bg-white rounded-lg border border-gray-200 p-4 md:hidden relative">
              <div className="space-y-4">
                {/* Main Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search stories, communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-sm border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-lg bg-white touch-manipulation"
                    autoFocus
                  />
                </div>
                
                {/* Filter Options */}
                <div className="grid grid-cols-1 gap-3">
                  {/* Condition Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Health Condition</label>
                    <Select 
                      value={searchFilters.condition || "all-conditions"} 
                      onValueChange={(value) => setSearchFilters(prev => ({...prev, condition: value === "all-conditions" ? "" : value}))}
                    >
                      <SelectTrigger className="w-full text-sm border-gray-300 focus:border-blue-400">
                        <SelectValue placeholder="All conditions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-conditions">All conditions</SelectItem>
                        {conditionOptions.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Country/Region</label>
                    <Select 
                      value={searchFilters.region || "all-locations"} 
                      onValueChange={(value) => {
                        setSearchFilters(prev => ({...prev, region: value === "all-locations" ? "" : value, state: ""}))
                      }}
                    >
                      <SelectTrigger className="w-full text-sm border-gray-300 focus:border-blue-400">
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-locations">All locations</SelectItem>
                        {regionOptions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State Filter - Only show when United States is selected */}
                  {searchFilters.region === "United States" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">State</label>
                      <Select 
                        value={searchFilters.state || "all-states"} 
                        onValueChange={(value) => setSearchFilters(prev => ({...prev, state: value === "all-states" ? "" : value}))}
                      >
                        <SelectTrigger className="w-full text-sm border-gray-300 focus:border-blue-400">
                          <SelectValue placeholder="All states" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-states">All states</SelectItem>
                          {stateOptions.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  {/* Clear Filters */}
                  {(searchFilters.condition || searchFilters.region || searchFilters.state) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchFilters({ condition: "", region: "", state: "" })}
                      className="text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50 touch-manipulation"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear filters
                    </Button>
                  )}
                  
                  {/* Close Search */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExpandedSearch(false)}
                    className="text-gray-600 hover:text-gray-800 touch-manipulation ml-auto"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop Search - Keep existing */}
          <div id="search-container" className="hidden md:block mb-6 relative">
            <div className="flex gap-2">
              {/* Main Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stories, communities, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 text-sm border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded-lg bg-white"
                />
              </div>
              
              {/* Desktop Filter Dropdowns */}
              <div className="flex gap-2">
                {/* Condition Filter */}
                <Select 
                  value={searchFilters.condition || "all-conditions"} 
                  onValueChange={(value) => setSearchFilters(prev => ({...prev, condition: value === "all-conditions" ? "" : value}))}
                >
                  <SelectTrigger className="w-40 text-sm border-gray-300 focus:border-blue-400">
                    <SelectValue placeholder="Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-conditions">All conditions</SelectItem>
                    {conditionOptions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Location Filter */}
                <Select 
                  value={searchFilters.region || "all-locations"} 
                  onValueChange={(value) => {
                    setSearchFilters(prev => ({...prev, region: value === "all-locations" ? "" : value, state: ""}))
                  }}
                >
                  <SelectTrigger className="w-32 text-sm border-gray-300 focus:border-blue-400">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-locations">All locations</SelectItem>
                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* State Filter - Only show when United States is selected */}
                {searchFilters.region === "United States" && (
                  <Select 
                    value={searchFilters.state || "all-states"} 
                    onValueChange={(value) => setSearchFilters(prev => ({...prev, state: value === "all-states" ? "" : value}))}
                  >
                    <SelectTrigger className="w-32 text-sm border-gray-300 focus:border-blue-400">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-states">All states</SelectItem>
                      {stateOptions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {/* Clear Filters Button */}
                {(searchFilters.condition || searchFilters.region || searchFilters.state) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchFilters({ condition: "", region: "", state: "" })}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 border-gray-300 hover:bg-gray-50"
                    title="Clear filters"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
            
            {/* Active Filters Indicator */}
            {(searchFilters.condition || searchFilters.region || searchFilters.state) && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <Filter className="h-3 w-3" />
                <span>Filters active:</span>
                {searchFilters.condition && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                    {searchFilters.condition}
                  </span>
                )}
                {searchFilters.region && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">
                    {searchFilters.region}
                  </span>
                )}
                {searchFilters.state && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md">
                    {searchFilters.state}
                  </span>
                )}
              </div>
            )}
            
            {/* Enhanced Search Results */}
            {showSearchResults && (searchResults.communities.length > 0 || searchResults.posts.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                {searchResults.communities.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Communities ({searchResults.communities.length})
                    </h4>
                    {searchResults.communities.slice(0, 5).map((community, index) => {
                      const isUserCommunity = userCommunities.some(uc => uc.slug === community.slug)
                      const isJoined = joinedCommunities.some(jc => jc.slug === community.slug)
                      const isMember = isUserCommunity || isJoined
                      
                      return (
                        <div
                          key={`search-${community.slug}-${community.id || index}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group border border-transparent hover:border-gray-200"
                          onClick={() => {
                            router.push(`/community/${community.slug}`)
                            setShowSearchResults(false)
                            setSearchQuery("")
                          }}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div 
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              style={{ background: community.color?.includes('bg-') ? '#3b82f6' : community.color || "#3b82f6" }} 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {community.name}
                                </span>
                                {isMember && (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                    {isUserCommunity ? "Admin" : "Member"}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                                <span>{community.memberCount || 0} members</span>
                                <span className="text-gray-400">•</span>
                                <span>{community.region}{community.state ? `, ${community.state}` : ''}</span>
                                {community.description && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="truncate max-w-32">
                                      {community.description.length > 30 
                                        ? `${community.description.slice(0, 30)}...` 
                                        : community.description}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {!isMember && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleJoinCommunityFromSearch(community)
                              }}
                            >
                              Join
                            </Button>
                          )}
                          {isMember && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault()
                                // Navigate is handled by parent click
                              }}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      )
                    })}
                    {searchResults.communities.length > 5 && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">
                          +{searchResults.communities.length - 5} more communities
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {searchResults.posts.length > 0 && (
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide flex items-center">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Stories ({searchResults.posts.length})
                    </h4>
                    {searchResults.posts.slice(0, 4).map((post) => {
                      const community = mockCommunities.find((c: CommunityType) => c.slug === post.community)
                      return (
                        <div
                          key={post.id}
                          className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group border border-transparent hover:border-gray-200"
                          onClick={() => {
                            setSelectedPost(post.id)
                            setShowSearchResults(false)
                            setSearchQuery("")
                          }}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                              {community?.name || "Community"}
                            </span>
                            <span className="text-xs text-gray-500">
                              by {post.author}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(post.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2 group-hover:text-gray-700">
                            {post.caption && post.caption.length > 80 
                              ? `${post.caption.slice(0, 80)}...` 
                              : post.caption || "View story"}
                          </p>
                          {post.images && post.images.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <ImageIcon className="h-3 w-3 mr-1" />
                                {post.images.length} image{post.images.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {searchResults.posts.length > 4 && (
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">
                          +{searchResults.posts.length - 4} more stories
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* No Results State */}
                {searchResults.communities.length === 0 && searchResults.posts.length === 0 && (
                  <div className="p-6 text-center">
                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">No results found</p>
                    <p className="text-xs text-gray-500">
                      Try different search terms or filters
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile-Optimized Content */}
          {sortedPosts.length === 0 && !showSearchResults ? (
            <div className="text-center py-12 sm:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? "No stories found" : "Your journey starts here"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm px-4">
                {searchQuery
                  ? "Try different search terms or check the search results above for communities"
                  : allUserCommunities.length > 0
                    ? "Share your first story with your community"
                    : "Join a community to connect with others who understand your journey"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => allUserCommunities.length > 0 ? setShowCreatePostModal(true) : setShowCreateCommunityModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white touch-manipulation"
                >
                  {allUserCommunities.length > 0 ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Share Your Story
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Find Your Community
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : sortedPosts.length === 0 && showSearchResults ? (
            <div className="text-center py-12 sm:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No stories found, but check communities above!
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm px-4">
                While there are no stories matching "{searchQuery}", you may find relevant communities in the search results above.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sortedPosts.map((post) => {
                const community = mockCommunities.find((communityItem: CommunityType) => communityItem.slug === post.community)
                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={(e) => {
                      // Prevent opening modal if clicking on interactive elements
                      const target = e.target as HTMLElement;
                      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
                        return;
                      }
                      setSelectedPost(post.id);
                    }}
                  >
                    {/* Mobile-Optimized Post Header */}
                    <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-50">
                      <div className="flex items-center space-x-3">
                        {/* Avatar - Slightly smaller on mobile */}
                        <div className="flex-shrink-0">
                          {!post.anonymous ? (
                            <UserAvatar 
                              profilePicture={post.author === (user?.username || 'User') ? profilePicture : ''}
                              username={post.author}
                              size="md"
                            />
                          ) : (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {/* User Info - Responsive text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 text-sm truncate">
                              {post.anonymous ? "Anonymous" : post.author}
                            </h3>
                            {community && (
                              <>
                                <span className="text-gray-400 hidden sm:inline">•</span>
                                <button 
                                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium hover:underline truncate touch-manipulation"
                                  onClick={() => router.push(`/community/${community.slug}`)}
                                >
                                  {community.name}
                                </button>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <time>{formatRelativeTime(post.timestamp)}</time>
                          </div>
                        </div>
                        
                        {/* More Options - Larger touch target */}
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-2 rounded-full touch-manipulation">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Post Content - Better mobile spacing */}
                    {post.caption && post.caption.trim() && (
                      <div className="px-3 sm:px-4 py-3">
                        <p className="text-gray-900 text-sm leading-relaxed">
                          {post.caption.length > 200 ? (
                            <>
                              {post.caption.slice(0, 200)}
                              <span className="text-gray-500">... </span>
                              <span className="text-blue-600 hover:text-blue-700 font-medium">
                                See more
                              </span>
                            </>
                          ) : (
                            post.caption
                          )}
                        </p>
                      </div>
                    )}

                    {/* Media */}
                    {((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (
                      <div className="relative">
                        {post.images && post.images.length > 0 && (
                          <div className={`${post.images.length === 1 ? '' : 'grid grid-cols-2 gap-0.5'}`}>
                            {post.images.slice(0, 4).map((image, index) => (
                              <div 
                                key={index} 
                                className="relative overflow-hidden"
                              >
                                <img
                                  src={image}
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                                  style={{ 
                                    maxHeight: post.images.length === 1 ? '400px' : '160px',
                                    aspectRatio: post.images.length === 1 ? 'auto' : '1'
                                  }}
                                />
                                {index === 3 && post.images.length > 4 && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="text-white text-lg font-semibold">+{post.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {post.videos && post.videos.length > 0 && (
                          <video
                            src={post.videos[0]}
                            className="w-full h-auto object-cover"
                            controls
                            preload="metadata"
                            style={{ maxHeight: '350px' }}
                          />
                        )}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    {(() => {
                      const totalReactions = getReactionScore(post)
                      const hasEngagement = totalReactions > 0 || post.commentCount > 0
                      
                      return hasEngagement ? (
                        <div className="px-4 py-2 border-b border-gray-50">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {totalReactions > 0 && (
                              <div className="flex items-center space-x-1">
                                <div className="flex items-center -space-x-0.5">
                                  {(post.reactions?.heart || 0) > 0 && (
                                    <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                                      <span className="text-[8px]">❤️</span>
                                    </div>
                                  )}
                                  {(post.reactions?.thumbsUp || 0) > 0 && (
                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                      <span className="text-[8px]">💪</span>
                                    </div>
                                  )}
                                  {((post.reactions as any)?.hope || 0) > 0 && (
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                      <span className="text-[8px]">🌟</span>
                                    </div>
                                  )}
                                </div>
                                <span className="ml-1">{totalReactions}</span>
                              </div>
                            )}
                            {post.commentCount > 0 && (
                              <span className="hover:underline cursor-pointer">
                                {post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}
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
                              userReactions[post.id] 
                                ? userReactions[post.id] === "heart" ? 'text-pink-600 bg-pink-50' :
                                  userReactions[post.id] === "thumbsUp" ? 'text-blue-600 bg-blue-50' :
                                  userReactions[post.id] === "hope" ? 'text-yellow-600 bg-yellow-50' :
                                  userReactions[post.id] === "hug" ? 'text-purple-600 bg-purple-50' :
                                  userReactions[post.id] === "grateful" ? 'text-green-600 bg-green-50' : 'text-pink-600 bg-pink-50'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                            }`}
                            onClick={() => {
                              if (!userReactions[post.id]) {
                                handleReaction(post.id, "heart" as keyof PostType['reactions'])
                              } else {
                                handleReaction(post.id, userReactions[post.id] as keyof PostType['reactions'])
                              }
                            }}
                            onTouchStart={(e) => {
                              // Show reaction picker on mobile long press
                              const button = e.currentTarget;
                              const touchTimer = setTimeout(() => {
                                const picker = document.getElementById(`reaction-picker-${post.id}`)
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
                                    const picker = document.getElementById(`reaction-picker-${post.id}`)
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
                                  const picker = document.getElementById(`reaction-picker-${post.id}`)
                                  if (picker && !picker.matches(':hover')) {
                                    picker.classList.add('hidden')
                                  }
                                }, 100)
                              }
                            }}
                          >
                            <span className="text-base sm:text-lg">
                              {userReactions[post.id] === "heart" ? "❤️" : 
                               userReactions[post.id] === "thumbsUp" ? "💪" :
                               userReactions[post.id] === "hope" ? "🌟" :
                               userReactions[post.id] === "hug" ? "🤗" :
                               userReactions[post.id] === "grateful" ? "🙏" : "🤍"}
                            </span>
                            <span className="hidden sm:inline">
                              {userReactions[post.id] ? 
                                (userReactions[post.id] === "heart" ? "Love" :
                                 userReactions[post.id] === "thumbsUp" ? "Strength" :
                                 userReactions[post.id] === "hope" ? "Hope" :
                                 userReactions[post.id] === "hug" ? "Hug" :
                                 userReactions[post.id] === "grateful" ? "Grateful" : "Love") 
                                : "Love"
                              }
                            </span>
                          </button>
                          
                          {/* Mobile-Optimized Reaction Picker */}
                          <div 
                            id={`reaction-picker-${post.id}`}
                            className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg hidden z-50 p-2"
                            onMouseEnter={() => {
                              const picker = document.getElementById(`reaction-picker-${post.id}`)
                              if (picker) picker.classList.remove('hidden')
                            }}
                            onMouseLeave={() => {
                              const picker = document.getElementById(`reaction-picker-${post.id}`)
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
                                    handleReaction(post.id, type as keyof PostType['reactions'])
                                    document.getElementById(`reaction-picker-${post.id}`)?.classList.add('hidden')
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
                          onClick={() => setSelectedPost(post.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="hidden sm:inline">Comment</span>
                        </button>
                        
                        {/* Share Button - Mobile optimized */}
                        <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation">
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
      </div>

      {/* Facebook-Style Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Modal Content */}
            <div className="max-h-[90vh] overflow-y-auto">
              <PostDetail
                post={sortedPosts.find((p: PostType) => p.id === selectedPost) || sortedPosts[0]}
                onBack={() => setSelectedPost(null)}
                user={user}
                onAddComment={(postId: string, comment: any) => {
                  // Handle comment addition
                  console.log('Add comment:', postId, comment);
                }}
                onAddReply={(postId: string, commentId: string, reply: any) => {
                  // Handle reply addition
                  console.log('Add reply:', postId, commentId, reply);
                }}
                onReaction={(postId: string, reactionType: string) => {
                  handleReaction(postId, reactionType as keyof PostType['reactions'])
                }}
                userReaction={userReactions[selectedPost] || ""}
              />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 safe-area-pb">
          <div className="flex items-center justify-around py-1 px-2">
            {/* Home */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation min-h-12"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </Button>

            {/* Messages */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation min-h-12"
              onClick={() => router.push("/messages")}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-medium">Messages</span>
            </Button>

            {/* Create Post - Enhanced for mobile */}
            <Button
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white shadow-lg rounded-full p-3 transform -translate-y-1 touch-manipulation min-h-14 min-w-14 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={allUserCommunities.length === 0}
              title={allUserCommunities.length === 0 ? 'Join a community to create a post' : 'Share your story'}
              onClick={() => setShowCreatePostModal(true)}
            >
              <Plus className="h-6 w-6" />
            </Button>

            {/* Communities */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation min-h-12"
              onClick={() => router.push("/communities")}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs font-medium">Communities</span>
            </Button>

            {/* Profile */}
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 py-2 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all touch-manipulation min-h-12"
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
          {/* Safe area padding for devices with home indicator */}
          <div className="h-safe-area-inset-bottom"></div>
        </div>

      {/* Post Creation Modal */}
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
              setDiscoverPosts(getDiscoverPosts())
              
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
            region: "United States", // Default region for new communities
            state: "California", // Default state for new US communities
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

    </div>
      
      <style jsx global>{`
        /* Mobile-optimized styles */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Touch-friendly interactions */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Safe area support for devices with notches */
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .h-safe-area-inset-bottom {
          height: env(safe-area-inset-bottom);
        }
        
        /* Prevent zoom on input focus (iOS) */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Enhanced animations for mobile */
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
        
        /* Improved mobile tap targets */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Better modal sizing on mobile */
          .modal-content {
            margin: 1rem;
            max-height: calc(100vh - 2rem);
          }
          
          /* Optimized post cards for mobile */
          .post-card {
            margin-bottom: 0.75rem;
          }
          
          /* Better text legibility on mobile */
          .text-sm {
            font-size: 0.875rem;
            line-height: 1.5;
          }
        }
        
        /* Responsive image handling */
        .post-image {
          max-width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        /* Better focus states for accessibility */
        .focus-visible:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        /* Custom scrollbar for better mobile experience */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}

export default CommunityHome