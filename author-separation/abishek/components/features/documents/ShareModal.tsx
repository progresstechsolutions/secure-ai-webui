"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Document } from "@/contexts/document-context"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (documentId: string, email: string, message: string, permission: string) => void
  document: Document | null
}

export function ShareModal({ isOpen, onClose, onSubmit, document }: ShareModalProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [permission, setPermission] = useState("view")

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setMessage("")
      setPermission("view")
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (document && document.id && email.trim()) {
      onSubmit(document.id, email.trim(), message, permission)
    }
    setEmail("")
    setMessage("")
    setPermission("view")
    onClose()
  }

  const handleClose = () => {
    setEmail("")
    setMessage("")
    setPermission("view")
    onClose()
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Document via Email
          </DialogTitle>
          <DialogDescription>
            Share "{document?.name}" with someone via email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Recipient Email</Label>
            <div className="flex gap-2 mt-1">
              <Mail className="h-4 w-4 text-muted-foreground mt-2" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address..."
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="permission">Permission Level</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="comment">Can Comment</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="mt-1"
              rows={3}
            />
          </div>

                     {document && document.name && (
             <div className="p-3 bg-muted rounded-lg">
               <p className="text-sm font-medium">Document Details</p>
               <p className="text-sm text-muted-foreground">
                 {document.name} • {document.size || 0} bytes • {document.uploadDate?.toLocaleDateString() || 'Unknown date'}
               </p>
             </div>
           )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!email.trim() || !isValidEmail(email)}
          >
            Send Share Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 