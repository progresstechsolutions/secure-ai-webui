"use client"

import * as React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Info, Heart, Pill } from "lucide-react"

// Mock function to determine alerts based on user data
const generateAlerts = () => {
  // This would normally check recent logs, user profile, medications, etc.
  const alerts = []

  // Example alert conditions
  const recentLogs = {
    hasHighSodiumIntake: true,
    missedMedications: 2,
    lowIronSymptoms: true,
    hasBloodPressureMeds: true,
  }

  if (recentLogs.hasHighSodiumIntake && recentLogs.hasBloodPressureMeds) {
    alerts.push({
      id: "sodium-bp",
      type: "warning",
      icon: Heart,
      title: "High Sodium Alert",
      message:
        "Your recent sodium intake may interact with your blood pressure medication. Consider reducing salt intake.",
      action: "View Details",
      priority: "high",
    })
  }

  if (recentLogs.missedMedications > 1) {
    alerts.push({
      id: "missed-meds",
      type: "error",
      icon: Pill,
      title: "Medication Reminder",
      message: `You've missed ${recentLogs.missedMedications} medication doses this week. Consistency is important for effectiveness.`,
      action: "Set Reminders",
      priority: "high",
    })
  }

  if (recentLogs.lowIronSymptoms) {
    alerts.push({
      id: "iron-deficiency",
      type: "info",
      icon: Info,
      title: "Iron Levels",
      message:
        "Your recent symptoms may indicate low iron. Consider adding iron-rich foods or consult your healthcare provider.",
      action: "Learn More",
      priority: "medium",
    })
  }

  return alerts
}

export function SafetyAlertBanner() {
  const [alerts, setAlerts] = React.useState(generateAlerts())
  const [dismissedAlerts, setDismissedAlerts] = React.useState<string[]>([])

  // Filter out dismissed alerts
  const activeAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id))

  // Show only the highest priority alert
  const currentAlert = activeAlerts.find((alert) => alert.priority === "high") || activeAlerts[0]

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => [...prev, alertId])
  }

  const handleViewDetails = (alert: typeof currentAlert) => {
    // This would open a detailed view or navigate to relevant section
    console.log("Viewing details for:", alert?.id)
  }

  // Don't render if no active alerts
  if (!currentAlert) {
    return null
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "default"
      case "info":
        return "default"
      default:
        return "default"
    }
  }

  const getAlertStyles = (type: string) => {
    switch (type) {
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
      case "warning":
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
      default:
        return ""
    }
  }

  const IconComponent = currentAlert.icon

  return (
    <div role="alert" aria-live="polite" aria-atomic="true" className="w-full">
      <Alert variant={getAlertVariant(currentAlert.type)} className={`${getAlertStyles(currentAlert.type)} border-l-4`}>
        <div className="flex items-start gap-3 w-full">
          <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{currentAlert.title}</h4>
                <AlertDescription className="text-sm leading-relaxed">{currentAlert.message}</AlertDescription>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(currentAlert)}
                  className="text-xs h-8"
                >
                  {currentAlert.action}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(currentAlert.id)}
                  className="h-8 w-8 p-0"
                  aria-label="Dismiss alert"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert counter if multiple alerts */}
        {activeAlerts.length > 1 && (
          <div className="mt-3 pt-3 border-t border-current/20">
            <p className="text-xs text-muted-foreground">
              {activeAlerts.length - 1} more alert{activeAlerts.length - 1 !== 1 ? "s" : ""} available
            </p>
          </div>
        )}
      </Alert>
    </div>
  )
}
