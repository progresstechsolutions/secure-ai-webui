import { Document } from 'mongoose';
import { Request } from 'express';
export interface User {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}
export interface UserInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}
export interface RequestWithUser extends Request {
    user?: UserInfo;
}
export interface AuthenticatedRequest<P = {}, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: UserInfo;
}
export interface ICommunity extends Document {
    _id: string;
    name: string;
    description: string;
    slug: string;
    avatar?: string;
    banner?: string;
    createdBy: User;
    admins: User[];
    members: (User & {
        joinedAt: Date;
    })[];
    isPrivate: boolean;
    tags: string[];
    settings: {
        allowMemberPosts: boolean;
        allowMemberInvites: boolean;
        requireApproval: boolean;
    };
    stats: {
        totalMembers: number;
        totalPosts: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface IPost extends Document {
    _id: string;
    title: string;
    content: string;
    author: User;
    community: ICommunity | string;
    images: string[];
    videos: string[];
    attachments: FileAttachment[];
    tags: string[];
    reactions: Reaction[];
    comments: IComment[] | string[];
    stats: {
        totalReactions: number;
        totalComments: number;
        views: number;
    };
    isPinned: boolean;
    isHidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IComment extends Document {
    _id: string;
    content: string;
    author: User;
    post: IPost | string;
    parentComment?: IComment | string;
    replies: IComment[] | string[];
    reactions: Reaction[];
    isEdited: boolean;
    editedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface Reaction {
    type: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
    user: User;
    createdAt: Date;
}
export interface IFriendship extends Document {
    _id: string;
    requester: User;
    recipient: User;
    status: 'pending' | 'accepted' | 'blocked';
    acceptedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IConversation extends Document {
    _id: string;
    type: 'direct' | 'group';
    name?: string;
    avatar?: string;
    participants: (User & {
        role: 'member' | 'admin';
        joinedAt: Date;
    })[];
    lastMessage?: {
        content: string;
        sender: User;
        timestamp: Date;
        type: 'text' | 'image' | 'file';
    };
    settings: {
        isArchived: boolean;
        isMuted: boolean;
        allowInvites: boolean;
    };
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMessage extends Document {
    _id: string;
    conversation: IConversation | string;
    sender: User;
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    attachments: FileAttachment[];
    replyTo?: IMessage | string;
    reactions: MessageReaction[];
    readBy: {
        user: User;
        readAt: Date;
    }[];
    isEdited: boolean;
    editedAt?: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface MessageReaction {
    emoji: string;
    user: User;
    createdAt: Date;
}
export interface FileAttachment {
    filename: string;
    originalName: string;
    url: string;
    size: number;
    mimetype?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    totalPages: number;
    currentPage: number;
    total: number;
    hasNext?: boolean;
    hasPrev?: boolean;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface CreateCommunityRequest {
    title: string;
    description: string;
    location: {
        region: string;
        state?: string;
    };
    tags: string[];
    isPrivate?: boolean;
    settings?: {
        allowMemberPosts?: boolean;
        allowMemberInvites?: boolean;
        requireApproval?: boolean;
    };
}
export interface UpdateCommunityRequest {
    name?: string;
    description?: string;
    tags?: string[];
    isPrivate?: boolean;
    settings?: {
        allowMemberPosts?: boolean;
        allowMemberInvites?: boolean;
        requireApproval?: boolean;
    };
}
export interface GetCommunitiesQuery {
    page?: string;
    limit?: string;
    search?: string;
    tags?: string;
    sortBy?: 'createdAt' | 'name' | 'totalMembers';
    order?: 'desc' | 'asc';
}
export interface PaginationQuery {
    page?: string;
    limit?: string;
}
export interface AddAdminRequest {
    userId: string;
    userName: string;
    userEmail: string;
}
export interface CreatePostRequest {
    title: string;
    content: string;
    communityId: string;
    tags?: string[];
    images?: string[];
    videos?: string[];
    attachments?: FileAttachment[];
    isAnonymous?: boolean;
}
export interface GetPostsQuery {
    page?: string;
    limit?: string;
    communityId?: string;
    authorId?: string;
    search?: string;
    tags?: string;
    sortBy?: 'createdAt' | 'title' | 'views' | 'totalReactions';
    order?: 'desc' | 'asc';
}
export interface UpdatePostRequest {
    title?: string;
    content?: string;
    tags?: string[];
    isPinned?: boolean;
    isHidden?: boolean;
}
export interface CreateReactionRequest {
    type: 'like' | 'love' | 'laugh' | 'sad' | 'angry';
}
export interface CreateCommentRequest {
    content: string;
    parentCommentId?: string;
}
export interface UpdateCommentRequest {
    content: string;
}
export interface GetCommentsQuery extends PaginationQuery {
    sortBy?: 'createdAt' | 'reactions';
    order?: 'desc' | 'asc';
}
export interface FriendRequestRequest {
    recipientId: string;
    recipientName: string;
    recipientEmail?: string;
    recipientAvatar?: string;
}
export interface UpdateFriendshipRequest {
    status: 'accepted' | 'blocked';
    notes?: string;
}
export interface GetFriendsQuery extends PaginationQuery {
    status?: 'pending' | 'accepted' | 'blocked';
    search?: string;
}
export interface CreateDirectConversationRequest {
    recipientId: string;
    recipientName: string;
    recipientEmail?: string;
    recipientAvatar?: string;
}
export interface CreateGroupConversationRequest {
    name: string;
    participantIds: string[];
    participantData: User[];
}
export interface SendMessageRequest {
    conversationId: string;
    content: string;
    type?: 'text' | 'image' | 'file';
    attachments?: FileAttachment[];
    replyToId?: string;
}
export interface GetMessagesQuery extends PaginationQuery {
    before?: string;
    after?: string;
}
export interface GetConversationsQuery extends PaginationQuery {
    type?: 'direct' | 'group';
    search?: string;
}
export interface CreateGroupConversationRequest {
    name: string;
    participantIds: string[];
    participantData: User[];
}
export interface UpdateConversationRequest {
    name?: string;
    avatar?: string;
    settings?: {
        isArchived?: boolean;
        isMuted?: boolean;
        allowInvites?: boolean;
    };
}
export interface ServerToClientEvents {
    new_message: (data: {
        message: IMessage;
        conversationId: string;
    }) => void;
    message_deleted: (data: {
        messageId: string;
        conversationId: string;
    }) => void;
    user_typing: (data: {
        userId: string;
        userName: string;
        isTyping: boolean;
    }) => void;
    user_status_change: (data: {
        userId: string;
        status: 'online' | 'away' | 'offline';
    }) => void;
    message_reaction_update: (data: {
        messageId: string;
        reaction: string;
        userId: string;
        userName: string;
    }) => void;
    incoming_call: (data: {
        callerId: string;
        callerName: string;
        type: 'voice' | 'video';
        conversationId: string;
    }) => void;
    call_answered: (data: {
        userId: string;
        conversationId: string;
    }) => void;
    call_rejected: (data: {
        userId: string;
        conversationId: string;
    }) => void;
    call_ended: (data: {
        userId: string;
        conversationId: string;
    }) => void;
    webrtc_offer: (data: {
        offer: any;
        fromUserId: string;
        conversationId: string;
    }) => void;
    webrtc_answer: (data: {
        answer: any;
        fromUserId: string;
        conversationId: string;
    }) => void;
    webrtc_ice_candidate: (data: {
        candidate: any;
        fromUserId: string;
        conversationId: string;
    }) => void;
}
export interface ClientToServerEvents {
    join_user_room: (userId: string) => void;
    join_conversation: (conversationId: string) => void;
    leave_conversation: (conversationId: string) => void;
    typing_start: (data: {
        conversationId: string;
        userId: string;
        userName: string;
    }) => void;
    typing_stop: (data: {
        conversationId: string;
        userId: string;
        userName: string;
    }) => void;
    user_online: (userId: string) => void;
    user_away: (userId: string) => void;
    message_reaction: (data: {
        messageId: string;
        conversationId: string;
        reaction: string;
        userId: string;
        userName: string;
    }) => void;
    call_initiate: (data: {
        conversationId: string;
        callerId: string;
        callerName: string;
        type: 'voice' | 'video';
    }) => void;
    call_answer: (data: {
        conversationId: string;
        userId: string;
    }) => void;
    call_reject: (data: {
        conversationId: string;
        userId: string;
    }) => void;
    call_end: (data: {
        conversationId: string;
        userId: string;
    }) => void;
    webrtc_offer: (data: {
        conversationId: string;
        offer: any;
        targetUserId: string;
    }) => void;
    webrtc_answer: (data: {
        conversationId: string;
        answer: any;
        targetUserId: string;
    }) => void;
    webrtc_ice_candidate: (data: {
        conversationId: string;
        candidate: any;
        targetUserId: string;
    }) => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    userId?: string;
}
export interface SearchQuery {
    query?: string;
    condition?: string;
    region?: string;
    state?: string;
    page?: string;
    limit?: string;
}
export interface SearchRequest extends AuthenticatedRequest<{}, any, any, SearchQuery> {
}
export interface SearchResponse {
    communities: any[];
    posts: any[];
    pagination: {
        currentPage: number;
        limit: number;
        totalCommunities?: number;
        totalPosts?: number;
        total?: number;
        totalPages?: number;
    };
}
export type NotificationType = 'post_liked' | 'comment_reply' | 'post_comment' | 'community_invite' | 'join_request_accepted' | 'join_request_rejected' | 'new_member' | 'mention' | 'friend_request';
export interface INotification extends Document {
    _id: string;
    recipient: User;
    sender: User;
    type: NotificationType;
    message: string;
    data: {
        postId?: string;
        commentId?: string;
        communityId?: string;
        inviteId?: string;
        [key: string]: any;
    };
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateNotificationRequest {
    recipientId: string;
    senderId: string;
    type: NotificationType;
    message: string;
    data?: Record<string, any>;
}
export interface GetNotificationsQuery {
    page?: string;
    limit?: string;
    unreadOnly?: string;
}
export interface NotificationRequest extends AuthenticatedRequest<{}, any, any, GetNotificationsQuery> {
}
//# sourceMappingURL=index.d.ts.map