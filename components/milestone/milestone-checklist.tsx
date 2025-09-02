"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, ChevronDown, ChevronUp, Play, Bookmark, Calendar, FileText, Info } from "lucide-react"
import { milestoneStore } from "@/lib/milestone-data-layer"
import { offlineManager } from "@/lib/offline-manager"
import { milestoneAnalytics } from "@/lib/milestone-analytics"
import { ErrorToast } from "@/components/milestone/error-toast"
import type { Child, Checklist, ChecklistResponse } from "@/types/milestone"

interface MilestoneChecklistProps {
  childId: string
  ageKey: string
}

export function MilestoneChecklist({ childId, ageKey }: MilestoneChecklistProps) {
  const router = useRouter()
  const [child, setChild] = useState<Child | null>(null)
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [responses, setResponses] = useState<Record<string, ChecklistResponse>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({})
  const [showMediaModal, setShowMediaModal] = useState<{ url: string; alt: string; caption?: string } | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    milestoneAnalytics.trackChecklistStart(childId, ageKey)
    milestoneAnalytics.trackPageView("milestone_checklist", childId, ageKey)

    console.log("[v0] Loading checklist for childId:", childId, "ageKey:", ageKey)

    const childData = milestoneStore.getChild(childId)
    console.log("[v0] Child data found:", childData)

    if (!childData) {
      console.log("[v0] Child not found, redirecting to children page")
      router.push("/milestone/children")
      return
    }
    setChild(childData)

    const checklistData = milestoneStore.getChecklist(ageKey as any)
    console.log("[v0] Checklist data found:", checklistData)

    if (checklistData) {
      setChecklist(checklistData)
      const existingResponses = milestoneStore.getChecklistResponses(childId)
      const ageResponses = existingResponses.find((r) => r.ageKey === ageKey)
      if (ageResponses) {
        const responseMap: Record<string, ChecklistResponse> = {}
        Object.entries(ageResponses.answers).forEach(([itemId, answer]) => {
          responseMap[itemId] = {
            itemId,
            answer: answer as "yes" | "not_yet" | "not_sure",
            note: ageResponses.notes?.[itemId] || "",
            timestamp: new Date().toISOString(),
          }
        })
        setResponses(responseMap)
      }
    }
  }, [childId, ageKey, router])

  const updateResponse = async (itemId: string, answer: "yes" | "not_yet" | "not_sure", note?: string) => {
    const newResponse: ChecklistResponse = {
      itemId,
      answer,
      note: note || responses[itemId]?.note || "",
      timestamp: new Date().toISOString(),
    }

    setOptimisticUpdates((prev) => ({ ...prev, [itemId]: true }))
    setResponses((prev) => ({ ...prev, [itemId]: newResponse }))

    setIsSaving(true)
    try {
      if (!navigator.onLine) {
        offlineManager.queueAction({
          type: "update",
          entity: "checklist",
          data: { childId, ageKey, itemId, response: newResponse },
        })
      } else {
        await milestoneStore.saveChecklistResponse(childId, ageKey, itemId, newResponse)
      }

      setTimeout(() => {
        setOptimisticUpdates((prev) => {
          const updated = { ...prev }
          delete updated[itemId]
          return updated
        })
      }, 500)
    } catch (error) {
      console.error("Failed to save response:", error)
      setError("Failed to save response. It will be retried automatically.")
      offlineManager.queueAction({
        type: "update",
        entity: "checklist",
        data: { childId, ageKey, itemId, response: newResponse },
      })

      setResponses((prev) => {
        const updated = { ...prev }
        delete updated[itemId]
        return updated
      })
      setOptimisticUpdates((prev) => {
        const updated = { ...prev }
        delete updated[itemId]
        return updated
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateNote = async (itemId: string, note: string) => {
    const existingResponse = responses[itemId]
    if (!existingResponse) return

    const updatedResponse = { ...existingResponse, note, timestamp: new Date().toISOString() }
    setResponses((prev) => ({ ...prev, [itemId]: updatedResponse }))

    try {
      await milestoneStore.saveChecklistResponse(childId, ageKey, itemId, updatedResponse)
    } catch (error) {
      console.error("Failed to save note:", error)
    }
  }

  const getProgress = () => {
    if (!checklist) return { answered: 0, total: 0, percentage: 0 }

    const total = checklist.items.length
    const answered = Object.keys(responses).length
    return { answered, total, percentage: total > 0 ? (answered / total) * 100 : 0 }
  }

  const getFilteredItems = () => {
    if (!checklist) return []
    if (selectedCategory === "all") return checklist.items
    return checklist.items.filter((item) => item.category === selectedCategory)
  }

  const getResults = () => {
    if (!checklist) return { met: [], notYet: [], notSure: [] }

    const met = checklist.items.filter((item) => responses[item.id]?.answer === "yes")
    const notYet = checklist.items.filter((item) => responses[item.id]?.answer === "not_yet")
    const notSure = checklist.items.filter((item) => responses[item.id]?.answer === "not_sure")

    return { met, notYet, notSure }
  }

  const isBetweenAges = () => {
    if (!child) return false
    const currentAge = milestoneStore.calculateAge(child.birthDate, child.dueDate)
    return currentAge.ageKey !== ageKey
  }

  const finishChecklist = () => {
    const results = getResults()
    milestoneAnalytics.trackChecklistComplete(childId, ageKey, {
      total: progress.total,
      met: results.met.length,
      notYet: results.notYet.length,
      notSure: results.notSure.length,
    })

    setShowResultsModal(true)
  }

  if (!child || !checklist) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checklist...</p>
        </div>
      </div>
    )
  }

  const progress = getProgress()
  const filteredItems = getFilteredItems()
  const categories = [...new Set(checklist.items.map((item) => item.category))]
  const allAnswered = progress.answered === progress.total
  const results = getResults()

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="min-h-[44px] min-w-[44px]"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-semibold">{ageKey.replace("-", " to ")} Checklist</h1>
                <p className="text-sm text-muted-foreground">{child.firstName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium" aria-live="polite">
                  {progress.answered}/{progress.total}
                </div>
                <div className="text-xs text-muted-foreground">completed</div>
              </div>
              <Progress
                value={progress.percentage}
                className="w-20 h-2"
                aria-label={`Progress: ${progress.answered} of ${progress.total} items completed`}
              />
              {isSaving && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-live="polite">
                  <Save className="h-3 w-3 animate-pulse" />
                  Saving...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {isBetweenAges() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Between Ages</p>
                <p className="text-sm text-blue-700">We use the earlier age checklist until the next milestone age.</p>
              </div>
            </div>
          </div>
        )}

        {child.dueDate && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Corrected Age
              </Badge>
              <span className="text-sm text-purple-700">Using corrected age for premature development tracking</span>
              <button
                className="text-purple-600 hover:text-purple-800 ml-auto"
                aria-label="Learn more about corrected age"
                title="Corrected age accounts for premature birth when tracking development"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Category filters">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="min-h-[44px]"
            role="tab"
            aria-selected={selectedCategory === "all"}
          >
            All ({checklist.items.length})
          </Button>
          {categories.map((category) => {
            const count = checklist.items.filter((item) => item.category === category).length
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="min-h-[44px] capitalize"
                role="tab"
                aria-selected={selectedCategory === category}
              >
                {category} ({count})
              </Button>
            )
          })}
        </div>

        <div className="space-y-4" role="main">
          {filteredItems.map((item) => {
            const response = responses[item.id]
            const isExpanded = expandedNotes[item.id]
            const isOptimistic = optimisticUpdates[item.id]

            return (
              <Card
                key={item.id}
                className={`overflow-hidden transition-all ${isOptimistic ? "ring-2 ring-primary/20" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium leading-tight">{item.label}</h3>
                          {item.helpText && <p className="text-sm text-muted-foreground mt-1">{item.helpText}</p>}
                          {item.isKeyItem && (
                            <Badge variant="outline" className="mt-2 border-amber-300 text-amber-700">
                              Key Milestone
                            </Badge>
                          )}
                        </div>

                        {item.mediaUrl && (
                          <button
                            onClick={() =>
                              setShowMediaModal({
                                url: item.mediaUrl!,
                                alt: item.mediaAlt || item.label,
                                caption: item.helpText,
                              })
                            }
                            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative group"
                            aria-label={`View example video or image for ${item.label}`}
                          >
                            <img
                              src={item.mediaUrl || "/placeholder.svg?height=64&width=64"}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2" role="radiogroup" aria-labelledby={`item-${item.id}-label`}>
                      <span id={`item-${item.id}-label`} className="sr-only">
                        {item.label}
                      </span>
                      <Button
                        variant={response?.answer === "yes" ? "default" : "outline"}
                        size="lg"
                        onClick={() => updateResponse(item.id, "yes")}
                        className={`flex-1 min-h-[44px] transition-all ${
                          response?.answer === "yes"
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                            : "hover:bg-green-50 hover:border-green-300"
                        }`}
                        disabled={isSaving}
                        role="radio"
                        aria-checked={response?.answer === "yes"}
                        aria-label={`Mark ${item.label} as Yes`}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={response?.answer === "not_yet" ? "default" : "outline"}
                        size="lg"
                        onClick={() => updateResponse(item.id, "not_yet")}
                        className={`flex-1 min-h-[44px] transition-all ${
                          response?.answer === "not_yet"
                            ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                            : "hover:bg-orange-50 hover:border-orange-300"
                        }`}
                        disabled={isSaving}
                        role="radio"
                        aria-checked={response?.answer === "not_yet"}
                        aria-label={`Mark ${item.label} as Not Yet`}
                      >
                        Not Yet
                      </Button>
                      <Button
                        variant={response?.answer === "not_sure" ? "default" : "outline"}
                        size="lg"
                        onClick={() => updateResponse(item.id, "not_sure")}
                        className={`flex-1 min-h-[44px] transition-all ${
                          response?.answer === "not_sure"
                            ? "bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                            : "hover:bg-gray-50 hover:border-gray-300"
                        }`}
                        disabled={isSaving}
                        role="radio"
                        aria-checked={response?.answer === "not_sure"}
                        aria-label={`Mark ${item.label} as Not Sure`}
                      >
                        Not Sure
                      </Button>
                    </div>

                    {response && (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedNotes((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="flex items-center gap-2 text-sm min-h-[44px]"
                          aria-expanded={isExpanded}
                          aria-controls={`note-section-${item.id}`}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          Add note
                        </Button>

                        <div id={`note-section-${item.id}`} className={isExpanded ? "block" : "hidden"}>
                          {isExpanded && (
                            <div className="space-y-2">
                              <Label htmlFor={`note-${item.id}`} className="text-sm font-medium">
                                Note for {item.label}
                              </Label>
                              <Textarea
                                id={`note-${item.id}`}
                                placeholder="Add any observations or notes..."
                                value={response.note || ""}
                                onChange={(e) => updateNote(item.id, e.target.value)}
                                rows={3}
                                className="resize-none"
                                aria-describedby={`note-help-${item.id}`}
                              />
                              <p id={`note-help-${item.id}`} className="text-xs text-muted-foreground">
                                These notes will be included in your summary report
                              </p>
                            </div>
                          )}
                        </div>

                        {response.note && !isExpanded && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">{response.note}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {item.isKeyItem && response?.answer === "not_yet" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3" role="alert">
                        <p className="text-sm text-amber-800">
                          Consider discussing at your next visit.{" "}
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => router.push(`/milestone/appointments/${childId}`)}
                            className="p-0 h-auto text-amber-800 underline min-h-[44px]"
                          >
                            Schedule appointment
                          </Button>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
          <div className="flex flex-col items-center gap-2">
            <Button
              size="lg"
              onClick={finishChecklist}
              disabled={!allAnswered}
              className="w-full max-w-md min-h-[44px]"
              aria-describedby="finish-help"
            >
              Finish Checklist
            </Button>
            <p id="finish-help" className="text-xs text-muted-foreground text-center">
              You can update this anytime
            </p>
          </div>
        </div>
      </div>

      <Dialog open={!!showMediaModal} onOpenChange={() => setShowMediaModal(null)}>
        <DialogContent className="sm:max-w-[600px]" aria-labelledby="media-title">
          <DialogHeader>
            <DialogTitle id="media-title">Milestone Example</DialogTitle>
          </DialogHeader>
          {showMediaModal && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={showMediaModal.url || "/placeholder.svg?height=400&width=600"}
                  alt={showMediaModal.alt}
                  className="w-full rounded-lg"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Example
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">{showMediaModal.alt}</p>
                {showMediaModal.caption && <p className="text-sm text-muted-foreground">{showMediaModal.caption}</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto" aria-labelledby="results-title">
          <DialogHeader>
            <DialogTitle id="results-title">Checklist Complete!</DialogTitle>
            <DialogDescription>Here's a summary of {child.firstName}'s development progress</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.met.length}</div>
                <div className="text-sm text-green-700">Milestones Met</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{results.notYet.length}</div>
                <div className="text-sm text-orange-700">Not Yet</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{results.notSure.length}</div>
                <div className="text-sm text-gray-700">Not Sure</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Next Steps</h3>
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResultsModal(false)
                    router.push(`/milestone/tips/${childId}/${ageKey}`)
                  }}
                  className="justify-start min-h-[44px]"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark 3 helpful tips
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResultsModal(false)
                    router.push(`/milestone/appointments/${childId}`)
                  }}
                  className="justify-start min-h-[44px]"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Add items to visit notes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResultsModal(false)
                    router.push(`/milestone/summary/${childId}`)
                  }}
                  className="justify-start min-h-[44px]"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export summary
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {error && <ErrorToast message={error} onRetry={() => setError(null)} onDismiss={() => setError(null)} />}
    </div>
  )
}
