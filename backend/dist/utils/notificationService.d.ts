import { NotificationType, User } from '../types/index.js';
/**
 * Utility class for creating and managing notifications
 */
export declare class NotificationService {
    /**
     * Create a new notification
     */
    static createNotification({ recipient, sender, type, message, data }: {
        recipient: User;
        sender: User;
        type: NotificationType;
        message: string;
        data?: Record<string, any>;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notification when someone likes a post
     */
    static notifyPostLiked(postAuthor: User, liker: User, postId: string, postTitle: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notification when someone comments on a post
     */
    static notifyPostComment(postAuthor: User, commenter: User, postId: string, postTitle: string, commentContent: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notification when someone replies to a comment
     */
    static notifyCommentReply(commentAuthor: User, replier: User, postId: string, commentId: string, replyContent: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notification for community invitation
     */
    static notifyCommunityInvite(invitee: User, inviter: User, communityId: string, communityName: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notification when join request is accepted/rejected
     */
    static notifyJoinRequestResponse(requester: User, admin: User, communityId: string, communityName: string, accepted: boolean): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Create notification for new community member (to admins)
     */
    static notifyNewMember(admin: User, newMember: User, communityId: string, communityName: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Get notifications for a user
     */
    static getUserNotifications(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        notifications: (import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        pagination: {
            currentPage: number;
            totalPages: number;
            total: number;
            limit: number;
        };
        unreadCount: number;
    }>;
    /**
     * Mark notification as read
     */
    static markAsRead(notificationId: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../types/index.js").INotification, {}, {}> & import("../types/index.js").INotification & Required<{
        _id: string;
    }> & {
        __v: number;
    }) | null>;
    /**
     * Mark all notifications as read for a user
     */
    static markAllAsRead(userId: string): Promise<import("mongoose").UpdateWriteOpResult>;
    /**
     * Delete old notifications (cleanup job)
     */
    static cleanupOldNotifications(daysOld?: number): Promise<import("mongodb").DeleteResult>;
}
export default NotificationService;
//# sourceMappingURL=notificationService.d.ts.map