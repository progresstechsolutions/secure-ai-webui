import express from 'express';
import { extractUserInfo } from '../middleware/userExtract.js';
import Community from '../models/Community.js';
import Post from '../models/Post.js';
const router = express.Router();
// Combined search endpoint
router.get('/', extractUserInfo, async (req, res) => {
    try {
        const { query: searchQuery, condition, region, state, page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        let communities = [];
        let posts = [];
        // Build search filters
        const searchFilters = {};
        if (searchQuery) {
            searchFilters.$text = { $search: searchQuery };
        }
        const conditionFilters = {};
        if (condition)
            conditionFilters.condition = condition;
        if (region)
            conditionFilters.region = region;
        if (state)
            conditionFilters.state = state;
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
    }
    catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});
// Search communities only
router.get('/communities', extractUserInfo, async (req, res) => {
    try {
        const { query: searchQuery, condition, region, state, page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build search filters
        const searchFilters = {};
        if (searchQuery) {
            searchFilters.$text = { $search: searchQuery };
        }
        const conditionFilters = {};
        if (condition)
            conditionFilters.condition = condition;
        if (region)
            conditionFilters.region = region;
        if (state)
            conditionFilters.state = state;
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
    }
    catch (error) {
        console.error('Community search error:', error);
        res.status(500).json({ error: 'Failed to search communities' });
    }
});
// Search posts only
router.get('/posts', extractUserInfo, async (req, res) => {
    try {
        const { query: searchQuery, condition, region, state, page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build search filters
        const searchFilters = {};
        if (searchQuery) {
            searchFilters.$text = { $search: searchQuery };
        }
        const conditionFilters = {};
        if (condition)
            conditionFilters.condition = condition;
        if (region)
            conditionFilters.region = region;
        if (state)
            conditionFilters.state = state;
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
    }
    catch (error) {
        console.error('Post search error:', error);
        res.status(500).json({ error: 'Failed to search posts' });
    }
});
export default router;
//# sourceMappingURL=search-new.js.map