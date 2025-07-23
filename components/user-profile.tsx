"use client"

import { Select } from "@/components/ui/select"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Save } from "lucide-react"
import { Edit, User, MessageSquare } from "lucide-react"
import { Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface UserProfileProps {
  user: any
  onBack: () => void
}

export function UserProfile({ user, onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    region: "",
    communities: [],
  })
  const [adminCommunities, setAdminCommunities] = useState<any[]>([])
  const router = useRouter()
  const [editData, setEditData] = useState({ username: '', bio: '', region: '' })
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const { toast } = useToast()

  // Fetch user info, admin communities, and recent activity from localStorage
  useEffect(() => {
    const syncProfile = () => {
      const userData = localStorage.getItem("user_data")
      if (userData) {
        const parsed = JSON.parse(userData)
        setProfileData({
          username: parsed.username || "",
          bio: parsed.bio || "",
          region: parsed.region || "",
          communities: Array.isArray(parsed.conditions) ? parsed.conditions : [],
        })
      }
      const stored = localStorage.getItem("user_communities")
      if (stored && user?.username) {
        try {
          const all = JSON.parse(stored)
          setAdminCommunities(all.filter((c: any) => c.admin?.toLowerCase() === user.username?.toLowerCase()))
        } catch {}
      }
      // Fetch recent activity
      const activity = localStorage.getItem("user_activity")
      if (activity) {
        setRecentActivity(JSON.parse(activity).slice(0, 10))
      } else {
        setRecentActivity([])
      }
    }
    syncProfile()
    window.addEventListener("focus", syncProfile)
    return () => window.removeEventListener("focus", syncProfile)
  }, [user?.username])

  // Fetch admin communities after profileData.username is set, and re-run when it changes
  useEffect(() => {
    const syncAdminCommunities = () => {
      const stored = localStorage.getItem("user_communities")
      if (stored && profileData.username) {
        try {
          const all = JSON.parse(stored)
          setAdminCommunities(all.filter((c: any) => c.admin?.toLowerCase() === profileData.username.toLowerCase()))
        } catch {}
      } else {
        setAdminCommunities([])
      }
    }
    syncAdminCommunities()
    window.addEventListener("focus", syncAdminCommunities)
    return () => window.removeEventListener("focus", syncAdminCommunities)
  }, [profileData.username])

  const handleSave = () => {
    // In a real app, you'd save to your API
    console.log("Saving profile:", profileData)
    setIsEditing(false)
  }

  // Mock interests for demo
  const interests = user?.interests || ["Genetics", "Advocacy", "Parenting", "Research"];

  // When entering edit mode, populate editData with current profileData
  const startEdit = () => {
    setEditData({
      username: profileData.username,
      bio: profileData.bio,
      region: profileData.region,
    })
    setIsEditing(true)
  }

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }))
  }

  const saveEdit = () => {
    // Update localStorage
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
    userData.username = editData.username
    userData.bio = editData.bio
    userData.region = editData.region
    localStorage.setItem('user_data', JSON.stringify(userData))
    setProfileData((prev) => ({ ...prev, ...editData }))
    setIsEditing(false)
    toast({ title: "Profile updated!", description: "Your profile changes have been saved." })
  }

  const cancelEdit = () => {
    setShowDiscardDialog(true)
  }
  const confirmDiscard = () => {
    setIsEditing(false)
    setShowDiscardDialog(false)
  }
  const keepEditing = () => {
    setShowDiscardDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {(typeof onBack === 'function' || typeof user?.onBack === 'function') && (
              <Button variant="ghost" size="sm" onClick={onBack || user?.onBack || router.back} className="mr-2">
                <ArrowLeft className="h-5 w-5 mr-1" /> Back
              </Button>
            )}
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/settings')}>Settings</Button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <main className="md:col-span-2">
          <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
            {/* Banner/Header */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-gradient-to-r from-neutral-100 to-neutral-200 border-b border-neutral-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-orange-300 shadow-xl flex items-center justify-center ring-4 ring-pink-300 ring-opacity-60 animate-pulse-slow">
                  <User className="h-10 w-10 text-rose-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-1 tracking-tight">{profileData.username || "User"}</h2>
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs text-gray-700 border-neutral-300">{user?.role || "Member"}</Badge>
                    <span className="text-xs text-gray-700 font-semibold">Joined {user?.joined || "recently"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <Button variant="outline" size="sm" onClick={startEdit}>Edit Profile</Button>
                <Button variant="outline" size="sm" onClick={() => router.push('/dms')}><MessageSquare className="h-4 w-4 mr-1" /> Message</Button>
              </div>
            </div>
            <CardContent>
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={editData.username}
                          onChange={e => handleEditChange('username', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                          className="w-full border rounded px-3 py-2 min-h-[80px]"
                          value={editData.bio}
                          onChange={e => handleEditChange('bio', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Region</label>
                        <input
                          className="w-full border rounded px-3 py-2"
                          value={editData.region}
                          onChange={e => handleEditChange('region', e.target.value)}
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="default" size="sm" onClick={saveEdit}>Save</Button>
                        <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">About</h3>
                      <p className="text-gray-700 whitespace-pre-line">{profileData.bio || "No bio provided."}</p>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Region</h3>
                      <p className="text-gray-700 whitespace-pre-line">{profileData.region || "No region provided."}</p>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-xs">{interest}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Communities</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.communities.length === 0 ? (
                          <span className="text-xs text-gray-400">No communities joined.</span>
                        ) : (
                          profileData.communities.map((c: string) => (
                            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">My Communities (Admin)</h3>
                      <div className="flex flex-col gap-2">
                        {adminCommunities.length === 0 ? (
                          <span className="text-xs text-gray-400">You are not an admin of any communities.</span>
                        ) : (
                          adminCommunities.map((c: any) => (
                            <div key={c.slug || c.name} className="flex items-center justify-between w-full">
                              <Badge variant="outline" className="text-xs">{c.name}</Badge>
                              {c.admin === profileData.username && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 text-xs"
                                  onClick={() => router.push(`/community-admin/${c.id || c.slug}`)}
                                >
                                  Admin Settings
                                </Button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </main>
        {/* Right Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Recent Activity */}
          <Card className="shadow-lg rounded-xl border border-gray-200 bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-gray-700">
                {recentActivity.length === 0 ? (
                  <li>No recent activity.</li>
                ) : (
                  recentActivity.map((a: string, i: number) => (
                    <li key={i}>{a}</li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          {/* Admin Of */}
          {Array.isArray(user?.adminOf) && user.adminOf.length > 0 && (
            <Card className="shadow-lg rounded-xl border border-gray-200 bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Admin of</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.adminOf.map((c: string) => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
      {/* Discard changes confirmation dialog */}
      {showDiscardDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-lg font-bold mb-2">Discard changes?</div>
            <div className="text-sm text-gray-600 mb-4">You have unsaved changes. Are you sure you want to discard them?</div>
            <div className="flex gap-4">
              <Button variant="destructive" onClick={confirmDiscard}>Discard</Button>
              <Button variant="outline" onClick={keepEditing}>Keep Editing</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
