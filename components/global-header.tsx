"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Heart, Users, User, MessageSquare, Settings, Search, Bell } from "lucide-react"
import { GroupInvitationNotifications } from "./group-invitation-notifications"
import { useNotifications } from "../contexts/notification-context"

interface GlobalHeaderProps {
  user?: any
  currentPage?: string
  showSearch?: boolean
  onSearchToggle?: () => void
  showOnMobile?: boolean // New prop to control mobile visibility
}

export function GlobalHeader({ user, currentPage, showSearch = false, onSearchToggle, showOnMobile = true }: GlobalHeaderProps) {
  const router = useRouter()
  const { groupInvitations, updateInvitationStatus } = useNotifications()

  return (
    <header className={`bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 shadow-sm ${showOnMobile ? '' : 'hidden md:block'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push("/dashboard")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Caregene</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Your support community</p>
              </div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
           
            
            <Button
              variant="ghost"
              size="sm"
              className={`text-gray-600 hover:text-blue-600 px-4 py-2 ${
                currentPage === 'communities' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => router.push("/communities")}
            >
              <Users className="h-4 w-4 mr-2" />
              Communities
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={`text-gray-600 hover:text-blue-600 px-4 py-2 ${
                currentPage === 'messages' ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => router.push("/messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>

            

            {/* Notifications */}
            <GroupInvitationNotifications 
              invitations={groupInvitations}
              onInvitationResponse={updateInvitationStatus}
            />

            {/* Profile Menu */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                className={`text-gray-600 hover:text-blue-600 px-3 py-2 ${
                  currentPage === 'profile' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`text-gray-600 hover:text-blue-600 px-3 py-2 ${
                  currentPage === 'settings' ? 'bg-blue-50 text-blue-600' : ''
                }`}
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/profile")}
              className="p-2"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
