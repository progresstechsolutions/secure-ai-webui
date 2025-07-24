"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Smile, MoreVertical, ArrowLeft, MessageCircle, Phone, Video, Search, Plus, Edit, X, Users, UserPlus, Check, UserMinus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  sender: "me" | "other" | string
  text: string
  timestamp: string
  type?: "text" | "system" | "invitation"
}

interface GroupInvitation {
  id: string
  groupId: string
  groupName: string
  inviterId: string
  inviterName: string
  status: "pending" | "accepted" | "declined"
  timestamp: string
}

interface Conversation {
  id: string
  participantName: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  avatarUrl: string
  isOnline: boolean
  type: "direct" | "group"
  participants?: string[]
  createdBy?: string
  groupInvitations?: GroupInvitation[]
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
  conv3: [
    {
      id: "m11",
      sender: "other",
      text: "That new research on Fragile X is really promising.",
      timestamp: "2 days ago",
    },
  ],
  conv4: [
    {
      id: "m12",
      sender: "other",
      text: "So happy for your son's milestone!",
      timestamp: "3 days ago",
    },
  ],
  group1: [
    {
      id: "g1",
      sender: "SleepyParent",
      text: "Welcome everyone to our sleep support group! Feel free to share any tips or questions.",
      timestamp: "2 hours ago",
      type: "system",
    },
    {
      id: "g2",
      sender: "RestlessNights",
      text: "Thanks for creating this group! We really needed a space to discuss sleep challenges.",
      timestamp: "1 hour 30 min ago",
    },
    {
      id: "g3",
      sender: "MidnightMom",
      text: "Agreed! Has anyone tried melatonin alternatives? My doctor suggested some natural options.",
      timestamp: "1 hour ago",
    },
  ],
}

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantName: "SleepyParent",
    lastMessage: "We'll try to incorporate more quiet reading. Thanks for the tip!",
    timestamp: "10:35 AM",
    unreadCount: 0,
    avatarUrl: "/placeholder-user.jpg",
    isOnline: true,
    type: "direct",
  },
  {
    id: "conv2",
    participantName: "CFChef",
    lastMessage: "Yes! I'm always experimenting. I can share a few of my favorites.",
    timestamp: "Yesterday 3:10 PM",
    unreadCount: 2,
    avatarUrl: "/placeholder-user.jpg",
    isOnline: true,
    type: "direct",
  },
  {
    id: "conv3",
    participantName: "ScienceGeek",
    lastMessage: "That new research on Fragile X is really promising.",
    timestamp: "2 days ago",
    unreadCount: 0,
    avatarUrl: "/placeholder-user.jpg",
    isOnline: false,
    type: "direct",
  },
  {
    id: "conv4",
    participantName: "ProudPWParent",
    lastMessage: "So happy for your son's milestone!",
    timestamp: "3 days ago",
    unreadCount: 1,
    avatarUrl: "/placeholder-user.jpg",
    isOnline: false,
    type: "direct",
  },
  {
    id: "group1",
    participantName: "Sleep Support Group",
    lastMessage: "Anyone tried melatonin alternatives?",
    timestamp: "1 hour ago",
    unreadCount: 3,
    avatarUrl: "/placeholder-user.jpg",
    isOnline: true,
    type: "group",
    participants: ["SleepyParent", "RestlessNights", "MidnightMom", "You"],
    createdBy: "SleepyParent",
  },
]

interface DMInboxProps {
  onBack: () => void
  onConversationChange?: (hasConversation: boolean) => void
}

// Mock available users for group invitations
const availableUsers = [
  { id: "user1", name: "SleepyParent", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user2", name: "CFChef", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user3", name: "ScienceGeek", avatarUrl: "/placeholder-user.jpg", isOnline: false },
  { id: "user4", name: "ProudPWParent", avatarUrl: "/placeholder-user.jpg", isOnline: false },
  { id: "user5", name: "RestlessNights", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user6", name: "MidnightMom", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user7", name: "CaregiverSupport", avatarUrl: "/placeholder-user.jpg", isOnline: false },
]

