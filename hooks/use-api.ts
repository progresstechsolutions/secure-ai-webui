import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiResponse, Community, CreateCommunityData, Post, Comment, Friendship, Conversation, Message } from '@/lib/api-client';

// Custom hook for API calls with loading and error states
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      if (response.error) {
        setError(response.error);
        setData(null);
        return { error: response.error };
      } else {
        setData(response.data || null);
        return { data: response.data };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setData(null);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Communities hooks
export function useCommunities(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}) {
  const { data, loading, error, execute, reset } = useApi<{
    communities: Community[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const fetchCommunities = useCallback(() => {
    execute(() => apiClient.getCommunities(params));
  }, [execute, params]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return {
    communities: data?.communities || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchCommunities,
    reset,
  };
}

export function useCommunity(slug: string) {
  const { data, loading, error, execute, reset } = useApi<Community>();

  const fetchCommunity = useCallback(() => {
    if (slug) {
      execute(() => apiClient.getCommunity(slug));
    }
  }, [execute, slug]);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  return {
    community: data,
    loading,
    error,
    refetch: fetchCommunity,
    reset,
  };
}

export function useCreateCommunity() {
  const { loading, error, execute } = useApi<Community>();

  const createCommunity = useCallback(async (data: CreateCommunityData) => {
    const result = await execute(() => apiClient.createCommunity(data));
    return result;
  }, [execute]);

  return { createCommunity, loading, error };
}

export function useUserCommunities() {
  const { data, loading, error, execute, reset } = useApi<{
    communities: (Community & { userRole: 'creator' | 'admin' | 'member' })[];
  }>();

  const fetchUserCommunities = useCallback(() => {
    execute(() => apiClient.getUserCommunities());
  }, [execute]);

  useEffect(() => {
    fetchUserCommunities();
  }, [fetchUserCommunities]);

  return {
    communities: data?.communities || [],
    loading,
    error,
    refetch: fetchUserCommunities,
    reset,
  };
}

export function useJoinCommunity() {
  const { loading, error, execute } = useApi<{ message: string }>();

  const joinCommunity = useCallback(async (communityId: string) => {
    return await execute(() => apiClient.joinCommunity(communityId));
  }, [execute]);

  return { joinCommunity, loading, error };
}

export function useLeaveCommunity() {
  const { loading, error, execute } = useApi<{ message: string }>();

  const leaveCommunity = useCallback(async (communityId: string) => {
    return await execute(() => apiClient.leaveCommunity(communityId));
  }, [execute]);

  return { leaveCommunity, loading, error };
}

// Posts hooks
export function usePosts(params?: {
  page?: number;
  limit?: number;
  communityId?: string;
  userId?: string;
  sort?: string;
}) {
  const { data, loading, error, execute, reset } = useApi<{
    posts: Post[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const fetchPosts = useCallback(() => {
    execute(() => apiClient.getPosts(params));
  }, [execute, params]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts: data?.posts || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchPosts,
    reset,
  };
}

export function usePost(postId: string) {
  const { data, loading, error, execute, reset } = useApi<Post>();

  const fetchPost = useCallback(() => {
    if (postId) {
      execute(() => apiClient.getPost(postId));
    }
  }, [execute, postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post: data,
    loading,
    error,
    refetch: fetchPost,
    reset,
  };
}

export function useCreatePost() {
  const { loading, error, execute } = useApi<Post>();

  const createPost = useCallback(async (data: {
    title: string;
    content: string;
    communityId: string;
    images?: string[];
    link?: { url: string; title?: string; description?: string };
  }) => {
    const result = await execute(() => apiClient.createPost(data));
    return result;
  }, [execute]);

  return { createPost, loading, error };
}

// Comments hooks
export function useComments(postId: string, params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) {
  const { data, loading, error, execute, reset } = useApi<{
    comments: Comment[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const fetchComments = useCallback(() => {
    if (postId) {
      execute(() => apiClient.getComments(postId, params));
    }
  }, [execute, postId, params]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments: data?.comments || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchComments,
    reset,
  };
}

export function useCreateComment() {
  const { loading, error, execute } = useApi<Comment>();

  const createComment = useCallback(async (data: {
    content: string;
    postId: string;
    parentCommentId?: string;
  }) => {
    return await execute(() => apiClient.createComment(data));
  }, [execute]);

  return { createComment, loading, error };
}

// Reactions hook
export function useToggleReaction() {
  const { loading, error, execute } = useApi<{ message: string; reactionCounts: Record<string, number> }>();

  const toggleReaction = useCallback(async (data: {
    targetType: 'post' | 'comment';
    targetId: string;
    reactionType: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
  }) => {
    return await execute(() => apiClient.toggleReaction(data));
  }, [execute]);

  return { toggleReaction, loading, error };
}

// Friends hooks
export function useFriends(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const { data, loading, error, execute, reset } = useApi<{
    friendships: Friendship[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const fetchFriends = useCallback(() => {
    execute(() => apiClient.getFriends(params));
  }, [execute, params]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return {
    friendships: data?.friendships || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchFriends,
    reset,
  };
}

export function useSendFriendRequest() {
  const { loading, error, execute } = useApi<Friendship>();

  const sendFriendRequest = useCallback(async (userId: string, data: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    return await execute(() => apiClient.sendFriendRequest(userId, data));
  }, [execute]);

  return { sendFriendRequest, loading, error };
}

// Messages hooks
export function useConversations(params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}) {
  const { data, loading, error, execute, reset } = useApi<{
    conversations: Conversation[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const fetchConversations = useCallback(() => {
    execute(() => apiClient.getConversations(params));
  }, [execute, params]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations: data?.conversations || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchConversations,
    reset,
  };
}

export function useMessages(conversationId: string, params?: {
  page?: number;
  limit?: number;
  before?: string;
  after?: string;
}) {
  const { data, loading, error, execute, reset } = useApi<{
    messages: Message[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const fetchMessages = useCallback(() => {
    if (conversationId) {
      execute(() => apiClient.getMessages(conversationId, params));
    }
  }, [execute, conversationId, params]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages: data?.messages || [],
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchMessages,
    reset,
  };
}

export function useSendMessage() {
  const { loading, error, execute } = useApi<Message>();

  const sendMessage = useCallback(async (conversationId: string, data: {
    content: string;
    type?: 'text' | 'image' | 'file';
    attachments?: any[];
    replyToId?: string;
  }) => {
    return await execute(() => apiClient.sendMessage(conversationId, data));
  }, [execute]);

  return { sendMessage, loading, error };
}

// Upload hooks
export function useUploadAvatar() {
  const { loading, error, execute } = useApi<{ url: string; filename: string }>();

  const uploadAvatar = useCallback(async (file: File) => {
    return await execute(() => apiClient.uploadAvatar(file));
  }, [execute]);

  return { uploadAvatar, loading, error };
}

export function useUploadImages() {
  const { loading, error, execute } = useApi<{ images: { url: string; filename: string }[] }>();

  const uploadImages = useCallback(async (files: File[]) => {
    return await execute(() => apiClient.uploadImages(files));
  }, [execute]);

  return { uploadImages, loading, error };
}

// Search hooks
export function useSearch() {
  const { data, loading, error, execute } = useApi<{
    communities: Community[];
    posts: Post[];
    totalResults: number;
    pagination: {
      communities: { page: number; limit: number; total: number; totalPages: number };
      posts: { page: number; limit: number; total: number; totalPages: number };
    };
  }>();

  const search = useCallback(async (params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    type?: 'all' | 'communities' | 'posts';
    page?: number;
    limit?: number;
  }) => {
    return await execute(() => apiClient.search(params));
  }, [execute]);

  return { search, data, loading, error };
}

export function useSearchCommunities() {
  const { data, loading, error, execute } = useApi<{
    communities: Community[];
    total: number;
    page: number;
    totalPages: number;
  }>();

  const searchCommunities = useCallback(async (params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    page?: number;
    limit?: number;
  }) => {
    return await execute(() => apiClient.searchCommunities(params));
  }, [execute]);

  return { searchCommunities, data, loading, error };
}

export function useSearchPosts() {
  const { data, loading, error, execute } = useApi<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }>();

  const searchPosts = useCallback(async (params: {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    communityId?: string;
    page?: number;
    limit?: number;
  }) => {
    return await execute(() => apiClient.searchPosts(params));
  }, [execute]);

  return { searchPosts, data, loading, error };
}
