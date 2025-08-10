import mongoose, { Schema } from 'mongoose';
const communitySchema = new Schema({
    // Core creation fields
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        maxLength: 500
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    location: {
        region: {
            type: String,
            required: true
        },
        state: {
            type: String,
            default: ''
        }
    },
    tags: [{
            type: String,
            required: true
        }],
    // Fields added after creation
    memberCount: {
        type: Number,
        default: 1
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    posts: {
        type: Number,
        default: 0
    },
    admins: [{
            id: { type: String, required: true },
            name: { type: String, required: true },
            email: String
        }],
    createdBy: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        email: String
    },
    members: [{
            id: { type: String, required: true },
            name: { type: String, required: true },
            email: String,
            joinedAt: { type: Date, default: Date.now }
        }],
    // Optional fields
    isPrivate: {
        type: Boolean,
        default: false
    },
    isSystemCommunity: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: null
    },
    banner: {
        type: String,
        default: null
    },
    settings: {
        allowMemberPosts: { type: Boolean, default: true },
        allowMemberInvites: { type: Boolean, default: true },
        requireApproval: { type: Boolean, default: false }
    },
    stats: {
        totalMembers: { type: Number, default: 0 },
        totalPosts: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});
// Index for search
communitySchema.index({ title: 'text', description: 'text', tags: 'text' });
export default mongoose.model('Community', communitySchema);
//# sourceMappingURL=Community.js.map