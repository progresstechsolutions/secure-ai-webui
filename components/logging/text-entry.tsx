"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextEntryProps {
  initialText?: string
  initialMood?: number
  initialSymptoms?: string[]
  initialMeds?: string[]
  onTextChange?: (text: string) => void
  onComplete?: (data: {
    summary: string
    mood?: number
    symptoms: string[]
    meds: string[]
  }) => void
  onCancel?: () => void
  className?: string
}

export function TextEntry({
  initialText = "",
  initialMood,
  initialSymptoms = [],
  initialMeds = [],
  onTextChange,
  onComplete,
  onCancel,
  className,
}: TextEntryProps) {
  const [text, setText] = useState(initialText)
  const [mood, setMood] = useState<number[]>(initialMood ? [initialMood] : [3])
  const [symptoms, setSymptoms] = useState<string[]>(initialSymptoms)
  const [meds, setMeds] = useState<string[]>(initialMeds)
  const [newSymptom, setNewSymptom] = useState("")
  const [newMed, setNewMed] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Update word count
  useEffect(() => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
    onTextChange?.(text)
  }, [text, onTextChange])

  const handleTextChange = (value: string) => {
    setText(value)
  }

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms([...symptoms, newSymptom.trim()])
      setNewSymptom("")
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom))
  }

  const addMed = () => {
    if (newMed.trim() && !meds.includes(newMed.trim())) {
      setMeds([...meds, newMed.trim()])
      setNewMed("")
    }
  }

  const removeMed = (med: string) => {
    setMeds(meds.filter((m) => m !== med))
  }

  const handleComplete = () => {
    onComplete?.({
      summary: text,
      mood: mood[0],
      symptoms,
      meds,
    })
  }

  const moodLabels = ["Very Low", "Low", "Okay", "Good", "Great"]
  const moodEmojis = ["😔", "😕", "😐", "🙂", "😊"]

  const isComplete = text.trim().length > 0

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Write Your Entry</h2>
        <p className="text-muted-foreground text-sm">
          Share what happened today - symptoms, feelings, or anything important
        </p>
      </div>

      {/* Main text entry */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label htmlFor="entry-text" className="text-sm font-medium">
            Your entry
          </Label>
          <Textarea
            ref={textareaRef}
            id="entry-text"
            placeholder="How are you feeling today? What symptoms did you notice? What medications did you take?

You can write as much or as little as you'd like. This is your space to track what matters to you."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[120px] resize-none text-base leading-relaxed"
            aria-describedby="word-count"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span id="word-count">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <span>Keep writing - every detail helps</span>
          </div>
        </div>
      </Card>

      {/* Quick mood selector */}
      <Card className="p-4">
        <div className="space-y-4">
          <Label className="text-sm font-medium">How are you feeling overall?</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-center text-4xl">{moodEmojis[mood[0] - 1]}</div>
            <Slider
              value={mood}
              onValueChange={setMood}
              max={5}
              min={1}
              step={1}
              className="w-full"
              aria-label="Overall mood rating"
            />
            <div className="text-center">
              <span className="text-sm font-medium text-foreground">{moodLabels[mood[0] - 1]}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional details (progressive disclosure) */}
      <Card className="p-4">
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between p-0 h-auto font-medium"
          aria-expanded={showDetails}
          aria-controls="additional-details"
        >
          <span>Add symptoms & medications</span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showDetails && (
          <div id="additional-details" className="mt-4 space-y-6">
            {/* Symptoms */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Symptoms</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a symptom"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSymptom()
                    }
                  }}
                  className="flex-1"
                  aria-label="New symptom"
                />
                <Button onClick={addSymptom} size="sm" disabled={!newSymptom.trim()} aria-label="Add symptom">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <Badge key={symptom} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {symptom}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymptom(symptom)}
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        aria-label={`Remove ${symptom}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Medications */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Medications</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a medication"
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addMed()
                    }
                  }}
                  className="flex-1"
                  aria-label="New medication"
                />
                <Button onClick={addMed} size="sm" disabled={!newMed.trim()} aria-label="Add medication">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {meds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meds.map((med) => (
                    <Badge key={med} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {med}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMed(med)}
                        className="h-auto p-0 ml-1 hover:bg-transparent"
                        aria-label={`Remove ${med}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleComplete} className="flex-1" disabled={!isComplete}>
          Continue
        </Button>
      </div>
    </div>
  )
}
