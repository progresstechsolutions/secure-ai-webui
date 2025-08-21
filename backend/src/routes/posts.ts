import express, { Request, Response } from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Community from '../models/Community.js';
import { extractUserInfo } from '../middleware/userExtract.js';
import { validatePost } from '../validators/post.js';
import { validateComment } from '../validators/comment.js';
import NotificationService from '../utils/notificationService.js';
import { 
  AuthenticatedRequest, 
  GetPostsQuery, 
  CreatePostRequest, 
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  GetCommentsQuery,
  CreateReactionRequest,
  PaginationQuery 
} from '../types/index.js';

const router = express.Router();

// ========================
// POST ROUTES
// ========================

// Get posts with pagination and filtering
router.get('/', async (req: Request<{}, {}, {}, GetPostsQuery>, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      communityId,
      authorId,
      search,
      tags,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query: any = { isHidden: false };

    if (communityId) query.community = communityId;
    if (authorId) query['author.id'] = authorId;
    if (search) query.$text = { $search: search };
    if (tags) query.tags = { $in: tags.split(',') };

    const sortOrder: 1 | -1 = order === 'desc' ? -1 : 1;
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const posts = await Post.find(query)
      .populate('community', 'name slug avatar')
      .sort(sortOptions)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post with comments
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('community', 'name slug avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'replies',
          model: 'Comment'
        }
      });

    if (!post || post.isHidden) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Increment view count
    post.stats.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new post
