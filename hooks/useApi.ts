import { useState, useCallback } from 'react'
import apiService, { UploadResponse, ChatMessage, Document } from '../lib/api'

export interface UseApiReturn {
  // Upload and ask
  uploadAndAsk: (file: File, question: string) => Promise<UploadResponse | null>
  isUploading: boolean
  uploadError: string | null
  
  // Chat
  streamChat: (
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => Promise<void>
  isChatting: boolean
  chatError: string | null
  
  // Documents
  getDocuments: () => Promise<Document[] | null>
  getDocument: (id: string) => Promise<Document | null>
  isDocumentsLoading: boolean
  documentsError: string | null
  
  // Health check
  healthCheck: () => Promise<boolean>
  isHealthy: boolean | null
  
  // Clear errors
  clearErrors: () => void
}

export const useApi = (): UseApiReturn => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  const [isChatting, setIsChatting] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false)
  const [documentsError, setDocumentsError] = useState<string | null>(null)
  
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)

  const uploadAndAsk = useCallback(async (file: File, question: string) => {
    try {
      setIsUploading(true)
      setUploadError(null)
      const result = await apiService.uploadAndAsk(file, question)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const streamChat = useCallback(async (
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => {
    try {
      setIsChatting(true)
      setChatError(null)
      
      await apiService.streamChat(
        messages,
        onChunk,
        onComplete,
        (error: string) => setChatError(error)
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Chat failed'
      setChatError(errorMessage)
    } finally {
      setIsChatting(false)
    }
  }, [])

  const getDocuments = useCallback(async () => {
    try {
      setIsDocumentsLoading(true)
      setDocumentsError(null)
      const documents = await apiService.getDocuments()
      return documents
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch documents'
      setDocumentsError(errorMessage)
      return null
    } finally {
      setIsDocumentsLoading(false)
    }
  }, [])

  const getDocument = useCallback(async (id: string) => {
    try {
      setIsDocumentsLoading(true)
      setDocumentsError(null)
      const document = await apiService.getDocument(id)
      return document
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch document'
      setDocumentsError(errorMessage)
      return null
    } finally {
      setIsDocumentsLoading(false)
    }
  }, [])

  const healthCheck = useCallback(async () => {
    try {
      const result = await apiService.healthCheck()
      const healthy = result.status === 'ok'
      setIsHealthy(healthy)
      return healthy
    } catch (error) {
      setIsHealthy(false)
      return false
    }
  }, [])

  const clearErrors = useCallback(() => {
    setUploadError(null)
    setChatError(null)
    setDocumentsError(null)
  }, [])

  return {
    uploadAndAsk,
    isUploading,
    uploadError,
    streamChat,
    isChatting,
    chatError,
    getDocuments,
    getDocument,
    isDocumentsLoading,
    documentsError,
    healthCheck,
    isHealthy,
    clearErrors,
  }
} 