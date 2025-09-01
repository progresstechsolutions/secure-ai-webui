"use client"

import { useState } from 'react'
import { Bell, Check, X, Heart, MessageSquare, Users, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
    case 'join_request_accepted':
    case 'join_request_rejected':
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

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onClick?: (notification: Notification) => void
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification._id)
    }
    onClick?.(notification)
  }

  return (
    <div
      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
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
                    onMarkAsRead(notification._id)
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
                  onDelete(notification._id)
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
  )
}

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  onNotificationClick?: (notification: Notification) => void
}

export const NotificationDropdown = ({ 
  isOpen, 
  onClose, 
  onNotificationClick 
}: NotificationDropdownProps) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications()

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] z-50">
      <Card className="shadow-lg border border-gray-200 bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                You'll see updates about your posts and communities here
              </p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onClick={onNotificationClick}
                />
              ))}
              
              {/* Load more button */}
              {hasMore && (
                <div className="p-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="w-full"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

interface NotificationBellProps {
  onNotificationClick?: (notification: Notification) => void
  className?: string
}

export const NotificationBell = ({ 
  onNotificationClick, 
  className = "" 
}: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNotificationClick={(notification) => {
          setIsOpen(false)
          onNotificationClick?.(notification)
        }}
      />

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default NotificationBell
