"use client"

import { Button } from "@/components/atoms/Button/Button"
import { Avatar } from "@/components/atoms/Avatar/Avatar"
import { useAuth } from "@/contexts/auth-context"
import { useChildProfile } from "@/contexts/child-profile-context"
import { FileText, Users, LogOut, Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

type ActiveView = "documents" | "patient-management"

interface NavigationProps {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const { user, logout } = useAuth()
  const { children, activeChild, setActiveChild } = useChildProfile()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isChildSelectorOpen, setIsChildSelectorOpen] = useState(false)

  const navigationItems = [
    {
      id: "documents" as const,
      label: "Documents",
      icon: FileText,
      description: "View and manage documents",
    },
    {
          id: "patient-management" as const,
    label: "Patient Management",
      icon: Users,
      description: "Add, edit, and manage child profiles",
    },
  ]

  const handleChildSelect = (child: typeof activeChild) => {
    setActiveChild(child)
    setIsChildSelectorOpen(false)
    // Switch to documents view when selecting a child
    if (activeView !== "documents") {
      onViewChange("documents")
    }
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">DocHub</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  leftIcon={<item.icon className="h-4 w-4" />}
                  className="gap-2"
                >
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Child Selector */}
            {children.length > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChildSelectorOpen(!isChildSelectorOpen)}
                  className="gap-2 min-w-[160px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    {activeChild ? (
                      <>
                        <Avatar
                          src={activeChild.avatar}
                          fallback={activeChild.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                          size="sm"
                        />
                        <span className="truncate">{activeChild.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Select Child</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {isChildSelectorOpen && (
                  <div className="absolute top-full right-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                        Select Active Child
                      </div>
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleChildSelect(child)}
                          className={cn(
                            "w-full flex items-center gap-3 px-2 py-2 rounded-md text-left hover:bg-accent transition-colors",
                            activeChild?.id === child.id && "bg-accent",
                          )}
                        >
                          <Avatar
                            src={child.avatar}
                            fallback={child.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{child.name}</p>
                            <p className="text-xs text-muted-foreground">Age {child.age}</p>
                          </div>
                          {activeChild?.id === child.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </button>
                      ))}
                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={() => {
                            onViewChange("patient-management")
                            setIsChildSelectorOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left hover:bg-accent transition-colors text-sm"
                        >
                          <Users className="h-4 w-4" />
                          Patient Management
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={user.avatar}
                    fallback={user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="sm"
                  />
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="hidden lg:inline">Sign Out</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-2">
              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onViewChange(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  leftIcon={<item.icon className="h-4 w-4" />}
                  className="w-full justify-start gap-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </Button>
              ))}

              {/* Child Selector Mobile */}
              {children.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium text-muted-foreground px-3 py-2">Active Child</div>
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        handleChildSelect(child)
                        setIsMobileMenuOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-accent transition-colors",
                        activeChild?.id === child.id && "bg-accent",
                      )}
                    >
                      <Avatar
                        src={child.avatar}
                        fallback={child.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                        size="sm"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{child.name}</p>
                        <p className="text-xs text-muted-foreground">Age {child.age}</p>
                      </div>
                      {activeChild?.id === child.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </button>
                  ))}
                </div>
              )}

              {/* User Info Mobile */}
              {user && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar
                      src={user.avatar}
                      fallback={user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      size="sm"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout()
                      setIsMobileMenuOpen(false)
                    }}
                    leftIcon={<LogOut className="h-4 w-4" />}
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isChildSelectorOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsChildSelectorOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}
