"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, MessageSquare, Flag, Clock, User, Heart, ThumbsUp, Eye, Video, Share2 } from "lucide-react"
import { logUserActivity } from "@/lib/utils"
import { useProfilePicture } from "@/hooks/use-profile-picture"
import { apiClient } from "@/lib/api-client"
import type { Post } from "@/lib/api-client"

// Helper function to get full image URL
const getImageUrl = (imagePath: string) => {
  // Validate imagePath
  if (!imagePath || typeof imagePath !== 'string') {
    console.warn('🚨 Invalid image path:', imagePath)
    return '/placeholder.jpg'
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath // Already a full URL
  }
  
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  const fullUrl = `${BACKEND_URL}${imagePath}`
  console.log('🖼️ Image URL constructed:', { imagePath, BACKEND_URL, fullUrl })
  
  // Use Next.js image proxy to avoid CORS issues
  return `/api/image-proxy?url=${encodeURIComponent(fullUrl)}`
}

interface PostDetailProps {
  post: Post | any
  onBack: () => void
  user: any
  onAddComment: (postId: string, comment: any) => void
  onAddReply: (postId: string, commentId: string, reply: any) => void
  onReaction: (postId: string, reactionType: string) => void
  userReaction: string
  userReactions?: Record<string, string>
  onReactionUpdate?: (postId: string, reactionType: string) => void
}

