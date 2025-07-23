"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Video,
  Filter,
  Trophy,
  Lightbulb,
} from "lucide-react"
import { CommunityFeed } from "./community-feed"
import { UserProfile } from "./user-profile"
import { PrivacySettings } from "./privacy-settings"
import { PostDetail } from "./post-detail"
import { DMInbox } from "./dm-inbox"
import { DMConversation } from "./dm-conversation"
import { MilestoneFeed } from "./milestone-feed"
import { CreatePostModal } from "./create-post-modal"
import { GuidedOnboarding } from "./guided-onboarding"
import { AnimatePresence, motion } from "framer-motion" // Import AnimatePresence
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useParams, useRouter } from "next/navigation";
import { HexColorPicker } from "react-colorful"

interface CommunityHomeProps {
  user: any
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

const mockCommunities = [
  {
    id: "1",
    name: "PMS Support",
    description: "A supportive community for people managing Phelan-McDermid Syndrome",
    memberCount: 850,
    slug: "pms-support",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "2",
    name: "Rett Syndrome Community",
    description: "Connecting families and individuals affected by Rett Syndrome",
    memberCount: 620,
    slug: "rett-syndrome-support",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "3",
    name: "Fragile X Forum",
    description: "Discussions and resources for Fragile X Syndrome",
    memberCount: 710,
    slug: "fragile-x-support",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "4",
    name: "Angelman Syndrome Connect",
    description: "Support and information for Angelman Syndrome",
    memberCount: 480,
    slug: "angelman-support",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "5",
    name: "Prader-Willi Life",
    description: "Navigating life with Prader-Willi Syndrome",
    memberCount: 350,
    slug: "prader-willi-support",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "6",
    name: "Down Syndrome Network",
    description: "A community for individuals and families with Down Syndrome",
    memberCount: 1500,
    slug: "down-syndrome-support",
    color: "bg-pink-100 text-pink-800",
  },
  {
    id: "7",
    name: "Cystic Fibrosis Warriors",
    description: "Fighting CF together, sharing experiences and support",
    memberCount: 920,
    slug: "cystic-fibrosis-support",
    color: "bg-teal-100 text-teal-800",
  },
  {
    id: "8",
    name: "Sickle Cell Strong",
    description: "Empowering those with Sickle Cell Anemia",
    memberCount: 550,
    slug: "sickle-cell-anemia-support",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "9",
    name: "Huntington's Hope",
    description: "Support and research for Huntington's Disease",
    memberCount: 280,
    slug: "huntingtons-disease-support",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    id: "10",
    name: "SMA Family Support",
    description: "Connecting families affected by Spinal Muscular Atrophy",
    memberCount: 400,
    slug: "sma-support",
    color: "bg-lime-100 text-lime-800",
  },
  {
    id: "11",
    name: "Batten Disease Alliance",
    description: "A community for support and advocacy for Batten Disease",
    memberCount: 180,
    slug: "batten-disease-support",
    color: "bg-rose-100 text-rose-800",
  },
  {
    id: "12",
    name: "Tay-Sachs Connect",
    description: "Support and resources for Tay-Sachs Disease families.",
    memberCount: 120,
    slug: "tay-sachs-support",
    color: "bg-cyan-100 text-cyan-800",
  },
  {
    id: "13",
    name: "Gaucher Disease Community",
    description: "A place for individuals and families with Gaucher Disease.",
    memberCount: 200,
    slug: "gaucher-disease-support",
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: "14",
    name: "MSUD Support Group",
    description: "Connecting those affected by Maple Syrup Urine Disease.",
    memberCount: 90,
    slug: "msud-support",
    color: "bg-fuchsia-100 text-fuchsia-800",
  },
  {
    id: "15",
    name: "PKU Life",
    description: "Living with Phenylketonuria: tips, recipes, and support.",
    memberCount: 300,
    slug: "pku-support",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "16",
    name: "General Genetic Conditions",
    description: "A broad community for various genetic conditions",
    memberCount: 2500,
    slug: "general-genetic-conditions",
    color: "bg-gray-100 text-gray-800",
  },
]

// Base posts covering various rare genetic conditions
const basePosts = [
  {
    id: "1",
    title: "Our journey with PMS diagnosis",
    body: "It's been a challenging road since our daughter's Phelan-McDermid Syndrome diagnosis. Looking for others who have been through similar experiences.",
    author: "ParentOfWarrior",
    timestamp: "2 hours ago",
    type: "support",
    tags: ["PMS", "diagnosis", "family"],
    reactions: { heart: 12, thumbsUp: 8, thinking: 2, eyes: 15 },
    commentCount: 7,
    anonymous: false,
    images: ["/placeholder.svg?height=200&width=300"],
    videos: [],
    community: "pms-support",
    comments: [],
  },
  {
    id: "2",
    title: "Therapy ideas for Rett Syndrome communication",
    body: "What communication therapies have you found most effective for individuals with Rett Syndrome? We're exploring new options.",
    author: "RettAdvocate",
    timestamp: "4 hours ago",
    type: "advice",
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
    title: "New research on Fragile X treatments",
    body: "Exciting news from the latest conference! Sharing a summary of promising new research directions for Fragile X Syndrome.",
    author: "ScienceGeek",
    timestamp: "6 hours ago",
    type: "discussion",
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
    title: "Managing sleep issues with Angelman Syndrome",
    body: "Our child with Angelman Syndrome struggles with sleep. Any tips or strategies that have worked for your family?",
    author: "SleepyParent",
    timestamp: "8 hours ago",
    type: "advice",
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
    title: "Celebrating a milestone: First independent steps!",
    body: "After years of therapy, our son with Prader-Willi Syndrome took his first independent steps today! So proud! 🎉",
    author: "ProudPWParent",
    timestamp: "12 hours ago",
    type: "support",
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
    title: "Inclusive activities for kids with Down Syndrome",
    body: "Looking for ideas for inclusive summer activities in our area for children with Down Syndrome. Any recommendations?",
    author: "InclusiveMom",
    timestamp: "1 day ago",
    type: "advice",
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
    title: "Cystic Fibrosis diet tips and recipes",
    body: "Sharing some high-calorie, nutrient-dense recipes that have been great for managing CF. What are your go-to meals?",
    author: "CFChef",
    timestamp: "1 day ago",
    type: "discussion",
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
    title: "Living with Sickle Cell: Managing pain crises",
    body: "For those with Sickle Cell Anemia, what are your most effective strategies for managing pain crises at home?",
    author: "SickleCellStrong",
    timestamp: "2 days ago",
    type: "advice",
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
    title: "Huntington's Disease research updates",
    body: "Attended a webinar on the latest breakthroughs in Huntington's Disease research. Feeling hopeful about the future!",
    author: "HDHope",
    timestamp: "3 days ago",
    type: "discussion",
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
    title: "SMA treatment journey: Zolgensma experience",
    body: "Sharing our family's experience with Zolgensma for SMA Type 1. It's been a long road but seeing progress.",
    author: "SMAFamily",
    timestamp: "1 day ago",
    type: "support",
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
    title: "Batten Disease: Early symptoms and diagnosis",
    body: "Concerned about potential early symptoms of Batten Disease in our child. What were your experiences with diagnosis?",
    author: "WorriedParent",
    timestamp: "2 days ago",
    type: "advice",
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
    title: "Tay-Sachs: Navigating genetic testing results",
    body: "Just received our genetic testing results for Tay-Sachs. Feeling overwhelmed. Any advice on next steps?",
    author: "NewParent",
    timestamp: "1 day ago",
    type: "support",
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
    title: "Enzyme replacement therapy for Gaucher Disease",
    body: "Sharing my experience with enzyme replacement therapy for Type 1 Gaucher Disease. It's made a huge difference.",
    author: "GaucherWarrior",
    timestamp: "3 days ago",
    type: "discussion",
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
    title: "MSUD diet management: low-leucine recipes",
    body: "Looking for creative and tasty low-leucine recipes for Maple Syrup Urine Disease. Share your favorites!",
    author: "MSUDChef",
    timestamp: "1 day ago",
    type: "advice",
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
    title: "PKU formula challenges for toddlers",
    body: "My toddler with PKU is refusing their formula. Any tips or tricks to make it more palatable?",
    author: "PKUMom",
    timestamp: "2 days ago",
    type: "support",
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
    title: "General discussion: Advocating for rare diseases",
    body: "What are effective ways to advocate for rare genetic conditions in your local community or at a national level?",
    author: "RareDiseaseVoice",
    timestamp: "4 days ago",
    type: "discussion",
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
    title: "Coping with a new diagnosis of a rare genetic condition",
    body: "Just received a diagnosis for a very rare genetic condition. Feeling lost and overwhelmed. How do you cope with the emotional toll?",
    author: "SeekingSupport",
    timestamp: "5 hours ago",
    type: "support",
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
    title: "Sharing resources for undiagnosed genetic conditions",
    body: "For those still on the diagnostic journey, I've compiled a list of resources that helped us. Happy to share!",
    author: "DiagnosticJourney",
    timestamp: "1 day ago",
    type: "advice",
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

// Generates posts based on user's selected conditions (for "Home" tab)
const getPersonalizedFeedPosts = (userConditions: string[]) => {
  const userCommunities = userConditions.map((condition) => communityMap[condition] || condition).filter(Boolean)
  const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
  return [
    ...basePosts.filter((post) => userCommunities.includes(post.community)),
    ...userPosts.filter((post: any) => userCommunities.includes(post.community)),
  ]
}

// Generates popular posts from all communities (for "Suggested" tab)
const getGlobalPopularPosts = () => {
  // Sort all base posts by total reactions (popularity) and take a subset
  return [...basePosts]
    .sort((a, b) => {
      const aScore: number = Object.values(a.reactions).reduce((sum: number, count: number) => sum + count, 0)
      const bScore: number = Object.values(b.reactions).reduce((sum: number, count: number) => sum + count, 0)
      return bScore - aScore
    })
    .slice(0, 10) // Limit to top 10 suggested posts
}

function CommunityHome({ user }: CommunityHomeProps) {
  const [currentView, setCurrentView] = useState<
    "home" | "community" | "profile" | "settings" | "dmInbox" | "dmConversation" | "milestoneFeed" | "guidedOnboarding"
  >("home")
  const [selectedCommunity, setSelectedCommunity] = useState<string>("")
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [personalizedPosts, setPersonalizedPosts] = useState<any[]>([])
  const [globalPopularPosts, setGlobalPopularPosts] = useState<any[]>([])
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [communityFilter, setCommunityFilter] = useState("all")
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [selectedParticipantName, setSelectedParticipantName] = useState<string>("")
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false)
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    bio: "",
    description: "",
    conditions: [] as string[],
  })
  const [userCommunities, setUserCommunities] = useState<any[]>([])
  const [createStep, setCreateStep] = useState(0)
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState(false)
  const totalSteps = 4
  const [conditionSearch, setConditionSearch] = useState("")
  // Add state for selected community for post creation
  const [selectedPostCommunity, setSelectedPostCommunity] = useState<string>("")

