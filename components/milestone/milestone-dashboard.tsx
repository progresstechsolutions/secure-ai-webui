"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          className="text-blue-500 transition-all duration-300 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-gray-900">{Math.round(value)}%</span>
      </div>
    </div>
  )
}

export function MilestoneDashboard({ selectedChildId }: { selectedChildId?: string }) {
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    milestoneAnalytics.trackPageView("milestone_dashboard")

    try {
      const loadedChildren = getChildren()
      const safeChildren = Array.isArray(loadedChildren) ? loadedChildren : []
      setChildren(safeChildren)
    } catch (error) {
      console.log("[v0] Error loading children:", error)
      setChildren([])
      setError("Failed to load children data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedChildId]) // Re-load when selectedChildId changes

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setTimeout(() => {
      try {
        const loadedChildren = getChildren()
        const safeChildren = Array.isArray(loadedChildren) ? loadedChildren : []
        setChildren(safeChildren)
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

  const selectedChild = selectedChildId ? children.find((c) => c.id === selectedChildId) : children[0]

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
      <Card className="border-gray-200 shadow-sm rounded-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <RingProgress
                value={childData.totalItems > 0 ? (childData.answeredItems / childData.totalItems) * 100 : 0}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {childData.currentAgeKey.toUpperCase()} Milestone Progress
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                {childData.answeredItems} of {childData.totalItems} milestones reviewed
                {childData.completedItems > 0 && (
                  <span className="text-green-600 ml-2 font-medium">• {childData.completedItems} achieved</span>
                )}
              </p>
              <Button asChild size="lg" className="min-h-[48px] px-8 bg-blue-600 hover:bg-blue-700 rounded-lg">
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
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 rounded-xl hover:border-gray-300"
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
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>{getCategoryIcon(category)}</div>
                    <span className="font-semibold capitalize text-gray-900">{category}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{remaining > 0 ? `${remaining} to go` : "Complete!"}</div>
                  <Progress
                    value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}
                    className="h-2"
                  />
                </CardContent>
              </Card>
            )
          },
        )}
      </div>

      {childData.keyItemsNotYet.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 mb-2">Consider discussing at your next visit</h4>
                <p className="text-amber-700 mb-4 leading-relaxed">
                  Some key milestones haven't been achieved yet. This is often normal, but worth mentioning to your
                  healthcare provider.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] border-amber-300 bg-white hover:bg-amber-50"
                >
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

      <Card className="border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">Helpful resources for development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              asChild
              variant="outline"
              className="min-h-[48px] justify-start border-gray-200 rounded-lg hover:bg-gray-50 bg-transparent"
            >
              <Link href={`/milestone/tips/${selectedChild.id}/${childData.currentAgeKey}`}>
                <BookOpen className="h-4 w-4 mr-3" />
                Tips for this age
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-[48px] justify-start border-gray-200 rounded-lg hover:bg-gray-50 bg-transparent"
            >
              <Link href={`/milestone/summary/${selectedChild.id}`}>
                <FileText className="h-4 w-4 mr-3" />
                View Summary
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-[48px] justify-start border-gray-200 rounded-lg hover:bg-gray-50 bg-transparent"
            >
              <Link href={`/milestone/appointments/${selectedChild.id}`}>
                <Calendar className="h-4 w-4 mr-3" />
                Appointments
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Tips for {childData.currentAgeKey.toUpperCase()} Development
          </CardTitle>
          <CardDescription className="text-gray-600">
            Activities and guidance for current age development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Social & Emotional Development</h4>
              <p className="text-blue-700 leading-relaxed">
                Encourage pretend play and help your child express emotions through words and gestures.
              </p>
            </div>
            <div className="p-5 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Language & Communication</h4>
              <p className="text-green-700 leading-relaxed">
                Read together daily and ask simple questions about pictures in books to build vocabulary.
              </p>
            </div>
            <div className="p-5 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Cognitive Development</h4>
              <p className="text-purple-700 leading-relaxed">
                Provide toys with buttons, knobs, and moving parts to encourage problem-solving skills.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="min-h-[44px] w-full border-gray-200 rounded-lg hover:bg-gray-50 bg-transparent"
            >
              <Link href={`/milestone/tips/${selectedChild.id}/${childData.currentAgeKey}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                View All Tips & Activities
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {upcomingAppointments.length > 0 && (
        <Card className="border-gray-200 shadow-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription className="text-gray-600">Next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-xs capitalize border-gray-300">
                        {appointment.type}
                      </Badge>
                      <span className="text-sm font-semibold text-gray-900">
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
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {appointment.location}
                      </p>
                    )}
                    {appointment.notes && <p className="text-sm text-gray-600 mb-3">{appointment.notes}</p>}
                    {appointment.checklistItems && appointment.checklistItems.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-flex">
                        <CheckCircle className="h-3 w-3" />
                        <span>{appointment.checklistItems.length} milestone items to discuss</span>
                      </div>
                    )}
                    {appointment.reminderSettings?.push && (
                      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-lg inline-flex mt-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Reminders enabled</span>
                      </div>
                    )}
                  </div>
                  <Button asChild variant="ghost" size="sm" className="min-h-[44px] hover:bg-gray-100 rounded-lg">
                    <Link href={`/milestone/appointments/${selectedChild.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
            {childAppointments.length > upcomingAppointments.length && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="min-h-[44px] w-full border-gray-200 rounded-lg hover:bg-gray-50 bg-transparent"
                >
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