export function PostDetail({
  post,
  onBack,
  user,
  onAddComment,
  onAddReply,
  onReaction,
  userReaction,
  userReactions = {},
  onReactionUpdate,
}: PostDetailProps) {
  const { profilePicture } = useProfilePicture()
  
  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const now = new Date()
    const postDate = new Date(timestamp)
    const diffInMilliseconds = now.getTime() - postDate.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInDays === 1) return "1 day ago"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return months === 1 ? "1 month ago" : `${months} months ago`
    }
    const years = Math.floor(diffInDays / 365)
    return years === 1 ? "1 year ago" : `${years} years ago`
  }

  // Helper function to safely calculate reaction score
  const getReactionScore = (post: Post | any): number => {
    if (!post || !post.reactions || !Array.isArray(post.reactions)) {
      return 0
    }
    return post.reactions.length
  }

  const [newComment, setNewComment] = useState("")
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [anonymousComment, setAnonymousComment] = useState(false)
  const [anonymousReply, setAnonymousReply] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingReply, setSubmittingReply] = useState<string | null>(null)
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({})
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({})
  
  // Image viewer state - Facebook style
  const [selectedImage, setSelectedImage] = useState<{url: string, index: number} | null>(null)
  const [showAllComments, setShowAllComments] = useState<Record<string, boolean>>({})
  const [showAllTopLevelComments, setShowAllTopLevelComments] = useState(false)
  
  // Local post state to handle updates
  const [localPost, setLocalPost] = useState(post)
  
  // Update local post when prop changes
  useEffect(() => {
    setLocalPost(post)
  }, [post])
  
  // Use localPost for all post data references
  const currentPost = localPost || post

  const handleAddComment = async () => {
    if (newComment.trim() && !isSubmitting) {
      setIsSubmitting(true)
      console.log('🔄 Creating comment:', {
        content: newComment.trim(),
        postId: currentPost.id || currentPost._id,
        isAnonymous: anonymousComment
      })
      
      try {
        // Make API call to create comment
        const response = await apiClient.createComment({
          content: newComment.trim(),
          postId: currentPost.id || currentPost._id,
          parentCommentId: undefined,
          isAnonymous: anonymousComment
        })
        
        console.log('✅ Comment creation response:', response)
        
        if (response.data) {
          // Clear the input immediately for better UX
          setNewComment("")
          setAnonymousComment(false)
          
          // Refetch the complete post with updated comments from the database
          try {
            const updatedPostResponse = await apiClient.getPost(currentPost.id || currentPost._id)
            if (updatedPostResponse.data) {
              setLocalPost(updatedPostResponse.data)
              
              // Also call parent handler for consistency (if needed for parent state)
              await onAddComment(currentPost.id || currentPost._id, response.data)
            }
          } catch (fetchError) {
            console.error("Failed to refresh post after comment:", fetchError)
            // Fallback to local state update
            setLocalPost((prevPost: Post | any) => ({
              ...prevPost,
              comments: [...(prevPost.comments || []), response.data],
              stats: {
                ...prevPost.stats,
                totalComments: (prevPost.stats?.totalComments || 0) + 1
              }
            }))
          }
          
          logUserActivity(`Commented on post: \"${(currentPost.caption || currentPost.content || '').substring(0, 50)}...\"`)
        } else if (response.error) {
          console.error('❌ Comment creation failed with error:', response.error)
          alert(`Failed to create comment: ${response.error}`)
        }
      } catch (error) {
        console.error("❌ Failed to add comment:", error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        alert(`Error while creating ${anonymousComment ? 'anonymous ' : ''}comment: ${errorMessage}`)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleAddReply = async (commentId: string) => {
    if (replyText[commentId] && replyText[commentId].trim() && submittingReply !== commentId) {
      setSubmittingReply(commentId)
      // Only send parentCommentId if it's a real ObjectId (24 hex chars)
      const isRealObjectId = /^[a-f\d]{24}$/i.test(commentId)
      const replyPayload: any = {
        content: replyText[commentId].trim(),
        postId: currentPost.id || currentPost._id,
        isAnonymous: anonymousReply[commentId] || false
      }
      if (isRealObjectId) {
        replyPayload.parentCommentId = commentId
        console.log('✅ Using real ObjectId as parentCommentId:', commentId)
      } else {
        console.log('⚠️ Skipping parentCommentId - not a real ObjectId:', commentId)
      }
      console.log('🔄 [Reply Attempt] Creating reply:', {
        commentId,
        replyPayload,
        time: new Date().toISOString()
      })
      try {
        // Make API call to create reply
        const response = await apiClient.createComment(replyPayload)
        console.log('✅ [Reply Attempt] API response:', {
          commentId,
          response,
          time: new Date().toISOString()
        })
        if (response.data) {
          // Clear the reply input immediately for better UX
          setReplyText((prev) => {
            const newState = { ...prev }
            delete newState[commentId]
            return newState
          })
          setAnonymousReply((prev) => ({ ...prev, [commentId]: false }))
          // Refetch the complete post with updated comments from the database
          try {
            const updatedPostResponse = await apiClient.getPost(currentPost.id || currentPost._id)
            if (updatedPostResponse.data) {
              setLocalPost(updatedPostResponse.data)
              // Also call parent handler for consistency (if needed for parent state)
              await onAddReply(currentPost.id || currentPost._id, commentId, response.data)
            }
          } catch (fetchError) {
            console.error("[Reply Attempt] Failed to refresh post after reply:", fetchError)
            // Fallback to local state update
            setLocalPost((prevPost: Post | any) => {
              const updateComments = (comments: any[]): any[] => {
                return comments.map(comment => {
                  if (comment.id === commentId || comment._id === commentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), response.data]
                    }
                  }
                  if (comment.replies && comment.replies.length > 0) {
                    return {
                      ...comment,
                      replies: updateComments(comment.replies)
                    }
                  }
                  return comment
                })
              }
              return {
                ...prevPost,
                comments: updateComments(prevPost.comments || []),
                stats: {
                  ...prevPost.stats,
                  totalComments: (prevPost.stats?.totalComments || 0) + 1
                }
              }
            })
          }
        } else if (response.error) {
          console.error('[Reply Attempt] ❌ Reply creation failed with error:', {
            commentId,
            error: response.error,
            payload: replyPayload,
            time: new Date().toISOString()
          })
          alert(`Failed to create reply: ${response.error}`)
        }
      } catch (error) {
        console.error("[Reply Attempt] ❌ Failed to add reply:", {
          commentId,
          error,
          payload: replyPayload,
          time: new Date().toISOString()
        })
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        alert(`Error while creating ${anonymousReply[commentId] ? 'anonymous ' : ''}reply: ${errorMessage}`)
      } finally {
        setSubmittingReply(null)
      }
    }
  }

  const handleReactionSelect = async (reactionType: string) => {
    try {
      const currentReaction = userReaction
      
      // Determine if we're removing or adding/changing reaction
      const isRemoving = currentReaction === reactionType
      
      console.log('🔄 Reaction update:', { currentReaction, reactionType, isRemoving })
      
      // Update local post reaction count immediately for better UX
      setLocalPost((prevPost: Post | any) => {
        const currentTotal = prevPost.stats?.totalReactions || 0
        const newTotal = isRemoving ? Math.max(0, currentTotal - 1) : 
                       currentReaction ? currentTotal : currentTotal + 1
        
        console.log('📊 Local reaction count update:', { currentTotal, newTotal, isRemoving })
        
        return {
          ...prevPost,
          stats: {
            ...prevPost.stats,
            totalReactions: newTotal
          }
        }
      })
      
      // Make API call
      let apiResponse
      if (isRemoving) {
        console.log('🗑️ Removing reaction from API')
        apiResponse = await apiClient.removeReactionFromPost(currentPost.id || currentPost._id)
      } else {
        console.log('➕ Adding reaction to API:', reactionType)
        apiResponse = await apiClient.addReactionToPost(currentPost.id || currentPost._id, reactionType as any)
      }
      
      // Log API response for debugging
      console.log('🌐 API reaction response:', apiResponse)
      
      // Update parent component state for synchronization
      const newReactionType = isRemoving ? "" : reactionType
      await onReaction(currentPost.id || currentPost._id, newReactionType)
      
      // Force refresh post data to ensure consistency
      try {
        const updatedPostResponse = await apiClient.getPost(currentPost.id || currentPost._id)
        if (updatedPostResponse.data) {
          console.log('🔄 Refreshed post data after reaction:', updatedPostResponse.data.stats)
          setLocalPost(updatedPostResponse.data)
        }
      } catch (refreshError) {
        console.warn('⚠️ Failed to refresh post after reaction:', refreshError)
      }
      
    } catch (error) {
      console.error('❌ Reaction update failed:', error)
      // Revert local state on error
      setLocalPost(post)
    }
  }

  const reactions = [
    { type: "heart", emoji: "❤️", label: "Love" },
    { type: "thumbsUp", emoji: "💪", label: "Strength" },
    { type: "hope", emoji: "🌟", label: "Hope" },
    { type: "hug", emoji: "🤗", label: "Hug" },
    { type: "grateful", emoji: "🙏", label: "Grateful" },
  ]

  // Recursive comment renderer with unlimited nesting, reply, and like support
  const renderComments = useCallback((comments: any[], level = 0) => {
    if (!comments || comments.length === 0) return null
    return comments.map((comment, index) => {
      // Prefer real MongoDB ObjectIds, fallback to placeholder for UI rendering only
      const commentId = comment._id || comment.id || `temp-comment-${index}-${level}-${Date.now()}`
      const hasReplies = comment.replies && comment.replies.length > 0
      const showingAllReplies = showAllComments[commentId] || false
      const visibleReplies = showingAllReplies ? comment.replies : (comment.replies?.slice(0, 2) || [])
      const hiddenRepliesCount = hasReplies ? Math.max(0, (comment.replies?.length || 0) - 2) : 0
      const isLiked = commentLikes[commentId] || false
      const likeCount = typeof comment.likeCount === 'number' ? comment.likeCount : (commentLikeCounts[commentId] || 0)
      return (
        <div key={commentId} className={`${level > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""} ${level === 0 ? "mb-6" : "mb-3"}`}>
          <div className="flex space-x-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              {(!((comment.isAnonymous ?? comment.anonymous) === true)) ? (
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {(typeof comment.author === 'string' ? comment.author : comment.author?.name || 'User')?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900 text-sm">
                    {(comment.isAnonymous ?? comment.anonymous) ? 'Anonymous' : (typeof comment.author === 'string' ? comment.author : comment.author?.name || 'User')}
                  </span>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
              </div>
              {/* Comment Actions */}
              <div className="flex items-center space-x-6 mt-2 ml-1">
                <button
                  className={`text-xs font-medium transition-colors py-1.5 px-3 rounded-lg min-h-[32px] flex items-center touch-manipulation ${isLiked ? 'text-pink-600 bg-pink-50' : 'text-gray-500 hover:text-pink-600 hover:bg-pink-50'}`}
                  aria-label={`Like comment by ${typeof comment.author === 'string' ? comment.author : comment.author?.name || 'user'}`}
                  onClick={() => {
                    setCommentLikes(prev => ({ ...prev, [commentId]: !isLiked }))
                    setCommentLikeCounts(prev => ({ ...prev, [commentId]: isLiked ? Math.max(0, likeCount - 1) : likeCount + 1 }))
                  }}
                >
                  <Heart className={`h-4 w-4 mr-1.5 ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                  <span className="font-medium">{likeCount > 0 ? likeCount : 'Like'}</span>
                </button>
                <button
                  onClick={() => {
                    // Toggle reply input for this specific comment
                    setReplyText((prev) => ({ 
                      ...prev, 
                      [commentId]: prev[commentId] !== undefined ? undefined : "" 
                    }))
                    if (!anonymousReply[commentId]) {
                      setAnonymousReply((prev) => ({ ...prev, [commentId]: false }))
                    }
                  }}
                  className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors py-1.5 px-3 rounded-lg hover:bg-blue-50 min-h-[32px] flex items-center touch-manipulation"
                  aria-label={`Reply to comment by ${typeof comment.author === 'string' ? comment.author : comment.author?.name || 'user'}`}
                >
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  <span className="font-medium">Reply</span>
                </button>
              </div>
              {/* Reply Input */}
              {replyText[commentId] !== undefined && (
                <div className="mt-4 flex space-x-3" role="form" aria-label="Reply to comment">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-xs">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center hover:border-blue-300 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50">
                      <input
                        type="text"
                        placeholder={`Reply to ${(comment.isAnonymous ?? comment.anonymous) ? 'Anonymous' : (typeof comment.author === 'string' ? comment.author : comment.author?.name || 'User')}...`}
                        value={replyText[commentId]}
                        onChange={(e) => setReplyText((prev) => ({ ...prev, [commentId]: e.target.value }))}
                        className="border-none resize-none text-sm p-0 focus:ring-0 focus:outline-none bg-transparent placeholder:text-gray-500 flex-1 h-6 touch-manipulation"
                        aria-label="Reply content"
                        disabled={submittingReply === commentId}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && replyText[commentId]?.trim()) {
                            e.preventDefault()
                            handleAddReply(commentId)
                          }
                        }}
                      />
                      {replyText[commentId]?.trim() && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAddReply(commentId)}
                          disabled={submittingReply === commentId}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-4 rounded-lg ml-3 touch-manipulation font-medium"
                          aria-label="Submit reply"
                        >
                          {submittingReply === commentId ? (
                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                          ) : (
                            "Reply"
                          )}
                        </Button>
                      )}
                    </div>
                    {replyText[commentId]?.trim() && (
                      <div className="flex items-center space-x-2 mt-3 ml-1">
                        <Checkbox
                          id={`anonymous-reply-${commentId}`}
                          checked={anonymousReply[commentId] || false}
                          onCheckedChange={(checked) => setAnonymousReply((prev) => ({ ...prev, [commentId]: checked as boolean }))}
                          className="w-4 h-4"
                          disabled={submittingReply === commentId}
                        />
                        <Label htmlFor={`anonymous-reply-${commentId}`} className="text-xs text-gray-600 cursor-pointer">
                          Post anonymously
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Nested Replies - Show fewer initially */}
              {hasReplies && (
                <div className="mt-3">
                  {renderComments(visibleReplies, level + 1)}
                  {hiddenRepliesCount > 0 && !showingAllReplies && (
                    <div className="ml-6 mt-3">
                      <button
                        onClick={() => setShowAllComments(prev => ({ ...prev, [commentId]: true }))}
                        className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>View {hiddenRepliesCount} more {hiddenRepliesCount === 1 ? 'reply' : 'replies'}</span>
                      </button>
                    </div>
                  )}
                  {showingAllReplies && hiddenRepliesCount > 0 && (
                    <div className="ml-6 mt-3">
                      <button
                        onClick={() => setShowAllComments(prev => ({ ...prev, [commentId]: false }))}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <ArrowLeft className="h-4 w-4 rotate-90" />
                        <span>Hide replies</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    })
  }, [showAllComments, replyText, anonymousReply, submittingReply, commentLikes, commentLikeCounts, user, showAllTopLevelComments])

  if (!currentPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent mb-2" />
        <span className="text-sm text-gray-500">Loading post...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile Overlay Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Header Content */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-full transition-colors touch-manipulation"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 absolute left-1/2 transform -translate-x-1/2">Story</h1>
          <div className="w-9 h-9"></div> {/* Spacer for balance */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* Main Post */}
        <article className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 mb-4">
          {/* Mobile-Optimized Post Header */}
          <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-50">
            <div className="flex items-center space-x-3">
              {/* Avatar - Slightly smaller on mobile */}
              <div className="flex-shrink-0">
                {!((currentPost.isAnonymous ?? currentPost.anonymous) === true) ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {(typeof currentPost.author === 'string' ? currentPost.author : currentPost.author?.name || 'User')?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                )}
              </div>
              
              {/* User Info - Responsive text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 overflow-hidden">
                  <h3 className="font-semibold text-gray-900 text-sm flex-shrink-0">
                    {(currentPost.isAnonymous ?? currentPost.anonymous) ? "Anonymous" : (typeof currentPost.author === 'string' ? currentPost.author : currentPost.author?.name || 'User')}
                  </h3>
                  {typeof currentPost.community === 'object' && currentPost.community?.name && (
                    <>
                      <span className="text-gray-400 flex-shrink-0">•</span>
                      <Button 
                        variant="link"
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium hover:underline truncate touch-manipulation p-0 h-auto min-w-0"
                        onClick={() => {
                          // Add navigation logic here if needed
                          console.log('Navigate to community:', currentPost.community.name)
                        }}
                      >
                        {currentPost.community.name}
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                  <Clock className="h-3 w-3" />
                  <time>{formatRelativeTime(currentPost.timestamp || currentPost.createdAt)}</time>
                </div>
              </div>
              
              {/* More Options - Larger touch target */}
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-2 rounded-full touch-manipulation">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Post Content - Better mobile spacing */}
          {(currentPost.caption || currentPost.content) && (currentPost.caption || currentPost.content).trim() && (
            <div className="px-3 sm:px-4 py-3">
              <p className="text-gray-900 text-sm leading-relaxed">
                {(currentPost.caption || currentPost.content).length > 200 ? (
                  <>
                    {(currentPost.caption || currentPost.content).slice(0, 200)}
                    <span className="text-gray-500">... </span>
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      See more
                    </span>
                  </>
                ) : (
                  currentPost.caption || currentPost.content
                )}
              </p>
            </div>
          )}

          {/* Media - Facebook Style */}
          {currentPost.images && currentPost.images.length > 0 && (
            <div className="relative">
              <div className={`${currentPost.images.length === 1 ? '' : 'grid grid-cols-2 gap-0.5'}`}>
                {currentPost.images.filter(Boolean).slice(0, 4).map((image: string, index: number) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage({ url: getImageUrl(image), index })}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-auto object-cover hover:opacity-95 transition-all duration-200 group-hover:scale-105"
                      style={{ 
                        maxHeight: currentPost.images && currentPost.images.length === 1 ? '400px' : '160px',
                        aspectRatio: currentPost.images && currentPost.images.length === 1 ? 'auto' : '1',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error('🚨 Image failed to load:', {
                          originalSrc: e.currentTarget.src,
                          imagePath: image,
                          error: e.type
                        })
                        // Set a fallback image
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                      onLoad={() => {
                        console.log('✅ Image loaded successfully:', getImageUrl(image))
                      }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm5 3a2 2 0 11-4 0 2 2 0 014 0zm4.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {index === 3 && currentPost.images && currentPost.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">+{currentPost.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facebook-Style Image Modal */}
          {selectedImage && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={selectedImage.url}
                  alt={`Post image ${selectedImage.index + 1}`}
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: '80vh' }}
                />
                {currentPost.images && currentPost.images.length > 1 && (
                  <>
                    {/* Previous button */}
                    {selectedImage.index > 0 && (
                      <button
                        onClick={() => setSelectedImage({
                          url: getImageUrl(currentPost.images[selectedImage.index - 1]),
                          index: selectedImage.index - 1
                        })}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {/* Next button */}
                    {selectedImage.index < currentPost.images.length - 1 && (
                      <button
                        onClick={() => setSelectedImage({
                          url: getImageUrl(currentPost.images[selectedImage.index + 1]),
                          index: selectedImage.index + 1
                        })}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-2"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                  {selectedImage.index + 1} of {currentPost.images?.length || 1}
                </div>
              </div>
            </div>
          )}

          {/* Videos */}
          {currentPost.videos && currentPost.videos.length > 0 && (
            <div className="relative">
              <video
                src={currentPost.videos[0]}
                className="w-full h-auto object-cover"
                controls
                preload="metadata"
                style={{ maxHeight: '350px' }}
              />
            </div>
          )}

          {/* Engagement Stats */}
          {(() => {
            const totalReactions = getReactionScore(currentPost)
            const hasEngagement = totalReactions > 0 || (currentPost.stats?.totalComments || currentPost.commentCount || 0) > 0
            
            return hasEngagement ? (
              <div className="px-4 py-2 border-b border-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {totalReactions > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center -space-x-0.5">
                        {totalReactions > 0 && (
                          <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px]">❤️</span>
                          </div>
                        )}
                        {/* Show simplified reaction indicator */}
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px]">💪</span>
                        </div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-[8px]">🌟</span>
                        </div>
                      </div>
                      <span className="ml-1">{totalReactions} reaction{totalReactions !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {(currentPost.stats?.totalComments || currentPost.commentCount || 0) > 0 && (
                    <span className="hover:underline cursor-pointer">
                      {currentPost.stats?.totalComments || currentPost.commentCount} comment{(currentPost.stats?.totalComments || currentPost.commentCount) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ) : null
          })()}

          {/* Mobile-Optimized Action Buttons */}
          <div className="px-3 sm:px-4 py-3">
            <div className="flex items-center justify-around sm:justify-between">
              {/* Reaction Button - Optimized for touch */}
              <div className="relative">
                <button
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                    userReaction 
                      ? userReaction === "heart" ? 'text-pink-600 bg-pink-50' :
                        userReaction === "thumbsUp" ? 'text-blue-600 bg-blue-50' :
                        userReaction === "hope" ? 'text-yellow-600 bg-yellow-50' :
                        userReaction === "hug" ? 'text-purple-600 bg-purple-50' :
                        userReaction === "grateful" ? 'text-green-600 bg-green-50' : 'text-pink-600 bg-pink-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  onClick={() => {
                    handleReactionSelect("heart")
                  }}
                  onTouchStart={(e) => {
                    // Show reaction picker on mobile long press
                    const button = e.currentTarget;
                    const touchTimer = setTimeout(() => {
                      const picker = document.getElementById(`reaction-picker-${currentPost._id || currentPost.id}`)
                      if (picker) picker.classList.remove('hidden')
                    }, 500);
                    (button as any)._touchTimer = touchTimer;
                  }}
                  onTouchEnd={(e) => {
                    const button = e.currentTarget;
                    if ((button as any)._touchTimer) {
                      clearTimeout((button as any)._touchTimer);
                      (button as any)._touchTimer = null;
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth >= 768) {
                      const button = e.currentTarget;
                      const hoverTimer = setTimeout(() => {
                        if (button.matches(':hover')) {
                          const picker = document.getElementById(`reaction-picker-${currentPost._id || currentPost.id}`)
                          if (picker) picker.classList.remove('hidden')
                        }
                      }, 800);
                      (button as any)._hoverTimer = hoverTimer;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth >= 768) {
                      const button = e.currentTarget;
                      if ((button as any)._hoverTimer) {
                        clearTimeout((button as any)._hoverTimer);
                        (button as any)._hoverTimer = null;
                      }
                      setTimeout(() => {
                        const picker = document.getElementById(`reaction-picker-${currentPost._id || currentPost.id}`)
                        if (picker && !picker.matches(':hover')) {
                          picker.classList.add('hidden')
                        }
                      }, 100)
                    }
                  }}
                >
                  <span className="text-base sm:text-lg">
                    {userReaction === "heart" ? "❤️" : 
                     userReaction === "thumbsUp" ? "💪" :
                     userReaction === "hope" ? "🌟" :
                     userReaction === "hug" ? "🤗" :
                     userReaction === "grateful" ? "🙏" : "🤍"}
                  </span>
                  <span className="hidden sm:inline">
                    {userReaction ? 
                      (userReaction === "heart" ? "Love" :
                       userReaction === "thumbsUp" ? "Strength" :
                       userReaction === "hope" ? "Hope" :
                       userReaction === "hug" ? "Hug" :
                       userReaction === "grateful" ? "Grateful" : "Love") 
                      : "Love"
                    }
                  </span>
                </button>
                
                {/* Mobile-Optimized Reaction Picker */}
                <div 
                  id={`reaction-picker-${currentPost._id || currentPost.id}`}
                  className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg hidden z-50 p-2"
                  onMouseEnter={() => {
                    const picker = document.getElementById(`reaction-picker-${currentPost._id || currentPost.id}`)
                    if (picker) picker.classList.remove('hidden')
                  }}
                  onMouseLeave={() => {
                    const picker = document.getElementById(`reaction-picker-${currentPost._id || currentPost.id}`)
                    if (picker) picker.classList.add('hidden')
                  }}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-1">
                    {[
                      { emoji: "❤️", type: "heart", label: "Love" },
                      { emoji: "💪", type: "thumbsUp", label: "Strength" },
                      { emoji: "🌟", type: "hope", label: "Hope" },
                      { emoji: "🤗", type: "hug", label: "Hug" },
                      { emoji: "🙏", type: "grateful", label: "Grateful" }
                    ].map(({ emoji, type, label }) => (
                      <button
                        key={type}
                        className="w-10 h-10 sm:w-8 sm:h-8 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center text-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleReactionSelect(type)
                          document.getElementById(`reaction-picker-${currentPost._id || currentPost.id}`)?.classList.add('hidden')
                        }}
                        title={label}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Comment Button - Mobile optimized */}
              <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Comment</span>
              </button>
              
              {/* Share Button - Mobile optimized */}
              <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation">
                <Flag className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section - Updated styling */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Comment Input */}
          <div className="px-3 sm:px-4 py-4 border-b border-gray-100">
            <div className="flex space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center hover:bg-gray-100 transition-colors">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border-none resize-none text-sm p-0 focus:ring-0 focus:outline-none bg-transparent placeholder:text-gray-500 flex-1 h-6 touch-manipulation"
                    aria-label="Write a comment"
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && newComment.trim()) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  {newComment.trim() && (
                    <Button 
                      onClick={handleAddComment}
                      size="sm"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-4 rounded-full ml-3 touch-manipulation"
                      aria-label="Post comment"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                      ) : (
                        "Post"
                      )}
                    </Button>
                  )}
                </div>
                {newComment.trim() && (
                  <div className="flex items-center space-x-2 mt-3 ml-4">
                    <Checkbox
                      id="anonymous-comment"
                      checked={anonymousComment}
                      onCheckedChange={(checked) => setAnonymousComment(checked as boolean)}
                      className="w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="anonymous-comment" className="text-xs text-gray-600 cursor-pointer">
                      Post anonymously
                    </Label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="px-4 py-6">
            {(!currentPost.comments || currentPost.comments.length === 0) ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-500 text-sm">Be the first to share your thoughts on this post</p>
              </div>
            ) : (
              <div>
                {/* Comments Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Comments ({currentPost.comments.length})
                  </h3>
                  {currentPost.comments.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllTopLevelComments(!showAllTopLevelComments)}
                      className="text-xs"
                    >
                      {showAllTopLevelComments ? 'Show less' : 'View all'}
                    </Button>
                  )}
                </div>
                
                {/* Comments */}
                <div className="space-y-6" role="list" aria-label="Comments">
                  {renderComments(
                    showAllTopLevelComments 
                      ? currentPost.comments 
                      : currentPost.comments.slice(0, 3)
                  )}
                </div>
                
                {/* Load More Comments Button */}
                {!showAllTopLevelComments && currentPost.comments.length > 3 && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAllTopLevelComments(true)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-xl font-medium"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      View {currentPost.comments.length - 3} more comments
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacing for mobile */}
        <div className="h-safe-area-inset-bottom"></div>
      </div>
      
      {/* Mobile-optimized styles */}
      <style jsx global>{`
        /* Touch-friendly interactions */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Safe area support for devices with notches */
        .h-safe-area-inset-bottom {
          height: env(safe-area-inset-bottom);
        }
        
        /* Prevent zoom on input focus (iOS) */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Improved mobile tap targets */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Better focus states for accessibility */
        .focus-visible:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
