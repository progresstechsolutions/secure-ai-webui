import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    // Validate that the URL is from our backend
    const allowedOrigins = [
      'http://localhost:5000',
      'http://127.0.0.1:5000',
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', ''),
    ].filter(Boolean)

    const urlOrigin = new URL(imageUrl).origin
    if (!allowedOrigins.includes(urlOrigin)) {
      console.warn('🚨 Blocked unauthorized origin:', urlOrigin)
      return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 })
    }

    console.log('🖼️ Proxying image request:', imageUrl)

    // Fetch the image from the backend
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'NextJS-Image-Proxy/1.0',
      },
    })

    if (!response.ok) {
      console.error('❌ Failed to fetch image:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` }, 
        { status: response.status }
      )
    }

    // Get the image data and content type
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    console.log('✅ Image fetched successfully:', {
      url: imageUrl,
      contentType,
      size: imageBuffer.byteLength
    })

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('❌ Image proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy image' }, 
      { status: 500 }
    )
  }
}
