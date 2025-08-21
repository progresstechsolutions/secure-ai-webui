"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useDocuments } from "@/contexts/document-context"
import { useChildProfile } from "@/contexts/child-profile-context"
import { useToast } from "@/hooks/use-toast"
import {
  Folder,
  FolderOpen,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  Shield,
  TestTube,
  Stethoscope,
  Pill,
  FileCheck,
  CreditCard,
  Archive,
  X,
  Syringe,
  Beaker,
  Building2,
  BookOpen,
  Grid,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Folder as FolderType } from "@/contexts/document-context"

interface FolderSidebarProps {
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onToggle?: () => void
  showDeletedFolder?: boolean
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
  "trash-2": Trash2,
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

export function FolderSidebar({ selectedFolderId, onFolderSelect, onToggle, showDeletedFolder = true }: FolderSidebarProps) {
  const { activeChild } = useChildProfile()
  const { folders, getFoldersByChild, getUnassignedDocuments, addFolder, updateFolder, deleteFolder } = useDocuments()
  const { toast } = useToast()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderColor, setNewFolderColor] = useState("blue")
  const [newFolderIcon, setNewFolderIcon] = useState("default")
  const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const childFolders = activeChild ? getFoldersByChild(activeChild.id) : []
  const unassignedCount = activeChild ? getUnassignedDocuments(activeChild.id).length : 0

