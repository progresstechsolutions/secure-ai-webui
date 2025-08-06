"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Plus } from "lucide-react"
import { useDocuments } from "@/contexts/document-context"
import { useToast } from "@/hooks/use-toast"

interface AddTaggingModalProps {
  isOpen: boolean
  onClose: () => void
  document: {
    id: string
    name: string
    tags: string[]
  }
}

export function AddTaggingModal({ isOpen, onClose, document }: AddTaggingModalProps) {
  const [tags, setTags] = useState<string[]>(document.tags)
  const [tagInput, setTagInput] = useState("")
  const { updateDocument } = useDocuments()
  const { toast } = useToast()

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSave = () => {
    updateDocument(document.id, { tags })
    toast({
      title: "Tags updated",
      description: `Tags have been updated for "${document.name}"`,
    })
    onClose()
  }

  const handleClose = () => {
    setTags(document.tags) // Reset to original tags
    setTagInput("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tags</DialogTitle>
          <DialogDescription>
            Add tags to help organize and find your document later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="document-name">Document</Label>
            <p className="text-sm text-muted-foreground mt-1">{document.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)} 
                      className="ml-1 hover:text-destructive"
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 