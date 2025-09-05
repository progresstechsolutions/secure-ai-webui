"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { apiClient } from '@/lib/api-client'
import type { Notification, NotificationResponse } from '@/lib/api-client'

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

interface NotificationContextType {
  // Legacy group invitations
  groupInvitations: GroupInvitation[]
  addGroupInvitation: (invitation: GroupInvitation) => void
  updateInvitationStatus: (invitationId: string, status: 'accepted' | 'declined') => void
  pendingInvitationsCount: number
  
  // New notification system
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  
  // New notification actions
  fetchNotifications: (reset?: boolean) => Promise<void>
  loadMore: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock initial invitations
const mockGroupInvitations: GroupInvitation[] = [
  {
    id: "inv1",
    groupId: "group1",
    groupName: "CF Support Network",
    invitedBy: "SleepyParent",
    invitedById: "user1",
    invitedUser: "You",
    invitedUserId: "current-user",
    timestamp: "2025-07-30T16:00:00.000Z",
    status: "pending"
  },
  {
    id: "inv2",
    groupId: "new-group",
    groupName: "Research Updates",
    invitedBy: "ScienceGeek",
    invitedById: "user3",
    invitedUser: "You",
    invitedUserId: "current-user",
    timestamp: "2025-07-30T12:00:00.000Z",
    status: "pending"
  }
]

interface NotificationProviderProps {
  children: ReactNode
  userId?: string
}

export function NotificationProvider({ children, userId }: NotificationProviderProps) {
  // Legacy group invitations state
  const [groupInvitations, setGroupInvitations] = useState<GroupInvitation[]>(mockGroupInvitations)
  
  // New notification system state
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // Legacy group invitation methods
  const addGroupInvitation = (invitation: GroupInvitation) => {
    setGroupInvitations(prev => [invitation, ...prev])
  }

  const updateInvitationStatus = (invitationId: string, status: 'accepted' | 'declined') => {
    setGroupInvitations(prev => 
      prev.map(inv => 
        inv.id === invitationId 
          ? { ...inv, status }
          : inv
      )
    )
  }

  const pendingInvitationsCount = groupInvitations.filter(inv => inv.status === 'pending').length

  // New notification methods
  const fetchNotifications = useCallback(async (reset = false) => {
    if (!userId) return
    
    const targetPage = reset ? 1 : currentPage
    const loadingState = reset ? setIsLoading : setIsLoadingMore
    
    loadingState(true)
    
    try {
      const response = await apiClient.getNotifications({
        page: targetPage,
        limit: 20
      })

      if (response.data) {
        const newNotifications = response.data.notifications
        
        if (reset) {
          setNotifications(newNotifications)
          setCurrentPage(1)
        } else {
          setNotifications(prev => [...prev, ...newNotifications])
        }
        
        setUnreadCount(response.data.unreadCount)
        setHasMore(response.data.pagination.currentPage < response.data.pagination.totalPages)
        
        if (!reset) {
          setCurrentPage(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      loadingState(false)
    }
  }, [userId, currentPage])

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return
    await fetchNotifications(false)
  }, [hasMore, isLoadingMore, fetchNotifications])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiClient.markNotificationAsRead(notificationId)
      
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.markAllNotificationsAsRead()
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      )
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await apiClient.deleteNotification(notificationId)
      
      const notification = notifications.find(n => n._id === notificationId)
      
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      )
      
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }, [notifications])

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) return
    
    try {
      const response = await apiClient.getUnreadNotificationCount()
      if (response.data) {
        setUnreadCount(response.data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to refresh unread count:', error)
    }
  }, [userId])

  // Initial load and setup polling
  useEffect(() => {
    if (!userId) return

    fetchNotifications(true)

    const interval = setInterval(() => {
      refreshUnreadCount()
    }, 30000)

    return () => clearInterval(interval)
  }, [userId, fetchNotifications, refreshUnreadCount])

  const value = {
    // Legacy group invitations
    groupInvitations,
    addGroupInvitation,
    updateInvitationStatus,
    pendingInvitationsCount,
    
    // New notification system
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshUnreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export type { GroupInvitation }
