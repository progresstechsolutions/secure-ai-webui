"use client"

import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type {
  TrendsAnalysis,
  TrendDataPoint,
  SymptomTrend,
  MedicationTrend,
  Correlation,
} from "@/lib/trends-analysis-service"

interface TrendLineChartProps {
  title: string
  description: string
  data: TrendDataPoint[]
  color: string
  yAxisLabel: string
  maxValue?: number
}

export function TrendLineChart({ title, description, data, color, yAxisLabel, maxValue }: TrendLineChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">No data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: yAxisLabel,
              color: color,
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis className="text-xs" domain={[0, maxValue || "dataMax"]} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface SymptomFrequencyChartProps {
  symptoms: SymptomTrend[]
  period: string
}

export function SymptomFrequencyChart({ symptoms, period }: SymptomFrequencyChartProps) {
  if (symptoms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Symptom Frequency</CardTitle>
          <CardDescription>Track how often symptoms occur over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">No symptom data available</div>
        </CardContent>
      </Card>
    )
  }

  // Get top 5 most frequent symptoms
  const topSymptoms = symptoms
    .map((symptom) => ({
      ...symptom,
      totalFrequency: symptom.frequency.reduce((sum, point) => sum + point.value, 0),
    }))
    .sort((a, b) => b.totalFrequency - a.totalFrequency)
    .slice(0, 5)

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Frequency</CardTitle>
        <CardDescription>Top 5 most reported symptoms over {period} periods</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={Object.fromEntries(
            topSymptoms.map((symptom, index) => [
              symptom.symptom,
              {
                label: symptom.symptom,
                color: colors[index],
              },
            ]),
          )}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis className="text-xs" />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              {topSymptoms.map((symptom, index) => (
                <Area
                  key={symptom.symptom}
                  type="monotone"
                  dataKey="value"
                  data={symptom.frequency}
                  stackId="1"
                  stroke={colors[index]}
                  fill={colors[index]}
                  fillOpacity={0.6}
                  name={symptom.symptom}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface MedicationTrackingChartProps {
  medications: MedicationTrend[]
  period: string
}

export function MedicationTrackingChart({ medications, period }: MedicationTrackingChartProps) {
  if (medications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medication Tracking</CardTitle>
          <CardDescription>Monitor medication frequency and adherence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">No medication data available</div>
        </CardContent>
      </Card>
    )
  }

  // Prepare data for bar chart showing total medication frequency
  const medicationData = medications
    .map((med) => ({
      medication: med.medication.length > 15 ? med.medication.substring(0, 15) + "..." : med.medication,
      fullName: med.medication,
      frequency: med.frequency.reduce((sum, point) => sum + point.value, 0),
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Tracking</CardTitle>
        <CardDescription>Total doses recorded per medication over {period} periods</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            frequency: {
              label: "Total Doses",
              color: "#10b981",
            },
          }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={medicationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="medication" className="text-xs" angle={-45} textAnchor="end" height={80} />
              <YAxis className="text-xs" />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.fullName}</p>
                        <p className="text-sm text-gray-600">Total doses: {data.frequency}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="frequency" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface CorrelationDisplayProps {
  correlations: Correlation[]
}

export function CorrelationDisplay({ correlations }: CorrelationDisplayProps) {
  if (correlations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Correlations</CardTitle>
          <CardDescription>Relationships between different health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-gray-500">
            No significant correlations detected
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Correlations</CardTitle>
        <CardDescription>Identified relationships between health metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {correlations.map((correlation, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      correlation.type === "positive"
                        ? "bg-green-500"
                        : correlation.type === "negative"
                          ? "bg-red-500"
                          : "bg-gray-500"
                    }`}
                  />
                  <span className="font-medium capitalize">{correlation.type} Correlation</span>
                </div>
                <div className="text-sm text-gray-600">Strength: {Math.round(correlation.strength * 100)}%</div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{correlation.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Fields: {correlation.field1} ↔ {correlation.field2}
                </span>
                <span>Confidence: {Math.round(correlation.confidence * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface HealthOverviewProps {
  analysis: TrendsAnalysis
}

export function HealthOverview({ analysis }: HealthOverviewProps) {
  const getLatestValue = (data: TrendDataPoint[]) => {
    if (data.length === 0) return null
    return data[data.length - 1].value
  }

  const calculateTrend = (data: TrendDataPoint[]) => {
    if (data.length < 2) return "stable"
    const recent = data.slice(-3)
    const older = data.slice(-6, -3)

    if (recent.length === 0 || older.length === 0) return "stable"

    const recentAvg = recent.reduce((sum, point) => sum + point.value, 0) / recent.length
    const olderAvg = older.reduce((sum, point) => sum + point.value, 0) / older.length

    const change = ((recentAvg - olderAvg) / olderAvg) * 100

    if (Math.abs(change) < 5) return "stable"
    return change > 0 ? "improving" : "declining"
  }

  const metrics = [
    {
      name: "Mood",
      value: getLatestValue(analysis.mood),
      max: 5,
      trend: calculateTrend(analysis.mood),
      color: "bg-blue-500",
    },
    {
      name: "Energy",
      value: getLatestValue(analysis.energy),
      max: 5,
      trend: calculateTrend(analysis.energy),
      color: "bg-yellow-500",
    },
    {
      name: "Sleep",
      value: getLatestValue(analysis.sleep),
      max: 12,
      trend: calculateTrend(analysis.sleep),
      color: "bg-purple-500",
    },
    {
      name: "Pain",
      value: getLatestValue(analysis.pain),
      max: 10,
      trend: calculateTrend(analysis.pain),
      color: "bg-red-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Overview</CardTitle>
        <CardDescription>Latest metrics and trends from your journal entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric) => (
            <div key={metric.name} className="text-center">
              <div className="text-2xl font-bold mb-1">
                {metric.value !== null ? metric.value : "--"}
                {metric.value !== null && <span className="text-sm text-gray-500">/{metric.max}</span>}
              </div>
              <div className="text-sm text-gray-600 mb-2">{metric.name}</div>
              <div
                className={`text-xs px-2 py-1 rounded-full inline-block ${
                  metric.trend === "improving"
                    ? "bg-green-100 text-green-800"
                    : metric.trend === "declining"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {metric.trend}
              </div>
            </div>
          ))}
        </div>

        {analysis.insights.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Key Insights</h4>
            <div className="space-y-2">
              {analysis.insights.map((insight, index) => (
                <div key={index} className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
