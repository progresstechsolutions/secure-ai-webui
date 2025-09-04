"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera, X } from "lucide-react"
import Link from "next/link"
import { addChild } from "@/lib/milestone-data-layer"

export default function AddChildPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    birthDate: "",
    dueDate: "",
    sex: "",
    photoUrl: "",
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
    setFormData((prev) => ({ ...prev, photoUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required"
    }

    if (formData.dueDate && new Date(formData.dueDate) <= new Date(formData.birthDate)) {
      newErrors.dueDate = "Due date must be after birth date"
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
      let photoUrl = formData.photoUrl
      if (selectedImage) {
        photoUrl = URL.createObjectURL(selectedImage)
      }

      const childData = {
        firstName: formData.firstName.trim(),
        birthDate: formData.birthDate,
        dueDate: formData.dueDate || undefined,
        sex: formData.sex as "F" | "M" | "X" | undefined,
        photoUrl: photoUrl,
      }

      addChild(childData)
      router.push("/milestone/children")
    } catch (error) {
      console.error("Error adding child:", error)
      setErrors({ submit: "Failed to add child. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/milestone/children">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Add Child</h1>
          </div>

          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Child Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-gray-200">
                      <AvatarImage src={imagePreview || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-gray-100 text-gray-600">
                        {formData.firstName ? (
                          formData.firstName.charAt(0).toUpperCase()
                        ) : (
                          <Camera className="h-8 w-8" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Camera className="h-4 w-4 mr-2" />
                      {imagePreview ? "Change Photo" : "Add Photo"}
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="birthDate">Birth Date *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                      className={errors.birthDate ? "border-red-500" : ""}
                    />
                    {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date (Optional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                      placeholder="For premature babies"
                      className={errors.dueDate ? "border-red-500" : ""}
                    />
                    {errors.dueDate && <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>}
                    <p className="text-sm text-gray-600 mt-1">Used to calculate corrected age for premature babies</p>
                  </div>

                  <div>
                    <Label htmlFor="sex">Sex (Optional)</Label>
                    <Select
                      value={formData.sex}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="X">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push("/milestone/children")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Child"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
