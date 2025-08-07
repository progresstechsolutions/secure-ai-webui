# Secure AI WebUI Backend

A feature-rich backend API for a healthcare community platform that supports communities, posts, messaging, friendships, and real-time communication.

## Features

- **Communities**: Create and manage healthcare communities
- **Posts & Stories**: Share stories within communities with reactions and comments
- **Friendships**: Add friends, send/receive friend requests
- **Direct Messaging**: One-on-one conversations between friends
- **Group Messaging**: Create and manage group conversations
- **Real-time Communication**: WebSocket support for live messaging
- **File Uploads**: Support for images, documents, and avatars
- **Reactions**: Like, love, laugh, sad, angry reactions on posts and comments

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **File Processing**: Multer + Sharp
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   # Or update MONGODB_URI in .env
   ```

4. **Run the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Communities
- `GET /api/communities` - List communities with search/pagination
- `GET /api/communities/:slug` - Get community by slug
- `POST /api/communities` - Create new community
- `PUT /api/communities/:id` - Update community (admin only)
- `POST /api/communities/:id/join` - Join community
- `POST /api/communities/:id/leave` - Leave community
- `GET /api/communities/:id/members` - Get community members

### Posts
- `GET /api/posts` - List posts with filters
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post (author only)
- `DELETE /api/posts/:id` - Delete post (author/admin)
- `GET /api/posts/community/:slug` - Get posts by community

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `GET /api/comments/:commentId/replies` - Get comment replies
- `POST /api/comments` - Create comment/reply
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author/post owner)

### Reactions
- `POST /api/reactions/posts/:postId` - Add/update reaction to post
- `DELETE /api/reactions/posts/:postId` - Remove reaction from post
- `POST /api/reactions/comments/:commentId` - Add/update reaction to comment
- `DELETE /api/reactions/comments/:commentId` - Remove reaction from comment
- `GET /api/reactions/posts/:postId` - Get post reactions
- `GET /api/reactions/comments/:commentId` - Get comment reactions

### Friends
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/accept/:friendshipId` - Accept friend request
- `DELETE /api/friends/decline/:friendshipId` - Decline friend request
- `DELETE /api/friends/remove/:friendshipId` - Remove friend
- `GET /api/friends` - Get friends list
- `GET /api/friends/requests/received` - Get received friend requests
- `GET /api/friends/requests/sent` - Get sent friend requests

### Messages
- `GET /api/messages/conversations` - Get user's conversations
- `GET /api/messages/conversations/:id` - Get single conversation
- `POST /api/messages/conversations/direct` - Create direct message conversation
- `POST /api/messages/conversations/group` - Create group conversation
- `POST /api/messages/conversations/:id/participants` - Add participant to group
- `DELETE /api/messages/conversations/:id/participants/:participantId` - Remove participant
- `POST /api/messages/messages` - Send message
- `GET /api/messages/conversations/:id/messages` - Get conversation messages
- `PUT /api/messages/conversations/:id/read` - Mark messages as read
- `DELETE /api/messages/messages/:id` - Delete message

### File Upload
- `POST /api/upload/images` - Upload images (max 5, 10MB each)
- `POST /api/upload/files` - Upload files (documents, etc.)
- `POST /api/upload/avatar` - Upload avatar image
- `DELETE /api/upload/:type/:filename` - Delete uploaded file
- `GET /api/upload/:type/:filename/info` - Get file information

## User Authentication

This backend expects user information to be passed via headers from another application:

```javascript
headers: {
  'X-User-ID': 'user123',
  'X-User-Name': 'John Doe',
  'X-User-Email': 'john@example.com',
  'X-User-Avatar': 'https://example.com/avatar.jpg'
}
```

## Real-time Events (Socket.IO)

### Client Events
- `join_user_room` - Join personal notification room
- `join_conversation` - Join conversation room
- `leave_conversation` - Leave conversation room
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `user_online` - Set user status to online
- `user_away` - Set user status to away

### Server Events
- `new_message` - New message received
- `message_deleted` - Message was deleted
- `user_typing` - User typing status
- `user_status_change` - User online status changed
- `message_reaction_update` - Message reaction updated

## Data Models

### Community
- name, description, slug, avatar, banner
- createdBy, admins, members
- settings (allowMemberPosts, allowMemberInvites, requireApproval)
- stats (totalMembers, totalPosts)

### Post
- title, content, author, community
- images, attachments, tags
- reactions, comments, stats
- isPinned, isHidden

### Comment
- content, author, post, parentComment
- replies, reactions
- isEdited, editedAt

### Friendship
- requester, recipient, status (pending/accepted/blocked)
- acceptedAt, notes

### Conversation
- type (direct/group), name, avatar, participants
- lastMessage, settings
- createdBy

### Message
- conversation, sender, content, type
- attachments, replyTo, reactions
- readBy, isEdited, isDeleted

## Security Features

- Helmet for security headers
- CORS protection
- Rate limiting
- Input validation with Joi
- File type and size restrictions
- User authorization checks

## Development

```bash
# Run with auto-reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Production Deployment

1. Set NODE_ENV=production
2. Configure MongoDB connection
3. Set up file storage (local or cloud)
4. Configure logging
5. Set up reverse proxy (nginx)
6. Enable SSL/TLS

## Health Check

```
GET /health
```

Returns server status and uptime information.
