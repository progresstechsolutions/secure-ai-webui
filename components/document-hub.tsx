"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Folder, Download, Share2, Trash2 } from "lucide-react"

interface DocumentHubProps {
  onBack: () => void
}

interface Document {
  id: string
  name: string
  type: "document" | "folder"
  size?: string
  lastModified: string
  url?: string // For documents
  content?: Document[] // For folders
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Phelan-McDermid Syndrome Research.pdf",
    type: "document",
    size: "2.5 MB",
    lastModified: "2023-10-26",
    url: "/placeholder.pdf",
  },
  {
    id: "2",
    name: "Rett Syndrome Therapy Guidelines.docx",
    type: "document",
    size: "1.1 MB",
    lastModified: "2023-09-15",
    url: "/placeholder.docx",
  },
  {
    id: "3",
    name: "Fragile X Resources",
    type: "folder",
    lastModified: "2023-11-01",
    content: [
      {
        id: "3-1",
        name: "Educational Materials.pdf",
        type: "document",
        size: "3.2 MB",
        lastModified: "2023-10-28",
        url: "/placeholder.pdf",
      },
      {
        id: "3-2",
        name: "Support Groups.txt",
        type: "document",
        size: "0.1 MB",
        lastModified: "2023-09-20",
        url: "/placeholder.txt",
      },
    ],
  },
  {
    id: "4",
    name: "Angelman Syndrome Care Plan.xlsx",
    type: "document",
    size: "0.8 MB",
    lastModified: "2023-10-05",
    url: "/placeholder.xlsx",
  },
  {
    id: "5",
    name: "General Genetic Conditions Info",
    type: "folder",
    lastModified: "2023-11-10",
    content: [
      {
        id: "5-1",
        name: "Understanding Genetics.pdf",
        type: "document",
        size: "4.0 MB",
        lastModified: "2023-11-08",
        url: "/placeholder.pdf",
      },
      {
        id: "5-2",
        name: "Rare Disease Organizations.txt",
        type: "document",
        size: "0.2 MB",
        lastModified: "2023-11-05",
        url: "/placeholder.txt",
      },
    ],
  },
]

export function DocumentHub({ onBack }: DocumentHubProps) {
  const [currentPath, setCurrentPath] = useState<string[]>([]) // e.g., ["Fragile X Resources"]
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)

  const navigateToFolder = (folderName: string) => {
    setCurrentPath((prev) => [...prev, folderName])
  }

  const navigateBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1))
  }

  const currentFolderContent = currentPath.reduce((acc: Document[], pathSegment: string) => {
    const folder = acc.find((doc) => doc.type === "folder" && doc.name === pathSegment)
    return folder?.content || []
  }, documents)

  const filteredContent = currentFolderContent.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newDoc: Document = {
        id: String(Date.now()),
        name: file.name,
        type: "document",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toISOString().split("T")[0],
        url: URL.createObjectURL(file), // Create a temporary URL for preview
      }

      if (currentPath.length === 0) {
        setDocuments((prev) => [...prev, newDoc])
      } else {
        // This is a simplified way to add to nested folders.
        // In a real app, you'd need a more robust recursive update.
        const updateNestedContent = (docs: Document[], path: string[], newDoc: Document): Document[] => {
          if (path.length === 0) return [...docs, newDoc]
          const [currentSegment, ...restPath] = path
          return docs.map((doc) => {
            if (doc.name === currentSegment && doc.type === "folder") {
              return {
                ...doc,
                content: updateNestedContent(doc.content || [], restPath, newDoc),
              }
            }
            return doc
          })
        }
        setDocuments((prev) => updateNestedContent(prev, currentPath, newDoc))
      }
    }
  }

  const handleDelete = (idToDelete: string) => {
    const deleteFromContent = (docs: Document[]): Document[] => {
      return docs.filter((doc) => {
        if (doc.id === idToDelete) return false
        if (doc.type === "folder" && doc.content) {
          doc.content = deleteFromContent(doc.content)
        }
        return true
      })
    }
    setDocuments((prev) => deleteFromContent(prev))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-lg">
        <Button onClick={onBack} className="absolute left-4 top-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center justify-center py-4">
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md"
          />
        </div>
      </header>
      <main className="p-4">
        <Tabs defaultValue="documents">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <div className="grid grid-cols-1 gap-4">
              {filteredContent.map((doc) =>
                doc.type === "document" ? (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle>{doc.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{doc.size}</span>
                          <span className="text-sm text-muted-foreground ml-2">{doc.lastModified}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null,
              )}
            </div>
          </TabsContent>
          <TabsContent value="folders">
            <div className="grid grid-cols-1 gap-4">
              {filteredContent.map((doc) =>
                doc.type === "folder" ? (
                  <Card key={doc.id}>
                    <CardHeader>
                      <CardTitle>{doc.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-muted-foreground">{doc.lastModified}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" onClick={() => navigateToFolder(doc.name)}>
                            <Folder className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" onClick={() => handleDelete(doc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null,
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
