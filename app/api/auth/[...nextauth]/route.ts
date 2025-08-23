import { handlers } from "../../../../lib/auth"

export async function GET(request: Request) {
  try {
    return handlers.GET(request)
  } catch (error) {
    console.error("NextAuth GET error:", error)
    return new Response(JSON.stringify({ error: "Authentication service unavailable" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: Request) {
  try {
    return handlers.POST(request)
  } catch (error) {
    console.error("NextAuth POST error:", error)
    return new Response(JSON.stringify({ error: "Authentication service unavailable" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Force Node.js runtime to avoid Edge Runtime compatibility issues
export const runtime = 'nodejs'
