"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { useAISuggestions } from "@/hooks/useAISuggestions"
import { Sparkles, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagSuggestionsProps {
  fileName: string
  fileType: string
  currentTags: string[]
  onTagSelect: (tag: string) => void
  className?: string
}

export function TagSuggestions({ fileName, fileType, currentTags, onTagSelect, className }: TagSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const { getSuggestedTags, isLoadingSuggestions } = useAISuggestions()

  // Load initial suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      const tags = await getSuggestedTags(fileName, fileType)
      setSuggestions(tags.filter((tag) => !currentTags.includes(tag)))
    }

    loadSuggestions()
  }, [fileName, fileType, getSuggestedTags, currentTags])

  // Refresh suggestions
  const handleRefresh = async () => {
    const tags = await getSuggestedTags(fileName, fileType, true) // Force refresh
    setSuggestions(tags.filter((tag) => !currentTags.includes(tag)))
  }

  // Filter out already selected tags
  const availableSuggestions = suggestions.filter((tag) => !currentTags.includes(tag))

  if (availableSuggestions.length === 0 && !isLoadingSuggestions) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-expanded={isVisible}
          aria-controls="tag-suggestions"
        >
          <Sparkles className="h-3 w-3" />
          <span>AI Suggestions</span>
          {availableSuggestions.length > 0 && (
            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs">
              {availableSuggestions.length}
            </span>
          )}
        </button>

        {isVisible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoadingSuggestions}
            className="h-6 w-6 p-0"
            aria-label="Refresh suggestions"
          >
            <RefreshCw className={cn("h-3 w-3", isLoadingSuggestions && "animate-spin")} />
          </Button>
        )}
      </div>

      {isVisible && (
        <div id="tag-suggestions" className="space-y-2">
          {isLoadingSuggestions ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
              <span>Getting AI suggestions...</span>
            </div>
          ) : availableSuggestions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {availableSuggestions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
                  aria-label={`Add suggested tag: ${tag}`}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No additional suggestions available</p>
          )}
        </div>
      )}
    </div>
  )
}