  const handleCreateFolder = () => {
    if (!activeChild || !newFolderName.trim()) return

    const folderName = newFolderName.trim()
    
    // Check for duplicate folder names (case-insensitive)
    const existingFolder = childFolders.find(
      folder => folder.name.toLowerCase() === folderName.toLowerCase()
    )
    
    if (existingFolder) {
      toast({
        title: "Folder already exists",
        description: `A folder named "${folderName}" already exists. Please choose a different name.`,
        variant: "destructive",
      })
      return
    }

    try {
      addFolder({
        name: folderName,
        childId: activeChild.id,
        color: newFolderColor,
        icon: newFolderIcon,
      })
      
      setNewFolderName("")
      setNewFolderColor("blue")
      setNewFolderIcon("default")
      setIsCreateDialogOpen(false)
      
      toast({
        title: "Folder created",
        description: `"${folderName}" folder has been created.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      })
      // Reset state on error as well
      setNewFolderName("")
      setNewFolderColor("blue")
      setNewFolderIcon("default")
      setIsCreateDialogOpen(false)
    }
  }

  const handleEditFolder = () => {
    if (!editingFolder || !newFolderName.trim()) return

    // Special handling for Unassigned folder - it's not a real folder so we don't update it
    if (editingFolder.id === "unassigned") {
      toast({
        title: "Cannot edit Unassigned",
        description: "The Unassigned folder cannot be modified.",
      })
      setIsEditDialogOpen(false)
      setEditingFolder(null)
      setNewFolderName("")
      setNewFolderColor("blue")
      setNewFolderIcon("default")
      return
    }

    const folderName = newFolderName.trim()
    
    // Check for duplicate folder names (case-insensitive), excluding the current folder being edited
    const existingFolder = childFolders.find(
      folder => 
        folder.id !== editingFolder.id && 
        folder.name.toLowerCase() === folderName.toLowerCase()
    )
    
    if (existingFolder) {
      toast({
        title: "Folder already exists",
        description: `A folder named "${folderName}" already exists. Please choose a different name.`,
        variant: "destructive",
      })
      return
    }

    try {
      updateFolder(editingFolder.id, {
        name: folderName,
        color: newFolderColor,
        icon: newFolderIcon,
      })
      
      setNewFolderName("")
      setNewFolderColor("blue")
      setNewFolderIcon("default")
      setEditingFolder(null)
      setIsEditDialogOpen(false)
      
      toast({
        title: "Folder updated",
        description: `"${folderName}" folder has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update folder. Please try again.",
        variant: "destructive",
      })
      // Reset state on error as well
      setNewFolderName("")
      setNewFolderColor("blue")
      setNewFolderIcon("default")
      setEditingFolder(null)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteFolder = (folder: FolderType) => {
    setOpenDropdownId(null) // Close dropdown
    setFolderToDelete(folder)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteFolder = () => {
    if (!folderToDelete) return

    try {
      deleteFolder(folderToDelete.id)
      toast({
        title: "Folder deleted",
        description: `"${folderToDelete.name}" folder has been deleted. Documents have been moved to unassigned.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFolderToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditClick = (folder: FolderType) => {
    setOpenDropdownId(null) // Close dropdown
    setEditingFolder(folder)
    setNewFolderName(folder.name)
    setNewFolderColor(folder.color || "blue")
    setNewFolderIcon(folder.icon || "default")
    setIsEditDialogOpen(true)
  }

  const handleEditUnassigned = () => {
    setOpenDropdownId(null) // Close dropdown
    setEditingFolder({ id: "unassigned", name: "Unassigned", childId: activeChild?.id || "", color: "gray", icon: "default", createdAt: new Date(), documentCount: unassignedCount })
    setNewFolderName("Unassigned")
    setNewFolderColor("gray")
    setNewFolderIcon("default")
    setIsEditDialogOpen(true)
  }

  const getFolderIcon = (iconName: string) => {
    const IconComponent = folderIcons[iconName as keyof typeof folderIcons] || folderIcons.default
    return <IconComponent className="h-4 w-4" />
  }

  const isPresetFolder = (folderId: string) => {
    // Preset folders have IDs from folder-1 to folder-8
    return folderId.startsWith("folder-") && parseInt(folderId.split("-")[1]) <= 8
  }

  if (!activeChild) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Select a child to view folders</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Folders</h3>
            <span className="text-xs text-muted-foreground lg:hidden">Tap to select</span>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (!open) {
                // Reset state when dialog closes
                setNewFolderName("")
                setNewFolderColor("blue")
                setNewFolderIcon("default")
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Create a new folder to organize your documents. Choose a name, color, and icon for your folder.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="folder-name">Folder Name</Label>
                    <Input
                      id="folder-name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(folderColors).map(([color, className]) => (
                        <button
                          key={color}
                          onClick={() => setNewFolderColor(color)}
                          className={cn(
                            "w-6 h-6 rounded-full border-2",
                            newFolderColor === color ? "border-foreground" : "border-transparent",
                            className
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(folderIcons).map(([iconName, IconComponent]) => (
                        <button
                          key={iconName}
                          onClick={() => setNewFolderIcon(iconName)}
                          className={cn(
                            "p-2 rounded border",
                            newFolderIcon === iconName ? "border-primary bg-primary/10" : "border-border"
                          )}
                        >
                          <IconComponent className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateFolder} className="flex-1">
                      Create Folder
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsCreateDialogOpen(false)
                      setNewFolderName("")
                      setNewFolderColor("blue")
                      setNewFolderIcon("default")
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
                aria-label="Close folders"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {/* All Documents Folder (always first) */}
          {childFolders
            .filter(folder => folder.id === "all-documents")
            .map((folder) => (
              <div key={folder.id} className="group">
                <div
                  onClick={() => onFolderSelect(folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border transition-colors relative cursor-pointer",
                    selectedFolderId === folder.id
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn("p-1 rounded", folderColors[folder.color as keyof typeof folderColors] || folderColors.blue)}>
                      {getFolderIcon(folder.icon || "default")}
                    </div>
                    <span className="font-medium truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary">{folder.documentCount}</Badge>
                  </div>
                </div>
              </div>
            ))}

          {/* Unassigned Folder (second) */}
          <div className="group">
            <div
              onClick={() => onFolderSelect(null)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer",
                selectedFolderId === null
                  ? "bg-primary/10 border-primary text-primary"
                  : "hover:bg-muted/50 border-border"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Folder className="h-4 w-4" />
                <span className="font-medium">Unassigned</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary">{unassignedCount}</Badge>
                <DropdownMenu open={openDropdownId === "unassigned"} onOpenChange={(open) => {
                  setOpenDropdownId(open ? "unassigned" : null)
                }}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditUnassigned}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Other Child Folders */}
          {childFolders
            .filter(folder => {
              if (!showDeletedFolder && folder.id === "deleted-folder") return false
              if (folder.id === "all-documents") return false // Already rendered above
              return true
            })
            .map((folder) => (
              <div key={folder.id} className="group">
                <div
                  onClick={() => onFolderSelect(folder.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg border transition-colors relative cursor-pointer",
                    selectedFolderId === folder.id
                      ? "bg-primary/10 border-primary text-primary"
                      : "hover:bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={cn("p-1 rounded", folderColors[folder.color as keyof typeof folderColors] || folderColors.blue)}>
                      {getFolderIcon(folder.icon || "default")}
                    </div>
                    <span className="font-medium truncate">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary">{folder.documentCount}</Badge>
                    <DropdownMenu open={openDropdownId === folder.id} onOpenChange={(open) => {
                      setOpenDropdownId(open ? folder.id : null)
                    }}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(folder)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!isPresetFolder(folder.id) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteFolder(folder)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}

          {childFolders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No folders created yet
            </p>
          )}
        </div>

        {/* Edit Folder Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            // Reset state when dialog closes
            setEditingFolder(null)
            setNewFolderName("")
            setNewFolderColor("blue")
            setNewFolderIcon("default")
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Folder</DialogTitle>
              <DialogDescription>
                Modify the folder name, color, and icon to customize your folder.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-folder-name">Folder Name</Label>
                <Input
                  id="edit-folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(folderColors).map(([color, className]) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2",
                        newFolderColor === color ? "border-foreground" : "border-transparent",
                        className
                      )}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(folderIcons).map(([iconName, IconComponent]) => (
                    <button
                      key={iconName}
                      onClick={() => setNewFolderIcon(iconName)}
                      className={cn(
                        "p-2 rounded border",
                        newFolderIcon === iconName ? "border-primary bg-primary/10" : "border-border"
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditFolder} className="flex-1">
                  Update Folder
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingFolder(null)
                  setNewFolderName("")
                  setNewFolderColor("blue")
                  setNewFolderIcon("default")
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Folder Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Folder</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{folderToDelete?.name}"? All documents in this folder will be moved to unassigned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteFolder}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
} 