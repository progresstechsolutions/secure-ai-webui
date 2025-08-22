"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Textarea } from "../../../components/ui/textarea"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../../../components/ui/dropdown-menu"
import { mockCommunities } from "../../../components/mock-community-data"
import {
  Heart,
  Users,
  MessageSquare,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  Plus,
  X
} from "lucide-react"

interface PendingUser {
  id: string
  email: string
  username: string
  hasCompletedOnboarding: boolean
  registrationDate: string
  healthConditions?: string[]
  careRole?: string
}

interface Community {
  name: string
  members: number
  color: string
  description: string
}

// Community suggestions based on genetic conditions - using exact mock community data
const communityMappings: Record<string, Community> = {
  "Huntington's Disease": { name: "Huntington's Hope", members: 280, color: "from-indigo-100 to-indigo-800", description: "Support and research for Huntington's Disease" },
  "Cystic Fibrosis": { name: "Cystic Fibrosis Warriors", members: 920, color: "from-teal-100 to-teal-800", description: "Fighting CF together, sharing experiences and support" },
  "Sickle Cell Disease": { name: "Sickle Cell Strong", members: 550, color: "from-red-100 to-red-800", description: "Empowering those with Sickle Cell Anemia" },
  "Fragile X Syndrome": { name: "Fragile X Forum", members: 710, color: "from-green-100 to-green-800", description: "Discussions and resources for Fragile X Syndrome" },
  "Down Syndrome": { name: "Down Syndrome Network", members: 1500, color: "from-pink-100 to-pink-800", description: "A community for individuals and families with Down Syndrome" },
  "Phelan-McDermid Syndrome (PMS)": { name: "PMS Support", members: 850, color: "from-blue-100 to-blue-800", description: "A supportive community for people managing Phelan-McDermid Syndrome" },
  "Rett Syndrome": { name: "Rett Syndrome Community", members: 620, color: "from-purple-100 to-purple-800", description: "Connecting families and individuals affected by Rett Syndrome" },
  "Angelman Syndrome": { name: "Angelman Syndrome Connect", members: 480, color: "from-yellow-100 to-yellow-800", description: "Support and information for Angelman Syndrome" },
  "Prader-Willi Syndrome": { name: "Prader-Willi Life", members: 350, color: "from-orange-100 to-orange-800", description: "Navigating life with Prader-Willi Syndrome" },
  "Spinal Muscular Atrophy (SMA)": { name: "SMA Family Support", members: 400, color: "from-lime-100 to-lime-800", description: "Connecting families affected by Spinal Muscular Atrophy" },
  "Batten Disease": { name: "Batten Disease Alliance", members: 180, color: "from-rose-100 to-rose-800", description: "A community for support and advocacy for Batten Disease" },
  "Tay-Sachs Disease": { name: "Tay-Sachs Connect", members: 120, color: "from-cyan-100 to-cyan-800", description: "Support and resources for Tay-Sachs Disease families." },
  "Gaucher Disease": { name: "Gaucher Disease Community", members: 200, color: "from-amber-100 to-amber-800", description: "A place for individuals and families with Gaucher Disease." },
  "Maple Syrup Urine Disease (MSUD)": { name: "MSUD Support Group", members: 90, color: "from-fuchsia-100 to-fuchsia-800", description: "Connecting those affected by Maple Syrup Urine Disease." },
  "Phenylketonuria (PKU)": { name: "PKU Life", members: 300, color: "from-emerald-100 to-emerald-800", description: "Living with Phenylketonuria: tips, recipes, and support." },
  "Other Genetic Condition": { name: "General Genetic Conditions", members: 2500, color: "from-gray-100 to-gray-800", description: "A broad community for various genetic conditions" }
}

const generalCommunities = [
  { name: "General Genetic Conditions", members: 2500, color: "from-gray-100 to-gray-800", description: "A broad community for various genetic conditions" }
]

