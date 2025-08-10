declare const SYSTEM_ADMIN: {
    id: string;
    name: string;
    email: string;
};
declare const SYSTEM_COMMUNITIES: {
    title: string;
    description: string;
    slug: string;
    location: {
        region: string;
    };
    tags: string[];
    isPrivate: boolean;
    isSystemCommunity: boolean;
    createdBy: {
        id: string;
        name: string;
        email: string;
    };
    admins: {
        id: string;
        name: string;
        email: string;
    }[];
    members: never[];
    settings: {
        allowMemberPosts: boolean;
        allowMemberInvites: boolean;
        requireApproval: boolean;
    };
    stats: {
        totalMembers: number;
        totalPosts: number;
    };
}[];
export declare const seedSystemCommunities: () => Promise<void>;
export declare const removeSystemCommunities: () => Promise<void>;
export { SYSTEM_COMMUNITIES, SYSTEM_ADMIN };
//# sourceMappingURL=seedCommunities.d.ts.map