export function DMInbox({ onBack, onConversationChange }: DMInboxProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null) // Start with no conversation selected for mobile
  const [messages, setMessages] = useState<Message[]>(mockMessages[selectedConversation || ""] || [])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<GroupInvitation[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation] || [])
    }
  }, [selectedConversation])

  // Notify parent about conversation selection changes
  useEffect(() => {
    if (onConversationChange) {
      onConversationChange(!!selectedConversation)
    }
  }, [selectedConversation, onConversationChange])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const message: Message = {
        id: `m${Date.now()}`,
        sender: "me",
        text: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, message])
      setNewMessage("")
      
      // Update last message in conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage.trim(), timestamp: "now" }
          : conv
      ))
    }
  }

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      const newGroupId = `group${Date.now()}`
      const newGroup: Conversation = {
        id: newGroupId,
        participantName: groupName.trim(),
        lastMessage: "Group created",
        timestamp: "now",
        unreadCount: 0,
        avatarUrl: "/placeholder-user.jpg",
        isOnline: true,
        type: "group",
        participants: ["You", ...selectedUsers],
        createdBy: "You",
      }

      // Add system message for group creation
      const systemMessage: Message = {
        id: `sys${Date.now()}`,
        sender: "system",
        text: `Group "${groupName.trim()}" has been created. Invitations sent to ${selectedUsers.join(", ")}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "system",
      }

      // Create invitations for selected users
      const newInvitations: GroupInvitation[] = selectedUsers.map(user => ({
        id: `inv${Date.now()}_${user}`,
        groupId: newGroupId,
        groupName: groupName.trim(),
        inviterId: "You",
        inviterName: "You",
        status: "pending",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }))

      setConversations(prev => [newGroup, ...prev])
      mockMessages[newGroupId] = [systemMessage]
      setPendingInvitations(prev => [...prev, ...newInvitations])
      setGroupName("")
      setSelectedUsers([])
      setShowCreateGroup(false)
      setSelectedConversation(newGroupId)
    }
  }

  const handleInviteResponse = (invitationId: string, accept: boolean) => {
    setPendingInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status: accept ? "accepted" : "declined" }
          : inv
      )
    )

    const invitation = pendingInvitations.find(inv => inv.id === invitationId)
    if (invitation) {
      const responseMessage: Message = {
        id: `resp${Date.now()}`,
        sender: "system",
        text: accept 
          ? `You joined the group "${invitation.groupName}"` 
          : `You declined the invitation to "${invitation.groupName}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "system",
      }

      if (mockMessages[invitation.groupId]) {
        mockMessages[invitation.groupId].push(responseMessage)
      }

      if (accept) {
        // If accepted, make sure the group appears in conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.id === invitation.groupId
              ? { ...conv, unreadCount: conv.unreadCount + 1 }
              : conv
          )
        )
      }
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedConversation) {
      const message: Message = {
        id: `f${Date.now()}`,
        sender: "me",
        text: `📎 Shared file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, message])
      
      // Update last message in conversations list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: `📎 ${file.name}`, timestamp: "now" }
          : conv
      ))
    }
  }

  const handleAddEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleNewMessage = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId)
    if (user) {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => 
        conv.type === "direct" && conv.participantName === user.name
      )
      
      if (existingConv) {
        setSelectedConversation(existingConv.id)
      } else {
        // Create new conversation
        const newConvId = `conv${Date.now()}`
        const newConv: Conversation = {
          id: newConvId,
          participantName: user.name,
          lastMessage: "Start a conversation",
          timestamp: "now",
          unreadCount: 0,
          avatarUrl: user.avatarUrl,
          isOnline: user.isOnline,
          type: "direct",
        }
        setConversations(prev => [newConv, ...prev])
        mockMessages[newConvId] = []
        setSelectedConversation(newConvId)
      }
      setShowNewMessageModal(false)
    }
  }

  const handleInviteToGroup = (userId: string) => {
    const user = availableUsers.find(u => u.id === userId)
    const selectedConv = conversations.find(conv => conv.id === selectedConversation)
    
    if (user && selectedConv && selectedConv.type === "group") {
      // Create invitation
      const newInvitation: GroupInvitation = {
        id: `inv${Date.now()}_${user.id}`,
        groupId: selectedConv.id,
        groupName: selectedConv.participantName,
        inviterId: "You",
        inviterName: "You",
        status: "pending",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Add system message
      const systemMessage: Message = {
        id: `sys${Date.now()}`,
        sender: "system",
        text: `Invitation sent to ${user.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "system",
      }

      setMessages(prev => [...prev, systemMessage])
      setPendingInvitations(prev => [...prev, newInvitation])
      setShowInviteModal(false)
    }
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    const action = !isMuted ? "muted" : "unmuted"
    // Here you would typically make an API call to update the mute status
    console.log(`Conversation ${action}`)
  }

  const handleLeaveGroup = () => {
    if (selectedConversation && window.confirm("Are you sure you want to leave this group?")) {
      setConversations(prev => prev.filter(conv => conv.id !== selectedConversation))
      setSelectedConversation(null)
    }
  }

  const handleBlockUser = () => {
    if (selectedConversation && window.confirm("Are you sure you want to block this user?")) {
      setConversations(prev => prev.filter(conv => conv.id !== selectedConversation))
      setSelectedConversation(null)
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv = conversations.find(conv => conv.id === selectedConversation)

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
     

      {/* Main Content */}
      <div className="flex-1 w-full flex bg-white overflow-hidden min-h-0">
        {/* Conversations Sidebar - Mobile: Full width on step 1, hidden on step 2 */}
        <div className={`${
          selectedConversation 
            ? 'hidden md:flex' // Hidden on mobile when conversation selected, visible on desktop
            : 'flex' // Always visible when no conversation selected
        } w-full md:w-80 lg:w-96 xl:w-[400px] border-r border-gray-200 flex-col bg-white min-h-0`}>
          {/* Sidebar Header */}
          <div className="p-2 sm:p-3 border-b border-gray-200 flex-shrink-0">
            {/* Back button - only show on mobile when no conversation is selected would be wrong, 
                 we want it only when conversation IS selected (on the conversation view) */}
            {/* For now, let's remove it from the conversation list entirely on mobile */}
            <div className="hidden md:block">
              <Button variant="ghost" size="sm" onClick={onBack} className="hover:bg-blue-50 p-2">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack} 
                  className="md:hidden hover:bg-blue-50 p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="flex items-center space-x-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 p-1.5">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      className="cursor-pointer text-sm"
                      onClick={() => setShowCreateGroup(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Create Group
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-sm"
                      onClick={() => setShowNewMessageModal(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      New Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full bg-gray-50 h-8 sm:h-9"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageCircle className="h-8 w-8 text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations found</h3>
                <p className="text-xs text-gray-500">Try adjusting your search or start a new message.</p>
              </div>
            ) : (
              <div className="py-1">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`flex items-center space-x-3 px-3 py-2 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedConversation === conv.id ? "bg-blue-50 border-r-3 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={conv.avatarUrl || "/placeholder-user.jpg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm">
                          {conv.type === "group" ? <Users className="h-4 w-4" /> : conv.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.type === "direct" && conv.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                      {conv.type === "group" && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                          <Users className="h-1.5 w-1.5 text-white" />
                        </div>
                      )}
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className={`text-sm font-medium truncate ${conv.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-900"}`}>
                          {conv.participantName}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{conv.timestamp}</span>
                      </div>
                      <p className={`text-xs truncate leading-tight ${conv.unreadCount > 0 ? "font-medium text-gray-700" : "text-gray-500"}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area - Mobile: Full width on step 2, partial width on desktop */}
        <div className={`${
          selectedConversation 
            ? 'flex w-full md:flex-1' // Full width on mobile when conversation selected, flex-1 on desktop
            : 'hidden md:flex md:flex-1' // Hidden on mobile when no conversation, visible on desktop
        } flex-col min-h-0`}>
          {selectedConversation && selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 p-2 sm:p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden hover:bg-white/60 p-2" 
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white shadow-md">
                        <AvatarImage src={selectedConv.avatarUrl || "/placeholder-user.jpg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {selectedConv.type === "group" ? <Users className="h-4 w-4 sm:h-5 sm:w-5" /> : selectedConv.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.type === "direct" && selectedConv.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {selectedConv.participantName}
                        {selectedConv.type === "group" && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({selectedConv.participants?.length || 0} members)
                          </span>
                        )}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {selectedConv.type === "group" 
                          ? `Group • ${selectedConv.participants?.join(", ") || ""}`
                          : selectedConv.isOnline ? "Active now" : "Offline"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {selectedConv.type === "group" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-white/60 p-2"
                        onClick={() => setShowInviteModal(true)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-white/60 p-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 sm:w-48">
                        {selectedConv.type === "group" ? (
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm"
                              onClick={() => setShowGroupInfo(true)}
                            >
                              Group Info
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm"
                              onClick={() => setShowInviteModal(true)}
                            >
                              Add Members
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm"
                              onClick={handleToggleMute}
                            >
                              {isMuted ? "Unmute" : "Mute"} Notifications
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer text-sm"
                              onClick={handleLeaveGroup}
                            >
                              Leave Group
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm"
                              onClick={() => setShowGroupInfo(true)}
                            >
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm"
                              onClick={handleToggleMute}
                            >
                              {isMuted ? "Unmute" : "Mute"} Notifications
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer text-sm"
                              onClick={handleBlockUser}
                            >
                              Block User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3 bg-gray-50/30 min-h-0">
                {messages.map((message, index) => {
                  const showAvatar = index === 0 || messages[index - 1].sender !== message.sender
                  const isConsecutive = index > 0 && messages[index - 1].sender === message.sender
                  const isMyMessage = message.sender === "me"
                  const isSystemMessage = message.type === "system"
                  
                  if (isSystemMessage) {
                    return (
                      <div key={message.id} className="flex justify-center">
                        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full max-w-md text-center">
                          {message.text}
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <div key={message.id} className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-end space-x-2 max-w-[90%] sm:max-w-[80%] lg:max-w-[75%] ${isMyMessage ? "flex-row-reverse space-x-reverse" : ""}`}>
                        {!isMyMessage && selectedConv?.type === "group" && (
                          <Avatar className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                            <AvatarImage src="/placeholder-user.jpg" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              {message.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        {!isMyMessage && selectedConv?.type === "direct" && (
                          <Avatar className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                            <AvatarImage src={selectedConv.avatarUrl || "/placeholder-user.jpg"} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              {selectedConv.participantName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col space-y-1 min-w-0">
                          {selectedConv?.type === "group" && !isMyMessage && showAvatar && (
                            <span className="text-xs text-gray-500 px-2">{message.sender}</span>
                          )}
                          <div
                            className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-2xl shadow-sm transition-all hover:shadow-md ${
                              isMyMessage
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                : "bg-white text-gray-800 border border-gray-200"
                            } ${
                              isConsecutive
                                ? isMyMessage
                                  ? "rounded-br-lg"
                                  : "rounded-bl-lg"
                                : isMyMessage
                                ? "rounded-br-none"
                                : "rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{message.text}</p>
                          </div>
                          <span
                            className={`text-xs px-2 ${
                              isMyMessage ? "text-right text-gray-500" : "text-left text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="*/*"
                />
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="pr-20 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full bg-gray-50 h-10 sm:h-11"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 hover:bg-blue-50 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4 text-gray-500" />
                      </Button>
                      <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-blue-50 rounded-full">
                            <Smile className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2">
                          <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                            {["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"].map((emoji) => (
                              <button
                                key={emoji}
                                className="p-1 hover:bg-gray-100 rounded text-lg"
                                onClick={() => handleAddEmoji(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg rounded-full h-10 w-10 sm:h-11 sm:w-11 p-0 flex-shrink-0"
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-50/30">
              <div className="text-center max-w-md">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Your Messages</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                  Send private messages to connect with community members in a safe space.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                  onClick={() => setShowNewMessageModal(true)}
                >
                  Start a New Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create Group</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCreateGroup(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name</label>
                <Input
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Members ({selectedUsers.length} selected)
                </label>
                <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                  {availableUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedUsers.includes(user.name) 
                          ? "bg-blue-50 border border-blue-200" 
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedUsers(prev => 
                          prev.includes(user.name) 
                            ? prev.filter(u => u !== user.name)
                            : [...prev, user.name]
                        )
                      }}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{user.name}</span>
                          {selectedUsers.includes(user.name) && (
                            <Check className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateGroup(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedUsers.length === 0}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Create Group
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite to Group Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Invite to Group</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowInviteModal(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {availableUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{user.name}</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-xs text-gray-500">
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => handleInviteToGroup(user.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">New Message</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowNewMessageModal(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {availableUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleNewMessage(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="text-sm font-medium">{user.name}</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <span className="text-xs text-gray-500">
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Info / Profile Modal */}
      {showGroupInfo && selectedConv && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedConv.type === "group" ? "Group Info" : "Profile"}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowGroupInfo(false)}
                  className="p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 text-center space-y-4">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={selectedConv.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                  {selectedConv.type === "group" ? <Users className="h-8 w-8" /> : selectedConv.participantName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{selectedConv.participantName}</h2>
                {selectedConv.type === "group" ? (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm text-gray-600">
                      Created by: {selectedConv.createdBy}
                    </p>
                    <p className="text-sm text-gray-600">
                      Members: {selectedConv.participants?.length || 0}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Group Members</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {selectedConv.participants?.map((member, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                                {member.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member}</span>
                            {member === selectedConv.createdBy && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Admin</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm text-gray-600">
                      Status: {selectedConv.isOnline ? "Online" : "Offline"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Member since: January 2024
                    </p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 mt-6">
                {selectedConv.type === "direct" && (
                  <>
                    <Button variant="outline" className="flex-1">
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Voice Call
                    </Button>
                  </>
                )}
                {selectedConv.type === "group" && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowInviteModal(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Members
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Invitations Notifications */}
      {pendingInvitations.filter(inv => inv.status === "pending").length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {pendingInvitations
            .filter(inv => inv.status === "pending")
            .slice(0, 3)
            .map((invitation) => (
              <div 
                key={invitation.id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">Group Invitation</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {invitation.inviterName} invited you to join "{invitation.groupName}"
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleInviteResponse(invitation.id, true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleInviteResponse(invitation.id, false)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

// Export both for backward compatibility
export function DMConversation({ onBack, onConversationChange }: { onBack: () => void; onConversationChange?: (hasConversation: boolean) => void }) {
  return <DMInbox onBack={onBack} onConversationChange={onConversationChange} />
}
