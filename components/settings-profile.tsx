"use client"

import { PrivacySharingCard } from "./privacy-sharing-card"
import { PatientProfileCard } from "./patient-profile-card"

export function SettingsProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          Settings & Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account, privacy, and data preferences</p>
      </div>

      <PatientProfileCard />

      <PrivacySharingCard />

      {/* Additional settings cards would go here */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
          Notification Preferences
        </div>
        <div className="h-32 bg-muted/50 rounded-lg flex items-center justify-center text-muted-foreground">
          App Settings
        </div>
      </div>
    </div>
  )
}
