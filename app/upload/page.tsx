"use client"

import { useState } from "react"
import { DocumentUpload } from "@/components/features/upload/DocumentUpload"
import { Button } from "@/components/atoms/Button/Button"
import { AuthProvider } from "@/contexts/auth-context"
import { ChildProfileProvider } from "@/contexts/child-profile-context"
import { ToastContainer } from "react-toastify"
import { Upload } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

export default function UploadPage() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <AuthProvider>
      <ChildProfileProvider>
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

            <DocumentUpload
              isOpen={showUpload}
              onClose={() => setShowUpload(false)}
              onUploadComplete={(files) => {
                console.log("Upload completed:", files)
              }}
            />
          </div>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ChildProfileProvider>
    </AuthProvider>
  )
}
