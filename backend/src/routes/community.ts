import express, { Request, Response } from 'express';
import Community from '../models/Community.js';
import { extractUserInfo } from '../middleware/userExtract.js';
import { validateCommunity } from '../validators/community.js';
import { AuthenticatedRequest, GetCommunitiesQuery, CreateCommunityRequest, UpdateCommunityRequest, AddAdminRequest, PaginationQuery, User } from '../types/index.js';
import { seedSystemCommunities } from '../utils/seedCommunities.js';
import { NotificationService } from '../utils/notificationService.js';

const router = express.Router();

// Admin endpoint to seed system communities
router.post('/admin/seed-system-communities', async (req: Request, res: Response) => {
  try {
    await seedSystemCommunities();
    res.json({ 
      success: true, 
      message: 'System communities seeded successfully' 
    });
  } catch (error) {
    console.error('Error seeding system communities:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to seed system communities' 
    });
  }
});

// Get user's communities (created and joined)
router.get('/user/my-communities', extractUserInfo, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if database is connected
    if (!Community.db || Community.db.readyState !== 1) {
      // Return mock data when database is not connected
      const mockCommunities = [
        {
          _id: 'mock1',
          name: 'Tech Enthusiasts',
          slug: 'tech-enthusiasts',
          description: 'A community for technology lovers',
          isPrivate: false,
          tags: ['technology', 'programming'],
          createdBy: { id: req.user!.id, name: req.user!.name, avatar: req.user!.avatar },
          admins: [],
          members: [],
          memberCount: 150,
          userRole: 'creator',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'mock2',
          name: 'Design Community',
          slug: 'design-community',
          description: 'Share and discuss design ideas',
          isPrivate: false,
          tags: ['design', 'ui-ux'],
          createdBy: { id: 'other-user', name: 'John Doe', avatar: '' },
          admins: [],
          members: [],
          memberCount: 89,
          userRole: 'member',
          createdAt: new Date().toISOString()
        }
      ];
      
      return res.json({ 
        communities: mockCommunities,
        message: 'Using mock data (database not connected)' 
      });
    }

    const userId = req.user!.id;
    
    // Find communities where user is a member or admin
    const communities = await Community.find({
      $or: [
        { 'members.id': userId },
        { 'createdBy.id': userId }
      ]
    }).sort({ createdAt: -1 });

    const userCommunities = communities.map(community => ({
      ...community.toObject(),
      userRole: community.createdBy.id === userId ? 'creator' : 
                community.admins.some((admin: any) => admin.id === userId) ? 'admin' : 'member'
    }));

    return res.json({ communities: userCommunities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user communities' });
    return;
  }
});

// Get all communities with search and pagination
router.get('/', async (req: Request<{}, {}, {}, GetCommunitiesQuery>, res: Response) => {
  try {
    // Check if database is connected
    if (!Community.db || Community.db.readyState !== 1) {
      // Return mock data when database is not connected
      const mockCommunities = [
        {
          _id: 'mock1',
          name: 'Tech Enthusiasts',
          slug: 'tech-enthusiasts',
          description: 'A community for technology lovers',
          isPrivate: false,
          tags: ['technology', 'programming'],
          createdBy: { id: 'user1', name: 'Alice Johnson', avatar: '' },
          memberCount: 150,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'mock2',
          name: 'Design Community',
          slug: 'design-community',
          description: 'Share and discuss design ideas',
          isPrivate: false,
          tags: ['design', 'ui-ux'],
          createdBy: { id: 'user2', name: 'John Doe', avatar: '' },
          memberCount: 89,
          createdAt: new Date().toISOString()
        }
      ];
      
      return res.json({ 
        communities: mockCommunities,
        totalPages: 1,
        currentPage: 1,
        total: mockCommunities.length,
        message: 'Using mock data (database not connected)' 
      });
    }

    const { 
      page = '1', 
      limit = '10', 
      search, 
      tags, 
      sortBy = 'createdAt',
      order = 'desc' 
    } = req.query;

    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const sortOrder: 1 | -1 = order === 'desc' ? -1 : 1;
    const sortOptions: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const communities = await Community.find(query)
      .sort(sortOptions)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();

    const total = await Community.countDocuments(query);

    return res.json({
      communities,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch communities' });
    return;
  }
});

// Get community by slug
router.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const community = await Community.findOne({ slug: req.params.slug });
    
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// Create new community
router.post('/', extractUserInfo, validateCommunity, async (req: AuthenticatedRequest<{}, {}, CreateCommunityRequest>, res: Response) => {
  try {
    const { title, description, tags, location, isPrivate, settings } = req.body;
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const community = new Community({
      title,
      description,
      slug,
      tags,
      location,
      isPrivate,
      settings,
      createdBy: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email
      },
      admins: [{
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email
      }],
      members: [{
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email
      }],
      stats: {
        totalMembers: 1,
        totalPosts: 0
      }
    });

    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create community' });
  }
});

// Update community
router.put('/:id', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }, {}, UpdateCommunityRequest>, res: Response) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    // Check if user is admin
    const isAdmin = community.admins.some((admin: any) => admin.id === req.user!.id);
    if (!isAdmin) {
      res.status(403).json({ error: 'Only admins can update community' });
      return;
    }

    const allowedUpdates: (keyof UpdateCommunityRequest)[] = ['name', 'description', 'tags', 'isPrivate', 'settings'];
    const updates: any = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(community, updates);
    await community.save();

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update community' });
  }
});

