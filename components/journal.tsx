"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ArrowLeft, Plus, CalendarIcon, Edit, Save, Trash2, FileText } from "lucide-react"

interface JournalProps {
  onBack: () => void
}

interface JournalEntry {
  id: string
  date: Date
  content: string
}

const mockEntries: JournalEntry[] = [
  {
    id: "j1",
    date: new Date(2024, 6, 15), // July 15, 2024
    content:
      "Today was challenging with managing my child's MSUD diet. Feeling a bit overwhelmed with meal planning, but we found a new low-leucine snack recipe that they actually liked! Small wins.",
  },
  {
    id: "j2",
    date: new Date(2024, 6, 10), // July 10, 2024
    content:
      "Attended a virtual support group for Batten Disease. It was so helpful to hear from other parents facing similar struggles. Feeling less alone.",
  },
  {
    id: "j3",
    date: new Date(2024, 5, 28), // June 28, 2024
    content:
      "Celebrated a small milestone today: my son with SMA was able to hold his head up for 30 seconds longer during therapy! So proud of his progress.",
  },
  {
    id: "j4",
    date: new Date(2024, 5, 20), // June 20, 2024
    content:
      "Had a productive call with the genetic counselor regarding our family's Tay-Sachs carrier status. Feeling more informed about the risks and options.",
  },
  {
    id: "j5",
    date: new Date(2024, 4, 5), // May 5, 2024
    content:
      "Started a new physical therapy routine for my Huntington's Disease symptoms. It's tough, but I'm committed to staying as active as possible.",
  },
]

export function Journal({ onBack }: JournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentEntryContent, setCurrentEntryContent] = useState("")
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  const entryForSelectedDate = entries.find((entry) => {
    if (!selectedDate) return false
    return entry.date.toDateString() === selectedDate.toDateString()
  })

  useEffect(() => {
    if (entryForSelectedDate) {
      setCurrentEntryContent(entryForSelectedDate.content)
      setEditingEntryId(entryForSelectedDate.id)
    } else {
      setCurrentEntryContent("")
      setEditingEntryId(null)
    }
  }, [selectedDate, entryForSelectedDate])

  const handleSaveEntry = () => {
    if (!selectedDate || !currentEntryContent.trim()) {
      alert("Please select a date and write your journal entry.")
      return
    }

    if (editingEntryId) {
      // Update existing entry
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntryId ? { ...entry, content: currentEntryContent.trim(), date: selectedDate } : entry,
        ),
      )
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: `j${Date.now()}`,
        date: selectedDate,
        content: currentEntryContent.trim(),
      }
      setEntries((prev) => [...prev, newEntry])
    }
    setEditingEntryId(null) // Exit editing mode
  }

  const handleDeleteEntry = () => {
    if (editingEntryId && confirm("Are you sure you want to delete this entry?")) {
      setEntries((prev) => prev.filter((entry) => entry.id !== editingEntryId))
      setCurrentEntryContent("")
      setEditingEntryId(null)
      setSelectedDate(undefined) // Clear selected date after deletion
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold gradient-text">My Journal</h1>
            </div>
            <Button
              onClick={() => {
                setSelectedDate(new Date())
                setCurrentEntryContent("")
                setEditingEntryId(null)
              }}
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar and Entry Input */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" /> Select Date & Write
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="journal-content">
                Journal Entry for {selectedDate ? format(selectedDate, "PPP") : "Selected Date"}
              </Label>
              <Textarea
                id="journal-content"
                placeholder="Write about your day, thoughts, or experiences..."
                value={currentEntryContent}
                onChange={(e) => setCurrentEntryContent(e.target.value)}
                rows={8}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {editingEntryId && (
                <Button variant="destructive" onClick={handleDeleteEntry}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button onClick={handleSaveEntry}>
                <Save className="h-4 w-4 mr-2" />
                {editingEntryId ? "Save Changes" : "Save Entry"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Past Entries List */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2" /> Past Entries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No journal entries yet.</p>
            ) : (
              [...entries]
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .map((entry) => (
                  <div key={entry.id} className="border p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{format(entry.date, "PPP")}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDate(entry.date)
                          setCurrentEntryContent(entry.content)
                          setEditingEntryId(entry.id)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
