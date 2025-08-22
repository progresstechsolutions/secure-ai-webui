// Temporarily disabled for build testing
export async function GET() {
  return new Response('Auth disabled', { status: 501 })
}

export async function POST() {
  return new Response('Auth disabled', { status: 501 })
}