// Join community
router.post('/:id/join', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    // Check if already a member
    const isMember = community.members.some((member: any) => member.id === req.user!.id);
    if (isMember) {
      res.status(400).json({ error: 'Already a member' });
      return;
    }

    community.members.push({
      id: req.user!.id,
      name: req.user!.name,
      email: req.user!.email,
      joinedAt: new Date()
    });

    community.stats.totalMembers = community.members.length;
    await community.save();

    // Notify community creator about new member
    try {
      const newMemberUser = {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        ...(req.user!.avatar && { avatar: req.user!.avatar })
      };

      const creatorUser = {
        id: community.createdBy.id,
        name: community.createdBy.name,
        email: community.createdBy.email || ''
      };

      await NotificationService.notifyNewMember(
        creatorUser,
        newMemberUser,
        community.title,
        (community._id as string)
      );

      // Also notify all admins
      for (const admin of community.admins) {
        if (admin.id !== community.createdBy.id) { // Don't notify creator twice
          const adminUser = {
            id: admin.id,
            name: admin.name,
            email: admin.email || ''
          };

          await NotificationService.notifyNewMember(
            adminUser,
            newMemberUser,
            community.title,
            (community._id as string)
          );
        }
      }
    } catch (notificationError) {
      console.error('Failed to send new member notification:', notificationError);
      // Don't fail the join operation if notification fails
    }

    res.json({ message: 'Successfully joined community' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join community' });
  }
});

// Leave community
router.post('/:id/leave', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    // Can't leave if you're the creator
    if (community.createdBy.id === req.user!.id) {
      res.status(400).json({ error: 'Creator cannot leave community' });
      return;
    }

    community.members = community.members.filter((member: any) => member.id !== req.user!.id);
    community.admins = community.admins.filter((admin: any) => admin.id !== req.user!.id);
    
    community.stats.totalMembers = community.members.length;
    await community.save();

    res.json({ message: 'Successfully left community' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave community' });
  }
});

// Add admin
router.post('/:id/admins', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }, {}, AddAdminRequest>, res: Response) => {
  try {
    const community = await Community.findById(req.params.id);
    const { userId, userName, userEmail } = req.body;
    
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    // Check if requester is admin
    const isAdmin = community.admins.some((admin: any) => admin.id === req.user!.id);
    if (!isAdmin) {
      res.status(403).json({ error: 'Only admins can add other admins' });
      return;
    }

    // Check if user is a member
    const isMember = community.members.some((member: any) => member.id === userId);
    if (!isMember) {
      res.status(400).json({ error: 'User must be a member first' });
      return;
    }

    // Check if already admin
    const isAlreadyAdmin = community.admins.some((admin: any) => admin.id === userId);
    if (isAlreadyAdmin) {
      res.status(400).json({ error: 'User is already an admin' });
      return;
    }

    community.admins.push({
      id: userId,
      name: userName,
      email: userEmail
    });

    await community.save();

    // Notify the new admin
    try {
      const newAdminUser = {
        id: userId,
        name: userName,
        email: userEmail || ''
      };

      const promoterUser = {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        ...(req.user!.avatar && { avatar: req.user!.avatar })
      };

      // This would be a custom notification for admin promotion
      // For now, we'll use a generic notification type
      await NotificationService.createNotification({
        recipient: newAdminUser,
        sender: promoterUser,
        type: 'community_invite', // Reusing this type for admin promotion
        message: `You have been promoted to admin in ${community.title}`,
        data: {
          communityId: (community._id as string),
          communityName: community.title
        }
      });
    } catch (notificationError) {
      console.error('Failed to send admin promotion notification:', notificationError);
      // Don't fail the operation if notification fails
    }

    res.json({ message: 'Admin added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add admin' });
  }
});

