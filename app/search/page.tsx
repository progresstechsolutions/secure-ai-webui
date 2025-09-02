"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { Edit3, RotateCcw } from "lucide-react"
import { Navigation } from "@/components/navigation"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")

  // Function to call backend
  const callBackend = async (userQuery: string) => {
    setIsLoading(true)
    setError("")
    setResponse("")
    
    try {
      const payload = {
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: userQuery }]
          }
        ]
      }
      
      console.log("Calling backend with:", payload)
      
      const response = await fetch('http://localhost:8000/generate-structured-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      console.log("Response status:", response.status)
      
      const responseText = await response.text()
      console.log("Raw response:", responseText)
      
      const data = JSON.parse(responseText)
      console.log("Parsed data:", data)
      
      if (data.status === "success" && data.output) {
        setResponse(data.output)
      } else {
        setError(data.message || "No response received")
      }
    } catch (err: any) {
      console.error("Error calling backend:", err)
      setError(err.message || "Failed to get response")
    } finally {
      setIsLoading(false)
    }
  }

  // Call backend when query changes
  useEffect(() => {
    if (query.trim()) {
      callBackend(query)
    }
  }, [query])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 min-h-screen flex flex-col">
        {/* Query Display */}
        <div className="pt-4 sm:pt-5 md:pt-6 lg:pt-7 xl:pt-8 pb-3 sm:pb-4 md:pb-5 lg:pb-6 px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4 text-muted-foreground">
              <Edit3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
              <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base truncate">{query}</span>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto">
          {/* AI Response */}
          <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-4 sm:py-5 md:py-6 lg:py-7 xl:py-8">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 rounded-full bg-primary"></div>
              </div>

              <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-5">
                <div className="text-foreground">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : error ? (
                    <div className="text-red-500">
                      <p className="text-sm">Error: {error}</p>
                    </div>
                  ) : response ? (
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br/>') }} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Ask me anything about rare genetic diseases, health guidance, or care coordination.
                    </p>
                  )}
                </div>

                {response && (
                  <div className="flex items-center gap-2 pt-1 sm:pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground text-xs sm:text-xs md:text-sm lg:text-base"
                      onClick={() => callBackend(query)}
                    >
                      <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 lg:h-4 lg:w-4 mr-1 sm:mr-1.5" />
                      Regenerate
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 border-t border-border/50">
            <div className="max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
              <SearchBar />
            </div>
            <div className="text-center mt-2 sm:mt-3 md:mt-4 lg:mt-5">
              <p className="text-xs sm:text-xs md:text-sm lg:text-base text-muted-foreground">
                Caregene can make mistakes, so double-check it
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
