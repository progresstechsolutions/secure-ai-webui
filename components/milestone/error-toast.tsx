"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorToastProps {
  message: string
  onRetry?: () => void
  onDismiss: () => void
  autoHide?: boolean
}

export function ErrorToast({ message, onRetry, onDismiss, autoHide = true }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Allow fade out animation
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [autoHide, onDismiss])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-800">{message}</p>

            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-2 h-8 text-xs border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(onDismiss, 300)
            }}
            className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
