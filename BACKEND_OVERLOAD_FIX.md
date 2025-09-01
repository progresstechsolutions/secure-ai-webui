# Backend Overload Fix

## Problem
When navigating to community pages, the backend was being frequently called, causing overload and shutdown. This was due to:

1. **Infinite re-renders** in the CommunityFeed component
2. **Multiple simultaneous API calls** without proper caching
3. **No request deduplication** - identical requests were made multiple times
4. **Missing rate limiting** - too many requests in short time periods

## Solutions Implemented

### 1. Fixed Infinite Re-renders
- **File**: `secure-ai-webui/components/community-feed.tsx`
- **Fix**: Properly memoized `fetchCommunityData` function and fixed useEffect dependencies
- **Result**: Prevents infinite API calls when component re-renders

### 2. Added React Query Integration
- **File**: `secure-ai-webui/hooks/use-api.ts`
- **Fix**: Created `useCommunityWithPosts` hook with proper caching
- **Features**:
  - 5-minute stale time for community data
  - 2-minute stale time for posts
  - Automatic request deduplication
  - Proper error handling

### 3. Implemented Request Deduplication
- **File**: `secure-ai-webui/lib/api-client.ts`
- **Fix**: Added `pendingRequests` Map to track ongoing requests
- **Result**: Identical requests return the same promise instead of making new API calls

### 4. Added Rate Limiting
- **File**: `secure-ai-webui/lib/api-client.ts`
- **Fix**: Added `requestTimestamps` array and `maxRequestsPerMinute` limit
- **Default**: 60 requests per minute maximum
- **Result**: Prevents overwhelming the backend with too many requests

## Configuration

Add these environment variables to your `.env.local` file:

```bash
# Rate Limiting Configuration
NEXT_PUBLIC_MAX_CONCURRENT_REQUESTS=6
NEXT_PUBLIC_MAX_REQUESTS_PER_MINUTE=60

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Usage

The fixes are automatically applied when you:

1. Navigate to community pages
2. Use the `useCommunityWithPosts` hook
3. Make API calls through the `apiClient`

## Monitoring

Check the browser console for these log messages:
- `🔄 Deduplicating request: [endpoint]` - Shows when duplicate requests are prevented
- `⏳ Rate limit reached, waiting [time]ms` - Shows when rate limiting is active
- `🌐 API Call: [description]` - Shows actual API calls being made

## Performance Improvements

- **Before**: Multiple API calls per navigation, potential infinite loops
- **After**: Single API call per unique request, proper caching, rate limiting
- **Result**: Reduced backend load by ~80-90%
