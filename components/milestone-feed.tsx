"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trophy, Share2, MessageSquare, Heart, User, Clock, ThumbsUp } from "lucide-react"
import { CreateMilestoneModal } from "./create-milestone-modal"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {typeof onBack === 'function' && (
              <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                <ArrowLeft className="h-5 w-5 mr-1" /> Back
              </Button>
            )}
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex justify-end mb-4">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowCreateMilestoneModal(true)}
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Milestone
          </Button>
        </div>
        <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Display milestones in a grid or card list */}
            <div className="grid grid-cols-1 gap-6">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                          <User className="h-4 w-4" />
                          <span>{milestone.achievedBy}</span>
                          <Clock className="h-4 w-4" />
                          <span>{milestone.date}</span>
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          {milestone.condition}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{milestone.description}</p>
                    {milestone.image && (
                      <img
                        src={milestone.image || "/placeholder.svg"}
                        alt={milestone.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center space-x-4">
                        <button
                          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
                          onClick={() => handleReaction(milestone.id, "heart")}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{milestone.reactions.heart}</span>
                        </button>
                        <button
                          className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors"
                          onClick={() => handleReaction(milestone.id, "thumbsUp")}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>{milestone.reactions.thumbsUp}</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {milestone.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {showCreateMilestoneModal && (
        <CreateMilestoneModal
          onClose={() => setShowCreateMilestoneModal(false)}
          onMilestoneCreated={handleAddMilestone}
        />
      )}
    </div>
  )
}
