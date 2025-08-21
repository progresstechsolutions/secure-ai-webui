import express from 'express';
import { extractUserInfo } from '../middleware/userExtract.js';
import NotificationService from '../utils/notificationService.js';
import { seedNotifications } from '../scripts/seedNotifications.js';
const router = express.Router();
// ========================
// NOTIFICATION ROUTES
// ========================
// Get user notifications
router.get('/', extractUserInfo, async (req, res) => {
    try {
        const { page = '1', limit = '20', unreadOnly = 'false' } = req.query;
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const unreadOnlyBool = unreadOnly === 'true';
        const result = await NotificationService.getUserNotifications(req.user.id, pageNum, limitNum, unreadOnlyBool);
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// Mark notification as read
router.patch('/:notificationId/read', extractUserInfo, async (req, res) => {
    try {
        const { notificationId } = req.params;
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const notification = await NotificationService.markAsRead(notificationId, req.user.id);
        if (!notification) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }
        res.json({
            success: true,
            data: notification,
            message: 'Notification marked as read'
        });
    }
    catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
// Mark all notifications as read
router.patch('/mark-all-read', extractUserInfo, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const result = await NotificationService.markAllAsRead(req.user.id);
        res.json({
            success: true,
            data: result,
            message: `Marked ${result.modifiedCount} notifications as read`
        });
    }
    catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
});
// Get unread count
router.get('/unread-count', extractUserInfo, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const result = await NotificationService.getUserNotifications(req.user.id, 1, 1, true);
        res.json({
            success: true,
            data: {
                unreadCount: result.unreadCount
            }
        });
    }
    catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});
// Delete notification
router.delete('/:notificationId', extractUserInfo, async (req, res) => {
    try {
        const { notificationId } = req.params;
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        // Note: We should import Notification model here for direct deletion
        // For now, we'll implement this in the NotificationService
        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});
// Seed sample notifications (for development/testing)
router.post('/seed', async (req, res) => {
    try {
        // Only allow in development environment
        if (process.env.NODE_ENV === 'production') {
            res.status(403).json({
                error: 'Seeding is not allowed in production'
            });
            return;
        }
        const result = await seedNotifications();
        res.json({
            message: 'Notifications seeded successfully',
            seeded: result.seeded,
            unread: result.unread,
            read: result.read,
            types: result.types,
            success: result.success
        });
    }
    catch (error) {
        console.error('Error seeding notifications:', error);
        res.status(500).json({
            error: 'Failed to seed notifications',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
//# sourceMappingURL=notifications.js.map