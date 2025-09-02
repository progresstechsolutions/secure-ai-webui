"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Bell, Play, Filter, BookmarkCheck, Clock } from "lucide-react"
import {
  getTips,
  toggleBookmarkTip,
  saveReminderPrefs,
  getReminderPrefs,
  getChildren,
} from "@/lib/milestone-data-layer"
import type { Tip, ReminderPreference, Child } from "@/types/milestone"

interface TipsActivitiesProps {
  childId: string
  ageKey: string
}

const ReminderScheduler = ({
  isOpen,
  onClose,
  tipTitle,
  childId,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  tipTitle: string
  childId: string
  onSave: () => void
}) => {
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily")
  const [time, setTime] = useState("09:00")

  const handleSave = () => {
    // Get existing preferences or create new ones
    const existingPrefs = getReminderPrefs(childId) || {
      childId,
      channels: { push: true },
      checklistReminders: true,
      appointmentReminders: true,
      tipNudges: true,
    }

    // In a real app, you'd store specific tip reminders
    // For now, we'll just enable tip nudges
    const updatedPrefs: ReminderPreference = {
      ...existingPrefs,
      tipNudges: true,
      // In real implementation, you'd store: tipReminders: [{ tipId, frequency, time }]
    }

    saveReminderPrefs(updatedPrefs)
    onSave()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Set Reminder
          </DialogTitle>
          <DialogDescription>Get reminded to try "{tipTitle}"</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="frequency">How often?</Label>
            <Select value={frequency} onValueChange={(value: "daily" | "weekly") => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="time">What time?</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="min-h-[44px]" // Added accessibility min hit area
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 min-h-[44px] bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 min-h-[44px]">
              Set Reminder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function TipsActivities({ childId, ageKey }: TipsActivitiesProps) {
  const [tips, setTips] = useState<Tip[]>([])
  const [filteredTips, setFilteredTips] = useState<Tip[]>([])
  const [filter, setFilter] = useState<"all" | "bookmarked">("all")
  const [child, setChild] = useState<Child | null>(null)
  const [reminderDialog, setReminderDialog] = useState<{ isOpen: boolean; tipTitle: string } | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    // Load child data
    const children = getChildren()
    const currentChild = children.find((c) => c.id === childId)
    setChild(currentChild || null)

    // Load tips for age
    const ageTips = getTips(ageKey as any)
    setTips(ageTips)
    setFilteredTips(ageTips)
  }, [childId, ageKey])

  useEffect(() => {
    // Apply filter
    if (filter === "bookmarked") {
      setFilteredTips(tips.filter((tip) => tip.bookmarked))
    } else {
      setFilteredTips(tips)
    }
  }, [tips, filter])

  const handleBookmark = (tipId: string) => {
    const isBookmarked = toggleBookmarkTip(tipId)
    // Update local state
    setTips((prev) => prev.map((tip) => (tip.id === tipId ? { ...tip, bookmarked: isBookmarked } : tip)))
  }

  const handleReminder = (tipTitle: string) => {
    setReminderDialog({ isOpen: true, tipTitle })
  }

  const handleTryNow = (tip: Tip) => {
    // In a real app, this might navigate to a detailed activity view
    // or start a guided activity session
    console.log(`Starting activity: ${tip.title}`)
  }

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">👶</div>
        <h2 className="text-2xl font-semibold mb-2">Add your child</h2>
        <p className="text-muted-foreground mb-4">Create a child profile to see personalized tips and activities</p>
        <Button>Add Child</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Tips & Activities</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">
              {child.firstName} • {ageKey} milestones
            </p>
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              5-10 min activities
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(value: "all" | "bookmarked") => setFilter(value)}>
            <SelectTrigger className="w-[140px] min-h-[44px] border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tips</SelectItem>
              <SelectItem value="bookmarked">Bookmarked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip) => (
          <Card
            key={tip.id}
            className={`group border-0 shadow-sm bg-gradient-to-br from-background to-muted/20 ${
              prefersReducedMotion ? "" : "hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
            }`}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-lg leading-tight font-semibold text-foreground">{tip.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {tip.body}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(tip.id)}
                  className={`min-h-[44px] min-w-[44px] p-2 rounded-full ${
                    tip.bookmarked ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "hover:bg-muted"
                  }`}
                  aria-label={tip.bookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {tip.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReminder(tip.title)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-amber-50 hover:text-amber-600"
                  aria-label="Set reminder"
                >
                  <Bell className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleTryNow(tip)}
                  className="flex-1 min-h-[44px] ml-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full"
                  aria-label={`Try ${tip.title} now`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Try Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTips.length === 0 && filter === "bookmarked" && (
        <div className="text-center py-16">
          <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-3">No bookmarked tips yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Bookmark tips you want to try later by clicking the bookmark icon on any tip card
          </p>
          <Button variant="outline" onClick={() => setFilter("all")} className="min-h-[44px] px-6">
            View All Tips
          </Button>
        </div>
      )}

      {tips.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">💡</div>
          <h3 className="text-xl font-semibold mb-3">No tips available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tips and activities for this age group will appear here when available
          </p>
        </div>
      )}

      {/* Reminder Scheduler Dialog */}
      {reminderDialog && (
        <ReminderScheduler
          isOpen={reminderDialog.isOpen}
          onClose={() => setReminderDialog(null)}
          tipTitle={reminderDialog.tipTitle}
          childId={childId}
          onSave={() => {
            // Show success feedback
            console.log("Reminder set successfully")
          }}
        />
      )}
    </div>
  )
}
