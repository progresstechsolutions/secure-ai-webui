import mongoose, { Schema } from 'mongoose';
import { IConversation } from '../types/index.js';

const conversationSchema = new Schema<IConversation>({
  type: {
    type: String,
    enum: ['direct', 'group'],
    required: true
  },
  name: {
    type: String, // For group conversations
    maxLength: 100
  },
  avatar: {
    type: String // For group conversations
  },
  participants: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String },
    role: { 
      type: String, 
      enum: ['member', 'admin'], 
      default: 'member' 
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  lastMessage: {
    content: String,
    sender: {
      id: String,
      name: String
    },
    timestamp: Date,
    type: { type: String, enum: ['text', 'image', 'file'] }
  },
  settings: {
    isArchived: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    allowInvites: { type: Boolean, default: true } // For groups
  },
  createdBy: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  }
}, {
  timestamps: true
});

conversationSchema.index({ 'participants.id': 1 });
conversationSchema.index({ type: 1, updatedAt: -1 });

export default mongoose.model<IConversation>('Conversation', conversationSchema);
