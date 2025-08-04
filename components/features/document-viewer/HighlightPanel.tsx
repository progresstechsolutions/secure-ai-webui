"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Highlighter, X, Search } from "lucide-react"

interface Highlight {
  id: string
  text: string
  color: string
  note?: string
  position: { start: number; end: number }
}

interface HighlightPanelProps {
  highlights: Highlight[]
  onAddHighlight: (highlight: Omit<Highlight, "id">) => void
  onRemoveHighlight: (id: string) => void
  onHighlightClick: (highlight: Highlight) => void
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a", class: "bg-yellow-200" },
  { name: "Green", value: "#bbf7d0", class: "bg-green-200" },
  { name: "Blue", value: "#bfdbfe", class: "bg-blue-200" },
  { name: "Pink", value: "#fbcfe8", class: "bg-pink-200" },
  { name: "Purple", value: "#e9d5ff", class: "bg-purple-200" },
]

export function HighlightPanel({
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  onHighlightClick,
}: HighlightPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedColor, setSelectedColor] = useState(HIGHLIGHT_COLORS[0])

  const filteredHighlights = highlights.filter(
    (highlight) =>
      highlight.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (highlight.note && highlight.note.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Highlighter className="h-5 w-5" />
          Highlights ({highlights.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search highlights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Color Selector */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Highlight Color</p>
          <div className="flex gap-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${color.class} ${
                  selectedColor.name === color.name ? "border-gray-800" : "border-gray-300"
                }`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Highlights List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {filteredHighlights.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm">
                {highlights.length === 0
                  ? "No highlights yet. Select text in the document to add highlights."
                  : "No highlights match your search."}
              </p>
            ) : (
              filteredHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onHighlightClick(highlight)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {highlight.text.substring(0, 50)}
                        {highlight.text.length > 50 && "..."}
                      </p>
                      {highlight.note && <p className="text-xs text-muted-foreground mt-1">{highlight.note}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: highlight.color }} />
                        <Badge variant="outline" className="text-xs">
                          Position: {highlight.position.start}-{highlight.position.end}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveHighlight(highlight.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              Export Highlights
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
