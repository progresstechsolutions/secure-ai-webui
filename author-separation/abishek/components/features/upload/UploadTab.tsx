"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useChildProfile } from "@/contexts/child-profile-context"
import { useDocuments } from "@/contexts/document-context"
import DocumentUpload from "@/components/features/upload/DocumentUpload"
import {
  Upload,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"

export function UploadTab() {
  const { activeChild } = useChildProfile()
  const { documents, getDocumentsByChild } = useDocuments()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const childDocuments = activeChild ? getDocumentsByChild(activeChild.id) : []

  // Calculate statistics
  const totalDocuments = childDocuments.length
  const totalSize = childDocuments.reduce((sum, doc) => sum + doc.size, 0)
  const recentUploads = childDocuments
    .filter((doc) => {
      const daysSinceUpload = (Date.now() - doc.uploadDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceUpload <= 7
    })
    .length

  // AI Summary status
  const documentsWithAI = childDocuments.filter((doc) => doc.aiSummary && doc.aiSummary !== "Generating AI summary...").length
  const documentsGeneratingAI = childDocuments.filter((doc) => doc.aiSummary === "Generating AI summary...").length

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Child Selected</h3>
          <p className="text-muted-foreground">Please select a child to upload documents.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Upload Documents</h1>
        <p className="text-muted-foreground">
          Upload and manage documents for {activeChild.name}.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              {recentUploads} uploaded this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
            <p className="text-xs text-muted-foreground">
              Average {totalDocuments > 0 ? formatFileSize(totalSize / totalDocuments) : "0 Bytes"} per document
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Summaries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentsWithAI}</div>
            <p className="text-xs text-muted-foreground">
              {documentsGeneratingAI} generating...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentUploads}</div>
            <p className="text-xs text-muted-foreground">
              Documents uploaded this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to upload?</h3>
            <p className="text-muted-foreground mb-6">
              Upload documents for {activeChild.name} and let AI help you organize them.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)} size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Status */}
      <Card>
        <CardHeader>
          <CardTitle>AI Summary Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">{documentsWithAI}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">{documentsGeneratingAI}</p>
                <p className="text-sm text-muted-foreground">Generating</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium">{totalDocuments - documentsWithAI - documentsGeneratingAI}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <DocumentUpload isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  )
}
