"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface DMConversationProps {
  conversationId: string
  participantName: string
  onBack: () => void
}

interface Message {
  id: string
  sender: "me" | "other"
  text: string
  timestamp: string
}

const mockMessages: Record<string, Message[]> = {
  conv1: [
    { id: "m1", sender: "other", text: "Hi there! How are you doing today?", timestamp: "10:00 AM" },
    { id: "m2", sender: "me", text: "I'm doing well, thanks! Just navigating through the day.", timestamp: "10:05 AM" },
    {
      id: "m3",
      sender: "other",
      text: "That's great to hear! I saw your post about managing sleep issues with Angelman Syndrome. My child also struggles with that.",
      timestamp: "10:10 AM",
    },
    {
      id: "m4",
      sender: "me",
      text: "Oh, I'm so sorry to hear that, but it's good to connect with someone who understands. It's been a real challenge for us.",
      timestamp: "10:15 AM",
    },
    {
      id: "m5",
      sender: "other",
      text: "Absolutely. We've tried a few things that have helped a bit. Have you looked into weighted blankets or specific bedtime routines?",
      timestamp: "10:20 AM",
    },
    {
      id: "m6",
      sender: "me",
      text: "We've tried a weighted blanket, but maybe our routine needs tweaking. What does your routine look like?",
      timestamp: "10:25 AM",
    },
    {
      id: "m7",
      sender: "other",
      text: "We start with a warm bath, then quiet reading time, and a specific lullaby. Consistency is key for us.",
      timestamp: "10:30 AM",
    },
    {
      id: "m8",
      sender: "me",
      text: "That sounds lovely. We'll try to incorporate more quiet reading. Thanks for the tip!",
      timestamp: "10:35 AM",
    },
  ],
  conv2: [
    {
      id: "m9",
      sender: "other",
      text: "Hey, I saw you're in the Cystic Fibrosis community. Do you have any good high-calorie recipes?",
      timestamp: "Yesterday 3:00 PM",
    },
    {
      id: "m10",
      sender: "me",
      text: "Yes! I'm always experimenting. I can share a few of my favorites. Do you have any dietary restrictions?",
      timestamp: "Yesterday 3:10 PM",
    },
  ],
}

export function DMConversation(props: any) {
  const [messages, setMessages] = useState<Message[]>(mockMessages[props.conversationId] || [])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: `m${Date.now()}`,
        sender: "me",
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage("")
    }
  }

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
            <CardTitle className="text-2xl font-bold mb-2">Direct Message</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{props.participantName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold">{props.participantName}</CardTitle>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            {/* Message Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      message.sender === "me"
                        ? "bg-rose-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`block text-xs mt-1 ${
                        message.sender === "me" ? "text-rose-100" : "text-gray-500"
                      } text-right`}
                    >
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="bg-white border-t border-rose-100 p-4 flex items-center space-x-3">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
