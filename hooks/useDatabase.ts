import { useState, useCallback } from 'react'
import databaseService, { 
  DatabaseUser, 
  DatabaseOnboarding, 
  DatabaseCommunity, 
  DatabasePost 
} from '../lib/database'

export interface UseDatabaseReturn {
  // User management
  createUser: (userData: Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DatabaseUser | null>
  getUser: (userId: string) => Promise<DatabaseUser | null>
  updateUser: (userId: string, updates: Partial<DatabaseUser>) => Promise<DatabaseUser | null>
  deleteUser: (userId: string) => Promise<boolean>
  
  // Onboarding management
  createOnboarding: (onboardingData: Omit<DatabaseOnboarding, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DatabaseOnboarding | null>
  getOnboarding: (userId: string) => Promise<DatabaseOnboarding | null>
  updateOnboarding: (userId: string, updates: Partial<DatabaseOnboarding>) => Promise<DatabaseOnboarding | null>
  
  // Community management
  createCommunity: (communityData: Omit<DatabaseCommunity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DatabaseCommunity | null>
  getCommunities: () => Promise<DatabaseCommunity[] | null>
  getCommunity: (communityId: string) => Promise<DatabaseCommunity | null>
  updateCommunity: (communityId: string, updates: Partial<DatabaseCommunity>) => Promise<DatabaseCommunity | null>
  deleteCommunity: (communityId: string) => Promise<boolean>
  
  // Post management
  createPost: (postData: Omit<DatabasePost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DatabasePost | null>
  getPosts: (communityId?: string) => Promise<DatabasePost[] | null>
  getPost: (postId: string) => Promise<DatabasePost | null>
  updatePost: (postId: string, updates: Partial<DatabasePost>) => Promise<DatabasePost | null>
  deletePost: (postId: string) => Promise<boolean>
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Clear errors
  clearError: () => void
}

export const useDatabase = (): UseDatabaseReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // User management
  const createUser = useCallback(async (userData: Omit<DatabaseUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.createUser(userData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.getUser(userId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (userId: string, updates: Partial<DatabaseUser>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.updateUser(userId, updates)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await databaseService.deleteUser(userId)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Onboarding management
  const createOnboarding = useCallback(async (onboardingData: Omit<DatabaseOnboarding, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.createOnboarding(onboardingData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create onboarding'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getOnboarding = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.getOnboarding(userId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get onboarding'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateOnboarding = useCallback(async (userId: string, updates: Partial<DatabaseOnboarding>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.updateOnboarding(userId, updates)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update onboarding'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Community management
  const createCommunity = useCallback(async (communityData: Omit<DatabaseCommunity, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.createCommunity(communityData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create community'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCommunities = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.getCommunities()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get communities'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getCommunity = useCallback(async (communityId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.getCommunity(communityId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get community'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateCommunity = useCallback(async (communityId: string, updates: Partial<DatabaseCommunity>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.updateCommunity(communityId, updates)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update community'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteCommunity = useCallback(async (communityId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await databaseService.deleteCommunity(communityId)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete community'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Post management
  const createPost = useCallback(async (postData: Omit<DatabasePost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.createPost(postData)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getPosts = useCallback(async (communityId?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.getPosts(communityId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get posts'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getPost = useCallback(async (postId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.getPost(postId)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get post'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updatePost = useCallback(async (postId: string, updates: Partial<DatabasePost>) => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await databaseService.updatePost(postId, updates)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deletePost = useCallback(async (postId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      await databaseService.deletePost(postId)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post'
      setError(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    // User management
    createUser,
    getUser,
    updateUser,
    deleteUser,
    
    // Onboarding management
    createOnboarding,
    getOnboarding,
    updateOnboarding,
    
    // Community management
    createCommunity,
    getCommunities,
    getCommunity,
    updateCommunity,
    deleteCommunity,
    
    // Post management
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    
    // Loading states
    isLoading,
    error,
    
    // Clear errors
    clearError,
  }
} 