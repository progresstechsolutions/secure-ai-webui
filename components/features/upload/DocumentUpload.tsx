"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChildProfile } from "@/contexts/child-profile-context"
import { useDocuments } from "@/contexts/document-context"
import { useAISuggestions } from "@/hooks/useAISuggestions"

import { useToast } from "@/hooks/use-toast"
import { DocumentCaptureModal } from "./DocumentCaptureModal"
import {
  Upload,
  X,
  FileIcon,
  FileText,
  FileImage,
  FileSpreadsheet,
  Presentation,
  FileVideo,
  FileAudio,
  Archive,
  XIcon,
  Tag as TagIcon,
  UploadCloud,
  Folder,
  Plus,
  Shield,
  TestTube,
  Stethoscope,
  Pill,
  FileCheck,
  CreditCard,
  Camera,
  Syringe,
  Beaker,
  Building2,
  BookOpen,
  Grid,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Supported file types configuration
const SUPPORTED_FILE_TYPES = {
  "application/pdf": { icon: FileText, color: "text-red-500", label: "PDF" },
  "application/msword": { icon: FileText, color: "text-blue-500", label: "DOC" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, color: "text-blue-500", label: "DOCX" },
  "text/plain": { icon: FileText, color: "text-gray-500", label: "TXT" },
  "application/rtf": { icon: FileText, color: "text-gray-500", label: "RTF" },
  "application/vnd.ms-excel": { icon: FileSpreadsheet, color: "text-green-500", label: "XLS" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: FileSpreadsheet, color: "text-green-500", label: "XLSX" },
  "text/csv": { icon: FileSpreadsheet, color: "text-green-500", label: "CSV" },
  "application/vnd.ms-powerpoint": { icon: Presentation, color: "text-orange-500", label: "PPT" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon: Presentation, color: "text-orange-500", label: "PPTX" },
  "image/jpeg": { icon: FileImage, color: "text-purple-500", label: "JPG" },
  "image/png": { icon: FileImage, color: "text-purple-500", label: "PNG" },
  "image/gif": { icon: FileImage, color: "text-purple-500", label: "GIF" },
  "image/bmp": { icon: FileImage, color: "text-purple-500", label: "BMP" },
  "image/webp": { icon: FileImage, color: "text-purple-500", label: "WEBP" },
  "image/svg+xml": { icon: FileImage, color: "text-purple-500", label: "SVG" },
  "image/tiff": { icon: FileImage, color: "text-purple-500", label: "TIFF" },
  "audio/mpeg": { icon: FileAudio, color: "text-yellow-500", label: "MP3" },
  "audio/wav": { icon: FileAudio, color: "text-yellow-500", label: "WAV" },
  "video/mp4": { icon: FileVideo, color: "text-pink-500", label: "MP4" },
  "video/avi": { icon: FileVideo, color: "text-pink-500", label: "AVI" },
  "application/zip": { icon: Archive, color: "text-gray-500", label: "ZIP" },
  "application/x-rar-compressed": { icon: Archive, color: "text-gray-500", label: "RAR" },
  "application/x-7z-compressed": { icon: Archive, color: "text-gray-500", label: "7Z" },
} as const

const folderIcons = {
  "file-medical": Stethoscope,
  "shield": Shield,
  "flask": TestTube,
  "pill": Pill,
  "file-check": FileCheck,
  "credit-card": CreditCard,
  "syringe": Syringe,
  "beaker": Beaker,
  "hospital": Building2,
  "book": BookOpen,
  "grid": Grid,
  "default": Folder,
}

const folderColors = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_FILE_TYPES = Object.keys(SUPPORTED_FILE_TYPES).join(",")

interface DocumentUploadProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocumentUpload({ isOpen, onClose }: DocumentUploadProps) {
  const { activeChild } = useChildProfile()
  const { toast } = useToast()
  const { addDocument, updateDocument, getFoldersByChild, addFolder, getSuggestedFolders } = useDocuments()
  const [file, setFile] = useState<File | null>(null)
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false)

  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("blue")
  const [newFolderIcon, setNewFolderIcon] = useState("default")
  const [documentName, setDocumentName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { getSuggestedTags, isLoadingSuggestions } = useAISuggestions()

  const childFolders = activeChild ? getFoldersByChild(activeChild.id) : []

  // Load suggested tags when file changes
  useEffect(() => {
    if (file) {
      getSuggestedTags(file.name, file.type).then(setSuggestedTags)
    } else {
      setSuggestedTags([])
    }
  }, [file, getSuggestedTags])

  const validateFile = (selectedFile: File): string | null => {
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      return `File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    }

    // Check file type
    if (!SUPPORTED_FILE_TYPES[selectedFile.type as keyof typeof SUPPORTED_FILE_TYPES]) {
      return `File type "${selectedFile.type}" is not supported. Please select a supported file type.`
    }

    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validationError = validateFile(selectedFile)
      if (validationError) {
        setError(validationError)
        return
      }

      setFile(selectedFile)
      setUploadProgress(0)
      setError(null)
      setTags([]) // Reset tags on new file selection
      setNewTagInput("")
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const selectedFile = e.dataTransfer.files?.[0]
    if (selectedFile) {
      const validationError = validateFile(selectedFile)
      if (validationError) {
        setError(validationError)
        return
      }

      setFile(selectedFile)
      setUploadProgress(0)
      setError(null)
      setTags([])
      setNewTagInput("")
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleCreateFolder = () => {
    if (!activeChild || !newFolderName.trim()) return

    const folderName = newFolderName.trim()
    
    // Check for duplicate folder names (case-insensitive)
    const existingFolder = childFolders.find(
      folder => folder.name.toLowerCase() === folderName.toLowerCase()
    )
    
    if (existingFolder) {
      toast({
        title: "Folder already exists",
        description: `A folder named "${folderName}" already exists. Please choose a different name.`,
        variant: "destructive",
      })
      return
    }

    try {
      const newFolder = addFolder({
        name: folderName,
        childId: activeChild.id,
        color: newFolderColor,
        icon: newFolderIcon,
      })
      
      setSelectedFolderId(newFolder.id)
      setNewFolderName("")
      setNewFolderColor("blue")
      setNewFolderIcon("default")
      setShowCreateFolder(false)
      
      toast({
        title: "Folder created",
        description: `"${folderName}" folder created and selected!`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.")
      return
    }
    if (!activeChild) {
      setError("No active child selected. Please select a child profile.")
      return
    }

    setError(null)
    setUploadProgress(0)
    setIsUploading(true)

    try {
      // Generate a unique document ID (timestamp + random)
      const documentId = `${activeChild.id}-${Date.now()}-${Math.floor(Math.random()*10000)}`

      // Create document object first with basic info (no AI summary yet)
      const newDocument = {
        name: file.name,
        type: file.type,
        size: file.size,
        category: "other" as const, // Default category, could be determined by file type or user selection
        childId: activeChild.id,
        folderId: selectedFolderId, // Add folder assignment
        tags,
        url: URL.createObjectURL(file), // Create object URL for preview
        aiSummary: "Generating AI summary...", // Placeholder
        keyHighlights: ["Document uploaded successfully", "AI summary in progress..."],
      }

      // Add document to global state immediately
      const addedDocument = addDocument(newDocument)

      // Simulate upload progress (faster now since we're not waiting for AI)
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 20 // Faster progress
        })
      }, 100)

      // Simulate file upload (much faster)
      await new Promise((resolve) => setTimeout(resolve, 800))

      clearInterval(uploadInterval)
      setUploadProgress(100)

      // Show success message immediately
      const folderName = selectedFolderId 
        ? childFolders.find(f => f.id === selectedFolderId)?.name || "Unknown"
        : "Unassigned"
      
      toast({
        title: "Upload successful",
        description: `"${file.name}" uploaded successfully to ${folderName}!`,
      })

      // Generate AI summary in the background using the actual document ID
      generateAISummaryInBackground(file, addedDocument.id, addedDocument)

      resetForm()
      onClose()
    } catch (err) {
      setUploadProgress(0)
      setError("Failed to upload file. Please try again.")
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const generateAISummaryInBackground = async (file: File, documentId: string, document: any) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('documentId', documentId)
      
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_BASE_URL}/summarize`, {
        method: 'POST',
        body: formData,
      })
      
      if (res.ok) {
        const data = await res.json()
        const aiSummary = data.summary || 'No summary available.'
        
        // Update the document with the AI summary
        updateDocument(documentId, {
          aiSummary,
          keyHighlights: ["Document uploaded successfully", "AI summary completed"],
        })
        
        toast({
          title: "AI Summary Generated",
          description: `AI summary generated for "${file.name}"!`,
        })
        console.log('AI Summary generated:', aiSummary)
      } else {
        console.error('AI summary generation failed')
        updateDocument(documentId, {
          aiSummary: 'Failed to generate AI summary.',
          keyHighlights: ["Document uploaded successfully", "AI summary failed"],
        })
        toast({
          title: "AI Summary Failed",
          description: `Failed to generate AI summary for "${file.name}"`,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('AI summary error:', err)
      updateDocument(documentId, {
        aiSummary: 'Failed to generate AI summary.',
        keyHighlights: ["Document uploaded successfully", "AI summary failed"],
      })
              toast({
          title: "AI Summary Failed",
          description: `Failed to generate AI summary for "${file.name}"`,
          variant: "destructive",
        })
    }
  }

  const resetForm = () => {
    setFile(null)
    setUploadProgress(0)
    setError(null)
    setTags([])
    setNewTagInput("")
    setSelectedFolderId(null)
    setShowCreateFolder(false)
    setNewFolderName("")
    setNewFolderColor("blue")
    setNewFolderIcon("default")
    setDocumentName("")
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
      setNewTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const getFileIcon = (fileName: string, fileType: string) => {
    const fileConfig = SUPPORTED_FILE_TYPES[fileType as keyof typeof SUPPORTED_FILE_TYPES]
    if (fileConfig) {
      const IconComponent = fileConfig.icon
      return <IconComponent className={`h-12 w-12 ${fileConfig.color}`} />
    }
    return <FileIcon className="h-12 w-12 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getSupportedFormatsText = () => {
    return "PDF, DOC, DOCX, TXT, RTF, XLS, XLSX, CSV, PPT, PPTX, JPG, PNG, GIF, BMP, WEBP, SVG, TIFF, MP3, WAV, MP4, AVI, ZIP, RAR, 7Z"
  }

  const getFolderIcon = (iconName: string) => {
    const IconComponent = folderIcons[iconName as keyof typeof folderIcons] || folderIcons.default
    return <IconComponent className="h-4 w-4" />
  }

  // Get suggested folders for the current file
  const getSuggestedFoldersForFile = () => {
    if (!file) return []
    
    // Create a mock document for suggestion logic
    const mockDocument = {
      id: "temp",
      name: file.name,
      type: file.type,
      size: file.size,
      category: "other" as const,
      tags,
      childId: activeChild?.id || "",
      folderId: null,
      url: "",
      uploadDate: new Date(),
    }
    
    return getSuggestedFolders(mockDocument)
  }

  const suggestedFolders = getSuggestedFoldersForFile()

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload Document</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload a new document for {activeChild?.name || "the active child"}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {!file ? (
            <div className="space-y-4">
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload from Device */}
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  aria-label="Drag and drop files here or click to browse"
                  tabIndex={0}
                >
                  <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Upload from Device</p>
                  <p className="text-sm text-muted-foreground mb-4 text-center">Drag & drop files or click to browse</p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept={ACCEPTED_FILE_TYPES}
                    aria-label="Select file for upload"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Supported formats: {getSupportedFormatsText()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Max: {MAX_FILE_SIZE / 1024 / 1024}MB</p>
                </div>

                {/* Take Pictures */}
                <div
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                  onClick={() => setIsCaptureModalOpen(true)}
                  role="button"
                  aria-label="Take pictures of documents"
                  tabIndex={0}
                >
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">Take Pictures</p>
                  <p className="text-sm text-muted-foreground mb-4 text-center">Capture documents with camera</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Advanced processing included
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Multi-page support</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              {getFileIcon(file.name, file.type)}
              <div className="flex-1">
                <p className="font-medium text-foreground" aria-label={`File name: ${file.name}`}>
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground" aria-label={`File size: ${formatFileSize(file.size)}`}>
                  {formatFileSize(file.size)} • {file.type}
                </p>
                {uploadProgress > 0 && (
                  <Progress
                    value={uploadProgress}
                    className="w-full mt-2"
                    aria-label={`Upload progress: ${uploadProgress}%`}
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetForm}
                aria-label="Remove selected file"
                disabled={isUploading}
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          )}

          {file && (
            <>
              {/* Folder Selection */}
              <div className="space-y-4">
                <Label className="text-foreground">Destination Folder</Label>
                                 <Select value={selectedFolderId || "unassigned"} onValueChange={(value) => setSelectedFolderId(value === "unassigned" ? null : value)}>
                   <SelectTrigger>
                     <SelectValue placeholder="Choose a folder (optional)" />
                   </SelectTrigger>
                   <SelectContent className="max-h-60 overflow-y-auto">
                     <SelectItem value="unassigned">
                       <div className="flex items-center gap-2">
                         <Folder className="h-4 w-4" />
                         <span>Unassigned</span>
                       </div>
                     </SelectItem>
                    {childFolders
                      .filter(folder => folder.id !== "deleted-folder" && folder.id !== "all-documents")
                      .map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-2">
                          <div className={cn("p-1 rounded", folderColors[folder.color as keyof typeof folderColors] || folderColors.blue)}>
                            {getFolderIcon(folder.icon || "default")}
                          </div>
                          <span className="truncate">{folder.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Create New Folder */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateFolder(!showCreateFolder)}
                    disabled={isUploading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Folder
                  </Button>
                </div>

                {showCreateFolder && (
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="new-folder-name">Folder Name</Label>
                        <Input
                          id="new-folder-name"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Enter folder name"
                          disabled={isUploading}
                        />
                      </div>
                      <div>
                        <Label>Color</Label>
                        <div className="flex gap-2 mt-2">
                          {Object.entries(folderColors).map(([color, className]) => (
                            <button
                              key={color}
                              onClick={() => setNewFolderColor(color)}
                              className={cn(
                                "w-6 h-6 rounded-full border-2",
                                newFolderColor === color ? "border-foreground" : "border-transparent",
                                className
                              )}
                              disabled={isUploading}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <div className="flex gap-2 mt-2">
                          {Object.entries(folderIcons).map(([iconName, IconComponent]) => (
                            <button
                              key={iconName}
                              onClick={() => setNewFolderIcon(iconName)}
                              className={cn(
                                "p-2 rounded border",
                                newFolderIcon === iconName ? "border-primary bg-primary/10" : "border-border"
                              )}
                              disabled={isUploading}
                            >
                              <IconComponent className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || isUploading}>
                          Create Folder
                        </Button>
                        <Button variant="outline" onClick={() => setShowCreateFolder(false)} disabled={isUploading}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Smart Folder Suggestions */}
                {suggestedFolders.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Suggested Folders</Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedFolders.map((folder) => (
                        <Button
                          key={folder.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFolderId(folder.id)}
                          className={cn(
                            "flex items-center gap-2",
                            selectedFolderId === folder.id && "border-primary bg-primary/10"
                          )}
                          disabled={isUploading}
                        >
                          <div className={cn("p-1 rounded", folderColors[folder.color as keyof typeof folderColors] || folderColors.blue)}>
                            {getFolderIcon(folder.icon || "default")}
                          </div>
                          {folder.name}
                          <Badge variant="secondary" className="text-xs">Suggested</Badge>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags Section */}
              <div className="grid gap-2">
                <Label htmlFor="tags-input" className="text-foreground">
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mb-2" role="group" aria-label="Current tags">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove tag: ${tag}`}
                        disabled={isUploading}
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="tags-input"
                    placeholder="Add a tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag(newTagInput)
                      }
                    }}
                    aria-label="Add new tag"
                    disabled={isUploading}
                  />
                  <Button
                    onClick={() => handleAddTag(newTagInput)}
                    disabled={!newTagInput.trim() || isUploading}
                    aria-label="Add tag"
                  >
                    <XIcon className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
                {suggestedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2" role="group" aria-label="Suggested tags">
                    <span className="text-sm text-muted-foreground">AI Suggested:</span>
                    {suggestedTags.map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 py-1 text-xs bg-transparent"
                        onClick={() => handleAddTag(tag)}
                        aria-label={`Add suggested tag: ${tag}`}
                        disabled={isUploading || tags.includes(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
              {error}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} aria-label="Cancel upload" disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading || !activeChild}
            aria-label="Confirm upload"
          >
            {isUploading ? `Uploading (${uploadProgress}%)` : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Document Capture Modal */}
      <DocumentCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onComplete={(pdfFile, documentName) => {
          setFile(pdfFile)
          setDocumentName(documentName)
          setIsCaptureModalOpen(false)
          toast({
            title: "Document captured successfully",
            description: `${documentName} has been captured and is ready for upload.`,
          })
        }}
      />
    </Dialog>
  )
}
