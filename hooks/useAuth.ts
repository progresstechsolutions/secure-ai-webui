import { useState, useCallback, useEffect } from 'react'
import authService, { AuthUser, SignInCredentials, SignUpData } from '../lib/auth-service'

export interface UseAuthReturn {
  // User state
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Authentication methods
  signIn: (credentials: SignInCredentials) => Promise<boolean>
  signUp: (userData: SignUpData) => Promise<boolean>
  signOut: () => Promise<void>
  
  // User management
  updateProfile: (updates: Partial<AuthUser>) => Promise<boolean>
  refreshUser: () => Promise<void>
  
  // Utility methods
  clearError: () => void
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken()
        if (token) {
          const userData = authService.getUser()
          if (userData) {
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            // Try to verify token and get user data
            try {
              const verifiedUser = await authService.verifyToken(token)
              setUser(verifiedUser)
              setIsAuthenticated(true)
              authService.setUser(verifiedUser)
            } catch (error) {
              // Token is invalid, clear auth
              authService.clearAuth()
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        authService.clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signIn = useCallback(async (credentials: SignInCredentials): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await authService.signIn(credentials)
      
      // Store auth data
      authService.setToken(response.token)
      authService.setUser(response.user)
      
      // Update state
      setUser(response.user)
      setIsAuthenticated(true)
      
      console.log('✅ Sign in successful:', response.user.email)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      setError(errorMessage)
      console.error('❌ Sign in error:', errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (userData: SignUpData): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await authService.signUp(userData)
      
      // Store auth data
      authService.setToken(response.token)
      authService.setUser(response.user)
      
      // Update state
      setUser(response.user)
      setIsAuthenticated(true)
      
      console.log('✅ Sign up successful:', response.user.email)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed'
      setError(errorMessage)
      console.error('❌ Sign up error:', errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = authService.getToken()
      if (token) {
        await authService.signOut()
      }
      
      // Clear auth data
      authService.clearAuth()
      
      // Update state
      setUser(null)
      setIsAuthenticated(false)
      
      console.log('✅ Sign out successful')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed'
      setError(errorMessage)
      console.error('❌ Sign out error:', errorMessage)
      
      // Force clear auth even if API call fails
      authService.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (updates: Partial<AuthUser>): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const token = authService.getToken()
      if (!token) {
        setError('No authentication token found')
        return false
      }
      
      const updatedUser = await authService.updateProfile(token, updates)
      
      // Update stored user data
      authService.setUser(updatedUser)
      
      // Update state
      setUser(updatedUser)
      
      console.log('✅ Profile update successful')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
      setError(errorMessage)
      console.error('❌ Profile update error:', errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const token = authService.getToken()
      if (!token) return
      
      const currentUser = await authService.getCurrentUser(token)
      authService.setUser(currentUser)
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      // If refresh fails, user might be logged out
      authService.clearAuth()
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser,
    clearError,
  }
} 