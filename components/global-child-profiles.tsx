"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChildProfiles } from "@/components/milestone/child-profiles"

interface GlobalChildProfilesProps {
  onClose: () => void
}

export function GlobalChildProfiles({ onClose }: GlobalChildProfilesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Manage Children</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        Add and manage your children's profiles. This information is used across all Caregene AI features.
      </div>

      <ChildProfiles />
    </div>
  )
}
