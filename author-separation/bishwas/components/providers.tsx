"use client"

import { NotificationProvider } from "@/contexts/notification-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}
