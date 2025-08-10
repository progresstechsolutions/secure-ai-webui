#!/usr/bin/env node
/**
 * System Communities Seeder Script
 *
 * This script can be run manually to seed system communities into the database.
 * Usage: npm run seed:communities
 */
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });
import { seedSystemCommunities, removeSystemCommunities } from '../utils/seedCommunities.js';
import { logger } from '../utils/logger.js';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure-ai-webui';
async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        logger.info('✅ Connected to MongoDB for seeding');
    }
    catch (error) {
        logger.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
}
const command = process.argv[2];
async function main() {
    try {
        // Connect to database (without auto-seeding)
        await connectToDatabase();
        switch (command) {
            case 'seed':
                console.log('🌱 Seeding system communities...');
                await seedSystemCommunities();
                console.log('✅ System communities seeded successfully!');
                break;
            case 'remove':
                console.log('🗑️  Removing system communities...');
                await removeSystemCommunities();
                console.log('✅ System communities removed successfully!');
                break;
            case 'reset':
                console.log('🔄 Resetting system communities...');
                await removeSystemCommunities();
                await seedSystemCommunities();
                console.log('✅ System communities reset successfully!');
                break;
            default:
                console.log(`
🌱 System Communities Seeder

Usage:
  npm run seed:communities seed    - Create system communities
  npm run seed:communities remove  - Remove system communities  
  npm run seed:communities reset   - Remove and recreate system communities

Examples:
  npm run seed:communities seed
  npm run seed:communities reset
        `);
                break;
        }
    }
    catch (error) {
        logger.error('❌ Seeder script failed:', error);
        console.error('❌ Error:', error);
        process.exit(1);
    }
    finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}
main();
//# sourceMappingURL=seedCommunities.js.map