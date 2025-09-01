import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  const query = useQuery({
    queryKey: ['communities', params],
    queryFn: async () => {
      const res = await apiClient.getCommunities(params)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    staleTime: 60_000,
  })

  return {
    communities: query.data?.communities || [],
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.currentPage || 1,
    total: query.data?.total || 0,
    loading: query.isLoading,
    error: query.error ? String((query.error as Error).message || query.error) : null,
    refetch: () => query.refetch(),
    reset: () => {},
  };
}

export function useCommunity(slug: string) {
  const query = useQuery({
    queryKey: ['community', slug],
    queryFn: async () => {
      const res = await apiClient.getCommunity(slug)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  })

  return {
    community: query.data,
    loading: query.isLoading,
    error: query.error ? String((query.error as Error).message || query.error) : null,
    refetch: () => query.refetch(),
    reset: () => {},
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
  const query = useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const res = await apiClient.getPosts(params)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    staleTime: 30_000,
    enabled: true,
  })

  return {
    posts: query.data?.posts || [],
    totalPages: query.data?.totalPages || 0,
    currentPage: query.data?.currentPage || 1,
    total: query.data?.total || 0,
    loading: query.isLoading,
    error: query.error ? String((query.error as Error).message || query.error) : null,
    refetch: () => query.refetch(),
    reset: () => {},
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
    videos?: string[];
    isAnonymous?: boolean;
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
    isAnonymous?: boolean;
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

  // Memoize params to prevent infinite loops
  const memoizedParams = useMemo(() => params, [
    params?.page,
    params?.limit, 
    params?.status,
    params?.search
  ]);

  const fetchFriends = useCallback(() => {
    execute(() => apiClient.getFriends(memoizedParams));
  }, [execute, memoizedParams]);

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

export function useCreateDirectConversation() {
  const { loading, error, execute } = useApi<Conversation>();

  const createDirectConversation = useCallback(async (data: {
    recipientId: string;
    recipientName: string;
    recipientEmail: string;
    recipientAvatar?: string;
  }) => {
    return await execute(() => apiClient.createDirectConversation(data));
  }, [execute]);

  return { createDirectConversation, loading, error };
}

export function useCreateGroupConversation() {
  const { loading, error, execute } = useApi<Conversation>();

  const createGroupConversation = useCallback(async (data: {
    name: string;
    participantIds: string[];
    participantData: any[];
  }) => {
    return await execute(() => apiClient.createGroupConversation(data));
  }, [execute]);

  return { createGroupConversation, loading, error };
}

export function useAvailableUsers() {
  const { data, loading, error, execute } = useApi<{ friendships: Friendship[]; totalPages: number; currentPage: number; total: number }>();

  const fetchAvailableUsers = useCallback(() => {
    execute(() => apiClient.getFriends({ status: 'accepted' }));
  }, [execute]);

  useEffect(() => {
    fetchAvailableUsers();
  }, [fetchAvailableUsers]);

  return { 
    friends: data?.friendships || [],
    loading, 
    error, 
    refetch: fetchAvailableUsers 
  };
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

export function useSearchUsers() {
  const { data, loading, error, execute } = useApi<{
    users: any[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>();

  const searchUsers = useCallback(async (params: {
    query?: string;
    page?: number;
    limit?: number;
  }) => {
    return await execute(() => apiClient.searchUsers(params));
  }, [execute]);

  return { searchUsers, data, loading, error };
}

export function useAvailableConditions() {
  const { data, loading, error, execute, reset } = useApi<{ conditions: string[] }>();

  const fetchConditions = useCallback(() => {
    execute(() => apiClient.getAvailableConditions());
  }, [execute]);

  useEffect(() => {
    fetchConditions();
  }, [fetchConditions]);

  return {
    conditions: data?.conditions || [],
    loading,
    error,
    refetch: fetchConditions,
    reset,
  };
}

export function useAvailableRegions() {
  const { data, loading, error, execute, reset } = useApi<{ regions: string[] }>();

  const fetchRegions = useCallback(() => {
    execute(() => apiClient.getAvailableRegions());
  }, [execute]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  return {
    regions: data?.regions || [],
    loading,
    error,
    refetch: fetchRegions,
    reset,
  };
}

export function useAvailableCategories() {
  const { data, loading, error, execute, reset } = useApi<{ categories: string[] }>();

  const fetchCategories = useCallback(() => {
    execute(() => apiClient.getAvailableCategories());
  }, [execute]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories: data?.categories || [],
    loading,
    error,
    refetch: fetchCategories,
    reset,
  };
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

export function useCommunityWithPosts(slug: string) {
  const queryClient = useQueryClient()
  
  // Fetch community data
  const communityQuery = useQuery({
    queryKey: ['community', slug],
    queryFn: async () => {
      const res = await apiClient.getCommunity(slug)
      if (res.error) throw new Error(res.error)
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  })

  // Fetch posts for the community
  const postsQuery = useQuery({
    queryKey: ['community-posts', (communityQuery.data as Community)?._id],
    queryFn: async () => {
      if (!(communityQuery.data as Community)?._id) throw new Error('No community ID')
      const res = await apiClient.getPosts({ communityId: (communityQuery.data as Community)._id })
      if (res.error) throw new Error(res.error)
      return res.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!(communityQuery.data as Community)?._id,
  })

  // Fetch user communities to check membership
  const userCommunitiesQuery = useQuery({
    queryKey: ['user-communities'],
    queryFn: async () => {
      const res = await apiClient.getUserCommunities()
      if (res.error) throw new Error(res.error)
      return res.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  const isLoading = communityQuery.isLoading || postsQuery.isLoading || userCommunitiesQuery.isLoading
  const error = communityQuery.error || postsQuery.error || userCommunitiesQuery.error

  // Check if user is a member of this community
  const isJoined = useMemo(() => {
    if (!userCommunitiesQuery.data?.communities || !slug) return false
    return userCommunitiesQuery.data.communities.some((c: Community & { userRole: 'creator' | 'admin' | 'member' }) => c.slug === slug)
  }, [userCommunitiesQuery.data?.communities, slug])

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['community', slug] })
    queryClient.invalidateQueries({ queryKey: ['community-posts', (communityQuery.data as Community)?._id] })
    queryClient.invalidateQueries({ queryKey: ['user-communities'] })
  }, [queryClient, slug, communityQuery.data])

  return {
    community: communityQuery.data,
    posts: postsQuery.data?.posts || [],
    isJoined,
    loading: isLoading,
    error: error ? String((error as Error).message || error) : null,
    refetch,
  }
}

export function useDebouncedValue<T>(value: T, delayMs: number = 400): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t)
  }, [value, delayMs])

  return debounced
}
