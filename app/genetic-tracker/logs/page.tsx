"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, MapPin, Utensils, Pill, Activity, TrendingUp, Filter } from "lucide-react"

export default function LogsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const itemName = searchParams.get("item")
  const category = searchParams.get("category")

  const [allEntries, setAllEntries] = useState({
    symptom: [],
    nutrition: [],
    medication: [],
  })
  const [selectedChildId, setSelectedChildId] = useState(null)
  const [activeTab, setActiveTab] = useState(category || "all")

  useEffect(() => {
    const symptomEntries = getLoggedEntriesForCategory("symptom")
    const nutritionEntries = getLoggedEntriesForCategory("nutrition")
    const medicationEntries = getLoggedEntriesForCategory("medication")

    setAllEntries({
      symptom: symptomEntries,
      nutrition: nutritionEntries,
      medication: medicationEntries,
    })
  }, [selectedChildId])

  const getLoggedEntriesForCategory = (categoryType) => {
    const storageKey = `caregene-${categoryType}-entries`
    const storedEntries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    return storedEntries
      .filter((entry) => !selectedChildId || entry.childId === selectedChildId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const getCategoryIcon = (categoryType) => {
    switch (categoryType) {
      case "symptom":
        return <Activity className="h-5 w-5 text-red-500" />
      case "nutrition":
        return <Utensils className="h-5 w-5 text-green-500" />
      case "medication":
        return <Pill className="h-5 w-5 text-blue-500" />
      default:
        return <TrendingUp className="h-5 w-5 text-purple-500" />
    }
  }

  const getSeverityColor = (severity) => {
    if (!severity) return "bg-gray-300"
    const level = Number.parseInt(severity)
    if (level <= 2) return "bg-green-500"
    if (level <= 3) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const totalEntries = allEntries.symptom.length + allEntries.nutrition.length + allEntries.medication.length
  const getAllEntries = () => {
    return [
      ...allEntries.symptom.map((entry) => ({ ...entry, category: "symptom" })),
      ...allEntries.nutrition.map((entry) => ({ ...entry, category: "nutrition" })),
      ...allEntries.medication.map((entry) => ({ ...entry, category: "medication" })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  const renderEntryCard = (entry, categoryType) => {
    const { date, time } = formatDate(entry.timestamp)
    const actualCategory = categoryType || entry.category

    return (
      <div
        key={`${actualCategory}-${entry.timestamp}`}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            {getCategoryIcon(actualCategory)}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{entry.name}</h3>
                <Badge variant="secondary" className="text-xs capitalize bg-blue-50 text-blue-700 border-blue-200">
                  {actualCategory}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{time}</span>
                </div>
              </div>
            </div>
          </div>
          {entry.data?.severity && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getSeverityColor(entry.data.severity)}`}></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                Severity {entry.data.severity}/5
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-4">
          {actualCategory === "symptom" && (
            <>
              {entry.data?.duration && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Duration: {entry.data.duration}</span>
                </div>
              )}
              {entry.data?.context && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Context: {entry.data.context}</span>
                </div>
              )}
            </>
          )}

          {actualCategory === "nutrition" && (
            <>
              {entry.data?.portionSize && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <Utensils className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Portion: {entry.data.portionSize}</span>
                </div>
              )}
              {entry.data?.time && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Meal time: {entry.data.time}</span>
                </div>
              )}
            </>
          )}

          {actualCategory === "medication" && (
            <>
              {entry.data?.doseTaken && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <Pill className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Dose: {entry.data.doseTaken}</span>
                </div>
              )}
              {entry.data?.time && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Time taken: {entry.data.time}</span>
                </div>
              )}
            </>
          )}
        </div>

        {entry.data?.notes && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
            <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Notes</h4>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">{entry.data.notes}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={setSelectedChildId}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Health Log History</h1>
                    <p className="text-sm sm:text-base text-gray-600">
                      {totalEntries} total {totalEntries === 1 ? "entry" : "entries"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter by category</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 sm:p-4 mb-4 sm:mb-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="all"
                  className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  All ({totalEntries})
                </TabsTrigger>
                <TabsTrigger
                  value="symptom"
                  className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  Symptoms ({allEntries.symptom.length})
                </TabsTrigger>
                <TabsTrigger
                  value="nutrition"
                  className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  Nutrition ({allEntries.nutrition.length})
                </TabsTrigger>
                <TabsTrigger
                  value="medication"
                  className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
                >
                  Medication ({allEntries.medication.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-3 sm:space-y-4">
              {getAllEntries().length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                      <TrendingUp className="h-8 w-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Start tracking to see your health data here</p>
                    </div>
                  </div>
                </div>
              ) : (
                getAllEntries().map((entry, index) => renderEntryCard(entry, entry.category))
              )}
            </TabsContent>

            <TabsContent value="symptom" className="space-y-3 sm:space-y-4">
              {allEntries.symptom.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="h-12 w-12 text-red-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No symptom entries</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Track symptoms to see them here</p>
                    </div>
                  </div>
                </div>
              ) : (
                allEntries.symptom.map((entry, index) => renderEntryCard(entry, "symptom"))
              )}
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-3 sm:space-y-4">
              {allEntries.nutrition.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Utensils className="h-12 w-12 text-green-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No nutrition entries</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Track nutrition to see entries here</p>
                    </div>
                  </div>
                </div>
              ) : (
                allEntries.nutrition.map((entry, index) => renderEntryCard(entry, "nutrition"))
              )}
            </TabsContent>

            <TabsContent value="medication" className="space-y-3 sm:space-y-4">
              {allEntries.medication.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Pill className="h-12 w-12 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No medication entries</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Track medications to see them here</p>
                    </div>
                  </div>
                </div>
              ) : (
                allEntries.medication.map((entry, index) => renderEntryCard(entry, "medication"))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  )
}
