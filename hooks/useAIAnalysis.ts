"use client"

import { useState, useEffect } from "react"
import type { Document } from "@/contexts/document-context"

interface AIAnalysis {
  summary: string
  keyPoints: string[]
  medicalInfo: {
    patientName?: string
    dateOfService?: string
    provider?: string
    diagnosis?: string[]
    medications?: string[]
    allergies?: string[]
    vitals?: Record<string, string>
  }
  sentiment: "positive" | "neutral" | "concerning"
  urgency: "low" | "medium" | "high"
  followUpRequired: boolean
}

export function useAIAnalysis(document: Document | null) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!document) {
      setAnalysis(null)
      return
    }

    const analyzeDocument = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simulate AI analysis
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock analysis based on document content
        const mockAnalysis: AIAnalysis = {
          summary: document.aiSummary || `Analysis of ${document.name}`,
          keyPoints: document.keyHighlights || [
            "Document processed successfully",
            "No critical issues identified",
            "Standard medical documentation",
          ],
          medicalInfo: {
            patientName: "Patient information available",
            dateOfService: document.uploadDate.toLocaleDateString(),
            provider: "Healthcare Provider",
            diagnosis: ["General health documentation"],
            medications: [],
            allergies: [],
            vitals: {},
          },
          sentiment:
            document.name.toLowerCase().includes("emergency") || document.name.toLowerCase().includes("urgent")
              ? "concerning"
              : "neutral",
          urgency:
            document.name.toLowerCase().includes("emergency") || document.name.toLowerCase().includes("urgent")
              ? "high"
              : "low",
          followUpRequired: document.tags.some(
            (tag) => tag.toLowerCase().includes("follow") || tag.toLowerCase().includes("appointment"),
          ),
        }

        setAnalysis(mockAnalysis)
      } catch (err) {
        setError("Failed to analyze document")
      } finally {
        setIsLoading(false)
      }
    }

    analyzeDocument()
  }, [document])

  const reanalyze = () => {
    if (document) {
      setAnalysis(null)
      // Trigger re-analysis
    }
  }

  return {
    analysis,
    isLoading,
    error,
    reanalyze,
  }
}
