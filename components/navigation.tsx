"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Dna,
  Search,
  FileText,
  Users,
  BookOpen,
  Zap,
  Shield,
  Menu,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  CreditCard,
  Building2,
  Settings,
  Stethoscope,
  FlaskConical,
  Pin,
  PinOff,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  useEffect(() => {
    const savedPinned = localStorage.getItem("navigation-pinned")
    if (savedPinned === "true") {
      setIsPinned(true)
      setIsExpanded(true)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isExpanded && !isPinned) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isExpanded, isPinned])

  const togglePin = () => {
    const newPinned = !isPinned
    setIsPinned(newPinned)
    localStorage.setItem("navigation-pinned", newPinned.toString())

    if (newPinned) {
      setIsExpanded(true)
    }
  }

  const shouldExpand = isExpanded || isHovered

  const parentApps = [
    { href: "/care-community", icon: Users, label: "Community" },
    { href: "/health-journal", icon: BookOpen, label: "Journal" },
    { href: "/genetic-tracker", icon: Dna, label: "Tracker" },
    { href: "/development", icon: Zap, label: "Milestones" },
    { href: "/doc-hub", icon: FileText, label: "DocHub" },
  ]

  const enterpriseApps = [
    { href: "/research-platform", icon: FlaskConical, label: "Research Platform" },
    { href: "/clinical-trials", icon: Stethoscope, label: "Clinical Trials" },
    { href: "/regulatory", icon: Shield, label: "Regulatory Support" },
  ]

  return (
    <>
      <nav
        ref={navRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar/95 backdrop-blur border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "hidden sm:block",
          shouldExpand ? "w-52 lg:w-56 xl:w-60" : "w-12 sm:w-12 md:w-12 lg:w-14 xl:w-16",
          "max-sm:w-full max-sm:transform max-sm:transition-transform",
          shouldExpand ? "max-sm:translate-x-0" : "max-sm:-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={cn(
              "border-b border-sidebar-border",
              shouldExpand
                ? "flex items-center justify-between p-2 md:p-3 lg:p-4"
                : "flex items-center justify-center p-1.5 md:p-2 lg:p-2.5",
            )}
          >
            <Link
              href="/"
              className={cn(
                "flex items-center transition-all duration-200",
                shouldExpand ? "space-x-2 md:space-x-3" : "justify-center w-full",
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0",
                  shouldExpand
                    ? "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
                    : "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8",
                )}
              >
                <Image
                  src="/images/caregene-logo.png"
                  alt="Caregene AI"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              {shouldExpand && (
                <span className="font-serif font-bold text-xs sm:text-sm md:text-base lg:text-lg text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              )}
            </Link>
          </div>

          {/* Toggle Button */}
          <div className="p-1.5 md:p-2">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "flex-1 h-7 sm:h-8 md:h-9 lg:h-10 hover:bg-sidebar-accent/10",
                  shouldExpand ? "justify-start" : "justify-center",
                )}
              >
                <Menu className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
                {shouldExpand && <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm">Menu</span>}
              </Button>

              {shouldExpand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePin}
                  className={cn(
                    "h-7 sm:h-8 md:h-9 lg:h-10 px-2 hover:bg-sidebar-accent/10",
                    isPinned ? "text-sidebar-primary" : "text-muted-foreground",
                  )}
                  title={isPinned ? "Unpin navigation" : "Pin navigation"}
                >
                  {isPinned ? (
                    <Pin className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
                  ) : (
                    <PinOff className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-1.5 md:px-2">
            {/* New Chat */}
            <Link
              href="/"
              className={cn(
                "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
              )}
            >
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {shouldExpand && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">New Chat</span>
              )}
            </Link>

            {/* Search */}
            <Link
              href="/search"
              className={cn(
                "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
              )}
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {shouldExpand && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">Search</span>
              )}
            </Link>

            {/* Parent Apps Section */}
            <div className="mt-1">
              <button
                onClick={() => toggleSection("parent")}
                className={cn(
                  "flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                  shouldExpand ? "justify-between space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
                )}
              >
                <div className={cn("flex items-center", shouldExpand ? "space-x-2 md:space-x-3" : "")}>
                  <Dna className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                  {shouldExpand && (
                    <span className="text-xs sm:text-xs md:text-sm lg:text-sm font-medium text-sidebar-foreground">
                      Parent Care
                    </span>
                  )}
                </div>
                {shouldExpand &&
                  (expandedSections.includes("parent") ? (
                    <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  ))}
              </button>

              {shouldExpand && expandedSections.includes("parent") && (
                <div className="ml-4 sm:ml-5 md:ml-6 lg:ml-7 mt-0.5">
                  {parentApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-0.5 md:py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs sm:text-xs md:text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span>{app.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Enterprise/Science Section */}
            <div className="mt-1">
              <button
                onClick={() => toggleSection("enterprise")}
                className={cn(
                  "flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                  shouldExpand ? "justify-between space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
                )}
              >
                <div className={cn("flex items-center", shouldExpand ? "space-x-2 md:space-x-3" : "")}>
                  <FlaskConical className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                  {shouldExpand && (
                    <span className="text-xs sm:text-xs md:text-sm lg:text-sm font-medium text-sidebar-foreground">
                      Research
                    </span>
                  )}
                </div>
                {shouldExpand &&
                  (expandedSections.includes("enterprise") ? (
                    <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  ) : (
                    <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  ))}
              </button>

              {shouldExpand && expandedSections.includes("enterprise") && (
                <div className="ml-4 sm:ml-5 md:ml-6 lg:ml-7 mt-0.5">
                  {enterpriseApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-0.5 md:py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs sm:text-xs md:text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span>{app.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Simple Links */}
            <Link
              href="/about"
              className={cn(
                "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 mt-1",
                shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
              )}
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {shouldExpand && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">About</span>
              )}
            </Link>

            <Link
              href="/contact"
              className={cn(
                "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
              )}
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {shouldExpand && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">Contact</span>
              )}
            </Link>
          </div>

          <div className="px-1.5 md:px-2 pb-1.5 md:pb-2 border-t border-sidebar-border">
            <div className="py-1.5 md:py-2">
              <Link
                href="/subscriptions"
                className={cn(
                  "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                  shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
                )}
              >
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && (
                  <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                    Care Plans
                  </span>
                )}
              </Link>

              <Link
                href="/business"
                className={cn(
                  "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                  shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
                )}
              >
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && (
                  <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                    For Healthcare
                  </span>
                )}
              </Link>

              <Link
                href="/settings"
                className={cn(
                  "flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                  shouldExpand ? "space-x-2 md:space-x-3 px-2 md:px-3" : "justify-center px-2",
                )}
              >
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                {shouldExpand && (
                  <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                    Settings & Help
                  </span>
                )}
              </Link>

              {shouldExpand && (
                <div className="ml-4 sm:ml-5 md:ml-6 lg:ml-7 mt-1 pt-1 border-t border-sidebar-border/50">
                  <div className="px-2 md:px-3 py-0.5 md:py-1 text-xs sm:text-xs md:text-xs text-muted-foreground">
                    © 2024 Caregene AI
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {shouldExpand && (
        <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setIsExpanded(false)} />
      )}

      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-4 left-4 z-40 sm:hidden bg-sidebar/95 backdrop-blur border border-sidebar-border rounded-lg p-2 hover:bg-sidebar-accent/10"
        style={{ display: shouldExpand ? "none" : "block" }}
      >
        <Menu className="h-5 w-5 text-sidebar-foreground" />
      </button>
    </>
  )
}
