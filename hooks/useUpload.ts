"use client"

import { useState, useCallback } from "react"
import type { UploadFile } from "../components/features/upload/DocumentUpload"
import type { Folder } from "../components/features/folders-dashboard/FoldersDashboard"

interface UploadOptions {
  childId: string
  onProgress?: (fileId: string, progress: number) => void
  onError?: (fileId: string, error: string) => void
}

interface UploadResult {
  fileId: string
  success: boolean
  error?: string
  documentId?: string
}

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false)

  const uploadFiles = useCallback(async (files: UploadFile[], options: UploadOptions): Promise<UploadResult[]> => {
    setIsUploading(true)
    const results: UploadResult[] = []

    try {
      for (const file of files) {
        try {
          // Simulate upload progress
          const progressInterval = setInterval(() => {
            const currentProgress = Math.min(file.progress + Math.random() * 20, 95)
            options.onProgress?.(file.id, currentProgress)
          }, 200)

          // Simulate upload time based on file size
          const uploadTime = Math.min(file.size / 100000, 5000) // Max 5 seconds
          await new Promise((resolve) => setTimeout(resolve, uploadTime))

          clearInterval(progressInterval)

          // Simulate occasional failures (5% chance)
          if (Math.random() < 0.05) {
            throw new Error("Network error occurred during upload")
          }

          // Complete upload
          options.onProgress?.(file.id, 100)

          results.push({
            fileId: file.id,
            success: true,
            documentId: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Upload failed"
          options.onError?.(file.id, errorMessage)
          results.push({
            fileId: file.id,
            success: false,
            error: errorMessage,
          })
        }
      }

      return results
    } finally {
      setIsUploading(false)
    }
  }, [])

  const createFolder = useCallback(
    async (folderData: Omit<Folder, "id" | "createdAt" | "updatedAt" | "documentCount" | "folderCount">) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newFolder: Folder = {
        ...folderData,
        id: `folder-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        documentCount: 0,
        folderCount: 0,
      }

      return newFolder
    },
    [],
  )

  return {
    uploadFiles,
    createFolder,
    isUploading,
  }
}
