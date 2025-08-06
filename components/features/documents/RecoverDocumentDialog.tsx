"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCcw, CheckCircle } from "lucide-react"
import { useDocuments } from "@/contexts/document-context"
import { useToast } from "@/hooks/use-toast"

interface RecoverDocumentDialogProps {
  isOpen: boolean
  onClose: () => void
  documentId: string
  documentName: string
  originalFolderId?: string | null
  childId: string
}

export function RecoverDocumentDialog({ 
  isOpen, 
  onClose, 
  documentId, 
  documentName,
  originalFolderId,
  childId
}: RecoverDocumentDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isRecovering, setIsRecovering] = useState(false)
  const [isRecovered, setIsRecovered] = useState(false)
  
  const { recoverDocument, getFoldersByChild, folders } = useDocuments()
  const { toast } = useToast()

  const availableFolders = getFoldersByChild(childId).filter(folder => 
    folder.id !== "deleted-folder" && folder.id !== "all-documents"
  )
  const originalFolder = originalFolderId ? folders.find(f => f.id === originalFolderId) : null

  const handleRecover = async () => {
    setIsRecovering(true)
    try {
      // Determine target folder - prefer original folder if it exists, otherwise use selected folder
      let targetFolderId = selectedFolderId
      if (!targetFolderId && originalFolder) {
        targetFolderId = originalFolderId
      }
      
      recoverDocument(documentId, targetFolderId)
      
      setIsRecovered(true)
      
      // Show success message
      const targetFolder = targetFolderId 
        ? folders.find(f => f.id === targetFolderId) 
        : null
      const folderName = targetFolder ? targetFolder.name : "Unassigned"
      
      toast({
        title: "Document Recovered",
        description: `"${documentName}" has been recovered to the "${folderName}" folder.`,
        duration: 3000,
      })
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose()
        setIsRecovered(false)
        setSelectedFolderId(null)
      }, 1500)
      
    } finally {
      setIsRecovering(false)
    }
  }

  const handleClose = () => {
    if (!isRecovering) {
      onClose()
      setIsRecovered(false)
      setSelectedFolderId(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-green-500" />
            Recover Document
          </DialogTitle>
          <DialogDescription>
            Recover "{documentName}" to a folder
          </DialogDescription>
        </DialogHeader>

        {isRecovered ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="text-green-800">
                <p className="font-medium">Document Recovered Successfully!</p>
                <p className="text-sm">The document has been moved back to its folder.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Folder</label>
                             <Select 
                 value={selectedFolderId || "unassigned"} 
                 onValueChange={(value) => setSelectedFolderId(value === "unassigned" ? null : value)}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Choose a folder..." />
                 </SelectTrigger>
                 <SelectContent className="max-h-60 overflow-y-auto">
                   <SelectItem value="unassigned">Unassigned</SelectItem>
                   {availableFolders.map((folder) => (
                     <SelectItem key={folder.id} value={folder.id}>
                       <span className="truncate">{folder.name}</span>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
              
              {originalFolder && (
                <p className="text-xs text-muted-foreground">
                  Original folder: {originalFolder.name}
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isRecovering}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRecover}
                disabled={isRecovering}
                className="bg-green-500 hover:bg-green-600"
              >
                {isRecovering ? "Recovering..." : "Recover Document"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 