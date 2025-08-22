"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./theme-provider"
import { NotificationProvider } from "../contexts/notification-context"
import { Toaster } from "./ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </NotificationProvider>
    </SessionProvider>
  )
} 