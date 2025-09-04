"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckSquare, Lightbulb, Calendar, FileText } from "lucide-react"
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

  // Combine navigation items (removed settingsNavItems)
  const navItems = [...baseNavItems, ...childSpecificNavItems]

  return (
    <div className="border-b border-gray-200 mb-8">
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
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {childId && childExists(childId) && (
        <div className="py-3 px-1">
          <p className="text-sm text-gray-600">
            Viewing data for <span className="font-semibold text-gray-900">{getChildName(childId)}</span>
            {ageKey && ageKey !== "current" && <span className="text-gray-500"> • {ageKey.replace("-", " to ")}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
