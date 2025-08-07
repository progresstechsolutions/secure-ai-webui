import mongoose, { Schema } from 'mongoose';
import { IComment } from '../types/index.js';

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
    maxLength: 1000
  },
  author: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatar: { type: String }
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
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
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ 'author.id': 1 });
commentSchema.index({ parentComment: 1 });

export default mongoose.model<IComment>('Comment', commentSchema);
