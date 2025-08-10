import mongoose, { Schema } from 'mongoose';
const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    content: {
        type: String,
        required: true,
        maxLength: 5000
    },
    author: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String },
        avatar: { type: String }
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    images: [String],
    attachments: [{
            filename: String,
            originalName: String,
            url: String,
            size: Number,
            mimetype: String
        }],
    tags: [String],
    reactions: [{
            type: {
                type: String,
                enum: ['like', 'love', 'laugh', 'sad', 'angry'],
                required: true
            },
            user: {
                id: { type: String, required: true },
                name: { type: String, required: true },
                email: { type: String },
                avatar: { type: String }
            },
            createdAt: { type: Date, default: Date.now }
        }],
    comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    stats: {
        totalReactions: { type: Number, default: 0 },
        totalComments: { type: Number, default: 0 },
        views: { type: Number, default: 0 }
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Index for search and performance
postSchema.index({ community: 1, createdAt: -1 });
postSchema.index({ 'author.id': 1 });
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
export default mongoose.model('Post', postSchema);
//# sourceMappingURL=Post.js.map