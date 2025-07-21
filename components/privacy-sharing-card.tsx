"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Shield, Download, Settings, ExternalLink, Eye, EyeOff, Lock, Share2 } from "lucide-react"

export function PrivacySharingCard() {
  const [dataSharing, setDataSharing] = React.useState({
    analytics: true,
    research: false,
    marketing: false,
    thirdParty: false,
  })

  const [exportOptions, setExportOptions] = React.useState({
    logs: true,
    profile: true,
    trends: false,
    notes: true,
  })

  const handleSharingToggle = (key: keyof typeof dataSharing) => {
    setDataSharing((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExportToggle = (key: keyof typeof exportOptions) => {
    setExportOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleManageConsent = () => {
    // This would open a detailed consent management interface
    console.log("Opening consent management...")
  }

  const handleExportData = () => {
    // This would trigger data export process
    console.log("Exporting data with options:", exportOptions)
  }

  const handleDeleteData = () => {
    // This would open a confirmation dialog for data deletion
    console.log("Initiating data deletion process...")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Privacy & Data Sharing
        </CardTitle>
        <CardDescription>Control how your data is used and shared. Your privacy is important to us.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Data Sharing Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Data Sharing Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="analytics-toggle" className="font-medium">
                    Analytics & Performance
                  </label>
                  {dataSharing.analytics ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Help us improve the app by sharing anonymous usage data</p>
              </div>
              <Switch
                id="analytics-toggle"
                checked={dataSharing.analytics}
                onCheckedChange={() => handleSharingToggle("analytics")}
                aria-describedby="analytics-description"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="research-toggle" className="font-medium">
                    Medical Research
                  </label>
                  {dataSharing.research ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Contribute anonymized data to nutrition and health research
                </p>
              </div>
              <Switch
                id="research-toggle"
                checked={dataSharing.research}
                onCheckedChange={() => handleSharingToggle("research")}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="marketing-toggle" className="font-medium">
                    Marketing Communications
                  </label>
                  {dataSharing.marketing ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive personalized health tips and product recommendations
                </p>
              </div>
              <Switch
                id="marketing-toggle"
                checked={dataSharing.marketing}
                onCheckedChange={() => handleSharingToggle("marketing")}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label htmlFor="third-party-toggle" className="font-medium">
                    Third-Party Integrations
                  </label>
                  {dataSharing.thirdParty ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Share data with connected health apps and devices</p>
              </div>
              <Switch
                id="third-party-toggle"
                checked={dataSharing.thirdParty}
                onCheckedChange={() => handleSharingToggle("thirdParty")}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Data Export & Access */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Download className="h-4 w-4" />
            Data Export & Access
          </h3>

          <p className="text-sm text-muted-foreground">
            You have the right to access, export, or delete your personal data at any time.
          </p>

          <div className="space-y-3">
            <h4 className="font-medium">Choose data to export:</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-logs"
                  checked={exportOptions.logs}
                  onCheckedChange={() => handleExportToggle("logs")}
                />
                <label htmlFor="export-logs" className="text-sm font-medium">
                  Daily Logs & Intake Data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-profile"
                  checked={exportOptions.profile}
                  onCheckedChange={() => handleExportToggle("profile")}
                />
                <label htmlFor="export-profile" className="text-sm font-medium">
                  Profile Information
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-trends"
                  checked={exportOptions.trends}
                  onCheckedChange={() => handleExportToggle("trends")}
                />
                <label htmlFor="export-trends" className="text-sm font-medium">
                  Growth & Trend Data
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="export-notes"
                  checked={exportOptions.notes}
                  onCheckedChange={() => handleExportToggle("notes")}
                />
                <label htmlFor="export-notes" className="text-sm font-medium">
                  Personal Notes
                </label>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleManageConsent}
              className="flex-1 h-12 text-base font-medium bg-transparent"
              variant="outline"
            >
              <Settings className="h-5 w-5 mr-2" />
              Manage Consent
            </Button>
            <Button
              onClick={handleExportData}
              className="flex-1 h-12 text-base font-medium bg-transparent"
              variant="outline"
            >
              <Download className="h-5 w-5 mr-2" />
              Export My Data
            </Button>
          </div>

          <Button onClick={handleDeleteData} variant="destructive" className="w-full h-12 text-base font-medium">
            <Lock className="h-5 w-5 mr-2" />
            Delete My Data
          </Button>
        </div>

        {/* Data Protection Information */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            Data Protection
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Your data is encrypted and stored securely. We follow industry best practices for data protection and
              comply with privacy regulations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <a href="#" className="flex items-center gap-1">
                  Privacy Policy <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <a href="#" className="flex items-center gap-1">
                  Terms of Service <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <a href="#" className="flex items-center gap-1">
                  Data Security <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
