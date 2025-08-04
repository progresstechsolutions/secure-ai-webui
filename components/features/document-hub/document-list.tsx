"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { useChildProfile } from "@/contexts/child-profile-context"
import { useDocuments } from "@/contexts/document-context"
import { useToast } from "@/hooks/use-toast"
import { DocumentViewer } from "@/components/features/document-viewer/DocumentViewer"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Document } from "@/contexts/document-context"

export function DocumentList() {
  const { activeChild } = useChildProfile()
  const { documents, getDocumentsByChild } = useDocuments()
  const { toast } = useToast()
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterTags, setFilterTags] = useState<string[]>([])
  
  // Document viewer state
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const childDocuments = activeChild ? getDocumentsByChild(activeChild.id) : []

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

  const allTags = Array.from(new Set(childDocuments.flatMap((doc) => doc.tags)))

  const filteredDocuments = childDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.aiSummary && doc.aiSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.keyHighlights && doc.keyHighlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
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

  if (childDocuments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
          <p className="text-muted-foreground">No documents have been uploaded for {activeChild.name} yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-md"
          aria-label="Search documents by name or content"
        />
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                aria-label="Filter documents by tags"
              >
                <Filter className="h-4 w-4" /> Filter
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
            {childDocuments.length === 0 ? "No documents uploaded yet." : "No documents found."}
          </p>
          <p className="text-sm">
            {childDocuments.length === 0
              ? "Upload your first document to get started."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            viewMode === "list" && "grid-cols-1",
          )}
        >
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className={cn(viewMode === "list" && "flex items-center gap-4 p-4")}>
              <CardContent className={cn("p-4", viewMode === "list" && "flex-grow")}>
                <div className={cn("flex items-center gap-2 mb-2", viewMode === "list" && "mb-0")}>
                  {getFileIcon(doc.type)}
                  <h3
                    className={cn("font-semibold truncate", viewMode === "list" && "text-base")}
                    title={doc.name}
                  >
                    {doc.name}
                  </h3>
                </div>
                {viewMode === "grid" && (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{doc.aiSummary}</p>
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
                  <div className="flex items-center gap-4 mt-2">
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
                    <div className="text-xs text-muted-foreground ml-auto">
                      {formatFileSize(doc.size)} • {getFileTypeLabel(doc.type)}
                    </div>
                  </div>
                )}
              </CardContent>
              <div className={cn("p-4 border-t", viewMode === "list" && "border-t-0 border-l pl-4")}>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDocumentView(doc)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
          </Card>
        ))}
      </div>
      )}

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
          </div>
  )
}
