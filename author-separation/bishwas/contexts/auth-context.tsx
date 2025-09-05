"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email?: string | null
  name?: string | null
  username: string
  image?: string | null
  healthConditions: string[]
  location: {
    region: string
    state?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize with mock user for demo
    const mockUser: User = {
      id: "current-user",
      email: "user@example.com",
      name: "Current User",
      username: "current_user",
      image: "/placeholder-user.jpg",
      healthConditions: ["Phelan-McDermid Syndrome"],
      location: {
        region: "United States",
        state: "California"
      }
    }
    
    setUser(mockUser)
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
