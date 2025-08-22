"use client"

import React from "react"
import { Avatar } from "../../atoms/Avatar/Avatar"
import { Tag } from "../../atoms/Tag/Tag"
import { Button } from "../../atoms/Button/Button"
import { FileText, Download, Eye, MoreVertical, Calendar } from "lucide-react"
import { cn } from "../../../lib/utils"

export interface DocumentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  document: {
    id: string
    name: string
    type: string
    size: number
    uploadDate: Date
    category: string
    tags: string[]
    thumbnail?: string
  }
  onView?: (id: string) => void
  onDownload?: (id: string) => void
  onMore?: (id: string) => void
  compact?: boolean
}

const DocumentCard = React.forwardRef<HTMLDivElement, DocumentCardProps>(
  ({ className, document, onView, onDownload, onMore, compact = false, ...props }, ref) => {
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes"
      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date)
    }

    const getCategoryColor = (category: string) => {
      const colors: Record<string, string> = {
        vaccination: "success",
        prescription: "info",
        "lab-result": "warning",
        "visit-summary": "default",
        insurance: "secondary",
        other: "outline",
      }
      return colors[category] || "default"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md",
          compact && "p-3",
          className,
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Avatar
            src={document.thumbnail}
            fallback={<FileText className="h-4 w-4" />}
            size={compact ? "sm" : "md"}
            className="bg-primary/10"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-card-foreground truncate pr-2">{document.name}</h3>
              <Tag variant={getCategoryColor(document.category) as any} size="sm" className="flex-shrink-0">
                {document.category.replace("-", " ")}
              </Tag>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <span>{formatFileSize(document.size)}</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(document.uploadDate)}</span>
              </div>
            </div>

            {document.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {document.tags.slice(0, compact ? 2 : 3).map((tag) => (
                  <Tag key={tag} variant="outline" size="sm">
                    {tag}
                  </Tag>
                ))}
                {document.tags.length > (compact ? 2 : 3) && (
                  <Tag variant="outline" size="sm">
                    +{document.tags.length - (compact ? 2 : 3)}
                  </Tag>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onView?.(document.id)} aria-label="View document">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDownload?.(document.id)} aria-label="Download document">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onMore?.(document.id)} aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  },
)
DocumentCard.displayName = "DocumentCard"

export { DocumentCard }
