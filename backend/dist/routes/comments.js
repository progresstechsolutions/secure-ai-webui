import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { extractUserInfo } from '../middleware/userExtract.js';
import { validateComment } from '../validators/comment.js';
const router = express.Router();
// Get comments for a post
router.get('/post/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = '1', limit = '20', sortBy = 'createdAt', order = 'asc' } = req.query;
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = { [sortBy]: sortOrder };
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});
// Get replies for a comment
router.get('/:commentId/replies', async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch replies' });
    }
});
// Create new comment
router.post('/', extractUserInfo, validateComment, async (req, res) => {
    try {
        const { content, postId, parentCommentId } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        // If it's a reply, check if parent comment exists
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                res.status(404).json({ error: 'Parent comment not found' });
                return;
            }
        }
        const comment = new Comment({
            content: content.trim(),
            post: postId,
            parentComment: parentCommentId || null,
            author: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar
            }
        });
        await comment.save();
        // Update post's comment list and stats
        if (!parentCommentId) {
            post.comments.push(comment._id);
            post.stats.totalComments += 1;
            await post.save();
        }
        else {
            // Update parent comment's replies
            const parentComment = await Comment.findById(parentCommentId);
            if (parentComment) {
                parentComment.replies.push(comment._id);
                await parentComment.save();
            }
        }
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
});
// Update comment
router.put('/:id', extractUserInfo, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.trim().length === 0) {
            res.status(400).json({ error: 'Comment content is required' });
            return;
        }
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        // Check if user is the author
        if (comment.author.id !== req.user.id) {
            res.status(403).json({ error: 'Only author can update comment' });
            return;
        }
        comment.content = content.trim();
        comment.isEdited = true;
        comment.editedAt = new Date();
        await comment.save();
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
});
// Delete comment
router.delete('/:id', extractUserInfo, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
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
        const isAuthor = comment.author.id === req.user.id;
        const isPostOwner = post.author.id === req.user.id;
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
                parentComment.replies = parentComment.replies.filter((replyId) => replyId.toString() !== comment._id.toString());
                await parentComment.save();
            }
        }
        else {
            // Remove from post and update stats
            post.comments = post.comments.filter((commentId) => commentId.toString() !== comment._id.toString());
            post.stats.totalComments = Math.max(0, post.stats.totalComments - 1);
            await post.save();
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});
// Get single comment
router.get('/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('replies');
        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch comment' });
    }
});
export default router;
//# sourceMappingURL=comments.js.map