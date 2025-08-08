import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined. Please check your .env file.');
}
const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true }
};
export const connectDatabase = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(MONGODB_URI, clientOptions);
        // Test the connection with a ping
        if (mongoose.connection.db) {
            await mongoose.connection.db.admin().command({ ping: 1 });
        }
        logger.info('✅ MongoDB Atlas connected successfully');
        console.log("✅ Connected to MongoDB Atlas! Database:", mongoose.connection.name);
    }
    catch (error) {
        logger.error('❌ MongoDB Atlas connection failed:', error);
        console.error('❌ MongoDB Atlas connection failed:', error);
        // In production, exit the process
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        else {
            // In development, warn but continue
            logger.warn('⚠️ Continuing without database in development mode');
            console.log('💡 Make sure your MongoDB Atlas credentials are correct in .env file');
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