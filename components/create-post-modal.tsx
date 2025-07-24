"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, ImageIcon, Video, Paperclip, User, ArrowLeft, PenTool, X, Check, Hash, Eye, EyeOff, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { logUserActivity } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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

  const router = useRouter()

  // Fetch user's name on component mount
  useEffect(() => {
    const fetchUserName = () => {
      try {
        // Try to get from props first
        if (props.user?.username) {
          setUserName(props.user.username)
          return
        }
        
        // Fallback to localStorage
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
  }, [props.user])

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
        reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0 },
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
      <DialogContent className="sm:max-w-lg w-[95vw] max-h-[85vh] flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        {/* Header Section */}
       
          <DialogTitle className="text-xl font-bold text-gray-900 text-center tracking-tight">
            Create Post
          </DialogTitle>


        {/* User Info Section */}
        
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900 text-base">
                  {anonymous ? "Anonymous User" : userName || "User"}
                </p>
                <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                  <SelectTrigger className="w-auto h-7 border-none p-0 text-sm text-gray-600 hover:bg-gray-50 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
                    <SelectValue placeholder="Select community" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 shadow-lg rounded-lg">
                    {props.availableCommunities.map((c) => (
                      <SelectItem key={c.slug} value={c.slug} className="hover:bg-blue-50">
                         {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Anonymous Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAnonymous(!anonymous)}
              className={`p-2.5 rounded-full transition-all duration-200 ${
                anonymous 
                  ? 'bg-blue-100 text-blue-600 shadow-sm hover:bg-blue-200' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
              title={anonymous ? "Posting anonymously - Click to use your name" : "Click to post anonymously"}
            >
              {anonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
       

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/30">
          {/* Text Input Area */}
          <div className="px-6 py-4">
            <Textarea
              placeholder={`What's on your mind, ${anonymous ? 'Anonymous' : userName || 'User'}?`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border-none resize-none text-base p-0 focus:ring-0 focus:outline-none min-h-[120px] placeholder:text-gray-400 bg-transparent leading-relaxed"
              maxLength={2000}
            />
          </div>

          {/* Character Counter */}
          {caption.length > 0 && (
            <div className="px-6 pb-2">
              <div className="flex justify-end">
                <span className={`text-xs font-medium ${
                  caption.length > 1800 ? 'text-red-500' : 
                  caption.length > 1500 ? 'text-amber-500' : 
                  'text-gray-400'
                }`}>
                  {caption.length}/2000
                </span>
              </div>
            </div>
          )}

          {/* Media Preview Section */}
          {(images.length > 0 || videos.length > 0) && (
            <div className="px-6 pb-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Media ({images.length + videos.length})
                </h4>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="relative w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={img.url}
                          alt={`uploaded image ${idx + 1}`}
                          className="w-full h-auto max-h-48 object-contain bg-gray-50"
                          style={{ aspectRatio: 'auto' }}
                        />
                        {/* Upload progress/success indicator */}
                        {img.uploading ? (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                            Uploading...
                          </div>
                        ) : (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                            <Check className="h-3 w-3 mr-1" />
                            Uploaded
                          </div>
                        )}
                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full shadow-md"
                          disabled={img.uploading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {/* Image info */}
                      <p className="text-xs text-gray-500 mt-1 text-center truncate">
                        Image {idx + 1} {img.uploading && '(uploading...)'}
                      </p>
                    </div>
                  ))}
                  {videos.map((vid, idx) => (
                    <div key={idx} className="relative group">
                      <div className="relative w-full max-w-sm mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <video
                          src={vid.url}
                          className="w-full h-auto max-h-48 object-contain bg-gray-50"
                          controls={false}
                          style={{ aspectRatio: 'auto' }}
                        />
                        {/* Video overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                          <Video className="h-8 w-8 text-white drop-shadow-lg" />
                        </div>
                        {/* Upload progress/success indicator */}
                        {vid.uploading ? (
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-1"></div>
                            Uploading...
                          </div>
                        ) : (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                            <Check className="h-3 w-3 mr-1" />
                            Uploaded
                          </div>
                        )}
                        {/* Remove button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVideos(videos.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full shadow-md"
                          disabled={vid.uploading}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {/* Video info */}
                      <p className="text-xs text-gray-500 mt-1 text-center truncate">
                        {vid.name} {vid.uploading && '(uploading...)'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex-shrink-0 bg-white border-t border-gray-100">
          {/* Media Buttons */}
          <div className="px-6 py-3 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Add to your post</span>
              <div className="flex items-center space-x-1">
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
                  className="p-2.5 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200"
                  title="Add photos"
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
                  className="p-2.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                  title="Add video"
                  disabled={isUploading}
                >
                  <Video className="h-5 w-5" />
                </Button>

                {/* Upload Status */}
                {isUploading && (
                  <div className="flex items-center space-x-2 ml-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-xs text-blue-600 font-medium">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Post Button Section */}
          <div className="px-6 py-4">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !caption.trim() || !selectedCommunity}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold h-11 rounded-lg shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:from-gray-300 disabled:to-gray-300 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  <span>Posting your thoughts...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Share Post</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
