"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { JournalService } from "@/lib/journal-service"
import type { SearchResult, SearchInsight } from "@/lib/semantic-search-service"
import type { JournalEntry } from "@/types/journal"
import PageWrapper from "@/components/page-wrapper"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Plus,
  X,
  Save,
  Loader2,
  Sparkles,
  Heart,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Mic,
} from "lucide-react"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function HealthJournalPage() {
  const [selectedChildId, setSelectedChildId] = useState<string>("")

  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchInsights, setSearchInsights] = useState<SearchInsight[]>([])
  const [aiInsights, setAiInsights] = useState<string>("")
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
  const [showNewEntry, setShowNewEntry] = useState(false)

  const [mood, setMood] = useState<number>(3)
  const [energy, setEnergy] = useState<number>(3)
  const [sleep, setSleep] = useState<number>(8)
  const [pain, setPain] = useState<number>(0)

  const [dailySummary, setDailySummary] = useState<string>("")
  const [showDailySummary, setShowDailySummary] = useState(false)
  const [lastNudgeTime, setLastNudgeTime] = useState<Date | null>(null)
  const [showNudge, setShowNudge] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [selectedMedications, setSelectedMedications] = useState<string[]>([])

  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true)
      try {
        const allEntries = await JournalService.getEntries()
        // Filter entries by selected child
        const childEntries = selectedChildId
          ? allEntries.filter((entry) => entry.childId === selectedChildId)
          : allEntries
        setEntries(childEntries)
        setFilteredEntries(childEntries)
      } catch (error) {
        console.error("Error loading entries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [selectedChildId]) // Re-load when child changes

  useEffect(() => {
    initializeSpeechRecognition()
    initializeSearchSuggestions()
  }, [])

  const initializeSearchSuggestions = () => {
    try {
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

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowSearchResults(false)
    setSearchResults([])

    try {
      const resultEntries = entries.filter(
        (entry) =>
          entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.symptoms.some((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.meds.some((med) => med.toLowerCase().includes(searchQuery.toLowerCase())) ||
          entry.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )

      const results = resultEntries.map((entry) => ({
        entry,
        relevance: 0.8,
        reasoning: "Text match found",
      }))

      setSearchResults(results)
      setShowSearchResults(true)
      setAiInsights("")
    } catch (error) {
      console.error("Search failed:", error)
      setAiInsights("Search temporarily unavailable. Please try again later.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(query.length > 0 && !showSearchResults)

    const timeoutId = setTimeout(() => {
      handleSemanticSearch()
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleSemanticSearch()
    searchInputRef.current?.focus()
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setSearchInsights([])
    setAiInsights("")
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch (permissionError: any) {
      console.error("Microphone permission error:", permissionError)

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

  const formatDate = (dateInput: Date | string | number) => {
    // Convert input to Date object if it's not already
    const date = new Date(dateInput)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

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

  const isSameDay = (date1: Date | string | number, date2: Date | string | number) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.toDateString() === d2.toDateString()
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

  const handleNewEntry = () => {
    setShowInlineEntry(true)
    setEditingEntry(null)
    setEntryText("")
    setSelectedImages([])
    setShowNewEntry(true)
  }

  const handleVoiceEntry = () => {
    setShowInlineEntry(true)
    setEditingEntry(null)
    setEntryText("")
    setSelectedImages([])
    setTimeout(() => {
      handleVoiceInput()
    }, 100)
    setShowNewEntry(true)
  }

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setShowInlineEntry(true)
    setEntryText(entry.summary)
    setSelectedImages([])
    setShowNewEntry(true)
  }

  const handleDeleteEntry = async (entry: JournalEntry, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent triggering the edit click

    const confirmed = window.confirm(
      `Are you sure you want to delete this journal entry from ${new Date(entry.date).toLocaleDateString()}?\n\nThis action cannot be undone.`,
    )

    if (confirmed) {
      try {
        await JournalService.deleteEntry(entry.id)
        const loadEntries = async () => {
          setIsLoading(true)
          try {
            const allEntries = await JournalService.getEntries()
            // Filter entries by selected child
            const childEntries = selectedChildId
              ? allEntries.filter((entry) => entry.childId === selectedChildId)
              : allEntries
            setEntries(childEntries)
            setFilteredEntries(childEntries)
          } catch (error) {
            console.error("Error loading entries:", error)
          } finally {
            setIsLoading(false)
          }
        }
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

  useEffect(() => {
    const checkForNudges = () => {
      const now = new Date()
      const lastEntry = entries[0]

      // Show nudge if no entry in last 24 hours
      if (!lastEntry || now.getTime() - new Date(lastEntry.createdAt).getTime() > 24 * 60 * 60 * 1000) {
        const lastNudge = localStorage.getItem("lastNudgeTime")
        const lastNudgeDate = lastNudge ? new Date(lastNudge) : null

        // Only show nudge once per day
        if (!lastNudgeDate || now.getTime() - lastNudgeDate.getTime() > 24 * 60 * 60 * 1000) {
          setShowNudge(true)
          localStorage.setItem("lastNudgeTime", now.toISOString())
        }
      }
    }

    const nudgeInterval = setInterval(checkForNudges, 60 * 60 * 1000) // Check every hour
    checkForNudges() // Check immediately

    return () => clearInterval(nudgeInterval)
  }, [entries])

  useEffect(() => {
    const generateDailySummary = async () => {
      const today = new Date()
      const todayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.createdAt)
        return entryDate.toDateString() === today.toDateString()
      })

      if (todayEntries.length > 0) {
        try {
          const summary = await generateAISummary(todayEntries)
          setDailySummary(summary)
          setShowDailySummary(true)
        } catch (error) {
          console.error("Failed to generate daily summary:", error)
        }
      }
    }

    if (entries.length > 0) {
      generateDailySummary()
    }
  }, [entries])

  const generateAISummary = async (todayEntries: JournalEntry[]) => {
    const avgMood = todayEntries.reduce((sum, entry) => sum + (entry.mood || 3), 0) / todayEntries.length
    const avgEnergy = todayEntries.reduce((sum, entry) => sum + (entry.energy || 3), 0) / todayEntries.length
    const avgSleep = todayEntries.reduce((sum, entry) => sum + (entry.sleep || 8), 0) / todayEntries.length
    const avgPain = todayEntries.reduce((sum, entry) => sum + (entry.pain || 0), 0) / todayEntries.length

    const allSymptoms = [...new Set(todayEntries.flatMap((entry) => entry.symptoms || []))]
    const allMeds = [...new Set(todayEntries.flatMap((entry) => entry.meds || []))]

    return `Today's Summary: Mood averaged ${avgMood.toFixed(1)}/5, energy ${avgEnergy.toFixed(1)}/5, sleep ${avgSleep.toFixed(1)}h, pain ${avgPain.toFixed(1)}/10. ${allSymptoms.length > 0 ? `Symptoms: ${allSymptoms.join(", ")}. ` : ""}${allMeds.length > 0 ? `Medications: ${allMeds.join(", ")}.` : ""}`
  }

  const handleSaveEntry = async () => {
    if (!entryText.trim()) return

    setIsSaving(true)
    try {
      const newEntry: Omit<JournalEntry, "id"> = {
        content: entryText,
        timestamp: new Date().toISOString(),
        childId: selectedChildId,
        mood: mood,
        symptoms: selectedSymptoms,
        meds: selectedMedications,
        images: selectedImages.map((file) => URL.createObjectURL(file)),
        tags: extractTags(entryText),
        isVoiceEntry: isListening,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mode: isListening ? "voice" : "text",
        energy: energy,
        sleep: sleep,
        pain: pain,
      }

      const savedEntry = await JournalService.addEntry(newEntry)

      const allEntries = await JournalService.getEntries()
      const childEntries = selectedChildId
        ? allEntries.filter((entry) => entry.childId === selectedChildId)
        : allEntries
      setEntries(childEntries)
      setFilteredEntries(childEntries)

      setShowInlineEntry(false)
      setEditingEntry(null)
      setEntryText("")
      setSelectedImages([])
      setShowNewEntry(false)

      setMood(3)
      setEnergy(3)
      setSleep(8)
      setPain(0)
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
    setShowNewEntry(false)
    if (isRecording) {
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
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

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
    // Reload entries for the selected child
    const loadEntries = async () => {
      setIsLoading(true)
      try {
        const allEntries = await JournalService.getEntries()
        // Filter entries by selected child
        const childEntries = selectedChildId
          ? allEntries.filter((entry) => entry.childId === selectedChildId)
          : allEntries
        setEntries(childEntries)
        setFilteredEntries(childEntries)
      } catch (error) {
        console.error("Error loading entries:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadEntries()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
          <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-full sm:max-w-md mx-auto sm:mx-auto md:max-w-2xl">
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

  const handleEntryClick = (entry: JournalEntry) => {
    handleEditEntry(entry)
  }

  const extractTags = (text: string): string[] => {
    const tagRegex = /#(\w+)/g
    const matches = []
    let match

    while ((match = tagRegex.exec(text)) !== null) {
      matches.push(match[1])
    }

    return matches
  }

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const days = []

    // Add empty days for the days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i),
        isCurrentMonth: false,
        isToday: false,
      })
    }

    // Add days for the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isToday = date.toDateString() === new Date().toDateString()
      days.push({
        date: date,
        isCurrentMonth: true,
        isToday: isToday,
      })
    }

    return days.reverse()
  }

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildChange={setSelectedChildId}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {showNudge && (
          <div className="fixed top-4 right-4 z-50 bg-white border border-blue-200 rounded-xl shadow-lg p-4 max-w-sm animate-in slide-in-from-right-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">Time for a check-in</h4>
                <p className="text-gray-600 text-xs mt-1">
                  How are you feeling today? A quick entry helps track your progress.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      setShowNewEntry(true)
                      setShowNudge(false)
                    }}
                    className="text-xs h-7"
                  >
                    Add Entry
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowNudge(false)} className="text-xs h-7">
                    Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDailySummary && dailySummary && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Daily Summary</h3>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">{dailySummary}</p>
              </div>
              <Button onClick={() => setShowDailySummary(false)} className="w-full">
                Got it
              </Button>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <div className="flex flex-col space-y-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Journal</h1>
                <p className="text-gray-600">Track your daily health and wellness journey</p>
              </div>

              <div className="space-y-3">
                {/* Primary Actions Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowNewEntry(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex-1 sm:flex-none sm:min-w-[140px]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Entry
                  </Button>

                  <Button
                    onClick={handleVoiceEntry}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-transparent flex-1 sm:flex-none sm:min-w-[140px]"
                    disabled={!isVoiceSupported}
                  >
                    <Mic className={`w-4 h-4 mr-2 ${isListening ? "text-red-500 animate-pulse" : ""}`} />
                    {isListening ? "Listening..." : "Voice Entry"}
                  </Button>
                </div>

                {/* Secondary Actions Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCalendar(true)}
                    className="relative flex-1 sm:flex-none sm:min-w-[140px]"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Filter by Date
                    {selectedDates.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedDates.length}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => exportEntries("csv")}
                    disabled={filteredEntries.length === 0}
                    className="flex-1 sm:flex-none sm:min-w-[120px]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>

            {selectedDates.length > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{formatDateRange()}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDateFilter}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {showNewEntry && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-in slide-in-from-top-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">New Journal Entry</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNewEntry(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Health Trackers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mood: {mood}/5</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={mood}
                        onChange={(e) => setMood(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>😢</span>
                        <span>😐</span>
                        <span>😊</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Energy: {energy}/5</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={energy}
                        onChange={(e) => setEnergy(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>🔋</span>
                        <span>⚡</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep: {sleep}h</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={sleep}
                        onChange={(e) => setSleep(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pain: {pain}/10</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={pain}
                        onChange={(e) => setPain(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>None</span>
                        <span>Mild</span>
                        <span>Severe</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling today?</label>
                <textarea
                  value={entryText}
                  onChange={(e) => setEntryText(e.target.value)}
                  placeholder="Describe your day, symptoms, medications, or anything else you'd like to track..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Photos (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag photos here or{" "}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">Up to 3 images</p>
                  </div>
                </div>

                {selectedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEntry}
                  disabled={isSaving || !entryText.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Entry
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {showCalendar && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filter by Date</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowCalendar(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                  {/* Smart Date Suggestions */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {getSmartDateSuggestions().map((suggestion) => (
                        <Button
                          key={suggestion.value}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleSmartDateFilter(suggestion.value)
                            setShowCalendar(false)
                          }}
                          className="text-xs"
                        >
                          {suggestion.label}
                          <span className="ml-1 bg-gray-100 text-gray-600 px-1 rounded">{suggestion.count}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMonth = new Date(currentMonth)
                          newMonth.setMonth(currentMonth.getMonth() - 1)
                          setCurrentMonth(newMonth)
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <h4 className="font-medium text-gray-900">
                        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newMonth = new Date(currentMonth)
                          newMonth.setMonth(currentMonth.getMonth() + 1)
                          setCurrentMonth(newMonth)
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1" onMouseLeave={handleMouseUp}>
                      {generateCalendarDays().map((day, index) => {
                        const isSelected = selectedDates.some((date) => isSameDay(date, day.date))
                        const hasEntries = entries.some((entry) => isSameDay(new Date(entry.date), day.date))
                        const isInDragRange = isDateInDragRange(day.date)

                        return (
                          <button
                            key={index}
                            onClick={() => {
                              if (day.isCurrentMonth) {
                                handleDateClick(day.date)
                              }
                            }}
                            onMouseDown={() => {
                              if (day.isCurrentMonth) {
                                handleMouseDown(day.date)
                              }
                            }}
                            onMouseEnter={() => {
                              if (day.isCurrentMonth) {
                                handleMouseEnter(day.date)
                              }
                            }}
                            onMouseUp={handleMouseUp}
                            disabled={!day.isCurrentMonth}
                            className={`
                                h-8 w-8 text-xs rounded-lg transition-all duration-200 relative select-none
                                ${day.isCurrentMonth ? "hover:bg-gray-100" : "text-gray-300 cursor-not-allowed"}
                                ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                                ${isInDragRange && !isSelected ? "bg-blue-200 text-blue-800" : ""}
                                ${day.isToday && !isSelected && !isInDragRange ? "bg-blue-50 text-blue-600 font-medium" : ""}
                              `}
                          >
                            {day.date.getDate()}
                            {hasEntries && (
                              <div
                                className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-blue-500"}`}
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => exportEntries("csv")}
                        disabled={filteredEntries.length === 0}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button onClick={() => setShowCalendar(false)} className="flex-1">
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showSearchResults && (
            <div className="space-y-6 mb-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading your entries...</p>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery.trim() || selectedDates.length > 0
                      ? "Try adjusting your search or date filters"
                      : "Start by creating your first journal entry"}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Journal Entries ({filteredEntries.length})
                  </h3>
                  <div className="space-y-3">
                    {filteredEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md 
                                      transition-all duration-200 ease-out transform hover:scale-[1.01] group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <time className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {formatDate(entry.timestamp)}
                              </time>
                              {entry.isVoiceEntry && (
                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                    />
                                  </svg>
                                  Voice
                                </span>
                              )}
                            </div>
                            <p className="text-base font-medium text-gray-900 line-clamp-2 group-hover:line-clamp-none transition-all duration-200 mb-3">
                              {entry.summary}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Mood:</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full mr-1 ${
                                        i <= (entry.mood || 3) ? "bg-yellow-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-medium text-gray-700">{entry.mood || 3}/5</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Energy:</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full mr-1 ${
                                        i <= (entry.energy || 3) ? "bg-green-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-medium text-gray-700">{entry.energy || 3}/5</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Sleep:</span>
                                <span className="text-xs font-medium text-gray-700">{entry.sleep || 8}h</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Pain:</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full mr-1 ${
                                        i <= Math.ceil((entry.pain || 0) / 2) ? "bg-red-400" : "bg-gray-200"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-medium text-gray-700">{entry.pain || 0}/10</span>
                              </div>
                            </div>

                            {(entry.symptoms?.length > 0 || entry.meds?.length > 0) && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {entry.symptoms?.map((symptom, index) => (
                                  <span
                                    key={`symptom-${index}`}
                                    className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full"
                                  >
                                    {symptom}
                                  </span>
                                ))}
                                {entry.meds?.map((med, index) => (
                                  <span
                                    key={`med-${index}`}
                                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                  >
                                    💊 {med}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex items-center ml-4">
                            <button
                              onClick={() => handleEntryClick(entry)}
                              className="p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => handleDeleteEntry(entry, e)}
                              className="p-2 text-gray-400 hover:text-red-600 rounded-full bg-gray-100 hover:bg-red-50 transition-colors duration-200 ml-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
