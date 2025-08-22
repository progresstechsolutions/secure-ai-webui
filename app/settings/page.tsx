"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Switch } from "../../components/ui/switch"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import {
  ArrowLeft,
  Settings,
  User,
  Shield,
  Bell,
  Eye,
  Lock,
  Globe,
  Smartphone,
  Mail,
  UserCheck,
  AlertTriangle,
  LogOut
} from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  
  // Mock user data - in a real app, you'd get this from your auth system
  const user = {
    id: "current-user",
    email: "user@example.com",
    name: "Current User",
    username: "current_user",
    image: "/placeholder-user.jpg",
    healthConditions: ["Cystic Fibrosis"],
    location: {
      region: "United States",
      state: "California"
    }
  }
  
  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showHealthConditions: true,
    showLocation: true,
    allowMessages: true,
    showOnlineStatus: true,
    dataSharing: false,
    analyticsOptOut: false
  })

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    communityUpdates: true,
    directMessages: true,
    weeklyDigest: true,
    marketingEmails: false
  })

  // Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30
  })

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" })
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    console.log("Saving settings:", {
      privacy: privacySettings,
      notifications: notificationSettings,
      account: accountSettings
    })
    
    // Show success message (you could use toast here)
    alert("Settings saved successfully!")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // In a real app, this would delete the account
      console.log("Deleting account...")
      signOut({ callbackUrl: "/auth/signin" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Settings</h1>
                <p className="text-xs text-gray-500">Manage your preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleSaveSettings}>
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Account Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <p className="text-sm text-gray-900">{user.name || user.username}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Username</Label>
                <p className="text-sm text-gray-900">@{user.username}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <p className="text-sm text-gray-900">{user.location.region}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Health Conditions</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.healthConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-xs">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Profile Visibility</Label>
                <p className="text-xs text-gray-500">Who can see your profile information</p>
              </div>
              <select 
                className="text-sm border rounded px-2 py-1"
                value={privacySettings.profileVisibility}
                onChange={(e) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  profileVisibility: e.target.value 
                }))}
              >
                <option value="public">Public</option>
                <option value="community">Community Members Only</option>
                <option value="private">Private</option>
              </select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Health Conditions</Label>
                <p className="text-xs text-gray-500">Display your health conditions on your profile</p>
              </div>
              <Switch
                checked={privacySettings.showHealthConditions}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  showHealthConditions: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Location</Label>
                <p className="text-xs text-gray-500">Display your location on your profile</p>
              </div>
              <Switch
                checked={privacySettings.showLocation}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  showLocation: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Allow Direct Messages</Label>
                <p className="text-xs text-gray-500">Let other members send you messages</p>
              </div>
              <Switch
                checked={privacySettings.allowMessages}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  allowMessages: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Show Online Status</Label>
                <p className="text-xs text-gray-500">Let others see when you're online</p>
              </div>
              <Switch
                checked={privacySettings.showOnlineStatus}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  showOnlineStatus: checked 
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  emailNotifications: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-gray-500">Receive push notifications on your device</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  pushNotifications: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Community Updates</Label>
                <p className="text-xs text-gray-500">Get notified about community activities</p>
              </div>
              <Switch
                checked={notificationSettings.communityUpdates}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  communityUpdates: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Direct Messages</Label>
                <p className="text-xs text-gray-500">Get notified about new messages</p>
              </div>
              <Switch
                checked={notificationSettings.directMessages}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  directMessages: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Weekly Digest</Label>
                <p className="text-xs text-gray-500">Receive a weekly summary of activities</p>
              </div>
              <Switch
                checked={notificationSettings.weeklyDigest}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  weeklyDigest: checked 
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={accountSettings.twoFactorAuth}
                onCheckedChange={(checked) => setAccountSettings(prev => ({ 
                  ...prev, 
                  twoFactorAuth: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Login Alerts</Label>
                <p className="text-xs text-gray-500">Get notified of new sign-ins</p>
              </div>
              <Switch
                checked={accountSettings.loginAlerts}
                onCheckedChange={(checked) => setAccountSettings(prev => ({ 
                  ...prev, 
                  loginAlerts: checked 
                }))}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Session Timeout</Label>
              <p className="text-xs text-gray-500 mb-2">Automatically sign out after period of inactivity</p>
              <select 
                className="text-sm border rounded px-2 py-1"
                value={accountSettings.sessionTimeout}
                onChange={(e) => setAccountSettings(prev => ({ 
                  ...prev, 
                  sessionTimeout: parseInt(e.target.value) 
                }))}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={240}>4 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Data Sharing</Label>
                <p className="text-xs text-gray-500">Share anonymized data to improve our services</p>
              </div>
              <Switch
                checked={privacySettings.dataSharing}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  dataSharing: checked 
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Analytics Opt-out</Label>
                <p className="text-xs text-gray-500">Opt out of analytics tracking</p>
              </div>
              <Switch
                checked={privacySettings.analyticsOptOut}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({ 
                  ...prev, 
                  analyticsOptOut: checked 
                }))}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Download Your Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="h-4 w-4 mr-2" />
                Data Usage Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out of All Devices
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Deleting your account will permanently remove all your data, posts, and community memberships. This action cannot be undone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 