export interface CaregiverInput {
  text: string
  timestamp: Date
  mode: "voice" | "text"
}

export interface ProcessingResult {
  structured: StructuredJournalData
  confidence: number
  uncertainties: string[]
  summary: CaregiverSummary
}

export interface CaregiverSummary {
  summary_text: string
  events: string[]
  symptoms: string[]
  medications: string[]
  mood: string
  sleep: string
  energy: string
  pain: string
  notes: string
}

export class JournalAIProcessor {
  static async processInput(input: CaregiverInput): Promise<ProcessingResult> {
    const text = input.text.toLowerCase()
    const structured: StructuredJournalData = {
      date: input.timestamp,
      time: input.timestamp.toLocaleTimeString(),
      event_type: this.extractEventType(text),
      symptoms: this.extractSymptoms(text),
      medications: this.extractMedications(text),
      mood: this.extractMood(text),
      sleep: this.extractSleep(text),
      energy: this.extractEnergy(text),
      pain: this.extractPain(text),
      free_notes: input.text, // Preserve exact caregiver words
    }

    const uncertainties = this.identifyUncertainties(text, structured)
    const confidence = this.calculateConfidence(structured, uncertainties)
    const summary = this.generateSummary(input.text, structured)

    return { structured, confidence, uncertainties, summary }
  }

  private static extractEventType(text: string): string | undefined {
    const eventPatterns = {
      appointment: /\b(appointment|visit|doctor|clinic|hospital)\b/i,
      medication: /\b(took|gave|medicine|medication|pill|dose)\b/i,
      symptom: /\b(pain|hurt|sick|fever|cough|tired|nausea)\b/i,
      sleep: /\b(sleep|nap|bedtime|woke|tired)\b/i,
      meal: /\b(ate|food|meal|breakfast|lunch|dinner)\b/i,
      behavior: /\b(mood|behavior|tantrum|happy|sad|angry)\b/i,
    }

    for (const [type, pattern] of Object.entries(eventPatterns)) {
      if (pattern.test(text)) return type
    }
    return undefined
  }

  private static extractSymptoms(text: string): string[] {
    const symptomPatterns = [
      /\b(fever|temperature)\b/i,
      /\b(pain|hurt|ache)\b/i,
      /\b(cough|coughing)\b/i,
      /\b(nausea|sick|vomit)\b/i,
      /\b(tired|fatigue|exhausted)\b/i,
      /\b(headache|head hurt)\b/i,
      /\b(seizure|episode)\b/i,
      /\b(rash|skin)\b/i,
    ]

    const symptoms: string[] = []
    symptomPatterns.forEach((pattern) => {
      const match = text.match(pattern)
      if (match) symptoms.push(match[0])
    })

    return [...new Set(symptoms)] // Remove duplicates
  }

  private static extractMedications(text: string): string[] {
    const medPatterns = [
      /\b(tylenol|acetaminophen)\b/i,
      /\b(ibuprofen|advil|motrin)\b/i,
      /\b(antibiotic|amoxicillin)\b/i,
      /\b(inhaler|albuterol)\b/i,
      /\b(vitamin|supplement)\b/i,
    ]

    const medications: string[] = []
    medPatterns.forEach((pattern) => {
      const match = text.match(pattern)
      if (match) medications.push(match[0])
    })

    // Look for "gave" or "took" followed by medication names
    const gavePattern = /\b(gave|took)\s+([a-zA-Z]+)/gi
    const gaveMatches = text.matchAll(gavePattern)
    for (const match of gaveMatches) {
      if (match[2]) medications.push(match[2])
    }

    return [...new Set(medications)]
  }

  private static extractMood(text: string): number | undefined {
    const moodPatterns = {
      5: /\b(great|excellent|wonderful|amazing|perfect)\b/i,
      4: /\b(good|happy|cheerful|positive|better)\b/i,
      3: /\b(okay|fine|normal|average|neutral)\b/i,
      2: /\b(sad|down|upset|difficult|challenging)\b/i,
      1: /\b(terrible|awful|horrible|worst|crying)\b/i,
    }

    for (const [score, pattern] of Object.entries(moodPatterns)) {
      if (pattern.test(text)) return Number.parseInt(score)
    }
    return undefined
  }

  private static extractSleep(text: string): number | undefined {
    const sleepPattern = /\b(\d+)\s*(hour|hr)s?\s*(sleep|slept)\b/i
    const match = text.match(sleepPattern)
    if (match) return Number.parseInt(match[1])

    const napPattern = /\bnap\b/i
    if (napPattern.test(text)) return 1 // Assume 1 hour nap

    return undefined
  }

