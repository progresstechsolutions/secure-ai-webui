"use client"

import { useState, useCallback } from "react"

export interface Highlight {
  id: string
  text: string
  color: string
  note?: string
  position: { start: number; end: number }
  documentId: string
  createdAt: Date
}

export function useHighlights(documentId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([])

  const addHighlight = useCallback(
    (text: string, color: string, position: { start: number; end: number }, note?: string) => {
      const newHighlight: Highlight = {
        id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        color,
        note,
        position,
        documentId,
        createdAt: new Date(),
      }

      setHighlights((prev) => [...prev, newHighlight])
      return newHighlight
    },
    [documentId],
  )

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const updateHighlight = useCallback((id: string, updates: Partial<Highlight>) => {
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)))
  }, [])

  const clearAllHighlights = useCallback(() => {
    setHighlights([])
  }, [])

  const getHighlightsByPosition = useCallback(
    (start: number, end: number) => {
      return highlights.filter(
        (h) =>
          (h.position.start >= start && h.position.start <= end) ||
          (h.position.end >= start && h.position.end <= end) ||
          (h.position.start <= start && h.position.end >= end),
      )
    },
    [highlights],
  )

  return {
    highlights,
    addHighlight,
    removeHighlight,
    updateHighlight,
    clearAllHighlights,
    getHighlightsByPosition,
  }
}
