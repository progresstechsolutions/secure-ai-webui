"use client"

import { TabsTrigger } from "@/components/ui/tabs"

import { TabsList } from "@/components/ui/tabs"

import { Tabs } from "@/components/ui/tabs"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, MessageSquare, Settings, User, Trophy, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Community {
  id: string
  name: string
  description: string
  memberCount: number
  slug: string
  color: string
}

interface Post {
  id: string
  title: string
  body: string
  author: string
  timestamp: string
  type: string
  tags: string[]
  reactions: { heart: number; thumbsUp: number; thinking: number; eyes: number }
  commentCount: number
  anonymous: boolean
  images: string[]
  videos: any[]
  community: string
  comments: any[]
}

const mockCommunities: Community[] = [
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

const mockPosts: Post[] = [
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

// Utility function for admin check
function isUserAdminOfCommunity(user: { userKey?: string; username?: string }, community: any): boolean {
  if (!user || !community) return false;
  if (community.adminKey && user.userKey) {
    return community.adminKey === user.userKey;
  }
  if (community.admin && user.username) {
    return community.admin.toLowerCase() === user.username.toLowerCase();
  }
  return false;
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("communities")
  const [communities, setCommunities] = useState<Community[]>(mockCommunities)
  const [posts, setPosts] = useState<Post[]>(mockPosts)

  // State for new/edited community
  const [newCommunity, setNewCommunity] = useState<Partial<Community>>({
    name: "",
    description: "",
    slug: "",
    color: "bg-gray-100 text-gray-800",
    memberCount: 0,
  })
  const [editingCommunityId, setEditingCommunityId] = useState<string | null>(null)

  // State for new/edited post
  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "",
    body: "",
    author: "Admin",
    timestamp: "Just now",
    type: "discussion",
    tags: [],
    reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0 },
    commentCount: 0,
    anonymous: false,
    images: [],
    videos: [],
    community: "",
    comments: [],
  })
  const [editingPostId, setEditingPostId] = useState<string | null>(null)

  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  // TODO: Replace this with actual communityId from route or selection
  const communityId: string = "your-community-id-or-slug-here" // <-- Replace with real value

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
    const storedCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
    const community = storedCommunities.find((c: any) => c.id === communityId || c.slug === communityId)
    setSelectedCommunity(community)
    setIsAdmin(isUserAdminOfCommunity(userData, community))
  }, [communityId])

  if (!isAdmin) {
    return (
      <div className="text-center text-red-600 font-bold py-12">
        You are not the admin of this community.
      </div>
    )
  }

  const handleAddCommunity = () => {
    if (newCommunity.name && newCommunity.description && newCommunity.slug) {
      if (editingCommunityId) {
        setCommunities(communities.map((c) => (c.id === editingCommunityId ? { ...c, ...newCommunity, id: c.id } : c)))
        setEditingCommunityId(null)
      } else {
        setCommunities([
          ...communities,
          { ...newCommunity, id: String(communities.length + 1), memberCount: 0 } as Community,
        ])
      }
      setNewCommunity({ name: "", description: "", slug: "", color: "bg-gray-100 text-gray-800", memberCount: 0 })
    }
  }

  const handleEditCommunity = (community: Community) => {
    setNewCommunity(community)
    setEditingCommunityId(community.id)
  }

  const handleDeleteCommunity = (id: string) => {
    setCommunities(communities.filter((c) => c.id !== id))
  }

  const handleAddPost = () => {
    if (newPost.title && newPost.body && newPost.community) {
      if (editingPostId) {
        setPosts(posts.map((p) => (p.id === editingPostId ? { ...p, ...newPost, id: p.id } : p)))
        setEditingPostId(null)
      } else {
        setPosts([
          {
            ...newPost,
            id: String(posts.length + 1),
            timestamp: "Just now",
            reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0 },
            commentCount: 0,
            comments: [],
          } as Post,
          ...posts,
        ])
      }
      setNewPost({
        title: "",
        body: "",
        author: "Admin",
        timestamp: "Just now",
        type: "discussion",
        tags: [],
        reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0 },
        commentCount: 0,
        anonymous: false,
        images: [],
        videos: [],
        community: "",
        comments: [],
      })
    }
  }

  const handleEditPost = (post: Post) => {
    setNewPost(post)
    setEditingPostId(post.id)
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  const availableTags = [
    "diagnosis",
    "treatment",
    "therapy",
    "research",
    "parenting",
    "advocacy",
    "daily life",
    "nutrition",
    "symptoms",
    "support",
    "milestone",
    "genetic testing",
    "clinical trials",
    "coping",
    "education",
    "rare disease",
    "Phelan-McDermid Syndrome",
    "Rett Syndrome",
    "Fragile X Syndrome",
    "Angelman Syndrome",
    "Prader-Willi Syndrome",
    "Down Syndrome",
    "Cystic Fibrosis",
    "Sickle Cell Anemia",
    "Huntington's Disease",
    "Spinal Muscular Atrophy",
    "Batten Disease",
    "Tay-Sachs Disease",
    "Gaucher Disease",
    "Maple Syrup Urine Disease",
    "Phenylketonuria",
  ]

  const handleTagToggle = (tag: string) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...(prev.tags || []), tag],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-rose-500" />
              <h1 className="text-2xl font-bold gradient-text">Carelink Admin</h1>
            </div>
            <div className="flex items-center space-x-2 flex-wrap justify-end">
              <Button variant="ghost" size="sm" onClick={() => toast({ title: 'DMs not yet implemented', description: 'This section is coming soon.' })}>
                <MessageSquare className="h-4 w-4 mr-2" />
                DMs
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Milestones not yet implemented', description: 'This section is coming soon.' })}>
                <Trophy className="h-4 w-4 mr-2" />
                Milestones
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Onboarding not yet implemented', description: 'This section is coming soon.' })}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Onboarding
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.push('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="communities">Manage Communities</TabsTrigger>
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "communities" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">{editingCommunityId ? "Edit Community" : "Add New Community"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="community-name">Community Name</Label>
                  <Input
                    id="community-name"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
                    placeholder="e.g., PMS Support Group"
                  />
                </div>
                <div>
                  <Label htmlFor="community-slug">Community Slug</Label>
                  <Input
                    id="community-slug"
                    value={newCommunity.slug}
                    onChange={(e) =>
                      setNewCommunity({ ...newCommunity, slug: e.target.value.toLowerCase().replace(/\s/g, "-") })
                    }
                    placeholder="e.g., pms-support-group"
                  />
                </div>
                <div>
                  <Label htmlFor="community-description">Description</Label>
                  <Textarea
                    id="community-description"
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity({ ...newCommunity, description: e.target.value })}
                    placeholder="A brief description of the community"
                  />
                </div>
                <div>
                  <Label htmlFor="community-color">Badge Color (Tailwind Class)</Label>
                  <Input
                    id="community-color"
                    value={newCommunity.color}
                    onChange={(e) => setNewCommunity({ ...newCommunity, color: e.target.value })}
                    placeholder="e.g., bg-blue-100 text-blue-800"
                  />
                </div>
                <Button onClick={handleAddCommunity} className="w-full">
                  {editingCommunityId ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" /> Update Community
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Add Community
                    </>
                  )}
                </Button>
                {editingCommunityId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCommunityId(null)
                      setNewCommunity({
                        name: "",
                        description: "",
                        slug: "",
                        color: "bg-gray-100 text-gray-800",
                        memberCount: 0,
                      })
                    }}
                    className="w-full mt-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Existing Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communities.map((community) => (
                    <div key={community.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge className={community.color}>{community.name}</Badge>
                          <span className="text-sm text-muted-foreground">({community.memberCount} members)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{community.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCommunity(community)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCommunity(community.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">{editingPostId ? "Edit Post" : "Create New Post"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="post-title">Title</Label>
                  <Input
                    id="post-title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title"
                  />
                </div>
                <div>
                  <Label htmlFor="post-body">Body</Label>
                  <Textarea
                    id="post-body"
                    value={newPost.body}
                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    placeholder="Post content"
                  />
                </div>
                <div>
                  <Label htmlFor="post-community">Community</Label>
                  <Select
                    value={newPost.community}
                    onValueChange={(value) => setNewPost({ ...newPost, community: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((community) => (
                        <SelectItem key={community.slug} value={community.slug}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="post-type">Post Type</Label>
                  <Select value={newPost.type} onValueChange={(value) => setNewPost({ ...newPost, type: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="advice">Advice</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={newPost.tags?.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer ${newPost.tags?.includes(tag) ? "bg-rose-500 text-white" : "hover:bg-gray-100"}`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="post-anonymous"
                    checked={newPost.anonymous}
                    onCheckedChange={(checked) => setNewPost({ ...newPost, anonymous: checked as boolean })}
                  />
                  <Label htmlFor="post-anonymous">Anonymous Post</Label>
                </div>
                <Button onClick={handleAddPost} className="w-full">
                  {editingPostId ? (
                    <>
                      <Edit className="h-4 w-4 mr-2" /> Update Post
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Create Post
                    </>
                  )}
                </Button>
                {editingPostId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPostId(null)
                      setNewPost({
                        title: "",
                        body: "",
                        author: "Admin",
                        timestamp: "Just now",
                        type: "discussion",
                        tags: [],
                        reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0 },
                        commentCount: 0,
                        anonymous: false,
                        images: [],
                        videos: [],
                        community: "",
                        comments: [],
                      })
                    }}
                    className="w-full mt-2"
                  >
                    Cancel Edit
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-md rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg">Existing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{post.title}</h4>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.body}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary">{post.community}</Badge>
                        <Badge variant="outline">{post.type}</Badge>
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
