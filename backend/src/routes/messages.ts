import express, { Request, Response } from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Friendship from '../models/Friendship.js';
import { extractUserInfo } from '../middleware/userExtract.js';
import { 
  AuthenticatedRequest, 
  SendMessageRequest,
  GetConversationsQuery,
  GetMessagesQuery,
  CreateGroupConversationRequest,
  CreateDirectConversationRequest 
} from '../types/index.js';

const router = express.Router();

// Get all conversations for user
router.get('/conversations', extractUserInfo, async (req: AuthenticatedRequest<{}, {}, {}, GetConversationsQuery>, res: Response) => {
  try {
    const { page = '1', limit = '20', type, search } = req.query;

    const query: any = {
      'participants.id': req.user!.id,
      'settings.isArchived': false
    };

    if (type) {
      query.type = type;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    // Apply search filter
    if (search) {
      conversations = conversations.filter((conv: any) => 
        conv.name?.toLowerCase().includes(search.toLowerCase()) ||
        conv.participants.some((p: any) => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }

    const total = await Conversation.countDocuments(query);

    res.json({
      conversations,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages for a conversation
router.get('/conversations/:conversationId/messages', extractUserInfo, async (req: AuthenticatedRequest<{ conversationId: string }, {}, {}, GetMessagesQuery>, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { page = '1', limit = '50', before, after } = req.query;

    // Check if user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    const isParticipant = conversation.participants.some((p: any) => p.id === req.user!.id);
    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized to view this conversation' });
      return;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const query: any = { 
      conversation: conversationId,
      isDeleted: false
    };

    // Cursor-based pagination
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }
    if (after) {
      const afterMessage = await Message.findById(after);
      if (afterMessage) {
        query.createdAt = { $gt: afterMessage.createdAt };
      }
    }

    const messages = await Message.find(query)
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Message.countDocuments({ 
      conversation: conversationId,
      isDeleted: false 
    });

    res.json({
      messages: messages.reverse(), // Newest first for chat display
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/conversations/:conversationId/messages', extractUserInfo, async (req: AuthenticatedRequest<{ conversationId: string }, {}, SendMessageRequest>, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { content, type = 'text', attachments, replyToId } = req.body;

    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    // Check if user is part of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    const isParticipant = conversation.participants.some((p: any) => p.id === req.user!.id);
    if (!isParticipant) {
      res.status(403).json({ error: 'Not authorized to send messages to this conversation' });
      return;
    }

    const message = new Message({
      conversation: conversationId,
      sender: {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        avatar: req.user!.avatar
      },
      content: content.trim(),
      type,
      attachments,
      replyTo: replyToId || null
    });

    await message.save();

    // Update conversation's last message
    conversation.lastMessage = {
      content: content.trim(),
      sender: {
        id: req.user!.id,
        name: req.user!.name
      },
      timestamp: new Date(),
      type
    };
    conversation.updatedAt = new Date();
    await conversation.save();

    await message.populate('replyTo', 'content sender');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Create direct conversation
router.post('/conversations/direct', extractUserInfo, async (req: AuthenticatedRequest<{}, {}, CreateDirectConversationRequest>, res: Response) => {
  try {
    const { recipientId, recipientName, recipientEmail, recipientAvatar } = req.body;

    if (!recipientId || !recipientName) {
      res.status(400).json({ error: 'Recipient ID and name are required' });
      return;
    }

    // Check if users are friends
    const friendship = await Friendship.findOne({
      $or: [
        { 'requester.id': req.user!.id, 'recipient.id': recipientId },
        { 'requester.id': recipientId, 'recipient.id': req.user!.id }
      ],
      status: 'accepted'
    });

    if (!friendship) {
      res.status(403).json({ error: 'Can only message friends' });
      return;
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      type: 'direct',
      $and: [
        { 'participants.id': req.user!.id },
        { 'participants.id': recipientId }
      ]
    });

    if (existingConversation) {
      res.json(existingConversation);
      return;
    }

    // Create new direct conversation
    const conversation = new Conversation({
      type: 'direct',
      participants: [
        {
          id: req.user!.id,
          name: req.user!.name,
          email: req.user!.email,
          avatar: req.user!.avatar,
          role: 'member'
        },
        {
          id: recipientId,
          name: recipientName,
          email: recipientEmail,
          avatar: recipientAvatar,
          role: 'member'
        }
      ],
      settings: {
        isArchived: false,
        isMuted: false,
        allowInvites: false
      },
      createdBy: {
        id: req.user!.id,
        name: req.user!.name
      }
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Create group conversation
router.post('/conversations/group', extractUserInfo, async (req: AuthenticatedRequest<{}, {}, CreateGroupConversationRequest>, res: Response) => {
  try {
    const { name, participantIds, participantData } = req.body;

    if (!name || !participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      res.status(400).json({ error: 'Name and participant IDs are required' });
      return;
    }

    // Include the creator in participants
    const allParticipantData = [
      {
        id: req.user!.id,
        name: req.user!.name,
        email: req.user!.email,
        avatar: req.user!.avatar,
        role: 'admin'
      },
      ...participantData.map((participant: any) => ({
        ...participant,
        role: 'member'
      }))
    ];

    const conversation = new Conversation({
      type: 'group',
      name: name.trim(),
      participants: allParticipantData,
      lastMessage: {
        content: `Group "${name.trim()}" was created`,
        sender: {
          id: req.user!.id,
          name: req.user!.name
        },
        timestamp: new Date(),
        type: 'text'
      },
      settings: {
        isArchived: false,
        isMuted: false,
        allowInvites: true
      },
      createdBy: {
        id: req.user!.id,
        name: req.user!.name
      }
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group conversation' });
  }
});

export default router;
