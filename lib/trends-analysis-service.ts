import type { JournalEntry } from "@/types/journal"

export interface TrendDataPoint {
  date: string
  value: number
  label?: string
}

export interface SymptomTrend {
  symptom: string
  frequency: TrendDataPoint[]
  severity?: TrendDataPoint[]
}

export interface MedicationTrend {
  medication: string
  frequency: TrendDataPoint[]
  effectiveness?: number
}

export interface TrendsAnalysis {
  period: "daily" | "weekly" | "monthly"
  dateRange: { start: Date; end: Date }
  mood: TrendDataPoint[]
  sleep: TrendDataPoint[]
  energy: TrendDataPoint[]
  pain: TrendDataPoint[]
  symptoms: SymptomTrend[]
  medications: MedicationTrend[]
  correlations: Correlation[]
  insights: string[]
}

export interface Correlation {
  type: "positive" | "negative" | "neutral"
  strength: number // 0-1
  description: string
  field1: string
  field2: string
  confidence: number
}

export class TrendsAnalysisService {
  static analyzeTrends(entries: JournalEntry[], period: "daily" | "weekly" | "monthly" = "daily"): TrendsAnalysis {
    if (entries.length === 0) {
      return this.getEmptyAnalysis(period)
    }

    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const dateRange = {
      start: new Date(sortedEntries[0].date),
      end: new Date(sortedEntries[sortedEntries.length - 1].date),
    }

    // Group entries by time period
    const groupedEntries = this.groupEntriesByPeriod(sortedEntries, period)

    return {
      period,
      dateRange,
      mood: this.calculateNumericTrends(groupedEntries, "mood"),
      sleep: this.calculateNumericTrends(groupedEntries, "sleep"),
      energy: this.calculateNumericTrends(groupedEntries, "energy"),
      pain: this.calculateNumericTrends(groupedEntries, "pain"),
      symptoms: this.calculateSymptomTrends(groupedEntries),
      medications: this.calculateMedicationTrends(groupedEntries),
      correlations: this.detectCorrelations(sortedEntries),
      insights: this.generateInsights(sortedEntries, groupedEntries),
    }
  }

  private static groupEntriesByPeriod(
    entries: JournalEntry[],
    period: "daily" | "weekly" | "monthly",
  ): Map<string, JournalEntry[]> {
    const groups = new Map<string, JournalEntry[]>()

    entries.forEach((entry) => {
      const date = new Date(entry.date)
      let key: string

      switch (period) {
        case "daily":
          key = date.toISOString().split("T")[0]
          break
        case "weekly":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split("T")[0]
          break
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          break
        default:
          key = date.toISOString().split("T")[0]
      }

      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(entry)
    })

    return groups
  }

  private static calculateNumericTrends(
    groupedEntries: Map<string, JournalEntry[]>,
    field: "mood" | "sleep" | "energy" | "pain",
  ): TrendDataPoint[] {
    const trends: TrendDataPoint[] = []

    groupedEntries.forEach((entries, date) => {
      const values = entries
        .map((entry) => entry[field])
        .filter((value): value is number => value !== undefined && value !== null)

      if (values.length > 0) {
        const average = values.reduce((sum, val) => sum + val, 0) / values.length
        trends.push({
          date,
          value: Math.round(average * 10) / 10,
          label: `${values.length} entries`,
        })
      }
    })

    return trends.sort((a, b) => a.date.localeCompare(b.date))
  }

  private static calculateSymptomTrends(groupedEntries: Map<string, JournalEntry[]>): SymptomTrend[] {
    const symptomMap = new Map<string, TrendDataPoint[]>()

    groupedEntries.forEach((entries, date) => {
      const symptomCounts = new Map<string, number>()

      entries.forEach((entry) => {
        entry.symptoms.forEach((symptom) => {
          symptomCounts.set(symptom, (symptomCounts.get(symptom) || 0) + 1)
        })
      })

      symptomCounts.forEach((count, symptom) => {
        if (!symptomMap.has(symptom)) {
          symptomMap.set(symptom, [])
        }
        symptomMap.get(symptom)!.push({
          date,
          value: count,
          label: `${count} occurrences`,
        })
      })
    })

    return Array.from(symptomMap.entries()).map(([symptom, frequency]) => ({
      symptom,
      frequency: frequency.sort((a, b) => a.date.localeCompare(b.date)),
    }))
  }