  private static extractEnergy(text: string): number | undefined {
    const energyPatterns = {
      5: /\b(energetic|active|hyper|bouncing)\b/i,
      4: /\b(good energy|alert|playful)\b/i,
      3: /\b(normal|okay|average)\b/i,
      2: /\b(tired|low energy|sluggish)\b/i,
      1: /\b(exhausted|no energy|lethargic)\b/i,
    }

    for (const [score, pattern] of Object.entries(energyPatterns)) {
      if (pattern.test(text)) return Number.parseInt(score)
    }
    return undefined
  }

  private static extractPain(text: string): number | undefined {
    const painNumberPattern = /\bpain\s*(\d+)\b/i
    const match = text.match(painNumberPattern)
    if (match) return Math.min(Number.parseInt(match[1]), 10)

    const painPatterns = {
      10: /\b(excruciating|unbearable|worst)\b/i,
      8: /\b(severe|intense|terrible)\b/i,
      6: /\b(bad|strong|significant)\b/i,
      4: /\b(moderate|noticeable)\b/i,
      2: /\b(mild|slight|little)\b/i,
      0: /\b(no pain|pain free|fine)\b/i,
    }

    for (const [score, pattern] of Object.entries(painPatterns)) {
      if (pattern.test(text)) return Number.parseInt(score)
    }
    return undefined
  }

  private static identifyUncertainties(text: string, structured: StructuredJournalData): string[] {
    const uncertainties: string[] = []

    // Check for ambiguous time references
    if (text.includes("earlier") || text.includes("later") || text.includes("sometime")) {
      uncertainties.push("Time reference is ambiguous")
    }

    // Check for unclear medication dosages
    if (structured.medications.length > 0 && !text.match(/\d+\s*(mg|ml|tablet)/i)) {
      uncertainties.push("Medication dosage not specified")
    }

    // Check for vague symptom descriptions
    if (text.includes("not feeling well") || text.includes("off")) {
      uncertainties.push("Symptom description is vague")
    }

    return uncertainties
  }

  private static calculateConfidence(structured: StructuredJournalData, uncertainties: string[]): number {
    let confidence = 1.0

    // Reduce confidence for each uncertainty
    confidence -= uncertainties.length * 0.1

    // Reduce confidence if many fields are empty
    const filledFields = Object.values(structured).filter(
      (v) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true),
    ).length

    const totalFields = Object.keys(structured).length
    const fillRatio = filledFields / totalFields
    confidence *= fillRatio

    return Math.max(0, Math.min(1, confidence))
  }

  private static generateSummary(originalText: string, structured: StructuredJournalData): CaregiverSummary {
    const events = structured.event_type ? [structured.event_type] : []
    const symptoms = structured.symptoms || []
    const medications = structured.medications || []

    // Generate supportive, plain-language summary
    let summaryText = "You logged important information about your care experience. "

    if (symptoms.length > 0) {
      summaryText += `You noted ${symptoms.length === 1 ? "a symptom" : "some symptoms"} that you're monitoring. `
    }

    if (medications.length > 0) {
      summaryText += `Medication information was recorded for your tracking. `
    } else if (structured.mood || structured.energy || structured.sleep) {
      summaryText += `You captured helpful details about mood, energy, or sleep patterns. `
    } else {
      summaryText += `Your notes have been saved for future reference. `
    }

    return {
      summary_text: summaryText.trim(),
      events,
      symptoms,
      medications,
      mood: structured.mood ? `${structured.mood}/5` : "",
      sleep: structured.sleep ? `${structured.sleep} hours` : "",
      energy: structured.energy ? `${structured.energy}/5` : "",
      pain: structured.pain ? `${structured.pain}/10` : "",
      notes: originalText,
    }
  }
}

import type { StructuredJournalData } from "@/types/journal"

export class CaregiverSummaryGenerator {
  static async generateFromText(text: string): Promise<CaregiverSummary> {
    const input: CaregiverInput = {
      text,
      timestamp: new Date(),
      mode: "text",
    }

    const result = await JournalAIProcessor.processInput(input)
    return result.summary
  }

  static async generateFromVoice(transcript: string): Promise<CaregiverSummary> {
    const input: CaregiverInput = {
      text: transcript,
      timestamp: new Date(),
      mode: "voice",
    }

    const result = await JournalAIProcessor.processInput(input)
    return result.summary
  }
}
