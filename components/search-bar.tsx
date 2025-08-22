"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Mic, Send } from "lucide-react"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const isSearchPage = pathname === "/search"

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-3 sm:px-4 md:px-4 lg:px-6 z-50">
      {!isSearchPage && (
        <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Genetic counseling
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Symptom analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Research insights
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs xl:text-sm px-1 sm:px-1.5 md:px-2 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 md:py-1 lg:py-1.5 bg-card/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9"
          >
            Care planning
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFileUpload}
            className="ml-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <Input
            type="text"
            placeholder="Ask Caregene about your health questions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 bg-transparent px-4 py-3 text-xs leading-relaxed focus:ring-0 focus:outline-none placeholder:text-gray-400 placeholder:text-xs min-h-[48px]"
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mr-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {searchQuery.trim() && (
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="mr-3 p-2 rounded-full hover:bg-gray-50 text-gray-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              console.log("File selected:", file.name)
              // Handle file upload
            }
          }}
        />
      </form>
    </div>
  )
}
