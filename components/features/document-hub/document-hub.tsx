"use client"

import { useState, useCallback } from "react"
import { DocumentUpload } from "./document-upload"
import { DocumentSearch } from "./document-search"
import { DocumentList } from "./document-list"
import { DocumentStats } from "./document-stats"
import { ChildSelector } from "./child-selector"
import { useChildProfile } from "@/contexts/child-profile-context"
import { useDocuments } from "@/contexts/document-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Upload, Search, BarChart3 } from "lucide-react"

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: "vaccination" | "prescription" | "lab-result" | "visit-summary" | "insurance" | "other"
  childId: string
  tags: string[]
  url?: string
  aiSummary?: string
  keyHighlights?: string[]
}

export function DocumentHub() {
  const { activeChild } = useChildProfile()
  const { documents, getDocumentsByChild, deleteDocument } = useDocuments()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Get documents for the active child from the global context
  const childDocuments = activeChild ? getDocumentsByChild(activeChild.id) : []

  const handleDocumentUpload = useCallback((newDocuments: Document[]) => {
    // This is now handled by the global context in the upload component
    console.log("Documents uploaded:", newDocuments)
  }, [])

  const handleDocumentDelete = useCallback((documentId: string) => {
    deleteDocument(documentId)
  }, [deleteDocument])

  const filteredDocuments = childDocuments.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Child Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChildSelector />
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <DocumentStats documents={filteredDocuments} />

      {/* Upload and Search Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload onUpload={handleDocumentUpload} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Documents ({filteredDocuments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList documents={filteredDocuments} onDelete={handleDocumentDelete} />
        </CardContent>
      </Card>
    </div>
  )
}
