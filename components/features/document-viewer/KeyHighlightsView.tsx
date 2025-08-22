"use client"

import { ScrollArea } from "../../ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { useState } from "react"
import { Star, Plus, Edit3, Save, X, AlertCircle, CheckCircle, Clock, Stethoscope } from "lucide-react"
import type { Document } from "../../../contexts/document-context"

interface KeyHighlightsViewProps {
  document: Document
  fontSize: number
}

export function KeyHighlightsView({ document, fontSize }: KeyHighlightsViewProps) {
  const [highlights, setHighlights] = useState(document.keyHighlights || [])
  const [newHighlight, setNewHighlight] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setHighlights([...highlights, newHighlight.trim()])
      setNewHighlight("")
    }
  }

  const handleEditHighlight = (index: number) => {
    setEditingIndex(index)
    setEditText(highlights[index])
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editText.trim()) {
      const updated = [...highlights]
      updated[editingIndex] = editText.trim()
      setHighlights(updated)
      setEditingIndex(null)
      setEditText("")
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditText("")
  }

  const handleDeleteHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const getHighlightIcon = (highlight: string) => {
    const lower = highlight.toLowerCase()
    if (lower.includes("urgent") || lower.includes("emergency") || lower.includes("critical")) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (lower.includes("completed") || lower.includes("normal") || lower.includes("healthy")) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    if (lower.includes("appointment") || lower.includes("schedule") || lower.includes("due")) {
      return <Clock className="h-4 w-4 text-blue-500" />
    }
    if (lower.includes("medication") || lower.includes("prescription") || lower.includes("treatment")) {
      return <Stethoscope className="h-4 w-4 text-purple-500" />
    }
    return <Star className="h-4 w-4 text-yellow-500" />
  }

  const getHighlightPriority = (highlight: string) => {
    const lower = highlight.toLowerCase()
    if (lower.includes("urgent") || lower.includes("emergency") || lower.includes("critical")) {
      return "high"
    }
    if (lower.includes("important") || lower.includes("follow-up") || lower.includes("due")) {
      return "medium"
    }
    return "normal"
  }

  return (
    <ScrollArea className="h-full p-6">
      <div className="space-y-6">
        {/* Key Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Key Highlights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {highlights.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No highlights added yet. Add important points below.
              </p>
            ) : (
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      getHighlightPriority(highlight) === "high"
                        ? "bg-red-50 border-red-200"
                        : getHighlightPriority(highlight) === "medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {editingIndex === index ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[80px]"
                          style={{ fontSize: `${fontSize}px` }}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        {getHighlightIcon(highlight)}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                            {highlight}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant={
                                getHighlightPriority(highlight) === "high"
                                  ? "destructive"
                                  : getHighlightPriority(highlight) === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {getHighlightPriority(highlight)} priority
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditHighlight(index)}>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteHighlight(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add New Highlight */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Highlight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add an important point or highlight from this document..."
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              className="min-h-[100px]"
              style={{ fontSize: `${fontSize}px` }}
            />
            <Button onClick={handleAddHighlight} disabled={!newHighlight.trim()} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Highlight
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Medical Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Follow-up required",
                "Medication change",
                "Normal results",
                "Urgent attention needed",
                "Appointment scheduled",
                "Test completed",
              ].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewHighlight(template)}
                  className="text-left justify-start"
                >
                  {template}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
