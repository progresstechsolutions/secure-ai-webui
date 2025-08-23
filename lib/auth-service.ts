import { config, endpoints } from './config'

export interface AuthUser {
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
  token?: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  username: string
  password: string
  name?: string
  healthConditions?: string[]
  location?: {
    region: string
    state?: string
  }
}

export interface AuthResponse {
  user: AuthUser
  token: string
  message?: string
}

class AuthService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.api.baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    console.log('🔐 Auth Request:', { url, method: options.method || 'GET' })
    
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

      console.log('📡 Auth Response:', { status: response.status, ok: response.ok })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Authentication failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      return response.json()
    } catch (error) {
      console.error('❌ Auth Error:', error)
      throw error
    }
  }

  // Sign up new user
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    return this.request<AuthResponse>(endpoints.auth.signup, {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Sign in existing user
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>(endpoints.auth.signin, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // Sign out user
  async signOut(): Promise<{ message: string }> {
    return this.request<{ message: string }>(endpoints.auth.signout, {
      method: 'POST',
    })
  }

  // Verify user token
  async verifyToken(token: string): Promise<AuthUser> {
    return this.request<AuthUser>(endpoints.auth.verify, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Get current user profile
  async getCurrentUser(token: string): Promise<AuthUser> {
    return this.request<AuthUser>(endpoints.user.replace(':id', 'me'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  // Update user profile
  async updateProfile(token: string, updates: Partial<AuthUser>): Promise<AuthUser> {
    return this.request<AuthUser>(endpoints.user.replace(':id', 'me'), {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('auth_token')
    return !!token
  }

  // Get stored auth token
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  // Store auth token
  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  }

  // Remove auth token
  removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  }

  // Get stored user data
  getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('auth_user')
    return userData ? JSON.parse(userData) : null
  }

  // Store user data
  setUser(user: AuthUser): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_user', JSON.stringify(user))
  }

  // Remove user data
  removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_user')
  }

  // Clear all auth data
  clearAuth(): void {
    this.removeToken()
    this.removeUser()
  }
}

export const authService = new AuthService()
export default authService 