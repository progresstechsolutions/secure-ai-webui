import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Target, X, Check, Image as ImageIcon } from "lucide-react"

interface CreateMilestoneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMilestoneCreated: (data: { title: string; description: string; image?: string }) => void
}

export function CreateMilestoneModal(props: CreateMilestoneModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    props.onOpenChange(false)
    setTitle("")
    setDescription("")
    setImage("")
    setError("")
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.")
      return
    }
    
    setIsLoading(true)
    setError("")
    
    try {
      await props.onMilestoneCreated({
        title: title.trim(),
        description: description.trim(),
        image: image.trim() || undefined,
      })
      handleClose()
    } catch (err) {
      setError("Failed to create milestone. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <DialogHeader className="relative pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Create Milestone
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Set a goal to track your progress
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="py-4 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Milestone Title *
              </label>
              <Input
                id="title"
                placeholder="Enter a clear, motivating title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                maxLength={100}
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description *
              </label>
              <Textarea
                id="description"
                placeholder="Describe what success looks like..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500">
                {description.length}/500 characters
              </p>
            </div>

            {/* Image Input */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium text-gray-700 flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                Cover Image (Optional)
              </label>
              <Input
                id="image"
                placeholder="Paste image URL here..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">
                Add a visual representation of your milestone
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 flex-shrink-0">
          <Button 
            variant="ghost" 
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800"
            size="sm"
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !description.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            size="sm"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Create Milestone
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 