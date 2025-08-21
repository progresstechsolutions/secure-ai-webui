import Notification from '../models/Notification.js';
import { NotificationType, User } from '../types/index.js';
import { logger } from './logger.js';

/**
 * Utility class for creating and managing notifications
 */
export class NotificationService {
  
  /**
   * Create a new notification
   */
  static async createNotification({
    recipient,
    sender,
    type,
    message,
    data = {}
  }: {
    recipient: User;
    sender: User;
    type: NotificationType;
    message: string;
    data?: Record<string, any>;
  }) {
    try {
      // Don't create notification if sender and recipient are the same
      if (recipient.id === sender.id) {
        return null;
      }

      // Check if similar notification already exists (prevent spam)
      const recentNotification = await Notification.findOne({
        'recipient.id': recipient.id,
        'sender.id': sender.id,
        type,
        'data.postId': data.postId,
        'data.commentId': data.commentId,
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Within last 5 minutes
      });

      if (recentNotification) {
        logger.info(`Duplicate notification prevented for type: ${type}`);
        return recentNotification;
      }

      const notification = new Notification({
        recipient,
        sender,
        type,
        message,
        data,
        isRead: false
      });

      await notification.save();
      logger.info(`Notification created: ${type} from ${sender.name} to ${recipient.name}`);
      
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      return null;
    }
  }

  /**
   * Create notification when someone likes a post
   */
  static async notifyPostLiked(postAuthor: User, liker: User, postId: string, postTitle: string) {
    return this.createNotification({
      recipient: postAuthor,
      sender: liker,
      type: 'post_liked',
      message: `${liker.name} liked your post "${postTitle.substring(0, 50)}${postTitle.length > 50 ? '...' : ''}"`,
      data: { postId }
    });
  }

  /**
   * Create notification when someone comments on a post
   */
  static async notifyPostComment(postAuthor: User, commenter: User, postId: string, postTitle: string, commentContent: string) {
    return this.createNotification({
      recipient: postAuthor,
      sender: commenter,
      type: 'post_comment',
      message: `${commenter.name} commented on your post: "${commentContent.substring(0, 100)}${commentContent.length > 100 ? '...' : ''}"`,
      data: { postId, commentContent }
    });
  }

  /**
   * Create notification when someone replies to a comment
   */
  static async notifyCommentReply(commentAuthor: User, replier: User, postId: string, commentId: string, replyContent: string) {
    return this.createNotification({
      recipient: commentAuthor,
      sender: replier,
      type: 'comment_reply',
      message: `${replier.name} replied to your comment: "${replyContent.substring(0, 100)}${replyContent.length > 100 ? '...' : ''}"`,
      data: { postId, commentId, replyContent }
    });
  }

  /**
   * Create notification for community invitation
   */
  static async notifyCommunityInvite(invitee: User, inviter: User, communityId: string, communityName: string) {
    return this.createNotification({
      recipient: invitee,
      sender: inviter,
      type: 'community_invite',
      message: `${inviter.name} invited you to join "${communityName}" community`,
      data: { communityId, communityName }
    });
  }

  /**
   * Create notification when join request is accepted/rejected
   */
  static async notifyJoinRequestResponse(requester: User, admin: User, communityId: string, communityName: string, accepted: boolean) {
    return this.createNotification({
      recipient: requester,
      sender: admin,
      type: accepted ? 'join_request_accepted' : 'join_request_rejected',
      message: `Your request to join "${communityName}" was ${accepted ? 'accepted' : 'rejected'}`,
      data: { communityId, communityName, accepted }
    });
  }

  /**
   * Create notification for new community member (to admins)
   */
  static async notifyNewMember(admin: User, newMember: User, communityId: string, communityName: string) {
    return this.createNotification({
      recipient: admin,
      sender: newMember,
      type: 'new_member',
      message: `${newMember.name} joined "${communityName}" community`,
      data: { communityId, communityName }
    });
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(userId: string, page = 1, limit = 20, unreadOnly = false) {
    try {
      const skip = (page - 1) * limit;
      const query: any = { 'recipient.id': userId };
      
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ 
        'recipient.id': userId, 
        isRead: false 
      });

      return {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          limit
        },
        unreadCount
      };
    } catch (error) {
      logger.error('Failed to get user notifications:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, 'recipient.id': userId },
        { isRead: true },
        { new: true }
      );
      return notification;
    } catch (error) {
      logger.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    try {
      const result = await Notification.updateMany(
        { 'recipient.id': userId, isRead: false },
        { isRead: true }
      );
      return result;
    } catch (error) {
      logger.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete old notifications (cleanup job)
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate }
      });
      logger.info(`Cleaned up ${result.deletedCount} old notifications`);
      return result;
    } catch (error) {
      logger.error('Failed to cleanup old notifications:', error);
      throw error;
    }
  }
}

export default NotificationService;
