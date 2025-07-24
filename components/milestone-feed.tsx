"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trophy, Share2, MessageSquare, Heart, User, Clock, ThumbsUp, ArrowLeft } from "lucide-react"
import { CreateMilestoneModal } from "./create-milestone-modal"

interface MilestoneFeedProps {
  onBack: () => void
  user: { username: string; condition: string }
}

/**
 * Represents a user milestone in the community.
 */
export interface Milestone {
  /** Unique identifier for the milestone */
  id: string
  /** Title of the milestone */
  title: string
  /** Description of the achievement */
  description: string
  /** Date the milestone was achieved (ISO string or formatted) */
  date: string
  /** Username or display name of the achiever */
  achievedBy: string
  /** Associated condition or context */
  condition: string
  /** Reaction counts */
  reactions: {
    heart: number
    thumbsUp: number
  }
  /** Number of comments */
  comments: number
  /** Optional image URL */
  image?: string
}

const mockMilestones: Milestone[] = [
  {
    id: "m1",
    title: "First Independent Steps!",
    description:
      "After years of therapy, my son with Prader-Willi Syndrome took his first independent steps today! So incredibly proud and emotional.",
    date: "July 15, 2024",
    achievedBy: "ProudPWParent",
    condition: "Prader-Willi Syndrome",
    reactions: { heart: 89, thumbsUp: 67 },
    comments: 12,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "m2",
    title: "Successful Gene Therapy Infusion",
    description:
      "Completed the Zolgensma infusion for SMA Type 1. Feeling hopeful for the future and grateful for this opportunity.",
    date: "July 10, 2024",
    achievedBy: "SMAFamily",
    condition: "Spinal Muscular Atrophy (SMA)",
    reactions: { heart: 120, thumbsUp: 90 },
    comments: 25,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "m3",
    title: "New Communication Breakthrough",
    description:
      "My daughter with Rett Syndrome used her eye-gaze device to form a full sentence for the first time! A huge step forward.",
    date: "July 8, 2024",
    achievedBy: "RettAdvocate",
    condition: "Rett Syndrome",
    reactions: { heart: 75, thumbsUp: 50 },
    comments: 8,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "m4",
    title: "First PKU-Friendly Birthday Cake Baked!",
    description:
      "Successfully baked a delicious low-protein birthday cake for my child with PKU. It tasted amazing and everyone loved it!",
    date: "July 1, 2024",
    achievedBy: "PKUMom",
    condition: "Phenylketonuria (PKU)",
    reactions: { heart: 60, thumbsUp: 45 },
    comments: 10,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "m5",
    title: "Advocacy Meeting Success",
    description:
      "Our local rare disease advocacy group successfully lobbied for increased funding for genetic research. Feeling empowered!",
    date: "June 25, 2024",
    achievedBy: "RareDiseaseVoice",
    condition: "General Genetic Condition",
    reactions: { heart: 95, thumbsUp: 80 },
    comments: 15,
    image: "/placeholder.svg?height=200&width=300",
  },
]


export function MilestoneFeed({ onBack, user }: MilestoneFeedProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones)
  const [showCreateMilestoneModal, setShowCreateMilestoneModal] = useState(false)

  const handleReaction = (milestoneId: string, reactionType: "heart" | "thumbsUp") => {
    setMilestones((prevMilestones) =>
      prevMilestones.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            reactions: {
              ...milestone.reactions,
              [reactionType]: milestone.reactions[reactionType] + 1,
            },
          }
        }
        return milestone
      }),
    )
  }

  const handleAddMilestone = (data: { title: string; description: string; image?: string }) => {
    const newMilestone: Milestone = {
      id: `m${Date.now()}`,
      title: data.title,
      description: data.description,
      date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      achievedBy: user.username,
      condition: user.condition,
      reactions: { heart: 0, thumbsUp: 0 },
      comments: 0,
      image: data.image || undefined,
    }
    setMilestones((prev) => [newMilestone, ...prev])
    setShowCreateMilestoneModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Milestones
                  </h1>
                </div>
              </div>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowCreateMilestoneModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Celebrate Your Journey</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Share your achievements, big and small. Every milestone matters and inspires others in our community.
          </p>
        </div>
        
        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {milestones.map((milestone) => (
            <Card 
              key={milestone.id} 
              className="group hover:shadow-xl transition-all duration-300 ease-in-out rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-blue-200"
            >
              {/* Milestone Image */}
              {milestone.image && (
                <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={milestone.image || "/placeholder.svg"}
                    alt={milestone.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-blue-800 shadow-lg">
                      <Trophy className="h-3 w-3 mr-1" />
                      Achievement
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                      {milestone.title}
                    </CardTitle>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{milestone.achievedBy}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{milestone.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer w-fit"
                >
                  {milestone.condition}
                </Badge>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {milestone.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleReaction(milestone.id, "heart")}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="font-medium">{milestone.reactions.heart}</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => handleReaction(milestone.id, "thumbsUp")}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-medium">{milestone.reactions.thumbsUp}</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{milestone.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {milestones.length === 0 && (
          <Card className="bg-white shadow-sm">
            <CardContent className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No milestones yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start celebrating your journey by adding your first milestone!
              </p>
              <Button
                onClick={() => setShowCreateMilestoneModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Milestone
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Create Milestone Modal */}
      {showCreateMilestoneModal && (
        <CreateMilestoneModal
          open={showCreateMilestoneModal}
          onOpenChange={setShowCreateMilestoneModal}
          onMilestoneCreated={handleAddMilestone}
        />
      )}
    </div>
  )
}
