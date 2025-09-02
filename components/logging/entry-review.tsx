"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Mic, FileText, Heart, Pill, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JournalEntry } from "@/types/journal"

interface EntryReviewProps {
  entry: Partial<JournalEntry>
  onSave?: () => void
  onEdit?: () => void
  onCancel?: () => void
  isSaving?: boolean
  className?: string
}

export function EntryReview({ entry, onSave, onEdit, onCancel, isSaving = false, className }: EntryReviewProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Today"
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatTime = (date: Date | undefined) => {
    if (!date)
      return new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const moodLabels = ["Very Low", "Low", "Okay", "Good", "Great"]
  const moodEmojis = ["😔", "😕", "😐", "🙂", "😊"]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Review Your Entry</h2>
        <p className="text-muted-foreground text-sm">Check everything looks right before saving</p>
      </div>

      {/* Entry preview */}
      <Card className="p-4 space-y-4">
        {/* Date and time */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(entry.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(entry.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            {entry.mode === "voice" ? <Mic className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <span className="capitalize">{entry.mode} entry</span>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-foreground mb-2">Entry</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{entry.summary || "No content provided"}</p>
          </div>

          {/* Mood */}
          {entry.mood && (
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Mood:</span>
              <span className="text-lg">{moodEmojis[entry.mood - 1]}</span>
              <span className="text-sm text-muted-foreground">{moodLabels[entry.mood - 1]}</span>
            </div>
          )}

          {/* Symptoms */}
          {entry.symptoms && entry.symptoms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Symptoms</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.symptoms.map((symptom) => (
                  <Badge key={symptom} variant="secondary" className="text-xs">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Medications */}
          {entry.meds && entry.meds.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Medications</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.meds.map((med) => (
                  <Badge key={med} variant="outline" className="text-xs">
                    {med}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={onSave}
          className="w-full"
          disabled={isSaving}
          aria-label={isSaving ? "Saving entry..." : "Save entry"}
        >
          {isSaving ? "Saving..." : "Save Entry"}
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onEdit} className="flex-1 bg-transparent" disabled={isSaving}>
            Edit
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent" disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
