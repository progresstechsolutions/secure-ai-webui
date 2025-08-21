import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  const hasKey = !!openaiKey
  const keyLength = openaiKey ? openaiKey.length : 0
  const keyPreview = openaiKey ? `${openaiKey.substring(0, 10)}...` : 'none'

  return res.status(200).json({
    hasOpenAIKey: hasKey,
    keyLength,
    keyPreview,
    envVars: {
      NODE_ENV: process.env.NODE_ENV,
      OPENAI_API_KEY: hasKey ? 'present' : 'missing'
    }
  })
} 