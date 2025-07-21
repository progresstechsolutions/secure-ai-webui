"use client"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "pms-guide", label: "PMS Guide", icon: "🌸" },
    { id: "trends", label: "Trends", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  return (
    <nav className="flex flex-wrap gap-2 p-1 bg-muted rounded-lg" role="tablist">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className="flex-1 min-w-0 gap-2"
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </Button>
      ))}
    </nav>
  )
}
