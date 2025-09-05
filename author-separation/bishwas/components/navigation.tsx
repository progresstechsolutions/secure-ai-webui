"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Users, 
  MessageCircle, 
  Settings, 
  Plus,
  Bell,
  Search,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentView: string
  onNavigate: (view: string, data?: any) => void
}

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    description: 'Community home'
  },
  {
    id: 'feed',
    label: 'Community Feed',
    icon: Users,
    description: 'Latest posts and discussions'
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: MessageCircle,
    description: 'Direct messages'
  },
  {
    id: 'communities',
    label: 'Communities',
    icon: UserPlus,
    description: 'Join or create communities'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Recent activity'
  }
]

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-700 border border-blue-200" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-blue-600" : "text-gray-500"
              )} />
              <div className="flex-1">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button 
          onClick={() => onNavigate('create-post')} 
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
        
        <Button 
          onClick={() => onNavigate('create-community')} 
          variant="outline"
          className="w-full"
          size="sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </div>
    </div>
  )
}
