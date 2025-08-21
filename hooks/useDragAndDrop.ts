"use client"

import { useState, useCallback } from "react"

interface DraggedItem {
  id: string
  type: "folder" | "document"
}

export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = useCallback((item: DraggedItem) => {
    setDraggedItem(item)
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(() => {
    // This will be handled by the specific drop handlers
    setDraggedItem(null)
    setIsDragging(false)
  }, [])

  return {
    draggedItem,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}
