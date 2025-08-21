"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Child {
  id: string
  name: string
  age: number
  dateOfBirth: string
  gender: "male" | "female" | "other" | "prefer-not-to-say"
  avatar?: string
  allergies?: string[]
  conditions?: string[]
  medications?: string[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
  stats?: {
    totalDocuments: number
  }
}

interface ChildProfileContextType {
  children: Child[]
  activeChild: Child | null
  addChild: (child: Omit<Child, "id">) => Child
  updateChild: (id: string, updates: Partial<Child>) => void
  deleteChild: (id: string) => void
  setActiveChild: (child: Child | null) => void
}

const ChildProfileContext = createContext<ChildProfileContextType | undefined>(undefined)

export function ChildProfileProvider({ children }: { children: ReactNode }) {
  const [childrenList, setChildrenList] = useState<Child[]>([
    {
      id: "child-1",
      name: "Emma Johnson",
      age: 8,
      dateOfBirth: "2015-03-15",
      gender: "female",
      avatar: "/placeholder-user.jpg",
      allergies: ["Peanuts", "Shellfish"],
      conditions: ["Asthma"],
      medications: ["Albuterol inhaler"],
      emergencyContact: {
        name: "Sarah Johnson",
        relationship: "Mother",
        phone: "(555) 123-4567",
        email: "sarah.johnson@email.com",
      },
      stats: {
        totalDocuments: 12,
      },
    },
    {
      id: "child-2",
      name: "Liam Johnson",
      age: 5,
      dateOfBirth: "2018-07-22",
      gender: "male",
      avatar: "/placeholder-user.jpg",
      allergies: ["Dairy"],
      conditions: [],
      medications: [],
      emergencyContact: {
        name: "Sarah Johnson",
        relationship: "Mother",
        phone: "(555) 123-4567",
        email: "sarah.johnson@email.com",
      },
      stats: {
        totalDocuments: 8,
      },
    },
  ])
  const [activeChild, setActiveChild] = useState<Child | null>(childrenList[0])

  const addChild = (child: Omit<Child, "id">) => {
    const newChild: Child = {
      ...child,
      id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setChildrenList((prev) => [...prev, newChild])
    return newChild
  }

  const updateChild = (id: string, updates: Partial<Child>) => {
    setChildrenList((prev) => prev.map((child) => (child.id === id ? { ...child, ...updates } : child)))
  }

  const deleteChild = (id: string) => {
    setChildrenList((prev) => prev.filter((child) => child.id !== id))
    if (activeChild?.id === id) {
      setActiveChild(null)
    }
  }

  const value = {
    children: childrenList,
    activeChild,
    addChild,
    updateChild,
    deleteChild,
    setActiveChild,
  }

  return <ChildProfileContext.Provider value={value}>{children}</ChildProfileContext.Provider>
}

export function useChildProfile() {
  const context = useContext(ChildProfileContext)
  if (context === undefined) {
    throw new Error("useChildProfile must be used within a ChildProfileProvider")
  }
  return context
}
