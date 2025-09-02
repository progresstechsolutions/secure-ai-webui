"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Copy, CheckCircle, AlertCircle, HelpCircle, Calendar, Info } from "lucide-react"
import {
  getChild,
  getChecklist,
  getChecklistResponses,
  type Child,
  type Checklist,
  type ChecklistResponse,
  type AgeKey,
} from "@/lib/milestone-data-layer"
import { milestoneAnalytics } from "@/lib/milestone-analytics"
import { ErrorToast } from "@/components/milestone/error-toast"

interface SummaryExportProps {
  childId: string
}

const AGE_KEYS: { value: AgeKey; label: string }[] = [
  { value: "2m", label: "2 months" },
  { value: "4m", label: "4 months" },
  { value: "6m", label: "6 months" },
  { value: "9m", label: "9 months" },
  { value: "12m", label: "12 months" },
  { value: "15m", label: "15 months" },
  { value: "18m", label: "18 months" },
  { value: "2y", label: "2 years" },
  { value: "30m", label: "30 months" },
  { value: "3y", label: "3 years" },
  { value: "4y", label: "4 years" },
  { value: "5y", label: "5 years" },
]

export function SummaryExport({ childId }: SummaryExportProps) {
  const [child, setChild] = useState<Child | null>(null)
  const [selectedAgeKey, setSelectedAgeKey] = useState<AgeKey>("12m")
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [responses, setResponses] = useState<ChecklistResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    milestoneAnalytics.trackPageView("milestone_summary", childId, selectedAgeKey)

    const loadData = async () => {
      try {
        const childData = await getChild(childId)
        if (childData) {
          setChild(childData)
          const currentAge = getCurrentAgeKey(childData)
          setSelectedAgeKey(currentAge)
        }
      } catch (error) {
        console.error("Failed to load child data:", error)
        setError("Failed to load child data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [childId])

  useEffect(() => {
    if (selectedAgeKey) {
      const checklistData = getChecklist(selectedAgeKey)
      const responseData = getChecklistResponses(childId, selectedAgeKey)
      setChecklist(checklistData)
      setResponses(responseData)
    }
  }, [childId, selectedAgeKey])

  const getCurrentAgeKey = (child: Child): AgeKey => {
    const ageInMonths = calculateAgeInMonths(child.birthDate)
    if (ageInMonths < 3) return "2m"
    if (ageInMonths < 5) return "4m"
    if (ageInMonths < 7.5) return "6m"
    if (ageInMonths < 10.5) return "9m"
    if (ageInMonths < 13.5) return "12m"
    if (ageInMonths < 16.5) return "15m"
    if (ageInMonths < 21) return "18m"
    if (ageInMonths < 27) return "2y"
    if (ageInMonths < 36) return "30m"
    if (ageInMonths < 48) return "3y"
    if (ageInMonths < 60) return "4y"
    return "5y"
  }

  const calculateAgeInMonths = (birthDate: string): number => {
    const birth = new Date(birthDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - birth.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.floor(diffDays / 30.44) // Average days per month
  }

  const getCategoryCounts = () => {
    if (!checklist || !responses.length) return {}

    const counts: Record<string, { met: number; notYet: number; notSure: number; total: number }> = {}

    const categories = [...new Set(checklist.items.map((item) => item.category))]

    categories.forEach((category) => {
      counts[category] = { met: 0, notYet: 0, notSure: 0, total: 0 }

      checklist.items
        .filter((item) => item.category === category)
        .forEach((item) => {
          counts[category].total++
          const response = responses.find((r) => r.itemId === item.id)
          if (response) {
            if (response.answer === "yes") counts[category].met++
            else if (response.answer === "not_yet") counts[category].notYet++
            else if (response.answer === "not_sure") counts[category].notSure++
          }
        })
    })

    return counts
  }

  const getItemsByAnswer = (answer: "yes" | "not_yet" | "not_sure") => {
    if (!checklist || !responses.length) return []

    return checklist.items
      .filter((item) => {
        const response = responses.find((r) => r.itemId === item.id)
        return response?.answer === answer
      })
      .map((item) => {
        const response = responses.find((r) => r.itemId === item.id)
        return { ...item, note: response?.note }
      })
  }

  const handleExportPDF = () => {
    milestoneAnalytics.trackExport("pdf", childId, selectedAgeKey)

    const printContent = generatePrintContent()
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Milestone Summary - ${child?.firstName}</title>
            <style>
              body { 
                font-family: 'Arial', 'Helvetica', sans-serif; 
                font-size: 16pt; 
                line-height: 1.8; 
                margin: 0.75in; 
                color: #333;
              }
              h1 { 
                font-size: 24pt; 
                margin-bottom: 0.5in; 
                color: #2563eb;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 0.2in;
              }
              h2 { 
                font-size: 20pt; 
                margin-top: 0.4in; 
                margin-bottom: 0.25in; 
                color: #1e40af;
              }
              h3 { 
                font-size: 18pt; 
                margin-top: 0.3in; 
                margin-bottom: 0.15in; 
                color: #1e3a8a;
              }
              .header { 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 0.3in; 
                margin-bottom: 0.4in; 
              }
              .category { 
                margin-bottom: 0.4in; 
                padding: 0.2in;
                background-color: #f8fafc;
                border-left: 4px solid #3b82f6;
              }
              .item { 
                margin-left: 0.3in; 
                margin-bottom: 0.15in; 
                font-size: 15pt;
              }
              .note { 
                font-style: italic; 
                color: #6b7280; 
                margin-left: 0.5in; 
                font-size: 14pt;
                background-color: #f9fafb;
                padding: 0.1in;
                border-radius: 4px;
              }
              .disclaimer { 
                border-top: 2px solid #dc2626; 
                padding-top: 0.3in; 
                margin-top: 0.6in; 
                font-size: 14pt; 
                color: #dc2626; 
                background-color: #fef2f2;
                padding: 0.3in;
                border-radius: 8px;
              }
              .status-met { color: #059669; font-weight: bold; }
              .status-not-yet { color: #d97706; font-weight: bold; }
              .status-not-sure { color: #2563eb; font-weight: bold; }
              @media print { 
                body { margin: 0.5in; font-size: 14pt; }
                h1 { font-size: 20pt; }
                h2 { font-size: 18pt; }
                h3 { font-size: 16pt; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownloadFile = () => {
    milestoneAnalytics.trackExport("json", childId, selectedAgeKey)

    const content = generateTextContent()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `milestone-summary-${child?.firstName.replace(/\s+/g, "-")}-${selectedAgeKey}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    milestoneAnalytics.trackExport("clipboard", childId, selectedAgeKey)

    const content = generateTextContent()
    try {
      await navigator.clipboard.writeText(content)
      // Could add toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      setError("Failed to copy to clipboard. Please try again.")
    }
  }

  const generatePrintContent = () => {
    const categoryCounts = getCategoryCounts()
    const metItems = getItemsByAnswer("yes")
    const notYetItems = getItemsByAnswer("not_yet")
    const notSureItems = getItemsByAnswer("not_sure")

    return `
      <div class="header">
        <h1>Milestone Development Summary</h1>
        <p><strong>Child:</strong> ${child?.firstName}</p>
        <p><strong>Age Group:</strong> ${AGE_KEYS.find((k) => k.value === selectedAgeKey)?.label}</p>
        ${child?.dueDate ? `<p><strong>Corrected Age:</strong> Adjusted for prematurity</p>` : ""}
        <p><strong>Date of Birth:</strong> ${new Date(child?.birthDate || "").toLocaleDateString()}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <h2>Category Summary</h2>
      ${Object.entries(categoryCounts)
        .map(
          ([category, counts]) => `
        <div class="category">
          <h3>${category}</h3>
          <p><span class="status-met">Met: ${counts.met}</span> | <span class="status-not-yet">Not Yet: ${counts.notYet}</span> | <span class="status-not-sure">Not Sure: ${counts.notSure}</span> | <strong>Total: ${counts.total}</strong></p>
          <p>Progress: ${Math.round((counts.met / counts.total) * 100)}% completed</p>
        </div>
      `,
        )
        .join("")}

      <h2>✅ Milestones Met (${metItems.length})</h2>
      ${
        metItems.length > 0
          ? metItems
              .map(
                (item) => `
        <div class="item">• ${item.label}</div>
        ${item.note ? `<div class="note">Parent Note: ${item.note}</div>` : ""}
      `,
              )
              .join("")
          : '<p class="item">No milestones marked as met yet.</p>'
      }

      <h2>⏳ Not Yet Achieved (${notYetItems.length})</h2>
      ${
        notYetItems.length > 0
          ? notYetItems
              .map(
                (item) => `
        <div class="item">• ${item.label}</div>
        ${item.note ? `<div class="note">Parent Note: ${item.note}</div>` : ""}
      `,
              )
              .join("")
          : '<p class="item">No milestones marked as not yet achieved.</p>'
      }

      <h2>❓ Not Sure (${notSureItems.length})</h2>
      ${
        notSureItems.length > 0
          ? notSureItems
              .map(
                (item) => `
        <div class="item">• ${item.label}</div>
        ${item.note ? `<div class="note">Parent Note: ${item.note}</div>` : ""}
      `,
              )
              .join("")
          : '<p class="item">No milestones marked as not sure.</p>'
      }

      <div class="disclaimer">
        <p><strong>⚠️ Important Disclaimer:</strong> This summary is for informational purposes only and is not intended as a diagnostic tool. Please discuss any concerns with your child's healthcare provider. This document should be used to facilitate conversations with medical professionals about your child's development.</p>
      </div>
    `
  }

  const generateTextContent = () => {
    const categoryCounts = getCategoryCounts()
    const metItems = getItemsByAnswer("yes")
    const notYetItems = getItemsByAnswer("not_yet")
    const notSureItems = getItemsByAnswer("not_sure")

    return `MILESTONE DEVELOPMENT SUMMARY

Child: ${child?.firstName}
Age Group: ${AGE_KEYS.find((k) => k.value === selectedAgeKey)?.label}
${child?.dueDate ? `Corrected Age: Adjusted for prematurity\n` : ""}Date of Birth: ${new Date(child?.birthDate || "").toLocaleDateString()}
Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

CATEGORY SUMMARY
${Object.entries(categoryCounts)
  .map(
    ([category, counts]) =>
      `${category}: Met ${counts.met}, Not Yet ${counts.notYet}, Not Sure ${counts.notSure}, Total ${counts.total}\nProgress: ${Math.round((counts.met / counts.total) * 100)}% completed`,
  )
  .join("\n")}

✅ MILESTONES MET (${metItems.length})
${
  metItems.length > 0
    ? metItems.map((item) => `• ${item.label}${item.note ? `\n  Parent Note: ${item.note}` : ""}`).join("\n")
    : "No milestones marked as met yet."
}

⏳ NOT YET ACHIEVED (${notYetItems.length})
${
  notYetItems.length > 0
    ? notYetItems.map((item) => `• ${item.label}${item.note ? `\n  Parent Note: ${item.note}` : ""}`).join("\n")
    : "No milestones marked as not yet achieved."
}

❓ NOT SURE (${notSureItems.length})
${
  notSureItems.length > 0
    ? notSureItems.map((item) => `• ${item.label}${item.note ? `\n  Parent Note: ${item.note}` : ""}`).join("\n")
    : "No milestones marked as not sure."
}

⚠️ IMPORTANT DISCLAIMER: This summary is for informational purposes only and is not intended as a diagnostic tool. Please discuss any concerns with your child's healthcare provider. This document should be used to facilitate conversations with medical professionals about your child's development.`
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!child) {
    return <div className="text-center py-8">Child not found</div>
  }

  const categoryCounts = getCategoryCounts()
  const metItems = getItemsByAnswer("yes")
  const notYetItems = getItemsByAnswer("not_yet")
  const notSureItems = getItemsByAnswer("not_sure")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={child.photoUrl || "/placeholder.svg"} alt={child.firstName} />
            <AvatarFallback className="text-lg font-semibold">{child.firstName?.charAt(0) || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Development Summary</h1>
            <div className="flex items-center gap-3">
              <p className="text-lg text-muted-foreground">{child.firstName}</p>
              {child.dueDate && (
                <Badge variant="secondary" className="text-sm font-medium">
                  Corrected Age
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm text-muted-foreground">
            <p>Age Group</p>
          </div>
          <Select value={selectedAgeKey} onValueChange={(value: AgeKey) => setSelectedAgeKey(value)}>
            <SelectTrigger className="w-44 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGE_KEYS.map((age) => (
                <SelectItem key={age.value} value={age.value}>
                  {age.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Column - Category Counts (2/5 width) */}
        <div className="xl:col-span-2">
          <Card className="h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Category Overview</CardTitle>
              <CardDescription>Progress by developmental area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(categoryCounts).map(([category, counts]) => (
                <div key={category} className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">{category}</h3>
                    <Badge variant="outline" className="font-mono">
                      {counts.met + counts.notYet + counts.notSure}/{counts.total}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Met</span>
                      </div>
                      <span className="font-medium text-green-700">{counts.met}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <span>Not Yet</span>
                      </div>
                      <span className="font-medium text-amber-700">{counts.notYet}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <span>Not Sure</span>
                      </div>
                      <span className="font-medium text-blue-700">{counts.notSure}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round((counts.met / counts.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(counts.met / counts.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Milestone Lists (3/5 width) */}
        <div className="xl:col-span-3 space-y-6">
          {/* Met Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Milestones Met ({metItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {metItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-sm">{item.label}</p>
                    {item.note && <p className="text-xs text-muted-foreground italic ml-4">Parent Note: {item.note}</p>}
                  </div>
                ))}
                {metItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">No milestones marked as met yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Not Yet Achieved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-5 w-5" />
                Not Yet Achieved (${notYetItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notYetItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-sm">{item.label}</p>
                    {item.note && <p className="text-xs text-muted-foreground italic ml-4">Parent Note: {item.note}</p>}
                  </div>
                ))}
                {notYetItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">No milestones marked as not yet achieved.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Not Sure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <HelpCircle className="h-5 w-5" />
                Not Sure (${notSureItems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notSureItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-sm">{item.label}</p>
                    {item.note && <p className="text-xs text-muted-foreground italic ml-4">Parent Note: {item.note}</p>}
                  </div>
                ))}
                {notSureItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">No milestones marked as not sure.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Child Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Child Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Full Name:</span>
              <p className="font-medium">{child.firstName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date of Birth:</span>
              <p className="font-medium">{new Date(child.birthDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Age:</span>
              <p className="font-medium">{calculateAgeInMonths(child.birthDate)} months</p>
            </div>
            {child.dueDate && (
              <div>
                <span className="text-muted-foreground">Corrected Age:</span>
                <p className="font-medium">Adjusted for prematurity</p>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>
              Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Export Summary</CardTitle>
          <CardDescription>Generate reports to share with healthcare providers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Button onClick={handleExportPDF} size="lg" className="flex items-center gap-2 h-12">
              <FileText className="h-5 w-5" />
              Export PDF (Print-Safe)
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadFile}
              size="lg"
              className="flex items-center gap-2 h-12 bg-transparent"
            >
              <Download className="h-5 w-5" />
              Download Text File
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              size="lg"
              className="flex items-center gap-2 h-12 bg-transparent"
            >
              <Copy className="h-5 w-5" />
              Copy to Clipboard
            </Button>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 leading-relaxed">
              <strong>⚠️ Important Disclaimer:</strong> This summary is for informational purposes only and is not
              intended as a diagnostic tool. Please discuss any concerns with your child's healthcare provider. This
              document should be used to facilitate conversations with medical professionals about your child's
              development.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error Toast */}
      {error && <ErrorToast message={error} onRetry={() => setError(null)} onDismiss={() => setError(null)} />}
    </div>
  )
}
