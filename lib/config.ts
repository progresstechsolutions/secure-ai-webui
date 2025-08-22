export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://secure-ai-production.up.railway.app',
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
  upload: '/upload-and-ask',
  chat: '/vllm-stream-chat',
  health: '/health',
  documents: '/documents',
  summarize: '/summarize',
} as const 