"use client"

import { ThemeProvider } from "./theme-provider"
import { NotificationProvider } from "../contexts/notification-context"
import { AuthProvider } from "../contexts/auth-context"
import { ChildProfileProvider } from "../contexts/child-profile-context"
import { DocumentProvider } from "../contexts/document-context"
import { Toaster } from "./ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  )
} 