// API Configuration and Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Community creation interface - only fields needed during creation
export interface CreateCommunityData {
  title: string;
  description: string;
  location: {
    region: string;
    state?: string;
  };
  tags: string[];  // Genetic conditions
  isPrivate?: boolean;
  settings?: {
    allowMemberPosts?: boolean;
    allowMemberInvites?: boolean;
    requireApproval?: boolean;
  };
}

// Full community interface - includes all fields after creation
export interface Community {
  _id: string;
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
  lastActivity: string;
  posts: number;
  admins: User[];
  createdBy: User;
  members?: User[];
  
  // Optional fields
  coverImage?: string;
  settings?: {
    allowMemberPosts?: boolean;
    allowMemberInvites?: boolean;
    requireApproval?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  community: {
    _id: string;
    name: string;
    slug: string;
    avatar?: string;
  };
  images?: string[];
  attachments?: any[];
  tags?: string[];
  reactions: any[]; // Array of reaction objects
  comments?: any[]; // Array of comment objects
  stats: {
    totalReactions: number;
    totalComments: number;
    views: number;
  };
  isPinned: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  replies: Comment[];
  reactions: {
    type: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
    user: User;
    createdAt: string;
  }[];
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Friendship {
  _id: string;
  requester: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: (User & { role: 'admin' | 'member' })[];
  lastMessage?: {
    content: string;
    sender: User;
    timestamp: string;
    type: 'text' | 'image' | 'file';
  };
  settings: {
    isArchived: boolean;
    isMuted: boolean;
    allowInvites: boolean;
  };
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file';
  attachments?: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }[];
  replyTo?: {
    _id: string;
    content: string;
    sender: User;
  };
  readBy: {
    user: string;
    readAt: string;
  }[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock user data for development (replace with actual auth)
const getMockUser = (): User => ({
  id: '66b1e5c8f1d2a3b4c5d6e7f8',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/placeholder-user.jpg'
});

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const user = getMockUser();
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          'x-user-name': user.name,
          'x-user-email': user.email,
          'x-user-avatar': user.avatar || '',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.error || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Communities API
  async getCommunities(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
  }): Promise<ApiResponse<{ communities: Community[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/communities?${queryParams}`);
  }

  async getUserCommunities(): Promise<ApiResponse<{ communities: (Community & { userRole: 'creator' | 'admin' | 'member' })[]; }>> {
    return this.request('/communities/user/my-communities');
  }

  async getCommunity(slug: string): Promise<ApiResponse<Community>> {
    return this.request(`/communities/${slug}`);
  }

  async createCommunity(data: CreateCommunityData): Promise<ApiResponse<Community>> {
    return this.request('/communities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinCommunity(communityId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/communities/${communityId}/join`, {
      method: 'POST',
    });
  }

  async leaveCommunity(communityId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/communities/${communityId}/leave`, {
      method: 'POST',
    });
  }

  // Posts API
  async getPosts(params?: {
    page?: number;
    limit?: number;
    communityId?: string;
    userId?: string;
    sort?: string;
  }): Promise<ApiResponse<{ posts: Post[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/posts?${queryParams}`);
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return this.request(`/posts/${postId}`);
  }

  async createPost(data: {
    title: string;
    content: string;
    communityId: string;
    images?: string[];
    link?: { url: string; title?: string; description?: string };
  }): Promise<ApiResponse<Post>> {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePost(postId: string, data: {
    title?: string;
    content?: string;
  }): Promise<ApiResponse<Post>> {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Search API
  async search(params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    type?: 'all' | 'communities' | 'posts';
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    communities: Community[];
    posts: Post[];
    totalResults: number;
    pagination: {
      communities: { page: number; limit: number; total: number; totalPages: number };
      posts: { page: number; limit: number; total: number; totalPages: number };
    };
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return this.request(`/search?${queryParams}`);
  }

  async searchCommunities(params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    communities: Community[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return this.request(`/search/communities?${queryParams}`);
  }

  async searchPosts(params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    communityId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    return this.request(`/search/posts?${queryParams}`);
  }

  // Comments API
  async getComments(postId: string, params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse<{ comments: Comment[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/comments/post/${postId}?${queryParams}`);
  }

  async createComment(data: {
    content: string;
    postId: string;
    parentCommentId?: string;
  }): Promise<ApiResponse<Comment>> {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateComment(commentId: string, data: {
    content: string;
  }): Promise<ApiResponse<Comment>> {
    return this.request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteComment(commentId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  // Reactions API
  async toggleReaction(data: {
    targetType: 'post' | 'comment';
    targetId: string;
    reactionType: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
  }): Promise<ApiResponse<{ message: string; reactionCounts: Record<string, number> }>> {
    return this.request('/reactions/toggle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Friends API
  async getFriends(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ friendships: Friendship[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/friends?${queryParams}`);
  }

  async sendFriendRequest(userId: string, data: {
    name: string;
    email: string;
    avatar?: string;
  }): Promise<ApiResponse<Friendship>> {
    return this.request('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId, ...data }),
    });
  }

  async respondToFriendRequest(requestId: string, action: 'accept' | 'decline'): Promise<ApiResponse<Friendship>> {
    return this.request(`/friends/${requestId}/${action}`, {
      method: 'POST',
    });
  }

  async removeFriend(friendshipId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/friends/${friendshipId}`, {
      method: 'DELETE',
    });
  }

  // Messages API
  async getConversations(params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }): Promise<ApiResponse<{ conversations: Conversation[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/messages/conversations?${queryParams}`);
  }

  async getMessages(conversationId: string, params?: {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
  }): Promise<ApiResponse<{ messages: Message[]; totalPages: number; currentPage: number; total: number }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/messages/conversations/${conversationId}/messages?${queryParams}`);
  }

  async sendMessage(conversationId: string, data: {
    content: string;
    type?: 'text' | 'image' | 'file';
    attachments?: any[];
    replyToId?: string;
  }): Promise<ApiResponse<Message>> {
    return this.request(`/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createDirectConversation(data: {
    recipientId: string;
    recipientName: string;
    recipientEmail: string;
    recipientAvatar?: string;
  }): Promise<ApiResponse<Conversation>> {
    return this.request('/messages/conversations/direct', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload API
  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.request('/upload/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async uploadImages(files: File[]): Promise<ApiResponse<{ images: { url: string; filename: string }[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    return this.request('/upload/images', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async uploadFiles(files: File[]): Promise<ApiResponse<{ files: { url: string; filename: string }[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    return this.request('/upload/files', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

export const apiClient = new ApiClient();
