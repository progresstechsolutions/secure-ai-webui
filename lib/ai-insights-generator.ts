import type { JournalEntry } from "@/types/journal"
import { CorrelationDetectionService } from "./correlation-detection-service"

export interface AIInsight {
  id: string
  type: "pattern" | "correlation" | "trend" | "anomaly" | "recommendation"
  title: string
  description: string
  confidence: number
  severity: "low" | "medium" | "high"
  actionable: boolean
  suggestion?: string
  evidence: string[]
  timeframe: string
  relevantEntries: string[] // entry IDs
}

export interface InsightCategory {
  category: string
  insights: AIInsight[]
  summary: string
}

export class AIInsightsGenerator {
  private static insightTemplates = {
    sleep_energy: {
      positive: "Better sleep appears to boost your energy levels",
      negative: "Poor sleep seems to drain your energy",
      suggestion: "Consider maintaining a consistent sleep schedule",
    },
    pain_mood: {
      negative: "Higher pain levels tend to affect your mood",
      suggestion: "Pain management strategies might help improve overall well-being",
    },
    medication_effectiveness: {
      helpful: "{{medication}} appears to help with {{symptom}}",
      ineffective: "{{medication}} may not be effectively managing {{symptom}}",
      suggestion: "Discuss medication effectiveness with your healthcare provider",
    },
    symptom_patterns: {
      increasing: "{{symptom}} has been increasing over the past {{timeframe}}",
      decreasing: "{{symptom}} has been improving over the past {{timeframe}}",
      cyclical: "{{symptom}} shows a cyclical pattern every {{cycle}}",
    },
    trigger_detection: {
      identified: "{{trigger}} may be triggering {{symptoms}}",
      suggestion: "Consider tracking {{trigger}} more closely",
    },
  }

  static async generateInsights(entries: JournalEntry[]): Promise<InsightCategory[]> {
    if (entries.length < 5) {
      return [
        {
          category: "Getting Started",
          insights: [
            {
              id: "insufficient-data",
              type: "recommendation",
              title: "Keep Logging to Unlock Insights",
              description: "Add more journal entries to discover patterns and correlations in your health data.",
              confidence: 1.0,
              severity: "low",
              actionable: true,
              suggestion: "Try to log daily for at least a week to see meaningful patterns.",
              evidence: [],
              timeframe: "ongoing",
              relevantEntries: [],
            },
          ],
          summary: "Continue logging to unlock personalized health insights.",
        },
      ]
    }

    const categories: InsightCategory[] = []

    // Generate correlation insights
    const correlationInsights = await this.generateCorrelationInsights(entries)
    if (correlationInsights.insights.length > 0) {
      categories.push(correlationInsights)
    }

    // Generate trend insights
    const trendInsights = await this.generateTrendInsights(entries)
    if (trendInsights.insights.length > 0) {
      categories.push(trendInsights)
    }

    // Generate medication insights
    const medicationInsights = await this.generateMedicationInsights(entries)
    if (medicationInsights.insights.length > 0) {
      categories.push(medicationInsights)
    }

    // Generate pattern insights
    const patternInsights = await this.generatePatternInsights(entries)
    if (patternInsights.insights.length > 0) {
      categories.push(patternInsights)
    }

    // Generate anomaly insights
    const anomalyInsights = await this.generateAnomalyInsights(entries)
    if (anomalyInsights.insights.length > 0) {
      categories.push(anomalyInsights)
    }

    return categories
  }

  private static async generateCorrelationInsights(entries: JournalEntry[]): Promise<InsightCategory> {
    const correlations = CorrelationDetectionService.detectAdvancedCorrelations(entries)
    const insights: AIInsight[] = []

    correlations.forEach((corr, index) => {
      let title = ""
      let description = ""
      let suggestion = ""

      if (corr.field1 === "sleep" && corr.field2 === "energy") {
        title = corr.type === "positive" ? "Better Sleep Boosts Energy" : "Sleep Issues Affect Energy"
        description = `Your sleep and energy levels show a ${corr.type} correlation (${Math.round(corr.strength * 100)}% strength).`
        suggestion = "Consider maintaining consistent sleep habits to support energy levels."
      } else if (corr.field1 === "pain" && corr.field2 === "mood") {
        title = "Pain Impacts Mood"
        description = `Higher pain levels tend to correlate with ${corr.type === "negative" ? "lower" : "higher"} mood scores.`
        suggestion = "Pain management strategies might help improve overall mood."
      } else if (corr.field1 === "mood" && corr.field2 === "pain") {
        title = "Mood Affects Pain Perception"
        description = `Your mood appears to influence pain levels with ${Math.round(corr.strength * 100)}% correlation strength.`
        suggestion = "Mood-supporting activities might help with pain management."
      } else {
        title = `${this.capitalizeFirst(corr.field1)} and ${this.capitalizeFirst(corr.field2)} Connection`
        description = corr.description
        suggestion = corr.actionable_insight
      }

      insights.push({
        id: `correlation-${index}`,
        type: "correlation",
        title,
        description,
        confidence: corr.confidence,
        severity: corr.significance === "high" ? "high" : corr.significance === "medium" ? "medium" : "low",
        actionable: true,
        suggestion,
        evidence: [`Based on ${corr.sample_size} journal entries`],
        timeframe: corr.timelag ? `${corr.timelag} day delay` : "same day",
        relevantEntries: [],
      })
    })

    return {
      category: "Health Correlations",
      insights: insights.slice(0, 3), // Limit to top 3
      summary:
        insights.length > 0
          ? `Found ${insights.length} significant correlations in your health data.`
          : "No significant correlations detected yet.",
    }
  }

