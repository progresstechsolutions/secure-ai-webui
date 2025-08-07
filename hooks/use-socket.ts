import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketEvents {
  // Community events
  'community:new': (community: any) => void;
  'community:updated': (community: any) => void;
  'community:member_joined': (data: { communityId: string; user: any }) => void;
  'community:member_left': (data: { communityId: string; userId: string }) => void;
  'community:join': (data: { communityId: string }) => void;
  'community:leave': (data: { communityId: string }) => void;

  // Post events
  'post:new': (post: any) => void;
  'post:updated': (post: any) => void;
  'post:deleted': (data: { postId: string; communityId: string }) => void;
  'post:reaction': (data: { postId: string; reactions: any[] }) => void;

  // Comment events
  'comment:new': (comment: any) => void;
  'comment:updated': (comment: any) => void;
  'comment:deleted': (data: { commentId: string; postId: string }) => void;
  'comment:reaction': (data: { commentId: string; reactions: any[] }) => void;

  // Message events
  'message:new': (message: any) => void;
  'message:updated': (message: any) => void;
  'message:deleted': (data: { messageId: string; conversationId: string }) => void;
  'conversation:join': (data: { conversationId: string }) => void;
  'conversation:leave': (data: { conversationId: string }) => void;

  // Friend events
  'friend:request': (friendship: any) => void;
  'friend:accepted': (friendship: any) => void;
  'friend:declined': (friendship: any) => void;

  // User presence
  'user:online': (data: { userId: string }) => void;
  'user:offline': (data: { userId: string }) => void;
  'user:typing': (data: { userId: string; conversationId: string }) => void;
  'user:stop_typing': (data: { userId: string; conversationId: string }) => void;

  // Notifications
  'notification:new': (notification: any) => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock user data for development
    const user = {
      id: '66b1e5c8f1d2a3b4c5d6e7f8',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/placeholder-user.jpg'
    };

    const socketInstance = io(WS_URL, {
      auth: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar,
      },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setConnected(false);
    });

    socketInstance.on('connect_error', (err: Error) => {
      console.error('Socket.IO connection error:', err);
      setError(err.message);
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const emit = <T extends keyof SocketEvents>(event: T, data: any) => {
    if (socket && connected) {
      socket.emit(event as string, data);
    }
  };

  const on = <T extends keyof SocketEvents>(event: T, handler: SocketEvents[T]) => {
    if (socket) {
      socket.on(event as string, handler);
    }
  };

  const off = <T extends keyof SocketEvents>(event: T, handler?: SocketEvents[T]) => {
    if (socket) {
      socket.off(event as string, handler);
    }
  };

  return {
    socket,
    connected,
    error,
    emit,
    on,
    off,
  };
}

// Specific hooks for different socket functionalities
export function useSocketMessages(conversationId?: string) {
  const { socket, connected, on, off, emit } = useSocket();
  const [newMessages, setNewMessages] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!connected || !conversationId) return;

    const handleNewMessage = (message: any) => {
      if (message.conversation === conversationId) {
        setNewMessages(prev => [...prev, message]);
      }
    };

    const handleTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      }
    };

    const handleStopTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId) {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    };

    on('message:new', handleNewMessage);
    on('user:typing', handleTyping);
    on('user:stop_typing', handleStopTyping);

    // Join conversation room
    emit('conversation:join', { conversationId });

    return () => {
      off('message:new', handleNewMessage);
      off('user:typing', handleTyping);
      off('user:stop_typing', handleStopTyping);
      emit('conversation:leave', { conversationId });
    };
  }, [connected, conversationId, on, off, emit]);

  const sendTyping = () => {
    if (conversationId) {
      emit('user:typing', { conversationId });
    }
  };

  const stopTyping = () => {
    if (conversationId) {
      emit('user:stop_typing', { conversationId });
    }
  };

  return {
    newMessages,
    typingUsers,
    sendTyping,
    stopTyping,
    clearNewMessages: () => setNewMessages([]),
  };
}

export function useSocketCommunity(communityId?: string) {
  const { connected, on, off, emit } = useSocket();
  const [newPosts, setNewPosts] = useState<any[]>([]);
  const [newComments, setNewComments] = useState<any[]>([]);

  useEffect(() => {
    if (!connected || !communityId) return;

    const handleNewPost = (post: any) => {
      if (post.community._id === communityId) {
        setNewPosts(prev => [...prev, post]);
      }
    };

    const handleNewComment = (comment: any) => {
      setNewComments(prev => [...prev, comment]);
    };

    on('post:new', handleNewPost);
    on('comment:new', handleNewComment);

    // Join community room
    emit('community:join', { communityId });

    return () => {
      off('post:new', handleNewPost);
      off('comment:new', handleNewComment);
      emit('community:leave', { communityId });
    };
  }, [connected, communityId, on, off, emit]);

  return {
    newPosts,
    newComments,
    clearNewPosts: () => setNewPosts([]),
    clearNewComments: () => setNewComments([]),
  };
}

export function useSocketNotifications() {
  const { connected, on, off } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!connected) return;

    const handleNotification = (notification: any) => {
      setNotifications(prev => [...prev, notification]);
    };

    const handleFriendRequest = (friendship: any) => {
      setNotifications(prev => [...prev, {
        id: `friend-request-${friendship._id}`,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${friendship.requester.name} sent you a friend request`,
        data: friendship,
        createdAt: new Date().toISOString(),
      }]);
    };

    on('notification:new', handleNotification);
    on('friend:request', handleFriendRequest);

    return () => {
      off('notification:new', handleNotification);
      off('friend:request', handleFriendRequest);
    };
  }, [connected, on, off]);

  const clearNotifications = () => setNotifications([]);
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    clearNotifications,
    removeNotification,
  };
}
