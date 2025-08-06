"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

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
  groupInvitations: GroupInvitation[]
  addGroupInvitation: (invitation: GroupInvitation) => void
  updateInvitationStatus: (invitationId: string, status: 'accepted' | 'declined') => void
  pendingInvitationsCount: number
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

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [groupInvitations, setGroupInvitations] = useState<GroupInvitation[]>(mockGroupInvitations)

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

  const value = {
    groupInvitations,
    addGroupInvitation,
    updateInvitationStatus,
    pendingInvitationsCount
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
