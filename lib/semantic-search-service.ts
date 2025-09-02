import type { JournalEntry } from "@/types/journal"

export interface SearchResult {
  entry: JournalEntry
  relevanceScore: number
  matchedFields: string[]
  highlights: string[]
}

export interface SearchInsight {
  pattern: string
  frequency: number
  suggestion: string
}

export class SemanticSearchService {
  private synonyms: Record<string, string[]> = {
    sleep: ["rest", "slumber", "nap", "bedtime", "night", "tired", "exhausted"],
    pain: ["hurt", "ache", "sore", "discomfort", "agony", "suffering"],
    mood: ["feeling", "emotion", "spirit", "attitude", "disposition"],
    energy: ["vitality", "strength", "vigor", "stamina", "fatigue", "tired"],
    medication: ["med", "pill", "drug", "medicine", "treatment", "dose"],
    symptom: ["sign", "indication", "problem", "issue", "complaint"],
    headache: ["migraine", "head pain", "head hurt"],
    stomach: ["belly", "tummy", "abdomen", "gut"],
    anxiety: ["worry", "stress", "nervous", "anxious", "panic"],
    depression: ["sad", "down", "low", "blue", "depressed"],
  }

  private queryPatterns = [
    { pattern: /show me.*poor sleep|bad sleep|sleepless/i, field: "sleep", operator: "<", value: 6 },
    { pattern: /show me.*good sleep|great sleep/i, field: "sleep", operator: ">", value: 7 },
    { pattern: /show me.*high pain|severe pain/i, field: "pain", operator: ">", value: 7 },
    { pattern: /show me.*low mood|sad|depressed/i, field: "mood", operator: "<", value: 3 },
    { pattern: /show me.*good mood|happy|great mood/i, field: "mood", operator: ">", value: 3 },
    { pattern: /show me.*low energy|tired|exhausted/i, field: "energy", operator: "<", value: 3 },
    { pattern: /show me.*high energy|energetic/i, field: "energy", operator: ">", value: 3 },
    { pattern: /headache.*after.*meal|meal.*headache/i, field: "symptoms", contains: "headache" },
    { pattern: /medication.*(\w+)/i, field: "meds", contains: "$1" },
    { pattern: /symptom.*(\w+)/i, field: "symptoms", contains: "$1" },
  ]

