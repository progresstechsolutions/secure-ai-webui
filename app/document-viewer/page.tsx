"use client"

import { useState } from "react"
import { DocumentViewer } from "@/components/features/document-viewer/DocumentViewer"
import type { Document } from "@/contexts/document-context"

export default function DocumentViewerPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Mock document for testing
  const mockDocument: Document = {
    id: "test-doc-1",
    name: "Sample Document.pdf",
    type: "application/pdf",
    size: 1024 * 1024, // 1MB
    uploadDate: new Date(),
    category: "other",
    tags: ["sample", "test"],
    childId: "child-1",
    url: "/placeholder.svg?height=800&width=600&text=Sample+Document",
    content: "This is a sample document content for testing the document viewer.",
    aiSummary: "This is a sample document with test content for demonstrating the document viewer functionality.",
    keyHighlights: ["Sample content", "Test document", "Viewer demonstration"],
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Document Viewer Test</h1>
      <button
        onClick={() => setSelectedDocument(mockDocument)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Document Viewer
      </button>
      
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  )
}
