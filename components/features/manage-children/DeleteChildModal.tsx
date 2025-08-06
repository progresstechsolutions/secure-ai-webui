"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { Avatar } from "@/components/atoms/Avatar/Avatar"
import { Modal } from "@/components/ui/Modal"
import { AlertTriangle, FileText, Folder } from "lucide-react"
import type { Child } from "@/contexts/child-profile-context"

interface DeleteChildModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  child: Child | null
}

export function DeleteChildModal({ isOpen, onClose, onConfirm, child }: DeleteChildModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")

  if (!child) return null

  const handleConfirm = async () => {
    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onConfirm()
    } catch (error) {
      console.error("Error deleting child:", error)
    } finally {
      setIsDeleting(false)
      setConfirmationText("")
    }
  }

  const isConfirmationValid = confirmationText.toLowerCase() === child.name.toLowerCase()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Child Profile" size="md">
      <div className="space-y-6">
        {/* Warning Header */}
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-destructive">This action cannot be undone</h3>
            <p className="text-sm text-destructive/80">
              All documents, folders, and shared access will be permanently deleted.
            </p>
          </div>
        </div>

        {/* Child Info */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Avatar
            src={child.avatar}
            fallback={child.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size="lg"
          />
          <div>
            <h4 className="font-semibold text-foreground">{child.name}</h4>
            <p className="text-sm text-muted-foreground">Age {child.age}</p>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">What will be deleted:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{child.stats?.totalDocuments || 0} documents</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <span>{child.stats?.totalFolders || 0} folders</span>
            </div>
            {child.sharedWith && child.sharedWith.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>Access for {child.sharedWith.length} shared parent(s)</span>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="space-y-2">
          <label htmlFor="confirmation" className="text-sm font-medium text-foreground">
            Type <span className="font-semibold">"{child.name}"</span> to confirm deletion:
          </label>
          <input
            id="confirmation"
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Type "${child.name}" here`}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoComplete="off"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none bg-transparent"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={!isConfirmationValid}
            className="flex-1 sm:flex-none"
          >
            Delete Child Profile
          </Button>
        </div>
      </div>
    </Modal>
  )
}
