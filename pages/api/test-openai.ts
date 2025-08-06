import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text } = req.body

  if (!text) {
    return res.status(400).json({ error: 'Text is required' })
  }

  try {
    console.log('Testing OpenAI API with text:', text.substring(0, 100))
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Summarize this text in one sentence: ${text}` },
        ],
        max_tokens: 100,
        temperature: 0.5,
      }),
    })

    console.log('OpenAI response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      return res.status(500).json({ 
        error: 'OpenAI API failed', 
        details: errorText,
        status: response.status 
      })
    }

    const data = await response.json()
    console.log('OpenAI response:', data)

    return res.status(200).json({
      success: true,
      summary: data.choices[0].message.content,
      usage: data.usage
    })

  } catch (error) {
    console.error('Test OpenAI error:', error)
    return res.status(500).json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 