"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, MessageSquare, Bell, Lock, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface PrivacySettingsProps {
  user: any
  onBack: () => void
}

export function PrivacySettings({ user, onBack }: PrivacySettingsProps) {
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [dmPermissions, setDmPermissions] = useState("all")
  const [notificationPreferences, setNotificationPreferences] = useState({
    newPosts: true,
    comments: true,
    dms: true,
    milestoneUpdates: true,
  })
  const [dataSharingConsent, setDataSharingConsent] = useState(true)

  const handleSaveSettings = () => {
    // In a real app, you'd save these settings to your API
    console.log("Saving privacy settings:", {
      profileVisibility,
      dmPermissions,
      notificationPreferences,
      dataSharingConsent,
    })
    alert("Settings saved!")
  }

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {(typeof onBack === 'function' || typeof user?.onBack === 'function') && (
              <Button variant="ghost" size="sm" onClick={onBack || user?.onBack || router.back} className="mr-2">
                <ArrowLeft className="h-5 w-5 mr-1" /> Back
              </Button>
            )}
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
        </div>
      </header>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2">Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile Visibility */}
            <Card className="shadow-md rounded-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2" /> Profile Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Control who can see your profile information.</p>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Visible to all members)</SelectItem>
                    <SelectItem value="private">Private (Visible only to your connections)</SelectItem>
                    <SelectItem value="hidden">Hidden (Not visible to any members)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Direct Message Permissions */}
            <Card className="shadow-md rounded-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" /> Direct Message Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Choose who can send you direct messages.</p>
                <Select value={dmPermissions} onValueChange={setDmPermissions}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Allow DMs from all members</SelectItem>
                    <SelectItem value="connections">Allow DMs only from my connections</SelectItem>
                    <SelectItem value="none">Do not allow DMs</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="shadow-md rounded-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-5 w-5 mr-2" /> Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Manage what notifications you receive.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-posts-notifications">New Posts in Joined Communities</Label>
                    <Switch
                      id="new-posts-notifications"
                      checked={notificationPreferences.newPosts}
                      onCheckedChange={(checked) => setNotificationPreferences((prev) => ({ ...prev, newPosts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="comments-notifications">Comments on My Posts</Label>
                    <Switch
                      id="comments-notifications"
                      checked={notificationPreferences.comments}
                      onCheckedChange={(checked) => setNotificationPreferences((prev) => ({ ...prev, comments: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dms-notifications">New Direct Messages</Label>
                    <Switch
                      id="dms-notifications"
                      checked={notificationPreferences.dms}
                      onCheckedChange={(checked) => setNotificationPreferences((prev) => ({ ...prev, dms: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="milestone-notifications">Milestone Updates</Label>
                    <Switch
                      id="milestone-notifications"
                      checked={notificationPreferences.milestoneUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationPreferences((prev) => ({ ...prev, milestoneUpdates: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sharing Consent */}
            <Card className="shadow-md rounded-lg mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lock className="h-5 w-5 mr-2" /> Data Sharing & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your health data is sensitive. Manage your consent for data sharing.
                </p>
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-sharing-consent">
                    Allow anonymous data sharing for research purposes (e.g., rare disease research)
                  </Label>
                  <Switch
                    id="data-sharing-consent"
                    checked={dataSharingConsent}
                    onCheckedChange={(checked) => setDataSharingConsent(checked)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  By enabling this, your anonymized health information may be used to advance research into rare genetic
                  conditions. Your personal identity will never be revealed.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
