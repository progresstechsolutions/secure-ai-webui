export interface JournalEntry {
  id: string
  date: Date
  mode: "voice" | "text"
  transcript?: string
  summary: string
  tags: string[]
  event_type?: string // Type of event (appointment, symptom, medication, etc.)
  free_notes: string // Caregiver's exact words preserved
  mood?: number // 1-5 scale
  sleep?: number // hours
  energy?: number // 1-5 scale
  pain?: number // 1-10 scale
  meds: string[]
  symptoms: string[]
  attachments: string[]
  createdAt: Date
  updatedAt?: Date
  childId?: string // Associate entry with specific child
  content?: string // Alternative to summary for simple text content
  timestamp?: string // ISO string timestamp
  images?: string[] // Alternative to attachments for image URLs
  isVoiceEntry?: boolean // Flag for voice-recorded entries
}

export interface Insight {
  id: string
  period: "week" | "month" | "quarter"
  highlights: string[]
  trends: string[]
  anomalies: string[]
}

export type LoggingMode = "voice" | "text"
export type LoggingStep = "mode" | "content" | "details" | "review"

export interface StructuredJournalData {
  date?: Date
  time?: string
  event_type?: string
  symptoms: string[]
  medications: string[]
  mood?: number
  sleep?: number
  energy?: number
  pain?: number
  free_notes: string
}
