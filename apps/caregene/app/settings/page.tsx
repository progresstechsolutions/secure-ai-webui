"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  User,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Heart,
  Building2,
  BookOpen,
  Users,
  AlertTriangle,
  HelpCircle,
  Download,
  Trash2,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"

export default function SettingsHelpPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else if (newTheme === "light") {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
    } else {
      // System theme
      document.documentElement.classList.remove("dark", "light")
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        document.documentElement.classList.add("dark")
      }
    }
    // Store preference in localStorage
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm sm:text-base">Back to home</span>
        </Link>

        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Settings & Help
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your account preferences and get the support you need
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-6 flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Account Settings</span>
                </h2>

                <div className="space-y-6">
                  {/* Profile Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Profile Information</span>
                      </CardTitle>
                      <CardDescription>Update your personal information and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Enter your first name" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Enter your last name" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <Button className="w-full sm:w-auto">Save Changes</Button>
                    </CardContent>
                  </Card>

                  {/* Theme Settings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>Theme Preferences</span>
                      </CardTitle>
                      <CardDescription>Choose your preferred theme for the interface</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          className="flex items-center justify-center space-x-2 h-12"
                          onClick={() => handleThemeChange("light")}
                        >
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          className="flex items-center justify-center space-x-2 h-12"
                          onClick={() => handleThemeChange("dark")}
                        >
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </Button>
                        <Button
                          variant={theme === "system" ? "default" : "outline"}
                          className="flex items-center justify-center space-x-2 h-12"
                          onClick={() => handleThemeChange("system")}
                        >
                          <Monitor className="h-4 w-4" />
                          <span>System</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {theme === "system"
                          ? "Automatically matches your device settings"
                          : theme === "dark"
                            ? "Dark theme reduces eye strain in low light"
                            : "Light theme provides optimal readability"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Notification Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </CardTitle>
                      <CardDescription>Choose what notifications you'd like to receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Health Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Get reminders for medications and appointments
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Research Updates</p>
                          <p className="text-sm text-muted-foreground">Receive updates on relevant research findings</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Community Messages</p>
                          <p className="text-sm text-muted-foreground">Get notified about community discussions</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Privacy Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>Privacy & Security</span>
                      </CardTitle>
                      <CardDescription>Manage your privacy preferences and data security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Sharing for Research</p>
                          <p className="text-sm text-muted-foreground">Help improve care for others (anonymized)</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-muted-foreground">Allow others in community to see your profile</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Download My Data
                        </Button>
                        <Button variant="destructive" className="w-full sm:w-auto">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-6 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Contact Support</span>
                </h2>

                {/* Emergency Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-800 text-sm mb-2">Medical Emergency</h3>
                      <p className="text-red-700 text-xs sm:text-sm">
                        For urgent medical questions or emergencies, please contact your healthcare provider immediately
                        or call emergency services (911). Caregene AI provides informational support and is not a
                        substitute for professional medical advice.
                      </p>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactName">Name</Label>
                          <Input id="contactName" placeholder="Your full name" />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">Email</Label>
                          <Input id="contactEmail" type="email" placeholder="your.email@example.com" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What can we help you with?" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Please describe your question or concern in detail..."
                          rows={4}
                        />
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Help & Support Sidebar */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif font-bold text-xl mb-4 flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span>Quick Help</span>
                </h2>

                <div className="space-y-4">
                  {/* Support Channels */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-primary" />
                        <span>Family Support</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">families@caregene.ai</p>
                          <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">1-800-CAREGENE</p>
                          <p className="text-xs text-muted-foreground">Mon-Fri 8AM-8PM EST</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>Technical Support</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">support@caregene.ai</p>
                          <p className="text-xs text-muted-foreground">Response within 2 hours</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium text-sm">Business Hours</p>
                          <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Links */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                        <Link href="/support">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Help Documentation
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                        <Link href="/care-community">
                          <Users className="h-4 w-4 mr-2" />
                          Community Support
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                        <Link href="/privacy">
                          <Shield className="h-4 w-4 mr-2" />
                          Privacy Policy
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                        <Link href="/terms">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Terms of Service
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* FAQ */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Common Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium text-sm mb-1">How do I update my profile?</p>
                        <p className="text-xs text-muted-foreground">
                          Use the Profile Information section above to update your details.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">Is my data secure?</p>
                        <p className="text-xs text-muted-foreground">
                          Yes, we're HIPAA compliant with enterprise-grade security.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm mb-1">How do I delete my account?</p>
                        <p className="text-xs text-muted-foreground">
                          Use the "Delete Account" button in Privacy & Security settings.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
