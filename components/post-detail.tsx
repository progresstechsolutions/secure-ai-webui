"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, MessageSquare, Flag, Clock, User, Heart, ThumbsUp, Eye, Video } from "lucide-react"
import { logUserActivity } from "@/lib/utils"

interface PostDetailProps {
  post: any
  onBack: () => void
  user: any
  onAddComment: (postId: string, comment: any) => void
  onAddReply: (postId: string, commentId: string, reply: any) => void
  onReaction: (postId: string, reactionType: string) => void
  userReaction: string
}

export function PostDetail({
  post,
  onBack,
  user,
  onAddComment,
  onAddReply,
  onReaction,
  userReaction,
}: PostDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [anonymousComment, setAnonymousComment] = useState(false)
  const [anonymousReply, setAnonymousReply] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittingReply, setSubmittingReply] = useState<string | null>(null)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  const handleAddComment = async () => {
    if (newComment.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const comment = {
          id: `c${Date.now()}`,
          body: newComment.trim(),
          author: anonymousComment ? "Anonymous" : user?.username || "Guest User",
          timestamp: "just now",
          replies: [],
        }
        await onAddComment(post.id, comment)
        logUserActivity(`Commented on post: \"${post.caption.substring(0, 50)}...\"`)
        setNewComment("")
        setAnonymousComment(false)
      } catch (error) {
        console.error("Failed to add comment:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleAddReply = async (commentId: string) => {
    if (replyText[commentId] && replyText[commentId].trim() && submittingReply !== commentId) {
      setSubmittingReply(commentId)
      try {
        const reply = {
          id: `r${Date.now()}`,
          body: replyText[commentId].trim(),
          author: anonymousReply[commentId] ? "Anonymous" : user?.username || "Guest User",
          timestamp: "just now",
          replies: [],
        }
        await onAddReply(post.id, commentId, reply)
        // Close reply box by removing the entry
        setReplyText((prev) => {
          const newState = { ...prev }
          delete newState[commentId]
          return newState
        })
        setAnonymousReply((prev) => ({ ...prev, [commentId]: false }))
      } catch (error) {
        console.error("Failed to add reply:", error)
      } finally {
        setSubmittingReply(null)
      }
    }
  }

  const handleReactionSelect = (reactionType: string) => {
    onReaction(post.id, reactionType)
    setShowReactionPicker(false)
  }

  const handleLikeButtonPress = () => {
    // Quick tap - toggle like
    if (userReaction === "thumbsUp") {
      onReaction(post.id, "")
    } else {
      onReaction(post.id, "thumbsUp")
    }
  }

  const handleLikeButtonLongPress = () => {
    setShowReactionPicker(true)
  }

  const startLongPress = () => {
    const timer = setTimeout(() => {
      handleLikeButtonLongPress()
    }, 500) // 500ms for long press
    setLongPressTimer(timer)
  }

  const cancelLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  const reactions = [
    { type: "thumbsUp", emoji: "👍", label: "Like" },
    { type: "heart", emoji: "❤️", label: "Love" },
    { type: "laughing", emoji: "😂", label: "Haha" },
    { type: "surprised", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
    { type: "angry", emoji: "😡", label: "Angry" },
  ]

  const renderComments = (comments: any[], level = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`${level > 0 ? "ml-8 sm:ml-10" : ""}`}>
        <div className="flex space-x-3 mb-3">
          {/* User Avatar - Consistent styling */}
          <div className="flex-shrink-0">
            {comment.author !== "Anonymous" ? (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {comment.author?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          
          {/* Comment Content */}
          <div className="flex-1">
            <div className="bg-gray-50 rounded-2xl px-3 py-2 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.timestamp}</span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">{comment.body}</p>
            </div>
            
            {/* Comment Actions */}
            <div className="flex items-center space-x-4 mt-1 ml-3">
              <button 
                className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors py-1 px-2 -mx-2 rounded-lg hover:bg-gray-50 min-h-[32px] flex items-center touch-manipulation"
                aria-label={`Like comment by ${comment.author}`}
              >
                Like
              </button>
              <button
                onClick={() => {
                  setReplyText((prev) => ({ 
                    ...prev, 
                    [comment.id]: prev[comment.id] !== undefined ? undefined : "" 
                  }))
                  if (!anonymousReply[comment.id]) {
                    setAnonymousReply((prev) => ({ ...prev, [comment.id]: false }))
                  }
                }}
                className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors py-1 px-2 -mx-2 rounded-lg hover:bg-gray-50 min-h-[32px] flex items-center touch-manipulation"
                aria-label={`Reply to comment by ${comment.author}`}
              >
                Reply
              </button>
            </div>

            {/* Reply Input */}
            {replyText[comment.id] !== undefined && (
              <div className="mt-3 flex space-x-2" role="form" aria-label="Reply to comment">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl px-4 py-2 flex items-center hover:bg-gray-100 transition-colors">
                    <input
                      type="text"
                      placeholder="Write a reply..."
                      value={replyText[comment.id]}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                      className="border-none resize-none text-sm p-0 focus:ring-0 focus:outline-none bg-transparent placeholder:text-gray-500 flex-1 h-6 touch-manipulation"
                      aria-label="Reply content"
                      disabled={submittingReply === comment.id}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && replyText[comment.id]?.trim()) {
                          e.preventDefault()
                          handleAddReply(comment.id)
                        }
                      }}
                    />
                    {replyText[comment.id]?.trim() && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAddReply(comment.id)}
                        disabled={submittingReply === comment.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6 px-3 rounded-full ml-2 touch-manipulation"
                        aria-label="Submit reply"
                      >
                        {submittingReply === comment.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                        ) : (
                          "Reply"
                        )}
                      </Button>
                    )}
                  </div>
                  {replyText[comment.id]?.trim() && (
                    <div className="flex items-center space-x-2 mt-2 ml-4">
                      <Checkbox
                        id={`anonymous-reply-${comment.id}`}
                        checked={anonymousReply[comment.id] || false}
                        onCheckedChange={(checked) => setAnonymousReply((prev) => ({ 
                          ...prev, 
                          [comment.id]: checked as boolean 
                        }))}
                        className="w-4 h-4"
                        disabled={submittingReply === comment.id}
                      />
                      <Label htmlFor={`anonymous-reply-${comment.id}`} className="text-xs text-gray-600 cursor-pointer">
                        Post anonymously
                      </Label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
        
        {level === 0 && <div className="mb-4"></div>}
      </div>
    ))
  }

  if (!post) {
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
          {/* Post Header */}
          <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-50">
            <div className="flex items-center space-x-3">
              {/* Avatar - Consistent with community-home */}
              <div className="flex-shrink-0">
                {!post.anonymous ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {post.author?.charAt(0)?.toUpperCase() || 'U'}
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
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {post.anonymous ? "Anonymous" : post.author}
                  </h3>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium truncate">
                    {post.community}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                  <Clock className="h-3 w-3" />
                  <time>{post.timestamp}</time>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content - Better mobile spacing */}
          {post.caption && post.caption.trim() && (
            <div className="px-3 sm:px-4 py-3">
              <p className="text-gray-900 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {post.caption}
              </p>
            </div>
          )}

          {/* Post Images - Consistent with community-home */}
          {post.images && post.images.length > 0 && (
            <div className="relative">
              {post.images.length === 1 ? (
                <img
                  src={post.images[0]}
                  alt="Post content"
                  className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="grid grid-cols-2 gap-0.5">
                  {post.images.slice(0, 4).map((image: string, index: number) => (
                    <div key={index} className="relative overflow-hidden">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                        style={{ aspectRatio: '1', maxHeight: '160px' }}
                      />
                      {index === 3 && post.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">+{post.images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos */}
          {post.videos && post.videos.length > 0 && (
            <div className="relative">
              <video
                src={post.videos[0]}
                className="w-full h-auto object-cover"
                controls
                preload="metadata"
                style={{ maxHeight: '350px' }}
              />
            </div>
          )}

          {/* Engagement Stats - Consistent with community-home */}
          {(() => {
            const totalReactions = (post.reactions?.heart || 0) + (post.reactions?.thumbsUp || 0) + (post.reactions?.thinking || 0) + (post.reactions?.eyes || 0)
            const hasEngagement = totalReactions > 0 || post.commentCount > 0
            
            return hasEngagement ? (
              <div className="px-4 py-2 border-b border-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {totalReactions > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center -space-x-0.5">
                        {(post.reactions?.heart || 0) > 0 && (
                          <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px]">❤️</span>
                          </div>
                        )}
                        {(post.reactions?.thumbsUp || 0) > 0 && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px]">💪</span>
                          </div>
                        )}
                        {(post.reactions?.thinking || 0) > 0 && (
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-[8px]">🤔</span>
                          </div>
                        )}
                      </div>
                      <span className="ml-1">{totalReactions}</span>
                    </div>
                  )}
                  {post.commentCount > 0 && (
                    <span className="hover:underline cursor-pointer">
                      {post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ) : null
          })()}

          {/* Mobile-Optimized Action Buttons - Consistent with community-home */}
          <div className="px-3 sm:px-4 py-3">
            <div className="flex items-center justify-around sm:justify-between">
              {/* Reaction Button - Optimized for touch */}
              <div className="relative">
                <button
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation ${
                    userReaction 
                      ? userReaction === "heart" ? 'text-pink-600 bg-pink-50' :
                        userReaction === "thumbsUp" ? 'text-blue-600 bg-blue-50' :
                        userReaction === "thinking" ? 'text-yellow-600 bg-yellow-50' :
                        userReaction === "eyes" ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                  onClick={handleLikeButtonPress}
                  onTouchStart={startLongPress}
                  onTouchEnd={cancelLongPress}
                  onTouchCancel={cancelLongPress}
                  onMouseDown={startLongPress}
                  onMouseUp={cancelLongPress}
                  onMouseLeave={cancelLongPress}
                >
                  <span className="text-base sm:text-lg">
                    {userReaction === "heart" ? "❤️" : 
                     userReaction === "thumbsUp" ? "💪" :
                     userReaction === "thinking" ? "🤔" :
                     userReaction === "eyes" ? "👀" : "🤍"}
                  </span>
                  <span className="hidden sm:inline">
                    {userReaction ? 
                      (userReaction === "heart" ? "Love" :
                       userReaction === "thumbsUp" ? "Strength" :
                       userReaction === "thinking" ? "Thinking" :
                       userReaction === "eyes" ? "Watching" : "Love") 
                      : "Love"
                    }
                  </span>
                </button>
                
                {/* Mobile-Optimized Reaction Picker */}
                {showReactionPicker && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowReactionPicker(false)}
                    />
                    {/* Reaction Picker */}
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2">
                      <div className="flex items-center space-x-1">
                        {[
                          { emoji: "❤️", type: "heart", label: "Love" },
                          { emoji: "💪", type: "thumbsUp", label: "Strength" },
                          { emoji: "🤔", type: "thinking", label: "Thinking" },
                          { emoji: "👀", type: "eyes", label: "Watching" }
                        ].map(({ emoji, type, label }) => (
                          <button
                            key={type}
                            className="w-10 h-10 sm:w-8 sm:h-8 rounded-full hover:scale-125 transition-transform duration-200 flex items-center justify-center text-lg hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                            onClick={() => handleReactionSelect(type)}
                            title={label}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Comment Button - Mobile optimized */}
              <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 touch-manipulation">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Comment</span>
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
          <div className="px-3 sm:px-4 py-4">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                <p className="text-gray-500 text-sm">Be the first to share your thoughts</p>
              </div>
            ) : (
              <div className="space-y-4" role="list" aria-label="Comments">
                {renderComments(post.comments)}
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
