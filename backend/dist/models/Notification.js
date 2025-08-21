import mongoose, { Schema } from 'mongoose';
const notificationSchema = new Schema({
    recipient: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        avatar: { type: String }
    },
    sender: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        avatar: { type: String }
    },
    type: {
        type: String,
        enum: [
            'post_liked',
            'comment_reply',
            'post_comment',
            'community_invite',
            'join_request_accepted',
            'join_request_rejected',
            'new_member',
            'mention',
            'friend_request'
        ],
        required: true
    },
    message: {
        type: String,
        required: true,
        maxLength: 500
    },
    data: {
        type: Schema.Types.Mixed,
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'notifications'
});
// Indexes for performance
notificationSchema.index({ 'recipient.id': 1, createdAt: -1 });
notificationSchema.index({ 'recipient.id': 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // Auto-delete after 30 days
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
//# sourceMappingURL=Notification.js.map