"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChildProfiles } from "@/components/milestone/child-profiles"

interface GlobalChildProfilesProps {
  onClose: () => void
}

export function GlobalChildProfiles({ onClose }: GlobalChildProfilesProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        
      </div>

      <div className="pb-8">
        <ChildProfiles />
      </div>
    </div>
  )
}
