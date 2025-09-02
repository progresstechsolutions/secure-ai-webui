"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { generateMilestoneBreadcrumbs } from "@/lib/milestone-utils"

interface MilestoneBreadcrumbsProps {
  childId?: string
  ageKey?: string
  currentPage?: string
}

export function MilestoneBreadcrumbs({ childId, ageKey, currentPage }: MilestoneBreadcrumbsProps) {
  const breadcrumbs = generateMilestoneBreadcrumbs(childId, ageKey, currentPage)

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={`${crumb.href}-${index}`} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium flex items-center">
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors flex items-center">
              {index === 0 && <Home className="h-4 w-4 mr-1" />}
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
