"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function MilestoneError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Milestone page error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background">
      <div className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Something went wrong</h3>
                    <p className="text-muted-foreground">
                      We encountered an error while loading the milestone data. Please try again.
                    </p>
                    {error.digest && <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <Button asChild>
                      <Link href="/milestone">
                        <Home className="h-4 w-4 mr-2" />
                        Go to Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
