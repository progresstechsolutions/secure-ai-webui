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
      logUserActivity(`Commented on post: \"${post.title}\"`)
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
      <div key={comment.id} className={`mt-4 ${level > 0 ? "ml-6 border-l pl-4" : ""}`}>
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{comment.author}</span>
          <span className="text-muted-foreground">• {comment.timestamp}</span>
        </div>
        <p className="text-gray-800 mt-2">{comment.body}</p>
        <div className="mt-2 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyText((prev) => ({ ...prev, [comment.id]: prev[comment.id] ? "" : "" }))}
          >
            Reply
          </Button>
        </div>
        {replyText[comment.id] !== undefined && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyText[comment.id]}
              onChange={(e) => setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
              rows={2}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`anonymous-reply-${comment.id}`}
                checked={anonymousComment}
                onCheckedChange={(checked) => setAnonymousComment(checked as boolean)}
              />
              <Label htmlFor={`anonymous-reply-${comment.id}`} className="text-sm">
                Post anonymously
              </Label>
            </div>
            <Button size="sm" onClick={() => handleAddReply(comment.id)}>
              Add Reply
            </Button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Post Card */}
        <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Banner Image */}
          {post.images && post.images.length > 0 && (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={post.images[0]}
                alt="Post banner"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{post.community}</Badge>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground flex items-center"><User className="h-3 w-3 mr-1" />{post.author}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground flex items-center"><Clock className="h-3 w-3 mr-1" />{post.timestamp}</span>
              </div>
              <Badge
                variant={
                  post.type === "support"
                    ? "default"
                    : post.type === "advice"
                      ? "secondary"
                      : post.type === "event"
                        ? "destructive"
                        : "outline"
                }
                className="capitalize"
              >
                {post.type}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold mt-2 mb-1">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-2">
            <p className="text-gray-700 mb-3 whitespace-pre-line">{post.body}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between border-t pt-3 mt-2">
              <div className="flex items-center space-x-4">
                <button
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReaction === "heart" ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
                  onClick={() => onReaction(post.id, "heart")}
                >
                  <Heart className="h-4 w-4" />
                  <span>{post.reactions.heart}</span>
                </button>
                <button
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReaction === "thumbsUp" ? "text-blue-500" : "text-muted-foreground hover:text-blue-500"}`}
                  onClick={() => onReaction(post.id, "thumbsUp")}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.reactions.thumbsUp}</span>
                </button>
                <button
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReaction === "thinking" ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"}`}
                  onClick={() => onReaction(post.id, "thinking")}
                >
                  <span>🤔</span>
                  <span>{post.reactions.thinking}</span>
                </button>
                <button
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${userReaction === "eyes" ? "text-green-500" : "text-muted-foreground hover:text-green-500"}`}
                  onClick={() => onReaction(post.id, "eyes")}
                >
                  <Eye className="h-4 w-4" />
                  <span>{post.reactions.eyes}</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.commentCount}
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">Comments ({post.commentCount})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* New Comment Input */}
              <div className="border-b pb-4 mb-4">
                <Label htmlFor="new-comment" className="sr-only">
                  Add a comment
                </Label>
                <Textarea
                  id="new-comment"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="mb-2"
                />
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="anonymous-comment"
                    checked={anonymousComment}
                    onCheckedChange={(checked) => setAnonymousComment(checked as boolean)}
                  />
                  <Label htmlFor="anonymous-comment" className="text-sm">
                    Post anonymously
                  </Label>
                </div>
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>

              {/* Existing Comments */}
              {post.comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
              ) : (
                renderComments(post.comments)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
