import type { JournalEntry } from "@/types/journal"

const STORAGE_KEY = "caregene_journal_entries"

export class JournalService {
  static async getEntries(): Promise<JournalEntry[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const entries = JSON.parse(stored)
      return entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
        createdAt: new Date(entry.createdAt),
        updatedAt: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
      }))
    } catch (error) {
      console.error("Failed to load journal entries:", error)
      return []
    }
  }

  static async getEntry(id: string): Promise<JournalEntry | null> {
    const entries = await this.getEntries()
    return entries.find((entry) => entry.id === id) || null
  }

  static async saveEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    const entries = await this.getEntries()

    const now = new Date()
    const savedEntry: JournalEntry = {
      id: entry.id || crypto.randomUUID(),
      date: entry.date || now,
      mode: entry.mode || "text",
      transcript: entry.transcript,
      summary: entry.summary || (entry as any).content || "",
      tags: entry.tags || [],
      event_type: entry.event_type,
      free_notes: entry.free_notes || (entry as any).content || entry.summary || "",
      mood: entry.mood,
      sleep: entry.sleep,
      energy: entry.energy,
      pain: entry.pain,
      meds: entry.meds || [],
      symptoms: entry.symptoms || [],
      attachments: entry.attachments || (entry as any).images || [],
      createdAt: entry.createdAt || now,
      updatedAt: entry.id ? now : undefined, // Only set updatedAt if editing existing entry
      childId: (entry as any).childId,
      timestamp: (entry as any).timestamp,
      isVoiceEntry: (entry as any).isVoiceEntry,
    }

    const existingIndex = entries.findIndex((e) => e.id === savedEntry.id)
    if (existingIndex >= 0) {
      entries[existingIndex] = savedEntry
    } else {
      entries.unshift(savedEntry) // Add new entries to the beginning
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
      return savedEntry
    } catch (error) {
      console.error("Failed to save journal entry:", error)
      throw new Error("Failed to save entry. Please try again.")
    }
  }

  static async addEntry(entry: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.saveEntry(entry)
  }

  static async deleteEntry(id: string): Promise<void> {
    const entries = await this.getEntries()
    const filtered = entries.filter((entry) => entry.id !== id)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error("Failed to delete journal entry:", error)
      throw new Error("Failed to delete entry. Please try again.")
    }
  }

  static async searchEntries(query: string): Promise<JournalEntry[]> {
    const entries = await this.getEntries()
    const lowercaseQuery = query.toLowerCase()

    return entries.filter(
      (entry) =>
        entry.summary.toLowerCase().includes(lowercaseQuery) ||
        entry.transcript?.toLowerCase().includes(lowercaseQuery) ||
        entry.free_notes?.toLowerCase().includes(lowercaseQuery) ||
        entry.event_type?.toLowerCase().includes(lowercaseQuery) ||
        entry.symptoms.some((symptom) => symptom.toLowerCase().includes(lowercaseQuery)) ||
        entry.meds.some((med) => med.toLowerCase().includes(lowercaseQuery)) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }
}
