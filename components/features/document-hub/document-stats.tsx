"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, Calendar, HardDrive } from "lucide-react"
import type { Document } from "./document-hub"

interface DocumentStatsProps {
  documents: Document[]
}

export function DocumentStats({ documents }: DocumentStatsProps) {
  const totalDocuments = documents.length
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0)
  const recentDocuments = documents.filter(
    (doc) => new Date().getTime() - doc.uploadDate.getTime() < 30 * 24 * 60 * 60 * 1000,
  ).length

  const categoryStats = documents.reduce(
    (acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const mostCommonCategory = Object.entries(categoryStats).reduce(
    (max, [category, count]) => (count > max.count ? { category, count } : max),
    { category: "none", count: 0 },
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDocuments}</div>
          <p className="text-xs text-muted-foreground">
            {mostCommonCategory.count > 0 && (
              <>
                Most: {mostCommonCategory.category.replace("-", " ")} ({mostCommonCategory.count})
              </>
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          <p className="text-xs text-muted-foreground">
            Avg: {totalDocuments > 0 ? formatFileSize(totalSize / totalDocuments) : "0 Bytes"} per doc
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentDocuments}</div>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Object.keys(categoryStats).length}</div>
          <p className="text-xs text-muted-foreground">Document types</p>
        </CardContent>
      </Card>
    </div>
  )
}
