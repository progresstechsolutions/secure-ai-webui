import type { JournalEntry } from "@/types/journal"

export interface AdvancedCorrelation {
  id: string
  type: "positive" | "negative" | "neutral"
  strength: number // 0-1
  description: string
  field1: string
  field2: string
  confidence: number
  timelag?: number // days
  significance: "high" | "medium" | "low"
  actionable_insight: string
  sample_size: number
}

export interface SymptomMedicationCorrelation {
  symptom: string
  medication: string
  correlation_type: "helps" | "worsens" | "neutral"
  effectiveness_score: number
  confidence: number
  time_to_effect?: number // hours
  description: string
}

export interface TriggerPattern {
  trigger: string
  triggered_symptoms: string[]
  probability: number
  time_window: number // hours
  confidence: number
  description: string
}

export class CorrelationDetectionService {
  static detectAdvancedCorrelations(entries: JournalEntry[]): AdvancedCorrelation[] {
    if (entries.length < 5) {
      return []
    }

    const correlations: AdvancedCorrelation[] = []
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Enhanced mood-pain correlation with time lag analysis
    const moodPainCorr = this.analyzeTimelaggedCorrelation(sortedEntries, "mood", "pain", [0, 1, 2])
    if (moodPainCorr.strength > 0.3) {
      correlations.push({
        id: "mood-pain",
        type: moodPainCorr.correlation < 0 ? "negative" : "positive",
        strength: moodPainCorr.strength,
        description: this.generateCorrelationDescription("mood", "pain", moodPainCorr),
        field1: "mood",
        field2: "pain",
        confidence: moodPainCorr.strength,
        timelag: moodPainCorr.optimalLag,
        significance: this.getSignificanceLevel(moodPainCorr.strength, sortedEntries.length),
        actionable_insight: this.generateActionableInsight("mood", "pain", moodPainCorr),
        sample_size: sortedEntries.length,
      })
    }

    // Sleep-energy correlation
    const sleepEnergyCorr = this.analyzeTimelaggedCorrelation(sortedEntries, "sleep", "energy", [0, 1])
    if (sleepEnergyCorr.strength > 0.3) {
      correlations.push({
        id: "sleep-energy",
        type: sleepEnergyCorr.correlation > 0 ? "positive" : "negative",
        strength: sleepEnergyCorr.strength,
        description: this.generateCorrelationDescription("sleep", "energy", sleepEnergyCorr),
        field1: "sleep",
        field2: "energy",
        confidence: sleepEnergyCorr.strength,
        timelag: sleepEnergyCorr.optimalLag,
        significance: this.getSignificanceLevel(sleepEnergyCorr.strength, sortedEntries.length),
        actionable_insight: this.generateActionableInsight("sleep", "energy", sleepEnergyCorr),
        sample_size: sortedEntries.length,
      })
    }

    // Pain-sleep correlation
    const painSleepCorr = this.analyzeTimelaggedCorrelation(sortedEntries, "pain", "sleep", [0, 1])
    if (painSleepCorr.strength > 0.25) {
      correlations.push({
        id: "pain-sleep",
        type: painSleepCorr.correlation < 0 ? "negative" : "positive",
        strength: painSleepCorr.strength,
        description: this.generateCorrelationDescription("pain", "sleep", painSleepCorr),
        field1: "pain",
        field2: "sleep",
        confidence: painSleepCorr.strength,
        timelag: painSleepCorr.optimalLag,
        significance: this.getSignificanceLevel(painSleepCorr.strength, sortedEntries.length),
        actionable_insight: this.generateActionableInsight("pain", "sleep", painSleepCorr),
        sample_size: sortedEntries.length,
      })
    }

    // Energy-mood correlation
    const energyMoodCorr = this.analyzeTimelaggedCorrelation(sortedEntries, "energy", "mood", [0, 1])
    if (energyMoodCorr.strength > 0.3) {
      correlations.push({
        id: "energy-mood",
        type: energyMoodCorr.correlation > 0 ? "positive" : "negative",
        strength: energyMoodCorr.strength,
        description: this.generateCorrelationDescription("energy", "mood", energyMoodCorr),
        field1: "energy",
        field2: "mood",
        confidence: energyMoodCorr.strength,
        timelag: energyMoodCorr.optimalLag,
        significance: this.getSignificanceLevel(energyMoodCorr.strength, sortedEntries.length),
        actionable_insight: this.generateActionableInsight("energy", "mood", energyMoodCorr),
        sample_size: sortedEntries.length,
      })
    }

    return correlations.sort((a, b) => b.strength - a.strength)
  }

