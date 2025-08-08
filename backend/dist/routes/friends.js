import express from 'express';
import Friendship from '../models/Friendship.js';
import { extractUserInfo } from '../middleware/userExtract.js';
const router = express.Router();
// Send friend request
router.post('/request', extractUserInfo, async (req, res) => {
    try {
        const { recipientId, recipientName, recipientEmail, recipientAvatar } = req.body;
        if (!recipientId || !recipientName) {
            res.status(400).json({ error: 'Recipient ID and name are required' });
            return;
        }
        // Can't send request to yourself
        if (recipientId === req.user.id) {
            res.status(400).json({ error: 'Cannot send friend request to yourself' });
            return;
        }
        // Check if friendship already exists
        const existingFriendship = await Friendship.findOne({
            $or: [
                { 'requester.id': req.user.id, 'recipient.id': recipientId },
                { 'requester.id': recipientId, 'recipient.id': req.user.id }
            ]
        });
        if (existingFriendship) {
            if (existingFriendship.status === 'accepted') {
                res.status(400).json({ error: 'Already friends' });
                return;
            }
            else if (existingFriendship.status === 'pending') {
                res.status(400).json({ error: 'Friend request already sent' });
                return;
            }
            else if (existingFriendship.status === 'blocked') {
                res.status(400).json({ error: 'Cannot send friend request' });
                return;
            }
        }
        const friendship = new Friendship({
            requester: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar
            },
            recipient: {
                id: recipientId,
                name: recipientName,
                email: recipientEmail,
                avatar: recipientAvatar
            },
            status: 'pending'
        });
        await friendship.save();
        res.status(201).json({ message: 'Friend request sent successfully', friendship });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send friend request' });
    }
});
// Accept friend request
router.put('/accept/:friendshipId', extractUserInfo, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.friendshipId);
        if (!friendship) {
            res.status(404).json({ error: 'Friend request not found' });
            return;
        }
        // Check if user is the recipient
        if (friendship.recipient.id !== req.user.id) {
            res.status(403).json({ error: 'Not authorized to accept this request' });
            return;
        }
        if (friendship.status !== 'pending') {
            res.status(400).json({ error: 'Friend request is not pending' });
            return;
        }
        friendship.status = 'accepted';
        friendship.acceptedAt = new Date();
        await friendship.save();
        res.json({ message: 'Friend request accepted', friendship });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to accept friend request' });
    }
});
// Decline friend request
router.delete('/decline/:friendshipId', extractUserInfo, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.friendshipId);
        if (!friendship) {
            res.status(404).json({ error: 'Friend request not found' });
            return;
        }
        // Check if user is the recipient
        if (friendship.recipient.id !== req.user.id) {
            res.status(403).json({ error: 'Not authorized to decline this request' });
            return;
        }
        if (friendship.status !== 'pending') {
            res.status(400).json({ error: 'Friend request is not pending' });
            return;
        }
        await Friendship.findByIdAndDelete(req.params.friendshipId);
        res.json({ message: 'Friend request declined' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to decline friend request' });
    }
});
// Remove friend
router.delete('/remove/:friendshipId', extractUserInfo, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.friendshipId);
        if (!friendship) {
            res.status(404).json({ error: 'Friendship not found' });
            return;
        }
        // Check if user is involved in this friendship
        const isInvolved = friendship.requester.id === req.user.id ||
            friendship.recipient.id === req.user.id;
        if (!isInvolved) {
            res.status(403).json({ error: 'Not authorized to remove this friendship' });
            return;
        }
        await Friendship.findByIdAndDelete(req.params.friendshipId);
        res.json({ message: 'Friend removed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove friend' });
    }
});
// Get friends list
router.get('/', extractUserInfo, async (req, res) => {
    try {
        const { page = '1', limit = '20', search } = req.query;
        const query = {
            $or: [
                { 'requester.id': req.user.id },
                { 'recipient.id': req.user.id }
            ],
            status: 'accepted'
        };
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const friendships = await Friendship.find(query)
            .sort({ acceptedAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        // Transform to get friend info
        let friends = friendships.map(friendship => {
            const friend = friendship.requester.id === req.user.id
                ? friendship.recipient
                : friendship.requester;
            return {
                ...friend,
                friendshipId: friendship._id,
                friendsSince: friendship.acceptedAt
            };
        });
        // Apply search filter
        if (search) {
            friends = friends.filter(friend => friend.name.toLowerCase().includes(search.toLowerCase()) ||
                (friend.email && friend.email.toLowerCase().includes(search.toLowerCase())));
        }
        const total = await Friendship.countDocuments(query);
        res.json({
            friends,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            total
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch friends' });
    }
});
// Get pending friend requests (received)
router.get('/requests/received', extractUserInfo, async (req, res) => {
    try {
        const { page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const requests = await Friendship.find({
            'recipient.id': req.user.id,
            status: 'pending'
        })
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        const total = await Friendship.countDocuments({
            'recipient.id': req.user.id,
            status: 'pending'
        });
        res.json({
            requests,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            total
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch received requests' });
    }
});
// Get pending friend requests (sent)
router.get('/requests/sent', extractUserInfo, async (req, res) => {
    try {
        const { page = '1', limit = '20' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const requests = await Friendship.find({
            'requester.id': req.user.id,
            status: 'pending'
        })
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        const total = await Friendship.countDocuments({
            'requester.id': req.user.id,
            status: 'pending'
        });
        res.json({
            requests,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            total
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sent requests' });
    }
});
// Cancel sent friend request
router.delete('/requests/cancel/:friendshipId', extractUserInfo, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.friendshipId);
        if (!friendship) {
            res.status(404).json({ error: 'Friend request not found' });
            return;
        }
        // Check if user is the requester
        if (friendship.requester.id !== req.user.id) {
            res.status(403).json({ error: 'Not authorized to cancel this request' });
            return;
        }
        if (friendship.status !== 'pending') {
            res.status(400).json({ error: 'Friend request is not pending' });
            return;
        }
        await Friendship.findByIdAndDelete(req.params.friendshipId);
        res.json({ message: 'Friend request cancelled' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to cancel friend request' });
    }
});
// Block user
router.post('/block', extractUserInfo, async (req, res) => {
    try {
        const { recipientId: userId, recipientName: userName, recipientEmail: userEmail, recipientAvatar: userAvatar } = req.body;
        if (!userId || !userName) {
            res.status(400).json({ error: 'User ID and name are required' });
            return;
        }
        // Can't block yourself
        if (userId === req.user.id) {
            res.status(400).json({ error: 'Cannot block yourself' });
            return;
        }
        // Check if friendship exists
        let friendship = await Friendship.findOne({
            $or: [
                { 'requester.id': req.user.id, 'recipient.id': userId },
                { 'requester.id': userId, 'recipient.id': req.user.id }
            ]
        });
        if (friendship) {
            friendship.status = 'blocked';
            await friendship.save();
        }
        else {
            // Create new blocked relationship
            friendship = new Friendship({
                requester: {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    avatar: req.user.avatar
                },
                recipient: {
                    id: userId,
                    name: userName,
                    email: userEmail,
                    avatar: userAvatar
                },
                status: 'blocked'
            });
            await friendship.save();
        }
        res.json({ message: 'User blocked successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to block user' });
    }
});
// Unblock user
router.delete('/unblock/:friendshipId', extractUserInfo, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.friendshipId);
        if (!friendship) {
            res.status(404).json({ error: 'Blocked relationship not found' });
            return;
        }
        // Check if user is involved in this relationship
        const isInvolved = friendship.requester.id === req.user.id ||
            friendship.recipient.id === req.user.id;
        if (!isInvolved) {
            res.status(403).json({ error: 'Not authorized to unblock this user' });
            return;
        }
        if (friendship.status !== 'blocked') {
            res.status(400).json({ error: 'User is not blocked' });
            return;
        }
        await Friendship.findByIdAndDelete(req.params.friendshipId);
        res.json({ message: 'User unblocked successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to unblock user' });
    }
});
export default router;
//# sourceMappingURL=friends.js.map