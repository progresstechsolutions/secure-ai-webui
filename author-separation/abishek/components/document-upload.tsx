"use client"

import type React from "react"

import { useState } from "react"
import type { Document, Child } from "./document-hub"

interface DocumentUploadProps {
  onUpload: (documents: Document[]) => void
  activeChild: Child | null
}

export function DocumentUpload({ onUpload, activeChild }: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [category, setCategory] = useState<Document["category"]>("other")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleUpload = async () => {
    if (!activeChild) {
      setMessage("Please select a child profile before uploading documents.")
      return
    }

    if (selectedFiles.length === 0) {
      setMessage("Please select files to upload.")
      return
    }

    setIsUploading(true)
    setMessage("")

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDocuments: Document[] = selectedFiles.map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        category,
        childId: activeChild.id,
        tags,
      }))

      onUpload(newDocuments)

      // Reset form
      setSelectedFiles([])
      setCategory("other")
      setTags([])
      setTagInput("")
      setMessage(`${selectedFiles.length} document(s) uploaded successfully.`)
    } catch (error) {
      setMessage("There was an error uploading your documents. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
          Select Files
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        <p className="text-xs text-gray-500 mt-1">Supports PDF, DOC, DOCX, and images up to 10MB</p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length})</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
                <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Document Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Document["category"])}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="vaccination">Vaccination Records</option>
          <option value="prescription">Prescriptions</option>
          <option value="lab-result">Lab Results</option>
          <option value="visit-summary">Visit Summaries</option>
          <option value="insurance">Insurance Documents</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="tags"
            type="text"
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 text-green-600 hover:text-green-800">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || isUploading || !activeChild}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isUploading ? "Uploading..." : `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} ` : ""}Documents`}
      </button>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes("error") || message.includes("Please")
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
