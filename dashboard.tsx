"use client"

import * as React from "react"
import { IntakeLoggingCard } from "./components/intake-logging-card"
import { GrowthTrendsPanel } from "./components/growth-trends-panel"
import { SettingsProfile } from "./components/settings-profile"
import { Navigation } from "./components/navigation"
import { SafetyAlertBanner } from "./components/safety-alert-banner"
import { Toaster } from "@/components/ui/toaster"
import { PMSGuideEnhanced } from "./components/pms-guide-enhanced"

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState("dashboard")

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Food & Nutrition </h1>
          <p className="text-muted-foreground">Track your daily intake and symptoms</p>
        </div>

        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Safety Alert Banner - Always visible when there are alerts */}
        <SafetyAlertBanner />

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <IntakeLoggingCard />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                Daily Summary
              </div>
              <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                Weekly Trends
              </div>
              <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
                Goals Progress
              </div>
            </div>

            <GrowthTrendsPanel />
          </div>
        )}

        {activeTab === "pms-guide" && (
          <div role="tabpanel" id="pms-guide-panel" aria-labelledby="pms-guide-tab">
            <PMSGuideEnhanced />
          </div>
        )}

        {activeTab === "trends" && (
          <div role="tabpanel" id="trends-panel" aria-labelledby="trends-tab">
            <GrowthTrendsPanel />
          </div>
        )}

        {activeTab === "settings" && (
          <div role="tabpanel" id="settings-panel" aria-labelledby="settings-tab">
            <SettingsProfile />
          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
