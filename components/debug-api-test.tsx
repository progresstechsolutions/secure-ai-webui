'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'

export default function DebugApiTest() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testCommentCreation = async () => {
    setIsLoading(true)
    setTestResult('Testing...')
    
    try {
      console.log('🧪 Starting API test...')
      
      // First, get a real post ID
      const postsResponse = await apiClient.getPosts()
      console.log('📋 Posts response:', postsResponse)
      
      if (postsResponse.data && postsResponse.data.posts && postsResponse.data.posts.length > 0) {
        const testPostId = postsResponse.data.posts[0]._id
        console.log('🎯 Using post ID:', testPostId)
        
        // Now try to create a comment
        const commentResponse = await apiClient.createComment({
          content: 'Debug test comment - anonymous',
          postId: testPostId,
          parentCommentId: undefined,
          isAnonymous: true
        })
        
        console.log('💬 Comment response:', commentResponse)
        
        if (commentResponse.data) {
          setTestResult(`✅ SUCCESS: Comment created successfully!\nComment ID: ${commentResponse.data._id}`)
        } else if (commentResponse.error) {
          setTestResult(`❌ API ERROR: ${commentResponse.error}`)
        } else {
          setTestResult(`⚠️ UNKNOWN: Response received but no data or error: ${JSON.stringify(commentResponse)}`)
        }
      } else {
        setTestResult('❌ NO POSTS: Could not find any posts to test with')
      }
    } catch (error) {
      console.error('🚨 Test failed:', error)
      setTestResult(`❌ EXCEPTION: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">API Debug Test</h3>
      <button
        onClick={testCommentCreation}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Comment API'}
      </button>
      {testResult && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs whitespace-pre-wrap">
          {testResult}
        </div>
      )}
    </div>
  )
}