  async searchEntries(query: string, entries: JournalEntry[]): Promise<SearchResult[]> {
    const normalizedQuery = query.toLowerCase()
    const results: SearchResult[] = []

    for (const entry of entries) {
      const score = this.calculateRelevanceScore(normalizedQuery, entry)
      if (score > 0) {
        const matchedFields = this.getMatchedFields(normalizedQuery, entry)
        const highlights = this.generateHighlights(normalizedQuery, entry)

        results.push({
          entry,
          relevanceScore: score,
          matchedFields,
          highlights,
        })
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }

  private calculateRelevanceScore(query: string, entry: JournalEntry): number {
    let score = 0
    const queryWords = query.split(" ").filter((word) => word.length > 2)

    // Check for pattern matches first (highest weight)
    for (const pattern of this.queryPatterns) {
      if (pattern.pattern.test(query)) {
        if (pattern.field === "sleep" && entry.sleep !== undefined) {
          if (pattern.operator === "<" && entry.sleep < pattern.value!) score += 50
          if (pattern.operator === ">" && entry.sleep > pattern.value!) score += 50
        }
        if (pattern.field === "pain" && entry.pain !== undefined) {
          if (pattern.operator === "<" && entry.pain < pattern.value!) score += 50
          if (pattern.operator === ">" && entry.pain > pattern.value!) score += 50
        }
        if (pattern.field === "mood" && entry.mood !== undefined) {
          if (pattern.operator === "<" && entry.mood < pattern.value!) score += 50
          if (pattern.operator === ">" && entry.mood > pattern.value!) score += 50
        }
        if (pattern.field === "energy" && entry.energy !== undefined) {
          if (pattern.operator === "<" && entry.energy < pattern.value!) score += 50
          if (pattern.operator === ">" && entry.energy > pattern.value!) score += 50
        }
        if (pattern.contains && pattern.field === "symptoms") {
          if (entry.symptoms.some((s) => s.toLowerCase().includes(pattern.contains!.toLowerCase()))) {
            score += 40
          }
        }
        if (pattern.contains && pattern.field === "meds") {
          if (entry.meds.some((m) => m.toLowerCase().includes(pattern.contains!.toLowerCase()))) {
            score += 40
          }
        }
      }
    }

    // Text matching with synonyms
    for (const word of queryWords) {
      const synonymList = this.getSynonyms(word)

      // Check in free_notes (highest text weight)
      if (this.textContainsWords(entry.free_notes, [word, ...synonymList])) {
        score += 20
      }

      // Check in summary
      if (this.textContainsWords(entry.summary, [word, ...synonymList])) {
        score += 15
      }

      // Check in symptoms
      if (entry.symptoms.some((s) => this.textContainsWords(s, [word, ...synonymList]))) {
        score += 10
      }

      // Check in medications
      if (entry.meds.some((m) => this.textContainsWords(m, [word, ...synonymList]))) {
        score += 10
      }

      // Check in tags
      if (entry.tags.some((t) => this.textContainsWords(t, [word, ...synonymList]))) {
        score += 8
      }

      // Check in event_type
      if (entry.event_type && this.textContainsWords(entry.event_type, [word, ...synonymList])) {
        score += 5
      }
    }

    return score
  }

  private getSynonyms(word: string): string[] {
    return this.synonyms[word.toLowerCase()] || []
  }

  private textContainsWords(text: string, words: string[]): boolean {
    const lowerText = text.toLowerCase()
    return words.some((word) => lowerText.includes(word.toLowerCase()))
  }

  private getMatchedFields(query: string, entry: JournalEntry): string[] {
    const fields: string[] = []
    const queryWords = query.toLowerCase().split(" ")

    if (queryWords.some((word) => entry.free_notes.toLowerCase().includes(word))) {
      fields.push("notes")
    }
    if (queryWords.some((word) => entry.summary.toLowerCase().includes(word))) {
      fields.push("summary")
    }
    if (entry.symptoms.some((s) => queryWords.some((word) => s.toLowerCase().includes(word)))) {
      fields.push("symptoms")
    }
    if (entry.meds.some((m) => queryWords.some((word) => m.toLowerCase().includes(word)))) {
      fields.push("medications")
    }

    return fields
  }

  private generateHighlights(query: string, entry: JournalEntry): string[] {
    const highlights: string[] = []
    const queryWords = query
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 2)

    // Generate highlights from free_notes
    const sentences = entry.free_notes.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    for (const sentence of sentences) {
      if (queryWords.some((word) => sentence.toLowerCase().includes(word))) {
        highlights.push(sentence.trim())
      }
    }

    return highlights.slice(0, 3) // Limit to 3 highlights
  }

  generateSearchInsights(results: SearchResult[]): SearchInsight[] {
    const insights: SearchInsight[] = []

    if (results.length === 0) {
      return [
        {
          pattern: "No matches found",
          frequency: 0,
          suggestion: "Try using different keywords or check your spelling",
        },
      ]
    }

    // Analyze patterns in results
    const symptomCounts: Record<string, number> = {}
    const medCounts: Record<string, number> = {}

    results.forEach((result) => {
      result.entry.symptoms.forEach((symptom) => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })
      result.entry.meds.forEach((med) => {
        medCounts[med] = (medCounts[med] || 0) + 1
      })
    })

    // Generate insights
    const topSymptoms = Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    if (topSymptoms.length > 0) {
      insights.push({
        pattern: `Most common symptoms: ${topSymptoms.map(([s]) => s).join(", ")}`,
        frequency: topSymptoms[0][1],
        suggestion: "Consider tracking triggers for these recurring symptoms",
      })
    }

    const topMeds = Object.entries(medCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)

    if (topMeds.length > 0) {
      insights.push({
        pattern: `Frequently mentioned medications: ${topMeds.map(([m]) => m).join(", ")}`,
        frequency: topMeds[0][1],
        suggestion: "Track effectiveness and side effects of these medications",
      })
    }

    return insights
  }

  getSuggestedQueries(): string[] {
    return [
      "Show me all nights with poor sleep",
      "Find entries with high pain levels",
      "Show me when mood was low",
      "Find headaches after meals",
      "Show me medication effectiveness",
      "Find patterns in symptoms",
      "Show me energy levels over time",
      "Find sleep and mood correlation",
    ]
  }
}
