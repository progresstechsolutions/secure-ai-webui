"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { DocumentTabs } from "./DocumentTabs"
import { DocumentToolbar } from "./DocumentToolbar"
import type { Document } from "../../../contexts/document-context"

interface DocumentViewerProps {
  document: Document
  isOpen: boolean
  onClose: () => void
}

export function DocumentViewer({ document, isOpen, onClose }: DocumentViewerProps) {
  const [activeTab, setActiveTab] = useState<"raw" | "summary" | "highlights">("raw")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [fontSize, setFontSize] = useState(16)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold truncate">{document.name}</DialogTitle>
        </DialogHeader>

        {/* Make this container fill the dialog and allow vertical scrolling */}
        <div className="flex flex-col h-[calc(90vh-64px)] overflow-y-auto">
          <DocumentToolbar
            document={document}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onClose={onClose}
          />

          {/* Make DocumentTabs fill remaining space and scroll if needed */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <DocumentTabs
              document={document}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              zoomLevel={zoomLevel}
              fontSize={fontSize}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
