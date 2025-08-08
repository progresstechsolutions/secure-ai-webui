import mongoose, { Document } from 'mongoose';
export interface ICommunity extends Document {
    name: string;
    description: string;
    slug: string;
    avatar?: string;
    banner?: string;
    createdBy: {
        id: string;
        name: string;
        email?: string;
    };
    admins: Array<{
        id: string;
        name: string;
        email?: string;
    }>;
    members: Array<{
        id: string;
        name: string;
        email?: string;
        joinedAt: Date;
    }>;
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
}
declare const _default: mongoose.Model<ICommunity, {}, {}, {}, mongoose.Document<unknown, {}, ICommunity, {}, {}> & ICommunity & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Community.d.ts.map