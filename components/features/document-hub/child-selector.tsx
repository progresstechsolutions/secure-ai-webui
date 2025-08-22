"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import { useChildProfile } from "../../../contexts/child-profile-context"
import { User } from "lucide-react"

export function ChildSelector() {
  const { children, activeChild, setActiveChild } = useChildProfile()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Select Child Profile</h3>
        {activeChild && (
          <Badge variant="outline" className="text-xs">
            Active Profile
          </Badge>
        )}
      </div>

      <Select
        value={activeChild?.id || ""}
        onValueChange={(value) => {
          const child = children.find((c) => c.id === value)
          setActiveChild(child || null)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a child profile">
            {activeChild && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activeChild.avatar || "/placeholder.svg"} alt={activeChild.name} />
                  <AvatarFallback className="text-xs">
                    {activeChild.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{activeChild.name}</span>
                <span className="text-muted-foreground text-sm">(Age {activeChild.age})</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={child.avatar || "/placeholder.svg"} alt={child.name} />
                  <AvatarFallback className="text-xs">
                    {child.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{child.name}</span>
                <span className="text-muted-foreground text-sm">(Age {child.age})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {activeChild && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activeChild.avatar || "/placeholder.svg"} alt={activeChild.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{activeChild.name}</h4>
              <p className="text-sm text-muted-foreground">
                Age {activeChild.age} • Born {activeChild.dateOfBirth}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
