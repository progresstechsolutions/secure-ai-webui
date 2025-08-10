import { logger } from '../utils/logger.js';
export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.id}`);
        // Join user to their personal room
        socket.on('join_user_room', (userId) => {
            socket.join(`user_${userId}`);
            socket.data.userId = userId;
            logger.info(`User ${userId} joined personal room`);
        });
        // Join conversation room
        socket.on('join_conversation', (conversationId) => {
            socket.join(`conversation_${conversationId}`);
            logger.info(`Socket ${socket.id} joined conversation ${conversationId}`);
        });
        // Leave conversation room
        socket.on('leave_conversation', (conversationId) => {
            socket.leave(`conversation_${conversationId}`);
            logger.info(`Socket ${socket.id} left conversation ${conversationId}`);
        });
        // Handle typing indicators
        socket.on('typing_start', ({ conversationId, userId, userName }) => {
            socket.to(`conversation_${conversationId}`).emit('user_typing', {
                userId,
                userName,
                isTyping: true
            });
        });
        socket.on('typing_stop', ({ conversationId, userId, userName }) => {
            socket.to(`conversation_${conversationId}`).emit('user_typing', {
                userId,
                userName,
                isTyping: false
            });
        });
        // Handle online status
        socket.on('user_online', (userId) => {
            socket.broadcast.emit('user_status_change', {
                userId,
                status: 'online'
            });
        });
        socket.on('user_away', (userId) => {
            socket.broadcast.emit('user_status_change', {
                userId,
                status: 'away'
            });
        });
        // Handle message reactions in real-time
        socket.on('message_reaction', ({ messageId, conversationId, reaction, userId, userName }) => {
            socket.to(`conversation_${conversationId}`).emit('message_reaction_update', {
                messageId,
                reaction,
                userId,
                userName
            });
        });
        // Handle voice/video call signaling
        socket.on('call_initiate', ({ conversationId, callerId, callerName, type }) => {
            socket.to(`conversation_${conversationId}`).emit('incoming_call', {
                callerId,
                callerName,
                type, // 'voice' or 'video'
                conversationId
            });
        });
        socket.on('call_answer', ({ conversationId, userId }) => {
            socket.to(`conversation_${conversationId}`).emit('call_answered', {
                userId,
                conversationId
            });
        });
        socket.on('call_reject', ({ conversationId, userId }) => {
            socket.to(`conversation_${conversationId}`).emit('call_rejected', {
                userId,
                conversationId
            });
        });
        socket.on('call_end', ({ conversationId, userId }) => {
            socket.to(`conversation_${conversationId}`).emit('call_ended', {
                userId,
                conversationId
            });
        });
        // WebRTC signaling
        socket.on('webrtc_offer', ({ conversationId, offer, targetUserId }) => {
            socket.to(`user_${targetUserId}`).emit('webrtc_offer', {
                offer,
                fromUserId: socket.data.userId || '',
                conversationId
            });
        });
        socket.on('webrtc_answer', ({ conversationId, answer, targetUserId }) => {
            socket.to(`user_${targetUserId}`).emit('webrtc_answer', {
                answer,
                fromUserId: socket.data.userId || '',
                conversationId
            });
        });
        socket.on('webrtc_ice_candidate', ({ conversationId, candidate, targetUserId }) => {
            socket.to(`user_${targetUserId}`).emit('webrtc_ice_candidate', {
                candidate,
                fromUserId: socket.data.userId || '',
                conversationId
            });
        });
        // Handle disconnect
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${socket.id}`);
            if (socket.data.userId) {
                socket.broadcast.emit('user_status_change', {
                    userId: socket.data.userId,
                    status: 'offline'
                });
            }
        });
        // Error handling
        socket.on('error', (error) => {
            logger.error('Socket error:', error);
        });
    });
    // Helper function to emit to specific users
    io.emitToUsers = (userIds, event, data) => {
        userIds.forEach(userId => {
            io.to(`user_${userId}`).emit(event, data);
        });
    };
    // Helper function to emit to conversation
    io.emitToConversation = (conversationId, event, data) => {
        io.to(`conversation_${conversationId}`).emit(event, data);
    };
    logger.info('Socket.IO initialized');
};
//# sourceMappingURL=socketHandler.js.map