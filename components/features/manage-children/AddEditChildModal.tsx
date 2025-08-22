"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../atoms/Button/Button"
import { LabeledInput } from "../../molecules/LabeledInput/LabeledInput"
import { Avatar } from "../../atoms/Avatar/Avatar"
import { Tag } from "../../atoms/Tag/Tag"
import { Modal } from "../../ui/Modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { User, Calendar, Heart, Plus, Users } from "lucide-react"
import { AvatarUploadModal } from "./AvatarUploadModal"
import type { Child } from "../../../contexts/child-profile-context"

interface AddEditChildModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Child, "id" | "stats" | "sharedWith">) => void
  initialData?: Child
  title: string
}

interface FormData {
  name: string
  dateOfBirth: string
  gender: "male" | "female" | "other" | "prefer-not-to-say"
  avatar: string
  allergies: string[]
  conditions: string[]
  medications: string[]
}

interface FormErrors {
  name?: string
  dateOfBirth?: string
  gender?: string
}

export function AddEditChildModal({ isOpen, onClose, onSubmit, initialData, title }: AddEditChildModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
    gender: "prefer-not-to-say",
    avatar: "",
    allergies: [],
    conditions: [],
    medications: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          dateOfBirth: initialData.dateOfBirth,
          gender: initialData.gender,
          avatar: initialData.avatar || "",
          allergies: initialData.allergies || [],
          conditions: initialData.conditions || [],
          medications: initialData.medications || [],
        })
      } else {
        setFormData({
          name: "",
          dateOfBirth: "",
          gender: "prefer-not-to-say",
          avatar: "",
          allergies: [],
          conditions: [],
          medications: [],
        })
      }
      setErrors({})
    }
  }, [isOpen, initialData?.id])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future"
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
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

      const submitData = {
        ...formData,
        age: calculateAge(formData.dateOfBirth),
      }

      onSubmit(submitData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = (type: "allergies" | "conditions" | "medications", value: string) => {
    if (!value.trim()) return

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }))

    if (type === "allergies") setNewAllergy("")
    if (type === "conditions") setNewCondition("")
    if (type === "medications") setNewMedication("")
  }

  const removeItem = (type: "allergies" | "conditions" | "medications", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male": return "Male"
      case "female": return "Female"
      case "other": return "Other"
      case "prefer-not-to-say": return "Prefer not to say"
      default: return "Select gender"
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg" className="max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={formData.avatar}
              fallback={formData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
              size="xl"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAvatarModalOpen(true)}
            >
              Change Photo
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <LabeledInput
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              errorMessage={errors.name}
              leftIcon={<User className="h-4 w-4" />}
              placeholder="Enter child's full name"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label="Date of Birth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                errorMessage={errors.dateOfBirth}
                leftIcon={<Calendar className="h-4 w-4" />}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select value={formData.gender} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value as any }))}>
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
              </div>
            </div>

            {formData.dateOfBirth && (
              <div className="text-sm text-muted-foreground">Age: {calculateAge(formData.dateOfBirth)} years old</div>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Medical Information
          </h3>

          {/* Allergies */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Allergies</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add allergy..."
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("allergies", newAllergy)
                  }
                }}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem("allergies", newAllergy)}
                disabled={!newAllergy.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <Tag key={index} variant="destructive" removable onRemove={() => removeItem("allergies", index)}>
                    {allergy}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Medical Conditions</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add condition..."
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("conditions", newCondition)
                  }
                }}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem("conditions", newCondition)}
                disabled={!newCondition.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.conditions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.conditions.map((condition, index) => (
                  <Tag key={index} variant="warning" removable onRemove={() => removeItem("conditions", index)}>
                    {condition}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Current Medications</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add medication..."
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("medications", newMedication)
                  }
                }}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem("medications", newMedication)}
                disabled={!newMedication.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.medications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.medications.map((medication, index) => (
                  <Tag key={index} variant="info" removable onRemove={() => removeItem("medications", index)}>
                    {medication}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        </div>



        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none bg-transparent">
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} className="flex-1 sm:flex-none">
            {initialData ? "Update Child" : "Add Child"}
          </Button>
        </div>
      </form>

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onAvatarChange={(avatarUrl) => {
          setFormData((prev) => ({ ...prev, avatar: avatarUrl }))
          setIsAvatarModalOpen(false)
        }}
        currentAvatar={formData.avatar}
        childName={formData.name}
      />
    </Modal>
  )
}
