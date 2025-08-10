import dotenv from 'dotenv';
import path from 'path';
// Load environment variables first - specify the path to .env file
dotenv.config({ path: path.join(process.cwd(), '.env') });
// Debug: Log environment variables
console.log('Current working directory:', process.cwd());
console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'YES' : 'NO');
console.log('PORT loaded:', process.env.PORT ? 'YES' : 'NO');
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'express-async-errors';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { corsOptions } from './config/cors.js';
import { rateLimitConfig } from './config/rateLimit.js';
// Routes
import communityRoutes from './routes/community.js';
import postRoutes from './routes/posts.js';
import friendRoutes from './routes/friends.js';
import messageRoutes from './routes/messages.js';
import uploadRoutes from './routes/upload.js';
import searchRoutes from './routes/search.js';
// Socket handlers
import { initializeSocket } from './socket/socketHandler.js';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: corsOptions
});
const PORT = process.env.PORT || 5000;
// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
// Rate limiting
app.use(rateLimit(rateLimitConfig));
// CORS
app.use(cors(corsOptions));
// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Static files
app.use('/uploads', express.static('uploads'));
// API Routes
app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
// Health check endpoints
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Error handling
app.use(errorHandler);
// Socket initialization
initializeSocket(io);
// Connect to database and start server
const startServer = async () => {
    try {
        // Import database connection after env vars are loaded
        const { connectDatabase } = await import('./config/database.js');
        await connectDatabase();
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        logger.error('Failed to start server:', error);
        // Still start the server even if DB connection fails
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT} (without database)`);
            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🚀 Server running on http://localhost:${PORT} (without database)`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    }
};
startServer();
export { app, io };
//# sourceMappingURL=server.js.map