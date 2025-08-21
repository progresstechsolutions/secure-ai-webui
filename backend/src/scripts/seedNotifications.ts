import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { logger } from '../utils/logger.js';

// Sample users for realistic notifications
const sampleUsers = [
  {
    id: 'user_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b096?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_002', 
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_004',
    name: 'David Thompson',
    email: 'david.thompson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'user_005',
    name: 'Lisa Park',
    email: 'lisa.park@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  }
];

// The recipient user (the one who will see these notifications)
const currentUser = {
  id: 'current_user_001',
  name: 'You',
  email: 'current.user@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
};

// Sample notification data
const sampleNotifications = [
  // Recent notifications (last few hours)
  {
    recipient: currentUser,
    sender: sampleUsers[0],
    type: 'post_liked',
    message: 'Sarah Johnson liked your post about cystic fibrosis treatment updates',
    data: {
      postId: 'post_cf_treatment_2025',
      postTitle: 'Latest CF Treatment Breakthrough'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false
  },
  {
    recipient: currentUser,
    sender: sampleUsers[1],
    type: 'post_comment',
    message: 'Michael Chen commented on your post: "Thank you for sharing this! My daughter was just diagnosed and this gives me hope."',
    data: {
      postId: 'post_cf_treatment_2025',
      commentId: 'comment_hope_message',
      postTitle: 'Latest CF Treatment Breakthrough'
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: false
  },
  {
    recipient: currentUser,
    sender: sampleUsers[2],
    type: 'comment_reply',
    message: 'Emily Rodriguez replied to your comment: "I completely agree! The research progress has been amazing lately."',
    data: {
      postId: 'post_cf_treatment_2025',
      commentId: 'comment_research_progress',
      replyId: 'reply_amazing_progress'
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false
  },
  
  // Yesterday's notifications
  {
    recipient: currentUser,
    sender: sampleUsers[3],
    type: 'new_member',
    message: 'David Thompson joined your community "CF Support Network"',
    data: {
      communityId: 'community_cf_support',
      communityName: 'CF Support Network'
    },
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    isRead: true
  },
  {
    recipient: currentUser,
    sender: sampleUsers[4],
    type: 'community_invite',
    message: 'Lisa Park invited you to join "Rare Disease Research Updates"',
    data: {
      communityId: 'community_rare_disease',
      communityName: 'Rare Disease Research Updates'
    },
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
    isRead: false
  },
  {
    recipient: currentUser,
    sender: sampleUsers[0],
    type: 'post_liked',
    message: 'Sarah Johnson liked your post about managing daily CF care routines',
    data: {
      postId: 'post_daily_care_routines',
      postTitle: 'Daily CF Care Routine Tips'
    },
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
    isRead: true
  },

  // Older notifications (2-3 days ago)
  {
    recipient: currentUser,
    sender: sampleUsers[2],
    type: 'join_request_accepted',
    message: 'Your request to join "CF Parents Support Group" has been accepted',
    data: {
      communityId: 'community_cf_parents',
      communityName: 'CF Parents Support Group'
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true
  },
  {
    recipient: currentUser,
    sender: sampleUsers[1],
    type: 'post_comment',
    message: 'Michael Chen commented on your post: "This medication has been a game-changer for our family too!"',
    data: {
      postId: 'post_medication_review',
      commentId: 'comment_game_changer',
      postTitle: 'Orkambi Experience Review'
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true
  },
  {
    recipient: currentUser,
    sender: sampleUsers[3],
    type: 'comment_reply',
    message: 'David Thompson replied to your comment: "Have you tried the new airway clearance techniques?"',
    data: {
      postId: 'post_airway_clearance',
      commentId: 'comment_techniques',
      replyId: 'reply_new_techniques'
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isRead: true
  },

  // Week old notifications
  {
    recipient: currentUser,
    sender: sampleUsers[4],
    type: 'new_member',
    message: 'Lisa Park joined your community "Genetic Counseling Resources"',
    data: {
      communityId: 'community_genetic_counseling',
      communityName: 'Genetic Counseling Resources'
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    isRead: true
  },
  {
    recipient: currentUser,
    sender: sampleUsers[0],
    type: 'post_liked',
    message: 'Sarah Johnson liked your post about nutrition tips for CF patients',
    data: {
      postId: 'post_nutrition_tips',
      postTitle: 'CF Nutrition Guidelines'
    },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    isRead: true
  },
  {
    recipient: currentUser,
    sender: sampleUsers[2],
    type: 'community_invite',
    message: 'Emily Rodriguez invited you to join "Clinical Trial Updates"',
    data: {
      communityId: 'community_clinical_trials',
      communityName: 'Clinical Trial Updates'
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    isRead: true
  }
];

export async function seedNotifications() {
  try {
    logger.info('🌱 Starting notification seeding...');

    // Clear existing notifications for the current user
    await Notification.deleteMany({ 'recipient.id': currentUser.id });
    logger.info('🗑️  Cleared existing notifications');

    // Insert sample notifications
    const insertedNotifications = await Notification.insertMany(sampleNotifications);
    
    logger.info(`✅ Successfully seeded ${insertedNotifications.length} notifications`);
    
    // Log summary
    const unreadCount = insertedNotifications.filter(n => !n.isRead).length;
    const readCount = insertedNotifications.length - unreadCount;
    
    logger.info(`📊 Notification Summary:`);
    logger.info(`   - Total: ${insertedNotifications.length}`);
    logger.info(`   - Unread: ${unreadCount}`);
    logger.info(`   - Read: ${readCount}`);
    
    // Log by type
    const typeStats = insertedNotifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    logger.info(`📈 By Type:`);
    Object.entries(typeStats).forEach(([type, count]) => {
      logger.info(`   - ${type}: ${count}`);
    });

    return {
      success: true,
      seeded: insertedNotifications.length,
      unread: unreadCount,
      read: readCount,
      types: typeStats
    };

  } catch (error) {
    logger.error('❌ Error seeding notifications:', error);
    throw error;
  }
}

// Auto-run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Connect to database
  const { connectDatabase } = await import('../config/database.js');
  await connectDatabase();
  
  // Run seeding
  const result = await seedNotifications();
  console.log('✅ Notification seeding completed:', result);
  
  // Close connection
  await mongoose.connection.close();
  process.exit(0);
}
