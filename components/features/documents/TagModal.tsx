"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Document } from "@/contexts/document-context"

interface TagModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (documentId: string, tags: string[]) => void
  document: Document | null
}

export function TagModal({ isOpen, onClose, onSubmit, document }: TagModalProps) {
  const [newTag, setNewTag] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Update tags when document changes
  useEffect(() => {
    if (document && isOpen) {
      setTags(document.tags || [])
    } else if (!isOpen) {
      setTags([])
    }
  }, [document, isOpen])

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (document && document.id) {
      onSubmit(document.id, tags)
    }
    setNewTag("")
    setTags([])
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Reset state when modal closes
  const handleClose = () => {
    setNewTag("")
    setTags([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Add Tags to Document
          </DialogTitle>
          <DialogDescription>
            Add tags to help organize and find your document more easily.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-tag">Add New Tag</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="new-tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter tag name..."
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>

          {tags.length > 0 && (
            <div>
              <Label>Current Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 