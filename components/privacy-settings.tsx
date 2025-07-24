"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, MessageSquare, Bell, Lock, Save, Shield, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('privacy_settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setProfileVisibility(parsed.profileVisibility || "public")
        setDmPermissions(parsed.dmPermissions || "all")
        setNotificationPreferences(parsed.notificationPreferences || {
          newPosts: true,
          comments: true,
          dms: true,
          milestoneUpdates: true,
        })
        setDataSharingConsent(parsed.dataSharingConsent ?? true)
      } catch (error) {
        console.error('Error loading privacy settings:', error)
      }
    }
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    const settingsToSave = {
      profileVisibility,
      dmPermissions,
      notificationPreferences,
      dataSharingConsent,
      lastUpdated: new Date().toISOString()
    }

    try {
      // Save to localStorage
      localStorage.setItem('privacy_settings', JSON.stringify(settingsToSave))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings Saved Successfully! 🎉",
        description: "Your privacy preferences have been updated.",
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error Saving Settings",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-2 md:px-4"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Back to Home</span>
            </Button>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex items-center">
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <span className="hidden sm:inline">Privacy Settings</span>
                  <span className="sm:hidden">Privacy</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">🔒 Your Privacy Matters</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4 md:px-0">
            Take control of your privacy and data sharing preferences. Your information is always secure and protected.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Profile Visibility */}
          <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                  👤 Profile Visibility
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Control who can see your profile information and activity.</p>
              <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                <SelectTrigger className="w-full h-10 md:h-12 text-sm md:text-base border-2 border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public" className="text-sm md:text-base py-2 md:py-3">
                    🌍 Public (Visible to all members)
                  </SelectItem>
                  <SelectItem value="private" className="text-sm md:text-base py-2 md:py-3">
                    👥 Private (Visible only to your connections)
                  </SelectItem>
                  <SelectItem value="hidden" className="text-sm md:text-base py-2 md:py-3">
                    🔒 Hidden (Not visible to any members)
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Direct Message Permissions */}
          <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                  💬 Direct Message Permissions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Choose who can send you direct messages and connect with you.</p>
              <Select value={dmPermissions} onValueChange={setDmPermissions}>
                <SelectTrigger className="w-full h-10 md:h-12 text-sm md:text-base border-2 border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400">
                  <SelectValue placeholder="Select permissions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm md:text-base py-2 md:py-3">
                    🌐 Allow DMs from all members
                  </SelectItem>
                  <SelectItem value="connections" className="text-sm md:text-base py-2 md:py-3">
                    👥 Allow DMs only from my connections
                  </SelectItem>
                  <SelectItem value="none" className="text-sm md:text-base py-2 md:py-3">
                    🚫 Do not allow DMs
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bell className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                  🔔 Notification Preferences
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Manage what notifications you receive to stay informed without being overwhelmed.</p>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl">📝</span>
                    <div className="min-w-0 flex-1">
                      <Label htmlFor="new-posts-notifications" className="text-sm md:text-base font-medium text-gray-900 cursor-pointer block">
                        New Posts in Joined Communities
                      </Label>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Get notified when new posts are shared in your communities</p>
                    </div>
                  </div>
                  <Switch
                    id="new-posts-notifications"
                    checked={notificationPreferences.newPosts}
                    onCheckedChange={(checked) => setNotificationPreferences((prev) => ({ ...prev, newPosts: checked }))}
                    className="data-[state=checked]:bg-blue-600 ml-3"
                  />
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl">💬</span>
                    <div className="min-w-0 flex-1">
                      <Label htmlFor="comments-notifications" className="text-sm md:text-base font-medium text-gray-900 cursor-pointer block">
                        Comments on My Posts
                      </Label>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Get notified when someone comments on your posts</p>
                    </div>
                  </div>
                  <Switch
                    id="comments-notifications"
                    checked={notificationPreferences.comments}
                    onCheckedChange={(checked) => setNotificationPreferences((prev) => ({ ...prev, comments: checked }))}
                    className="data-[state=checked]:bg-blue-600 ml-3"
                  />
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl">📩</span>
                    <div className="min-w-0 flex-1">
                      <Label htmlFor="dms-notifications" className="text-sm md:text-base font-medium text-gray-900 cursor-pointer block">
                        New Direct Messages
                      </Label>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Get notified when you receive direct messages</p>
                    </div>
                  </div>
                  <Switch
                    id="dms-notifications"
                    checked={notificationPreferences.dms}
                    onCheckedChange={(checked) => setNotificationPreferences((prev) => ({ ...prev, dms: checked }))}
                    className="data-[state=checked]:bg-blue-600 ml-3"
                  />
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl">🏆</span>
                    <div className="min-w-0 flex-1">
                      <Label htmlFor="milestone-notifications" className="text-sm md:text-base font-medium text-gray-900 cursor-pointer block">
                        Milestone Updates
                      </Label>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Get notified about milestone achievements in your communities</p>
                    </div>
                  </div>
                  <Switch
                    id="milestone-notifications"
                    checked={notificationPreferences.milestoneUpdates}
                    onCheckedChange={(checked) =>
                      setNotificationPreferences((prev) => ({ ...prev, milestoneUpdates: checked }))
                    }
                    className="data-[state=checked]:bg-blue-600 ml-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing Consent */}
          <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Lock className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                  🔬 Data Sharing & Research
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                Your health data is sensitive and valuable for advancing rare disease research. Help make a difference while staying anonymous.
              </p>
              <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-2 md:space-x-3 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl">🧬</span>
                    <div className="min-w-0 flex-1">
                      <Label htmlFor="data-sharing-consent" className="text-sm md:text-base font-medium text-gray-900 cursor-pointer block mb-2">
                        Allow Anonymous Data Sharing for Research
                      </Label>
                      <p className="text-xs md:text-sm text-gray-600">
                        Enable anonymous sharing of your health information to advance research into rare genetic conditions. 
                        Your personal identity will never be revealed.
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="data-sharing-consent"
                    checked={dataSharingConsent}
                    onCheckedChange={(checked) => setDataSharingConsent(checked)}
                    className="data-[state=checked]:bg-blue-600 ml-3 md:ml-4"
                  />
                </div>
                <div className="bg-white p-3 md:p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-xs md:text-sm text-blue-700">
                    <Shield className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="font-medium">Your data is protected:</span>
                  </div>
                  <ul className="mt-2 text-xs text-gray-600 space-y-1 ml-4 md:ml-6">
                    <li>• All personal identifiers are removed</li>
                    <li>• Data is encrypted and securely stored</li>
                    <li>• Used only for approved research purposes</li>
                    <li>• You can opt out at any time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-6 md:pt-8">
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2 md:mr-3"></div>
                  Saving Settings...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                  Save Privacy Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
