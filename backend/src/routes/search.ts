import express, { Response } from 'express';
import { extractUserInfo } from '../middleware/userExtract.js';
import Community from '../models/Community.js';
import Post from '../models/Post.js';
import { SearchRequest } from '../types/index.js';

const router = express.Router();

// Combined search endpoint
router.get('/', extractUserInfo, async (req: SearchRequest, res: Response) => {
  try {
    const { 
      query: searchQuery, 
      condition, 
      region, 
      state, 
      page = '1', 
      limit = '20' 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let communities: any[] = [];
    let posts: any[] = [];

    // Build search filters
    const searchFilters: any = {};
    if (searchQuery) {
      searchFilters.$text = { $search: searchQuery };
    }

    const conditionFilters: any = {};
    if (condition) conditionFilters.condition = condition;
    if (region) conditionFilters.region = region;
    if (state) conditionFilters.state = state;

    // Search communities
    if (searchQuery || condition || region || state) {
      const communityQuery = { ...searchFilters, ...conditionFilters };
      communities = await Community.find(communityQuery)
        .select('name description memberCount slug condition region state')
        .limit(limitNum)
        .lean();
    }

    // Search posts
    if (searchQuery || condition || region || state) {
      const postQuery = { ...searchFilters, ...conditionFilters };
      posts = await Post.find(postQuery)
        .populate('author', 'name email')
        .populate('community', 'name slug')
        .select('content images author community createdAt')
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .lean();
    }

    res.json({
      communities,
      posts,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        totalCommunities: communities.length,
        totalPosts: posts.length
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// Search communities only
router.get('/communities', extractUserInfo, async (req: SearchRequest, res: Response) => {
  try {
    const { 
      query: searchQuery, 
      condition, 
      region, 
      state, 
      page = '1', 
      limit = '20' 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build search filters
    const searchFilters: any = {};
    if (searchQuery) {
      searchFilters.$text = { $search: searchQuery };
    }

    const conditionFilters: any = {};
    if (condition) conditionFilters.condition = condition;
    if (region) conditionFilters.region = region;
    if (state) conditionFilters.state = state;

    const communityQuery = { ...searchFilters, ...conditionFilters };
    
    const communities = await Community.find(communityQuery)
      .select('name description memberCount slug condition region state')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Community.countDocuments(communityQuery);

    res.json({
      communities,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Community search error:', error);
    res.status(500).json({ error: 'Failed to search communities' });
  }
});

// Search posts only
router.get('/posts', extractUserInfo, async (req: SearchRequest, res: Response) => {
  try {
    const { 
      query: searchQuery, 
      condition, 
      region, 
      state, 
      page = '1', 
      limit = '20' 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build search filters
    const searchFilters: any = {};
    if (searchQuery) {
      searchFilters.$text = { $search: searchQuery };
    }

    const conditionFilters: any = {};
    if (condition) conditionFilters.condition = condition;
    if (region) conditionFilters.region = region;
    if (state) conditionFilters.state = state;

    const postQuery = { ...searchFilters, ...conditionFilters };
    
    const posts = await Post.find(postQuery)
      .populate('author', 'name email')
      .populate('community', 'name slug')
      .select('content images author community createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Post.countDocuments(postQuery);

    res.json({
      posts,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Post search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// Search users endpoint
router.get('/users', extractUserInfo, async (req: SearchRequest, res: Response) => {
  try {
    const { 
      query: searchQuery,
      page = '1', 
      limit = '20' 
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // For now, return mock user data since we don't have a User model
    // In a real app, you would search your User collection
    const mockUsers = [
      { id: 'user-101', name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-102', name: 'Dr. Jennifer Park', email: 'j.park@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-103', name: 'Michael Chen', email: 'michael.chen@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-104', name: 'Lisa Rodriguez', email: 'lisa.r@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-105', name: 'James Wilson', email: 'james.w@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-106', name: 'Emma Thompson', email: 'emma.t@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-107', name: 'David Kumar', email: 'david.kumar@example.com', avatar: '/placeholder-user.jpg' },
      { id: 'user-108', name: 'Maria Garcia', email: 'maria.garcia@example.com', avatar: '/placeholder-user.jpg' },
    ];

    let filteredUsers = mockUsers;
    
    if (searchQuery) {
      filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const users = filteredUsers.slice(startIndex, endIndex);

    res.json({
      users,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('User search error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;
