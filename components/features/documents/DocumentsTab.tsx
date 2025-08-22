"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "../../ui/dropdown-menu"
import { useChildProfile } from "../../../contexts/child-profile-context"
import { useDocuments } from "../../../contexts/document-context"
import { useToast } from "../../../hooks/use-toast"
import { DocumentViewer } from "../../features/document-viewer/DocumentViewer"
import { FolderSidebar } from "../../features/folders/FolderSidebar"
import { MoveDocumentModal } from "../../features/folders/MoveDocumentModal"
import { DeleteDocumentDialog } from "../../features/documents/DeleteDocumentDialog"
import { RecoverDocumentDialog } from "../../features/documents/RecoverDocumentDialog"
import { AddTaggingModal } from "../../features/documents/AddTaggingModal"
import {
  AlertCircle,
  Filter,
  LayoutGrid,
  List,
  FileTextIcon,
  ImageIcon,
  FileIcon,
  Eye,
  FileSpreadsheetIcon,
  FileIcon as FilePresentationIcon,
  FileVideoIcon,
  FileAudioIcon,
  ArchiveIcon,
  Download,
  Move,
  Folder,
  FolderOpen,
  Trash2,
  RotateCcw,
  Plus,
  Tag,
} from "lucide-react"
import { cn } from "../../../lib/utils"
import type { Document } from "../../../contexts/document-context"

