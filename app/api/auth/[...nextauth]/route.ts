// Conditional import to avoid build issues
let handlers: any

try {
  handlers = require("../../../../lib/auth").handlers
} catch (error) {
  console.log("NextAuth handlers not available during build")
}

export async function GET(request: Request) {
  if (handlers?.GET) {
    return handlers.GET(request)
  }
  return new Response('Auth not initialized', { status: 503 })
}

export async function POST(request: Request) {
  if (handlers?.POST) {
    return handlers.POST(request)
  }
  return new Response('Auth not initialized', { status: 503 })
}

// Force Node.js runtime to avoid Edge Runtime compatibility issues
export const runtime = 'nodejs'
