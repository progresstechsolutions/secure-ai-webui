import express, { Request, Response } from 'express';
import Post from '../models/Post.js';
import Community from '../models/Community.js';
import { extractUserInfo } from '../middleware/userExtract.js';
import { validatePost } from '../validators/post.js';
import { 
  AuthenticatedRequest, 
  GetPostsQuery, 
  CreatePostRequest, 
  UpdatePostRequest,
  PaginationQuery 
} from '../types/index.js';

const router = express.Router();

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

// Get single post
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
    const { title, content, communityId, tags, images, attachments } = req.body;

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    // Check if user is a member
    const isMember = community.members.some((member: any) => member.id === req.user!.id);
    if (!isMember) {
      res.status(403).json({ error: 'Must be a community member to post' });
      return;
    }

    const post = new Post({
      title,
      content,
      community: communityId,
      tags,
      images,
      attachments,
      author: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        avatar: req.user!.avatar
      }
    });

    await post.save();

    // Update community stats
    community.stats.totalPosts += 1;
    await community.save();

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

    const allowedUpdates: (keyof UpdatePostRequest)[] = ['title', 'content', 'tags'];
    const updates: any = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(post, updates);
    await post.save();

    await post.populate('community', 'name slug avatar');
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

    // Check if user is the author or community admin
    const community = await Community.findById(post.community);
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const isAuthor = post.author.id === req.user!.id;
    const isAdmin = community.admins.some((admin: any) => admin.id === req.user!.id);

    if (!isAuthor && !isAdmin) {
      res.status(403).json({ error: 'Not authorized to delete this post' });
      return;
    }

    await Post.findByIdAndDelete(req.params.id);

    // Update community stats
    community.stats.totalPosts = Math.max(0, community.stats.totalPosts - 1);
    await community.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Pin/Unpin post (admin only)
router.patch('/:id/pin', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const community = await Community.findById(post.community);
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const isAdmin = community.admins.some((admin: any) => admin.id === req.user!.id);

    if (!isAdmin) {
      res.status(403).json({ error: 'Only admins can pin posts' });
      return;
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({ message: `Post ${post.isPinned ? 'pinned' : 'unpinned'} successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post pin status' });
  }
});

// Hide/Unhide post (admin only)
router.patch('/:id/hide', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const community = await Community.findById(post.community);
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const isAdmin = community.admins.some((admin: any) => admin.id === req.user!.id);

    if (!isAdmin) {
      res.status(403).json({ error: 'Only admins can hide posts' });
      return;
    }

    post.isHidden = !post.isHidden;
    await post.save();

    res.json({ message: `Post ${post.isHidden ? 'hidden' : 'unhidden'} successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post visibility' });
  }
});

// Get posts by community
router.get('/community/:slug', async (req: Request<{ slug: string }, {}, {}, PaginationQuery & { sortBy?: string; order?: string }>, res: Response) => {
  try {
    const { page = '1', limit = '10', sortBy = 'createdAt', order = 'desc' } = req.query;

    const community = await Community.findOne({ slug: req.params.slug });
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const sortOrder: 1 | -1 = order === 'desc' ? -1 : 1;
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Pinned posts first, then regular posts
    const pinnedPosts = await Post.find({ 
      community: community._id, 
      isPinned: true, 
      isHidden: false 
    }).sort(sortOptions);

    const regularPosts = await Post.find({ 
      community: community._id, 
      isPinned: false, 
      isHidden: false 
    })
      .sort(sortOptions)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Post.countDocuments({ 
      community: community._id, 
      isHidden: false 
    });

    res.json({
      posts: pageNum === 1 ? [...pinnedPosts, ...regularPosts] : regularPosts,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total,
      pinnedCount: pinnedPosts.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
});

export default router;
