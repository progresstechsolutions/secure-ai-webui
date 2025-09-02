"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { getChild } from "@/lib/milestone-data-layer"

interface RouteGuardProps {
  childId: string
  children: React.ReactNode
}

const checkChildExists = async (childId: string): Promise<boolean> => {
  try {
    const child = getChild(childId)
    return !!child
  } catch (error) {
    console.error("Error checking child exists:", error)
    return false
  }
}

const getChildName = (childId: string): string => {
  try {
    const child = getChild(childId)
    return child?.firstName || "Child"
  } catch (error) {
    console.error("Error getting child name:", error)
    return "Child"
  }
}

export function RouteGuard({ childId, children }: RouteGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [childExists, setChildExists] = useState(false)
  const [childName, setChildName] = useState("")
  const router = useRouter()

  useEffect(() => {
    const validateChild = async () => {
      try {
        setIsLoading(true)
        const exists = await checkChildExists(childId)

        if (exists) {
          setChildExists(true)
          setChildName(getChildName(childId))
        } else {
          setChildExists(false)
        }
      } catch (error) {
        console.error("Error validating child:", error)
        setChildExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (childId) {
      validateChild()
    } else {
      setIsLoading(false)
      setChildExists(false)
    }
  }, [childId])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading child profile...</p>
        </div>
      </div>
    )
  }

  // Show error state if child doesn't exist
  if (!childExists) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Child Profile Not Found</h3>
                <p className="text-muted-foreground">
                  The child profile you're looking for doesn't exist or may have been removed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href="/milestone">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/milestone/children">
                    <Users className="h-4 w-4 mr-2" />
                    View All Children
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Child exists, render the protected content
  return <>{children}</>
}
