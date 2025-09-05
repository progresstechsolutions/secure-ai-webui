"use client"

import { useState } from "react"

import CommunityHome from "@/components/community-home"
import { CommunityFeed } from "@/components/community-feed"
import { DMConversation } from "@/components/dm-conversation"
import { CreateCommunityModal } from "@/components/create-community-modal"
import { CreatePostModal } from "@/components/create-post-modal"
import { PostDetail } from "@/components/post-detail"
import { CommunityManagement } from "@/components/community-management"

interface DashboardUser {
  id: string
  email?: string | null
  name?: string | null
  username: string
  image?: string | null
  healthConditions: string[]
  location: {
    region: string
    state?: string
  }
}

type ViewType = 'home' | 'feed' | 'messages' | 'communities' | 'post' | 'management' | 'notifications'

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null)

  // Mock user data
  const user = {
    id: "current-user",
    email: "user@example.com",
    name: "Current User",
    username: "current_user",
    image: "/placeholder-user.jpg",
    healthConditions: ["Phelan-McDermid Syndrome"],
    location: {
      region: "United States",
      state: "California"
    }
  }

  // Transform user data to match component interfaces
  const communityHomeUser = {
    username: user.username,
    conditions: user.healthConditions,
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    location: user.location
  }

  const handleNavigate = (view: ViewType, data?: any) => {
    setCurrentView(view)
    if (data?.postId) setSelectedPost(data.postId)
    if (data?.communityId) setSelectedCommunity(data.communityId)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <CommunityHome user={communityHomeUser} />
      case 'feed':
        return (
          <CommunityFeed 
            communitySlug="pms-support" 
            onBack={() => setCurrentView('home')}
            user={user}
          />
        )
      case 'messages':
        return (
          <DMConversation 
            onBack={() => setCurrentView('home')}
            onConversationChange={(hasConversation) => console.log('Conversation changed:', hasConversation)}
          />
        )
      case 'communities':
        return <div className="p-6"><h1 className="text-2xl font-bold">Communities</h1><p>Community management coming soon...</p></div>
      case 'notifications':
        return <div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p>Notifications coming soon...</p></div>
      case 'post':
        if (selectedPost) {
          const mockPost = {
            id: selectedPost,
            title: "Sample Post",
            content: "This is a sample post content.",
            author: user,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: []
          }
          return (
            <PostDetail 
              post={mockPost}
              onBack={() => setCurrentView('feed')}
              user={user}
              onAddComment={() => {}}
              onAddReply={() => {}}
              onReaction={() => {}}
              userReaction=""
            />
          )
        }
        return <div>Post not found</div>
      case 'management':
        return selectedCommunity ? <CommunityManagement /> : <div>Community not found</div>
      default:
        return <CommunityHome user={communityHomeUser} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      
      {renderCurrentView()}
    </div>
  )
}
