"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function HeroSection() {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setQuery(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      } else {
        setIsSupported(false)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleVoiceInput = () => {
    if (!isSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || selectedFiles.length > 0) {
      const searchParams = new URLSearchParams()
      if (query.trim()) searchParams.set("q", query.trim())
      if (selectedFiles.length > 0) searchParams.set("files", selectedFiles.length.toString())
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleSuggestionClick = (condition: string) => {
    setQuery(`Tell me about ${condition}`)
    const searchParams = new URLSearchParams()
    searchParams.set("q", `Tell me about ${condition}`)
    router.push(`/search?${searchParams.toString()}`)
  }

  const handleAttach = () => {
    fileInputRef.current?.click()
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[85vh] xl:min-h-[90vh] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-foreground font-bold leading-tight mb-2 sm:mb-3 md:mb-4">
          Meet Caregene,
        </h1>
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-primary font-bold leading-tight mb-4 sm:mb-6 md:mb-8">
          your personal Healthcare AI assistant
        </h2>
      </div>

      <div className="fixed bottom-6 sm:bottom-8 md:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 z-40">
        <div className="mb-4 flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            onClick={() => handleSuggestionClick("Phelan-McDermid Syndrome (PMS)")}
            className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
          >
            Phelan-McDermid Syndrome
          </button>
          <button
            onClick={() => handleSuggestionClick("Fragile X Syndrome")}
            className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
          >
            Fragile X Syndrome
          </button>
          <button
            onClick={() => handleSuggestionClick("Rett Syndrome")}
            className="px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
          >
            Rett Syndrome
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mb-4 p-3 bg-card/95 backdrop-blur-sm border border-primary/20 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 text-sm">
                  <span className="truncate max-w-32">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-primary hover:text-primary/70 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-all hover:border-gray-400 p-2 sm:p-2.5 md:p-3 lg:p-3.5"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleAttach}
            className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            title="Attach files"
          >
            <svg
              className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-5 lg:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Caregene about your health questions"
            className="flex-1 border-0 bg-transparent px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed focus:ring-0 focus:outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full transition-colors ${
              isListening ? "bg-red-500 text-white animate-pulse" : "hover:bg-gray-100 text-gray-600"
            }`}
            title={isListening ? "Stop listening" : "Start voice search"}
          >
            <svg
              className="h-3 w-3 sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-4 lg:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3 3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <button
            type="submit"
            disabled={!query.trim() && selectedFiles.length === 0}
            className="p-2 sm:p-2.5 md:p-3 lg:p-3.5 rounded-full hover:bg-primary/10 text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-7 lg:w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            By messaging Caregene AI, you agree to our Terms and have read our Privacy Policy.
          </p>
        </div>

        {isListening && (
          <div className="text-center mt-2">
            <p className="text-sm text-primary animate-pulse">Listening... Ask me anything about health</p>
          </div>
        )}
      </div>
    </section>
  )
}
