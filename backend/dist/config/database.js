import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
import { seedSystemCommunities } from '../utils/seedCommunities.js';
const MONGODB_URI = process.env.MONGODB_URI;
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/secure-ai-webui';
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined. Please check your .env file.');
}
const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true }
};
export const connectDatabase = async () => {
    try {
        // Try connecting to MongoDB Atlas first
        await mongoose.connect(MONGODB_URI, clientOptions);
        // Test the connection with a ping
        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 });
        }
        logger.info('✅ MongoDB Atlas connected successfully');
        console.log("✅ Connected to MongoDB Atlas! Database:", mongoose.connection.name);
        // Seed system communities after successful connection
        await seedSystemCommunities();
    }
    catch (error) {
        logger.error('❌ MongoDB Atlas connection failed:', error);
        console.error('❌ MongoDB Atlas connection failed:', error);
        // In development, try local MongoDB as fallback
        if (process.env.NODE_ENV !== 'production') {
            try {
                logger.info('🔄 Attempting to connect to local MongoDB...');
                await mongoose.connect(LOCAL_MONGODB_URI);
                logger.info('✅ Connected to local MongoDB successfully');
                console.log("✅ Connected to local MongoDB! Database:", mongoose.connection.name);
                // Seed system communities after successful connection
                await seedSystemCommunities();
                return;
            }
            catch (localError) {
                logger.warn('❌ Local MongoDB connection also failed:', localError);
                console.log('💡 Install MongoDB locally or fix Atlas connection');
            }
        }
        // In production, exit the process
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        else {
            // In development, warn but continue
            logger.warn('⚠️ Continuing without database in development mode');
            console.log('💡 Make sure your MongoDB Atlas credentials are correct in .env file');
            console.log('💡 Or install MongoDB locally for development');
        }
    }
};
// Handle connection events
mongoose.connection.on('connected', () => {
    logger.info('📦 Mongoose connected to MongoDB Atlas');
    console.log('📦 Mongoose connected to MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
    logger.error('❌ MongoDB connection error:', err);
    console.error('❌ MongoDB connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️ MongoDB disconnected');
    console.log('⚠️ MongoDB disconnected');
});
// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('📴 MongoDB connection closed through app termination');
        console.log('📴 MongoDB connection closed through app termination');
        process.exit(0);
    }
    catch (error) {
        logger.error('Error during database disconnection:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=database.js.map