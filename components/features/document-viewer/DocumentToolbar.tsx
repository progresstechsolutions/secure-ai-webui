"use client"

import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"
import { Download, PrinterIcon as Print, Share2, ZoomIn, ZoomOut, Type, X, Bookmark, Highlighter } from "lucide-react"
import type { Document } from "../../../contexts/document-context"

interface DocumentToolbarProps {
  document: Document
  zoomLevel: number
  setZoomLevel: (level: number) => void
  fontSize: number
  setFontSize: (size: number) => void
  onClose: () => void
}

export function DocumentToolbar({
  document,
  zoomLevel,
  setZoomLevel,
  fontSize,
  setFontSize,
  onClose,
}: DocumentToolbarProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = document.url
    link.download = document.name
    link.click()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.name,
          text: `Check out this document: ${document.name}`,
          url: document.url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(document.url)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-muted/30">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>

        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Print className="h-4 w-4 mr-2" />
          Print
        </Button>

        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm">
          <Bookmark className="h-4 w-4 mr-2" />
          Bookmark
        </Button>

        <Button variant="outline" size="sm">
          <Highlighter className="h-4 w-4 mr-2" />
          Highlight
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
            disabled={zoomLevel <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
            disabled={zoomLevel >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            disabled={fontSize <= 12}
          >
            <Type className="h-3 w-3" />
          </Button>

          <span className="text-sm font-medium min-w-[40px] text-center">{fontSize}px</span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            disabled={fontSize >= 24}
          >
            <Type className="h-5 w-5" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
