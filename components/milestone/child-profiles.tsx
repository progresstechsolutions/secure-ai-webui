"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, ArrowRight, Users } from "lucide-react"
import Link from "next/link"
import { getChildren, addChild, updateChild, getAgeKeyForChild, type Child } from "@/lib/milestone-data-layer"

export function ChildProfiles() {
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    birthDate: "",
    dueDate: "",
    sex: "",
    photoUrl: "",
  })

  const resetForm = () => {
    setFormData({
      firstName: "",
      birthDate: "",
      dueDate: "",
      sex: "",
      photoUrl: "",
    })
    setSelectedImage(null)
    setImagePreview("")
  }

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

  const handleSubmit = async () => {
    let photoUrl = formData.photoUrl
    if (selectedImage) {
      photoUrl = URL.createObjectURL(selectedImage)
    }

    const childData = {
      firstName: formData.firstName,
      birthDate: formData.birthDate,
      dueDate: formData.dueDate || undefined,
      sex: formData.sex as "F" | "M" | "X" | undefined,
      photoUrl: photoUrl,
    }

    try {
      if (editingChild) {
        const updatedChild = updateChild(editingChild.id, childData)
        if (updatedChild) {
          setChildren((prevChildren) =>
            prevChildren.map((child) => (child.id === editingChild.id ? updatedChild : child)),
          )
        }
      } else {
        const newChild = addChild(childData)
        setChildren((prevChildren) => [...prevChildren, newChild])
      }

      resetForm()
      setHasError(false)
    } catch (error) {
      console.log("[v0] Error saving child:", error)
      setHasError(true)
    }
  }

  const openEditForm = (child: Child) => {
    setEditingChild(child)
    setFormData({
      firstName: child.firstName,
      birthDate: child.birthDate,
      dueDate: child.dueDate || "",
      sex: child.sex || "",
      photoUrl: child.photoUrl || "",
    })
    if (child.photoUrl) {
      setImagePreview(child.photoUrl)
    }
  }

  const calculateAge = (birthDate: string, dueDate?: string) => {
    const birth = new Date(birthDate)
    const now = new Date()
    let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())

    if (dueDate) {
      const due = new Date(dueDate)
      const prematureMonths = Math.floor((due.getTime() - birth.getTime()) / (30 * 24 * 60 * 60 * 1000))
      if (prematureMonths > 0) {
        months -= prematureMonths
      }
    }

    if (months < 12) {
      return `${Math.max(0, months)} months`
    } else if (months < 24) {
      return `${Math.floor(months / 12)} year ${months % 12} months`
    } else {
      return `${Math.floor(months / 12)} years`
    }
  }

  const getNextChecklistChip = (child: Child) => {
    const ageKey = getAgeKeyForChild(child.id)
    return ageKey ? `${ageKey} Checklist` : "Start Checklist"
  }

  useEffect(() => {
    let isMounted = true

    const loadChildren = async () => {
      try {
        setIsLoading(true)
        setHasError(false)
        const childrenData = getChildren()

        if (isMounted) {
          setChildren(Array.isArray(childrenData) ? childrenData : [])
        }
      } catch (error) {
        console.log("[v0] Error loading children:", error)
        if (isMounted) {
          setChildren([])
          setHasError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadChildren()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Loading children...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError || children.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg shadow-sm mx-auto flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Child Profiles</h1>
                <p className="text-gray-600">
                  Create profiles for your children to track their developmental milestones.
                </p>
              </div>
            </div>
            <Button asChild className="px-6">
              <Link href="/milestone/children/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Child
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Child Profiles</h1>
          <p className="text-gray-600">Manage your children's developmental tracking</p>
          <Button asChild>
            <Link href="/milestone/children/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {children.map((child) => (
            <Card
              key={child.id}
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-16 w-16 border-2 border-gray-100">
                    <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
                    <AvatarFallback className="text-lg font-medium bg-gray-100 text-gray-700">
                      {child.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between w-full">
                      <CardTitle className="text-lg font-medium text-gray-900">{child.firstName}</CardTitle>
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8">
                        <Link href={`/milestone/children/edit/${child.id}`}>
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Link>
                      </Button>
                    </div>

                    <CardDescription className="space-y-1">
                      <div className="text-gray-600 text-sm">{calculateAge(child.birthDate, child.dueDate)}</div>
                      {child.dueDate && (
                        <Badge variant="outline" className="text-xs text-blue-700 border-blue-200">
                          Corrected Age
                        </Badge>
                      )}
                    </CardDescription>

                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {getNextChecklistChip(child)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full h-9 bg-transparent">
                    <Link href={`/milestone/checklist/${child.id}/${getAgeKeyForChild(child.id) || "current"}`}>
                      Checklist
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full h-9 bg-transparent">
                    <Link href={`/milestone/tips/${child.id}/${getAgeKeyForChild(child.id) || "current"}`}>
                      Tips & Activities
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full h-9 bg-transparent">
                    <Link href={`/milestone/appointments/${child.id}`}>Appointments</Link>
                  </Button>
                </div>

                <Button asChild className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href={`/milestone/summary/${child.id}`}>
                    View Summary
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
