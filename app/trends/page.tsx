"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react"
import { getChildren, getChecklistResponses, getChecklist } from "@/lib/milestone-data-layer"
import type { Child } from "@/types/milestone"
import PageWrapper from "@/components/page-wrapper"

export default function TrendsPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [milestoneProgress, setMilestoneProgress] = useState<any[]>([])
  const [developmentalTrends, setDevelopmentalTrends] = useState<any[]>([])
  const [improvementAreas, setImprovementAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChildrenData()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      loadChildTrends()
    }
  }, [selectedChild])

  const loadChildrenData = async () => {
    try {
      const childrenData = getChildren()
      setChildren(childrenData || [])
      if (childrenData && childrenData.length > 0) {
        setSelectedChild(childrenData[0])
      }
    } catch (error) {
      console.error("Error loading children data:", error)
    }
  }

  const loadChildTrends = async () => {
    if (!selectedChild) return

    setLoading(true)
    try {
      const responses = getChecklistResponses(selectedChild.id)
      const ageKeys = ["2m", "4m", "6m", "9m", "1y", "15m", "18m", "2y", "30m", "3y", "4y", "5y"]

      const progressData = []
      const trendsData = []
      const improvementData = []

      for (const ageKey of ageKeys) {
        const checklist = getChecklist(ageKey)
        if (checklist) {
          const childResponses = responses.filter((r) => r.ageKey === ageKey)
          const totalItems = checklist.items.length
          const completedItems = childResponses.filter((r) => r.response === "yes").length
          const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

          progressData.push({
            ageKey,
            age: checklist.title,
            progress: progressPercent,
            completed: completedItems,
            total: totalItems,
            date: new Date().toISOString(), // Mock date for now
          })

          // Identify areas needing improvement
          const notYetItems = childResponses.filter((r) => r.response === "not_yet")
          if (notYetItems.length > 0) {
            improvementData.push({
              ageKey,
              age: checklist.title,
              items: notYetItems.map((r) => {
                const item = checklist.items.find((i) => i.id === r.milestoneId)
                return item ? item.description : "Unknown milestone"
              }),
              priority: notYetItems.length > 3 ? "high" : notYetItems.length > 1 ? "medium" : "low",
            })
          }
        }
      }

      setMilestoneProgress(progressData)
      setDevelopmentalTrends(progressData.slice(-6)) // Last 6 assessments
      setImprovementAreas(improvementData)
    } catch (error) {
      console.error("Error loading child trends:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportTrendsReport = () => {
    if (!selectedChild) return

    const reportData = {
      child: {
        name: selectedChild.firstName,
        birthDate: selectedChild.birthDate,
        correctedAge: selectedChild.dueDate ? "Yes" : "No",
      },
      milestoneProgress,
      developmentalTrends,
      improvementAreas,
      generatedDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedChild.firstName}-developmental-trends-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing developmental trends...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (children.length === 0) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Child Development Trends</h1>
          <p className="text-gray-600 mb-8">
            No children profiles found. Add a child profile to start tracking developmental trends.
          </p>
          <Button asChild>
            <a href="/milestone/children">Add Child Profile</a>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Child Development Trends</h1>
            <p className="text-gray-600 mt-1">Track developmental progress and identify areas for improvement</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedChild?.id || ""}
              onValueChange={(value) => {
                const child = children.find((c) => c.id === value)
                setSelectedChild(child || null)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportTrendsReport} variant="outline">
              Export Report
            </Button>
          </div>
        </div>

        {selectedChild && (
          <>
            {/* Child Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {selectedChild.firstName}'s Development Overview
                </CardTitle>
                <CardDescription>
                  Born: {new Date(selectedChild.birthDate).toLocaleDateString()}
                  {selectedChild.dueDate && <span className="ml-2 text-blue-600">(Corrected age considered)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {milestoneProgress.length > 0
                        ? Math.round(milestoneProgress[milestoneProgress.length - 1]?.progress || 0)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600">Latest Assessment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{milestoneProgress.length}</div>
                    <div className="text-sm text-gray-600">Assessments Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{improvementAreas.length}</div>
                    <div className="text-sm text-gray-600">Areas to Focus On</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestone Progress Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Milestone Progress Timeline
                </CardTitle>
                <CardDescription>Developmental progress across different age milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestoneProgress.map((milestone, index) => (
                    <div key={milestone.ageKey} className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium">{milestone.age}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">
                            {milestone.completed}/{milestone.total} milestones
                          </span>
                          <span className="text-sm font-medium">{Math.round(milestone.progress)}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                      <div className="w-8">
                        {milestone.progress >= 75 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : milestone.progress >= 50 ? (
                          <TrendingUp className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            {improvementAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                  <CardDescription>Milestones that may need additional focus and support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {improvementAreas.map((area, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{area.age} Milestones</h4>
                          <Badge
                            variant={
                              area.priority === "high"
                                ? "destructive"
                                : area.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {area.priority} priority
                          </Badge>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {area.items.slice(0, 3).map((item: string, itemIndex: number) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              {item}
                            </li>
                          ))}
                          {area.items.length > 3 && (
                            <li className="text-gray-500 italic">+{area.items.length - 3} more milestones</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Developmental Recommendations</CardTitle>
                <CardDescription>Suggested activities and next steps based on current progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Continue Strengths</h4>
                    <p className="text-sm text-blue-800">
                      Keep practicing activities in areas where {selectedChild.firstName} is progressing well.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Schedule Check-up</h4>
                    <p className="text-sm text-green-800">
                      Consider discussing progress with your pediatrician at the next visit.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900 mb-2">Focus Areas</h4>
                    <p className="text-sm text-orange-800">
                      Spend extra time on activities that support areas needing improvement.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Track Progress</h4>
                    <p className="text-sm text-purple-800">
                      Regular milestone assessments help monitor developmental progress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageWrapper>
  )
}
