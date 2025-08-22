"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Badge } from "../../ui/badge"
import { useToast } from "../../../hooks/use-toast"
import { useChildProfile } from "../../../contexts/child-profile-context"
import { Upload, FileText, X, Plus } from "lucide-react"
import type { Document } from "./document-hub"

interface DocumentUploadProps {
  onUpload: (documents: Document[]) => void
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const { toast } = useToast()
  const { activeChild } = useChildProfile()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [category, setCategory] = useState<Document["category"]>("other")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const validFiles = files.filter((file) => {
        const isValidType =
          file.type === "application/pdf" ||
          file.type.startsWith("image/") ||
          file.type === "application/msword" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type.`,
            variant: "destructive",
          })
          return false
        }

        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 10MB limit.`,
            variant: "destructive",
          })
          return false
        }

        return true
      })

      setSelectedFiles((prev) => [...prev, ...validFiles])
    },
    [toast],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type === "application/pdf" ||
        file.type.startsWith("image/") ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        })
        return false
      }

      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        })
        return false
      }

      return true
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    if (!activeChild) {
      toast({
        title: "No child selected",
        description: "Please select a child profile before uploading documents.",
        variant: "destructive",
      })
      return
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocuments: Document[] = selectedFiles.map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        category,
        childId: activeChild.id,
        tags,
        url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
      }))

      onUpload(newDocuments)

      // Reset form
      setSelectedFiles([])
      setCategory("other")
      setTags([])
      setTagInput("")

      toast({
        title: "Upload successful",
        description: `${selectedFiles.length} document(s) uploaded successfully.`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="cursor-pointer text-center">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{isDragOver ? "Drop files here" : "Drag & drop files here"}</p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
            <Button variant="outline" type="button" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Supports PDF, DOC, DOCX, and images up to 10MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Files ({selectedFiles.length})</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Document Category</Label>
        <Select value={category} onValueChange={(value: Document["category"]) => setCategory(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vaccination">Vaccination Records</SelectItem>
            <SelectItem value="prescription">Prescriptions</SelectItem>
            <SelectItem value="lab-result">Lab Results</SelectItem>
            <SelectItem value="visit-summary">Visit Summaries</SelectItem>
            <SelectItem value="insurance">Insurance Documents</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Optional)</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || isUploading || !activeChild}
        className="w-full"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}Documents
          </>
        )}
      </Button>
    </div>
  )
}