  private static async generateTrendInsights(entries: JournalEntry[]): Promise<InsightCategory> {
    const insights: AIInsight[] = []
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Analyze mood trends
    const moodTrend = this.analyzeTrend(sortedEntries, "mood")
    if (moodTrend.significance > 0.3) {
      insights.push({
        id: "mood-trend",
        type: "trend",
        title: moodTrend.direction === "improving" ? "Mood is Improving" : "Mood Needs Attention",
        description: `Your mood has been ${moodTrend.direction} over the past ${moodTrend.timeframe}.`,
        confidence: moodTrend.significance,
        severity: moodTrend.direction === "declining" ? "medium" : "low",
        actionable: true,
        suggestion:
          moodTrend.direction === "declining"
            ? "Consider discussing mood patterns with your healthcare provider."
            : "Keep up the positive momentum with your current routine.",
        evidence: [`Trend analysis of ${moodTrend.dataPoints} mood entries`],
        timeframe: moodTrend.timeframe,
        relevantEntries: [],
      })
    }

    // Analyze sleep trends
    const sleepTrend = this.analyzeTrend(sortedEntries, "sleep")
    if (sleepTrend.significance > 0.3) {
      insights.push({
        id: "sleep-trend",
        type: "trend",
        title: sleepTrend.direction === "improving" ? "Sleep is Getting Better" : "Sleep Quality Declining",
        description: `Your sleep duration has been ${sleepTrend.direction} over the past ${sleepTrend.timeframe}.`,
        confidence: sleepTrend.significance,
        severity: sleepTrend.direction === "declining" ? "medium" : "low",
        actionable: true,
        suggestion:
          sleepTrend.direction === "declining"
            ? "Consider reviewing your sleep hygiene and bedtime routine."
            : "Your sleep improvements are great - maintain your current habits.",
        evidence: [`Trend analysis of ${sleepTrend.dataPoints} sleep entries`],
        timeframe: sleepTrend.timeframe,
        relevantEntries: [],
      })
    }

    // Analyze pain trends
    const painTrend = this.analyzeTrend(sortedEntries, "pain")
    if (painTrend.significance > 0.3) {
      insights.push({
        id: "pain-trend",
        type: "trend",
        title: painTrend.direction === "improving" ? "Pain is Decreasing" : "Pain Levels Increasing",
        description: `Your pain levels have been ${painTrend.direction} over the past ${painTrend.timeframe}.`,
        confidence: painTrend.significance,
        severity: painTrend.direction === "declining" ? "high" : "low",
        actionable: true,
        suggestion:
          painTrend.direction === "declining"
            ? "Discuss increasing pain levels with your healthcare provider."
            : "Your pain management approach seems to be working well.",
        evidence: [`Trend analysis of ${painTrend.dataPoints} pain entries`],
        timeframe: painTrend.timeframe,
        relevantEntries: [],
      })
    }

    return {
      category: "Health Trends",
      insights,
      summary:
        insights.length > 0
          ? `Identified ${insights.length} significant trends in your health metrics.`
          : "No significant trends detected in recent entries.",
    }
  }

  private static async generateMedicationInsights(entries: JournalEntry[]): Promise<InsightCategory> {
    const medCorrelations = CorrelationDetectionService.detectSymptomMedicationCorrelations(entries)
    const insights: AIInsight[] = []

    medCorrelations.slice(0, 3).forEach((corr, index) => {
      let severity: "low" | "medium" | "high" = "low"
      let title = ""
      let suggestion = ""

      if (corr.correlation_type === "helps") {
        title = `${corr.medication} Helps with ${corr.symptom}`
        suggestion = "Continue current medication as prescribed and track effectiveness."
        severity = "low"
      } else if (corr.correlation_type === "worsens") {
        title = `${corr.medication} May Worsen ${corr.symptom}`
        suggestion = "Discuss this potential side effect with your healthcare provider."
        severity = "high"
      } else {
        title = `${corr.medication} Shows Mixed Results for ${corr.symptom}`
        suggestion = "Monitor this medication's effectiveness more closely."
        severity = "medium"
      }

      insights.push({
        id: `medication-${index}`,
        type: "correlation",
        title,
        description: corr.description,
        confidence: corr.confidence,
        severity,
        actionable: true,
        suggestion,
        evidence: ["Based on symptom and medication tracking patterns"],
        timeframe: "ongoing",
        relevantEntries: [],
      })
    })

    return {
      category: "Medication Insights",
      insights,
      summary:
        insights.length > 0
          ? `Found ${insights.length} medication effectiveness patterns.`
          : "Continue tracking to identify medication patterns.",
    }
  }

