import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import Tesseract from 'tesseract.js'
import formidable from 'formidable'

// Polyfills for Node.js environment
if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(matrix?: string | number[]) {
      if (matrix) {
        // Simple implementation for Node.js
        this.a = 1; this.b = 0; this.c = 0; this.d = 1;
        this.e = 0; this.f = 0;
      }
    }
    a: number = 1;
    b: number = 0;
    c: number = 0;
    d: number = 1;
    e: number = 0;
    f: number = 0;
  } as any;
}

if (typeof globalThis.DOMPoint === 'undefined') {
  globalThis.DOMPoint = class DOMPoint {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = x; this.y = y; this.z = z; this.w = w;
    }
    x: number = 0;
    y: number = 0;
    z: number = 0;
    w: number = 1;
  } as any;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUMMARIES_PATH = path.resolve(process.cwd(), 'summaries.json')

// Helper to extract text from PDF buffer using pdf-parse
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('Attempting to extract text from PDF, buffer size:', buffer.length)
    
    // Check if buffer looks like a PDF
    const header = buffer.toString('ascii', 0, 8)
    console.log('PDF header:', header)
    
    if (!header.startsWith('%PDF')) {
      console.error('Buffer does not appear to be a valid PDF')
      return ''
    }
    
    const data = await pdfParse(buffer, {
      // Add options for better text extraction
      max: 0, // No page limit
      version: 'v2.0.550'
    })
    
    const extractedText = data.text.trim()
    console.log('Successfully extracted text, length:', extractedText.length)
    console.log('Text preview:', extractedText.substring(0, 100))
    return extractedText
  } catch (err) {
    console.error('Error extracting text from PDF:', err)
    return ''
  }
}

// Helper to extract text from PDF buffer using OCR (tesseract.js)
async function extractTextFromPDFWithOCR(buffer: Buffer): Promise<string> {
  // For now, return empty string to avoid complex PDF rendering issues
  // This can be enhanced later with a simpler PDF-to-image conversion
  console.log('OCR extraction temporarily disabled due to Node.js compatibility issues')
  return ''
}

async function getSummaryFromOpenAI(content: string): Promise<string> {
  console.log('Starting OpenAI API call...')
  console.log('OpenAI API key exists:', !!OPENAI_API_KEY)
  
  // Limit input to 8000 characters (about 2000 tokens)
  const MAX_CHARS = 8000;
  const safeContent = content.length > MAX_CHARS ? content.slice(0, MAX_CHARS) : content;
  const prompt = `Summarize the following healthcare document for a parent in clear, simple language.\n\n${safeContent}`;
  
  console.log('Content length:', content.length)
  console.log('Safe content length:', safeContent.length)
  
  const requestBody = {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant that summarizes healthcare documents for parents.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 400,
    temperature: 0.5,
  }
  
  console.log('Making OpenAI API request...')
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  })
  
  console.log('OpenAI response status:', response.status)
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API response error:', errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json()
  console.log('OpenAI response data:', data)
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error('Unexpected OpenAI response format:', data)
    throw new Error('Invalid response format from OpenAI API');
  }
  
  const summary = data.choices[0].message.content.trim()
  console.log('Generated summary length:', summary.length)
  return summary
}

function readSummaries(): Record<string, string> {
  if (!fs.existsSync(SUMMARIES_PATH)) return {}
  const raw = fs.readFileSync(SUMMARIES_PATH, 'utf-8')
  return JSON.parse(raw)
}

function writeSummaries(summaries: Record<string, string>) {
  fs.writeFileSync(SUMMARIES_PATH, JSON.stringify(summaries, null, 2), 'utf-8')
}

