import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({ multiples: false })
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    })

    const file = files.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const buffer = fs.readFileSync(file.filepath)
    console.log('File size:', buffer.length)
    console.log('File header:', buffer.toString('ascii', 0, 20))

    try {
      const data = await pdfParse(buffer)
      console.log('PDF parse successful')
      console.log('Text length:', data.text.length)
      console.log('Text preview:', data.text.substring(0, 200))
      
      return res.status(200).json({
        success: true,
        textLength: data.text.length,
        textPreview: data.text.substring(0, 200),
        pages: data.numpages
      })
    } catch (parseError) {
      console.error('PDF parse error:', parseError)
      return res.status(500).json({
        success: false,
        error: parseError.message,
        fileSize: buffer.length
      })
    }
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Failed to process file' })
  }
} 