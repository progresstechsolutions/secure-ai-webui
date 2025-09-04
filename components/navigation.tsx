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
  Clock,
  Plus,
  Pin,
  Menu,
  X,
  FolderOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/components/navigation-context"
import { mockChatHistory } from "@/data/mockChatHistory"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Navigation() {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [researchHovered, setResearchHovered] = useState(false)
  const [parentHovered, setParentHovered] = useState(false)
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectType, setProjectType] = useState("")
  const { isPinned, setIsPinned } = useNavigation()
  const navRef = useRef<HTMLElement>(null)

  const [debouncedHover, setDebouncedHover] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout>()
  const researchHoverTimeoutRef = useRef<NodeJS.Timeout>()
  const parentHoverTimeoutRef = useRef<NodeJS.Timeout>()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = mockChatHistory.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query.toLowerCase()) ||
        chat.content.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(results)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }

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

  const handleResearchMouseEnter = () => {
    if (researchHoverTimeoutRef.current) {
      clearTimeout(researchHoverTimeoutRef.current)
    }
    setResearchHovered(true)
  }

  const handleResearchMouseLeave = () => {
    researchHoverTimeoutRef.current = setTimeout(() => {
      setResearchHovered(false)
    }, 300)
  }

  const handleParentMouseEnter = () => {
    if (parentHoverTimeoutRef.current) {
      clearTimeout(parentHoverTimeoutRef.current)
    }
    setParentHovered(true)
  }

  const handleParentMouseLeave = () => {
    parentHoverTimeoutRef.current = setTimeout(() => {
      setParentHovered(false)
    }, 300)
  }

  const handleCreateProject = () => {
    if (projectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: projectName.trim(),
        type: projectType || "general", // Default to general if no type selected
        createdAt: new Date().toISOString(),
      }

      const existingProjects = JSON.parse(localStorage.getItem("caregene-projects") || "[]")
      existingProjects.push(newProject)
      localStorage.setItem("caregene-projects", JSON.stringify(existingProjects))

      localStorage.setItem("caregene-active-project", JSON.stringify(newProject))

      setProjectName("")
      setProjectType("")
      setShowProjectDialog(false)
      closeMobileMenu()

      window.location.href = "/"
    }
  }

  const projectTypes = [
    { value: "health-tracking", label: "Health Tracking" },
    { value: "milestone-monitoring", label: "Milestone Monitoring" },
    { value: "research-study", label: "Research Study" },
    { value: "clinical-trial", label: "Clinical Trial" },
    { value: "genetic-analysis", label: "Genetic Analysis" },
    { value: "therapy-tracking", label: "Therapy Tracking" },
    { value: "medication-management", label: "Medication Management" },
    { value: "general", label: "General Project" },
  ]

  const shouldExpand = isPinned || (isHovered && !isPinned)

  const parentApps = [
    { href: "/care-community", icon: Users, label: "Community" },
    { href: "/health-journal", icon: BookOpen, label: "Journal" },
    { href: "/genetic-tracker", icon: Dna, label: "Tracker" },
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
        className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-sidebar/95 backdrop-blur border border-sidebar-border lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-sidebar-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
          onTouchStart={closeMobileMenu}
        />
      )}

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
          <div className="border-b border-sidebar-border flex items-center justify-between p-3">
            <Link
              href="/"
              className="flex items-center transition-all duration-200 space-x-2"
              onClick={closeMobileMenu}
            >
              <div className="flex-shrink-0 h-6 w-6">
                <Image
                  src="/images/caregene-logo.png"
                  alt="Caregene AI"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="font-serif font-bold text-sm text-sidebar-foreground whitespace-nowrap">
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
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {/* New Chat */}
            <Link
              href="/"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
              onClick={closeMobileMenu}
            >
              <Plus className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && <span className="text-sm text-sidebar-foreground">New Chat</span>}
            </Link>

            {shouldExpand || isMobileMenuOpen ? (
              <div className="my-2">
                <div className="relative">
                  <div className="flex items-center rounded-lg border border-sidebar-border bg-sidebar-accent/5 h-8 px-2">
                    <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground mr-2" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-sidebar-foreground placeholder:text-muted-foreground border-0 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="ml-1 p-0.5 hover:bg-sidebar-accent/20 rounded">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {isSearching && (
                  <div className="mt-1 max-h-40 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-0.5">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/chat/${result.id}`}
                            className="block p-2 rounded-lg hover:bg-sidebar-accent/10 transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <div className="text-xs font-medium text-sidebar-foreground truncate">{result.title}</div>
                            <div className="text-xs text-muted-foreground truncate mt-1">{result.content}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-xs text-muted-foreground text-center">No chats found</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/search"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Search className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              </Link>
            )}

            {/* Projects */}
            <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
              <DialogTrigger asChild>
                <button className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 w-full">
                  <FolderOpen className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  {(shouldExpand || isMobileMenuOpen) && (
                    <span className="text-sm text-sidebar-foreground">New Project</span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      placeholder="Enter project name..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-type">Project Type (Optional)</Label>
                    <Select value={projectType} onValueChange={setProjectType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type (optional)..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Chats */}
            <Link
              href="/recent"
              className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2 mb-2"
              onClick={closeMobileMenu}
            >
              <Clock className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
              {(shouldExpand || isMobileMenuOpen) && (
                <span className="text-sm text-sidebar-foreground">Recent Chats</span>
              )}
            </Link>

            {(shouldExpand || isMobileMenuOpen) && <div className="border-t border-sidebar-border/50 my-2" />}

            {/* Parent Apps Section */}
            <div>
              <button
                onClick={() => toggleSection("parent")}
                onMouseEnter={handleParentMouseEnter}
                onMouseLeave={handleParentMouseLeave}
                className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2"
              >
                <div className="flex items-center space-x-2">
                  <Dna className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  {(shouldExpand || isMobileMenuOpen) && (
                    <span className="text-sm font-medium text-sidebar-foreground">Parent Care</span>
                  )}
                </div>
                {(shouldExpand || isMobileMenuOpen) && (
                  <>
                    {expandedSections.includes("parent") || parentHovered ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>

              {(shouldExpand || isMobileMenuOpen) && (expandedSections.includes("parent") || parentHovered) && (
                <div className="ml-6 mt-1" onMouseEnter={handleParentMouseEnter} onMouseLeave={handleParentMouseLeave}>
                  {parentApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
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
                onMouseEnter={handleResearchMouseEnter}
                onMouseLeave={handleResearchMouseLeave}
                className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 justify-between space-x-2 px-2"
              >
                <div className="flex items-center space-x-2">
                  <FlaskConical className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                  {(shouldExpand || isMobileMenuOpen) && (
                    <span className="text-sm font-medium text-sidebar-foreground">Research</span>
                  )}
                </div>
                {(shouldExpand || isMobileMenuOpen) && (
                  <>
                    {expandedSections.includes("enterprise") || researchHovered ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </>
                )}
              </button>

              {(shouldExpand || isMobileMenuOpen) && (expandedSections.includes("enterprise") || researchHovered) && (
                <div
                  className="ml-6 mt-1"
                  onMouseEnter={handleResearchMouseEnter}
                  onMouseLeave={handleResearchMouseLeave}
                >
                  {enterpriseApps.map((app) => (
                    <Link
                      key={app.href}
                      href={app.href}
                      className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sm text-muted-foreground hover:text-foreground"
                      onClick={closeMobileMenu}
                    >
                      <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                      <span>{app.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-2 pb-2 border-t border-sidebar-border">
            <div className="py-2">
              <Link
                href="/subscriptions"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <CreditCard className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">Care Plans</span>
                )}
              </Link>

              <Link
                href="/business"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Building2 className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">For Healthcare</span>
                )}
              </Link>

              <Link
                href="/contact"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Users className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">Contact Us</span>
                )}
              </Link>

              <Link
                href="/settings"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-8 space-x-2 px-2"
                onClick={closeMobileMenu}
              >
                <Settings className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                {(shouldExpand || isMobileMenuOpen) && (
                  <span className="text-sm text-sidebar-foreground">Settings & Help</span>
                )}
              </Link>

              {(shouldExpand || isMobileMenuOpen) && (
                <div className="ml-6 mt-2 pt-2 border-t border-sidebar-border/50">
                  <div className="px-2 text-xs text-muted-foreground text-center">© 2024 Caregene AI</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <nav className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-sidebar/95 backdrop-blur border-r border-sidebar-border lg:hidden overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-sidebar-border flex items-center justify-between p-4">
              <Link
                href="/"
                className="flex items-center transition-all duration-200 space-x-3"
                onClick={closeMobileMenu}
              >
                <div className="flex-shrink-0 h-7 w-7">
                  <Image
                    src="/images/caregene-logo.png"
                    alt="Caregene AI"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-serif font-bold text-lg text-sidebar-foreground whitespace-nowrap">
                  Caregene AI
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {/* New Chat */}
              <Link
                href="/"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                onClick={closeMobileMenu}
              >
                <Plus className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-base text-sidebar-foreground">New Chat</span>
              </Link>

              <div className="my-3">
                <div className="relative">
                  <div className="flex items-center rounded-lg border border-sidebar-border bg-sidebar-accent/5 h-10 px-3">
                    <Search className="h-5 w-5 flex-shrink-0 text-muted-foreground mr-3" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-base text-sidebar-foreground placeholder:text-muted-foreground border-0 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={clearSearch} className="ml-2 p-1 hover:bg-sidebar-accent/20 rounded">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile Search Results */}
                {isSearching && (
                  <div className="mt-2 max-h-48 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            href={`/chat/${result.id}`}
                            className="block p-3 rounded-lg hover:bg-sidebar-accent/10 transition-colors"
                            onClick={closeMobileMenu}
                          >
                            <div className="text-sm font-medium text-sidebar-foreground truncate">{result.title}</div>
                            <div className="text-sm text-muted-foreground truncate mt-1">{result.content}</div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground text-center">No chats found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Projects */}
              <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                <DialogTrigger asChild>
                  <button className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3 w-full">
                    <FolderOpen className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-base text-sidebar-foreground">New Project</span>
                  </button>
                </DialogTrigger>
              </Dialog>

              {/* Recent Chats */}
              <Link
                href="/recent"
                className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3 mb-3"
                onClick={closeMobileMenu}
              >
                <Clock className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                <span className="text-base text-sidebar-foreground">Recent Chats</span>
              </Link>

              <div className="border-t border-sidebar-border/50 mb-3" />

              {/* Parent Apps Section */}
              <div>
                <button
                  onClick={() => toggleSection("parent")}
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 justify-between space-x-3 px-3"
                >
                  <div className="flex items-center space-x-3">
                    <Dna className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-base font-medium text-sidebar-foreground">Parent Care</span>
                  </div>
                  {expandedSections.includes("parent") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
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
                        <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
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
                  className="flex items-center w-full rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 justify-between space-x-3 px-3"
                >
                  <div className="flex items-center space-x-3">
                    <FlaskConical className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                    <span className="text-base font-medium text-sidebar-foreground">Research</span>
                  </div>
                  {expandedSections.includes("enterprise") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
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
                        <app.icon className="h-4 w-4 flex-shrink-0 text-sidebar-primary" />
                        <span>{app.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-3 pb-4 border-t border-sidebar-border">
              <div className="py-3">
                <Link
                  href="/subscriptions"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <CreditCard className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">Care Plans</span>
                </Link>

                <Link
                  href="/business"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Building2 className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">For Healthcare</span>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Users className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">Contact Us</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center rounded-lg hover:bg-sidebar-accent/10 transition-colors h-10 space-x-3 px-3"
                  onClick={closeMobileMenu}
                >
                  <Settings className="h-5 w-5 flex-shrink-0 text-sidebar-primary" />
                  <span className="text-base text-sidebar-foreground">Settings & Help</span>
                </Link>

                <div className="ml-8 mt-3 pt-3 border-t border-sidebar-border/50">
                  <div className="px-3 text-xs text-muted-foreground">© 2024 Caregene AI</div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  )
}

export default Navigation