  private static async generatePatternInsights(entries: JournalEntry[]): Promise<InsightCategory> {
    const insights: AIInsight[] = []

    // Analyze day-of-week patterns
    const dayPatterns = this.analyzeDayOfWeekPatterns(entries)
    if (dayPatterns.significance > 0.4) {
      insights.push({
        id: "day-pattern",
        type: "pattern",
        title: `${dayPatterns.worstDay}s Tend to Be Challenging`,
        description: `Your ${dayPatterns.metric} levels are typically ${dayPatterns.pattern} on ${dayPatterns.worstDay}s.`,
        confidence: dayPatterns.significance,
        severity: "medium",
        actionable: true,
        suggestion: `Consider planning extra self-care activities for ${dayPatterns.worstDay}s.`,
        evidence: [`Pattern analysis across ${dayPatterns.weeks} weeks of data`],
        timeframe: "weekly pattern",
        relevantEntries: [],
      })
    }

    // Analyze symptom clustering
    const symptomClusters = this.analyzeSymptomClustering(entries)
    symptomClusters.slice(0, 2).forEach((cluster, index) => {
      insights.push({
        id: `symptom-cluster-${index}`,
        type: "pattern",
        title: `${cluster.symptoms.join(" and ")} Often Occur Together`,
        description: `These symptoms appear together in ${Math.round(cluster.frequency * 100)}% of cases.`,
        confidence: cluster.confidence,
        severity: "medium",
        actionable: true,
        suggestion: "Consider discussing these symptom patterns with your healthcare provider.",
        evidence: [`Found in ${cluster.occurrences} journal entries`],
        timeframe: "ongoing pattern",
        relevantEntries: [],
      })
    })

    return {
      category: "Behavioral Patterns",
      insights,
      summary:
        insights.length > 0
          ? `Discovered ${insights.length} recurring patterns in your health data.`
          : "No significant patterns detected yet.",
    }
  }

  private static async generateAnomalyInsights(entries: JournalEntry[]): Promise<InsightCategory> {
    const insights: AIInsight[] = []
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Detect unusual spikes or drops
    const anomalies = this.detectAnomalies(sortedEntries)

    anomalies.slice(0, 2).forEach((anomaly, index) => {
      insights.push({
        id: `anomaly-${index}`,
        type: "anomaly",
        title: `Unusual ${this.capitalizeFirst(anomaly.metric)} ${anomaly.type}`,
        description: `Detected an unusual ${anomaly.type} in ${anomaly.metric} levels on ${anomaly.date}.`,
        confidence: anomaly.confidence,
        severity: anomaly.severity,
        actionable: true,
        suggestion: anomaly.suggestion,
        evidence: [`${anomaly.metric} was ${anomaly.value} (${anomaly.deviation} from average)`],
        timeframe: anomaly.date,
        relevantEntries: [anomaly.entryId],
      })
    })

    return {
      category: "Notable Events",
      insights,
      summary:
        insights.length > 0
          ? `Found ${insights.length} unusual events worth noting.`
          : "No significant anomalies detected.",
    }
  }

  private static analyzeTrend(
    entries: JournalEntry[],
    field: keyof JournalEntry,
  ): {
    direction: "improving" | "declining" | "stable"
    significance: number
    timeframe: string
    dataPoints: number
  } {
    const values = entries.map((entry) => entry[field] as number).filter((val) => val !== undefined && val !== null)

    if (values.length < 3) {
      return { direction: "stable", significance: 0, timeframe: "insufficient data", dataPoints: 0 }
    }

    // Simple linear regression to detect trend
    const n = values.length
    const x = Array.from({ length: n }, (_, i) => i)
    const y = values

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const significance = Math.abs(slope) / (Math.max(...y) - Math.min(...y))

    const direction = slope > 0.1 ? "improving" : slope < -0.1 ? "declining" : "stable"
    const timeframe = `${Math.ceil(n / 7)} weeks`

    return { direction, significance, timeframe, dataPoints: n }
  }