// Get community members
router.get('/:id/members', async (req: Request<{ id: string }, {}, {}, PaginationQuery>, res: Response) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      res.status(404).json({ error: 'Community not found' });
      return;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const members = community.members.slice(startIndex, endIndex);
    
    res.json({
      members,
      total: community.members.length,
      totalPages: Math.ceil(community.members.length / limitNum),
      currentPage: pageNum
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get community metrics for admin dashboard
router.get('/:id/metrics', extractUserInfo, async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find the community
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    
    // Check if user is admin
    const user = req.user!;
    const isAdmin = community.admins?.some((admin: any) => 
      admin.id === user.id || admin.email === user.email || admin.name === user.name
    ) || community.createdBy?.id === user.id;
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Get current date for calculations
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate basic metrics
    const totalMembers = community.members?.length || 0;
    const totalPosts = community.stats?.totalPosts || 0;
    
    // Calculate recent activity (mock data for now - in real implementation, 
    // you'd query posts and member join dates)
    const communityCreatedAt = (community as any).createdAt || new Date();
    const recentMembers = community.members?.filter((member: any) => 
      new Date(member.joinedAt || communityCreatedAt) > oneWeekAgo
    ).length || 0;
    
    // Weekly growth calculation (mock - in real app you'd track historical data)
    const weeklyGrowth = totalMembers > 0 ? Math.round((recentMembers / totalMembers) * 100) : 0;
    
    // Mock additional metrics (in real app, these would come from actual data)
    const activeMembers = Math.floor(totalMembers * 0.7); // 70% active rate
    const totalViews = Math.floor(Math.random() * 1000) + 200;
    const totalReactions = Math.floor(Math.random() * 200) + 50;
    
    // Recent activity (mock data - in real app, query recent posts/comments/joins)
    const recentActivity = [
      {
        action: "New member joined",
        user: community.members?.[community.members.length - 1]?.name || "Unknown User",
        time: "2 hours ago"
      },
      {
        action: "New post created",
        user: community.createdBy?.name || "Admin",
        time: "5 hours ago"
      },
      {
        action: "Comment added",
        user: community.members?.[Math.floor(Math.random() * totalMembers)]?.name || "Member",
        time: "1 day ago"
      },
      {
        action: "Post liked",
        user: "Visitor",
        time: "2 days ago"
      }
    ];
    
    const metrics = {
      totalMembers,
      totalPosts,
      totalViews,
      totalReactions,
      weeklyGrowth,
      activeMembers,
      recentActivity,
      
      // Additional analytics
      memberRetention: 85, // Mock percentage
      postEngagement: 12.3, // Mock percentage
      communityHealth: 85, // Mock score
      memberSatisfaction: 92, // Mock percentage
      contentQuality: 78, // Mock percentage
      
      // Weekly stats
      postsThisWeek: Math.floor(totalPosts * 0.3),
      commentsThisWeek: Math.floor(totalReactions * 0.4),
      activeMembersToday: Math.floor(activeMembers * 0.6)
    };
    
    return res.json({
      success: true,
      data: metrics
    });
    
  } catch (error) {
    console.error('Error fetching community metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch community metrics' });
  }
});

// Get available conditions for community creation
router.get('/conditions', async (req: Request, res: Response) => {
  try {
    const conditions = [
      "Diabetes", "Heart Disease", "Cancer", "Mental Health", "Chronic Pain", 
      "Autoimmune", "Neurological", "Respiratory", "Digestive", "Obesity",
      "Hypertension", "Arthritis", "Depression", "Anxiety", "ADHD",
      "Fibromyalgia", "Thyroid", "Kidney Disease", "Liver Disease", "Other"
    ];
    
    res.json({ conditions });
  } catch (error) {
    console.error('Error fetching conditions:', error);
    res.status(500).json({ error: 'Failed to fetch conditions' });
  }
});

// Get available regions for community creation
router.get('/regions', async (req: Request, res: Response) => {
  try {
    const regions = [
      "Global", "United States", "Canada", "United Kingdom", "Europe", 
      "Australia", "New Zealand", "Asia", "India", "South America", 
      "Africa", "Middle East", "Other"
    ];
    
    res.json({ regions });
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

// Get available categories for community creation
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = [
      "Health Support", "Mental Health", "Chronic Conditions", "Wellness", 
      "Family Support", "Caregiver Support", "Lifestyle", "Nutrition",
      "Exercise & Fitness", "Medical Advocacy", "Research & Trials", "Other"
    ];
    
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
