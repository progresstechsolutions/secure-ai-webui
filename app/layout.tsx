import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from "@/contexts/notification-context"
>>>>>>> origin/Bishwas

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
<<<<<<< HEAD
      title: "HealthBinder - Patient Management",
  description: "Manage your children's medical document profiles",
    generator: 'v0.dev'
=======
  title: "Caregene",
  description: "A community platform for rare genetic conditions",
  generator: 'v0.dev'
>>>>>>> origin/Bishwas
}

export default function RootLayout({
  children,
<<<<<<< HEAD
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
=======
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
>>>>>>> origin/Bishwas
    </html>
  )
}
