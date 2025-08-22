"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { UserAvatar } from "../../components/ui/user-avatar"
import {
  User,
  Heart,
  MapPin,
  Calendar,
  Mail,
  Edit3,
  LogOut,
  ArrowLeft,
  Settings,
  Activity,
  Users,
  MessageSquare,
  Camera,
  Save,
  X
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [userCommunities, setUserCommunities] = useState<any[]>([])
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [userData, setUserData] = useState<any>({})
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("")
  const [bannerImagePreview, setBannerImagePreview] = useState<string>("")
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Handle profile image change
  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setIsLoadingImages(true)
      setProfileImageFile(file)
      try {
        const base64String = await fileToBase64(file)
        setProfileImagePreview(base64String)
      } catch (error) {
        console.error('Error converting image to base64:', error)
        alert('Error processing image. Please try again.')
      } finally {
        setIsLoadingImages(false)
      }
    }
  }

  // Handle banner image change
  const handleBannerImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Validate file size (max 10MB for banner)
      if (file.size > 10 * 1024 * 1024) {
        alert('Banner image size should be less than 10MB')
        return
      }

      setIsLoadingImages(true)
      setBannerImageFile(file)
      try {
        const base64String = await fileToBase64(file)
        setBannerImagePreview(base64String)
      } catch (error) {
        console.error('Error converting image to base64:', error)
        alert('Error processing image. Please try again.')
      } finally {
        setIsLoadingImages(false)
      }
    }
  }
  
  // Load user data from localStorage (from signup/signin/onboarding)
  useEffect(() => {
    // Get data from different localStorage keys
    const signupUser = localStorage.getItem('signup_user')
    const onboardingData = localStorage.getItem('onboardingData')
    const userCredentials = localStorage.getItem('user_credentials')
    const userProfile = localStorage.getItem('user_profile')

    let compiledData: any = {}

    // Load signup data (email, username, password, etc.)
    if (signupUser) {
      try {
        const signupUserData = JSON.parse(signupUser)
        compiledData = {
          ...compiledData,
          id: signupUserData.id,
          email: signupUserData.email,
          username: signupUserData.username,
          registrationDate: signupUserData.registrationDate,
          hasCompletedOnboarding: signupUserData.hasCompletedOnboarding
        }
      } catch (e) {
        console.error('Error parsing signup user data:', e)
      }
    }

    // Load user credentials
    if (userCredentials) {
      try {
        const credentialsData = JSON.parse(userCredentials)
        compiledData = {
          ...compiledData,
          ...credentialsData
        }
      } catch (e) {
        console.error('Error parsing user credentials:', e)
      }
    }

    // Load onboarding data (health conditions, location, care role, etc.)
    if (onboardingData) {
      try {
        const onboardingInfo = JSON.parse(onboardingData)
        compiledData = {
          ...compiledData,
          healthConditions: onboardingInfo.healthConditions,
          location: onboardingInfo.region && onboardingInfo.state 
            ? `${onboardingInfo.state}, ${onboardingInfo.region}`
            : onboardingInfo.region || onboardingInfo.location,
          careRole: onboardingInfo.careRole,
          privacy: onboardingInfo.privacy,
          profilePicture: onboardingInfo.profilePicture,
          bannerImage: onboardingInfo.bannerImage,
          // Map onboarding data to profile structure
          bio: `${onboardingInfo.careRole ? `Care Role: ${onboardingInfo.careRole}` : ''}`,
          medicalInfo: {
            conditions: onboardingInfo.healthConditions || []
          }
        }
      } catch (e) {
        console.error('Error parsing onboarding data:', e)
      }
    }

    // Load user profile data
    if (userProfile) {
      try {
        const profileData = JSON.parse(userProfile)
        compiledData = {
          ...compiledData,
          ...profileData
        }
      } catch (e) {
        console.error('Error parsing user profile data:', e)
      }
    }

    setUserData(compiledData)
    setEditData(compiledData)

    // Load user communities
    const savedCommunities = localStorage.getItem('user_communities')
    if (savedCommunities) {
      setUserCommunities(JSON.parse(savedCommunities))
    }

    // Load user posts
    const savedPosts = localStorage.getItem('user_posts')
    if (savedPosts) {
      setUserPosts(JSON.parse(savedPosts))
    }
  }, [])
  
  // User data compiled from localStorage
  const user = {
    id: userData.id || "current-user",
    email: userData.email || "user@example.com",
    username: userData.username || "current_user",
    name: userData.username || "User", // Use username as display name
    image: userData.profilePicture || "/placeholder-user.jpg",
    bannerImage: userData.bannerImage || "",
    healthConditions: userData.healthConditions || userData.medicalInfo?.conditions || [],
    location: userData.location || "Not specified",
    careRole: userData.careRole || "Not specified",
    registrationDate: userData.registrationDate || new Date().toISOString(),
    hasCompletedOnboarding: userData.hasCompletedOnboarding || false
  }

  const [editData, setEditData] = useState({
    email: userData.email || "",
    username: userData.username || "",
    bio: userData.bio || "",
    location: userData.location || "",
    careRole: userData.careRole || "",
    healthConditions: userData.healthConditions || userData.medicalInfo?.conditions || []
  })

  const handleSave = async () => {
    try {
      // Save the changes to localStorage
      const updatedUserData = {
        ...userData,
        email: editData.email,
        username: editData.username,
        bio: editData.bio,
        location: editData.location,
        careRole: editData.careRole,
        healthConditions: editData.healthConditions
      }
      
      // Update profile picture if changed
      if (profileImagePreview) {
        updatedUserData.profilePicture = profileImagePreview
      }
      
      // Update banner image if changed
      if (bannerImagePreview) {
        updatedUserData.bannerImage = bannerImagePreview
      }
      
      setUserData(updatedUserData)
      
      // Save to multiple localStorage keys to maintain consistency
      localStorage.setItem('userData', JSON.stringify(updatedUserData))
      localStorage.setItem('user_profile', JSON.stringify(updatedUserData))
      
      // Update onboarding data if it exists
      const onboardingData = localStorage.getItem('onboardingData')
      if (onboardingData) {
        try {
          const parsedOnboarding = JSON.parse(onboardingData)
          const updatedOnboarding = {
            ...parsedOnboarding,
            profilePicture: updatedUserData.profilePicture,
            bannerImage: updatedUserData.bannerImage
          }
          localStorage.setItem('onboardingData', JSON.stringify(updatedOnboarding))
        } catch (e) {
          console.error('Error updating onboarding data:', e)
        }
      }
      
      // Reset file states
      setProfileImageFile(null)
      setBannerImageFile(null)
      setProfileImagePreview("")
      setBannerImagePreview("")
      setIsEditing(false)
      
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error saving profile. Please try again.')
    }
  }

  const handleCancel = () => {
    setEditData({
      email: userData.email || "",
      username: userData.username || "",
      bio: userData.bio || "",
      location: userData.location || "",
      careRole: userData.careRole || "",
      healthConditions: userData.healthConditions || userData.medicalInfo?.conditions || []
    })
    
    // Reset image states
    setProfileImageFile(null)
    setBannerImageFile(null)
    setProfileImagePreview("")
    setBannerImagePreview("")
    setIsEditing(false)
  }

  const handleSignOut = async () => {
    localStorage.clear()
    await signOut({ callbackUrl: "/auth/signin" })
  }

  const displayName = userData.username || userData.email || 'User'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">Profile</h1>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isLoadingImages}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-3 py-2 rounded-xl shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingImages ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
                <span className="hidden sm:inline">Processing...</span>
              </>
            ) : isEditing ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Save</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </Button>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
          <CardContent className="p-0">
            {/* Cover Photo Area */}
            <div 
              className="h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative"
              style={{
                backgroundImage: bannerImagePreview || userData.bannerImage 
                  ? `url(${bannerImagePreview || userData.bannerImage})` 
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/10"></div>
              {/* Cover edit button */}
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={handleBannerImageChange}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
                    variant="outline"
                    onClick={() => document.getElementById('banner-upload')?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Banner
                  </Button>
                </>
              )}
            </div>
            
            {/* Profile Content */}
            <div className="px-6 pb-6 -mt-20 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                {/* Profile Picture */}
                <div className="relative z-10">
                  <UserAvatar
                    username={displayName}
                    profilePicture={profileImagePreview || userData.profilePicture}
                    size="xl"
                    className="w-32 h-32 border-4 border-white shadow-xl bg-white rounded-full"
                  />
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
                        onClick={() => document.getElementById('profile-upload')?.click()}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Name and Basic Info */}
                <div className="flex-1 min-w-0 pt-16 sm:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 truncate">{displayName}</h1>
                      {userData.bio ? (
                        <p className="text-gray-600 mt-1 text-lg">{userData.bio}</p>
                      ) : (
                        <p className="text-gray-400 italic mt-1">No bio added yet</p>
                      )}
                      
                      {/* Quick stats */}
                      <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{userCommunities.length} Communities</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{userPosts.length} Posts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Personal Information */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Details Grid */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                      <Input
                        id="username"
                        value={editData.username || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                      <Input
                        id="location"
                        value={editData.location || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Enter location"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="careRole" className="text-sm font-medium text-gray-700">Care Role</Label>
                      <Input
                        id="careRole"
                        value={editData.careRole || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, careRole: e.target.value }))}
                        placeholder="Enter care role"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                      <Input
                        id="bio"
                        value={editData.bio || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email from signup */}
                    {userData.email && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Mail className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Email Address</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{userData.email}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Username from signup */}
                    {userData.username && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Username</p>
                            <p className="text-sm font-medium text-gray-900 truncate">@{userData.username}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location from onboarding */}
                    {userData.location && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Location</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{userData.location}</p>

                          </div>
                        </div>
                      </div>
                    )}

                    {/* Care Role from onboarding */}
                    {userData.careRole && (
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Care Role</p>
                            <p className="text-sm font-medium text-gray-900 capitalize">{userData.careRole}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Registration Date */}
                    {userData.registrationDate && (
                      <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl border border-pink-200 md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide">Member Since</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(userData.registrationDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="text-xs text-pink-600">Registration date</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Information Grid */}
            {(user.healthConditions?.length > 0 || userData.healthConditions?.length > 0) && (
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Health Information
                    
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Health Conditions from onboarding */}
                  {(userData.healthConditions?.length > 0 || user.healthConditions?.length > 0) && (
                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200">
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Health Conditions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {(userData.healthConditions || user.healthConditions || []).map((condition: string, index: number) => (
                          <Badge key={index} className="bg-red-100 text-red-800 border-red-300 justify-center py-2">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {userData.emergencyContact && (userData.emergencyContact.name || userData.emergencyContact.phone) && (
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    🚨 Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData.emergencyContact.name && (
                      <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">Contact Name</p>
                            <p className="text-sm font-medium text-gray-900">{userData.emergencyContact.name}</p>
                            {userData.emergencyContact.relationship && (
                              <p className="text-xs text-gray-600">({userData.emergencyContact.relationship})</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {userData.emergencyContact.phone && (
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border border-orange-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl">📞</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Phone Number</p>
                            <p className="text-sm font-medium text-gray-900">{userData.emergencyContact.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support Interests */}
            {userData.supportNeeds && userData.supportNeeds.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Support Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {userData.supportNeeds.map((need: string, index: number) => (
                        <Badge 
                          key={index} 
                          className="bg-green-100 text-green-800 border-green-300 justify-center py-2"
                        >
                          {need}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Activity Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Communities</p>
                          <p className="text-sm text-gray-600">Joined</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{userCommunities.length}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Stories</p>
                          <p className="text-sm text-gray-600">Shared</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{userPosts.length}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Messages</p>
                          <p className="text-sm text-gray-600">Conversations</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">12</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  onClick={() => router.push('/settings')}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Account Settings</p>
                    <p className="text-xs text-gray-500">Manage your preferences</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-purple-50 hover:border-purple-300 transition-all"
                  onClick={() => router.push('/communities')}
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Browse Communities</p>
                    <p className="text-xs text-gray-500">Find support groups</p>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 hover:bg-green-50 hover:border-green-300 transition-all"
                  onClick={() => router.push('/messages')}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Messages</p>
                    <p className="text-xs text-gray-500">Connect with others</p>
                  </div>
                </Button>
                
                <Separator className="my-4" />
                
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all"
                  onClick={handleSignOut}
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <LogOut className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Sign Out</p>
                    <p className="text-xs text-gray-500">Logout of your account</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
            {userData.emergencyContact && (userData.emergencyContact.name || userData.emergencyContact.phone) && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    � Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userData.emergencyContact.name && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Name</p>
                        <p className="text-sm text-gray-900">{userData.emergencyContact.name}</p>
                        {userData.emergencyContact.relationship && (
                          <p className="text-xs text-gray-500">({userData.emergencyContact.relationship})</p>
                        )}
                      </div>
                    </div>
                  )}
                  {userData.emergencyContact.phone && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 text-lg">📞</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Phone</p>
                        <p className="text-sm text-gray-900">{userData.emergencyContact.phone}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Medical Information */}
            {userData.medicalInfo && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🏥 Medical Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.medicalInfo.conditions && userData.medicalInfo.conditions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Health Conditions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.medicalInfo.conditions.map((condition: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200 py-1 px-3">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userData.medicalInfo.medications && userData.medicalInfo.medications.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        💊 Medications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.medicalInfo.medications.map((medication: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userData.medicalInfo.allergies && userData.medicalInfo.allergies.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        ⚠️ Allergies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.medicalInfo.allergies.map((allergy: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 py-1 px-3">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {userData.medicalInfo.emergencyInfo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        🆘 Emergency Information
                      </h4>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">{userData.medicalInfo.emergencyInfo}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Support Needs */}
            {userData.supportNeeds && userData.supportNeeds.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Support Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userData.supportNeeds.map((need: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {need}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Communities */}
        {userCommunities.length > 0 && (
          <Card className="mt-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Your Communities ({userCommunities.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userCommunities.slice(0, 6).map((community: any, index: number) => (
                  <div
                    key={index}
                    className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50"
                    onClick={() => router.push(`/community/${community.slug}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold"
                        style={{ background: community.color || '#3b82f6' }}
                      >
                        {community.name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm group-hover:text-blue-600 transition-colors truncate">
                          {community.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {community.memberCount || 1} member{(community.memberCount || 1) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {community.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {community.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Posts */}
        {userPosts.length > 0 && (
          <Card className="mt-6 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Recent Stories ({userPosts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userPosts.slice(0, 3).map((post: any, index: number) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50">
                    <p className="text-sm mb-3 line-clamp-3">{post.caption}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          {post.community}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.reactions ? (Object.values(post.reactions) as number[]).reduce((sum, count) => sum + count, 0) : 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.commentCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 