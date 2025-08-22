"use client"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../ui/dialog"
import { Trash2, AlertTriangle } from "lucide-react"

interface DeleteDocumentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  documentName: string
}

export function DeleteDocumentDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  documentName 
}: DeleteDocumentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Document
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{documentName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Recovery Available</p>
              <p>
                This document will be moved to the "Deleted" folder where you can recover it for up to 30 days. 
                After 30 days, it will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Document"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 