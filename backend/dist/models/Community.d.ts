import mongoose, { Document } from 'mongoose';
export interface ICommunity extends Document {
    title: string;
    description: string;
    slug: string;
    location: {
        region: string;
        state?: string;
    };
    tags: string[];
    isPrivate: boolean;
    isSystemCommunity?: boolean;
    memberCount: number;
    lastActivity: Date;
    posts: number;
    admins: Array<{
        id: string;
        name: string;
        email?: string;
    }>;
    createdBy: {
        id: string;
        name: string;
        email?: string;
    };
    members: Array<{
        id: string;
        name: string;
        email?: string;
        joinedAt: Date;
    }>;
    avatar?: string;
    banner?: string;
    settings: {
        allowMemberPosts: boolean;
        allowMemberInvites: boolean;
        requireApproval: boolean;
    };
    stats: {
        totalMembers: number;
        totalPosts: number;
    };
}
declare const _default: mongoose.Model<ICommunity, {}, {}, {}, mongoose.Document<unknown, {}, ICommunity, {}, {}> & ICommunity & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Community.d.ts.map