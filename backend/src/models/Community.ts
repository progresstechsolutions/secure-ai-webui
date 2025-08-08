import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
  title: string;
  description: string;
  slug: string;
  location: {
    region: string;
    state?: string;
  };
  tags: string[];  // Genetic conditions
  isPrivate: boolean;
  
  // Fields added after creation
  memberCount: number;
  lastActivity: Date;
  posts: number;
  admins: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  createdBy: {
    id: string;
    name: string;
    email?: string;
  };
  members: Array<{
    id: string;
    name: string;
    email?: string;
    joinedAt: Date;
  }>;
  
  // Optional fields
  avatar?: string;
  banner?: string;
  settings: {
    allowMemberPosts: boolean;
    allowMemberInvites: boolean;
    requireApproval: boolean;
  };
  stats: {
    totalMembers: number;
    totalPosts: number;
  };
}

const communitySchema = new Schema<ICommunity>({
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

export default mongoose.model<ICommunity>('Community', communitySchema);
