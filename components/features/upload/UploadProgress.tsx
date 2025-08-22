"use client"

import { CheckCircle, AlertCircle, Upload } from "lucide-react"
import { cn } from "../../../lib/utils"

interface UploadProgressProps {
  totalFiles: number
  completedFiles: number
  errorFiles: number
  currentFile?: string
  className?: string
}

export function UploadProgress({
  totalFiles,
  completedFiles,
  errorFiles,
  currentFile,
  className,
}: UploadProgressProps) {
  const progressPercentage = Math.round((completedFiles / totalFiles) * 100)
  const remainingFiles = totalFiles - completedFiles - errorFiles

  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite">
      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">Upload Progress</span>
          <span className="text-muted-foreground">
            {completedFiles} of {totalFiles} completed
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall upload progress: ${progressPercentage}%`}
          />
        </div>
      </div>

      {/* Current File */}
      {currentFile && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 animate-pulse" />
          <span>Uploading: {currentFile}</span>
        </div>
      )}

      {/* Status Summary */}
      <div className="flex items-center gap-4 text-sm">
        {completedFiles > 0 && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{completedFiles} completed</span>
          </div>
        )}

        {errorFiles > 0 && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{errorFiles} failed</span>
          </div>
        )}

        {remainingFiles > 0 && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>{remainingFiles} remaining</span>
          </div>
        )}
      </div>
    </div>
  )
}