  static detectSymptomMedicationCorrelations(entries: JournalEntry[]): SymptomMedicationCorrelation[] {
    if (entries.length < 10) {
      return []
    }

    const correlations: SymptomMedicationCorrelation[] = []
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Get all unique symptoms and medications
    const allSymptoms = new Set<string>()
    const allMedications = new Set<string>()

    sortedEntries.forEach((entry) => {
      entry.symptoms.forEach((symptom) => allSymptoms.add(symptom))
      entry.meds.forEach((med) => allMedications.add(med))
    })

    // Analyze each symptom-medication pair
    allSymptoms.forEach((symptom) => {
      allMedications.forEach((medication) => {
        const correlation = this.analyzeSymptomMedicationRelationship(sortedEntries, symptom, medication)
        if (correlation.confidence > 0.4) {
          correlations.push(correlation)
        }
      })
    })

    return correlations.sort((a, b) => b.confidence - a.confidence).slice(0, 10)
  }

  static detectTriggerPatterns(entries: JournalEntry[]): TriggerPattern[] {
    if (entries.length < 15) {
      return []
    }

    const patterns: TriggerPattern[] = []
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Analyze medication as triggers for symptoms
    const allMedications = new Set<string>()
    const allSymptoms = new Set<string>()

    sortedEntries.forEach((entry) => {
      entry.meds.forEach((med) => allMedications.add(med))
      entry.symptoms.forEach((symptom) => allSymptoms.add(symptom))
    })

    allMedications.forEach((medication) => {
      const pattern = this.analyzeTriggerPattern(sortedEntries, medication, Array.from(allSymptoms))
      if (pattern.confidence > 0.3) {
        patterns.push(pattern)
      }
    })

    // Analyze high pain as trigger for other symptoms
    const highPainPattern = this.analyzeHighPainTriggers(sortedEntries, Array.from(allSymptoms))
    if (highPainPattern.confidence > 0.3) {
      patterns.push(highPainPattern)
    }

    return patterns.sort((a, b) => b.confidence - a.confidence).slice(0, 8)
  }

  private static analyzeTimelaggedCorrelation(
    entries: JournalEntry[],
    field1: keyof JournalEntry,
    field2: keyof JournalEntry,
    lags: number[],
  ): { correlation: number; strength: number; optimalLag: number } {
    let bestCorrelation = { correlation: 0, strength: 0, optimalLag: 0 }

    lags.forEach((lag) => {
      const pairs: Array<[number, number]> = []

      for (let i = lag; i < entries.length; i++) {
        const currentEntry = entries[i]
        const laggedEntry = entries[i - lag]

        const val1 = currentEntry[field1] as number
        const val2 = laggedEntry[field2] as number

        if (val1 !== undefined && val1 !== null && val2 !== undefined && val2 !== null) {
          pairs.push([val1, val2])
        }
      }

      if (pairs.length >= 3) {
        const correlation = this.calculatePearsonCorrelation(
          pairs.map((p) => p[0]),
          pairs.map((p) => p[1]),
        )

        if (Math.abs(correlation.correlation) > Math.abs(bestCorrelation.correlation)) {
          bestCorrelation = {
            correlation: correlation.correlation,
            strength: correlation.strength,
            optimalLag: lag,
          }
        }
      }
    })

    return bestCorrelation
  }

  private static analyzeSymptomMedicationRelationship(
    entries: JournalEntry[],
    symptom: string,
    medication: string,
  ): SymptomMedicationCorrelation {
    const relevantEntries = entries.filter(
      (entry) => entry.symptoms.includes(symptom) || entry.meds.includes(medication),
    )

    let helpfulCount = 0
    let worseningCount = 0
    let totalObservations = 0

    for (let i = 1; i < relevantEntries.length; i++) {
      const currentEntry = relevantEntries[i]
      const previousEntry = relevantEntries[i - 1]

      const hadMedPreviously = previousEntry.meds.includes(medication)
      const hasSymptomNow = currentEntry.symptoms.includes(symptom)
      const hadSymptomPreviously = previousEntry.symptoms.includes(symptom)

      if (hadMedPreviously && hadSymptomPreviously) {
        totalObservations++
        if (!hasSymptomNow) {
          helpfulCount++
        } else if (hasSymptomNow) {
          // Check if symptom intensity might have increased (simplified)
          worseningCount++
        }
      }
    }

    const effectiveness = totalObservations > 0 ? helpfulCount / totalObservations : 0
    const confidence = Math.min(totalObservations / 5, 1) * (totalObservations > 2 ? 1 : 0.5)

    let correlationType: "helps" | "worsens" | "neutral" = "neutral"
    if (effectiveness > 0.6) correlationType = "helps"
    else if (effectiveness < 0.3 && worseningCount > helpfulCount) correlationType = "worsens"

    return {
      symptom,
      medication,
      correlation_type: correlationType,
      effectiveness_score: effectiveness,
      confidence,
      description: this.generateSymptomMedDescription(symptom, medication, correlationType, effectiveness),
    }
  }

