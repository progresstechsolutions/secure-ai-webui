"use client"

import { Select } from "@/components/ui/select"

import { useEffect, useState, useRef } from "react"
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
import { Edit, User, MessageSquare, Camera, LogOut } from "lucide-react"
import { Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useProfilePicture } from "@/hooks/use-profile-picture"
import { UserAvatar } from "@/components/ui/user-avatar"

interface UserProfileProps {
  user: any
  onBack: () => void
  onLogout?: () => void
}

export function UserProfile({ user, onBack, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "",
    bio: "",
    profilePicture: "",
    region: "",
    communities: [] as string[], // Condition-based communities
    joinedCommunities: [] as any[], // All communities in user_communities
    actualJoinedCommunities: [] as any[], // Only communities joined, not created
  })
  const [adminCommunities, setAdminCommunities] = useState<any[]>([])
  const router = useRouter()
  const [editData, setEditData] = useState({ username: '', bio: '', region: '' })
  const [recentActivity, setRecentActivity] = useState<string[]>([])
  const [showDiscardDialog, setShowDiscardDialog] = useState(false)
  const { toast } = useToast()
  const { profilePicture, updateProfilePicture } = useProfilePicture()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize profile data and admin communities from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    console.log("Initializing profile - raw user data:", userData)
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        console.log("Parsed user data:", parsed)
        
        // Load all joined communities (both from conditions and manually joined)
        let allJoinedCommunities: any[] = []
        try {
          const userCommunitiesData = localStorage.getItem("user_communities")
          if (userCommunitiesData) {
            allJoinedCommunities = JSON.parse(userCommunitiesData)
          }
        } catch (error) {
          console.error("Error loading joined communities:", error)
        }
        
        // Separate communities the user created vs communities they joined
        const username = parsed.username || ""
        console.log("Separating communities for username:", username)
        console.log("All joined communities:", allJoinedCommunities)
        
        // A community is "joined" (not created) if:
        // 1. It has isJoined flag set to true, OR
        // 2. It has admin as null, OR  
        // 3. Admin doesn't match current username
        const actualJoinedCommunities = allJoinedCommunities.filter((c: any) => {
          const isJoinedCommunity = c.isJoined === true || 
                                  c.admin === null || 
                                  (c.admin && c.admin.toLowerCase() !== username.toLowerCase())
          console.log(`Community ${c.name}: admin=${c.admin}, isJoined=${c.isJoined}, isJoinedCommunity=${isJoinedCommunity}`)
          return isJoinedCommunity
        })
        
        const createdCommunities = allJoinedCommunities.filter((c: any) => {
          // Community is "created" if admin matches username AND it's not flagged as joined
          const isCreatedCommunity = c.admin && 
                                   c.admin.toLowerCase() === username.toLowerCase() &&
                                   c.isJoined !== true
          console.log(`Community ${c.name}: admin=${c.admin}, isJoined=${c.isJoined}, isCreatedCommunity=${isCreatedCommunity}`)
          return isCreatedCommunity
        })
        
        const profileInfo = {
          username: parsed.username || "",
          bio: parsed.bio || "",
          profilePicture: "",
          region: parsed.region || "",
          communities: createdCommunities.map(c => c.name), // Use created communities for the 'communities' field
          joinedCommunities: allJoinedCommunities,
          actualJoinedCommunities: actualJoinedCommunities,
        }
        console.log("Setting profile data:", profileInfo)
        setProfileData(profileInfo)
        
        // Load admin communities for this user
        const stored = localStorage.getItem("user_communities")
        console.log("Raw stored communities:", stored)
        if (stored) {
          const all = JSON.parse(stored)
          console.log("All communities:", all)
          const username = parsed.username || ""
          console.log("Filtering for username:", username)
          const filtered = all.filter((c: any) => c.admin?.toLowerCase() === username.toLowerCase())
          console.log("Filtered admin communities:", filtered)
          setAdminCommunities(filtered)
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
    
    // Fetch recent activity
    const activity = localStorage.getItem("user_activity")
    if (activity) {
      try {
        setRecentActivity(JSON.parse(activity).slice(0, 10))
      } catch (error) {
        console.error("Error parsing activity data:", error)
        setRecentActivity([])
      }
    } else {
      setRecentActivity([])
    }
  }, [])

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const storageHandler = (e: StorageEvent) => {
      if (e.key === "user_communities" || e.key === "user_data") {
        if (e.key === "user_data" && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue)
            // Also load joined communities when user data changes
            let allJoinedCommunities: any[] = []
            try {
              const userCommunitiesData = localStorage.getItem("user_communities")
              if (userCommunitiesData) {
                allJoinedCommunities = JSON.parse(userCommunitiesData)
              }
            } catch (error) {
              console.error("Error loading joined communities in storage handler:", error)
            }
            
            // Separate communities the user created vs communities they joined
            const username = parsed.username || ""
            console.log("Storage handler - separating communities for username:", username)
            console.log("Storage handler - all communities:", allJoinedCommunities)
            
            const actualJoinedCommunities = allJoinedCommunities.filter((c: any) => {
              const isJoinedCommunity = c.isJoined === true || 
                                      c.admin === null || 
                                      (c.admin && c.admin.toLowerCase() !== username.toLowerCase())
              console.log(`Storage handler - Community ${c.name}: admin=${c.admin}, isJoined=${c.isJoined}, isJoinedCommunity=${isJoinedCommunity}`)
              return isJoinedCommunity
            })
            
            const createdCommunities = allJoinedCommunities.filter((c: any) => {
              const isCreatedCommunity = c.admin && 
                                       c.admin.toLowerCase() === username.toLowerCase() &&
                                       c.isJoined !== true
              console.log(`Storage handler - Community ${c.name}: admin=${c.admin}, isJoined=${c.isJoined}, isCreatedCommunity=${isCreatedCommunity}`)
              return isCreatedCommunity
            })
            
            setProfileData({
              username: parsed.username || "",
              bio: parsed.bio || "",
              profilePicture: "",
              region: parsed.region || "",
              communities: createdCommunities.map(c => c.name), // Use created communities
              joinedCommunities: allJoinedCommunities,
              actualJoinedCommunities: actualJoinedCommunities,
            })
          } catch (error) {
            console.error("Error parsing updated user data:", error)
          }
        }
        
        if (e.key === "user_communities" && e.newValue) {
          try {
            const allJoinedCommunities = JSON.parse(e.newValue)
            // Separate communities the user created vs communities they joined
            const actualJoinedCommunities = profileData.username ? 
              allJoinedCommunities.filter((c: any) => {
                const isCreatedByUser = c.admin && c.admin.toLowerCase() === profileData.username.toLowerCase()
                console.log(`Storage event - Community ${c.name}: admin=${c.admin}, isCreatedByUser=${isCreatedByUser}`)
                return !isCreatedByUser
              }) : 
              allJoinedCommunities
              
            setProfileData(prev => ({ 
              ...prev, 
              joinedCommunities: allJoinedCommunities,
              actualJoinedCommunities: actualJoinedCommunities
            }))
            
            // Update admin communities as well
            if (profileData.username) {
              setAdminCommunities(allJoinedCommunities.filter((c: any) => c.admin?.toLowerCase() === profileData.username.toLowerCase()))
            }
          } catch (error) {
            console.error("Error parsing updated communities:", error)
          }
        }
      }
    };

    window.addEventListener("storage", storageHandler);
    
    return () => {
      window.removeEventListener("storage", storageHandler)
    }
  }, [profileData.username])

  // Update admin communities when username changes
  useEffect(() => {
    if (profileData.username && profileData.joinedCommunities.length > 0) {
      const filtered = profileData.joinedCommunities.filter((c: any) => c.admin?.toLowerCase() === profileData.username.toLowerCase())
      console.log("Updating admin communities for user:", profileData.username, "Found:", filtered)
      setAdminCommunities(filtered)
    } else if (profileData.username) {
      // If no joined communities loaded yet, try to load from localStorage
      const stored = localStorage.getItem("user_communities")
      if (stored) {
        try {
          const all = JSON.parse(stored)
          const filtered = all.filter((c: any) => c.admin?.toLowerCase() === profileData.username.toLowerCase())
          console.log("Updating admin communities from localStorage for user:", profileData.username, "Found:", filtered)
          setAdminCommunities(filtered)
        } catch (error) {
          console.error("Error filtering admin communities:", error)
          setAdminCommunities([])
        }
      } else {
        setAdminCommunities([])
      }
    }
  }, [profileData.username, profileData.joinedCommunities])

  // Listen for community creation events within the same tab
  useEffect(() => {
    const handleCommunityUpdate = () => {
      console.log("Community update event received, current username:", profileData.username)
      const stored = localStorage.getItem("user_communities")
      console.log("Raw stored communities:", stored)
      if (stored) {
        try {
          const all = JSON.parse(stored)
          console.log("Parsed communities:", all)
          
          // Separate communities the user created vs communities they joined
          const actualJoinedCommunities = profileData.username ? 
            all.filter((c: any) => {
              const isJoinedCommunity = c.isJoined === true || 
                                      c.admin === null || 
                                      (c.admin && c.admin.toLowerCase() !== profileData.username.toLowerCase())
              console.log(`Community update - Community ${c.name}: admin=${c.admin}, isJoined=${c.isJoined}, isJoinedCommunity=${isJoinedCommunity}`)
              return isJoinedCommunity
            }) : 
            all
          
          const createdCommunities = profileData.username ?
            all.filter((c: any) => {
              const isCreatedCommunity = c.admin && 
                                       c.admin.toLowerCase() === profileData.username.toLowerCase() &&
                                       c.isJoined !== true
              console.log(`Community update - Community ${c.name}: admin=${c.admin}, isJoined=${c.isJoined}, isCreatedCommunity=${isCreatedCommunity}`)
              return isCreatedCommunity
            }) :
            []
          
          // Update joined communities in profile data
          setProfileData(prev => ({ 
            ...prev, 
            joinedCommunities: all,
            actualJoinedCommunities: actualJoinedCommunities
          }))
          
          // Update admin communities
          if (profileData.username) {
            const filtered = all.filter((c: any) => c.admin?.toLowerCase() === profileData.username.toLowerCase())
            console.log("Filtered admin communities:", filtered)
            setAdminCommunities(filtered)
          }
        } catch (error) {
          console.error("Error updating admin communities:", error)
        }
      }
    }

    // Listen for custom community update events
    window.addEventListener("community-updated", handleCommunityUpdate)
    
    // Also listen for beforeunload to save any pending changes
    const handleBeforeUnload = () => {
      handleCommunityUpdate()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("community-updated", handleCommunityUpdate)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [profileData.username])

  const handleSave = () => {
    const updatedProfile = {
      ...profileData,
      username: editData.username,
      bio: editData.bio,
      region: editData.region,
    }
    setProfileData(updatedProfile)
    localStorage.setItem("user_profile", JSON.stringify(updatedProfile))
    
    // Update communities if username changed
    const storedCommunities = localStorage.getItem("user_communities")
    if (storedCommunities) {
      const communities = JSON.parse(storedCommunities)
      const updatedCommunities = communities.map((community: any) => {
        if (community.name === profileData.username) {
          return { ...community, name: editData.username }
        }
        return community
      })
      localStorage.setItem("user_communities", JSON.stringify(updatedCommunities))
    }
    
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      updateProfilePicture(result)
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      })
    }
    reader.readAsDataURL(file)
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

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("user_data")
    localStorage.removeItem("user_profile")
    localStorage.removeItem("onboarding_complete")
    localStorage.removeItem("guided_onboarding_shown")
    localStorage.removeItem("user_communities")
    localStorage.removeItem("user_activity")
    localStorage.removeItem("profile_picture")
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
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
                <User className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <div className="flex items-center">
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Profile
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Enhanced Banner/Header */}
              <div className="relative w-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 md:px-8 py-6 md:py-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
                <div className="relative flex flex-col items-center justify-center md:flex-row md:justify-between">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="relative">
                      <UserAvatar 
                        profilePicture={profilePicture}
                        username={profileData.username || "User"}
                        size="xl"
                        className="border-4 border-white/30 shadow-xl"
                      />
                      {!isEditing && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-white shadow-md hover:bg-gray-50"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                        {profileData.username || "User"}
                      </h2>
                      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {user?.role || "Member"}
                        </Badge>
                        <span className="text-white/80 text-sm">
                          Joined {user?.joined || "recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={startEdit}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 md:flex-none"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push('/dms')}
                      className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1 md:flex-none"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-semibold text-gray-900 mb-2 block">Username</Label>
                          <Input
                            className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                            value={editData.username}
                            onChange={e => handleEditChange('username', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-base font-semibold text-gray-900 mb-2 block">Profile Picture</Label>
                          <div className="flex items-center gap-4">
                            <UserAvatar 
                              profilePicture={profilePicture}
                              username={editData.username || "User"}
                              size="lg"
                            />
                            <div className="flex flex-col gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-gray-200 hover:border-blue-400"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Upload Image
                              </Button>
                              <p className="text-xs text-gray-500">
                                Max size: 5MB. Supports JPG, PNG, GIF
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-base font-semibold text-gray-900 mb-2 block">Bio</Label>
                          <Textarea
                            className="min-h-[120px] border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                            value={editData.bio}
                            onChange={e => handleEditChange('bio', e.target.value)}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <Label className="text-base font-semibold text-gray-900 mb-2 block">Region</Label>
                          <Input
                            className="border-2 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                            value={editData.region}
                            onChange={e => handleEditChange('region', e.target.value)}
                            placeholder="Your location"
                          />
                        </div>
                        <div className="flex space-x-3 pt-4">
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={saveEdit}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-1 md:flex-none"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" size="sm" onClick={cancelEdit} className="flex-1 md:flex-none">
                            Cancel
                          </Button>
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
                      <div className="space-y-4">
                        {/* About Section */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">📖</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">About</h3>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                              {profileData.bio || "No bio provided yet. Click 'Edit Profile' to add information about yourself."}
                            </p>
                          </div>
                        </div>

                        {/* Region Section */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">🌍</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-700 text-sm">
                              {profileData.region || "No region specified"}
                            </p>
                          </div>
                        </div>

                        {/* Interests Section */}
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">💡</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex flex-wrap gap-2">
                              {interests.map((interest: string) => (
                                <Badge key={interest} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs px-2 py-1">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        
                          
                          
                          <div className="space-y-3">
                            {/* Joined Communities */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900">👥 Joined Communities</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-blue-100"
                                  onClick={() => {
                                    // Manual refresh for debugging
                                    const stored = localStorage.getItem("user_communities")
                                    console.log("Manual refresh - joined communities:", stored)
                                    console.log("Current username:", profileData.username)
                                    if (stored) {
                                      try {
                                        const allJoinedCommunities = JSON.parse(stored)
                                        console.log("All communities in localStorage:", allJoinedCommunities)
                                        allJoinedCommunities.forEach((c: any, index: number) => {
                                          console.log(`Community ${index}: name=${c.name}, admin=${c.admin}, slug=${c.slug}`)
                                        })
                                        
                                        const actualJoinedCommunities = profileData.username ? 
                                          allJoinedCommunities.filter((c: any) => {
                                            const isCreatedByUser = c.admin && c.admin.toLowerCase() === profileData.username.toLowerCase()
                                            console.log(`Manual refresh - Community ${c.name}: admin=${c.admin}, isCreatedByUser=${isCreatedByUser}`)
                                            return !isCreatedByUser
                                          }) : 
                                          allJoinedCommunities
                                        setProfileData(prev => ({ 
                                          ...prev, 
                                          joinedCommunities: allJoinedCommunities,
                                          actualJoinedCommunities: actualJoinedCommunities
                                        }))
                                        console.log("Refreshed joined communities:", allJoinedCommunities)
                                        console.log("Actual joined communities:", actualJoinedCommunities)
                                      } catch (error) {
                                        console.error("Manual refresh error:", error)
                                      }
                                    }
                                  }}
                                  title="Refresh joined communities list"
                                >
                                  🔄
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {profileData.actualJoinedCommunities.length === 0 ? (
                                  <span className="text-gray-500 italic text-xs">No communities joined yet.</span>
                                ) : (
                                  profileData.actualJoinedCommunities.map((community: any) => (
                                    <Badge 
                                      key={community.id || community.slug || community.name} 
                                      variant="outline" 
                                      className="text-xs px-2 py-1 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                                      onClick={() => router.push(`/community/${community.slug}`)}
                                      title="Click to view community"
                                    >
                                      {community.name}
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </div>
                            
                            {/* Created Communities (Admin) */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900">⚡ My Communities (Admin)</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs hover:bg-blue-100"
                                  onClick={() => {
                                    // Manual refresh for debugging
                                    if (profileData.username) {
                                      const stored = localStorage.getItem("user_communities")
                                      console.log("Manual refresh - stored communities:", stored)
                                      console.log("Manual refresh - current username:", profileData.username)
                                      if (stored) {
                                        try {
                                          const all = JSON.parse(stored)
                                          console.log("Manual refresh - all communities:", all)
                                          
                                          // Fix any communities with empty admin fields
                                          const fixedCommunities = all.map((c: any) => {
                                            if (!c.admin || c.admin === "") {
                                              console.log("Fixing community with empty admin:", c.name)
                                              return { ...c, admin: profileData.username }
                                            }
                                            return c
                                          })
                                          
                                          // Save the fixed communities back to localStorage
                                          if (JSON.stringify(fixedCommunities) !== JSON.stringify(all)) {
                                            console.log("Saving fixed communities to localStorage")
                                            localStorage.setItem("user_communities", JSON.stringify(fixedCommunities))
                                          }
                                          
                                          const filtered = fixedCommunities.filter((c: any) => c.admin?.toLowerCase() === profileData.username.toLowerCase())
                                          console.log("Manual refresh - filtered:", filtered)
                                          setAdminCommunities(filtered)
                                        } catch (error) {
                                          console.error("Manual refresh error:", error)
                                        }
                                      }
                                    }
                                  }}
                                  title="Refresh communities list"
                                >
                                  🔄
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {adminCommunities.length === 0 ? (
                                  <span className="text-gray-500 italic text-xs">You haven't created any communities yet.</span>
                                ) : (
                                  adminCommunities.map((c: any) => (
                                    <div key={c.slug || c.name} className="flex items-center gap-1 bg-white rounded-md p-2 border border-blue-200 hover:shadow-sm transition-all">
                                      <Badge 
                                        variant="secondary" 
                                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors text-xs px-2 py-1"
                                        onClick={() => router.push(`/community/${c.slug}`)}
                                        title="Click to view community"
                                      >
                                        {c.name}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 px-1 text-xs hover:bg-blue-100"
                                        onClick={() => router.push(`/community-admin/${c.id || c.slug}`)}
                                        title="Admin settings"
                                      >
                                        ⚙️
                                      </Button>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                     
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Right Sidebar */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Recent Activity */}
            <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📈</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">Recent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-3">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-4 md:py-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl md:text-2xl">🌟</span>
                      </div>
                      <p className="text-gray-500 text-sm">No recent activity.</p>
                      <p className="text-gray-400 text-xs mt-1">Start engaging with the community!</p>
                    </div>
                  ) : (
                    recentActivity.map((activity: string, i: number) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700">{activity}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Communities (if any) */}
            {Array.isArray(user?.adminOf) && user.adminOf.length > 0 && (
              <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900">Admin Roles</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-wrap gap-2">
                    {user.adminOf.map((c: string) => (
                      <Badge key={c} variant="secondary" className="bg-amber-100 text-amber-800 text-sm px-3 py-1">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">Quick Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communities Joined</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {profileData.actualJoinedCommunities.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Communities Created</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {adminCommunities.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Recent Activities</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {recentActivity.length}
                    </Badge>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Discard Changes Dialog */}
      {showDiscardDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4 border border-gray-200">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Discard Changes?</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">You have unsaved changes. Are you sure you want to discard them?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  variant="destructive" 
                  onClick={confirmDiscard}
                  className="px-6 order-2 sm:order-1"
                >
                  Discard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={keepEditing}
                  className="px-6 order-1 sm:order-2"
                >
                  Keep Editing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
