"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Video, User, X, Check, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { logUserActivity } from "@/lib/utils"
import { useProfilePicture } from "@/hooks/use-profile-picture"
import { UserAvatar } from "@/components/ui/user-avatar"

interface CreatePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableCommunities: Array<{ name: string; slug: string }>
  communitySlug?: string
  user: any
  onPostCreated: (post: any) => void
}

export function CreatePostModal(props: CreatePostModalProps) {
  const [selectedCommunity, setSelectedCommunity] = useState(props.communitySlug || (props.availableCommunities[0]?.slug || ""))
  const [caption, setCaption] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [images, setImages] = useState<Array<{url: string, uploading?: boolean}>>([])
  const [videos, setVideos] = useState<Array<{name: string, url: string, uploading?: boolean}>>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState<string>("")
  const { toast } = useToast()
  const { profilePicture } = useProfilePicture()

  // Fetch user's name on component mount and when modal opens
  useEffect(() => {
    const fetchUserName = () => {
      try {
        // Try to get from props first
        if (props.user?.username) {
          setUserName(props.user.username)
          return
        }
        
        // Check user_profile first (from profile setup)
        const userProfile = localStorage.getItem("user_profile")
        if (userProfile) {
          const parsed = JSON.parse(userProfile)
          if (parsed.username) {
            setUserName(parsed.username)
            return
          }
        }
        
        // Fallback to user_data (from onboarding)
        const userData = localStorage.getItem("user_data")
        if (userData) {
          const parsed = JSON.parse(userData)
          if (parsed.username) {
            setUserName(parsed.username)
            return
          }
        }
        
        // Default fallback
        setUserName("User")
      } catch (error) {
        console.error("Error fetching user name:", error)
        setUserName("User")
      }
    }
    
    fetchUserName()
  }, [props.open, props.user])

  const handleClose = () => {
    props.onOpenChange(false)
    // Reset form
    setCaption("")
    setAnonymous(false)
    setImages([])
    setVideos([])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      // Create image object with uploading state
      const newImage = {
        url: URL.createObjectURL(e.target.files[0]),
        uploading: true
      }
      setImages((prev) => [...prev, newImage])
      
      // Simulate upload completion after delay
      setTimeout(() => {
        setImages((prev) => 
          prev.map((img, idx) => 
            idx === prev.length - 1 ? { ...img, uploading: false } : img
          )
        )
        setIsUploading(false)
      }, 1000)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      // Create video object with uploading state
      const newVideo = {
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
        uploading: true
      }
      setVideos((prev) => [...prev, newVideo])
      
      // Simulate upload completion after delay
      setTimeout(() => {
        setVideos((prev) => 
          prev.map((vid, idx) => 
            idx === prev.length - 1 ? { ...vid, uploading: false } : vid
          )
        )
        setIsUploading(false)
      }, 1200)
    }
  }

  const handleSubmit = async () => {
    if (!selectedCommunity) {
      toast({ 
        title: "Community Required", 
        description: "Please select a community to post in.",
        variant: "destructive"
      })
      return
    }
    if (!caption.trim()) {
      toast({ 
        title: "Post Content Required", 
        description: "Please write something to share with the community.",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const newPost = {
        id: String(Date.now()),
        caption: caption.trim(),
        author: anonymous ? "Anonymous" : userName || "Guest User",
        timestamp: new Date().toLocaleString(),
        reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0, hope: 0, hug: 0, grateful: 0 },
        commentCount: 0,
        anonymous,
        images: images.map(img => img.url) || [],
        videos: videos.map(vid => ({ name: vid.name, url: vid.url })) || [],
        community: selectedCommunity,
        comments: [],
      }
      
      await props.onPostCreated(newPost)
      logUserActivity(`Created a post: "${caption.substring(0, 50)}..."`)
      toast({ 
        title: "Post Created!", 
        description: "Your post has been shared with the community." 
      })
      handleClose()
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] flex flex-col overflow-hidden bg-white rounded-2xl shadow-2xl border-0 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create Post
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 p-4 pb-2">
          {anonymous ? (
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          ) : (
            <UserAvatar 
              profilePicture={profilePicture}
              username={userName || "User"}
              size="md"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900">
                {anonymous ? "Anonymous" : (userName || "User")}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAnonymous(!anonymous)}
                className={`p-1 rounded transition-colors ${
                  anonymous ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                title={anonymous ? "Posting anonymously" : "Click to post anonymously"}
              >
                {anonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
              <SelectTrigger className="w-auto h-6 border-none p-0 text-sm text-gray-600 hover:bg-gray-100 rounded focus:ring-0">
                <SelectValue placeholder="Select community" />
              </SelectTrigger>
              <SelectContent>
                {props.availableCommunities.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Input */}
        <div className="flex-1 px-4">
          <Textarea
            placeholder={`What's on your mind, ${anonymous ? 'Anonymous' : (userName || 'User')}?`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border-none resize-none text-lg p-0 focus:ring-0 focus:outline-none min-h-[120px] placeholder:text-gray-500 bg-transparent"
            maxLength={2000}
          />
          
          {/* Character Counter */}
          {caption.length > 1500 && (
            <div className="text-right mt-2">
              <span className={`text-xs ${
                caption.length > 1900 ? 'text-red-500' : 'text-gray-400'
              }`}>
                {caption.length}/2000
              </span>
            </div>
          )}
        </div>

        {/* Media Preview */}
        {(images.length > 0 || videos.length > 0) && (
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="grid gap-2 grid-cols-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.url}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {img.uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {videos.map((vid, idx) => (
                  <div key={idx} className="relative group">
                    <video
                      src={vid.url}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    {vid.uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 h-6 w-6 p-0 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 p-4">
          {/* Add to Post */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-900">Add to your post</span>
            <div className="flex items-center space-x-2">
              {/* Photo Upload */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="sr-only"
                id="image-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('image-upload')?.click()}
                className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 rounded-lg"
                disabled={isUploading}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              
              {/* Video Upload */}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="sr-only"
                id="video-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('video-upload')?.click()}
                className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 rounded-lg"
                disabled={isUploading}
              >
                <Video className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Post Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !caption.trim() || !selectedCommunity}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 rounded-lg disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Posting...
              </div>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
