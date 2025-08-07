import mongoose, { Schema } from 'mongoose';
import { IFriendship } from '../types/index.js';

const friendshipSchema = new Schema<IFriendship>({
  requester: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String }
  },
  recipient: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  },
  acceptedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxLength: 200
  }
}, {
  timestamps: true
});

// Ensure unique friendship
friendshipSchema.index({ 
  'requester.id': 1, 
  'recipient.id': 1 
}, { unique: true });

friendshipSchema.index({ 'requester.id': 1, status: 1 });
friendshipSchema.index({ 'recipient.id': 1, status: 1 });

export default mongoose.model<IFriendship>('Friendship', friendshipSchema);