export default function GuidedOnboardingPage() {
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([])
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [showPostSharedMessage, setShowPostSharedMessage] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if there's a pending user from registration
    const storedUser = localStorage.getItem('pending_user')
    if (storedUser) {
      setPendingUser(JSON.parse(storedUser))
    } else {
      // If no pending user, redirect to sign up
      router.push('/auth/signup')
    }
    setIsLoading(false)
  }, [router])

  const handleOnboardingComplete = async () => {
    // Store the completed onboarding data
    const completeUser = {
      ...pendingUser,
      hasCompletedOnboarding: true,
      guidedOnboardingComplete: true,
      onboardingCompletedAt: new Date().toISOString(),
      joinedCommunities: joinedCommunities
    }
    
    // Save joined communities to localStorage using the correct mock community structure
    if (joinedCommunities.length > 0) {
      const existingCommunities = JSON.parse(localStorage.getItem('user_communities') || '[]')
      
      // Map community names to actual mock communities using exact names from mock data
      const communityNameMapping: Record<string, string> = {
        "Huntington's Hope": "huntingtons-disease-support",
        "Cystic Fibrosis Warriors": "cystic-fibrosis-support", 
        "Sickle Cell Strong": "sickle-cell-anemia-support",
        "Fragile X Forum": "fragile-x-support",
        "Down Syndrome Network": "down-syndrome-support",
        "PMS Support": "pms-support",
        "Rett Syndrome Community": "rett-syndrome-support",
        "Angelman Syndrome Connect": "angelman-support",
        "Prader-Willi Life": "prader-willi-support",
        "SMA Family Support": "sma-support",
        "Batten Disease Alliance": "batten-disease-support",
        "Tay-Sachs Connect": "tay-sachs-support",
        "Gaucher Disease Community": "gaucher-disease-support",
        "MSUD Support Group": "msud-support",
        "PKU Life": "pku-support",
        "General Genetic Conditions": "general-genetic-conditions"
      }
      
      const newCommunities = joinedCommunities
        .map(communityName => {
          const mockSlug = communityNameMapping[communityName]
          const mockCommunity = mockCommunities.find((c: any) => c.slug === mockSlug)
          
          if (mockCommunity) {
            // Use the exact mock community structure
            return {
              ...mockCommunity,
              isJoined: true,
              joinedAt: new Date().toISOString()
            }
          }
          return null
        })
        .filter(Boolean) // Remove null entries
        
      // Remove duplicates and save
      const uniqueCommunities = newCommunities.filter((newCom: any) => 
        !existingCommunities.some((existing: any) => existing.slug === newCom.slug)
      )
      
      localStorage.setItem('user_communities', JSON.stringify([...existingCommunities, ...uniqueCommunities]))
    }
    
    // Extract health conditions from joined communities and save user data
    const healthConditions = joinedCommunities.map(communityName => {
      // Map community names back to health conditions that match the communityMap in community-home.tsx
      const conditionMapping: Record<string, string> = {
        "Huntington's Hope": "Huntington's Disease",
        "Cystic Fibrosis Warriors": "Cystic Fibrosis", 
        "Sickle Cell Strong": "Sickle Cell Anemia",
        "Fragile X Forum": "Fragile X Syndrome",
        "Down Syndrome Network": "Down Syndrome",
        "PMS Support": "Phelan-McDermid Syndrome (PMS)",
        "Rett Syndrome Community": "Rett Syndrome",
        "Angelman Syndrome Connect": "Angelman Syndrome",
        "Prader-Willi Life": "Prader-Willi Syndrome",
        "SMA Family Support": "Spinal Muscular Atrophy (SMA)",
        "Batten Disease Alliance": "Batten Disease",
        "Tay-Sachs Connect": "Tay-Sachs Disease",
        "Gaucher Disease Community": "Gaucher Disease",
        "MSUD Support Group": "Maple Syrup Urine Disease (MSUD)",
        "PKU Life": "Phenylketonuria (PKU)",
        "General Genetic Conditions": "Other Genetic Condition"
      }
      return conditionMapping[communityName] || "Other Genetic Condition"
    }).filter((condition, index, self) => self.indexOf(condition) === index) // Remove duplicates
    
    // Save user data with conditions for proper feed filtering
    const userData = {
      username: pendingUser?.username,
      email: pendingUser?.email,
      conditions: healthConditions,
      joinedCommunities: joinedCommunities,
      region: "United States", // Default region, can be updated in profile
      onboardingComplete: true
    }
    localStorage.setItem('user_data', JSON.stringify(userData))
    
    // Save completed user data
    localStorage.setItem('completed_user', JSON.stringify(completeUser))
    localStorage.removeItem('pending_user')
    
    // For demo purposes, sign in with demo credentials
    // In production, you would register the user in your database and then sign them in
    try {
      const result = await signIn('credentials', {
        email: 'demo@caregene.com',
        password: 'password',
        redirect: false
      })
      
      if (result?.ok) {
        // Successfully signed in, navigate to dashboard
        router.push('/dashboard')
      } else {
        // If sign in fails, redirect to sign in page with a message
        router.push('/auth/signin?message=Please sign in to continue')
      }
    } catch (error) {
      console.error('Error signing in after onboarding:', error)
      router.push('/auth/signin?message=Please sign in to continue')
    }
  }

  const handleJoinCommunity = (communityName: string) => {
    if (joinedCommunities.includes(communityName)) {
      setJoinedCommunities(prev => prev.filter(name => name !== communityName))
    } else {
      setJoinedCommunities(prev => [...prev, communityName])
    }
  }

  const handleCreatePost = () => {
    if (postContent.trim().length < 10) return
    
    // Create post object
    const newPost = {
      id: `post_${Date.now()}`,
      content: postContent.trim(),
      author: pendingUser?.username || 'Anonymous',
      communities: joinedCommunities,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0
    }
    
    // Save post to localStorage (in a real app, this would be sent to a server)
    const existingPosts = JSON.parse(localStorage.getItem('user_posts') || '[]')
    existingPosts.push(newPost)
    localStorage.setItem('user_posts', JSON.stringify(existingPosts))
    
    // Reset form and show success
    setPostContent('')
    setShowCreatePost(false)
    setShowPostSharedMessage(true)
    
    // Auto-advance to next step after showing success message
    setTimeout(() => {
      setShowPostSharedMessage(false)
      setCurrentStep(4)
    }, 2000)
    
    console.log('Post created successfully:', newPost)
  }

  const handleCreateCommunity = () => {
    if (newCommunityName.trim().length < 3) return
    
    const newCommunity = {
      name: newCommunityName.trim(),
      members: 1,
      color: "from-blue-500 to-green-500",
      description: newCommunityDescription.trim() || `A community for ${newCommunityName.trim()}`
    }
    
    // Add to joined communities
    setJoinedCommunities(prev => [...prev, newCommunity.name])
    
    // Reset form
    setNewCommunityName("")
    setNewCommunityDescription("")
    setShowCreateCommunityModal(false)
    
    console.log('Community created:', newCommunity)
  }

  // Get suggested communities based on user's conditions
  const getSuggestedCommunities = () => {
    const userConditions = pendingUser?.healthConditions || []
    console.log('=== Debug getSuggestedCommunities ===')
    console.log('pendingUser:', pendingUser)
    console.log('userConditions:', userConditions)
    
    const conditionCommunities = userConditions
      .map(condition => {
        const community = communityMappings[condition as keyof typeof communityMappings]
        console.log(`Mapping condition "${condition}" to community:`, community)
        return community
      })
      .filter(Boolean)
    
    console.log('conditionCommunities:', conditionCommunities)
    console.log('generalCommunities:', generalCommunities)
    
    const result = [...conditionCommunities, ...generalCommunities.slice(0, 2)]
    console.log('Final suggested communities:', result)
    console.log('=== End Debug ===')
    
    return result
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Welcome to Caregene</h1>
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
                    stepNumber <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {currentStep === 1 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Welcome to Your Genetic Health Journey
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                      Hi {pendingUser?.username}! You've taken the first step toward connecting with others who understand your journey. 
                      Let us show you around your new community.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Connect</h3>
                      <p className="text-xs text-gray-600">Find support communities tailored to your needs</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                      <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1 sm:mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Share</h3>
                      <p className="text-xs text-gray-600">Tell your story and help others on their journey</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl">
                      <Search className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-1 sm:mb-2" />
                      <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm">Learn</h3>
                      <p className="text-xs text-gray-600">Access resources and research updates</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    >
                      Let's Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-2 sm:mb-3" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Join Your Communities
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                      Based on your profile, we've found communities that match your interests. 
                      Join the ones that feel right for you - you can always join more later!
                    </p>
                  </div>

                  {/* Joined Communities Summary */}
                  {joinedCommunities.length > 0 && (
                    <div className="mb-3 sm:mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2 text-xs sm:text-sm">
                        Communities You've Joined ({joinedCommunities.length}):
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {joinedCommunities.map((community, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                            {community}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {getSuggestedCommunities().map((community, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-blue-300 transition-colors">
                        <div className={`w-full h-1.5 bg-gradient-to-r ${community.color} rounded-full mb-2 sm:mb-3`}></div>
                        <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-xs sm:text-sm">{community.name}</h3>
                        <p className="text-xs text-gray-600 mb-1 sm:mb-2 line-clamp-2">{community.description}</p>
                        <p className="text-xs text-gray-500 mb-2 sm:mb-3">{community.members} members</p>
                        
                        <Button 
                          size="sm" 
                          variant={joinedCommunities.includes(community.name) ? "default" : "outline"}
                          className="w-full text-xs h-8"
                          onClick={() => handleJoinCommunity(community.name)}
                        >
                          {joinedCommunities.includes(community.name) ? "Joined" : "Join Community"}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="order-2 sm:order-1 w-full sm:w-auto"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(4)}
                        className="text-gray-600 w-full sm:w-auto order-2 sm:order-1"
                      >
                        Skip
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(3)}
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-1 sm:order-2"
                        disabled={joinedCommunities.length === 0}
                      >
                        Continue ({joinedCommunities.length} joined)
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-2 sm:mb-3" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      Share Your Story
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
                      Your experiences matter. Sharing your story can help others feel less alone and provide valuable insights 
                      to the community.
                    </p>
                  </div>

                  {!showCreatePost && !showPostSharedMessage ? (
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className="text-lg sm:text-xl">💬</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1 text-xs sm:text-sm">Ready to share?</h4>
                            <p className="text-xs text-gray-600 mb-2 sm:mb-3">
                              Creating your first post helps others get to know you and builds connections in the community.
                            </p>
                            <Button
                              onClick={() => setShowCreatePost(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm w-full sm:w-auto"
                              size="sm"
                            >
                              Create Your First Post
                            </Button>
                          </div>
                        </div>
                      </div>

                      
                    </div>
                  ) : showPostSharedMessage ? (
                    <div className="mb-4 sm:mb-6">
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-green-200 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Post Shared Successfully!</h4>
                        <p className="text-xs sm:text-sm text-green-700">
                          Your story has been shared with the community. Moving to the final step...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 text-xs sm:text-sm">Create your first post</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCreatePost(false)}
                              className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-3 sm:p-4">
                          <Textarea
                            placeholder="Share your story, ask a question, or offer support to others... What would you like the community to know about your journey?"
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="min-h-[80px] sm:min-h-[100px] resize-none border-0 shadow-none text-xs sm:text-sm placeholder:text-gray-400 focus-visible:ring-0"
                          />
                          
                          {joinedCommunities.length > 0 && (
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-600 mb-1 sm:mb-2">Posting to:</p>
                              <div className="flex flex-wrap gap-1">
                                {joinedCommunities.map((community, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {community}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 sm:mt-4 gap-2 sm:gap-0">
                            <p className="text-xs text-gray-500">
                              {postContent.length}/1000 characters
                            </p>
                            <div className="flex space-x-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                onClick={() => setShowCreatePost(false)}
                                size="sm"
                                className="flex-1 sm:flex-none text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCreatePost}
                                disabled={postContent.trim().length < 10}
                                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none text-xs"
                                size="sm"
                              >
                                Share Post
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="order-2 sm:order-1 w-full sm:w-auto"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                      <Button
                        variant="ghost"
                        onClick={() => setCurrentStep(4)}
                        className="text-gray-600 w-full sm:w-auto order-2 sm:order-1"
                      >
                        Skip
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Button>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                      You're All Set!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mb-4 sm:mb-6">
                      Welcome to Caregene, {pendingUser?.username}! You're now part of a supportive community 
                      dedicated to genetic health awareness and support.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">Next Steps</h3>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Explore your personalized feed</li>
                        <li>• Join relevant communities</li>
                        <li>• Share your first post</li>
                      </ul>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2 text-xs sm:text-sm">Get Support</h3>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Browse community guidelines</li>
                        <li>• Contact support anytime</li>
                        <li>• Access help resources</li>
                      </ul>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleOnboardingComplete}
                      size="default"
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4 sm:px-6 py-2 w-full sm:w-auto text-sm sm:text-base"
                    >
                      Enter Caregene
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateCommunityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Create Community</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateCommunityModal(false)}
                  className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3 sm:p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Community Name
                </label>
                <input
                  type="text"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  placeholder="Enter community name"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  maxLength={50}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newCommunityDescription}
                  onChange={(e) => setNewCommunityDescription(e.target.value)}
                  placeholder="Describe your community..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  maxLength={200}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateCommunityModal(false)}
                  className="w-full sm:flex-1 text-xs sm:text-sm"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCommunity}
                  disabled={newCommunityName.trim().length < 3}
                  className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                  size="sm"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
