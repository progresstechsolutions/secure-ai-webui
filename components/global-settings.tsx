"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MilestoneSettings } from "@/components/milestone/milestone-settings"

interface GlobalSettingsProps {
  onClose: () => void
}

export function GlobalSettings({ onClose }: GlobalSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Manage your preferences and settings across all Caregene AI features.
      </div>

      <MilestoneSettings />
    </div>
  )
}
