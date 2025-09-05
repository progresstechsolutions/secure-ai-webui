"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/atoms/Button/Button"
import { LabeledInput } from "@/components/molecules/LabeledInput/LabeledInput"
import { Avatar } from "@/components/atoms/Avatar/Avatar"
import { Tag } from "@/components/atoms/Tag/Tag"
import { Radio } from "@/components/atoms/Radio/Radio"
import { Modal } from "@/components/ui/Modal"
import { Mail, Eye, Settings, Users } from "lucide-react"
import type { Child } from "@/contexts/child-profile-context"

interface InviteParentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { email: string; role: "admin" | "read-only" }) => void
  child: Child | null
}

interface FormData {
  email: string
  role: "admin" | "read-only"
}

interface FormErrors {
  email?: string
}

export function InviteParentModal({ isOpen, onClose, onSubmit, child }: InviteParentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    role: "read-only",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!child) return null

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (child.sharedWith?.some((invite) => invite.email === formData.email)) {
      newErrors.email = "This parent has already been invited"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit(formData)

      // Reset form
      setFormData({ email: "", role: "read-only" })
      setErrors({})
    } catch (error) {
      console.error("Error sending invitation:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ email: "", role: "read-only" })
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Invite Parent" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Child Info */}
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Avatar
            src={child.avatar}
            fallback={child.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size="md"
          />
          <div>
            <h4 className="font-semibold text-foreground">{child.name}</h4>
            <p className="text-sm text-muted-foreground">Age {child.age}</p>
          </div>
        </div>

        {/* Email Input */}
        <LabeledInput
          label="Parent's Email Address"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          errorMessage={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="Enter parent's email address"
          description="They will receive an invitation email to access this child's profile"
        />

        {/* Role Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">Access Level</label>

          <div className="space-y-3">
            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.role === "read-only" ? "border-primary bg-primary/5" : "border-input hover:bg-muted/50"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, role: "read-only" }))}
            >
              <div className="flex items-start gap-3">
                <Radio
                  name="role"
                  value="read-only"
                  checked={formData.role === "read-only"}
                  onChange={() => setFormData((prev) => ({ ...prev, role: "read-only" }))}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="font-medium">Read-Only Access</span>
                    <Tag variant="secondary" size="sm">
                      Recommended
                    </Tag>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can view documents and medical information but cannot make changes
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.role === "admin" ? "border-primary bg-primary/5" : "border-input hover:bg-muted/50"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, role: "admin" }))}
            >
              <div className="flex items-start gap-3">
                <Radio
                  name="role"
                  value="admin"
                  checked={formData.role === "admin"}
                  onChange={() => setFormData((prev) => ({ ...prev, role: "admin" }))}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings className="h-4 w-4 text-primary" />
                    <span className="font-medium">Admin Access</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can view, upload, edit, and delete documents and medical information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Shared Access */}
        {child.sharedWith && child.sharedWith.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Currently shared with:</span>
            </div>
            <div className="space-y-2">
              {child.sharedWith.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{invite.name}</p>
                    <p className="text-xs text-muted-foreground">{invite.email}</p>
                  </div>
                  <Tag variant={invite.role === "admin" ? "default" : "secondary"} size="sm">
                    {invite.role === "admin" ? "Admin" : "Read-Only"}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 sm:flex-none bg-transparent"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="flex-1 sm:flex-none"
            leftIcon={<Mail className="h-4 w-4" />}
          >
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  )
}
