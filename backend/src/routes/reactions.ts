import express, { Request, Response } from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { extractUserInfo } from '../middleware/userExtract.js';
import { AuthenticatedRequest, CreateReactionRequest } from '../types/index.js';

const router = express.Router();

// Add reaction to post
router.post('/posts/:postId', extractUserInfo, async (req: AuthenticatedRequest<{ postId: string }, {}, CreateReactionRequest>, res: Response) => {
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

    res.json({ message: 'Reaction added successfully', reactions: post.reactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Remove reaction from post
router.delete('/posts/:postId', extractUserInfo, async (req: AuthenticatedRequest<{ postId: string }>, res: Response) => {
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
router.post('/comments/:commentId', extractUserInfo, async (req: AuthenticatedRequest<{ commentId: string }, {}, CreateReactionRequest>, res: Response) => {
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
router.delete('/comments/:commentId', extractUserInfo, async (req: AuthenticatedRequest<{ commentId: string }>, res: Response) => {
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
router.get('/posts/:postId', async (req: Request<{ postId: string }, {}, {}, { type?: string }>, res: Response) => {
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
router.get('/comments/:commentId', async (req: Request<{ commentId: string }, {}, {}, { type?: string }>, res: Response) => {
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
