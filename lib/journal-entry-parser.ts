import { JournalAIProcessor, type CaregiverInput, type ProcessingResult } from "./journal-ai-processor"
import { JournalService } from "./journal-service"
import type { JournalEntry, StructuredJournalData } from "@/types/journal"

export interface ParsedJournalEntry {
  entry: JournalEntry
  confidence: number
  uncertainties: string[]
  originalInput: string
}

export class JournalEntryParser {
  /**
   * Parse caregiver input into a structured journal entry
   */
  static async parseInput(
    input: string,
    mode: "voice" | "text" = "text",
    existingEntryId?: string,
  ): Promise<ParsedJournalEntry> {
    // Process input through AI processor
    const caregiverInput: CaregiverInput = {
      text: input,
      timestamp: new Date(),
      mode,
    }

    const processingResult: ProcessingResult = await JournalAIProcessor.processInput(caregiverInput)

    // Convert structured data to journal entry
    const journalEntry = this.structuredDataToJournalEntry(processingResult.structured, input, mode, existingEntryId)

    return {
      entry: journalEntry,
      confidence: processingResult.confidence,
      uncertainties: processingResult.uncertainties,
      originalInput: input,
    }
  }

  /**
   * Parse and save journal entry in one step
   */
  static async parseAndSave(
    input: string,
    mode: "voice" | "text" = "text",
    existingEntryId?: string,
  ): Promise<ParsedJournalEntry> {
    const parsed = await this.parseInput(input, mode, existingEntryId)

    try {
      const savedEntry = await JournalService.saveEntry(parsed.entry)
      return {
        ...parsed,
        entry: savedEntry,
      }
    } catch (error) {
      console.error("Failed to save parsed journal entry:", error)
      throw new Error("Failed to save journal entry. Please try again.")
    }
  }

  /**
   * Update existing journal entry with new parsed data
   */
  static async updateEntry(
    entryId: string,
    newInput: string,
    mode: "voice" | "text" = "text",
  ): Promise<ParsedJournalEntry> {
    const existingEntry = await JournalService.getEntry(entryId)
    if (!existingEntry) {
      throw new Error("Entry not found")
    }

    // Parse new input
    const parsed = await this.parseInput(newInput, mode, entryId)

    // Merge with existing entry data
    const updatedEntry: JournalEntry = {
      ...existingEntry,
      ...parsed.entry,
      id: entryId, // Ensure we keep the original ID
      createdAt: existingEntry.createdAt, // Preserve original creation time
      updatedAt: new Date(),
    }

    try {
      const savedEntry = await JournalService.saveEntry(updatedEntry)
      return {
        ...parsed,
        entry: savedEntry,
      }
    } catch (error) {
      console.error("Failed to update journal entry:", error)
      throw new Error("Failed to update journal entry. Please try again.")
    }
  }

  /**
   * Convert structured data to journal entry format
   */
  private static structuredDataToJournalEntry(
    structured: StructuredJournalData,
    originalInput: string,
    mode: "voice" | "text",
    existingEntryId?: string,
  ): JournalEntry {
    const now = new Date()

    // Generate summary from structured data and free notes
    const summary = this.generateSummary(structured, originalInput)

    // Generate tags from event type and symptoms
    const tags = this.generateTags(structured)

    return {
      id: existingEntryId || crypto.randomUUID(),
      date: structured.date || now,
      mode,
      transcript: mode === "voice" ? originalInput : undefined,
      summary,
      tags,
      event_type: structured.event_type,
      free_notes: structured.free_notes,
      mood: structured.mood,
      sleep: structured.sleep,
      energy: structured.energy,
      pain: structured.pain,
      meds: structured.medications,
      symptoms: structured.symptoms,
      attachments: [],
      createdAt: existingEntryId ? now : now, // Will be overridden by existing entry if updating
      updatedAt: existingEntryId ? now : undefined,
    }
  }

  /**
   * Generate a concise summary from structured data
   */
  private static generateSummary(structured: StructuredJournalData, originalInput: string): string {
    const parts: string[] = []

    // Add event type if available
    if (structured.event_type) {
      parts.push(structured.event_type.charAt(0).toUpperCase() + structured.event_type.slice(1))
    }

    // Add key symptoms
    if (structured.symptoms.length > 0) {
      parts.push(`Symptoms: ${structured.symptoms.slice(0, 2).join(", ")}`)
    }

    // Add medications if mentioned
    if (structured.medications.length > 0) {
      parts.push(`Meds: ${structured.medications.slice(0, 2).join(", ")}`)
    }

    // Add mood/pain if significant
    if (structured.mood && (structured.mood <= 2 || structured.mood >= 4)) {
      const moodText = structured.mood <= 2 ? "difficult mood" : "good mood"
      parts.push(moodText)
    }

    if (structured.pain && structured.pain >= 6) {
      parts.push(`pain level ${structured.pain}`)
    }

    // If no structured data, use first 50 characters of original input
    if (parts.length === 0) {
      return originalInput.slice(0, 50) + (originalInput.length > 50 ? "..." : "")
    }

    return parts.join(" • ")
  }

  /**
   * Generate tags from structured data
   */
  private static generateTags(structured: StructuredJournalData): string[] {
    const tags: string[] = []

    // Add event type as tag
    if (structured.event_type) {
      tags.push(structured.event_type)
    }

    // Add symptom tags
    structured.symptoms.forEach((symptom) => {
      if (symptom.length > 0) {
        tags.push(symptom.toLowerCase())
      }
    })

    // Add medication tags
    structured.medications.forEach((med) => {
      if (med.length > 0) {
        tags.push(med.toLowerCase())
      }
    })

    // Add mood tags
    if (structured.mood) {
      if (structured.mood <= 2) tags.push("difficult")
      if (structured.mood >= 4) tags.push("positive")
    }

    // Add pain tags
    if (structured.pain) {
      if (structured.pain >= 7) tags.push("severe-pain")
      else if (structured.pain >= 4) tags.push("moderate-pain")
    }

    return [...new Set(tags)] // Remove duplicates
  }

  /**
   * Validate parsed entry before saving
   */
  static validateEntry(entry: JournalEntry): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!entry.free_notes || entry.free_notes.trim().length === 0) {
      errors.push("Entry must contain caregiver's notes")
    }

    if (!entry.summary || entry.summary.trim().length === 0) {
      errors.push("Entry must have a summary")
    }

    if (entry.mood && (entry.mood < 1 || entry.mood > 5)) {
      errors.push("Mood must be between 1 and 5")
    }

    if (entry.pain && (entry.pain < 0 || entry.pain > 10)) {
      errors.push("Pain must be between 0 and 10")
    }

    if (entry.sleep && entry.sleep < 0) {
      errors.push("Sleep hours cannot be negative")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
