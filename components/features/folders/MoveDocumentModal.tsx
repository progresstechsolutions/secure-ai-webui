"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDocuments } from "@/contexts/document-context"
import { useChildProfile } from "@/contexts/child-profile-context"
import { useToast } from "@/hooks/use-toast"
import {
  Folder,
  FolderOpen,
  Move,
  Shield,
  TestTube,
  Stethoscope,
  Pill,
  FileCheck,
  CreditCard,
  Archive,
  Syringe,
  Beaker,
  Building2,
  BookOpen,
  Grid,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Document, Folder as FolderType } from "@/contexts/document-context"

interface MoveDocumentModalProps {
  document: Document
  isOpen: boolean
  onClose: () => void
}

const folderIcons = {
  "file-medical": Stethoscope,
  "shield": Shield,
  "flask": TestTube,
  "pill": Pill,
  "file-check": FileCheck,
  "credit-card": CreditCard,
  "archive": Archive,
  "syringe": Syringe,
  "beaker": Beaker,
  "hospital": Building2,
  "book": BookOpen,
  "grid": Grid,
  "default": Folder,
}

const folderColors = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function MoveDocumentModal({ document, isOpen, onClose }: MoveDocumentModalProps) {
  const { activeChild } = useChildProfile()
  const { folders, getFoldersByChild, moveDocumentToFolder, getSuggestedFolders } = useDocuments()
  const { toast } = useToast()
  
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(document.folderId)

  const childFolders = activeChild ? getFoldersByChild(activeChild.id) : []
  const suggestedFolders = getSuggestedFolders(document)

  const handleMoveDocument = () => {
    try {
      moveDocumentToFolder(document.id, selectedFolderId)
      
      const folderName = selectedFolderId 
        ? childFolders.find(f => f.id === selectedFolderId)?.name || "Unknown"
        : "Unassigned"
      
      toast({
        title: "Document moved",
        description: `"${document.name}" has been moved to ${folderName}.`,
      })
      
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFolderIcon = (iconName: string) => {
    const IconComponent = folderIcons[iconName as keyof typeof folderIcons] || folderIcons.default
    return <IconComponent className="h-4 w-4" />
  }

  const currentFolder = document.folderId 
    ? childFolders.find(f => f.id === document.folderId)
    : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Move Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Document Info */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-1">{document.name}</h4>
            <p className="text-sm text-muted-foreground">
              Currently in: {currentFolder ? currentFolder.name : "Unassigned"}
            </p>
          </div>

          {/* Folder Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Destination Folder</label>
                         <Select value={selectedFolderId || "unassigned"} onValueChange={(value) => setSelectedFolderId(value === "unassigned" ? null : value)}>
               <SelectTrigger>
                 <SelectValue placeholder="Choose a folder" />
               </SelectTrigger>
               <SelectContent className="max-h-60 overflow-y-auto">
                 <SelectItem value="unassigned">
                   <div className="flex items-center gap-2">
                     <Folder className="h-4 w-4" />
                     <span>Unassigned</span>
                   </div>
                 </SelectItem>
                {childFolders
                  .filter(folder => folder.id !== "deleted-folder" && folder.id !== "all-documents")
                  .map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded", folderColors[folder.color as keyof typeof folderColors] || folderColors.blue)}>
                        {getFolderIcon(folder.icon || "default")}
                      </div>
                      <span className="truncate">{folder.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Smart Suggestions */}
          {suggestedFolders.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Suggested Folders</label>
              <div className="space-y-2">
                {suggestedFolders.map((folder) => (
                  <Card 
                    key={folder.id}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedFolderId === folder.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-1 rounded", folderColors[folder.color as keyof typeof folderColors] || folderColors.blue)}>
                          {getFolderIcon(folder.icon || "default")}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{folder.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {folder.documentCount} document{folder.documentCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="secondary">Suggested</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleMoveDocument} className="flex-1">
              <Move className="h-4 w-4 mr-2" />
              Move Document
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 