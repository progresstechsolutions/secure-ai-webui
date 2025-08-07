# Frontend-Backend Integration Guide

## 🎯 Overview

The secure-ai-webui project now has full integration between the Next.js frontend and TypeScript Node.js backend.

## 🏗️ Architecture

```
Frontend (Next.js 15)     ←→     Backend (Node.js + Express + TypeScript)
├── API Client              ├── REST API Routes
├── React Hooks             ├── Socket.IO Events  
├── Socket.IO Client        ├── MongoDB/Mongoose
└── UI Components           └── File Uploads
```

## 🔗 Integration Components

### 1. API Client (`lib/api-client.ts`)

**Features:**
- TypeScript interfaces for all data models
- Centralized API configuration
- Mock user authentication (development)
- Comprehensive CRUD operations for:
  - Communities
  - Posts
  - Comments
  - Reactions
  - Friends
  - Messages
  - File uploads

**Example Usage:**
```typescript
import { apiClient } from '@/lib/api-client';

// Get communities
const response = await apiClient.getCommunities({ limit: 10 });

// Create community
const newCommunity = await apiClient.createCommunity({
  name: "Health Support",
  description: "A community for health discussions",
  category: "Health",
  isPrivate: false
});
```

### 2. React Hooks (`hooks/use-api.ts`)

**Available Hooks:**
- `useCommunities()` - Fetch and manage communities
- `useCommunity(slug)` - Get single community
- `useCreateCommunity()` - Create new community
- `usePosts()` - Fetch posts with pagination
- `useComments(postId)` - Get comments for a post
- `useToggleReaction()` - Like/react to posts/comments
- `useFriends()` - Manage friendships
- `useMessages(conversationId)` - Real-time messaging
- `useUploadImages()` / `useUploadAvatar()` - File uploads

**Example Usage:**
```typescript
import { useCommunities, useCreateCommunity } from '@/hooks/use-api';

function CommunityList() {
  const { communities, loading, error, refetch } = useCommunities({ limit: 10 });
  const { createCommunity, loading: creating } = useCreateCommunity();

  // Component logic here...
}
```

### 3. Socket.IO Integration (`hooks/use-socket.ts`)

**Real-time Features:**
- Live messaging with typing indicators
- Real-time post/comment updates
- Friend request notifications
- Community activity feeds
- User presence indicators

**Available Hooks:**
- `useSocket()` - Core socket connection
- `useSocketMessages(conversationId)` - Live messaging
- `useSocketCommunity(communityId)` - Community updates
- `useSocketNotifications()` - Real-time notifications

**Example Usage:**
```typescript
import { useSocketMessages } from '@/hooks/use-socket';

function ChatWindow({ conversationId }) {
  const { newMessages, typingUsers, sendTyping, stopTyping } = useSocketMessages(conversationId);
  
  // Real-time chat implementation...
}
```

## 🔧 Configuration

### Environment Variables

**Frontend (`.env.local`):**
```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WS_URL=http://localhost:5001
```

**Backend (`backend/.env`):**
```bash
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/secure-ai-webui
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
```

## 🚀 Getting Started

### 1. Start Backend
```bash
cd backend
npm run dev
# or
npm run build && npm start
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test Integration
Visit: `http://localhost:3000/backend-test`

## 📡 API Endpoints

### Communities
- `GET /api/communities` - List communities
- `POST /api/communities` - Create community
- `GET /api/communities/:slug` - Get community details
- `POST /api/communities/:id/join` - Join community
- `POST /api/communities/:id/leave` - Leave community

### Posts
- `GET /api/posts` - List posts (with community filtering)
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post details
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Reactions
- `POST /api/reactions/toggle` - Toggle reaction (like/love/etc.)

### Friends
- `GET /api/friends` - List friendships
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/:id/accept` - Accept friend request
- `POST /api/friends/:id/decline` - Decline friend request
- `DELETE /api/friends/:id` - Remove friend

### Messages
- `GET /api/messages/conversations` - List conversations
- `GET /api/messages/conversations/:id/messages` - Get messages
- `POST /api/messages/conversations/:id/messages` - Send message
- `POST /api/messages/conversations/direct` - Create direct conversation

### Uploads
- `POST /api/upload/avatar` - Upload user avatar
- `POST /api/upload/images` - Upload images for posts
- `POST /api/upload/files` - Upload files for messages

## 🎨 UI Integration Example

The `ApiTestComponent` demonstrates full integration:

```typescript
import { useCommunities, useCreateCommunity } from '@/hooks/use-api';
import { useSocket } from '@/hooks/use-socket';

export function ApiTestComponent() {
  const { communities, loading, error, refetch } = useCommunities({ limit: 10 });
  const { createCommunity, loading: creating } = useCreateCommunity();
  const { connected } = useSocket();

  // Component shows:
  // - Backend connection status
  // - Community creation form
  // - Communities list from API
  // - Real-time WebSocket connection status
}
```

## 🔐 Authentication Strategy

**Current Implementation:**
- Mock user data for development
- User info passed via headers to backend
- Ready for integration with NextAuth.js or other auth systems

**Mock User Data:**
```typescript
const user = {
  id: '66b1e5c8f1d2a3b4c5d6e7f8',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/placeholder-user.jpg'
};
```

## 🛠️ Development Workflow

1. **API Development:** Create/update endpoints in `backend/src/routes/`
2. **Type Definitions:** Update interfaces in `lib/api-client.ts`
3. **React Integration:** Create hooks in `hooks/use-api.ts`
4. **UI Components:** Build components using the hooks
5. **Real-time Features:** Use `useSocket` hooks for live updates

## 📦 Dependencies Added

**Frontend:**
- `socket.io-client` - WebSocket client for real-time features

**Backend:** (Already configured)
- `express` - Web framework
- `socket.io` - WebSocket server
- `mongoose` - MongoDB ODM
- `multer` & `sharp` - File uploads and image processing
- `helmet` & `cors` - Security
- `winston` - Logging

## 🔍 Testing the Integration

1. **Health Check:** `curl http://localhost:5001/health`
2. **WebSocket Test:** Open browser console on test page
3. **API Test:** Use the `/backend-test` page to create communities
4. **Real-time Test:** Open multiple browser tabs to see live updates

## 🚨 Troubleshooting

**Common Issues:**

1. **Port Conflicts:** Backend runs on 5001, frontend on 3000
2. **CORS Errors:** Check `backend/src/config/cors.ts` configuration
3. **MongoDB Connection:** Backend works without DB for testing
4. **Environment Variables:** Ensure `.env.local` has correct API URLs

## 🔄 Next Steps

1. **Database Setup:** Install and configure MongoDB
2. **Authentication:** Integrate with NextAuth.js or custom auth
3. **Real User Data:** Replace mock user with actual authentication
4. **Error Handling:** Enhance error boundaries and user feedback
5. **Performance:** Add caching, pagination, and optimization

## 📈 Integration Status

✅ **Complete:**
- API client with TypeScript
- React hooks for all endpoints
- Socket.IO real-time features
- File upload handling
- CORS and security configuration
- Development environment setup

✅ **Working:**
- Backend server on port 5001
- Frontend server on port 3000
- API communication
- WebSocket connection
- Test page demonstrating integration

🔄 **In Progress:**
- MongoDB database connection
- Real user authentication
- Production deployment configuration
