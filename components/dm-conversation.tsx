"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Smile, MoreVertical, ArrowLeft, MessageCircle, Phone, Video, Search, Plus, Edit, X, Users, UserPlus, Check, UserMinus, Bell, LogOut, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/contexts/notification-context"
import { useConversations, useMessages, useSendMessage } from "@/hooks/use-api"
import { useSocket } from "@/hooks/use-socket"
import { toast } from "@/hooks/use-toast"
import { Conversation as ApiConversation, Message as ApiMessage } from "@/lib/api-client"

/**
 * Enhanced DM Conversation component with real API integration
 * 
 * Features:
 * - ✅ Real-time messaging with Socket.IO
 * - ✅ API-integrated message sending and receiving
 * - ✅ Mobile-responsive design
 * - ✅ Rich UI with emoji picker, file uploads, etc.
 * - 🔄 Group creation, invitations (marked as TODO for backend implementation)
 * - 🔄 File uploads (basic implementation, needs backend support)
 * - 🔄 User blocking, muting (marked as TODO)
 * 
 * Replaces the previous messaging-interface.tsx component
 */

// Legacy interfaces for backwards compatibility with existing UI code
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

interface DMInboxProps {
  onBack: () => void
  onConversationChange?: (hasConversation: boolean) => void
  showSidebarHeaderOnMobile?: boolean
}

