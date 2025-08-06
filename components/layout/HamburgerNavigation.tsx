"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useChildProfile } from "@/contexts/child-profile-context"
import { CustomLogo } from "@/components/ui/CustomLogo"
import {
  Menu,
  Upload,
  FileText,
  BarChart3,
  Users,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react"

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "documents", label: "Documents", icon: FileText },
      { id: "patient-management", label: "Patient Management", icon: Users },
]

export function HamburgerNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { activeChild, children, setActiveChild } = useChildProfile()

  const handleNavigation = (tabId: string) => {
    window.location.hash = tabId
    window.dispatchEvent(new CustomEvent("navigation-change", { detail: { tab: tabId } }))
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <CustomLogo 
            size="sm" 
            src="/images/healthbinder-logo.png"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">HealthBinder</span>
        </div>

        {/* Child Selector */}
        <div className="flex-1 max-w-xs mx-4">
          <Select
            value={activeChild?.id || ""}
            onValueChange={(childId) => {
              const child = children.find((c) => c.id === childId)
              if (child) setActiveChild(child)
            }}
          >
            <SelectTrigger className="w-full bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 hover:from-blue-100 hover:to-green-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-b from-white to-blue-50 border-blue-200 shadow-lg">
              {children.map((child) => (
                <SelectItem key={child.id} value={child.id} className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-green-100 focus:bg-gradient-to-r focus:from-blue-100 focus:to-green-100">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={child.avatar} alt={child.name} />
                      <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {child.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => handleNavigation(item.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="mt-6 space-y-4">
              {/* Active Child Info */}
              {activeChild && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeChild.avatar} alt={activeChild.name} />
                      <AvatarFallback>{activeChild.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{activeChild.name}</p>
                      <p className="text-sm text-muted-foreground">Age {activeChild.age}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>

              {/* Settings & Profile */}
              <div className="pt-4 border-t space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
