"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, ImageIcon, Video, Paperclip, User, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { logUserActivity } from "@/lib/utils"

interface CreatePostModalProps {
  onClose: () => void
  availableCommunities: Array<{ name: string; slug: string }>
  communitySlug?: string
  user: any
  onPostCreated: (post: any) => void
  onBack?: () => void
  onCancel?: () => void
}

const availableTags = [
  "diagnosis",
  "treatment",
  "therapy",
  "research",
  "parenting",
  "advocacy",
  "daily life",
  "nutrition",
  "symptoms",
  "support",
  "milestone",
  "genetic testing",
  "clinical trials",
  "coping",
  "education",
  "rare disease",
  "Phelan-McDermid Syndrome",
  "Rett Syndrome",
  "Fragile X Syndrome",
  "Angelman Syndrome",
  "Prader-Willi Syndrome",
  "Down Syndrome",
  "Cystic Fibrosis",
  "Sickle Cell Anemia",
  "Huntington's Disease",
  "Spinal Muscular Atrophy",
  "Batten Disease",
  "Tay-Sachs Disease",
  "Gaucher Disease",
  "Maple Syrup Urine Disease",
  "Phenylketonuria",
]

export function CreatePostModal(props: CreatePostModalProps) {
  const [selectedCommunity, setSelectedCommunity] = useState(props.communitySlug || (props.availableCommunities[0]?.slug || ""))
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [type, setType] = useState("discussion")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [anonymous, setAnonymous] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const router = useRouter()

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      // Simulate image upload by creating a placeholder URL
      const newImage = URL.createObjectURL(e.target.files[0])
      setImages((prev) => [...prev, newImage])
      setTimeout(() => setIsUploading(false), 1000)
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)
      // Simulate video upload by creating a placeholder URL
      const newVideo = {
        name: e.target.files[0].name,
        url: URL.createObjectURL(e.target.files[0]),
      }
      setVideos((prev) => [...prev, newVideo])
      setTimeout(() => setIsUploading(false), 1200)
    }
  }

  const handleSubmit = () => {
    if (!selectedCommunity) {
      alert("Please select a community to post in.")
      return
    }
    if (!title.trim() || !body.trim()) {
      alert("Please enter a title and body for your post.")
      return
    }
    const newPost = {
      id: String(Date.now()), // Simple unique ID
      title,
      body,
      author: anonymous ? "Anonymous" : props.user?.username || "Guest User",
      timestamp: new Date().toLocaleString(),
      type: type || "discussion",
      tags: selectedTags || [],
      reactions: { heart: 0, thumbsUp: 0, thinking: 0, eyes: 0 },
      commentCount: 0,
      anonymous,
      images: images || [],
      videos: videos || [],
      community: selectedCommunity,
      comments: [],
    }
    props.onPostCreated(newPost)
    logUserActivity(`Created a post: \"${title}\"`)
    toast({ title: "Post created!", description: "Your post has been published to the community." })
    props.onClose()
  }

  const onBack = props.onBack || props.onCancel || router.back

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      >
        <div className="w-[400px] h-[500px] max-w-full max-h-[90vh] mx-auto flex items-center justify-center">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl flex flex-col">
            {/* Animated gradient border */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-rose-400 via-orange-300 to-pink-400 animate-gradient-x blur-sm opacity-60 z-0" />
            <Card className="relative z-10 bg-white/80 backdrop-blur-md border-0 rounded-xl w-full h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  {(typeof onBack === 'function' || typeof props?.onBack === 'function' || typeof props?.onCancel === 'function') && (
                    <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                      <ArrowLeft className="h-5 w-5 mr-1" /> Back
                    </Button>
                  )}
                  <CardTitle className="text-2xl font-extrabold mb-2 gradient-text drop-shadow animate-fade-in-up">Create Post</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto px-4 py-2">
                <div className="mb-4">
                  <Label htmlFor="community">Community</Label>
                  <Select value={selectedCommunity} onValueChange={setSelectedCommunity}>
                    <SelectTrigger className="w-full focus:ring-2 focus:ring-pink-400 transition-all">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {props.availableCommunities.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {isUploading && (
                  <div className="flex items-center justify-center py-4">
                    <svg className="animate-spin h-6 w-6 text-rose-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="ml-2 text-rose-400 font-medium">Uploading...</span>
                  </div>
                )}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="A concise title for your post"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="focus:ring-2 focus:ring-rose-400 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Body</Label>
                    <Textarea
                      id="body"
                      placeholder="Write your post content here..."
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={6}
                      className="focus:ring-2 focus:ring-orange-300 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Post Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full focus:ring-2 focus:ring-pink-400 transition-all">
                        <SelectValue placeholder="Select post type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discussion">Discussion</SelectItem>
                        <SelectItem value="support">Support/Request</SelectItem>
                        <SelectItem value="advice">Advice/Tips</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                        <SelectItem value="update">Update/News</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border p-2 rounded-md">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-rose-500 text-white" : "hover:bg-gray-100"}`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Media (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Label
                        htmlFor="image-upload"
                        className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-rose-600"
                      >
                        <ImageIcon className="h-5 w-5" /> Upload Image
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </Label>
                      <Label
                        htmlFor="video-upload"
                        className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-rose-600"
                      >
                        <Video className="h-5 w-5" /> Upload Video
                        <Input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={handleVideoUpload}
                        />
                      </Label>
                    </div>
                    {/* Responsive image grid */}
                    {images.length > 0 && (
                      <div className={`grid gap-2 mt-2 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                        {images.map((img, index) => (
                          <img
                            key={index}
                            src={img || "/placeholder.svg"}
                            alt={`Uploaded ${index}`}
                            className="h-32 w-full object-cover rounded-md shadow hover:scale-105 transition-transform duration-200"
                          />
                        ))}
                      </div>
                    )}
                    {/* Video previews */}
                    {videos.length > 0 && (
                      <div className="grid gap-2 mt-2 grid-cols-1">
                        {videos.map((vid, index) => (
                          <div key={index} className="relative rounded-md overflow-hidden shadow group">
                            <video src={vid.url} className="w-full h-40 object-cover" controls={false} />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Video className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute bottom-2 left-2 bg-white/80 text-xs px-2 py-1 rounded shadow">
                              {vid.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={anonymous}
                      onCheckedChange={(checked) => setAnonymous(checked as boolean)}
                    />
                    <Label htmlFor="anonymous">Post anonymously</Label>
                  </div>
                </div>
                <div className="flex items-center justify-end border-t pt-4 mt-2 space-x-3">
                  <Button variant="outline" size="sm" onClick={props.onClose}>Cancel</Button>
                  <Button variant="default" size="sm" onClick={handleSubmit}>Post</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
