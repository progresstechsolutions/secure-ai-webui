"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { JournalService } from "@/lib/journal-service"
import { SemanticSearchService, type SearchResult, type SearchInsight } from "@/lib/semantic-search-service"
import { AIInsightsGenerator, type AIInsight } from "@/lib/ai-insights-generator"
import type { JournalEntry } from "@/types/journal"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function HealthJournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchInsights, setSearchInsights] = useState<SearchInsight[]>([])
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null)
  const [dragEndDate, setDragEndDate] = useState<Date | null>(null)
  const [showInlineEntry, setShowInlineEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [entryText, setEntryText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isVoiceSupported, setIsVoiceSupported] = useState(true)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateFilterMode, setDateFilterMode] = useState<"all" | "recent" | "custom">("all")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadEntries()
    initializeSpeechRecognition()
    initializeSearchSuggestions()
  }, [])

  const initializeSearchSuggestions = () => {
    try {
      // Use static suggestions instead of instantiating the service
      const suggestions = [
        "Show me all nights with poor sleep",
        "Find entries with high pain levels",
        "Show me when mood was low",
        "Find headaches after meals",
        "Show me medication effectiveness",
        "Find patterns in symptoms",
        "Show me energy levels over time",
        "Find sleep and mood correlation",
      ]
      setSearchSuggestions(suggestions)
    } catch (error) {
      console.error("Failed to initialize search suggestions:", error)
      // Fallback suggestions if service fails
      setSearchSuggestions([
        "Show me all nights with poor sleep",
        "Find entries with high pain levels",
        "Show me when mood was low",
        "Find headaches after meals",
        "Show me medication effectiveness",
        "Find patterns in symptoms",
        "Show me energy levels over time",
        "Find sleep and mood correlation",
      ])
    }
  }

  const handleSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchInsights([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const searchService = new SemanticSearchService()
      const results = await searchService.searchEntries(query, entries)
      const insights = searchService.generateSearchInsights(results)

      setSearchResults(results)
      setSearchInsights(insights)
      setShowSearchResults(true)

      if (results.length > 0) {
        const aiInsightsGenerator = new AIInsightsGenerator()
        const resultEntries = results.map((r) => r.entry)
        const generatedInsights = await aiInsightsGenerator.generateInsights(resultEntries)
        setAiInsights(generatedInsights)
      } else {
        setAiInsights([])
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(query.length > 0 && !showSearchResults)

    const timeoutId = setTimeout(() => {
      handleSemanticSearch(query)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleSemanticSearch(suggestion)
    searchInputRef.current?.focus()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSearchInsights([])
    setAiInsights([])
    setShowSearchResults(false)
    setShowSuggestions(false)
  }

  const initializeSpeechRecognition = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setEntryText(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)

          // Handle specific error types
          switch (event.error) {
            case "not-allowed":
              alert(
                "Microphone access was denied. Please enable microphone permissions in your browser settings and try again.",
              )
              break
            case "no-speech":
              alert("No speech was detected. Please try speaking again.")
              break
            case "audio-capture":
              alert("No microphone was found. Please ensure your microphone is connected and try again.")
              break
            case "network":
              alert("Network error occurred. Please check your internet connection and try again.")
              break
            default:
              alert(`Speech recognition error: ${event.error}. Please try again.`)
          }
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      } else {
        setIsVoiceSupported(false)
      }
    }
  }

  const handleVoiceInput = async () => {
    if (!isVoiceSupported || !recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.")
      return
    }

    try {
      // Request microphone permission first with more specific error handling
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Stop the stream immediately as we only needed to check permissions
      stream.getTracks().forEach((track) => track.stop())
    } catch (permissionError: any) {
      console.error("Microphone permission error:", permissionError)

      // Handle different types of permission errors
      if (permissionError.name === "NotAllowedError") {
        alert(
          "🎤 Microphone access was denied.\n\nTo enable voice input:\n1. Click the microphone icon in your browser's address bar\n2. Select 'Allow' for microphone access\n3. Refresh the page and try again",
        )
      } else if (permissionError.name === "NotFoundError") {
        alert("No microphone found. Please connect a microphone and try again.")
      } else if (permissionError.name === "NotReadableError") {
        alert(
          "Microphone is being used by another application. Please close other apps using the microphone and try again.",
        )
      } else {
        alert(
          `Microphone error: ${permissionError.message || "Unknown error"}. Please check your microphone settings and try again.`,
        )
      }
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        setIsListening(true)
        recognitionRef.current.start()
      } catch (startError) {
        console.error("Failed to start speech recognition:", startError)
        setIsListening(false)
        alert("Failed to start voice recording. Please try again.")
      }
    }
  }

  useEffect(() => {
    let filtered = entries

    if (showSearchResults && searchResults.length > 0) {
      filtered = searchResults.map((result) => result.entry)
    } else if (searchQuery.trim() && !showSearchResults) {
      filtered = filtered.filter(
        (entry) =>
          entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.symptoms.some((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.meds.some((med) => med.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedDates.length > 0) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date)
        entryDate.setHours(0, 0, 0, 0)

        return selectedDates.some((selectedDate) => {
          const compareDate = new Date(selectedDate)
          compareDate.setHours(0, 0, 0, 0)
          return entryDate.getTime() === compareDate.getTime()
        })
      })
    }

    setFilteredEntries(filtered)
  }, [entries, searchQuery, selectedDates, searchResults, showSearchResults])

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString()
  }

  const isDateSelected = (date: Date) => {
    return selectedDates.some((selectedDate) => isSameDay(date, selectedDate))
  }

  const handleDateClick = (date: Date) => {
    if (isDragging) return

    setSelectedDates((prev) => {
      const isAlreadySelected = prev.some((selectedDate) => isSameDay(date, selectedDate))

      if (isAlreadySelected) {
        return prev.filter((selectedDate) => !isSameDay(date, selectedDate))
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime())
      }
    })
  }

  const handleMouseDown = (date: Date) => {
    setIsDragging(true)
    setDragStartDate(date)
    setDragEndDate(date)
  }

  const handleMouseEnter = (date: Date) => {
    if (isDragging) {
      setDragEndDate(date)
    }
  }

  const handleMouseUp = () => {
    if (isDragging && dragStartDate && dragEndDate) {
      const startDate = new Date(Math.min(dragStartDate.getTime(), dragEndDate.getTime()))
      const endDate = new Date(Math.max(dragStartDate.getTime(), dragEndDate.getTime()))

      const newSelectedDates = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        newSelectedDates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }

      setSelectedDates((prev) => {
        const combined = [...prev, ...newSelectedDates]
        const unique = combined.filter((date, index, self) => index === self.findIndex((d) => isSameDay(d, date)))
        return unique.sort((a, b) => a.getTime() - b.getTime())
      })
    }

    setIsDragging(false)
    setDragStartDate(null)
    setDragEndDate(null)
  }

  const isDateInDragRange = (date: Date) => {
    if (!isDragging || !dragStartDate || !dragEndDate) return false
    const startDate = new Date(Math.min(dragStartDate.getTime(), dragEndDate.getTime()))
    const endDate = new Date(Math.max(dragStartDate.getTime(), dragEndDate.getTime()))
    return date >= startDate && date <= endDate
  }

  const handleQuickSelect = (type: "week" | "month") => {
    if (type === "week") {
      selectWeek(new Date())
    } else if (type === "month") {
      selectMonth(new Date())
    }
  }

  const selectWeek = (startDate: Date) => {
    const weekDates = []
    const start = new Date(startDate)
    start.setDate(start.getDate() - start.getDay())

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      if (date <= new Date()) {
        weekDates.push(date)
      }
    }

    setSelectedDates((prev) => {
      const combined = [...prev, ...weekDates]
      const unique = combined.filter((date, index, self) => index === self.findIndex((d) => isSameDay(d, date)))
      return unique.sort((a, b) => a.getTime() - b.getTime())
    })
  }

  const selectMonth = (monthDate: Date) => {
    const monthDates = []
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date()

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      if (date <= today) {
        monthDates.push(date)
      }
    }

    setSelectedDates((prev) => {
      const combined = [...prev, ...monthDates]
      const unique = combined.filter((date, index, self) => index === self.findIndex((d) => isSameDay(d, date)))
      return unique.sort((a, b) => a.getTime() - b.getTime())
    })
  }

  const formatDateRange = () => {
    if (selectedDates.length === 0) return "Select dates"
    if (selectedDates.length === 1) return formatDate(selectedDates[0])
    if (selectedDates.length <= 3) {
      return selectedDates.map((date) => formatDate(date)).join(", ")
    }
    return `${selectedDates.length} dates selected`
  }

  const resetDateFilter = () => {
    setSelectedDates([])
    setShowCalendar(false)
    setDateFilterMode("all")
  }

  const loadEntries = async () => {
    try {
      const loadedEntries = await JournalService.getEntries()
      setEntries(loadedEntries)
    } catch (error) {
      console.error("Failed to load entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewEntry = () => {
    setShowInlineEntry(true)
    setEditingEntry(null)
    setEntryText("")
    setSelectedImages([])
  }

  const handleVoiceEntry = () => {
    setShowInlineEntry(true)
    setEditingEntry(null)
    setEntryText("")
    setSelectedImages([])
    setTimeout(() => {
      handleVoiceInput()
    }, 100)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setShowInlineEntry(true)
    setEntryText(entry.summary)
    setSelectedImages([])
  }

  const handleDeleteEntry = async (entry: JournalEntry, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the edit click

    const confirmed = window.confirm(
      `Are you sure you want to delete this journal entry from ${new Date(entry.date).toLocaleDateString()}?\n\nThis action cannot be undone.`,
    )

    if (confirmed) {
      try {
        await JournalService.deleteEntry(entry.id)
        await loadEntries() // Reload entries to update the list
      } catch (error) {
        console.error("Failed to delete entry:", error)
        alert("Failed to delete entry. Please try again.")
      }
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedImages((prev) => [...prev, ...files].slice(0, 3))
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSaveEntry = async () => {
    if (!entryText.trim() && selectedImages.length === 0) return

    setIsSaving(true)
    try {
      const newEntry: Partial<JournalEntry> = {
        summary: entryText,
        date: new Date(),
        createdAt: new Date(),
        mode: isListening ? "voice" : "text",
        symptoms: [],
        meds: [],
        tags: [],
        mood: undefined,
        sleep: undefined,
        energy: undefined,
        pain: undefined,
      }

      if (editingEntry) {
        newEntry.id = editingEntry.id
      }

      await JournalService.saveEntry(newEntry)

      await loadEntries()
      setShowInlineEntry(false)
      setEditingEntry(null)
      setEntryText("")
      setSelectedImages([])
    } catch (error) {
      console.error("Failed to save entry:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEntry = () => {
    setShowInlineEntry(false)
    setEditingEntry(null)
    setEntryText("")
    setSelectedImages([])
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const exportEntries = (format: "csv" | "txt") => {
    if (filteredEntries.length === 0) return

    const dateRange = selectedDates.length > 0 ? formatDateRange() : `All entries (${filteredEntries.length})`

    if (format === "csv") {
      const csvContent = [
        ["Date", "Time", "Summary", "Mood", "Energy", "Sleep", "Pain", "Symptoms", "Medications"].join(","),
        ...filteredEntries.map((entry) =>
          [
            formatDate(entry.date),
            formatTime(entry.createdAt),
            `"${entry.summary.replace(/"/g, '""')}"`,
            entry.mood || "",
            entry.energy || "",
            entry.sleep || "",
            entry.pain || "",
            `"${entry.symptoms.join("; ")}"`,
            `"${entry.meds.join("; ")}"`,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `journal-entries-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === "txt") {
      const txtContent = [
        `Caregene Journal Export - ${dateRange}`,
        `Generated on: ${new Date().toLocaleDateString()}`,
        `Total entries: ${filteredEntries.length}`,
        "",
        ...filteredEntries.map((entry) =>
          [
            `Date: ${formatDate(entry.date)} at ${formatTime(entry.createdAt)}`,
            `Summary: ${entry.summary}`,
            entry.mood ? `Mood: ${entry.mood}/5` : "",
            entry.energy ? `Energy: ${entry.energy}/5` : "",
            entry.sleep ? `Sleep: ${entry.sleep}h` : "",
            entry.pain ? `Pain: ${entry.pain}/10` : "",
            entry.symptoms.length > 0 ? `Symptoms: ${entry.symptoms.join(", ")}` : "",
            entry.meds.length > 0 ? `Medications: ${entry.meds.join(", ")}` : "",
            "---",
          ]
            .filter(Boolean)
            .join("\n"),
        ),
      ].join("\n")

      const blob = new Blob([txtContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `journal-entries-${new Date().toISOString().split("T")[0]}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    const days = []

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isSelected = selectedDates.some((selectedDate) => isSameDay(date, selectedDate))
      const isInDragRange = isDateInDragRange(date)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onMouseDown={() => handleMouseDown(date)}
          onMouseEnter={() => handleMouseEnter(date)}
          onMouseUp={handleMouseUp}
          className={`p-2 rounded-full transition-colors select-none ${
            isSelected
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : isInDragRange
                ? "bg-blue-200 text-blue-800"
                : "hover:bg-gray-200"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const getSmartDateSuggestions = () => {
    const now = new Date()
    const suggestions = [
      { label: "Today", value: "today", count: entries.filter((e) => isSameDay(new Date(e.date), now)).length },
      {
        label: "This Week",
        value: "week",
        count: entries.filter((e) => {
          const entryDate = new Date(e.date)
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          return entryDate >= weekStart
        }).length,
      },
      {
        label: "This Month",
        value: "month",
        count: entries.filter((e) => {
          const entryDate = new Date(e.date)
          return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
        }).length,
      },
    ]
    return suggestions.filter((s) => s.count > 0)
  }

  const handleSmartDateFilter = (type: string) => {
    const now = new Date()
    let dates: Date[] = []

    switch (type) {
      case "today":
        dates = [now]
        break
      case "week":
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        for (let i = 0; i < 7; i++) {
          const date = new Date(weekStart)
          date.setDate(weekStart.getDate() + i)
          if (date <= now) dates.push(date)
        }
        break
      case "month":
        const year = now.getFullYear()
        const month = now.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day)
          if (date <= now) dates.push(date)
        }
        break
    }

    setSelectedDates(dates)
    setDateFilterMode("custom")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="ml-12 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
          <div className="px-4 py-6 max-w-md mx-auto sm:max-w-2xl">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation />

      <main className="ml-12 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <div className="px-4 py-6 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Journal</h1>
            <p className="text-gray-600 mb-8">Capture your health journey with voice and written entries</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={handleVoiceEntry}
                disabled={!isVoiceSupported}
                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3 3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold">Voice Journal</div>
                    <div className="text-sm opacity-90">Speak your thoughts</div>
                  </div>
                </div>
                {isListening && (
                  <div className="absolute inset-0 bg-red-500 rounded-2xl animate-pulse flex items-center justify-center">
                    <span className="text-white font-semibold">Listening...</span>
                  </div>
                )}
              </button>

              <button
                onClick={handleNewEntry}
                className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold">Write Journal</div>
                    <div className="text-sm opacity-90">Type your entry</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {entries.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-semibold text-gray-900">Smart Search</h3>
                {isSearching && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0 && !showSearchResults)}
                  placeholder="Ask anything: 'Show me all nights with poor sleep' or 'Find headaches after meals'"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 mb-2">Try asking:</div>
                      {searchSuggestions
                        .filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 6)
                        .map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionSelect(suggestion)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-md transition-colors text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {showSearchResults && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-900">
                      Found {searchResults.length} relevant entries
                    </span>
                    <button
                      onClick={handleClearSearch}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Clear search
                    </button>
                  </div>

                  {searchInsights.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {searchInsights.map((insight, index) => (
                        <div key={index} className="text-sm text-blue-800">
                          <span className="font-medium">{insight.pattern}</span>
                          {insight.suggestion && <span className="text-blue-600 ml-2">• {insight.suggestion}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {aiInsights.length > 0 && (
                    <div className="border-t border-blue-200 pt-3">
                      <div className="text-xs font-medium text-blue-900 mb-2">AI Insights:</div>
                      <div className="space-y-2">
                        {aiInsights.slice(0, 3).map((insight, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  insight.category === "Health Correlations"
                                    ? "bg-green-100 text-green-700"
                                    : insight.category === "Health Trends"
                                      ? "bg-blue-100 text-blue-700"
                                      : insight.category === "Medication Insights"
                                        ? "bg-purple-100 text-purple-700"
                                        : insight.category === "Behavioral Patterns"
                                          ? "bg-orange-100 text-orange-700"
                                          : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {insight.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {Math.round(insight.confidence * 100)}% confidence
                              </span>
                            </div>
                            <p className="text-blue-800">{insight.insight}</p>
                            {insight.actionable_recommendation && (
                              <p className="text-blue-600 text-xs mt-1">{insight.actionable_recommendation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {entries.length > 0 && (
            <div className="mb-6">
              {/* Smart filter pills that appear contextually */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {filteredEntries.length} {filteredEntries.length === 1 ? "entry" : "entries"}
                  </span>
                  {selectedDates.length > 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {selectedDates.length === 1 ? formatDate(selectedDates[0]) : `${selectedDates.length} dates`}
                    </span>
                  )}
                </div>

                {/* Apple-style filter toggle */}
                <div className="flex items-center gap-2">
                  {selectedDates.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedDates([])
                        setDateFilterMode("all")
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Filter
                  </button>

                  {filteredEntries.length > 0 && (
                    <button
                      onClick={() => exportEntries("csv")}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Apple-style contextual date picker that slides in */}
              {showDatePicker && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Smart suggestions */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {getSmartDateSuggestions().map((suggestion) => (
                        <button
                          key={suggestion.value}
                          onClick={() => {
                            handleSmartDateFilter(suggestion.value)
                            setShowDatePicker(false)
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {suggestion.label}
                          <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded-full">
                            {suggestion.count}
                          </span>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowCalendar(true)}
                        className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        Custom Range
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Compact calendar that only shows when needed */}
              {showCalendar && (
                <div
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-4 animate-in slide-in-from-top-2 duration-200"
                  onMouseLeave={handleMouseUp}
                >
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h4 className="font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h4>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-4">{renderCalendarDays()}</div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setShowCalendar(false)
                        setShowDatePicker(false)
                      }}
                      className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowCalendar(false)
                        setShowDatePicker(false)
                      }}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {showInlineEntry && (
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{editingEntry ? "Edit Entry" : "New Entry"}</h3>
                <button onClick={handleCancelEntry} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isListening && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 font-medium">Listening... Speak now</span>
                  </div>
                </div>
              )}

              <textarea
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                placeholder="Share your thoughts, symptoms, medications, or how you're feeling today..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={selectedImages.length >= 3}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0010.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Photo
                  </button>

                  <button
                    onClick={handleVoiceInput}
                    disabled={!isVoiceSupported}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                      isListening ? "bg-red-50 border-red-200 text-red-700" : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3 3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    {isListening ? "Stop" : "Voice"}
                  </button>
                </div>

                <button
                  onClick={handleSaveEntry}
                  disabled={(!entryText.trim() && selectedImages.length === 0) || isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : editingEntry ? "Update Entry" : "Save Entry"}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          {filteredEntries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Entries {selectedDates.length > 0 && `(${filteredEntries.length})`}
                </h2>
              </div>

              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {entry.mode && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            entry.mode === "voice" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {entry.mode === "voice" ? "🎤 Voice" : "✏️ Typed"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditEntry(entry)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit entry"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDeleteEntry(entry, e)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete entry"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div
                    className="cursor-pointer hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <div className="mb-4">
                      <p className="text-gray-900 leading-relaxed">{entry.summary}</p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      {entry.mood && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                          Mood: {entry.mood}
                        </span>
                      )}
                      {entry.symptoms?.map((symptom, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                          {symptom}
                        </span>
                      ))}
                      {entry.meds?.map((med, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                          {med}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-center mt-3 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Click to edit
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredEntries.length === 0 && !isLoading && !showInlineEntry && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13m0-13C4.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedDates.length > 0 ? "No entries for selected dates" : "Start Your Health Journey"}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {selectedDates.length > 0
                  ? "Try selecting different dates or clear your filter to see all entries."
                  : "Begin documenting your health journey with voice or written entries."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
