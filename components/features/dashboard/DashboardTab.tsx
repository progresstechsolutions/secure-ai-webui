"use client"

import { useChildProfile } from "@/contexts/child-profile-context"
import { useDocuments } from "@/contexts/document-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Upload,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileIcon,
  ImageIcon,
  FileSpreadsheetIcon,
  Presentation,
  FileVideoIcon,
  FileAudioIcon,
  ArchiveIcon,
  Users,
  Search,
  Plus,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardTab() {
  const { activeChild } = useChildProfile()
  const { documents, getDocumentsByChild } = useDocuments()

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

  // Document type breakdown
  const documentTypes = childDocuments.reduce((acc, doc) => {
    const type = doc.type.split("/")[0]
      acc[type] = (acc[type] || 0) + 1
      return acc
  }, {} as Record<string, number>)

  // Category breakdown
  const categoryCounts = childDocuments.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

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

  const getCategoryColor = (category: string) => {
    const colors = {
      vaccination: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      prescription: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "lab-result": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "visit-summary": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      insurance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      vaccination: "Vaccination",
      prescription: "Prescription",
      "lab-result": "Lab Result",
      "visit-summary": "Visit Summary",
      insurance: "Insurance",
      other: "Other",
    }
    return labels[category as keyof typeof labels] || "Other"
  }

  const handleQuickAction = (action: string) => {
    window.location.hash = action
    window.dispatchEvent(new CustomEvent("navigation-change", { detail: { tab: action } }))
  }

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Child Selected</h3>
          <p className="text-muted-foreground">Please select a child to view their dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of {activeChild.name}'s document management.
        </p>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction("upload")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">Add new documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction("documents")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold">View Documents</h3>
                <p className="text-sm text-muted-foreground">Browse all documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

                        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction("patient-management")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                                  <h3 className="font-semibold">Patient Management</h3>
                <p className="text-sm text-muted-foreground">Add or edit profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleQuickAction("dashboard")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Search className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold">Search & Filter</h3>
                <p className="text-sm text-muted-foreground">Find specific documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Statistics */}
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

      {/* Document Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getCategoryColor(category))}>
                      {getCategoryLabel(category)}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              {Object.keys(categoryCounts).length === 0 && (
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              )}
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                {Object.entries(documentTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {type === "image" && <ImageIcon className="h-4 w-4 text-purple-500" />}
                    {type === "application" && <FileIcon className="h-4 w-4 text-blue-500" />}
                    {type === "text" && <FileText className="h-4 w-4 text-green-500" />}
                    {type === "audio" && <FileAudioIcon className="h-4 w-4 text-yellow-500" />}
                    {type === "video" && <FileVideoIcon className="h-4 w-4 text-pink-500" />}
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(documentTypes).length === 0 && (
                <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}
