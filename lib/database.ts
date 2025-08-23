import { config, endpoints } from './config'

// Types for database entities
export interface DatabaseUser {
  id: string
  email: string
  username: string
  name?: string
  image?: string
  healthConditions: string[]
  location: {
    region: string
    state?: string
  }
  createdAt: string
  updatedAt: string
}

export interface DatabaseOnboarding {
  id: string
  userId: string
  completed: boolean
  data: {
    age?: number
    gender?: string
    conditions?: string[]
    preferences?: string[]
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export interface DatabaseCommunity {
  id: string
  name: string
  description: string
  creatorId: string
  members: string[]
  posts: string[]
  createdAt: string
  updatedAt: string
}

export interface DatabasePost {
  id: string
  communityId: string
  authorId: string
  content: string
  title?: string
  likes: string[]
  comments: string[]
  createdAt: string
  updatedAt: string
}

class DatabaseService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.api.baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    console.log('🗄️ Database Request:', { url, method: options.method || 'GET' })
    
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

      console.log('📡 Database Response:', { status: response.status, ok: response.ok })

      if (!response.ok) {
        throw new Error(`Database request failed: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error('❌ Database Error:', error)
      throw error
    }
  }

  // User Management
  async createUser(userData: Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseUser> {
    return this.request<DatabaseUser>(endpoints.users, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getUser(userId: string): Promise<DatabaseUser> {
    return this.request<DatabaseUser>(endpoints.user.replace(':id', userId))
  }

  async updateUser(userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser> {
    return this.request<DatabaseUser>(endpoints.user.replace(':id', userId), {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request<void>(endpoints.user.replace(':id', userId), {
      method: 'DELETE',
    })
  }

  // Onboarding Management
  async createOnboarding(onboardingData: Omit<DatabaseOnboarding, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseOnboarding> {
    return this.request<DatabaseOnboarding>(endpoints.userOnboarding.replace(':id', onboardingData.userId), {
      method: 'POST',
      body: JSON.stringify(onboardingData),
    })
  }

  async getOnboarding(userId: string): Promise<DatabaseOnboarding | null> {
    try {
      return await this.request<DatabaseOnboarding>(endpoints.userOnboarding.replace(':id', userId))
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async updateOnboarding(userId: string, updates: Partial<DatabaseOnboarding>): Promise<DatabaseOnboarding> {
    return this.request<DatabaseOnboarding>(endpoints.userOnboarding.replace(':id', userId), {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  // Community Management
  async createCommunity(communityData: Omit<DatabaseCommunity, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseCommunity> {
    return this.request<DatabaseCommunity>(endpoints.communities, {
      method: 'POST',
      body: JSON.stringify(communityData),
    })
  }

  async getCommunities(): Promise<DatabaseCommunity[]> {
    return this.request<DatabaseCommunity[]>(endpoints.communities)
  }

  async getCommunity(communityId: string): Promise<DatabaseCommunity> {
    return this.request<DatabaseCommunity>(endpoints.community.replace(':id', communityId))
  }

  async updateCommunity(communityId: string, updates: Partial<DatabaseCommunity>): Promise<DatabaseCommunity> {
    return this.request<DatabaseCommunity>(endpoints.community.replace(':id', communityId), {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteCommunity(communityId: string): Promise<void> {
    return this.request<void>(endpoints.community.replace(':id', communityId), {
      method: 'DELETE',
    })
  }

  // Post Management
  async createPost(postData: Omit<DatabasePost, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabasePost> {
    return this.request<DatabasePost>(endpoints.posts, {
      method: 'POST',
      body: JSON.stringify(postData),
    })
  }

  async getPosts(communityId?: string): Promise<DatabasePost[]> {
    const endpoint = communityId 
      ? endpoints.communityPosts.replace(':id', communityId)
      : endpoints.posts
    return this.request<DatabasePost[]>(endpoint)
  }

  async getPost(postId: string): Promise<DatabasePost> {
    return this.request<DatabasePost>(endpoints.post.replace(':id', postId))
  }

  async updatePost(postId: string, updates: Partial<DatabasePost>): Promise<DatabasePost> {
    return this.request<DatabasePost>(endpoints.post.replace(':id', postId), {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deletePost(postId: string): Promise<void> {
    return this.request<void>(endpoints.post.replace(':id', postId), {
      method: 'DELETE',
    })
  }

  // Utility methods
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health')
  }
}

export const databaseService = new DatabaseService()
export default databaseService 