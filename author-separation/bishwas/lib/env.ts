// Environment configuration for the standalone bishwas project
export const env = {
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  
  // Database (if using local development)
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:./dev.db',
  
  // Authentication (mock for standalone)
  AUTH_SECRET: process.env.AUTH_SECRET || 'dev-secret-key',
  
  // File Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10MB',
  
  // Feature Flags
  ENABLE_REAL_TIME: process.env.ENABLE_REAL_TIME === 'true',
  ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES === 'true',
  
  // Development Settings
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
}

export default env
