"use client"

import { CheckCheck, Bell, Check, X, Heart, MessageSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PageLayout } from '@/components/page-layout'
import { NotificationDropdown } from '@/components/notification-page'
import { useNotifications } from '@/contexts/notification-context'
import type { Notification, NotificationType } from '@/lib/api-client'

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'post_liked':
      return <Heart className="w-4 h-4 text-pink-500" />
    case 'post_comment':
    case 'comment_reply':
      return <MessageSquare className="w-4 h-4 text-blue-500" />
    case 'community_invite':
    case 'new_member':
      return <Users className="w-4 h-4 text-green-500" />
    default:
      return <Bell className="w-4 h-4 text-gray-500" />
  }
}

const getTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return time.toLocaleDateString()
}

interface MockNotificationListProps {
  notifications: Notification[]
  onNotificationClick: (notification: Notification) => void
}

const MockNotificationList = ({ notifications, onNotificationClick }: MockNotificationListProps) => {
  return (
    <Card className="shadow-lg border border-gray-200 bg-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </h3>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => onNotificationClick(notification)}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(notification.createdAt)}
                  </span>
                  <div className="flex items-center space-x-1">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Mock mark as read - in real app this would call markAsRead
                        }}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        title="Mark as read"
                      >
                        <Check className="w-3 h-3 text-blue-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Mock delete - in real app this would call deleteNotification
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                      title="Delete notification"
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Mock notifications with realistic data
const mockNotifications = [
  {
    _id: 'mock-1',
    recipient: { id: 'user-1', name: 'You', email: 'you@example.com', avatar: '/placeholder-user.jpg' },
    sender: { id: 'user-2', name: 'Sarah Mitchell', email: 'sarah@example.com', avatar: '/placeholder-user.jpg' },
    type: 'post_liked' as const,
    message: 'Sarah Mitchell liked your post about managing daily routines in the General Support community.',
    data: { postId: 'post-123', communityId: 'general-support' },
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock-2',
    recipient: { id: 'user-1', name: 'You', email: 'you@example.com', avatar: '/placeholder-user.jpg' },
    sender: { id: 'user-3', name: 'Dr. Jennifer Park', email: 'jennifer@example.com', avatar: '/placeholder-user.jpg' },
    type: 'post_comment' as const,
    message: 'Dr. Jennifer Park commented on your post about therapy techniques in Rett Syndrome Support.',
    data: { postId: 'post-456', communityId: 'rett-syndrome' },
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock-3',
    recipient: { id: 'user-1', name: 'You', email: 'you@example.com', avatar: '/placeholder-user.jpg' },
    sender: { id: 'user-4', name: 'Community Admin', email: 'admin@example.com', avatar: '/placeholder-user.jpg' },
    type: 'community_invite' as const,
    message: 'You have been invited to join the Phelan-McDermid Syndrome support community.',
    data: { communityId: 'phelan-mcdermid-syndrome' },
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock-4',
    recipient: { id: 'user-1', name: 'You', email: 'you@example.com', avatar: '/placeholder-user.jpg' },
    sender: { id: 'user-5', name: 'Michael Chen', email: 'michael@example.com', avatar: '/placeholder-user.jpg' },
    type: 'comment_reply' as const,
    message: 'Michael Chen replied to your comment about genetic testing resources.',
    data: { postId: 'post-789', communityId: 'rare-genetic-conditions' },
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock-5',
    recipient: { id: 'user-1', name: 'You', email: 'you@example.com', avatar: '/placeholder-user.jpg' },
    sender: { id: 'user-6', name: 'Lisa Rodriguez', email: 'lisa@example.com', avatar: '/placeholder-user.jpg' },
    type: 'new_member' as const,
    message: 'Lisa Rodriguez joined the General Support & Discussion community.',
    data: { communityId: 'general-support' },
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
]

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications()

  // Use mock notifications if no real notifications exist
  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications
  const displayUnreadCount = notifications.length > 0 ? unreadCount : mockNotifications.filter(n => !n.isRead).length

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        

        {/* Notifications List */}
        <div className="relative">
            {/* Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {displayNotifications.length} total
              </span>
              {displayUnreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {displayUnreadCount} unread
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {displayUnreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </Button>
            )}
          </div>
        </div>
          {notifications.length > 0 ? (
            <NotificationDropdown 
              isOpen={true} 
              onClose={() => {}} 
              onNotificationClick={(notification) => {
                // Navigate to relevant page based on notification type
                if (notification.data?.postId) {
                  window.location.href = `/post/${notification.data.postId}`
                } else if (notification.data?.communityId) {
                  window.location.href = `/community/${notification.data.communityId}`
                }
              }}
            />
          ) : (
            <MockNotificationList 
              notifications={mockNotifications}
              onNotificationClick={(notification) => {
                // Navigate to relevant page based on notification type
                if (notification.data?.postId) {
                  window.location.href = `/post/${notification.data.postId}`
                } else if (notification.data?.communityId) {
                  window.location.href = `/community/${notification.data.communityId}`
                }
              }}
            />
          )}
        </div>

        
      </div>
    </PageLayout>
  )
}
