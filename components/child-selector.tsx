"use client"

import { useState } from "react"
import { useChildProfile } from "@/contexts/child-profile-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDownIcon, PlusIcon } from "lucide-react"
import type { Child } from "@/components/features/manage-children/ManageChildren" // Corrected import path
import { AddEditChildModal } from "@/components/features/manage-children/AddEditChildModal"

export function ChildSelector() {
  const { children, activeChild, setActiveChild, addChild } = useChildProfile()
  const [isAddingChild, setIsAddingChild] = useState(false)

  const handleSelectChild = (childId: string) => {
    const child = (children || []).find((c) => c.id === childId)
    setActiveChild(child || null)
  }

  // Open the modal to add a new child
  const handleAddNewChild = () => {
    setIsAddingChild(true)
  }

  // Handle form submission from modal
  const handleSubmitNewChild = (data) => {
    // addChild expects Omit<Child, "id">, but AddEditChildModal omits id, stats, sharedWith
    const { name, dateOfBirth, avatar, allergies, conditions, medications, emergencyContact } = data
    const newChild = {
      name,
      dateOfBirth,
      avatar,
      allergies,
      conditions,
      medications,
      emergencyContact,
    }
    addChild(newChild)
    // Find the new child by name and dateOfBirth (since id is generated in context)
    setTimeout(() => {
      const updatedChildren = (children || [])
      const added = updatedChildren.find(
        (c) => c.name === name && c.dateOfBirth === dateOfBirth
      )
      if (added) setActiveChild(added)
    }, 100)
    setIsAddingChild(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 px-3 py-2 h-9 bg-transparent">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={activeChild?.avatar || "/placeholder.svg?height=40&width=40"}
                alt={activeChild?.name || "Select Child"}
              />
              <AvatarFallback>{activeChild?.name ? activeChild.name.charAt(0) : "C"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline">
              {activeChild ? activeChild.name : "Select Child"}
            </span>
            <ChevronDownIcon className="h-4 w-4 ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Active Child</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(children || []).map((child) => (
            <DropdownMenuItem
              key={child.id}
              onSelect={() => handleSelectChild(child.id)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={child.avatar || "/placeholder.svg?height=40&width=40"} alt={child.name} />
                <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{child.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleAddNewChild} className="flex items-center gap-2 cursor-pointer">
            <PlusIcon className="h-4 w-4" />
            <span>Add New Child</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddEditChildModal
        isOpen={isAddingChild}
        onClose={() => setIsAddingChild(false)}
        onSubmit={handleSubmitNewChild}
        title="Add New Child"
      />
    </>
  )
}