router.post('/', extractUserInfo, validatePost, async (req: AuthenticatedRequest<{}, {}, CreatePostRequest>, res: Response) => {
  try {
    const { title, content, communityId, tags, images, videos, attachments, isAnonymous } = req.body;

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      author: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        avatar: req.user!.avatar
      },
      community: communityId,
      tags: tags || [],
      images: images || [],
      videos: videos || [],
      attachments: attachments || [],
      stats: {
        totalReactions: 0,
        totalComments: 0,
        views: 0
      }
    });

    await post.save();

    // Update community stats
    community.stats.totalPosts += 1;
    await community.save();

    // Populate community data for response
    await post.populate('community', 'name slug avatar');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }, {}, UpdatePostRequest>, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.author.id !== req.user!.id) {
      res.status(403).json({ error: 'Only author can update post' });
      return;
    }

    const allowedUpdates: (keyof UpdatePostRequest)[] = ['title', 'content'];
    const updates: any = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(post, updates);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.author.id !== req.user!.id) {
      res.status(403).json({ error: 'Only author can delete post' });
      return;
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    // Update community stats
    const community = await Community.findById(post.community);
    if (community) {
      community.stats.totalPosts = Math.max(0, community.stats.totalPosts - 1);
      await community.save();
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ========================
// COMMENT ROUTES
// ========================

// Get comments for a post
router.get('/:postId/comments', async (req: Request<{ postId: string }, {}, {}, GetCommentsQuery>, res: Response) => {
  try {
    const { postId } = req.params;
    const { page = '1', limit = '20', sortBy = 'createdAt', order = 'asc' } = req.query;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const sortOrder: 1 | -1 = order === 'desc' ? -1 : 1;
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Get top-level comments (no parent)
    const comments = await Comment.find({ 
      post: postId, 
      parentComment: null 
    })
      .populate('replies')
      .sort(sortOptions)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Comment.countDocuments({ 
      post: postId, 
      parentComment: null 
    });

    res.json({
      comments,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get replies for a comment
router.get('/comments/:commentId/replies', async (req: Request<{ commentId: string }, {}, {}, PaginationQuery>, res: Response) => {
  try {
    const { commentId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const replies = await Comment.find({ 
      parentComment: commentId 
    })
      .sort({ createdAt: 1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Comment.countDocuments({ 
      parentComment: commentId 
    });

    res.json({
      replies,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// Create new comment or reply
router.post('/:postId/comments', (req, res, next) => {
  console.log('🔍 Raw request details:');
  console.log('- Content-Type:', req.headers['content-type']);
  console.log('- Body:', req.body);
  console.log('- Raw body type:', typeof req.body);
  console.log('- Raw body keys:', Object.keys(req.body || {}));
  next();
}, extractUserInfo, validateComment, async (req: AuthenticatedRequest<{ postId: string }, {}, CreateCommentRequest>, res: Response) => {
  try {
    console.log('📝 Comment creation request received:');
    console.log('- Body:', req.body);
    console.log('- Params:', req.params);
    console.log('- User:', req.user);
    
    const { content, parentCommentId } = req.body;
    const { postId } = req.params;

    console.log('🔍 Looking for post with ID:', postId);
    const post = await Post.findById(postId);
    if (!post) {
      console.log('❌ Post not found for ID:', postId);
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    console.log('✅ Post found:', post.title || post.content?.substring(0, 50));

    // If it's a reply, check if parent comment exists
    if (parentCommentId) {
      console.log('🔍 Looking for parent comment:', parentCommentId);
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        console.log('❌ Parent comment not found for ID:', parentCommentId);
        res.status(404).json({ error: 'Parent comment not found' });
        return;
      }
    }

    const comment = new Comment({
      content: content.trim(),
      post: postId,
      parentComment: parentCommentId || null,
      author: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        avatar: req.user!.avatar
      }
    });

    await comment.save();

    // Update post's comment list and stats
    if (!parentCommentId) {
      (post.comments as any).push(comment._id);
      post.stats.totalComments += 1;
      await post.save();

      // Create notification for post author (new comment on post)
      if (post.author.id !== req.user!.id) {
        try {
          await NotificationService.notifyPostComment(
            post.author,
            {
              id: req.user!.id,
              name: req.user!.name,
              email: req.user!.email,
              ...(req.user!.avatar && { avatar: req.user!.avatar })
            },
            postId,
            post.content || post.title || 'your post',
            content.trim()
          );
        } catch (notificationError) {
          console.error('Failed to create notification for post comment:', notificationError);
        }
      }
    } else {
      // Update parent comment's replies
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment) {
        (parentComment.replies as any).push(comment._id);
        await parentComment.save();

        // Create notification for comment author (reply to comment)
        if (parentComment.author.id !== req.user!.id) {
          try {
            await NotificationService.notifyCommentReply(
              parentComment.author,
              {
                id: req.user!.id,
                name: req.user!.name,
                email: req.user!.email,
                ...(req.user!.avatar && { avatar: req.user!.avatar })
              },
              postId,
              parentCommentId,
              content.trim()
            );
          } catch (notificationError) {
            console.error('Failed to create notification for comment reply:', notificationError);
          }
        }
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update comment
router.put('/comments/:commentId', extractUserInfo, async (req: AuthenticatedRequest<{ commentId: string }, {}, UpdateCommentRequest>, res: Response) => {
  try {
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Comment content is required' });
      return;
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user is the author
    if (comment.author.id !== req.user!.id) {
      res.status(403).json({ error: 'Only author can update comment' });
      return;
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/comments/:commentId', extractUserInfo, async (req: AuthenticatedRequest<{ commentId: string }>, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user is the author or post owner
    const post = await Post.findById(comment.post);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const isAuthor = comment.author.id === req.user!.id;
    const isPostOwner = post.author.id === req.user!.id;

    if (!isAuthor && !isPostOwner) {
      res.status(403).json({ error: 'Not authorized to delete this comment' });
      return;
    }

    // Delete all replies first
    await Comment.deleteMany({ parentComment: comment._id });

    // Remove from parent comment or post
    if (comment.parentComment) {
      const parentComment = await Comment.findById(comment.parentComment);
      if (parentComment) {
        (parentComment.replies as any) = (parentComment.replies as any).filter(
          (replyId: any) => replyId.toString() !== comment._id.toString()
        );
        await parentComment.save();
      }
    } else {
      // Remove from post and update stats
      (post.comments as any) = (post.comments as any).filter(
        (commentId: any) => commentId.toString() !== comment._id.toString()
      );
      post.stats.totalComments = Math.max(0, post.stats.totalComments - 1);
      await post.save();
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Get single comment
router.get('/comments/:commentId', async (req: Request<{ commentId: string }>, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('replies');

    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
});

// ========================
// REACTION ROUTES
// ========================

// Add reaction to post
router.post('/:postId/reactions', extractUserInfo, async (req: AuthenticatedRequest<{ postId: string }, {}, CreateReactionRequest>, res: Response) => {
  try {
    const { type } = req.body;
    const { postId } = req.params;

    if (!['like', 'love', 'laugh', 'sad', 'angry'].includes(type)) {
      res.status(400).json({ error: 'Invalid reaction type' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user already reacted
    const existingReactionIndex = post.reactions.findIndex(
      (reaction: any) => reaction.user.id === req.user!.id
    );

    if (existingReactionIndex !== -1) {
      // Update existing reaction
      (post.reactions as any)[existingReactionIndex].type = type;
    } else {
      // Add new reaction
      (post.reactions as any).push({
        type,
        user: {
          id: req.user!.id,
          name: req.user!.name
        },
        createdAt: new Date()
      });
    }

    post.stats.totalReactions = post.reactions.length;
    await post.save();

    // Create notification for post author (only for new reactions, not updates)
    if (existingReactionIndex === -1 && post.author.id !== req.user!.id) {
      try {
        await NotificationService.notifyPostLiked(
          post.author,
          {
            id: req.user!.id,
            name: req.user!.name,
            email: req.user!.email,
            ...(req.user!.avatar && { avatar: req.user!.avatar })
          },
          postId,
          post.content || post.title || 'your post'
        );
      } catch (notificationError) {
        console.error('Failed to create notification for post like:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    res.json({ message: 'Reaction added successfully', reactions: post.reactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Remove reaction from post
router.delete('/:postId/reactions', extractUserInfo, async (req: AuthenticatedRequest<{ postId: string }>, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    post.reactions = (post.reactions as any).filter(
      (reaction: any) => reaction.user.id !== req.user!.id
    );

    post.stats.totalReactions = post.reactions.length;
    await post.save();

    res.json({ message: 'Reaction removed successfully', reactions: post.reactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
});

// Add reaction to comment
router.post('/comments/:commentId/reactions', extractUserInfo, async (req: AuthenticatedRequest<{ commentId: string }, {}, CreateReactionRequest>, res: Response) => {
  try {
    const { type } = req.body;
    const { commentId } = req.params;

    if (!['like', 'love', 'laugh', 'sad', 'angry'].includes(type)) {
      res.status(400).json({ error: 'Invalid reaction type' });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user already reacted
    const existingReactionIndex = comment.reactions.findIndex(
      (reaction: any) => reaction.user.id === req.user!.id
    );

    if (existingReactionIndex !== -1) {
      // Update existing reaction
      (comment.reactions as any)[existingReactionIndex].type = type;
    } else {
      // Add new reaction
      (comment.reactions as any).push({
        type,
        user: {
          id: req.user!.id,
          name: req.user!.name
        },
        createdAt: new Date()
      });
    }

    await comment.save();

    res.json({ message: 'Reaction added successfully', reactions: comment.reactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Remove reaction from comment
router.delete('/comments/:commentId/reactions', extractUserInfo, async (req: AuthenticatedRequest<{ commentId: string }>, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    comment.reactions = (comment.reactions as any).filter(
      (reaction: any) => reaction.user.id !== req.user!.id
    );

    await comment.save();

    res.json({ message: 'Reaction removed successfully', reactions: comment.reactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
});

// Get reactions for a post
router.get('/:postId/reactions', async (req: Request<{ postId: string }, {}, {}, { type?: string }>, res: Response) => {
  try {
    const { postId } = req.params;
    const { type } = req.query;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    let reactions = post.reactions;
    if (type) {
      reactions = (reactions as any).filter((reaction: any) => reaction.type === type);
    }

    // Group reactions by type
    const reactionSummary = (reactions as any).reduce((acc: any, reaction: any) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      reactions,
      summary: reactionSummary,
      total: reactions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
});

// Get reactions for a comment
router.get('/comments/:commentId/reactions', async (req: Request<{ commentId: string }, {}, {}, { type?: string }>, res: Response) => {
  try {
    const { commentId } = req.params;
    const { type } = req.query;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    let reactions = comment.reactions;
    if (type) {
      reactions = (reactions as any).filter((reaction: any) => reaction.type === type);
    }

    // Group reactions by type
    const reactionSummary = (reactions as any).reduce((acc: any, reaction: any) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      reactions,
      summary: reactionSummary,
      total: reactions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
});

export default router;
