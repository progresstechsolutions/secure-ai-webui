"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Dna,
  Search,
  FileText,
  Users,
  BookOpen,
  Zap,
  Shield,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Building2,
  Settings,
  Stethoscope,
  FlaskConical,
  FolderOpen,
  Clock,
  Plus,
  TrendingUp,
  Pin,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/navigation-context"

export function Navigation() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isPinned, setIsPinned } = useNavigation()
  const navRef = useRef<HTMLElement>(null)

  const [debouncedHover, setDebouncedHover] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout>()

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter((s) => s !== section))
    } else {
      setExpandedSections([...expandedSections, section])
    }
  }

  const togglePin = () => {
    setIsPinned(!isPinned)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHovered(true)
    setDebouncedHover(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    hoverTimeoutRef.current = setTimeout(() => {
      setDebouncedHover(false)
    }, 300)
  }

  const shouldExpand = isPinned || (isHovered && !isPinned)

  const parentApps = [
    { href: "/care-community", icon: Users, label: "Community" },
    { href: "/health-journal", icon: BookOpen, label: "Journal" },
    { href: "/genetic-tracker", icon: Dna, label: "Tracker" },
    { href: "/trends", icon: TrendingUp, label: "Trends" },
    { href: "/milestone", icon: Zap, label: "Milestone" },
    { href: "/doc-hub", icon: FileText, label: "DocHub" },
  ]

  const enterpriseApps = [
    { href: "/research-platform", icon: FlaskConical, label: "Research Platform" },
    { href: "/clinical-trials", icon: Stethoscope, label: "Clinical Trials" },
    { href: "/regulatory", icon: Shield, label: "Regulatory Support" },
  ]

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-sidebar/95 backdrop-blur border border-sidebar-border lg:hidden"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-sidebar-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        )}
      </button>

      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileMenu} />}

      <nav
        ref={navRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-sidebar/95 backdrop-blur border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "hidden lg:block",
          shouldExpand ? "w-52 lg:w-56 xl:w-60" : "w-12 lg:w-14",
          isMobileMenuOpen && "block translate-x-0 w-64 sm:w-72 md:w-80",
          !isMobileMenuOpen && "lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b border-sidebar-border flex items-center justify-between p-2 md:p-3 lg:p-4">
            <Link
              href="/"
              className="flex items-center transition-all duration-200 space-x-2 md:space-x-3"
              onClick={closeMobileMenu}
            >
              <div className="flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8">
                <Image
                  src="/images/caregene-logo.png"
                  alt="Caregene AI"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="font-serif font-bold text-xs sm:text-sm md:text-base lg:text-lg text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              )}
            </Link>

            {(shouldExpand || isMobileMenuOpen) && (
              <button
                onClick={togglePin}
                className={cn(
                  "p-1 rounded-md hover:bg-sidebar-accent/10 transition-colors sm:block hidden",
                  isPinned ? "text-sidebar-primary" : "text-muted-foreground",
                )}
                title={isPinned ? "Unpin navigation" : "Pin navigation"}
              >
                <Pin className={cn("h-3 w-3 transition-transform", isPinned && "rotate-45")} />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-1.5 md:px-2">
            {/* New Chat */}
            <Link
              href="/"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 mb-1 space-x-2 md:space-x-3 px-2 md:px-3"
              onClick={closeMobileMenu}
            >
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">New Chat</span>
              )}
            </Link>

            {/* Projects */}
            <Link
              href="/projects"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 mb-1 space-x-2 md:space-x-3 px-2 md:px-3"
              onClick={closeMobileMenu}
            >
              <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">Projects</span>
              )}
            </Link>

            {/* Recent Chats */}
            <Link
              href="/recent"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 mb-2 space-x-2 md:space-x-3 px-2 md:px-3"
              onClick={closeMobileMenu}
            >
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                  Recent Chats
                </span>
              )}
            </Link>

            {(shouldExpand || isMobileMenuOpen) && <div className="border-t border-sidebar-border/50 mb-2" />}

            {/* Search */}
            <Link
              href="/search"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 space-x-2 md:space-x-3 px-2 md:px-3"
              onClick={closeMobileMenu}
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">Search</span>
              )}
            </Link>

            {/* Parent Apps Section */}
            <div className="mt-1">
              <button
                onClick={() => toggleSection("parent")}
                className={cn(
                  "flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9",
                  "justify-between space-x-2 md:space-x-3 px-2 md:px-3",
                )}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Dna className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                  {(shouldExpand || isMobileMenuOpen) && (
                    <>
                      <span className="text-xs sm:text-xs md:text-sm lg:text-sm font-medium text-sidebar-foreground">
                        Parent Care
                      </span>
                    </>
                  )}
                </div>
                {(shouldExpand || isMobileMenuOpen) && (
                  <>
                    {expandedSections.includes("parent") ? (
                      <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    ) : (
                      <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    )}
                  </>
                )}
              </button>

              {(shouldExpand || isMobileMenuOpen) && expandedSections.includes("parent") && (
                <div className="ml-4 sm:ml-5 md:ml-6 lg:ml-7 mt-0.5">
                  {parentApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-0.5 md:py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs sm:text-xs md:text-xs text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      <app.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
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
                  "justify-between space-x-2 md:space-x-3 px-2 md:px-3",
                )}
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <FlaskConical className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                  {(shouldExpand || isMobileMenuOpen) && (
                    <span className="text-xs sm:text-xs md:text-sm lg:text-sm font-medium text-sidebar-foreground">
                      Research
                    </span>
                  )}
                </div>
                {(shouldExpand || isMobileMenuOpen) && (
                  <>
                    {expandedSections.includes("enterprise") ? (
                      <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    ) : (
                      <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    )}
                  </>
                )}
              </button>

              {(shouldExpand || isMobileMenuOpen) && expandedSections.includes("enterprise") && (
                <div className="ml-4 sm:ml-5 md:ml-6 lg:ml-7 mt-0.5">
                  {enterpriseApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 md:space-x-3 px-2 md:px-3 py-0.5 md:py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-xs sm:text-xs md:text-xs text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      <app.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                      <span>{app.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Simple Links */}
            <Link
              href="/about"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 mt-1 space-x-2 md:space-x-3 px-2 md:px-3"
              onClick={closeMobileMenu}
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">About</span>
              )}
            </Link>

            <Link
              href="/contact"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 space-x-2 md:space-x-3 px-2 md:px-3"
              onClick={closeMobileMenu}
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">Contact</span>
              )}
            </Link>
          </div>

          <div className="px-1.5 md:px-2 pb-1.5 md:pb-2 border-t border-sidebar-border">
            <div className="py-1.5 md:py-2">
              <Link
                href="/subscriptions"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 space-x-2 md:space-x-3 px-2 md:px-3"
                onClick={closeMobileMenu}
              >
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                    Care Plans
                  </span>
                )}
              </Link>

              <Link
                href="/business"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 space-x-2 md:space-x-3 px-2 md:px-3"
                onClick={closeMobileMenu}
              >
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                    For Healthcare
                  </span>
                )}
              </Link>

              <Link
                href="/settings"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-7 sm:h-8 md:h-8 lg:h-9 space-x-2 md:space-x-3 px-2 md:px-3"
                onClick={closeMobileMenu}
              >
                <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="ml-2 text-xs sm:text-xs md:text-sm lg:text-sm text-sidebar-foreground">
                    Settings & Help
                  </span>
                )}
              </Link>

              {(shouldExpand || isMobileMenuOpen) && (
                <div className="ml-4 sm:ml-5 md:ml-6 lg:ml-7 mt-1 pt-1 border-t border-sidebar-border/50">
                  <div className="px-3 py-1 text-xs text-muted-foreground">© 2024 Caregene AI</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <nav className="fixed left-0 top-0 z-50 h-full w-64 sm:w-72 md:w-80 bg-sidebar/95 backdrop-blur border-r border-sidebar-border lg:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-sidebar-border flex items-center justify-between p-3 md:p-4">
              <Link
                href="/"
                className="flex items-center transition-all duration-200 space-x-3"
                onClick={closeMobileMenu}
              >
                <div className="flex-shrink-0 h-6 w-6 md:h-8 md:w-8">
                  <Image
                    src="/images/caregene-logo.png"
                    alt="Caregene AI"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-sm md:text-lg text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-2 md:px-3">
              {/* New Chat */}
              <Link
                href="/"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 mb-1 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <Plus className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm md:text-base text-sidebar-foreground">New Chat</span>
              </Link>

              {/* Projects */}
              <Link
                href="/projects"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 mb-1 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <FolderOpen className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm md:text-base text-sidebar-foreground">Projects</span>
              </Link>

              {/* Recent Chats */}
              <Link
                href="/recent"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 mb-2 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <Clock className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm md:text-base text-sidebar-foreground">Recent Chats</span>
              </Link>

              <div className="border-t border-sidebar-border/50 mb-2" />

              {/* Search */}
              <Link
                href="/search"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <Search className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm md:text-base text-sidebar-foreground">Search</span>
              </Link>

              {/* Parent Apps Section */}
              <div className="mt-1">
                <button
                  onClick={() => toggleSection("parent")}
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 justify-between space-x-3 px-3"
                >
                  <div className="flex items-center space-x-3">
                    <Dna className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-sm md:text-base font-medium text-sidebar-foreground">Parent Care</span>
                  </div>
                  {expandedSections.includes("parent") ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.includes("parent") && (
                  <div className="ml-8 mt-1">
                    {parentApps.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground"
                        onClick={closeMobileMenu}
                      >
                        <app.icon className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
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
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 justify-between space-x-3 px-3"
                >
                  <div className="flex items-center space-x-3">
                    <FlaskConical className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-sm md:text-base font-medium text-sidebar-foreground">Research</span>
                  </div>
                  {expandedSections.includes("enterprise") ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.includes("enterprise") && (
                  <div className="ml-8 mt-1">
                    {enterpriseApps.map((app) => (
                      <Link
                        key={app.href}
                        href={app.href}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground"
                        onClick={closeMobileMenu}
                      >
                        <app.icon className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                        <span>{app.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Simple Links */}
              <Link
                href="/about"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 mt-1 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <FileText className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm md:text-base text-sidebar-foreground">About</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <Users className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-sm md:text-base text-sidebar-foreground">Contact</span>
              </Link>
            </div>

            <div className="px-2 md:px-3 pb-2 md:pb-3 border-t border-sidebar-border">
              <div className="py-2 md:py-3">
                <Link
                  href="/subscriptions"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <CreditCard className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm md:text-base text-sidebar-foreground">Care Plans</span>
                </Link>

                <Link
                  href="/business"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Building2 className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm md:text-base text-sidebar-foreground">For Healthcare</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 md:h-12 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Settings className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-sm md:text-base text-sidebar-foreground">Settings & Help</span>
                </Link>

                <div className="ml-8 mt-2 pt-2 border-t border-sidebar-border/50">
                  <div className="px-3 py-1 text-xs text-muted-foreground">© 2024 Caregene AI</div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  )
}
