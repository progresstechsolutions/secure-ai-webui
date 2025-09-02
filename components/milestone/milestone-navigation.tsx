"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CheckSquare, Lightbulb, Calendar, FileText, Settings } from "lucide-react"
import { getChildName, childExists } from "@/lib/milestone-utils"

interface MilestoneNavigationProps {
  childId?: string
  ageKey?: string
}

export function MilestoneNavigation({ childId, ageKey }: MilestoneNavigationProps) {
  const pathname = usePathname()

  // Base navigation items (always available)
  const baseNavItems = [
    {
      href: "/milestone",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/milestone/children",
      label: "Children",
      icon: Users,
    },
  ]

  // Child-specific navigation items (only available when childId is valid)
  const childSpecificNavItems =
    childId && childExists(childId)
      ? [
          {
            href: `/milestone/checklist/${childId}/${ageKey || "current"}`,
            label: "Checklist",
            icon: CheckSquare,
          },
          {
            href: `/milestone/tips/${childId}/${ageKey || "current"}`,
            label: "Tips & Activities",
            icon: Lightbulb,
          },
          {
            href: `/milestone/appointments/${childId}`,
            label: "Appointments",
            icon: Calendar,
          },
          {
            href: `/milestone/summary/${childId}`,
            label: "Summary",
            icon: FileText,
          },
        ]
      : []

  // Settings (always available)
  const settingsNavItems = [
    {
      href: "/milestone/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  // Combine all navigation items
  const navItems = [...baseNavItems, ...childSpecificNavItems, ...settingsNavItems]

  return (
    <div className="border-b border-border mb-6">
      <nav className="flex space-x-8 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Child context indicator */}
      {childId && childExists(childId) && (
        <div className="py-2 px-1">
          <p className="text-xs text-muted-foreground">
            Viewing data for <span className="font-medium text-foreground">{getChildName(childId)}</span>
            {ageKey && ageKey !== "current" && <span> • {ageKey.replace("-", " to ")}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
