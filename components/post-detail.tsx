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

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `c${Date.now()}`,
        body: newComment.trim(),
        author: anonymousComment ? "Anonymous" : user?.username || "Guest User",
        timestamp: "just now",
        replies: [],
      }
      onAddComment(post.id, comment)
      logUserActivity(`Commented on post: \"${post.caption.substring(0, 50)}...\"`)
      setNewComment("")
      setAnonymousComment(false)
    }
  }

  const handleAddReply = (commentId: string) => {
    if (replyText[commentId] && replyText[commentId].trim()) {
      const reply = {
        id: `r${Date.now()}`,
        body: replyText[commentId].trim(),
        author: anonymousComment ? "Anonymous" : user?.username || "Guest User",
        timestamp: "just now",
        replies: [], // Nested replies are not supported in this mock
      }
      onAddReply(post.id, commentId, reply)
      setReplyText((prev) => ({ ...prev, [commentId]: "" }))
      setAnonymousComment(false)
    }
  }

  const renderComments = (comments: any[], level = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`${level > 0 ? "ml-8 pl-6 border-l-2 border-blue-100" : ""}`}>
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100/50 transition-colors duration-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-semibold text-gray-900">{comment.author}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{comment.timestamp}</span>
            </div>
          </div>
          <p className="text-gray-800 leading-relaxed mb-3">{comment.body}</p>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyText((prev) => ({ 
                ...prev, 
                [comment.id]: prev[comment.id] !== undefined ? undefined : "" 
              }))}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
          {replyText[comment.id] !== undefined && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-100 space-y-3">
              <Textarea
                placeholder="Write a thoughtful reply..."
                value={replyText[comment.id]}
                onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                rows={3}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`anonymous-reply-${comment.id}`}
                    checked={anonymousComment}
                    onCheckedChange={(checked) => setAnonymousComment(checked as boolean)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={`anonymous-reply-${comment.id}`} className="text-sm text-gray-600">
                    Post anonymously
                  </Label>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAddReply(comment.id)}
                  disabled={!replyText[comment.id]?.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Add Reply
                </Button>
              </div>
            </div>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
        {level === 0 && <div className="mt-6"></div>}
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Feed
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Post Details
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Post Card */}
        <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Banner Image with Overlay */}
          {post.images && post.images.length > 0 && (
            <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={post.images[0]}
                alt="Post banner"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {post.community}
                </Badge>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.anonymous ? "Anonymous" : post.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{post.caption}</p>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    userReaction === "heart" 
                      ? "bg-red-50 text-red-600 border border-red-200" 
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`}
                  onClick={() => onReaction(post.id, "heart")}
                >
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">{post.reactions.heart}</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    userReaction === "thumbsUp" 
                      ? "bg-blue-50 text-blue-600 border border-blue-200" 
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => onReaction(post.id, "thumbsUp")}
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span className="font-medium">{post.reactions.thumbsUp}</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    userReaction === "thinking" 
                      ? "bg-yellow-50 text-yellow-600 border border-yellow-200" 
                      : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                  }`}
                  onClick={() => onReaction(post.id, "thinking")}
                >
                  <span className="text-lg">🤔</span>
                  <span className="font-medium">{post.reactions.thinking || 0}</span>
                </button>
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    userReaction === "eyes" 
                      ? "bg-green-50 text-green-600 border border-green-200" 
                      : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                  }`}
                  onClick={() => onReaction(post.id, "eyes")}
                >
                  <Eye className="h-5 w-5" />
                  <span className="font-medium">{post.reactions.eyes}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-gray-600">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">{post.commentCount} comments</span>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Comments Section */}
        
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Comments ({post.commentCount})
              </CardTitle>
            </div> 
          </CardHeader>
       
            <div className="space-y-6">
              {/* Enhanced New Comment Input */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <Label htmlFor="new-comment" className="text-base font-semibold text-gray-900 mb-3 block">
                  💬 Add your thoughts
                </Label>
                <Textarea
                  id="new-comment"
                  placeholder="Share your thoughts, experiences, or support..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="mb-4 border-blue-200 focus:border-blue-400 focus:ring-blue-200 text-base"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="anonymous-comment"
                      checked={anonymousComment}
                      onCheckedChange={(checked) => setAnonymousComment(checked as boolean)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="anonymous-comment" className="text-sm font-medium text-gray-700">
                      🎭 Post anonymously
                    </Label>
                  </div>
                  <Button 
                    onClick={handleAddComment} 
                    disabled={!newComment.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-6 py-2"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>

              {/* Existing Comments */}
              {post.comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to share your thoughts on this post!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {renderComments(post.comments)}
                </div>
              )}
            </div>
         

      </div>
    </div>
  )
}