  // On mount, always load userCommunities from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user_communities")
    if (stored) setUserCommunities(JSON.parse(stored))
  }, [])

  // Save user-created communities to localStorage
  useEffect(() => {
    localStorage.setItem("user_communities", JSON.stringify(userCommunities))
  }, [userCommunities])

  // Fix for "Maximum update depth exceeded" error:
  // Store userConditions in state and initialize it once from localStorage
  const [userConditions, setUserConditions] = useState<string[]>([])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}")
    setUserConditions(userData.conditions || [])
  }, []) // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // These effects now depend on the stable userConditions state
    setPersonalizedPosts(getPersonalizedFeedPosts(userConditions))
    setGlobalPopularPosts(getGlobalPopularPosts())
  }, [userConditions]) // This effect now correctly depends on userConditions state

  const allSlugs = [
    ...mockCommunities.map((c) => c.slug),
    ...userCommunities.map((c) => c.slug),
  ]
  const generateSlug = (name: string) => {
    let base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    let slug = base
    let i = 1
    while (allSlugs.includes(slug)) {
      slug = `${base}-${i++}`
    }
    return slug
  }

  // When creating a new community, update both state and localStorage
  const handleCreateCommunity = () => {
    if (!newCommunity.name.trim()) return
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
    const adminUsername = userData.username || user?.username || "Unknown User"
    const adminKey = userData.userKey
    const slug = generateSlug(newCommunity.name)
    const community = {
      ...newCommunity,
      slug,
      id: `user-${Date.now()}`,
      memberCount: 1,
      admin: adminUsername,
      adminKey, // assign adminKey
      creatorId: adminUsername,
    }
    setUserCommunities((prev) => {
      const updated = [community, ...prev]
      localStorage.setItem("user_communities", JSON.stringify(updated))
      return updated
    })
    // Add to user_data.conditions if not already present
    if (userData && Array.isArray(userData.conditions)) {
      if (!userData.conditions.includes(newCommunity.name)) {
        userData.conditions.push(newCommunity.name)
        localStorage.setItem('user_data', JSON.stringify(userData))
      }
    } else {
      userData.conditions = [newCommunity.name]
      localStorage.setItem('user_data', JSON.stringify(userData))
    }
    setShowCreateCommunityModal(false)
    setNewCommunity({ name: "", bio: "", description: "", conditions: [] })
  }

  const handleNextStep = () => {
    setCreateError("")
    if (createStep === 0 && !newCommunity.name.trim()) {
      setCreateError("Community name is required.")
      return
    }
    if (createStep === 1 && !newCommunity.bio.trim()) {
      setCreateError("Bio is required.")
      return
    }
    if (createStep === 2 && newCommunity.conditions.length === 0) {
      setCreateError("Please select at least one condition.")
      return
    }
    setCreateStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }
  const handlePrevStep = () => setCreateStep((prev) => Math.max(prev - 1, 0))

  const handleConditionToggle = (condition: string) => {
    setNewCommunity((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }))
  }

  const handleCreateCommunityWizard = () => {
    // Use name, bio, description, conditions
    handleCreateCommunity()
    setCreateSuccess(true)
    setTimeout(() => {
      setShowCreateCommunityModal(false)
      setCreateSuccess(false)
      setCreateStep(0)
      setCreateError("")
      setNewCommunity({ name: "", bio: "", description: "", conditions: [] })
      setConditionSearch("")
    }, 1200)
  }

  const joinedCommunities = mockCommunities.filter((c) =>
    userConditions
      .map((condition) => communityMap[condition])
      .filter(Boolean)
      .includes(c.slug),
  )

  const handleReaction = (postId: string, reactionType: string) => {
    const updatePosts = (prevPosts: any[]) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions }
          const currentUserReaction = userReactions[postId]

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
    const updatePosts = (prevPosts: any[]) =>
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
    const updatePosts = (prevPosts: any[]) =>
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

  const handleViewConversation = (id: string, participant: string) => {
    setSelectedConversationId(id)
    setSelectedParticipantName(participant)
    setCurrentView("dmConversation")
  }

  if (currentView === "community") {
    // Find the selected community in both mock and user communities
    const allCommunities = [...mockCommunities, ...userCommunities]
    const selected = allCommunities.find((c) => c.slug === selectedCommunity)
    return <CommunityFeed communitySlug={selectedCommunity} onBack={() => setCurrentView("home")} user={user} />
  }

  if (currentView === "profile") {
    return <UserProfile user={user} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "settings") {
    return <PrivacySettings user={user} onBack={() => setCurrentView("home")} />
  }

  if (currentView === "dmInbox") {
    return (
      <DMInbox
        onBack={() => setCurrentView("home")}
        onViewConversation={(id: string) => handleViewConversation(id, "Mock User")}
      />
    )
  }

  if (currentView === "dmConversation") {
    return (
      <DMConversation
        conversationId={selectedConversationId!}
        onBack={() => setCurrentView("dmInbox")}
        participantName={selectedParticipantName}
      />
    )
  }

  if (currentView === "milestoneFeed") {
    // Extract username and first condition from user profile
    const username = user?.username || "Unknown User"
    const condition = Array.isArray(user?.conditions) && user.conditions.length > 0 ? user.conditions[0] : "Unknown Condition"
    return (
      <MilestoneFeed
        onBack={() => setCurrentView("home")}
        user={{ username, condition }}
      />
    )
  }

  if (currentView === "guidedOnboarding") {
    return (
      <GuidedOnboarding onBack={() => setCurrentView("home")} onCompleteOnboarding={() => setCurrentView("home")} />
    )
  }

  // Determine which set of posts to display based on activeTab
  const currentPosts = activeTab === "suggested" ? globalPopularPosts : personalizedPosts

  if (selectedPost) {
    const post = currentPosts.find((p) => p.id === selectedPost)
    return (
      <PostDetail
        post={post}
        onBack={() => setSelectedPost(null)}
        user={user}
        onAddComment={addComment}
        onAddReply={addReply}
        onReaction={handleReaction}
        userReaction={userReactions[selectedPost]}
      />
    )
  }

  // Filter posts based on community filter and search
  const filteredPosts = currentPosts.filter((post) => {
    const matchesCommunity = communityFilter === "all" || post.community === communityFilter
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCommunity && matchesSearch
  })

  // Fix linter errors for implicit any
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (activeTab === "popular" || activeTab === "suggested") {
      const aScore = (Object.values(a.reactions) as number[]).reduce((sum, count) => sum + count, 0)
      const bScore = (Object.values(b.reactions) as number[]).reduce((sum, count) => sum + count, 0)
      return bScore - aScore
    }
    return 0 // Keep original order for 'home'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-rose-500" />
              <h1 className="text-2xl font-bold gradient-text">Carelink</h1>
            </div>
            <div className="flex items-center space-x-2 flex-wrap justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowCreatePostModal(true)}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg"
                disabled={userCommunities.length + joinedCommunities.length === 0}
                title={userCommunities.length + joinedCommunities.length === 0 ? 'Join a community to create a post' : ''}
              >
                + Create Post
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("dmInbox")}
                className="transition-all duration-200 ease-in-out hover:bg-rose-50 hover:text-rose-600"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                DMs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("milestoneFeed")}
                className="transition-all duration-200 ease-in-out hover:bg-rose-50 hover:text-rose-600"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Milestones
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("profile")}
                className="transition-all duration-200 ease-in-out hover:bg-rose-50 hover:text-rose-600"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView("settings")}
                className="transition-all duration-200 ease-in-out hover:bg-rose-50 hover:text-rose-600"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Your Communities */}
            <Card className="shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Your Communities</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreatePostModal(true)}
                    className="ml-2"
                    disabled={userCommunities.length + joinedCommunities.length === 0}
                    title={userCommunities.length + joinedCommunities.length === 0 ? 'Join a community to create a post' : ''}
                  >
                    +
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  ...userCommunities,
                  ...joinedCommunities.filter(jc => !userCommunities.some(uc => uc.slug === jc.slug)),
                ].map((community) => (
                  <button
                    key={community.id || community.slug}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors transition-all duration-200 ease-in-out hover:shadow-sm hover:scale-[1.02] border"
                    style={{ borderColor: community.color || "#e5e7eb" }}
                    onClick={() => {
                      setSelectedCommunity(community.slug)
                      setCurrentView("community")
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: community.color || "#e5e7eb" }} />
                      <span className="text-sm font-medium">{community.name}</span>
                      {userCommunities.some(uc => uc.slug === community.slug) && (
                        <Badge variant="outline" className="ml-2">Admin</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Community</label>
                  <Select value={communityFilter} onValueChange={setCommunityFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Communities</SelectItem>
                      {[
                        ...userCommunities,
                        ...joinedCommunities.filter(jc => !userCommunities.some(uc => uc.slug === jc.slug)),
                      ].map((community) => (
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

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Search and Tabs */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="home">Home</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="suggested">Suggested</TabsTrigger> {/* New Tab */}
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-4">
                  {sortedPosts.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No posts found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery
                            ? "Try adjusting your search terms or community filter."
                            : "Join a community or check the 'Suggested' tab for more posts!"}
                        </p>
                        {joinedCommunities.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Navigate to one of your communities to create a post.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    sortedPosts.map((post) => {
                      const community = mockCommunities.find((c) => c.slug === post.community)
                      return (
                        <Card
                          key={post.id}
                          className="group hover:shadow-2xl shadow-lg transition-shadow duration-200 ease-in-out rounded-xl border border-gray-200 bg-white overflow-hidden mb-6"
                        >
                          {/* Banner Image */}
                          {post.images && post.images.length > 0 && (
                            <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                              <img
                                src={post.images[0]}
                                alt="Post banner"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          )}
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge className={community?.color || "bg-gray-100 text-gray-800"}>{community?.name || "Community"}</Badge>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground flex items-center"><User className="h-3 w-3 mr-1" />{post.author}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" />{post.timestamp}</span>
                              </div>
                              <Badge
                                variant={
                                  post.type === "support"
                                    ? "default"
                                    : post.type === "advice"
                                      ? "secondary"
                                      : post.type === "event"
                                        ? "destructive"
                                        : "outline"
                                }
                                className="capitalize"
                              >
                                {post.type}
                              </Badge>
                            </div>
                            <CardTitle
                              className="text-2xl font-bold mt-2 mb-1 cursor-pointer hover:text-blue-600"
                              onClick={() => setSelectedPost(post.id)}
                            >
                              {post.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0 pb-2">
                            <p className="text-gray-700 mb-3 line-clamp-4">
                              {post.body.length > 220 ? `${post.body.slice(0, 220)}... ` : post.body}
                              {post.body.length > 220 && (
                                <span
                                  className="text-blue-500 cursor-pointer hover:underline"
                                  onClick={() => setSelectedPost(post.id)}
                                >
                                  Read more
                                </span>
                              )}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {post.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between border-t pt-3 mt-2">
                              <div className="flex items-center space-x-4">
                                <button
                                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[post.id] === "heart" ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                                  onClick={() => handleReaction(post.id, "heart")}
                                >
                                  <Heart className="h-4 w-4" />
                                  <span>{post.reactions.heart}</span>
                                </button>
                                <button
                                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[post.id] === "thumbsUp" ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"}`}
                                  onClick={() => handleReaction(post.id, "thumbsUp")}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{post.reactions.thumbsUp}</span>
                                </button>
                                <button
                                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[post.id] === "thinking" ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
                                  onClick={() => handleReaction(post.id, "thinking")}
                                >
                                  <span>🤔</span>
                                  <span>{post.reactions.thinking}</span>
                                </button>
                                <button
                                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[post.id] === "eyes" ? "text-green-500" : "text-muted-foreground hover:text-green-500"}`}
                                  onClick={() => handleReaction(post.id, "eyes")}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>{post.reactions.eyes}</span>
                                </button>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => setSelectedPost(post.id)}>
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  {post.commentCount}
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Flag className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {" "}
        {/* Wrap modal with AnimatePresence */}
        {showCreatePostModal && (
          <CreatePostModal
            onClose={() => setShowCreatePostModal(false)}
            user={user}
            availableCommunities={[...userCommunities, ...joinedCommunities]}
            onPostCreated={(newPost) => {
              // Add post to personalizedPosts/globalPopularPosts/localStorage as needed
              setShowCreatePostModal(false)
            }}
          />
        )}
      </AnimatePresence>
      
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

export { CommunityHome } // Named export
export default CommunityHome // Default export
