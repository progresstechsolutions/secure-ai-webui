"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, FileText, Tag } from "lucide-react"
import type { Document } from "@/contexts/document-context"

interface AISummaryViewProps {
  document: Document
  fontSize: number
}

export function AISummaryView({ document, fontSize }: AISummaryViewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <ScrollArea className="h-full p-6">
      <div className="space-y-6">
        {/* Document Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Name</p>
                <p className="text-sm">{document.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Size</p>
                <p className="text-sm">{formatFileSize(document.size)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upload Date</p>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {document.uploadDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">File Type</p>
                <p className="text-sm">{document.type}</p>
              </div>
            </div>

            {document.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI-Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none" style={{ fontSize: `${fontSize}px` }}>
              <p className="text-muted-foreground leading-relaxed">
                {document.aiSummary || "No AI summary available for this document."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Key Medical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" style={{ fontSize: `${fontSize}px` }}>
              <div className="grid gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Patient Information</h4>
                  <p className="text-blue-800 text-sm">
                    Document contains medical information for the selected child profile.
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Document Status</h4>
                  <p className="text-green-800 text-sm">Document has been processed and is ready for review.</p>
                </div>

                {document.keyHighlights && document.keyHighlights.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
                    <ul className="text-yellow-800 text-sm space-y-1">
                      {document.keyHighlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
