"use client"

import { useState, useEffect } from "react"
import { Settings, User, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getChildren, type Child } from "@/lib/milestone-data-layer"
import { GlobalChildProfiles } from "@/components/global-child-profiles"
import { GlobalSettings } from "@/components/global-settings"

interface GlobalHeaderProps {
  selectedChildId?: string
  onChildSelect?: (childId: string) => void
  showChildSelector?: boolean
}

export function GlobalHeader({ selectedChildId, onChildSelect, showChildSelector = true }: GlobalHeaderProps) {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [showChildModal, setShowChildModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  useEffect(() => {
    try {
      const loadedChildren = getChildren() || []
      setChildren(loadedChildren)

      if (selectedChildId) {
        const child = loadedChildren.find((c) => c.id === selectedChildId)
        setSelectedChild(child || null)
      } else if (loadedChildren.length > 0) {
        setSelectedChild(loadedChildren[0])
        onChildSelect?.(loadedChildren[0].id)
      }
    } catch (error) {
      console.error("Error loading children:", error)
      setChildren([])
    }
  }, [selectedChildId, onChildSelect])

  const handleChildSelect = (child: Child) => {
    setSelectedChild(child)
    onChildSelect?.(child.id)
  }

  return (
    <div className="fixed top-0 right-0 z-40 p-4 flex items-center gap-3">
      {/* Child Selector */}
      {showChildSelector && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/95 backdrop-blur border-gray-200 hover:bg-gray-50"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                {selectedChild ? (
                  selectedChild.photo ? (
                    <img
                      src={selectedChild.photo || "/placeholder.svg"}
                      alt={selectedChild.firstName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-3 h-3 text-blue-600" />
                  )
                ) : (
                  <User className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span className="text-sm font-medium">{selectedChild ? selectedChild.firstName : "Select Child"}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {children.map((child) => (
              <DropdownMenuItem
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {child.photo ? (
                    <img
                      src={child.photo || "/placeholder.svg"}
                      alt={child.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{child.firstName}</div>
                  <div className="text-xs text-gray-500">
                    {Math.floor((Date.now() - new Date(child.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}{" "}
                    years old
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowChildModal(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Manage Children
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Settings Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSettingsModal(true)}
        className="bg-white/95 backdrop-blur border-gray-200 hover:bg-gray-50"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {/* Child Management Modal */}
      <Dialog open={showChildModal} onOpenChange={setShowChildModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <GlobalChildProfiles onClose={() => setShowChildModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <GlobalSettings onClose={() => setShowSettingsModal(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
