"use client"

import { useState } from "react"
import { Button } from "../../components/atoms/Button/Button"
import { Upload } from "lucide-react"

// Disable static generation for this page
export const dynamic = 'force-dynamic'

export default function UploadPage() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Document Upload Demo</h1>
          <p className="text-muted-foreground mb-6">
            Test the comprehensive upload flow with drag & drop, AI suggestions, and folder management.
          </p>
          <Button onClick={() => setShowUpload(true)} leftIcon={<Upload className="h-4 w-4" />}>
            Open Upload Dialog
          </Button>
        </div>

        {showUpload && (
          <div className="bg-card border rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Upload Dialog</h3>
            <p className="text-muted-foreground mb-4">
              Document upload functionality will be available after deployment.
            </p>
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
