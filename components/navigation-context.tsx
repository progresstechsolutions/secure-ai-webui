"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface NavigationContextType {
  isPinned: boolean
  setIsPinned: (pinned: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isPinned, setIsPinned] = useState(false)

  return <NavigationContext.Provider value={{ isPinned, setIsPinned }}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