export function DocumentsTab() {
  const { activeChild } = useChildProfile()
  const { documents, getDocumentsByChild, getDocumentsByFolder, getFoldersByChild, softDeleteDocument, getDeletedDocuments } = useDocuments()
  const { toast } = useToast()
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterTags, setFilterTags] = useState<string[]>([]) // Tag filter state
  
  // Folder state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>("all-documents")
  const [showFolderSidebar, setShowFolderSidebar] = useState(true)
  
  // Document viewer state
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  
  // Move document modal state
  const [moveDocument, setMoveDocument] = useState<Document | null>(null)
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
  
  // Delete document modal state
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // Recover document modal state
  const [recoverDocument, setRecoverDocument] = useState<Document | null>(null)
  const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false)
  
  // Add tagging modal state
  const [taggingDocument, setTaggingDocument] = useState<Document | null>(null)
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false)

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setShowFolderSidebar(false)
      }
    }
    
    handleResize() // Run on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const childDocuments = activeChild ? getDocumentsByChild(activeChild.id) : []
  const childFolders = activeChild ? getFoldersByChild(activeChild.id) : []
  
  // Get documents based on selected folder
  const getFilteredDocuments = () => {
    if (!activeChild) return []
    
    if (selectedFolderId === "deleted-folder") {
      // Show deleted documents
      return getDeletedDocuments(activeChild.id)
    } else if (selectedFolderId === "all-documents") {
      // Show all documents for the active child
      return getDocumentsByFolder(selectedFolderId, activeChild.id)
    } else if (selectedFolderId === null) {
      // Show unassigned documents
      return childDocuments.filter(doc => doc.folderId === null)
    } else {
      // Show documents in selected folder
      return getDocumentsByFolder(selectedFolderId)
    }
  }

  const currentDocuments = getFilteredDocuments()
  const selectedFolder = selectedFolderId ? childFolders.find(f => f.id === selectedFolderId) : null

  // Memoized utility functions
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }, [])

  const handleDocumentView = useCallback((doc: Document) => {
    setSelectedDocument(doc)
    setIsViewerOpen(true)
  }, [])

  const handleDownload = useCallback((doc: Document) => {
    if (doc.url) {
      const link = globalThis.document.createElement("a")
      link.href = doc.url
      link.download = doc.name
      link.click()
    } else {
      toast({
        title: "Download not available",
        description: "Document download is not available at this time.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleMoveDocument = useCallback((doc: Document) => {
    setMoveDocument(doc)
    setIsMoveModalOpen(true)
  }, [])

  const handleDeleteDocument = useCallback((doc: Document) => {
    setDeleteDocument(doc)
    setIsDeleteModalOpen(true)
  }, [])

  const handleRecoverDocument = useCallback((doc: Document) => {
    setRecoverDocument(doc)
    setIsRecoverModalOpen(true)
  }, [])

  const handleAddTagging = useCallback((doc: Document) => {
    setTaggingDocument(doc)
    setIsTaggingModalOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (deleteDocument) {
      softDeleteDocument(deleteDocument.id)
      toast({
        title: "Document Deleted",
        description: `"${deleteDocument.name}" has been moved to the Deleted folder.`,
        duration: 3000,
      })
      setIsDeleteModalOpen(false)
      setDeleteDocument(null)
    }
  }, [deleteDocument, softDeleteDocument, toast])

  const allTags = Array.from(new Set(currentDocuments.flatMap((doc) => doc.tags)))

  const filteredDocuments = currentDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.aiSummary && doc.aiSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.keyHighlights && doc.keyHighlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesTags = filterTags.length === 0 || filterTags.some(tag => doc.tags.includes(tag))
    return matchesSearch && matchesCategory && matchesTags
  })

  const handleTagFilterToggle = (tag: string) => {
    setFilterTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const getFileIcon = (type: Document["type"]) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-purple-500" />
    if (type.includes("pdf")) return <FileTextIcon className="h-5 w-5 text-red-500" />
    if (type.includes("spreadsheet") || type.includes("excel")) return <FileSpreadsheetIcon className="h-5 w-5 text-green-500" />
    if (type.includes("presentation") || type.includes("powerpoint")) return <FilePresentationIcon className="h-5 w-5 text-orange-500" />
    if (type.startsWith("video/")) return <FileVideoIcon className="h-5 w-5 text-pink-500" />
    if (type.startsWith("audio/")) return <FileAudioIcon className="h-5 w-5 text-yellow-500" />
    if (type.includes("zip") || type.includes("rar")) return <ArchiveIcon className="h-5 w-5 text-gray-500" />
    return <FileIcon className="h-5 w-5 text-gray-500" />
  }

  const getFileTypeLabel = (type: Document["type"]) => {
    if (type.startsWith("image/")) return "Image"
    if (type.includes("pdf")) return "PDF"
    if (type.includes("spreadsheet") || type.includes("excel")) return "Spreadsheet"
    if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation"
    if (type.startsWith("video/")) return "Video"
    if (type.startsWith("audio/")) return "Audio"
    if (type.includes("zip") || type.includes("rar")) return "Archive"
    return "Document"
  }

  const getDaysRemaining = (deletedAt: Date) => {
    const now = new Date()
    const deletedDate = new Date(deletedAt)
    const daysElapsed = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, 30 - daysElapsed)
  }

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Child Selected</h3>
          <p className="text-muted-foreground">Please select a child to view their documents.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Folder Sidebar */}
      {showFolderSidebar && (
        <div className="w-full lg:w-80 flex-shrink-0 border-r border-border">
          <FolderSidebar
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            onToggle={() => setShowFolderSidebar(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground truncate">
                {selectedFolder ? selectedFolder.name : "Unassigned Documents"}
              </h1>
              <p className="text-muted-foreground">
                {selectedFolder 
                  ? `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''} in this folder`
                  : `${filteredDocuments.length} unassigned document${filteredDocuments.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            {!showFolderSidebar && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFolderSidebar(true)}
                className="ml-2 flex-shrink-0"
              >
                <Folder className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Show Folders</span>
              </Button>
            )}
          </div>
        </header>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0"
                aria-label="Search documents by name or content"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vaccination">Vaccination Records</SelectItem>
                  <SelectItem value="prescription">Prescriptions</SelectItem>
                  <SelectItem value="lab-result">Lab Results</SelectItem>
                  <SelectItem value="visit-summary">Visit Summaries</SelectItem>
                  <SelectItem value="insurance">Insurance Documents</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent flex-1 sm:flex-none"
                    aria-label="Filter documents by tags"
                  >
                    <Tag className="h-4 w-4" /> 
                    <span className="hidden sm:inline">Filter by Tags</span>
                    {filterTags.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                        {filterTags.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Tags</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allTags.map((tag) => (
                    <DropdownMenuItem key={tag} onSelect={(e) => e.preventDefault()}>
                      <label className="flex items-center gap-2 cursor-pointer w-full">
                        <input
                          type="checkbox"
                          checked={filterTags.includes(tag)}
                          onChange={() => handleTagFilterToggle(tag)}
                          className="form-checkbox h-4 w-4 text-primary rounded"
                        />
                        {tag}
                      </label>
                    </DropdownMenuItem>
                  ))}
                  {allTags.length === 0 && <DropdownMenuItem disabled>No tags available</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Placeholder for future Filter button */}
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent flex-1 sm:flex-none"
                aria-label="Filter documents"
                disabled
              >
                <Filter className="h-4 w-4" /> 
                <span className="hidden sm:inline">Filter</span>
              </Button>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  aria-label="Switch to grid view"
                  className={cn(viewMode === "grid" && "bg-muted")}
                >
                  <LayoutGrid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  aria-label="Switch to list view"
                  className={cn(viewMode === "list" && "bg-muted")}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg">
                {currentDocuments.length === 0 
                  ? selectedFolder 
                    ? "No documents in this folder yet." 
                    : "No unassigned documents."
                  : "No documents found."
                }
              </p>
              <p className="text-sm">
                {currentDocuments.length === 0
                  ? selectedFolder 
                    ? "Move documents here or upload new ones."
                    : "Upload documents or move them from folders."
                  : "Try adjusting your search or tag filters."}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                viewMode === "list" && "grid-cols-1",
              )}
            >
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className={cn(viewMode === "list" && "flex items-center gap-4 p-4", viewMode === "grid" && "min-h-[280px]")}>
                  <CardContent className={cn("p-6", viewMode === "list" && "flex-grow min-w-0")}>
                    <div className={cn("flex items-center gap-2 mb-2", viewMode === "list" && "mb-0")}>
                      {getFileIcon(doc.type)}
                      <h3
                        className={cn("font-semibold truncate flex-1 text-base", viewMode === "list" && "text-base")}
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                    </div>
                    {viewMode === "grid" && (
                      <>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{doc.aiSummary}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {doc.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatFileSize(doc.size)} • {getFileTypeLabel(doc.type)} •{" "}
                          {doc.uploadDate.toLocaleDateString()}
                        </div>
                        
                        {/* AI Summary Status */}
                        {doc.aiSummary === "Generating AI summary..." && (
                          <div className="flex items-center gap-1 mt-2">
                            <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full"></div>
                            <span className="text-xs text-muted-foreground">Generating AI summary...</span>
                          </div>
                        )}
                      </>
                    )}
                    {viewMode === "list" && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {doc.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">+{doc.tags.length - 3} more</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground sm:ml-auto">
                          {formatFileSize(doc.size)} • {getFileTypeLabel(doc.type)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <div className={cn("p-6 border-t", viewMode === "list" && "border-t-0 border-l pl-4")}>
                    {/* Show deletion info for deleted documents */}
                    {doc.deletedAt && (
                      <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                        <p className="font-medium">Deleted {doc.deletedAt.toLocaleDateString()}</p>
                        <p>{getDaysRemaining(doc.deletedAt)} days remaining before permanent deletion</p>
                      </div>
                    )}
                    
                    <div className={cn(
                      "gap-1 sm:gap-2",
                      viewMode === "grid" 
                        ? showFolderSidebar
                          ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2" // Two rows when sidebar is expanded
                          : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" // Single row when sidebar is collapsed
                        : "flex flex-wrap"
                    )}>
                      <Button variant="outline" size="sm" onClick={() => handleDocumentView(doc)} className={cn(
                        "flex items-center justify-center min-w-[80px]",
                        viewMode === "list" && "flex-1 sm:flex-none"
                      )}>
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-xs sm:text-sm">View</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(doc)} 
                        className={cn(
                          "flex items-center justify-center min-w-[80px]",
                          viewMode === "list" && "flex-1 sm:flex-none"
                        )}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        <span className="text-xs sm:text-sm">Download</span>
                      </Button>
                      
                      {!doc.deletedAt && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddTagging(doc)} 
                          className={cn(
                            "flex items-center justify-center min-w-[80px]",
                            viewMode === "list" && "flex-1 sm:flex-none"
                          )}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Tag</span>
                        </Button>
                      )}
                      
                      {doc.deletedAt ? (
                        // Recovery button for deleted documents
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRecoverDocument(doc)} 
                          className={cn(
                            "flex items-center justify-center min-w-[80px] bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
                            viewMode === "list" && "flex-1 sm:flex-none"
                          )}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          <span className="text-xs sm:text-sm">Recover</span>
                        </Button>
                      ) : (
                        // Move and Delete buttons for active documents
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleMoveDocument(doc)} className={cn(
                            "flex items-center justify-center min-w-[80px]",
                            viewMode === "list" && "flex-1 sm:flex-none"
                          )}>
                            <Move className="h-4 w-4 mr-1" />
                            <span className="text-xs sm:text-sm">Move</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteDocument(doc)} 
                            className={cn(
                              "flex items-center justify-center min-w-[80px] bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
                              viewMode === "list" && "flex-1 sm:flex-none"
                            )}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs sm:text-sm">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false)
            setSelectedDocument(null)
          }}
        />
      )}

      {/* Move Document Modal */}
      {moveDocument && (
        <MoveDocumentModal
          document={moveDocument}
          isOpen={isMoveModalOpen}
          onClose={() => {
            setIsMoveModalOpen(false)
            setMoveDocument(null)
          }}
        />
      )}

      {/* Delete Document Modal */}
      {deleteDocument && (
        <DeleteDocumentDialog
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setDeleteDocument(null)
          }}
          onConfirm={handleConfirmDelete}
          documentName={deleteDocument.name}
        />
      )}

      {/* Recover Document Modal */}
      {recoverDocument && (
        <RecoverDocumentDialog
          isOpen={isRecoverModalOpen}
          onClose={() => {
            setIsRecoverModalOpen(false)
            setRecoverDocument(null)
          }}
          documentId={recoverDocument.id}
          documentName={recoverDocument.name}
          originalFolderId={recoverDocument.originalFolderId}
          childId={activeChild?.id || ""}
        />
      )}

      {/* Add Tagging Modal */}
      {taggingDocument && (
        <AddTaggingModal
          isOpen={isTaggingModalOpen}
          onClose={() => {
            setIsTaggingModalOpen(false)
            setTaggingDocument(null)
          }}
          document={taggingDocument}
        />
      )}
    </div>
  )
}
