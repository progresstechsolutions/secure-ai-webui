"use client"

import { ScrollArea } from "../../ui/scroll-area"
import { Card } from "../../ui/card"
import type { Document } from "../../../contexts/document-context"

interface RawDocumentViewProps {
  document: Document
  zoomLevel: number
  fontSize: number
}

export function RawDocumentView({ document, zoomLevel, fontSize }: RawDocumentViewProps) {
  const isImage = document.type.startsWith("image/")
  const isPDF = document.type === "application/pdf"
  const isText = document.type.startsWith("text/") || document.content

  return (
    <ScrollArea className="h-full p-6">
      <Card className="p-6">
        {isImage && (
          <div className="flex justify-center">
            <img
              src={document.url || "/placeholder.svg"}
              alt={document.name}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
              className="max-w-full h-auto"
            />
          </div>
        )}

        {isPDF && (
          <div className="flex justify-center">
            <iframe
              src={document.url}
              title={document.name}
              className="w-full h-[800px] border-0"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
            />
          </div>
        )}

        {isText && document.content && (
          <div
            className="prose max-w-none"
            style={{
              fontSize: `${fontSize}px`,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top left",
            }}
          >
            <pre className="whitespace-pre-wrap font-sans">{document.content}</pre>
          </div>
        )}

        {!isImage && !isPDF && !document.content && (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-lg mb-2">Preview not available</p>
            <p className="text-sm">
              This file type cannot be previewed directly. Use the download button to view the file.
            </p>
          </div>
        )}
      </Card>
    </ScrollArea>
  )
}
