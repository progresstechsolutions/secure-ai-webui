"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Mail, Shield, Download, Trash2, Save, Users, Eye, Languages, AlertTriangle } from "lucide-react"
import { getChildren, type Child } from "@/lib/milestone-data-layer"

interface NotificationSettings {
  channels: {
    push: boolean
    email: boolean
    sms: boolean
  }
  reminders: {
    milestoneReminders: boolean
    appointmentReminders: boolean
    vaccinationAlerts: boolean
    tipReminders: boolean
    weeklyProgress: boolean
    monthlyReports: boolean
  }
}

interface AccessibilitySettings {
  largerText: boolean
  highContrast: boolean
  captionsDefault: boolean
  reducedMotion: boolean
}

interface DataSettings {
  autoBackup: boolean
  shareWithProviders: boolean
  anonymousAnalytics: boolean
}

export function MilestoneSettings() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [childNotifications, setChildNotifications] = useState<Record<string, NotificationSettings>>({})
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largerText: false,
    highContrast: false,
    captionsDefault: true,
    reducedMotion: false,
  })
  const [language, setLanguage] = useState("en")
  const [dataSettings, setDataSettings] = useState<DataSettings>({
    autoBackup: true,
    shareWithProviders: false,
    anonymousAnalytics: true,
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    try {
      const loadedChildren = getChildren()
      const safeChildren = Array.isArray(loadedChildren) ? loadedChildren : []
      setChildren(safeChildren)

      // Initialize notification settings for each child
      const initialNotifications: Record<string, NotificationSettings> = {}
      safeChildren.forEach((child) => {
        initialNotifications[child.id] = {
          channels: { push: true, email: false, sms: false },
          reminders: {
            milestoneReminders: true,
            appointmentReminders: true,
            vaccinationAlerts: true,
            tipReminders: false,
            weeklyProgress: false,
            monthlyReports: true,
          },
        }
      })
      setChildNotifications(initialNotifications)

      if (safeChildren.length > 0) {
        setSelectedChild(safeChildren[0].id)
      }
    } catch (error) {
      console.error("[v0] Error loading children:", error)
      setChildren([])
      setChildNotifications({})
    }
  }, [])

  const handleChildNotificationChange = (
    childId: string,
    category: "channels" | "reminders",
    key: string,
    value: boolean,
  ) => {
    setChildNotifications((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [category]: {
          ...prev[childId]?.[category],
          [key]: value,
        },
      },
    }))
  }

  const handleAccessibilityChange = (key: keyof AccessibilitySettings, value: boolean) => {
    setAccessibility((prev) => ({ ...prev, [key]: value }))
  }

  const handleDataSettingChange = (key: keyof DataSettings, value: boolean) => {
    setDataSettings((prev) => ({ ...prev, [key]: value }))
  }

  const exportAllData = () => {
    try {
      const allData = {
        children: children, // Use the state variable instead of calling getChildren()
        settings: {
          notifications: childNotifications,
          accessibility,
          language,
          dataSettings,
        },
        timestamp: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `milestone-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error exporting data:", error)
    }
  }

  const clearAllData = () => {
    localStorage.removeItem("milestone-store")
    setShowDeleteDialog(false)
    window.location.reload()
  }

  const currentChild = children.find((child) => child.id === selectedChild)
  const currentNotifications = childNotifications[selectedChild]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Milestone Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your milestone tracking experience</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose notification settings for each child</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Select Child</Label>
                <Select value={selectedChild} onValueChange={setSelectedChild}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        <div className="flex items-center gap-2">
                          {child.photo && (
                            <img
                              src={child.photo || "/placeholder.svg"}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          )}
                          {child.firstName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentChild && currentNotifications && (
                <>
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels for {currentChild.firstName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="text-sm font-medium">Push Notifications</span>
                        </div>
                        <Switch
                          checked={currentNotifications.channels.push}
                          onCheckedChange={(value) =>
                            handleChildNotificationChange(selectedChild, "channels", "push", value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm font-medium">Email</span>
                        </div>
                        <Switch
                          checked={currentNotifications.channels.email}
                          onCheckedChange={(value) =>
                            handleChildNotificationChange(selectedChild, "channels", "email", value)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📱</span>
                          <span className="text-sm font-medium">SMS</span>
                        </div>
                        <Switch
                          checked={currentNotifications.channels.sms}
                          onCheckedChange={(value) =>
                            handleChildNotificationChange(selectedChild, "channels", "sms", value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Reminder Types</h4>
                    <div className="space-y-3">
                      {Object.entries({
                        milestoneReminders: "Milestone checkpoint reminders",
                        appointmentReminders: "Medical appointment reminders",
                        vaccinationAlerts: "Vaccination due dates",
                        tipReminders: "Daily tip suggestions",
                        weeklyProgress: "Weekly progress summaries",
                        monthlyReports: "Monthly development reports",
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="text-sm">{label}</Label>
                          <Switch
                            checked={currentNotifications.reminders[key as keyof typeof currentNotifications.reminders]}
                            onCheckedChange={(value) =>
                              handleChildNotificationChange(selectedChild, "reminders", key, value)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No children added yet. Add a child to configure notifications.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility Settings
          </CardTitle>
          <CardDescription>Customize the app for better accessibility and usability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Larger Text</Label>
              <p className="text-sm text-muted-foreground">Increase text size throughout the app</p>
            </div>
            <Switch
              checked={accessibility.largerText}
              onCheckedChange={(value) => handleAccessibilityChange("largerText", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">Enhanced contrast for better visibility</p>
            </div>
            <Switch
              checked={accessibility.highContrast}
              onCheckedChange={(value) => handleAccessibilityChange("highContrast", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <Label>Captions Default ON</Label>
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Show captions by default for all media content</p>
            </div>
            <Switch
              checked={accessibility.captionsDefault}
              onCheckedChange={(value) => handleAccessibilityChange("captionsDefault", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={accessibility.reducedMotion}
              onCheckedChange={(value) => handleAccessibilityChange("reducedMotion", value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Language & Localization
          </CardTitle>
          <CardDescription>Choose your preferred language for the app interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>App Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    English
                  </div>
                </SelectItem>
                <SelectItem value="es">
                  <div className="flex items-center gap-2">
                    <span>🇪🇸</span>
                    Español
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">Language changes will take effect after restarting the app</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>Control your milestone data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup data to local storage</p>
              </div>
              <Switch
                checked={dataSettings.autoBackup}
                onCheckedChange={(value) => handleDataSettingChange("autoBackup", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share with Healthcare Providers</Label>
                <p className="text-sm text-muted-foreground">Allow easy sharing of reports with doctors</p>
              </div>
              <Switch
                checked={dataSettings.shareWithProviders}
                onCheckedChange={(value) => handleDataSettingChange("shareWithProviders", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Anonymous Analytics</Label>
                <p className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</p>
              </div>
              <Switch
                checked={dataSettings.anonymousAnalytics}
                onCheckedChange={(value) => handleDataSettingChange("anonymousAnalytics", value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Export All Milestone Data</h4>
                <p className="text-sm text-muted-foreground">Download complete backup as JSON file</p>
              </div>
              <Button variant="outline" onClick={exportAllData}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
              <div>
                <h4 className="font-medium text-destructive">Clear All Local Data</h4>
                <p className="text-sm text-muted-foreground">Permanently delete all milestone data from this device</p>
              </div>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Clear All Data
                    </DialogTitle>
                    <DialogDescription>
                      This will permanently delete all milestone data, including children profiles, checklists,
                      appointments, and settings. This action cannot be undone.
                      <br />
                      <br />
                      Consider exporting your data first as a backup.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={clearAllData}>
                      Yes, Delete Everything
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
