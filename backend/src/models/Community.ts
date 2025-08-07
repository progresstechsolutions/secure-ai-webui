import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
  name: string;
  description: string;
  slug: string;
  avatar?: string;
  banner?: string;
  createdBy: {
    id: string;
    name: string;
    email?: string;
  };
  admins: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  members: Array<{
    id: string;
    name: string;
    email?: string;
    joinedAt: Date;
  }>;
  isPrivate: boolean;
  tags: string[];
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
  name: {
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
  avatar: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  createdBy: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String }
  },
  admins: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String }
  }],
  members: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    joinedAt: { type: Date, default: Date.now }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [String],
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
communitySchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<ICommunity>('Community', communitySchema);
