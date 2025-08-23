import { config, endpoints } from './config'

export interface UploadResponse {
  message: string
  document_id?: string
  summary?: string
  error?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatResponse {
  message: string
  error?: string
}

export interface Document {
  id: string
  filename: string
  content?: string
  summary?: string
  uploaded_at: string
  file_size: number
  file_type: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.api.baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    console.log('🌐 API Request:', { url, baseUrl: this.baseUrl, endpoint })
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      })

      console.log('📡 API Response:', { status: response.status, ok: response.ok })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('❌ API Error:', error)
      throw error
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    console.log('🏥 Health check requested')
    const result = await this.request<{ status: string }>(endpoints.health)
    console.log('🏥 Health check result:', result)
    return result
  }

  // Upload document and ask question
  async uploadAndAsk(
    file: File,
    question: string
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('question', question)

    const response = await fetch(`${this.baseUrl}${endpoints.upload}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Stream chat with AI
  async streamChat(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoints.chat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: config.chat.maxTokens,
          temperature: config.chat.temperature,
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          onComplete()
          break
        }

        const chunk = decoder.decode(value)
        onChunk(chunk)
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Get documents list
  async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>(endpoints.documents)
  }

  // Get document by ID
  async getDocument(id: string): Promise<Document> {
    return this.request<Document>(`${endpoints.documents}/${id}`)
  }

  // Summarize document
  async summarizeDocument(
    documentId: string,
    question?: string
  ): Promise<{ summary: string }> {
    const body: any = { document_id: documentId }
    if (question) {
      body.question = question
    }

    return this.request<{ summary: string }>(endpoints.summarize, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }
}

export const apiService = new ApiService()
export default apiService 