"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Users,
  Check,
  X,
  Clock
} from "lucide-react"

interface GroupInvitation {
  id: string
  groupId: string
  groupName: string
  invitedBy: string
  invitedById: string
  invitedUser: string
  invitedUserId: string
  timestamp: string
  status: 'pending' | 'accepted' | 'declined'
}

interface GroupInvitationNotificationsProps {
  invitations: GroupInvitation[]
  onInvitationResponse: (invitationId: string, response: 'accepted' | 'declined') => void
}

export function GroupInvitationNotifications({ 
  invitations, 
  onInvitationResponse 
}: GroupInvitationNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const pendingInvitations = invitations.filter(inv => inv.status === 'pending')
  
  const formatTime = (timestamp: string) => {
    const now = new Date()
    const inviteTime = new Date(timestamp)
    const diffMs = now.getTime() - inviteTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return inviteTime.toLocaleDateString()
  }

  const handleResponse = (invitationId: string, response: 'accepted' | 'declined') => {
    onInvitationResponse(invitationId, response)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {pendingInvitations.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {pendingInvitations.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 max-h-96 overflow-y-auto"
        sideOffset={8}
      >
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Notifications</h3>
          {pendingInvitations.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {pendingInvitations.length} pending invitation{pendingInvitations.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        {invitations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className={`p-3 border-b border-gray-100 last:border-b-0 ${
                  invitation.status === 'pending' ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {invitation.invitedBy}
                      </span>
                      <span className="text-gray-600">
                        {' '}invited you to join{' '}
                      </span>
                      <span className="font-medium text-blue-600">
                        {invitation.groupName}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTime(invitation.timestamp)}
                      </span>
                      {invitation.status !== 'pending' && (
                        <Badge 
                          variant={invitation.status === 'accepted' ? 'default' : 'secondary'}
                          className="text-xs ml-2"
                        >
                          {invitation.status}
                        </Badge>
                      )}
                    </div>
                    
                    {invitation.status === 'pending' && (
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleResponse(invitation.id, 'accepted')}
                          className="h-7 text-xs bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResponse(invitation.id, 'declined')}
                          className="h-7 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {invitations.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs text-gray-600 hover:text-gray-900"
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
