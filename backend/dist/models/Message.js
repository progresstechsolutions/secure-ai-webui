import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema({
    conversation: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        avatar: { type: String }
    },
    content: {
        type: String,
        required: true,
        maxLength: 2000
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    attachments: [{
            filename: String,
            originalName: String,
            url: String,
            size: Number,
            mimetype: String
        }],
    replyTo: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    reactions: [{
            emoji: String,
            user: {
                id: { type: String, required: true },
                name: { type: String, required: true }
            },
            createdAt: { type: Date, default: Date.now }
        }],
    readBy: [{
            user: {
                id: { type: String, required: true },
                name: { type: String, required: true }
            },
            readAt: { type: Date, default: Date.now }
        }],
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ 'sender.id': 1 });
export default mongoose.model('Message', messageSchema);
//# sourceMappingURL=Message.js.map