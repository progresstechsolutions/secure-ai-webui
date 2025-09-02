"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"
// import type { JournalEntry, LoggingMode, LoggingStep } from "@/types/journal"
// import { VoiceRecorder } from "./voice-recorder"
// import { TextEntry } from "./text-entry"
// import { EntryReview } from "./entry-review"
// import { JournalService } from "@/lib/journal-service"

interface LoggingContainerProps {
  onClose?: () => void
  onSave?: (entry: any) => void
  initialEntry?: any
  className?: string
}

export function LoggingContainer({ onClose, onSave, initialEntry, className }: LoggingContainerProps) {
  const [currentStep, setCurrentStep] = useState("mode")

  return (
    <div className={cn("fixed inset-0 z-50 bg-white", "flex flex-col", className)}>
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2" aria-label="Close">
          <X className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">New Entry</h1>
        <div className="w-9" />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Logging System</h2>
            <p className="text-gray-600 mb-4">This is a simplified version for testing.</p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  // Simple mock entry
                  const mockEntry = {
                    id: Date.now().toString(),
                    date: new Date(),
                    mode: "text",
                    summary: "Test entry",
                    tags: [],
                    meds: [],
                    symptoms: [],
                    attachments: [],
                    createdAt: new Date(),
                  }
                  onSave?.(mockEntry)
                  onClose?.()
                }}
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              >
                Save Test Entry
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
