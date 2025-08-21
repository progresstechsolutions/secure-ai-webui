"use client"

import { useState, useCallback } from "react"

export interface ViewerState {
  zoomLevel: number
  fontSize: number
  activeTab: "raw" | "summary" | "highlights"
  isFullscreen: boolean
}

export function useDocumentViewer() {
  const [state, setState] = useState<ViewerState>({
    zoomLevel: 100,
    fontSize: 16,
    activeTab: "raw",
    isFullscreen: false,
  })

  const setZoomLevel = useCallback((level: number) => {
    setState((prev) => ({ ...prev, zoomLevel: Math.max(50, Math.min(200, level)) }))
  }, [])

  const setFontSize = useCallback((size: number) => {
    setState((prev) => ({ ...prev, fontSize: Math.max(12, Math.min(24, size)) }))
  }, [])

  const setActiveTab = useCallback((tab: "raw" | "summary" | "highlights") => {
    setState((prev) => ({ ...prev, activeTab: tab }))
  }, [])

  const toggleFullscreen = useCallback(() => {
    setState((prev) => ({ ...prev, isFullscreen: !prev.isFullscreen }))
  }, [])

  const resetView = useCallback(() => {
    setState({
      zoomLevel: 100,
      fontSize: 16,
      activeTab: "raw",
      isFullscreen: false,
    })
  }, [])

  return {
    ...state,
    setZoomLevel,
    setFontSize,
    setActiveTab,
    toggleFullscreen,
    resetView,
  }
}
