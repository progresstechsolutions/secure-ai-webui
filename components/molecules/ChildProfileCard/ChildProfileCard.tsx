"use client"

import React from "react"
import { Avatar } from "../../atoms/Avatar/Avatar"
import { Tag } from "../../atoms/Tag/Tag"
import { Button } from "../../atoms/Button/Button"
import { User, Calendar, FileText, Folder, Users, Edit, Trash2, UserPlus } from "lucide-react"
import { cn } from "../../../lib/utils"

export interface ChildProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  child: {
    id: string
    name: string
    age: number
    dateOfBirth: string
    avatar?: string
    allergies?: string[]
    conditions?: string[]
    medications?: string[]
    stats?: {
      totalDocuments: number
      totalFolders: number
      lastActivity: Date
    }
    sharedWith?: Array<{
      id: string
      email: string
      name: string
      role: "admin" | "read-only"
    }>
  }
  isActive?: boolean
  onSelect?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onInvite?: (id: string) => void
  compact?: boolean
  showStats?: boolean
  showActions?: boolean
}

const ChildProfileCard = React.forwardRef<HTMLDivElement, ChildProfileCardProps>(
  (
    {
      className,
      child,
      isActive,
      onSelect,
      onEdit,
      onDelete,
      onInvite,
      compact = false,
      showStats = false,
      showActions = false,
      ...props
    },
    ref,
  ) => {
    const calculateAge = (birthDate: string) => {
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    }

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md",
          onSelect && "cursor-pointer",
          isActive && "ring-2 ring-primary ring-offset-2",
          compact && "p-3",
          className,
        )}
        onClick={() => onSelect?.(child.id)}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={(e) => {
          if (onSelect && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault()
            onSelect(child.id)
          }
        }}
        aria-pressed={isActive}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Avatar
            src={child.avatar}
            fallback={child.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size={compact ? "md" : "lg"}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-card-foreground">{child.name}</h3>
              {isActive && (
                <Tag variant="default" size="sm">
                  Active
                </Tag>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Age {calculateAge(child.dateOfBirth)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(child.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Medical Info */}
            {!compact && (child.allergies?.length || child.conditions?.length) && (
              <div className="space-y-2 mb-3">
                {child.allergies && child.allergies.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Allergies</p>
                    <div className="flex flex-wrap gap-1">
                      {child.allergies.slice(0, 2).map((allergy) => (
                        <Tag key={allergy} variant="destructive" size="sm">
                          {allergy}
                        </Tag>
                      ))}
                      {child.allergies.length > 2 && (
                        <Tag variant="destructive" size="sm">
                          +{child.allergies.length - 2}
                        </Tag>
                      )}
                    </div>
                  </div>
                )}

                {child.conditions && child.conditions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {child.conditions.slice(0, 2).map((condition) => (
                        <Tag key={condition} variant="warning" size="sm">
                          {condition}
                        </Tag>
                      ))}
                      {child.conditions.length > 2 && (
                        <Tag variant="warning" size="sm">
                          +{child.conditions.length - 2}
                        </Tag>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {showStats && child.stats && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{child.stats.totalDocuments} docs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  <span>{child.stats.totalFolders} folders</span>
                </div>
                {child.sharedWith && child.sharedWith.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{child.sharedWith.length} shared</span>
                  </div>
                )}
              </div>
            )}

            {/* Last Activity */}
            {showStats && child.stats?.lastActivity && (
              <p className="text-xs text-muted-foreground">Last activity: {formatDate(child.stats.lastActivity)}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
            {onInvite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onInvite(child.id)
                }}
                aria-label="Invite parent"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            )}

            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(child.id)
                }}
                aria-label="Edit child profile"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(child.id)
                }}
                aria-label="Delete child profile"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  },
)
ChildProfileCard.displayName = "ChildProfileCard"

export { ChildProfileCard }
