import Community from '../models/Community.js';
import { logger } from '../utils/logger.js';
// System admin user for creating system communities
const SYSTEM_ADMIN = {
    id: 'system-admin',
    name: 'System Administrator',
    email: 'admin@secure-ai-webui.com'
};
// Default system communities
const SYSTEM_COMMUNITIES = [
    {
        title: 'General Support & Discussion',
        description: 'A welcoming space for general discussions, questions, and mutual support among all community members.',
        slug: 'general-support',
        location: {
            region: 'Global'
        },
        tags: ['support', 'general', 'discussion', 'community'],
        isPrivate: false,
        isSystemCommunity: true,
        createdBy: SYSTEM_ADMIN,
        admins: [SYSTEM_ADMIN],
        members: [],
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requireApproval: false
        },
        stats: {
            totalMembers: 0,
            totalPosts: 0
        }
    },
    {
        title: 'Rare Genetic Conditions Support',
        description: 'Support and resources for individuals and families affected by rare genetic conditions.',
        slug: 'rare-genetic-conditions',
        location: {
            region: 'Global'
        },
        tags: ['rare-diseases', 'genetic-conditions', 'support', 'resources'],
        isPrivate: false,
        isSystemCommunity: true,
        createdBy: SYSTEM_ADMIN,
        admins: [SYSTEM_ADMIN],
        members: [],
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requireApproval: false
        },
        stats: {
            totalMembers: 0,
            totalPosts: 0
        }
    },
    {
        title: 'Phelan-McDermid Syndrome (PMS)',
        description: 'Support community for families and individuals affected by Phelan-McDermid Syndrome.',
        slug: 'phelan-mcdermid-syndrome',
        location: {
            region: 'Global'
        },
        tags: ['phelan-mcdermid', 'PMS', '22q13', 'developmental-delay'],
        isPrivate: false,
        isSystemCommunity: true,
        createdBy: SYSTEM_ADMIN,
        admins: [SYSTEM_ADMIN],
        members: [],
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requireApproval: false
        },
        stats: {
            totalMembers: 0,
            totalPosts: 0
        }
    },
    {
        title: 'Rett Syndrome Support',
        description: 'Community for families and caregivers of individuals with Rett Syndrome.',
        slug: 'rett-syndrome',
        location: {
            region: 'Global'
        },
        tags: ['rett-syndrome', 'MECP2', 'developmental-disorder'],
        isPrivate: false,
        isSystemCommunity: true,
        createdBy: SYSTEM_ADMIN,
        admins: [SYSTEM_ADMIN],
        members: [],
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requireApproval: false
        },
        stats: {
            totalMembers: 0,
            totalPosts: 0
        }
    },
    {
        title: 'Angelman Syndrome Community',
        description: 'Support and resources for families affected by Angelman Syndrome.',
        slug: 'angelman-syndrome',
        location: {
            region: 'Global'
        },
        tags: ['angelman-syndrome', 'UBE3A', 'happy-puppet-syndrome'],
        isPrivate: false,
        isSystemCommunity: true,
        createdBy: SYSTEM_ADMIN,
        admins: [SYSTEM_ADMIN],
        members: [],
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requireApproval: false
        },
        stats: {
            totalMembers: 0,
            totalPosts: 0
        }
    },
    {
        title: 'Medical Research & Clinical Trials',
        description: 'Information and discussion about ongoing research and clinical trials for rare genetic conditions.',
        slug: 'medical-research',
        location: {
            region: 'Global'
        },
        tags: ['research', 'clinical-trials', 'medical', 'studies'],
        isPrivate: false,
        isSystemCommunity: true,
        createdBy: SYSTEM_ADMIN,
        admins: [SYSTEM_ADMIN],
        members: [],
        settings: {
            allowMemberPosts: true,
            allowMemberInvites: true,
            requireApproval: true // Require approval for sensitive medical content
        },
        stats: {
            totalMembers: 0,
            totalPosts: 0
        }
    }
];
export const seedSystemCommunities = async () => {
    try {
        logger.info('🌱 Starting system communities seeding...');
        // Check if system communities already exist
        const existingSystemCommunities = await Community.find({
            $or: SYSTEM_COMMUNITIES.map(community => ({ slug: community.slug }))
        });
        if (existingSystemCommunities.length === SYSTEM_COMMUNITIES.length) {
            logger.info('✅ System communities already exist, skipping seeding');
            return;
        }
        // Create communities that don't exist yet
        for (const communityData of SYSTEM_COMMUNITIES) {
            const existingCommunity = await Community.findOne({ slug: communityData.slug });
            if (!existingCommunity) {
                const community = new Community(communityData);
                await community.save();
                logger.info(`✅ Created system community: ${communityData.title}`);
            }
            else {
                logger.info(`⏭️  System community already exists: ${communityData.title}`);
            }
        }
        logger.info('🎉 System communities seeding completed successfully');
    }
    catch (error) {
        logger.error('❌ Error seeding system communities:', error);
        throw error;
    }
};
export const removeSystemCommunities = async () => {
    try {
        logger.info('🗑️  Removing system communities...');
        const result = await Community.deleteMany({
            'createdBy.id': SYSTEM_ADMIN.id
        });
        logger.info(`✅ Removed ${result.deletedCount} system communities`);
    }
    catch (error) {
        logger.error('❌ Error removing system communities:', error);
        throw error;
    }
};
export { SYSTEM_COMMUNITIES, SYSTEM_ADMIN };
//# sourceMappingURL=seedCommunities.js.map