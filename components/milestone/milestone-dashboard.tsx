"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  CheckCircle,
  ArrowRight,
  Baby,
  Heart,
  Brain,
  Zap,
  MessageCircle,
  AlertTriangle,
  FileText,
  Users,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import {
  getChildren,
  getChecklist,
  computeChronologicalAge,
  computeCorrectedAge,
  mapToNearestAgeKey,
  getChecklistResponses,
  getAppointments,
} from "@/lib/milestone-data-layer"
import type { Child, Category } from "@/types/milestone"
import { milestoneAnalytics } from "@/lib/milestone-analytics"
import { ErrorToast } from "@/components/milestone/error-toast"

function RingProgress({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${(value / 100) * circumference} ${circumference}`

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted-foreground/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className="text-primary transition-all duration-300 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(value)}%</span>
      </div>
    </div>
  )
}

export function MilestoneDashboard() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    milestoneAnalytics.trackPageView("milestone_dashboard")

    try {
      const loadedChildren = getChildren()
      const safeChildren = Array.isArray(loadedChildren) ? loadedChildren : []
      setChildren(safeChildren)
      if (safeChildren.length > 0 && !selectedChildId) {
        setSelectedChildId(safeChildren[0].id)
      }
    } catch (error) {
      console.log("[v0] Error loading children:", error)
      setChildren([])
      setError("Failed to load children data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedChildId])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => {
      try {
        const loadedChildren = getChildren()
        const safeChildren = Array.isArray(loadedChildren) ? loadedChildren : []
        setChildren(safeChildren)
        if (safeChildren.length > 0 && !selectedChildId) {
          setSelectedChildId(safeChildren[0].id)
        }
      } catch (error) {
        setError("Failed to load children data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading milestones...</p>
        </div>
      </div>
    )
  }

  const selectedChild = children.find((c) => c.id === selectedChildId)

  if (!Array.isArray(children) || children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
          <Baby className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Welcome to Milestones</h2>
          <p className="text-muted-foreground max-w-md">
            Start tracking your child's development by adding their profile. We'll help you monitor important milestones
            and celebrate achievements.
          </p>
        </div>
        <Button asChild size="lg" className="min-h-[44px]">
          <Link href="/milestone/children">
            <Users className="h-4 w-4 mr-2" />
            Add Your Child
          </Link>
        </Button>
      </div>
    )
  }

  if (!selectedChild) return null

  const getChildData = (child: Child) => {
    console.log("[v0] Getting child data for:", child.id, child.firstName)

    const chronologicalAge = computeChronologicalAge(child.birthDate)
    const correctedAge = computeCorrectedAge(child.birthDate, child.dueDate)
    const currentAgeKey = mapToNearestAgeKey(correctedAge)

    console.log(
      "[v0] Child ages - chronological:",
      chronologicalAge,
      "corrected:",
      correctedAge,
      "ageKey:",
      currentAgeKey,
    )

    const checklist = getChecklist(currentAgeKey)
    console.log("[v0] Checklist for", currentAgeKey, ":", checklist ? "found" : "not found")

    let responses
    try {
      responses = getChecklistResponses(child.id).find((r) => r.ageKey === currentAgeKey)
      console.log("[v0] Checklist responses for child", child.id, ":", responses ? "found" : "not found")
    } catch (error) {
      console.log("[v0] Error getting checklist responses:", error)
      responses = undefined
    }

    const totalItems = checklist?.items.length || 0
    const answeredItems = responses ? Object.keys(responses.answers).length : 0
    const completedItems = responses ? Object.values(responses.answers).filter((answer) => answer === "yes").length : 0

    const categoryProgress = {
      social: { completed: 0, total: 0 },
      language: { completed: 0, total: 0 },
      cognitive: { completed: 0, total: 0 },
      movement: { completed: 0, total: 0 },
    }

    checklist?.items.forEach((item) => {
      categoryProgress[item.category].total++
      if (responses?.answers[item.id] === "yes") {
        categoryProgress[item.category].completed++
      }
    })

    const keyItemsNotYet =
      checklist?.items.filter((item) => item.isKeyItem && responses?.answers[item.id] === "not_yet") || []

    return {
      chronologicalAge,
      correctedAge,
      currentAgeKey,
      totalItems,
      answeredItems,
      completedItems,
      categoryProgress,
      keyItemsNotYet,
      isPremature: !!child.dueDate && chronologicalAge < 24,
    }
  }

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "movement":
        return <Zap className="h-4 w-4" />
      case "cognitive":
        return <Brain className="h-4 w-4" />
      case "social":
        return <Heart className="h-4 w-4" />
      case "language":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Baby className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case "movement":
        return "bg-green-100 text-green-800 border-green-200"
      case "cognitive":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "social":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "language":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatAge = (ageInMonths: number) => {
    if (ageInMonths < 12) {
      return `${ageInMonths} months`
    } else {
      const years = Math.floor(ageInMonths / 12)
      const months = ageInMonths % 12
      return months > 0 ? `${years}y ${months}m` : `${years} years`
    }
  }

  const childData = getChildData(selectedChild)

  const childAppointments = selectedChild ? getAppointments(selectedChild.id) : []
  const upcomingAppointments = childAppointments
    .filter((apt) => new Date(apt.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 2) // Show only next 2 upcoming appointments

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-4">
          <Select value={selectedChildId || ""} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[200px] min-h-[44px]" aria-label="Select child">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedChild.photoUrl || "/placeholder.svg"} alt={selectedChild.firstName} />
                    <AvatarFallback>{selectedChild.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedChild.firstName}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
                      <AvatarFallback>{child.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{child.firstName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatAge(childData.chronologicalAge)}</span>
            {childData.isPremature && (
              <Badge variant="secondary" className="text-xs">
                Corrected: {formatAge(childData.correctedAge)}
              </Badge>
            )}
          </div>
        </div>

        <Button asChild variant="outline" className="min-h-[44px] bg-transparent">
          <Link href={`/milestone/checklist/${selectedChild.id}/${childData.currentAgeKey}`}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {childData.currentAgeKey.toUpperCase()} Checklist
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <RingProgress
                value={childData.totalItems > 0 ? (childData.answeredItems / childData.totalItems) * 100 : 0}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">{childData.currentAgeKey.toUpperCase()} Milestone Progress</h3>
              <p className="text-muted-foreground mb-4">
                {childData.answeredItems} of {childData.totalItems} milestones reviewed
                {childData.completedItems > 0 && (
                  <span className="text-green-600 ml-2">• {childData.completedItems} achieved</span>
                )}
              </p>
              <Button asChild size="lg" className="min-h-[44px]">
                <Link
                  href={`/milestone/checklist/${selectedChild.id}/${childData.currentAgeKey}`}
                  onClick={() => {
                    console.log(
                      "[v0] Checklist button clicked for child:",
                      selectedChild.id,
                      "ageKey:",
                      childData.currentAgeKey,
                    )
                    console.log("[v0] Selected child data:", selectedChild)
                  }}
                >
                  {childData.answeredItems === 0 ? "Start" : "Continue"} {childData.currentAgeKey.toUpperCase()}{" "}
                  Checklist
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(childData.categoryProgress) as [Category, { completed: number; total: number }][]).map(
          ([category, progress]) => {
            const remaining = progress.total - progress.completed
            return (
              <Card
                key={category}
                className="cursor-pointer hover:shadow-md transition-shadow min-h-[44px]"
                role="button"
                tabIndex={0}
                aria-label={`View ${category} milestones`}
                onClick={() =>
                  (window.location.href = `/milestone/checklist/${selectedChild.id}/${childData.currentAgeKey}?category=${category}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    window.location.href = `/milestone/checklist/${selectedChild.id}/${childData.currentAgeKey}?category=${category}`
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded ${getCategoryColor(category)}`}>{getCategoryIcon(category)}</div>
                    <span className="font-medium capitalize text-sm">{category}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {remaining > 0 ? `${remaining} to go` : "Complete!"}
                  </div>
                  <Progress
                    value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}
                    className="h-1 mt-2"
                  />
                </CardContent>
              </Card>
            )
          },
        )}
      </div>

      {childData.keyItemsNotYet.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-amber-800 mb-1">Consider discussing at your next visit</h4>
                <p className="text-sm text-amber-700 mb-3">
                  Some key milestones haven't been achieved yet. This is often normal, but worth mentioning to your
                  healthcare provider.
                </p>
                <Button asChild variant="outline" size="sm" className="min-h-[44px] bg-transparent">
                  <Link href={`/milestone/appointments/${selectedChild.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Appointments
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Helpful resources for {selectedChild.firstName}'s development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button asChild variant="outline" className="min-h-[44px] justify-start bg-transparent">
              <Link href={`/milestone/tips/${selectedChild.id}/${childData.currentAgeKey}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Tips for this age
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px] justify-start bg-transparent">
              <Link href={`/milestone/summary/${selectedChild.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                View Summary
              </Link>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px] justify-start bg-transparent">
              <Link href={`/milestone/appointments/${selectedChild.id}`}>
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for {childData.currentAgeKey.toUpperCase()} Development</CardTitle>
          <CardDescription>Activities and guidance for {selectedChild.firstName}'s current age</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Social & Emotional Development</h4>
              <p className="text-sm text-blue-700">
                Encourage pretend play and help your child express emotions through words and gestures.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Language & Communication</h4>
              <p className="text-sm text-green-700">
                Read together daily and ask simple questions about pictures in books to build vocabulary.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Cognitive Development</h4>
              <p className="text-sm text-purple-700">
                Provide toys with buttons, knobs, and moving parts to encourage problem-solving skills.
              </p>
            </div>
            <Button asChild variant="outline" className="min-h-[44px] w-full bg-transparent">
              <Link href={`/milestone/tips/${selectedChild.id}/${childData.currentAgeKey}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                View All Tips & Activities
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {upcomingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Next appointments for {selectedChild.firstName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {appointment.type}
                      </Badge>
                      <span className="text-sm font-semibold">
                        {new Date(appointment.dateTime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(appointment.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {appointment.location && (
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                        {appointment.location}
                      </p>
                    )}
                    {appointment.notes && <p className="text-sm text-muted-foreground mb-2">{appointment.notes}</p>}
                    {appointment.checklistItems && appointment.checklistItems.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <CheckCircle className="h-3 w-3" />
                        <span>{appointment.checklistItems.length} milestone items to discuss</span>
                      </div>
                    )}
                    {appointment.reminderSettings?.push && (
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Reminders enabled</span>
                      </div>
                    )}
                  </div>
                  <Button asChild variant="ghost" size="sm" className="min-h-[44px]">
                    <Link href={`/milestone/appointments/${selectedChild.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            {childAppointments.length > upcomingAppointments.length && (
              <div className="mt-4 pt-3 border-t">
                <Button asChild variant="outline" size="sm" className="min-h-[44px] w-full bg-transparent">
                  <Link href={`/milestone/appointments/${selectedChild.id}`}>
                    View All Appointments ({childAppointments.length})
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && <ErrorToast message={error} onRetry={handleRetry} onDismiss={() => setError(null)} />}
    </div>
  )
}
