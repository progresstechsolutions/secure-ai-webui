"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Share2, TrendingUp, TrendingDown, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"

// Sample data for charts
const growthData = [
  { month: "Jan", weight: 65, height: 165, bmi: 23.9 },
  { month: "Feb", weight: 66, height: 165, bmi: 24.2 },
  { month: "Mar", weight: 64, height: 165, bmi: 23.5 },
  { month: "Apr", weight: 65, height: 165, bmi: 23.9 },
  { month: "May", weight: 67, height: 165, bmi: 24.6 },
  { month: "Jun", weight: 66, height: 165, bmi: 24.2 },
]

const micronutrientData = [
  { nutrient: "Iron", value: 85, fullMark: 100, status: "good" },
  { nutrient: "B12", value: 45, fullMark: 100, status: "low" },
  { nutrient: "Vitamin D", value: 92, fullMark: 100, status: "good" },
  { nutrient: "Calcium", value: 78, fullMark: 100, status: "good" },
  { nutrient: "Folate", value: 35, fullMark: 100, status: "low" },
  { nutrient: "Magnesium", value: 88, fullMark: 100, status: "good" },
]

export function GrowthTrendsPanel() {
  const [currentChart, setCurrentChart] = React.useState(0)
  const [expandedChart, setExpandedChart] = React.useState<string | null>(null)

  const charts = [
    {
      id: "weight",
      title: "Weight Trends",
      description: "Monthly weight tracking",
      component: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "bmi",
      title: "BMI Progress",
      description: "Body Mass Index over time",
      component: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[20, 28]} />
            <Tooltip />
            <Bar dataKey="bmi" fill="hsl(var(--secondary))" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      id: "nutrients",
      title: "Micronutrient Status",
      description: "Current nutrient levels",
      component: (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={micronutrientData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="nutrient" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar
              name="Nutrient Level"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      ),
    },
  ]

  const nextChart = () => {
    setCurrentChart((prev) => (prev + 1) % charts.length)
  }

  const prevChart = () => {
    setCurrentChart((prev) => (prev - 1 + charts.length) % charts.length)
  }

  const toggleExpanded = (chartId: string) => {
    setExpandedChart(expandedChart === chartId ? null : chartId)
  }

  // Identify out-of-range values
  const outOfRangeNutrients = micronutrientData.filter((n) => n.status === "low")

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Growth & Nutrient Trends
            </CardTitle>
            <CardDescription>Visual tracking of your health metrics and nutritional status</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share Dashboard
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Out-of-range alerts */}
        {outOfRangeNutrients.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-amber-800 dark:text-amber-200">Nutrients Below Optimal Range</h4>
                <div className="flex flex-wrap gap-2">
                  {outOfRangeNutrients.map((nutrient) => (
                    <Badge
                      key={nutrient.nutrient}
                      variant="outline"
                      className="border-amber-300 text-amber-700 dark:border-amber-600 dark:text-amber-300"
                    >
                      {nutrient.nutrient}: {nutrient.value}%
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Horizontal scrolling charts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Health Metrics</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevChart}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentChart + 1} of {charts.length}
              </span>
              <Button variant="outline" size="sm" onClick={nextChart}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => toggleExpanded(charts[currentChart].id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{charts[currentChart].title}</CardTitle>
                    <CardDescription className="text-sm">{charts[currentChart].description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    Tap to expand
                  </Button>
                </div>
              </CardHeader>
              <CardContent>{charts[currentChart].component}</CardContent>
            </Card>
          </div>
        </div>

        {/* Expanded view */}
        {expandedChart && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{charts.find((c) => c.id === expandedChart)?.title} - Detailed View</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setExpandedChart(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">{charts.find((c) => c.id === expandedChart)?.component}</div>

              {/* Additional details for expanded view */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Key Insights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      Overall positive trend this month
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-amber-600" />
                      Some fluctuation in mid-month
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Continue current nutrition plan</li>
                    <li>• Monitor B12 and Folate levels</li>
                    <li>• Consider supplement consultation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-lg font-semibold">+2.1% Growth</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BMI Status</p>
                <p className="text-lg font-semibold">Normal Range</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nutrients</p>
                <p className="text-lg font-semibold">{outOfRangeNutrients.length} Below Range</p>
              </div>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