  private static analyzeTriggerPattern(
    entries: JournalEntry[],
    trigger: string,
    possibleSymptoms: string[],
  ): TriggerPattern {
    const triggeredSymptoms: string[] = []
    let totalTriggerEvents = 0
    let successfulTriggers = 0

    for (let i = 0; i < entries.length - 1; i++) {
      const currentEntry = entries[i]
      const nextEntry = entries[i + 1]

      if (currentEntry.meds.includes(trigger)) {
        totalTriggerEvents++
        let hasNewSymptoms = false

        possibleSymptoms.forEach((symptom) => {
          if (!currentEntry.symptoms.includes(symptom) && nextEntry.symptoms.includes(symptom)) {
            if (!triggeredSymptoms.includes(symptom)) {
              triggeredSymptoms.push(symptom)
            }
            hasNewSymptoms = true
          }
        })

        if (hasNewSymptoms) {
          successfulTriggers++
        }
      }
    }

    const probability = totalTriggerEvents > 0 ? successfulTriggers / totalTriggerEvents : 0
    const confidence = Math.min(totalTriggerEvents / 5, 1) * (totalTriggerEvents > 2 ? 1 : 0.5)

    return {
      trigger,
      triggered_symptoms: triggeredSymptoms.slice(0, 3),
      probability,
      time_window: 24,
      confidence,
      description: `${trigger} may trigger ${triggeredSymptoms.slice(0, 2).join(", ")} in ${Math.round(probability * 100)}% of cases`,
    }
  }

  private static analyzeHighPainTriggers(entries: JournalEntry[], possibleSymptoms: string[]): TriggerPattern {
    const triggeredSymptoms: string[] = []
    let highPainEvents = 0
    let successfulTriggers = 0

    for (let i = 0; i < entries.length - 1; i++) {
      const currentEntry = entries[i]
      const nextEntry = entries[i + 1]

      if (currentEntry.pain && currentEntry.pain >= 7) {
        highPainEvents++
        let hasNewSymptoms = false

        possibleSymptoms.forEach((symptom) => {
          if (!currentEntry.symptoms.includes(symptom) && nextEntry.symptoms.includes(symptom)) {
            if (!triggeredSymptoms.includes(symptom)) {
              triggeredSymptoms.push(symptom)
            }
            hasNewSymptoms = true
          }
        })

        if (hasNewSymptoms) {
          successfulTriggers++
        }
      }
    }

    const probability = highPainEvents > 0 ? successfulTriggers / highPainEvents : 0
    const confidence = Math.min(highPainEvents / 3, 1) * (highPainEvents > 1 ? 1 : 0.3)

    return {
      trigger: "High Pain (7+)",
      triggered_symptoms: triggeredSymptoms.slice(0, 3),
      probability,
      time_window: 24,
      confidence,
      description: `High pain levels may trigger ${triggeredSymptoms.slice(0, 2).join(", ")} in ${Math.round(probability * 100)}% of cases`,
    }
  }

  private static calculatePearsonCorrelation(x: number[], y: number[]): { correlation: number; strength: number } {
    if (x.length !== y.length || x.length < 3) {
      return { correlation: 0, strength: 0 }
    }

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    if (denominator === 0) {
      return { correlation: 0, strength: 0 }
    }

    const correlation = numerator / denominator
    return { correlation, strength: Math.abs(correlation) }
  }

  private static generateCorrelationDescription(
    field1: string,
    field2: string,
    correlation: { correlation: number; optimalLag: number },
  ): string {
    const direction = correlation.correlation > 0 ? "higher" : "lower"
    const lagText = correlation.optimalLag > 0 ? ` (with ${correlation.optimalLag} day delay)` : ""

    return `${direction} ${field1} levels tend to correlate with ${direction} ${field2} levels${lagText}`
  }

  private static generateActionableInsight(
    field1: string,
    field2: string,
    correlation: { correlation: number; optimalLag: number },
  ): string {
    if (field1 === "sleep" && field2 === "energy" && correlation.correlation > 0) {
      return "Consider maintaining consistent sleep schedule to support energy levels"
    }
    if (field1 === "pain" && field2 === "mood" && correlation.correlation < 0) {
      return "Pain management strategies may help improve mood"
    }
    if (field1 === "mood" && field2 === "pain" && correlation.correlation < 0) {
      return "Mood support activities might help with pain perception"
    }
    return `Monitor ${field1} patterns as they may influence ${field2}`
  }

  private static generateSymptomMedDescription(
    symptom: string,
    medication: string,
    type: "helps" | "worsens" | "neutral",
    effectiveness: number,
  ): string {
    switch (type) {
      case "helps":
        return `${medication} appears to help with ${symptom} (${Math.round(effectiveness * 100)}% effectiveness)`
      case "worsens":
        return `${medication} may worsen ${symptom} symptoms`
      default:
        return `${medication} shows neutral effect on ${symptom}`
    }
  }

  private static getSignificanceLevel(strength: number, sampleSize: number): "high" | "medium" | "low" {
    if (strength > 0.7 && sampleSize > 20) return "high"
    if (strength > 0.5 && sampleSize > 10) return "medium"
    return "low"
  }
}
