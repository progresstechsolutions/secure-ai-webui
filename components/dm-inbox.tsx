"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, MessageSquare, Plus, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface DMInboxProps {
  onBack: () => void
  onViewConversation: (conversationId: string, participantName: string) => void
}

interface Conversation {
  id: string
  participantName: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  avatarUrl: string
}

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantName: "SleepyParent",
    lastMessage: "We'll try to incorporate more quiet reading. Thanks for the tip!",
    timestamp: "10:35 AM",
    unreadCount: 0,
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    id: "conv2",
    participantName: "CFChef",
    lastMessage: "Yes! I'm always experimenting. I can share a few of my favorites.",
    timestamp: "Yesterday 3:10 PM",
    unreadCount: 1,
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    id: "conv3",
    participantName: "ScienceGeek",
    lastMessage: "That new research on Fragile X is really promising.",
    timestamp: "2 days ago",
    unreadCount: 0,
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    id: "conv4",
    participantName: "ProudPWParent",
    lastMessage: "So happy for your son's milestone!",
    timestamp: "3 days ago",
    unreadCount: 0,
    avatarUrl: "/placeholder-user.jpg",
  },
]

export function DMInbox(props: any) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {(typeof props.onBack === 'function' || typeof props?.onBack === 'function') && (
              <Button variant="ghost" size="sm" onClick={props.onBack || props?.onBack || router.back} className="mr-2">
                <ArrowLeft className="h-5 w-5 mr-1" /> Back
              </Button>
            )}
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
        </div>
      </header>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2">Direct Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search DMs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4">
              {filteredConversations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No conversations found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or start a new DM.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredConversations.map((conv) => (
                  <Card
                    key={conv.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out rounded-lg"
                    onClick={() => props.onViewConversation(conv.id, conv.participantName)}
                  >
                    <CardContent className="flex items-center space-x-4 p-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conv.avatarUrl || "/placeholder.svg"} />
                          <AvatarFallback>{conv.participantName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{conv.participantName}</CardTitle>
                          <span className="text-sm text-muted-foreground">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{conv.lastMessage}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