// Helper functions to convert API data to UI format
// These functions bridge the gap between the backend API structure and the existing UI components
const convertApiMessageToUIMessage = (apiMessage: ApiMessage, currentUserId: string): Message => ({
  id: apiMessage._id,
  sender: apiMessage.sender.id === currentUserId ? "me" : apiMessage.sender.name,
  text: apiMessage.content,
  timestamp: new Date(apiMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  type: apiMessage.type === "text" ? "text" : "text",
})

const convertApiConversationToUIConversation = (apiConversation: ApiConversation, currentUserId: string): Conversation => {
  const isGroup = apiConversation.type === "group"
  const otherParticipant = isGroup ? null : apiConversation.participants.find(p => p.id !== currentUserId)
  
  return {
    id: apiConversation._id,
    participantName: isGroup ? (apiConversation.name || "Group Chat") : (otherParticipant?.name || "Unknown"),
    lastMessage: apiConversation.lastMessage?.content || "No messages yet",
    timestamp: apiConversation.lastMessage 
      ? new Date(apiConversation.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "now",
    unreadCount: 0, // TODO: Calculate from readBy array
    avatarUrl: isGroup ? "/placeholder-user.jpg" : (otherParticipant?.avatar || "/placeholder-user.jpg"),
    isOnline: !isGroup, // TODO: Add real online status
    type: apiConversation.type,
    participants: isGroup ? apiConversation.participants.map(p => p.name) : undefined,
    createdBy: isGroup ? apiConversation.createdBy.name : undefined,
  }
}

// Mock available users for group invitations (TODO: Replace with real user search API)
const availableUsers = [
  { id: "user1", name: "SleepyParent", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user2", name: "CFChef", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user3", name: "ScienceGeek", avatarUrl: "/placeholder-user.jpg", isOnline: false },
  { id: "user4", name: "ProudPWParent", avatarUrl: "/placeholder-user.jpg", isOnline: false },
  { id: "user5", name: "RestlessNights", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user6", name: "MidnightMom", avatarUrl: "/placeholder-user.jpg", isOnline: true },
  { id: "user7", name: "CaregiverSupport", avatarUrl: "/placeholder-user.jpg", isOnline: false },
]

export function DMInbox({ onBack, onConversationChange, showSidebarHeaderOnMobile = true }: DMInboxProps) {
  const { addGroupInvitation, updateInvitationStatus } = useNotifications()
  
  // API hooks
  const { conversations: apiConversations, loading: loadingConversations, refetch: refetchConversations } = useConversations()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const { messages: apiMessages, loading: loadingMessages, refetch: refetchMessages } = useMessages(selectedConversation || '')
  const { sendMessage, loading: sendingMessage } = useSendMessage()
  const { connected, emit, on } = useSocket()
  
  // UI state
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Convert API data to UI format
  const currentUserId = "66b1e5c8f1d2a3b4c5d6e7f8" // TODO: Get from auth context
  const conversations: Conversation[] = apiConversations.map(conv => convertApiConversationToUIConversation(conv, currentUserId))
  const messages: Message[] = apiMessages.map(msg => convertApiMessageToUIMessage(msg, currentUserId))

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Socket.IO real-time listeners
  useEffect(() => {
    if (!connected) return

    const handleNewMessage = (data: any) => {
      if (data.conversationId === selectedConversation) {
        refetchMessages()
      }
      refetchConversations() // Update conversation list
    }

    const handleMessageUpdate = (data: any) => {
      if (data.conversationId === selectedConversation) {
        refetchMessages()
      }
    }

    on('message:new', handleNewMessage)
    on('message:updated', handleMessageUpdate)

    return () => {
      // Socket.IO listeners are automatically cleaned up
    }
  }, [connected, selectedConversation, refetchMessages, refetchConversations, on])

  // Notify parent about conversation selection changes
  useEffect(() => {
    if (onConversationChange) {
      onConversationChange(!!selectedConversation)
    }
  }, [selectedConversation, onConversationChange])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return

    try {
      // Send via API
      await sendMessage(selectedConversation, {
        content: newMessage.trim(),
        type: 'text',
      })

      // Send via Socket.IO for real-time delivery
      if (connected) {
        emit('message:new', {
          conversationId: selectedConversation,
          content: newMessage.trim(),
          type: 'text',
        })
      }

      setNewMessage("")
      
      // Refresh messages and conversations
      await refetchMessages()
      await refetchConversations()
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleCreateGroup = () => {
    // TODO: Implement group creation via API
    if (groupName.trim() && selectedUsers.length > 0) {
      toast({
        title: "Group creation",
        description: "Group creation will be implemented with the backend API.",
      })
      setGroupName("")
      setSelectedUsers([])
      setShowCreateGroup(false)
    }
  }

  const handleInviteResponse = (invitationId: string, accept: boolean) => {
    // TODO: Implement invitation response via API
    const response = accept ? "accepted" : "declined"
    updateInvitationStatus(invitationId, response)
    
    toast({
      title: accept ? "Invitation accepted" : "Invitation declined",
      description: "Real-time invitation handling will be implemented with the backend.",
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedConversation) return

    try {
      // TODO: Implement file upload via API
      await sendMessage(selectedConversation, {
        content: `📎 Shared file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        type: 'text', // TODO: Change to 'file' when file upload is implemented
      })

      // Refresh messages
      await refetchMessages()
      await refetchConversations()
    } catch (error) {
      toast({
        title: "Failed to share file",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleAddEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleNewMessage = (userId: string) => {
    // TODO: Implement new conversation creation via API
    const user = availableUsers.find(u => u.id === userId)
    if (user) {
      // Check if conversation already exists
      const existingConv = conversations.find(conv => 
        conv.type === "direct" && conv.participantName === user.name
      )
      
      if (existingConv) {
        setSelectedConversation(existingConv.id)
      } else {
        toast({
          title: "Create conversation",
          description: "New conversation creation will be implemented with the backend API.",
        })
      }
      setShowNewMessageModal(false)
    }
  }

  const handleInviteToGroup = (userId: string) => {
    // TODO: Implement group invitation via API
    const user = availableUsers.find(u => u.id === userId)
    const selectedConv = conversations.find(conv => conv.id === selectedConversation)
    
    if (user && selectedConv && selectedConv.type === "group") {
      toast({
        title: "Group invitation",
        description: "Group invitations will be implemented with the backend API.",
      })
      setShowInviteModal(false)
    }
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    const action = !isMuted ? "muted" : "unmuted"
    // TODO: Implement mute/unmute via API
    toast({
      title: `Conversation ${action}`,
      description: "Mute settings will be implemented with the backend API.",
    })
  }

  const handleLeaveGroup = () => {
    if (selectedConversation && window.confirm("Are you sure you want to leave this group?")) {
      // TODO: Implement leave group via API
      toast({
        title: "Leave group",
        description: "Group management will be implemented with the backend API.",
      })
      setSelectedConversation(null)
    }
  }

  const handleBlockUser = () => {
    if (selectedConversation && window.confirm("Are you sure you want to block this user?")) {
      // TODO: Implement block user via API
      toast({
        title: "Block user",
        description: "User blocking will be implemented with the backend API.",
      })
      setSelectedConversation(null)
    }
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv = conversations.find(conv => conv.id === selectedConversation)

  if (loadingConversations) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading conversations...</span>
      </div>
    )
  }

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
          <div className="p-3 sm:p-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBack} 
                  className="hover:bg-blue-50 p-1.5 sm:p-2 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              <div className="flex items-center">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Messages</h2>
              </div>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hover:bg-blue-50 p-1.5 sm:p-2 rounded-full">
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 sm:w-52">
                    <DropdownMenuItem 
                      className="cursor-pointer text-sm py-2.5"
                      onClick={() => setShowCreateGroup(true)}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Create Group
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-sm py-2.5"
                      onClick={() => setShowNewMessageModal(true)}
                    >
                      <Edit className="h-4 w-4 mr-3" />
                      New Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 pr-4 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-full bg-white/80 backdrop-blur-sm h-10 sm:h-12 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-md"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No conversations found</h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs">Try adjusting your search or start a new message to connect with community members.</p>
              </div>
            ) : (
              <div className="space-y-0.5 sm:space-y-1 p-1 sm:p-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-sm active:scale-[0.98] ${
                      selectedConversation === conv.id 
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 shadow-md border border-blue-100/60" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedConversation(conv.id)}
                  >
                    {/* Active indicator */}
                    {selectedConversation === conv.id && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                    )}
                    
                    <div className="relative flex-shrink-0">
                      <Avatar className={`transition-all duration-200 ring-2 ring-white shadow-lg ${
                        selectedConversation === conv.id 
                          ? "h-12 w-12 sm:h-14 sm:w-14" 
                          : "h-10 w-10 sm:h-12 sm:w-12"
                      }`}>
                        <AvatarImage src={conv.avatarUrl || "/placeholder-user.jpg"} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm sm:text-lg">
                          {conv.type === "group" ? <Users className="h-4 w-4 sm:h-5 sm:w-5" /> : conv.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Online status */}
                      {conv.type === "direct" && conv.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 bg-green-500 border-2 sm:border-3 border-white rounded-full shadow-sm"></div>
                      )}
                      
                      {/* Group indicator */}
                      {conv.type === "group" && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 bg-gradient-to-r from-blue-500 to-purple-500 border-2 sm:border-3 border-white rounded-full flex items-center justify-center shadow-sm">
                          <Users className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
                        </div>
                      )}
                      
                      {/* Unread count badge */}
                      {conv.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center min-w-[16px] sm:min-w-[20px] shadow-lg animate-pulse">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <h3 className={`font-semibold truncate transition-colors text-sm sm:text-base ${
                          conv.unreadCount > 0 
                            ? "text-gray-900" 
                            : selectedConversation === conv.id 
                              ? "text-gray-900" 
                              : "text-gray-800"
                        }`}>
                          {conv.participantName}
                          {conv.type === "group" && (
                            <span className="ml-1 sm:ml-2 text-xs bg-blue-100 text-blue-600 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                              Group
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className={`text-xs font-medium flex-shrink-0 ${
                            conv.unreadCount > 0 ? "text-blue-600" : "text-gray-500"
                          }`}>
                            {conv.timestamp}
                          </span>
                          {selectedConversation === conv.id && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className={`text-xs sm:text-sm truncate leading-relaxed ${
                          conv.unreadCount > 0 
                            ? "font-medium text-gray-700" 
                            : "text-gray-600"
                        }`}>
                          {conv.lastMessage.startsWith("📎") && (
                            <Paperclip className="inline h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-400" />
                          )}
                          {conv.lastMessage}
                        </p>
                        
                        {/* Message status indicators */}
                        <div className="flex items-center space-x-1 ml-2">
                          {conv.type === "direct" && conv.isOnline && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                          )}
                          {conv.unreadCount > 0 && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      
                      {/* Preview of conversation participants for groups */}
                      {conv.type === "group" && conv.participants && (
                        <div className="flex items-center mt-1.5 sm:mt-2 space-x-1">
                          <div className="flex -space-x-0.5 sm:-space-x-1">
                            {conv.participants.slice(0, 3).map((participant, idx) => (
                              <Avatar key={idx} className="h-4 w-4 sm:h-5 sm:w-5 ring-1 sm:ring-2 ring-white">
                                <AvatarFallback className="bg-gray-300 text-gray-600 text-xs">
                                  {participant.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {conv.participants.length > 3 && (
                              <div className="h-4 w-4 sm:h-5 sm:w-5 bg-gray-200 rounded-full flex items-center justify-center ring-1 sm:ring-2 ring-white">
                                <span className="text-xs text-gray-600 font-medium">
                                  +{conv.participants.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-1 sm:ml-2">
                            {conv.participants.length} member{conv.participants.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Hover actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                      {conv.unreadCount > 0 && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                      )}
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
              <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-b border-gray-200 p-3 sm:p-4 flex-shrink-0 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden hover:bg-white/60 p-1.5 sm:p-2 rounded-full shadow-sm" 
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white shadow-lg">
                        <AvatarImage src={selectedConv.avatarUrl || "/placeholder-user.jpg"} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm sm:text-base">
                          {selectedConv.type === "group" ? <Users className="h-4 w-4 sm:h-5 sm:w-5" /> : selectedConv.participantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.type === "direct" && selectedConv.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                        {selectedConv.participantName}
                        {selectedConv.type === "group" && (
                          <span className="text-xs sm:text-sm text-gray-500 ml-2 font-normal">
                            ({selectedConv.participants?.length || 0} members)
                          </span>
                        )}
                      </h2>
                      <p className="text-xs sm:text-sm text-green-600 font-medium truncate">
                        {selectedConv.type === "group" 
                          ? `Group • ${selectedConv.participants?.join(", ") || ""}`
                          : selectedConv.isOnline ? "Active now" : "Offline"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    {selectedConv.type === "group" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-white/60 p-1.5 sm:p-2 rounded-full shadow-sm"
                        onClick={() => setShowInviteModal(true)}
                      >
                        <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-white/60 p-1.5 sm:p-2 rounded-full shadow-sm"
                    >
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-white/60 p-1.5 sm:p-2 rounded-full shadow-sm"
                    >
                      <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-white/60 p-1.5 sm:p-2 rounded-full shadow-sm">
                          <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 sm:w-52 shadow-lg border-0 bg-white/95 backdrop-blur-lg">
                        {selectedConv.type === "group" ? (
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm py-2.5 hover:bg-blue-50 transition-colors"
                              onClick={() => setShowGroupInfo(true)}
                            >
                              <Users className="h-4 w-4 mr-3" />
                              Group Info
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm py-2.5 hover:bg-blue-50 transition-colors"
                              onClick={() => setShowInviteModal(true)}
                            >
                              <UserPlus className="h-4 w-4 mr-3" />
                              Add Members
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm py-2.5 hover:bg-blue-50 transition-colors"
                              onClick={handleToggleMute}
                            >
                              <Bell className="h-4 w-4 mr-3" />
                              {isMuted ? "Unmute" : "Mute"} Notifications
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer text-sm py-2.5 hover:bg-red-50 transition-colors"
                              onClick={handleLeaveGroup}
                            >
                              <LogOut className="h-4 w-4 mr-3" />
                              Leave Group
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer text-sm py-2.5 hover:bg-blue-50 transition-colors"
                              onClick={() => setShowGroupInfo(true)}
                            >
                              <User className="h-4 w-4 mr-3" />
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
              <div className="bg-gradient-to-r from-blue-50/30 to-purple-50/30 border-t border-gray-200 p-3 sm:p-4 flex-shrink-0 backdrop-blur-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="*/*"
                />
                <div className="flex items-end space-x-2 sm:space-x-3">
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
                      className="pr-16 sm:pr-20 text-sm sm:text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-full bg-white/80 backdrop-blur-sm h-10 sm:h-12 shadow-sm transition-all duration-200 hover:shadow-md focus:shadow-md"
                    />
                    <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-blue-50 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      </Button>
                      <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-7 sm:w-7 p-0 hover:bg-blue-50 rounded-full">
                            <Smile className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
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
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white shadow-lg hover:shadow-xl rounded-full h-10 w-10 sm:h-12 sm:w-12 p-0 flex-shrink-0 transition-all duration-200 disabled:cursor-not-allowed"
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
    </div>
  )
}

// Export both for backward compatibility
export function DMConversation({ onBack, onConversationChange, showSidebarHeaderOnMobile = true }: { onBack: () => void; onConversationChange?: (hasConversation: boolean) => void; showSidebarHeaderOnMobile?: boolean }) {
  return <DMInbox onBack={onBack} onConversationChange={onConversationChange} showSidebarHeaderOnMobile={showSidebarHeaderOnMobile} />
}