  private static calculateMedicationTrends(groupedEntries: Map<string, JournalEntry[]>): MedicationTrend[] {
    const medicationMap = new Map<string, TrendDataPoint[]>()

    groupedEntries.forEach((entries, date) => {
      const medicationCounts = new Map<string, number>()

      entries.forEach((entry) => {
        entry.meds.forEach((med) => {
          medicationCounts.set(med, (medicationCounts.get(med) || 0) + 1)
        })
      })

      medicationCounts.forEach((count, medication) => {
        if (!medicationMap.has(medication)) {
          medicationMap.set(medication, [])
        }
        medicationMap.get(medication)!.push({
          date,
          value: count,
          label: `${count} doses`,
        })
      })
    })

    return Array.from(medicationMap.entries()).map(([medication, frequency]) => ({
      medication,
      frequency: frequency.sort((a, b) => a.date.localeCompare(b.date)),
    }))
  }

  private static detectCorrelations(entries: JournalEntry[]): Correlation[] {
    const correlations: Correlation[] = []

    // Analyze mood vs pain correlation
    const moodPainCorr = this.calculateCorrelation(
      entries.map((e) => e.mood).filter((v): v is number => v !== undefined),
      entries.map((e) => e.pain).filter((v): v is number => v !== undefined),
    )

    if (moodPainCorr.strength > 0.3) {
      correlations.push({
        type: moodPainCorr.correlation < 0 ? "negative" : "positive",
        strength: moodPainCorr.strength,
        description:
          moodPainCorr.correlation < 0
            ? "Higher pain levels tend to correlate with lower mood scores"
            : "Higher pain levels tend to correlate with higher mood scores",
        field1: "pain",
        field2: "mood",
        confidence: moodPainCorr.strength,
      })
    }

    // Analyze sleep vs energy correlation
    const sleepEnergyCorr = this.calculateCorrelation(
      entries.map((e) => e.sleep).filter((v): v is number => v !== undefined),
      entries.map((e) => e.energy).filter((v): v is number => v !== undefined),
    )

    if (sleepEnergyCorr.strength > 0.3) {
      correlations.push({
        type: sleepEnergyCorr.correlation > 0 ? "positive" : "negative",
        strength: sleepEnergyCorr.strength,
        description:
          sleepEnergyCorr.correlation > 0
            ? "Better sleep tends to correlate with higher energy levels"
            : "Better sleep tends to correlate with lower energy levels",
        field1: "sleep",
        field2: "energy",
        confidence: sleepEnergyCorr.strength,
      })
    }

    return correlations
  }

  private static calculateCorrelation(x: number[], y: number[]): { correlation: number; strength: number } {
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

  private static generateInsights(entries: JournalEntry[], groupedEntries: Map<string, JournalEntry[]>): string[] {
    const insights: string[] = []

    // Most common symptoms
    const symptomCounts = new Map<string, number>()
    entries.forEach((entry) => {
      entry.symptoms.forEach((symptom) => {
        symptomCounts.set(symptom, (symptomCounts.get(symptom) || 0) + 1)
      })
    })

    if (symptomCounts.size > 0) {
      const topSymptom = Array.from(symptomCounts.entries()).sort(([, a], [, b]) => b - a)[0]
      insights.push(`Most frequently reported symptom: ${topSymptom[0]} (${topSymptom[1]} times)`)
    }

    // Average mood trend
    const moodValues = entries.map((e) => e.mood).filter((v): v is number => v !== undefined)
    if (moodValues.length > 0) {
      const avgMood = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length
      insights.push(`Average mood score: ${Math.round(avgMood * 10) / 10}/5`)
    }

    // Sleep pattern
    const sleepValues = entries.map((e) => e.sleep).filter((v): v is number => v !== undefined)
    if (sleepValues.length > 0) {
      const avgSleep = sleepValues.reduce((sum, val) => sum + val, 0) / sleepValues.length
      insights.push(`Average sleep duration: ${Math.round(avgSleep * 10) / 10} hours`)
    }

    return insights
  }

  private static getEmptyAnalysis(period: "daily" | "weekly" | "monthly"): TrendsAnalysis {
    const now = new Date()
    return {
      period,
      dateRange: { start: now, end: now },
      mood: [],
      sleep: [],
      energy: [],
      pain: [],
      symptoms: [],
      medications: [],
      correlations: [],
      insights: ["No journal entries available for analysis"],
    }
  }
}
