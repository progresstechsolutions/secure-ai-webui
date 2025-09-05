"use client"

import { useState } from "react"
import type { Document } from "./document-hub"

interface DocumentListProps {
  documents: Document[]
  onDelete: (documentId: string) => void
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getCategoryColor = (category: Document["category"]) => {
    const colors = {
      vaccination: "bg-green-100 text-green-800",
      prescription: "bg-blue-100 text-blue-800",
      "lab-result": "bg-purple-100 text-purple-800",
      "visit-summary": "bg-orange-100 text-orange-800",
      insurance: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.other
  }

  const getCategoryLabel = (category: Document["category"]) => {
    const labels = {
      vaccination: "Vaccination",
      prescription: "Prescription",
      "lab-result": "Lab Result",
      "visit-summary": "Visit Summary",
      insurance: "Insurance",
      other: "Other",
    }
    return labels[category] || "Other"
  }

  const handleDelete = (documentId: string) => {
    onDelete(documentId)
    setDeleteConfirm(null)
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-500 mb-2">No documents found</h3>
        <p className="text-sm text-gray-400">Upload your first document or adjust your search filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-medium text-gray-900 truncate pr-2">{document.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getCategoryColor(document.category)}`}>
                  {getCategoryLabel(document.category)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>{formatFileSize(document.size)}</span>
                <span>{formatDate(document.uploadDate)}</span>
              </div>

              {document.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {document.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">View</button>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
              <button
                onClick={() => setDeleteConfirm(document.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Document</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
