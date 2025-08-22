"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip"
import { useChildProfile } from "../../../contexts/child-profile-context"
import { AddEditChildModal } from "./AddEditChildModal"
import { DeleteChildModal } from "./DeleteChildModal"
import { InviteParentModal } from "./InviteParentModal"
import { ChildStatsPanel } from "./ChildStatsPanel"
import {
  Plus,
  Users,
  FileText,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  UserPlus,
  Share2,
} from "lucide-react"
import { cn } from "../../../lib/utils"

interface ManageChildrenProps {
  children: any[]
  activeChildId?: string
  onChildrenChange: (children: any[]) => void
  onActiveChildChange: (childId: string) => void
  onNavigateToDocuments?: () => void
}

export function ManageChildren({
  children,
  activeChildId,
  onChildrenChange,
  onActiveChildChange,
  onNavigateToDocuments,
}: ManageChildrenProps) {
  const { children: childProfiles, activeChild, setActiveChild, addChild, updateChild, deleteChild } = useChildProfile()
  const [isAddingChild, setIsAddingChild] = useState(false)
  const [isInvitingParent, setIsInvitingParent] = useState(false)
  const [deletingChild, setDeletingChild] = useState<any>(null)
  const [editingChild, setEditingChild] = useState<any>(null)

  // Calculate total statistics
  const totalStats = childProfiles.reduce(
    (acc, child) => ({
      totalDocuments: acc.totalDocuments + (child.stats?.totalDocuments || 0),
    }),
    { totalDocuments: 0 },
  )

  const handleSubmitNewChild = (data: any) => {
    const { name, dateOfBirth, gender, avatar, allergies, conditions, medications, emergencyContact } = data
    // Calculate age from dateOfBirth
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
    
    const newChild = {
      name,
      age: adjustedAge,
      dateOfBirth,
      gender,
      avatar,
      allergies,
      conditions,
      medications,
      emergencyContact,
    }
    addChild(newChild)
    setTimeout(() => {
      const updatedChildren = (childProfiles || [])
      const added = updatedChildren.find(
        (c) => c.name === name && c.dateOfBirth === dateOfBirth
      )
      if (added) setActiveChild(added)
    }, 100)
    setIsAddingChild(false)
  }

  const handleDeleteChild = (child: any) => {
    setDeletingChild(child)
  }

  const confirmDeleteChild = () => {
    if (deletingChild) {
      deleteChild(deletingChild.id)
      setDeletingChild(null)
    }
  }

  const handleEditChild = (child: any) => {
    setEditingChild(child)
  }

  const handleSubmitEditChild = (data: any) => {
    if (editingChild) {
      // Update the child with new data
      const { name, dateOfBirth, gender, avatar, allergies, conditions, medications, emergencyContact } = data
      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age
      
      const updatedChildData = {
        name,
        age: adjustedAge,
        dateOfBirth,
        gender,
        avatar,
        allergies,
        conditions,
        medications,
        emergencyContact,
      }
      
      // Update the child in the context
      updateChild(editingChild.id, updatedChildData)
      setEditingChild(null)
    }
  }

  const mostActiveChild = childProfiles.reduce((most, child) => {
    const childTotal = child.stats?.totalDocuments || 0
    const mostTotal = most.stats?.totalDocuments || 0
    return childTotal > mostTotal ? child : most
  }, childProfiles[0])

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Patient Management</h1>
        <p className="text-muted-foreground">
          Add, edit, and manage child profiles and their document access.
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childProfiles.length}</div>
            <p className="text-xs text-muted-foreground">
              {childProfiles.length === 1 ? "child profile" : "child profiles"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              across all children
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostActiveChild?.name || "None"}</div>
            <p className="text-xs text-muted-foreground">
              {mostActiveChild?.stats?.totalDocuments || 0} documents
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Child Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {childProfiles.map((child) => (
          <Card key={child.id} className={cn("relative", activeChild?.id === child.id && "ring-2 ring-primary")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={child.avatar} alt={child.name} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
        <div>
                    <h3 className="font-semibold">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Age {child.age} • {child.gender === "male" ? "Male" : child.gender === "female" ? "Female" : child.gender === "other" ? "Other" : "Prefer not to say"}
                    </p>
                  </div>
                </div>
                {activeChild?.id === child.id && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Documents</span>
                  <span className="font-medium">{child.stats?.totalDocuments || 0}</span>
        </div>

                {/* Medical Info */}
                <div className="space-y-2">
                  {/* Allergies */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Allergies</p>
                    {child.allergies && child.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {child.allergies.map((allergy: string) => (
                          <Badge key={allergy} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">None Provided</p>
                    )}
                  </div>

                  {/* Medical Conditions */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Medical Conditions</p>
                    {child.conditions && child.conditions.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {child.conditions.map((condition: string) => (
                          <Badge key={condition} variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">None Provided</p>
                    )}
                  </div>

                  {/* Medications */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Medications</p>
                    {child.medications && child.medications.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {child.medications.map((medication: string) => (
                          <Badge key={medication} variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">None Provided</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setActiveChild(child)
                            onNavigateToDocuments?.()
                          }}
                          className="w-full"
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View {child.name}'s documents</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
                          onClick={() => handleEditChild(child)}
                          className="w-full"
                        >
                          <Edit className="h-3 w-3" />
          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit {child.name}'s profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
          <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsInvitingParent(true)}
                          className="w-full"
                        >
                          <Share2 className="h-3 w-3" />
          </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share {child.name}'s profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteChild(child)}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete {child.name}'s profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
        </div>
      </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Child Card */}
        <Card className="border-dashed hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Add New Child</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new child profile to start managing their documents.
            </p>
            <Button onClick={() => setIsAddingChild(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </CardContent>
        </Card>
        </div>

      {/* Child Statistics Panel */}
      {childProfiles.length > 0 && <ChildStatsPanel children={childProfiles} />}

      {/* Modals */}
      <AddEditChildModal
        isOpen={isAddingChild}
        onClose={() => setIsAddingChild(false)}
        onSubmit={handleSubmitNewChild}
        title="Add New Child"
      />

      <AddEditChildModal
        isOpen={!!editingChild}
        onClose={() => setEditingChild(null)}
        onSubmit={handleSubmitEditChild}
        title="Edit Child Profile"
        initialData={editingChild}
      />

      <DeleteChildModal
        isOpen={!!deletingChild}
        child={deletingChild}
        onClose={() => setDeletingChild(null)}
        onConfirm={confirmDeleteChild}
      />

      <InviteParentModal
        isOpen={isInvitingParent}
        onClose={() => setIsInvitingParent(false)}
        onSubmit={(inviteData) => {
          console.log("Invite parent:", inviteData)
          setIsInvitingParent(false)
        }}
        child={activeChild}
      />
    </div>
  )
}
