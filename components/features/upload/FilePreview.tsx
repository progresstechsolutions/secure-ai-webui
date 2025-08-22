"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../atoms/Button/Button"
import { Tag } from "../../atoms/Tag/Tag"
import { Avatar } from "../../atoms/Avatar/Avatar"
import { TagSuggestions } from "./TagSuggestions"
import { FileText, ImageIcon, X, AlertCircle, CheckCircle, Clock, Plus } from "lucide-react"
import { cn } from "../../../lib/utils"
import type { UploadFile } from "./DocumentUpload"

interface FilePreviewProps {
  file: UploadFile
  onRemove: () => void
  onTagAdd: (tag: string) => void
  onTagRemove: (tag: string) => void
  onTagsUpdate: (tags: string[]) => void
  isUploading: boolean
}

export function FilePreview({ file, onRemove, onTagAdd, onTagRemove, onTagsUpdate, isUploading }: FilePreviewProps) {
  const [newTag, setNewTag] = useState("")
  const [showTagInput, setShowTagInput] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    }
    return <FileText className="h-5 w-5 text-gray-500" />
  }

  const getStatusIcon = () => {
    switch (file.status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "uploading":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      default:
        return null
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !file.tags.includes(newTag.trim())) {
      onTagAdd(newTag.trim())
      setNewTag("")
      setShowTagInput(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === "Escape") {
      setNewTag("")
      setShowTagInput(false)
    }
  }

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 border rounded-lg transition-colors",
        file.status === "success" && "border-green-200 bg-green-50",
        file.status === "error" && "border-red-200 bg-red-50",
        file.status === "uploading" && "border-blue-200 bg-blue-50",
        file.status === "pending" && "border-border bg-card",
      )}
      role="listitem"
      aria-label={`File: ${file.name}, ${formatFileSize(file.size)}, Status: ${file.status}`}
    >
      {/* File Thumbnail/Icon */}
      <div className="flex-shrink-0">
        {file.preview ? (
          <Avatar src={file.preview} fallback={getFileIcon()} size="lg" className="rounded-md" />
        ) : (
          <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-md">{getFileIcon()}</div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate" title={file.name}>
              {file.name}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span className="capitalize">{file.type.split("/")[1] || "Unknown"}</span>
              {file.status !== "pending" && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon()}
                    <span className="capitalize">{file.status}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Remove Button */}
          {!isUploading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              aria-label={`Remove ${file.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {file.status === "uploading" && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium">{file.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
                role="progressbar"
                aria-valuenow={file.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Upload progress: ${file.progress}%`}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {file.status === "error" && file.error && (
          <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700" role="alert">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{file.error}</span>
            </div>
          </div>
        )}

        {/* Tags Section */}
        <div className="space-y-2">
          {/* Existing Tags */}
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {file.tags.map((tag) => (
                <Tag key={tag} variant="secondary" size="sm" removable={!isUploading} onRemove={() => onTagRemove(tag)}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Add Tag Input */}
          {!isUploading && (
            <div className="flex items-center gap-2">
              {showTagInput ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Add tag..."
                    className="flex-1 px-2 py-1 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                    aria-label="Add new tag"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="h-6 px-2"
                  >
                    Add
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowTagInput(false)
                      setNewTag("")
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagInput(true)}
                  className="h-6 px-2 text-muted-foreground hover:text-foreground"
                  leftIcon={<Plus className="h-3 w-3" />}
                >
                  Add Tag
                </Button>
              )}
            </div>
          )}

          {/* AI Tag Suggestions */}
          {!isUploading && (
            <TagSuggestions fileName={file.name} fileType={file.type} currentTags={file.tags} onTagSelect={onTagAdd} />
          )}
        </div>
      </div>
    </div>
  )
}
