"use client"

import { useState } from "react"
import { DocumentUpload } from "./document-upload"
import { DocumentSearch } from "./document-search"
import { DocumentList } from "./document-list"
import { ChildSelector } from "./child-selector"

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: "vaccination" | "prescription" | "lab-result" | "visit-summary" | "insurance" | "other"
  childId: string
  tags: string[]
}

export interface Child {
  id: string
  name: string
  age: number
  dateOfBirth: string
}

export function DocumentHub() {
  const [children] = useState<Child[]>([
    {
      id: "child-1",
      name: "Emma Johnson",
      age: 8,
      dateOfBirth: "2016-03-15",
    },
    {
      id: "child-2",
      name: "Liam Johnson",
      age: 5,
      dateOfBirth: "2019-07-22",
    },
  ])

  const [activeChild, setActiveChild] = useState<Child | null>(children[0] || null)

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Annual Checkup Report 2024.pdf",
      type: "application/pdf",
      size: 2048000,
      uploadDate: new Date("2024-01-15"),
      category: "visit-summary",
      childId: "child-1",
      tags: ["annual", "checkup", "2024"],
    },
    {
      id: "2",
      name: "Vaccination Record.pdf",
      type: "application/pdf",
      size: 1024000,
      uploadDate: new Date("2024-02-10"),
      category: "vaccination",
      childId: "child-1",
      tags: ["vaccination", "immunization"],
    },
    {
      id: "3",
      name: "Blood Test Results.pdf",
      type: "application/pdf",
      size: 512000,
      uploadDate: new Date("2024-03-05"),
      category: "lab-result",
      childId: "child-2",
      tags: ["blood", "lab", "results"],
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleDocumentUpload = (newDocuments: Document[]) => {
    setDocuments((prev) => [...prev, ...newDocuments])
  }

  const handleDocumentDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesChild = !activeChild || doc.childId === activeChild.id
    const matchesSearch =
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory

    return matchesChild && matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Child Profile</h2>
        <ChildSelector children={children} activeChild={activeChild} onChildChange={setActiveChild} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Documents</h3>
          <p className="text-2xl font-bold text-gray-900">{filteredDocuments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500">Storage Used</h3>
          <p className="text-2xl font-bold text-gray-900">
            {(filteredDocuments.reduce((sum, doc) => sum + doc.size, 0) / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500">Categories</h3>
          <p className="text-2xl font-bold text-gray-900">
            {new Set(filteredDocuments.map((doc) => doc.category)).size}
          </p>
        </div>
      </div>

      {/* Upload and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
          <DocumentUpload onUpload={handleDocumentUpload} activeChild={activeChild} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
          <DocumentSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Documents ({filteredDocuments.length})</h2>
        <DocumentList documents={filteredDocuments} onDelete={handleDocumentDelete} />
      </div>
    </div>
  )
}