  private static analyzeDayOfWeekPatterns(entries: JournalEntry[]): {
    worstDay: string
    metric: string
    pattern: string
    significance: number
    weeks: number
  } {
    const dayAverages: Record<string, { mood: number[]; pain: number[]; energy: number[] }> = {
      Sunday: { mood: [], pain: [], energy: [] },
      Monday: { mood: [], pain: [], energy: [] },
      Tuesday: { mood: [], pain: [], energy: [] },
      Wednesday: { mood: [], pain: [], energy: [] },
      Thursday: { mood: [], pain: [], energy: [] },
      Friday: { mood: [], pain: [], energy: [] },
      Saturday: { mood: [], pain: [], energy: [] },
    }

    entries.forEach((entry) => {
      const dayName = new Date(entry.date).toLocaleDateString("en-US", { weekday: "long" })
      if (entry.mood) dayAverages[dayName].mood.push(entry.mood)
      if (entry.pain) dayAverages[dayName].pain.push(entry.pain)
      if (entry.energy) dayAverages[dayName].energy.push(entry.energy)
    })

    // Find the day with lowest mood or highest pain
    let worstDay = "Monday"
    let worstScore = 5
    let metric = "mood"

    Object.entries(dayAverages).forEach(([day, values]) => {
      if (values.mood.length > 0) {
        const avgMood = values.mood.reduce((a, b) => a + b, 0) / values.mood.length
        if (avgMood < worstScore) {
          worstScore = avgMood
          worstDay = day
          metric = "mood"
        }
      }
    })

    const weeks = Math.ceil(entries.length / 7)
    const significance = (5 - worstScore) / 5 // How much worse than neutral

    return {
      worstDay,
      metric,
      pattern: "lower",
      significance,
      weeks,
    }
  }

  private static analyzeSymptomClustering(entries: JournalEntry[]): Array<{
    symptoms: string[]
    frequency: number
    confidence: number
    occurrences: number
  }> {
    const symptomPairs: Record<string, number> = {}
    const totalEntries = entries.length

    entries.forEach((entry) => {
      if (entry.symptoms.length >= 2) {
        for (let i = 0; i < entry.symptoms.length; i++) {
          for (let j = i + 1; j < entry.symptoms.length; j++) {
            const pair = [entry.symptoms[i], entry.symptoms[j]].sort().join(" + ")
            symptomPairs[pair] = (symptomPairs[pair] || 0) + 1
          }
        }
      }
    })

    return Object.entries(symptomPairs)
      .filter(([, count]) => count >= 3)
      .map(([pair, count]) => ({
        symptoms: pair.split(" + "),
        frequency: count / totalEntries,
        confidence: Math.min(count / 5, 1),
        occurrences: count,
      }))
      .sort((a, b) => b.frequency - a.frequency)
  }

  private static detectAnomalies(entries: JournalEntry[]): Array<{
    entryId: string
    metric: string
    type: "spike" | "drop"
    value: number
    deviation: string
    confidence: number
    severity: "low" | "medium" | "high"
    suggestion: string
    date: string
  }> {
    const anomalies: any[] = [][
      // Analyze each metric for anomalies
      ("mood", "pain", "energy", "sleep")
    ].forEach((metric) => {
      const values = entries
        .map((entry) => ({ value: entry[metric as keyof JournalEntry] as number, entry }))
        .filter((item) => item.value !== undefined && item.value !== null)

      if (values.length < 5) return

      const nums = values.map((v) => v.value)
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length
      const stdDev = Math.sqrt(nums.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / nums.length)

      values.forEach(({ value, entry }) => {
        const zScore = Math.abs((value - mean) / stdDev)
        if (zScore > 2) {
          // 2 standard deviations
          const type = value > mean ? "spike" : "drop"
          const severity = zScore > 3 ? "high" : zScore > 2.5 ? "medium" : "low"

          anomalies.push({
            entryId: entry.id,
            metric,
            type,
            value,
            deviation: `${zScore.toFixed(1)} standard deviations`,
            confidence: Math.min(zScore / 3, 1),
            severity,
            suggestion: this.getAnomalySuggestion(metric, type, severity),
            date: new Date(entry.date).toLocaleDateString(),
          })
        }
      })
    })

    return anomalies.sort((a, b) => b.confidence - a.confidence)
  }

  private static getAnomalySuggestion(
    metric: string,
    type: "spike" | "drop",
    severity: "low" | "medium" | "high",
  ): string {
    if (metric === "pain" && type === "spike") {
      return severity === "high"
        ? "Consider contacting your healthcare provider about this pain spike."
        : "Note any potential triggers for this pain increase."
    }
    if (metric === "mood" && type === "drop") {
      return "Consider what factors might have contributed to this mood change."
    }
    if (metric === "sleep" && type === "drop") {
      return "Identify what might have disrupted your sleep on this day."
    }
    return `Monitor ${metric} levels and note any contributing factors.`
  }

  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
