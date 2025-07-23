"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, User, Heart, ThumbsUp, Eye, Clock, Flag, Video, Plus } from "lucide-react"
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
    comments: [
      {
        id: "c1",
        body: "So sorry to hear that. My son was diagnosed last year. It gets easier, I promise. Reach out if you need to talk.",
        author: "SupportiveMom",
        timestamp: "1 hour ago",
        replies: [],
      },
    ],
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

// Add a type guard at the top of the file:
function hasBioAndConditions(obj: any): obj is { bio: string; conditions: string[] } {
  return typeof obj === 'object' && obj !== null && 'bio' in obj && 'conditions' in obj && Array.isArray(obj.conditions);
}

export function CommunityFeed({ communitySlug, onBack, user }: CommunityFeedProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [userReactions, setUserReactions] = useState<Record<string, string>>({})
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)

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

  useEffect(() => {
    // Filter mock posts and user posts based on the communitySlug
    const userPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
    const filteredMock = initialMockPosts.filter((post) => post.community === communitySlug)
    const filteredUser = userPosts.filter((post: any) => post.community === communitySlug)
    setPosts([...filteredUser, ...filteredMock])
  }, [communitySlug])

  // Trending tags (top 8 by frequency)
  const trendingTags = useMemo(() => {
    const tagCount: Record<string, number> = {}
    posts.forEach(post => post.tags.forEach((tag: string) => { tagCount[tag] = (tagCount[tag] || 0) + 1 }))
    return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([tag]) => tag)
  }, [posts])

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
    setShowCreatePostModal(false)
  }

  // Reaction handler with activity logging
  const handleReaction = (postId: string, reactionType: string) => {
    setUserReactions((prev) => ({ ...prev, [postId]: reactionType }))
    const post = posts.find((p) => p.id === postId)
    if (post) {
      logUserActivity(`Reacted with ${reactionType} to post: \"${post.title}\"`)
    }
    // You can add your existing reaction logic here if needed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowCreatePostModal(true)}
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg"
          >
            + Create Post
          </Button>
        </div>
      </header>

      {/* Community Banner */}
      <div className={`max-w-4xl mx-auto mt-6 mb-8 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between ${communityInfo.color || "bg-gradient-to-r from-rose-100 via-pink-50 to-orange-50"} bg-opacity-80`}>
        <div>
          <h2 className="text-4xl font-extrabold mb-2 gradient-text drop-shadow-lg">{communityInfo.name}</h2>
          {hasBioAndConditions(communityInfo) && communityInfo.bio ? (
            <p className="text-lg mb-2 text-gray-700 max-w-xl">{communityInfo.bio}</p>
          ) : null}
          {hasBioAndConditions(communityInfo) && communityInfo.conditions.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {communityInfo.conditions.map((cond: string) => (
                <span key={cond} className="inline-block bg-rose-100 text-rose-700 rounded-full px-3 py-1 text-xs font-semibold shadow">
                  {cond}
                </span>
              ))}
            </div>
          ) : null}
          {!hasBioAndConditions(communityInfo) && communityInfo.description ? (
            <p className="text-lg mb-2 text-gray-700 max-w-xl">{communityInfo.description}</p>
          ) : null}
          <span className="inline-block bg-white/80 rounded-full px-4 py-1 text-sm font-semibold text-gray-700 shadow">{communityInfo.memberCount} members</span>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-gray-500 mb-1">Top Contributors</span>
          <div className="flex -space-x-3">
            {topContributors.map((author, idx) => (
              <div key={author} className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center border-2 border-white text-white font-bold text-lg shadow-lg" style={{ zIndex: 10 - idx }}>
                {author[0]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Tags */}
      {trendingTags.length > 0 && (
        <div className="max-w-4xl mx-auto mb-6 px-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-semibold text-gray-600">Trending:</span>
            <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
              {trendingTags.map(tag => (
                <span key={tag} className="inline-block bg-gradient-to-r from-rose-200 to-orange-200 text-rose-700 px-3 py-1 rounded-full text-xs font-medium shadow hover:scale-105 transition-transform cursor-pointer">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <div className="max-w-4xl mx-auto mb-8 px-4">
          <div className="mb-2 text-xs font-bold text-orange-600 uppercase tracking-widest">Featured Post</div>
          <Card
            className="group hover:shadow-2xl shadow-lg transition-shadow duration-200 ease-in-out rounded-xl border border-gray-200 bg-white overflow-hidden mb-6"
          >
            {/* Banner Image */}
            {featuredPost.images && featuredPost.images.length > 0 && (
              <div className="w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={featuredPost.images[0]}
                  alt="Post banner"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{featuredPost.community}</Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center"><User className="h-3 w-3 mr-1" />{featuredPost.author}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" />{featuredPost.timestamp}</span>
                </div>
                <Badge
                  variant={
                    featuredPost.type === "support"
                      ? "default"
                      : featuredPost.type === "advice"
                        ? "secondary"
                        : featuredPost.type === "event"
                          ? "destructive"
                          : "outline"
                  }
                  className="capitalize"
                >
                  {featuredPost.type}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold mt-2 mb-1">{featuredPost.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <p className="text-gray-700 mb-3 line-clamp-4">
                {featuredPost.body.length > 220 ? `${featuredPost.body.slice(0, 220)}... ` : featuredPost.body}
                {featuredPost.body.length > 220 && (
                  <span className="text-blue-500 cursor-pointer hover:underline">Read more</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {featuredPost.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <div className="flex items-center space-x-4">
                  <button
                    className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[featuredPost.id] === "heart" ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                    onClick={() => handleReaction(featuredPost.id, "heart")}
                  >
                    <Heart className="h-4 w-4" />
                    <span>{featuredPost.reactions.heart}</span>
                  </button>
                  <button
                    className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[featuredPost.id] === "thumbsUp" ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"}`}
                    onClick={() => handleReaction(featuredPost.id, "thumbsUp")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{featuredPost.reactions.thumbsUp}</span>
                  </button>
                  <button
                    className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[featuredPost.id] === "thinking" ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
                    onClick={() => handleReaction(featuredPost.id, "thinking")}
                  >
                    <span>🤔</span>
                    <span>{featuredPost.reactions.thinking}</span>
                  </button>
                  <button
                    className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReactions[featuredPost.id] === "eyes" ? "text-green-500" : "text-muted-foreground hover:text-green-500"}`}
                    onClick={() => handleReaction(featuredPost.id, "eyes")}
                  >
                    <Eye className="h-4 w-4" />
                    <span>{featuredPost.reactions.eyes}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {featuredPost.commentCount}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Masonry/Grid Feed */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts in this community yet.</h3>
              <p className="text-muted-foreground">Be the first to share something!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.filter(p => !featuredPost || p.id !== featuredPost.id).map((post) => (
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
                      <Badge variant="outline">{post.community}</Badge>
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
                  <CardTitle className="text-2xl font-bold mt-2 mb-1">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <p className="text-gray-700 mb-3 line-clamp-4">
                    {post.body.length > 220 ? `${post.body.slice(0, 220)}... ` : post.body}
                    {post.body.length > 220 && (
                      <span className="text-blue-500 cursor-pointer hover:underline">Read more</span>
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
                      <Button variant="ghost" size="sm">
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
            ))}
          </div>
        )}
      </div>
      {showCreatePostModal && (
        <CreatePostModal
          onClose={() => setShowCreatePostModal(false)}
          availableCommunities={[{ name: communityInfo.name, slug: communitySlug }]}
          communitySlug={communitySlug}
          user={user}
          onPostCreated={handleAddPost}
        />
      )}
    </div>
  )
}
