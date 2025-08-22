import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "../components/ui/toaster"
import { NotificationProvider } from "../contexts/notification-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Secure AI WebUI",
  description: "A modern web interface for secure document analysis and AI chat",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-background text-foreground"}>
        <SessionProvider>
          <NotificationProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
