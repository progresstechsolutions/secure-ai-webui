"use client"

import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { ChatMessage } from '../lib/api'

export default function ApiTest() {
  const [file, setFile] = useState<File | null>(null)
  const [question, setQuestion] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingResponse, setStreamingResponse] = useState('')
  
  const {
    uploadAndAsk,
    isUploading,
    uploadError,
    streamChat,
    isChatting,
    chatError,
    healthCheck,
    isHealthy,
    clearErrors,
  } = useApi()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !question) return
    
    clearErrors()
    const result = await uploadAndAsk(file, question)
    if (result) {
      alert(`Upload successful! ${result.message}`)
      setQuestion('')
      setFile(null)
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    }
    
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setChatInput('')
    setStreamingResponse('')
    
    await streamChat(
      newMessages,
      (chunk) => {
        setStreamingResponse(prev => prev + chunk)
      },
      () => {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: streamingResponse,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, assistantMessage])
        setStreamingResponse('')
      }
    )
  }

  const handleHealthCheck = async () => {
    await healthCheck()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Secure AI API Test
      </h1>
      
      {/* Health Check */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Backend Health Check</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleHealthCheck}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Health
          </button>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            {isHealthy === null ? (
              <span className="text-gray-500">Not checked</span>
            ) : isHealthy ? (
              <span className="text-green-500">✅ Healthy</span>
            ) : (
              <span className="text-red-500">❌ Unhealthy</span>
            )}
          </div>
        </div>
      </div>

      {/* Document Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Document Upload & Question</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the document..."
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || !question || isUploading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload & Ask'}
          </button>
          {uploadError && (
            <div className="text-red-500 text-sm">{uploadError}</div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">AI Chat</h2>
        <div className="space-y-4">
          {/* Messages Display */}
          <div className="border border-gray-200 rounded p-4 h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 p-3 rounded ${
                  msg.role === 'user'
                    ? 'bg-blue-100 ml-8'
                    : 'bg-gray-100 mr-8'
                }`}
              >
                <div className="font-medium text-sm mb-1">
                  {msg.role === 'user' ? 'You' : 'AI'}
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
            {streamingResponse && (
              <div className="mb-3 p-3 rounded bg-gray-100 mr-8">
                <div className="font-medium text-sm mb-1">AI</div>
                <div>{streamingResponse}...</div>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded"
              onKeyPress={(e) => e.key === 'Enter' && handleChat()}
            />
            <button
              onClick={handleChat}
              disabled={!chatInput.trim() || isChatting}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {isChatting ? 'Sending...' : 'Send'}
            </button>
          </div>
          {chatError && (
            <div className="text-red-500 text-sm">{chatError}</div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {(uploadError || chatError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Errors</h3>
          {uploadError && (
            <div className="text-red-700 mb-2">
              <strong>Upload Error:</strong> {uploadError}
            </div>
          )}
          {chatError && (
            <div className="text-red-700">
              <strong>Chat Error:</strong> {chatError}
            </div>
          )}
          <button
            onClick={clearErrors}
            className="mt-3 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
          >
            Clear Errors
          </button>
        </div>
      )}
    </div>
  )
} 