export const config = {
  api: {
    bodyParser: false, // We'll handle file uploads as raw buffers
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Support both file uploads (PDF) and text content
  let documentId = ''
  let content = ''
  let isPDF = false
  let pdfBuffer: Buffer | null = null

  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    // Handle file upload (PDF)
    try {
      const form = formidable({ 
        multiples: false,
        keepExtensions: true,
        uploadDir: process.cwd() + '/tmp',
        maxFileSize: 50 * 1024 * 1024 // 50MB
      })
      
      const { fields, files } = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
        form.parse(req, (err: any, fields: any, files: any) => {
          if (err) return reject(err)
          resolve({ fields, files })
        })
      })
      
      console.log('Formidable parsed fields:', fields)
      console.log('Formidable parsed files:', files)
      
      documentId = fields.documentId || ''
      isPDF = true
      const fileArray = files.file
      if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
        throw new Error('No file uploaded')
      }
      
      const file = fileArray[0] // Get the first file from the array
      console.log('File object:', file)
      console.log('File path:', file.filepath)
      
      if (!file.filepath) {
        throw new Error('File path is undefined')
      }
      
      pdfBuffer = fs.readFileSync(file.filepath)
      console.log('Successfully read file, buffer size:', pdfBuffer.length)
      
    } catch (uploadError) {
      console.error('File upload error:', uploadError)
      return res.status(400).json({ error: `File upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}` })
    }
  } else {
    // Handle JSON body (text or base64 PDF)
    // Parse JSON body manually since bodyParser is disabled
    let body: any = {}
    try {
      const chunks: Buffer[] = []
      req.on('data', (chunk: Buffer) => chunks.push(chunk))
      await new Promise<void>((resolve, reject) => {
        req.on('end', () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf8')
            body = JSON.parse(rawBody)
            resolve()
          } catch (err) {
            reject(err)
          }
        })
        req.on('error', reject)
      })
    } catch (err) {
      console.error('Error parsing JSON body:', err)
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
    
    documentId = body.documentId || ''
    content = body.content || ''
    if (body.isPDF && body.pdfBase64) {
      isPDF = true
      pdfBuffer = Buffer.from(body.pdfBase64, 'base64')
    }
  }

  // Validate required fields
  if (!documentId) {
    return res.status(400).json({ error: 'documentId is required' })
  }

  let summaries = readSummaries()
  if (summaries[documentId]) {
    return res.status(200).json({ summary: summaries[documentId], cached: true })
  }

  try {
    let textToSummarize = content
    console.log('Processing document:', { documentId, isPDF, hasPdfBuffer: !!pdfBuffer, contentLength: content.length })
    
    if (isPDF && pdfBuffer) {
      console.log('Processing PDF file, buffer size:', pdfBuffer.length)
      
      // Save PDF buffer to a temporary file for debugging
      const tempPdfPath = path.join(process.cwd(), 'temp_upload.pdf')
      fs.writeFileSync(tempPdfPath, pdfBuffer)
      console.log('Saved PDF to temp file:', tempPdfPath)
      
      // Try pdf-parse first
      textToSummarize = await extractTextFromPDF(pdfBuffer)
      console.log('PDF text extraction result length:', textToSummarize.length)
      console.log('PDF text preview:', textToSummarize.substring(0, 200))
      
      // If too short, try OCR
      if (!textToSummarize || textToSummarize.length < 100) {
        console.log('Text too short, attempting OCR...')
        textToSummarize = await extractTextFromPDFWithOCR(pdfBuffer)
        console.log('OCR result length:', textToSummarize.length)
      }
      
      if (!textToSummarize || textToSummarize.length === 0) {
        console.log('No text extracted, using fallback message')
        textToSummarize = 'Unable to extract text from PDF. The document may be image-based or password-protected.'
      }
      
      // Clean up temp file
      try {
        fs.unlinkSync(tempPdfPath)
      } catch (err) {
        console.log('Could not delete temp file:', err)
      }
    }
    
    console.log('Final text to summarize length:', textToSummarize.length)
    console.log('Text preview:', textToSummarize.substring(0, 200) + '...')
    
    if (!textToSummarize || textToSummarize.length === 0) {
      console.error('No text extracted from PDF')
      return res.status(400).json({ error: 'No text could be extracted from the PDF. The document may be image-based or password-protected.' })
    }
    
    // If the text is just the fallback message, provide a basic summary
    if (textToSummarize === 'Unable to extract text from PDF. The document may be image-based or password-protected.') {
      console.log('Using fallback summary for unreadable PDF')
      const fallbackSummary = 'This PDF document could not be read automatically. It may be image-based, password-protected, or in a format that requires manual review. Please review the document manually for important healthcare information.'
      summaries[documentId] = fallbackSummary
      writeSummaries(summaries)
      return res.status(200).json({ summary: fallbackSummary, cached: false })
    }
    
    try {
      const summary = await getSummaryFromOpenAI(textToSummarize)
      console.log('AI summary generated successfully:', summary.substring(0, 100) + '...')
      summaries[documentId] = summary
      writeSummaries(summaries)
      return res.status(200).json({ summary, cached: false })
    } catch (aiError) {
      console.error('AI summary generation failed:', aiError)
      return res.status(500).json({ error: 'Failed to generate AI summary. Please try again.' })
    }
  } catch (err) {
    console.error('AI Summary Error:', err)
    return res.status(500).json({ error: 'Failed to generate summary' })
  }
} 