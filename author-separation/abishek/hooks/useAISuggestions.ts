"use client"

import { useState, useCallback } from "react"

// Mock AI suggestions based on file name and type
const AI_SUGGESTIONS_DB = {
  vaccination: ["vaccination", "immunization", "shots", "vaccine", "medical"],
  medical: ["medical", "health", "doctor", "appointment", "checkup"],
  school: ["school", "education", "academic", "report", "grades"],
  insurance: ["insurance", "coverage", "policy", "claim", "benefits"],
  lab: ["lab", "test", "results", "blood", "analysis"],
  prescription: ["prescription", "medication", "pharmacy", "drugs", "treatment"],
  emergency: ["emergency", "contact", "urgent", "important", "critical"],
  dental: ["dental", "teeth", "dentist", "oral", "hygiene"],
  vision: ["vision", "eye", "glasses", "optometry", "sight"],
  therapy: ["therapy", "treatment", "rehabilitation", "counseling", "support"],
}

export function useAISuggestions() {
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const getSuggestedTags = useCallback(
    async (fileName: string, fileType: string, forceRefresh = false): Promise<string[]> => {
      setIsLoadingSuggestions(true)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, forceRefresh ? 1500 : 800))

        const suggestions: string[] = []
        const lowerFileName = fileName.toLowerCase()

        // Analyze file name for keywords
        Object.entries(AI_SUGGESTIONS_DB).forEach(([category, tags]) => {
          if (lowerFileName.includes(category) || tags.some((tag) => lowerFileName.includes(tag))) {
            suggestions.push(...tags.slice(0, 3)) // Add up to 3 tags per category
          }
        })

        // Add file type based suggestions
        if (fileType.startsWith("image/")) {
          suggestions.push("image", "photo", "scan")
        } else if (fileType === "application/pdf") {
          suggestions.push("document", "pdf", "report")
        }

        // Add date-based suggestions
        const currentYear = new Date().getFullYear()
        if (lowerFileName.includes(currentYear.toString())) {
          suggestions.push(currentYear.toString(), "current", "recent")
        }

        // Add common medical categories
        const medicalKeywords = ["checkup", "physical", "exam", "visit", "appointment"]
        if (medicalKeywords.some((keyword) => lowerFileName.includes(keyword))) {
          suggestions.push("routine", "annual", "preventive")
        }

        // Remove duplicates and limit to 8 suggestions
        const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8)

        // Add some randomness to make it feel more AI-like
        if (forceRefresh) {
          const additionalSuggestions = ["important", "archived", "personal", "confidential", "urgent"]
          const randomSuggestion = additionalSuggestions[Math.floor(Math.random() * additionalSuggestions.length)]
          if (!uniqueSuggestions.includes(randomSuggestion)) {
            uniqueSuggestions.push(randomSuggestion)
          }
        }

        return uniqueSuggestions
      } catch (error) {
        console.error("Failed to get AI suggestions:", error)
        return []
      } finally {
        setIsLoadingSuggestions(false)
      }
    },
    [],
  )

  return {
    getSuggestedTags,
    isLoadingSuggestions,
  }
}
