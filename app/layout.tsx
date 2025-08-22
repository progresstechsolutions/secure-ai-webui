import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "../components/providers"

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
