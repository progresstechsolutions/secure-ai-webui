"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "./theme-provider"
import { NotificationProvider } from "../contexts/notification-context"
import { ChildProfileProvider } from "../contexts/child-profile-context"
import { DocumentProvider } from "../contexts/document-context"
import { Toaster } from "./ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>
        <ChildProfileProvider>
          <DocumentProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </DocumentProvider>
        </ChildProfileProvider>
      </NotificationProvider>
    </SessionProvider>
  )
} 