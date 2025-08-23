export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://secure-ai-production.up.railway.app',
    timeout: 30000, // 30 seconds
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  },
  chat: {
    maxTokens: 4000,
    temperature: 0.7,
  }
}

export const endpoints = {
  // Document & AI endpoints
  upload: '/upload-and-ask',
  chat: '/vllm-stream-chat',
  health: '/health',
  documents: '/documents',
  summarize: '/summarize',
  
  // User management endpoints
  users: '/users',
  user: '/users/:id',
  userProfile: '/users/:id/profile',
  userOnboarding: '/users/:id/onboarding',
  
  // Community endpoints
  communities: '/communities',
  community: '/communities/:id',
  communityMembers: '/communities/:id/members',
  communityPosts: '/communities/:id/posts',
  
  // Post endpoints
  posts: '/posts',
  post: '/posts/:id',
  postComments: '/posts/:id/comments',
  
  // Authentication endpoints
  auth: {
    signup: '/auth/signup',
    signin: '/auth/signin',
    signout: '/auth/signout',
    verify: '/auth/verify',
  }
} as const 