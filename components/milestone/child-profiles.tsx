"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, ArrowRight, Camera, Upload, AlertTriangle, Users } from "lucide-react"
import Link from "next/link"
import { getChildren, addChild, updateChild, getAgeKeyForChild, type Child } from "@/lib/milestone-data-layer"

const cropImage = (file: File, cropArea: { x: number; y: number; width: number; height: number }): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    img.onload = () => {
      canvas.width = 200
      canvas.height = 200

      ctx.drawImage(img, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, 200, 200)

      canvas.toBlob((blob) => {
        const croppedFile = new File([blob!], file.name, { type: file.type })
        resolve(croppedFile)
      }, file.type)
    }

    img.src = URL.createObjectURL(file)
  })
}

const validateDates = (birthDate: string, dueDate?: string) => {
  const birth = new Date(birthDate)
  const now = new Date()
  const due = dueDate ? new Date(dueDate) : null

  const errors: string[] = []

  if (birth > now) {
    errors.push("Birth date cannot be in the future")
  }

  if (due && due > now) {
    errors.push("Due date cannot be in the future")
  }

  if (due && birth < due) {
    errors.push("Birth date cannot be before due date")
  }

  return errors
}

const findDuplicates = (children: Child[], name: string, birthDate: string) => {
  const birth = new Date(birthDate)
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000

  return children.filter((child) => {
    const childBirth = new Date(child.birthDate)
    const daysDiff = Math.abs(birth.getTime() - childBirth.getTime())

    return child.firstName.toLowerCase() === name.toLowerCase() && daysDiff <= threeDaysMs
  })
}

export function ChildProfiles() {
  const [children, setChildren] = useState<Child[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [duplicateWarning, setDuplicateWarning] = useState<{ duplicates: Child[]; newChild: Partial<Child> } | null>(
    null,
  )
  const [dateWarning, setDateWarning] = useState<string[]>([])
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
    setDateWarning([])
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
    const errors = validateDates(formData.birthDate, formData.dueDate || undefined)
    if (errors.length > 0) {
      setDateWarning(errors)
      return
    }

    const duplicates = findDuplicates(children, formData.firstName, formData.birthDate)
    if (duplicates.length > 0 && !editingChild) {
      setDuplicateWarning({ duplicates, newChild: formData })
      return
    }

    let photoUrl = formData.photoUrl
    if (selectedImage) {
      // In a real app, this would upload to a server
      const croppedImage = await cropImage(selectedImage, cropArea)
      photoUrl = URL.createObjectURL(croppedImage)
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

      setIsAddDialogOpen(false)
      setEditingChild(null)
      resetForm()
      setHasError(false)
    } catch (error) {
      console.log("[v0] Error saving child:", error)
      setHasError(true)
    }
  }

  const handleMerge = (targetChild: Child) => {
    const mergedData = {
      firstName: formData.firstName,
      birthDate: formData.birthDate,
      dueDate: formData.dueDate || undefined,
      sex: formData.sex as "F" | "M" | "X" | undefined,
      photoUrl: formData.photoUrl,
    }

    try {
      const updatedChild = updateChild(targetChild.id, mergedData)
      if (updatedChild) {
        setChildren((prevChildren) => prevChildren.map((child) => (child.id === targetChild.id ? updatedChild : child)))
      }

      setDuplicateWarning(null)
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.log("[v0] Error merging child:", error)
      setHasError(true)
    }
  }

  const openEditDialog = (child: Child) => {
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
    setIsAddDialogOpen(true)
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

  const AddChildDialog = () => (
    <Dialog
      open={isAddDialogOpen}
      onOpenChange={(open) => {
        setIsAddDialogOpen(open)
        if (!open) {
          setEditingChild(null)
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingChild ? "Edit Child Profile" : "Add New Child"}</DialogTitle>
          <DialogDescription>
            {editingChild
              ? "Update your child's profile information."
              : "Create a profile to start tracking developmental milestones."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || formData.photoUrl} alt="Child photo" />
                <AvatarFallback className="text-2xl">
                  {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : <Camera className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <p className="text-sm text-muted-foreground text-center">Click the upload button to add a photo</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name *
              </Label>
              <Input
                id="firstName"
                placeholder="Emma"
                className="col-span-3"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthDate" className="text-right">
                Birth Date *
              </Label>
              <Input
                id="birthDate"
                type="date"
                className="col-span-3"
                value={formData.birthDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                className="col-span-3"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sex" className="text-right">
                Sex
              </Label>
              <Select value={formData.sex} onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="X">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {dateWarning.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                {dateWarning.map((warning, index) => (
                  <p key={index}>{warning}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.firstName || !formData.birthDate}>
            {editingChild ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const DuplicateWarningDialog = () => (
    <AlertDialog open={!!duplicateWarning} onOpenChange={() => setDuplicateWarning(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600" />
            Possible Duplicate Child
          </AlertDialogTitle>
          <AlertDialogDescription>
            We found {duplicateWarning?.duplicates.length} child(ren) with similar information:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          {duplicateWarning?.duplicates.map((child) => (
            <div key={child.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
                  <AvatarFallback>{child.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{child.firstName}</p>
                  <p className="text-sm text-muted-foreground">
                    Born: {new Date(child.birthDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleMerge(child)}>
                Merge
              </Button>
            </div>
          ))}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setDuplicateWarning(null)
              handleSubmit()
            }}
          >
            Add Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Child Profiles</h1>
            <p className="text-muted-foreground mt-1">Loading children...</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Child Profiles</h1>
            <p className="text-muted-foreground mt-1">Start by adding your first child</p>
          </div>
          <AddChildDialog />
        </div>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Add Your First Child</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a profile to start tracking developmental milestones
            </p>
            <AddChildDialog />
          </CardContent>
        </Card>

        <DuplicateWarningDialog />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Child Profiles</h1>
          <p className="text-muted-foreground mt-1">Manage your children's developmental tracking</p>
        </div>
        <AddChildDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(children) &&
          children.map((child) => (
            <Card key={child.id} className="relative hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
                      <AvatarFallback className="text-lg">{child.firstName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{child.firstName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {calculateAge(child.birthDate, child.dueDate)}
                        {child.dueDate && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            Corrected
                          </Badge>
                        )}
                      </CardDescription>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {getNextChecklistChip(child)}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(child)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button asChild variant="outline" size="sm" className="text-xs bg-transparent">
                    <Link href={`/milestone/checklist/${child.id}/${getAgeKeyForChild(child.id) || "current"}`}>
                      Checklist
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-xs bg-transparent">
                    <Link href={`/milestone/tips/${child.id}/${getAgeKeyForChild(child.id) || "current"}`}>Tips</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="text-xs bg-transparent">
                    <Link href={`/milestone/appointments/${child.id}`}>Appointments</Link>
                  </Button>
                </div>

                <Button asChild className="w-full" size="sm">
                  <Link href={`/milestone/summary/${child.id}`}>
                    View Summary <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}

        <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">Add New Child</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a profile to start tracking developmental milestones
            </p>
            <AddChildDialog />
          </CardContent>
        </Card>
      </div>

      <DuplicateWarningDialog />
    </div>
  )
}
