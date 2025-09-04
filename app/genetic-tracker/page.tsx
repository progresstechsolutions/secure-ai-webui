"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, Flag as Flask, Search, X, ArrowLeft, Plus, Eye } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import PageWrapper from "@/components/page-wrapper"

const GeneticTracker = () => {
  const [selectedChildId, setSelectedChildId] = useState<string>("")

  const [flows, setFlows] = useState({
    symptom: {
      currentStep: 1,
      selectedItem: null,
      data: {
        startTime: new Date().toISOString().slice(0, 16),
        duration: "",
        ongoing: false,
        severity: 3,
        context: [],
        notes: "",
      },
      suggestions: [],
      showSuggestions: false,
    },
    nutrition: {
      currentStep: 1,
      selectedItem: null,
      data: {
        foods: "",
        portionSize: "",
        time: new Date().toISOString().slice(0, 16),
        notes: "",
      },
      suggestions: [],
      showSuggestions: false,
    },
    medication: {
      currentStep: 1,
      selectedItem: null,
      data: {
        medicationName: "",
        doseTaken: "",
        time: new Date().toISOString().slice(0, 16),
        notes: "",
      },
      suggestions: [],
      showSuggestions: false,
    },
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [selectedNutrition, setSelectedNutrition] = useState(null)
  const [selectedMedication, setSelectedMedication] = useState(null)
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState("symptom")
  const [searchQuery, setSearchQuery] = useState("")
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [newItemName, setNewItemName] = useState("")

  const [pinnedItems, setPinnedItems] = useState({
    symptom: [],
    nutrition: [],
    medication: [],
  })

  const [customItems, setCustomItems] = useState({
    symptom: [],
    nutrition: [],
    medication: [],
  })

  const [symptomData, setSymptomData] = useState({
    startTime: new Date().toISOString().slice(0, 16),
    duration: "",
    ongoing: false,
    severity: 3,
    context: [],
    notes: "",
  })

  const [nutritionData, setNutritionData] = useState({
    foods: "",
    portionSize: "",
    time: new Date().toISOString().slice(0, 16),
    notes: "",
  })

  const [medicationData, setMedicationData] = useState({
    medicationName: "",
    doseTaken: "",
    time: new Date().toISOString().slice(0, 16),
    notes: "",
  })

  const [symptomSuggestions, setSymptomSuggestions] = useState([])
  const [showSymptomSuggestions, setShowSymptomSuggestions] = useState(false)
  const [medicationSuggestions, setMedicationSuggestions] = useState([])
  const [showMedicationSuggestions, setShowMedicationSuggestions] = useState(false)
  const [nutritionSuggestions, setNutritionSuggestions] = useState([])
  const [showNutritionSuggestions, setShowNutritionSuggestions] = useState(false)

  const [manualAddSuggestions, setManualAddSuggestions] = useState([])
  const [showManualAddSuggestions, setShowManualAddSuggestions] = useState(false)

  const getCurrentFlow = () => flows[selectedCategory]

  const updateFlow = (category, updates) => {
    setFlows((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates,
      },
    }))
  }

  const resetFlow = (category) => {
    const defaultFlows = {
      symptom: {
        currentStep: 1,
        selectedItem: null,
        data: {
          startTime: new Date().toISOString().slice(0, 16),
          duration: "",
          ongoing: false,
          severity: 3,
          context: [],
          notes: "",
        },
        suggestions: [],
        showSuggestions: false,
      },
      nutrition: {
        currentStep: 1,
        selectedItem: null,
        data: {
          foods: "",
          portionSize: "",
          time: new Date().toISOString().slice(0, 16),
          notes: "",
        },
        suggestions: [],
        showSuggestions: false,
      },
      medication: {
        currentStep: 1,
        selectedItem: null,
        data: {
          medicationName: "",
          doseTaken: "",
          time: new Date().toISOString().slice(0, 16),
          notes: "",
        },
        suggestions: [],
        showSuggestions: false,
      },
    }

    updateFlow(category, defaultFlows[category])
  }

  const trackingCategories = [
    {
      id: "symptom",
      title: "Symptom",
      description: "Log symptoms and severity",
      icon: BarChart3,
      iconBg: "bg-red-500",
    },
    {
      id: "nutrition",
      title: "Nutrition",
      description: "Track meals and food intake",
      icon: ShoppingCart,
      iconBg: "bg-green-500",
    },
    {
      id: "medication",
      title: "Medication",
      description: "Record medication taken",
      icon: Flask,
      iconBg: "bg-blue-500",
    },
  ]

  const typeData = {
    symptom: [
      { id: "seizure", name: "Seizure", icon: "⚡" },
      { id: "sleep", name: "Sleep", icon: "😴" },
      { id: "gi", name: "GI", icon: "🤢" },
      { id: "pain", name: "Pain/Discomfort", icon: "😟" },
      { id: "sensory", name: "Sensory/Autonomic", icon: "🧬" },
      { id: "respiratory", name: "Respiratory/ENT", icon: "🫁" },
      { id: "behavior", name: "Behavior Episode", icon: "🤯" },
      { id: "motor", name: "Motor", icon: "🏃" },
      { id: "cognitive", name: "Cognitive", icon: "🧠" },
      { id: "mood", name: "Mood", icon: "😊" },
      { id: "speech", name: "Speech", icon: "🗣️" },
    ],
    nutrition: [
      { id: "breakfast", name: "Breakfast", icon: "🍳" },
      { id: "lunch", name: "Lunch", icon: "🥗" },
      { id: "dinner", name: "Dinner", icon: "🍽️" },
      { id: "snack", name: "Snack", icon: "🍎" },
      { id: "water", name: "Water", icon: "💧" },
      { id: "supplements", name: "Supplements", icon: "💊" },
    ],
    medication: [
      { id: "morning", name: "Morning Dose", icon: "🌅" },
      { id: "afternoon", name: "Afternoon Dose", icon: "☀️" },
      { id: "evening", name: "Evening Dose", icon: "🌆" },
      { id: "night", name: "Night Dose", icon: "🌙" },
      { id: "asneeded", name: "As Needed", icon: "⚡" },
    ],
  }

  const contextOptions = ["therapy day", "illness", "travel", "loud environment", "school day", "menses"]

  const availableOptions = {
    symptom: [
      "Headache",
      "Nausea",
      "Fatigue",
      "Dizziness",
      "Muscle pain",
      "Joint pain",
      "Fever",
      "Chills",
      "Sweating",
      "Tremor",
      "Weakness",
      "Confusion",
      "Memory issues",
      "Sleep problems",
      "Anxiety",
      "Depression",
      "Irritability",
    ],
    nutrition: [
      "Apple",
      "Banana",
      "Orange",
      "Bread",
      "Rice",
      "Pasta",
      "Chicken",
      "Fish",
      "Milk",
      "Yogurt",
      "Cheese",
      "Eggs",
      "Vegetables",
      "Salad",
      "Soup",
      "Water",
      "Juice",
      "Coffee",
      "Tea",
      "Snacks",
      "Crackers",
      "Nuts",
      "Berries",
    ],
    medication: [
      "Acetaminophen",
      "Ibuprofen",
      "Aspirin",
      "Vitamin D",
      "Vitamin B12",
      "Iron",
      "Calcium",
      "Magnesium",
      "Omega-3",
      "Probiotics",
      "Melatonin",
      "Antihistamine",
    ],
  }

  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const router = useRouter()

  const isPinned = (item, category) => {
    return pinnedItems[category]?.some((pinnedItem) => pinnedItem.id === item.id) || false
  }

  const togglePin = (item, category) => {
    setPinnedItems((prev) => {
      const categoryPinned = prev[category] || []
      const isAlreadyPinned = categoryPinned.some((pinnedItem) => pinnedItem.id === item.id)

      if (isAlreadyPinned) {
        return {
          ...prev,
          [category]: categoryPinned.filter((pinnedItem) => pinnedItem.id !== item.id),
        }
      } else {
        return {
          ...prev,
          [category]: [...categoryPinned, item],
        }
      }
    })
  }

  const handleMobileCategoryClick = (categoryId) => {
    if (categoryId !== selectedCategory) {
      resetFlow(categoryId)
    }
    setSelectedCategory(categoryId)
  }

  const handleSymptomClick = (item) => {
    updateFlow("symptom", {
      selectedItem: item,
      currentStep: 2,
    })
  }

  const handleNutritionClick = (item) => {
    updateFlow("nutrition", {
      selectedItem: item,
      currentStep: 2,
    })
  }

  const handleMedicationClick = (item) => {
    updateFlow("medication", {
      selectedItem: item,
      currentStep: 2,
    })
  }

  const handleSaveSymptom = () => {
    const currentFlow = flows.symptom
    const entry = {
      id: Date.now().toString(),
      type: "symptom",
      name: currentFlow.selectedItem?.name || "Symptom",
      data: currentFlow.data,
      timestamp: new Date().toISOString(),
      childId: selectedChildId,
    }

    const existingEntries = JSON.parse(localStorage.getItem("caregene-symptom-entries") || "[]")
    localStorage.setItem("caregene-symptom-entries", JSON.stringify([...existingEntries, entry]))

    resetFlow("symptom")
    router.push("/genetic-tracker/logs")
  }

  const handleSaveNutrition = () => {
    const currentFlow = flows.nutrition
    const entry = {
      id: Date.now().toString(),
      type: "nutrition",
      name: currentFlow.data.foods || "Nutrition",
      data: currentFlow.data,
      timestamp: new Date().toISOString(),
      childId: selectedChildId,
    }

    const existingEntries = JSON.parse(localStorage.getItem("caregene-nutrition-entries") || "[]")
    localStorage.setItem("caregene-nutrition-entries", JSON.stringify([...existingEntries, entry]))

    resetFlow("nutrition")
    router.push("/genetic-tracker/logs")
  }

  const handleSaveMedication = () => {
    const currentFlow = flows.medication
    const entry = {
      id: Date.now().toString(),
      type: "medication",
      name: currentFlow.data.medicationName || "Medication",
      data: currentFlow.data,
      timestamp: new Date().toISOString(),
      childId: selectedChildId,
    }

    const existingEntries = JSON.parse(localStorage.getItem("caregene-medication-entries") || "[]")
    localStorage.setItem("caregene-medication-entries", JSON.stringify([...existingEntries, entry]))

    resetFlow("medication")
    router.push("/genetic-tracker/logs")
  }

  const handleContextToggle = (context) => {
    const currentFlow = flows.symptom
    const updatedContext = currentFlow.data.context.includes(context)
      ? currentFlow.data.context.filter((c) => c !== context)
      : [...currentFlow.data.context, context]

    updateFlow("symptom", {
      data: {
        ...currentFlow.data,
        context: updatedContext,
      },
    })
  }

  const renderStepper = () => {
    const currentFlow = getCurrentFlow()
    const steps = ["Select", "Details", "Review"]

    return (
      <div className="flex justify-center items-center space-x-4 mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentFlow.currentStep
          const isCompleted = stepNumber < currentFlow.currentStep

          return (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-2 transition-all duration-200 ${
                    stepNumber < currentFlow.currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const setCurrentTime = () => {
    setSymptomData((prev) => ({
      ...prev,
      startTime: new Date().toISOString().slice(0, 16),
    }))
  }

  const getHistoricalEntries = () => {
    const symptomEntries = JSON.parse(localStorage.getItem("caregene-symptom-entries") || "[]")
    const nutritionEntries = JSON.parse(localStorage.getItem("caregene-nutrition-entries") || "[]")
    const medicationEntries = JSON.parse(localStorage.getItem("caregene-medication-entries") || "[]")

    const allEntries = [...symptomEntries, ...nutritionEntries, ...medicationEntries]
      .filter((entry) => !selectedChildId || entry.childId === selectedChildId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return allEntries
  }

  const renderSymptomLogging = () => {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Log {selectedSymptom?.name}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Start Time</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="datetime-local"
                    value={symptomData.startTime}
                    onChange={(e) => handleSymptomInputChange("startTime", e.target.value)}
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={setCurrentTime}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:border-gray-400 bg-transparent"
                  >
                    Now
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Duration (minutes)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 30"
                  value={symptomData.duration}
                  onChange={(e) => handleSymptomInputChange("duration", e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Severity (1-5)</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleSymptomInputChange("severity", level)}
                    className={`w-12 h-12 rounded-full border-2 font-medium transition-all duration-200 ${
                      symptomData.severity === level
                        ? "border-blue-500 bg-blue-500 text-white shadow-md"
                        : "border-gray-300 text-gray-600 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Context (select all that apply)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {contextOptions.map((context) => (
                  <button
                    key={context}
                    onClick={() => handleContextToggle(context)}
                    className={`px-3 py-1 rounded-full text-sm border transition-all duration-200 ${
                      symptomData.context.includes(context)
                        ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                        : "border-gray-300 text-gray-600 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    {context}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Notes</Label>
              <div className="relative">
                <Textarea
                  placeholder="Additional details about the symptom..."
                  value={symptomData.notes}
                  onChange={(e) => handleSymptomInputChange("notes", e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />

                {showSymptomSuggestions && symptomSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-32 overflow-y-auto">
                    {symptomSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSymptomSuggestionSelect(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        🔹 {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button onClick={handleSaveSymptom} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm">
                Save Entry
              </Button>
              <Button
                onClick={() => setCurrentPage(1)}
                variant="outline"
                className="flex-1 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderNutritionLogging = () => {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Log {selectedNutrition?.name}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Food Items</Label>
              <div className="relative">
                <Input
                  placeholder="Type food items..."
                  value={nutritionData.foods}
                  onChange={(e) => handleNutritionInputChange(e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />

                {showNutritionSuggestions && nutritionSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-32 overflow-y-auto">
                    {nutritionSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleNutritionSuggestionSelect(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        🍽️ {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Portion Size</Label>
                <Input
                  placeholder="e.g., 1 cup, 2 slices"
                  value={nutritionData.portionSize}
                  onChange={(e) => setNutritionData((prev) => ({ ...prev, portionSize: e.target.value }))}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Time</Label>
                <Input
                  type="datetime-local"
                  value={nutritionData.time}
                  onChange={(e) => setNutritionData((prev) => ({ ...prev, time: e.target.value }))}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Notes</Label>
              <Textarea
                placeholder="Additional notes about the meal..."
                value={nutritionData.notes}
                onChange={(e) => setNutritionData((prev) => ({ ...prev, notes: e.target.value }))}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button onClick={handleSaveNutrition} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm">
                Save Entry
              </Button>
              <Button
                onClick={() => setCurrentPage(1)}
                variant="outline"
                className="flex-1 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMedicationLogging = () => {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage(1)}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Log {selectedMedication?.name}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Medication Name</Label>
              <div className="relative">
                <Input
                  placeholder="Type medication name..."
                  value={medicationData.medicationName}
                  onChange={(e) => handleMedicationInputChange("medicationName", e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />

                {showMedicationSuggestions && medicationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-32 overflow-y-auto">
                    {medicationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleMedicationSuggestionSelect(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        💊 {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Dose Taken</Label>
                <Input
                  placeholder="e.g., 5mg, 1 tablet"
                  value={medicationData.doseTaken}
                  onChange={(e) => handleMedicationInputChange("doseTaken", e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Time</Label>
                <Input
                  type="datetime-local"
                  value={medicationData.time}
                  onChange={(e) => handleMedicationInputChange("time", e.target.value)}
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Notes</Label>
              <Textarea
                placeholder="Additional notes about the medication..."
                value={medicationData.notes}
                onChange={(e) => handleMedicationInputChange("notes", e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <Button onClick={handleSaveMedication} className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm">
                Save Entry
              </Button>
              <Button
                onClick={() => setCurrentPage(1)}
                variant="outline"
                className="flex-1 border-gray-300 hover:border-gray-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPage2Content = () => {
    if (selectedSymptom) {
      return renderSymptomLogging()
    } else if (selectedNutrition) {
      return renderNutritionLogging()
    } else if (selectedMedication) {
      return renderMedicationLogging()
    }
    return null
  }

  const renderPage3Content = () => {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Entry Saved Successfully</h2>
          <p className="text-gray-600">Your health data has been recorded</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setCurrentPage(1)} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Back to Tracker
          </Button>
        </div>
      </div>
    )
  }

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
    setCurrentPage(1)
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    if (value.length > 0) {
      let suggestions = availableOptions[selectedCategory] || []

      // Filter by condition if not "All Conditions"
      // if (selectedCondition !== "All Conditions") {
      //   suggestions = suggestions.filter((option) => {
      //     const optionName = typeof option === "string" ? option : option.name
      //     // Simple condition matching - in real app, items would have condition tags
      //     return optionName.toLowerCase().includes(selectedCondition.toLowerCase().split(" ")[0])
      //   })
      // }

      suggestions = suggestions
        .filter((option) =>
          (typeof option === "string" ? option : option.name).toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5)

      setSearchSuggestions(suggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const showLoggedEntries = (itemName, category) => {
    router.push(`/genetic-tracker/logs?item=${encodeURIComponent(itemName)}&category=${category}`)
  }

  const handleSuggestionSelect = (suggestion) => {
    if (selectedCategory === "symptom") {
      setSymptomData((prev) => ({ ...prev, notes: suggestion }))
    } else if (selectedCategory === "nutrition") {
      setNutritionData((prev) => ({ ...prev, foods: suggestion }))
    } else if (selectedCategory === "medication") {
      setMedicationData((prev) => ({ ...prev, medicationName: suggestion }))
    }
    setSearchQuery("")
    setShowSuggestions(false)
    setCurrentPage(2)
  }

  const handleNutritionInputChange = (value) => {
    const currentFlow = flows.nutrition
    updateFlow("nutrition", {
      data: {
        ...currentFlow.data,
        foods: value,
      },
    })

    if (value.length > 0) {
      const suggestions = availableOptions.nutrition
        .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8)
      updateFlow("nutrition", {
        suggestions,
        showSuggestions: true,
      })
    } else {
      updateFlow("nutrition", {
        showSuggestions: false,
      })
    }
  }

  const handleNutritionSuggestionSelect = (suggestion) => {
    const currentFlow = flows.nutrition
    updateFlow("nutrition", {
      data: {
        ...currentFlow.data,
        foods: suggestion,
      },
      showSuggestions: false,
    })
  }

  const handleSymptomInputChange = (field, value) => {
    const currentFlow = flows.symptom
    updateFlow("symptom", {
      data: {
        ...currentFlow.data,
        [field]: value,
      },
    })

    if (field === "notes" && value.length > 0) {
      const suggestions = availableOptions.symptom
        .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8)
      updateFlow("symptom", {
        suggestions,
        showSuggestions: true,
      })
    } else if (field === "notes") {
      updateFlow("symptom", {
        showSuggestions: false,
      })
    }
  }

  const handleSymptomSuggestionSelect = (suggestion) => {
    const currentFlow = flows.symptom
    updateFlow("symptom", {
      data: {
        ...currentFlow.data,
        notes: suggestion,
      },
      showSuggestions: false,
    })
  }

  const handleMedicationInputChange = (field, value) => {
    const currentFlow = flows.medication
    updateFlow("medication", {
      data: {
        ...currentFlow.data,
        [field]: value,
      },
    })

    if (field === "medicationName" && value.length > 0) {
      const suggestions = availableOptions.medication
        .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8)
      updateFlow("medication", {
        suggestions,
        showSuggestions: true,
      })
    } else if (field === "medicationName") {
      updateFlow("medication", {
        showSuggestions: false,
      })
    }
  }

  const handleMedicationSuggestionSelect = (suggestion) => {
    const currentFlow = flows.medication
    updateFlow("medication", {
      data: {
        ...currentFlow.data,
        medicationName: suggestion,
      },
      showSuggestions: false,
    })
  }

  const handleManualAddInputChange = (value) => {
    setNewItemName(value)

    if (value.length > 0) {
      const suggestions = availableOptions[selectedCategory]
        .filter((option) =>
          (typeof option === "string" ? option : option.name).toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 8)
      setManualAddSuggestions(suggestions)
      setShowManualAddSuggestions(true)
    } else {
      setShowManualAddSuggestions(false)
    }
  }

  const handleManualAddSuggestionSelect = (suggestion) => {
    setNewItemName(suggestion)
    setShowManualAddSuggestions(false)
  }

  const addCustomItem = (category, itemName) => {
    if (!itemName.trim()) return

    const existingItems = availableOptions[category]
    const isDuplicate = existingItems.some(
      (item) => (typeof item === "string" ? item : item.name).toLowerCase() === itemName.toLowerCase(),
    )

    if (isDuplicate) {
      alert(`"${itemName}" already exists in ${category} options.`)
      return
    }

    // Create new item with proper structure and emoji
    const getEmojiForItem = (category, name) => {
      const firstLetter = name.charAt(0).toUpperCase()
      const fallbackEmojis = {
        symptom: "🩺",
        nutrition: "🍽️",
        medication: "💊",
      }

      // Try to find a matching emoji based on keywords
      const keywordEmojis = {
        symptom: {
          seizure: "⚡",
          sleep: "😴",
          pain: "😟",
          mood: "😊",
          motor: "🏃",
          speech: "🗣️",
          behavior: "🤯",
          cognitive: "🧠",
        },
        nutrition: {
          breakfast: "🍳",
          lunch: "🥗",
          dinner: "🍽️",
          snack: "🍎",
          water: "💧",
          milk: "🥛",
          fruit: "🍎",
          vegetable: "🥕",
        },
        medication: {
          morning: "🌅",
          afternoon: "☀️",
          evening: "🌆",
          night: "🌙",
          pain: "💊",
          vitamin: "💊",
          supplement: "💊",
        },
      }

      // Check for keyword matches
      const lowerName = name.toLowerCase()
      for (const [keyword, emoji] of Object.entries(keywordEmojis[category] || {})) {
        if (lowerName.includes(keyword)) {
          return emoji
        }
      }

      // Return first letter or fallback emoji
      return firstLetter
    }

    const newItem = {
      id: itemName.toLowerCase().replace(/\s+/g, "-"),
      name: itemName,
      icon: getEmojiForItem(category, itemName),
    }

    // Add to available options
    availableOptions[category].push(newItem)

    // Save to localStorage for persistence
    const customItems = JSON.parse(localStorage.getItem(`caregene-custom-${category}`) || "[]")
    const existingCustomItem = customItems.find((item) => (typeof item === "string" ? item : item.name) === itemName)

    if (!existingCustomItem) {
      customItems.push(newItem)
      localStorage.setItem(`caregene-custom-${category}`, JSON.stringify(customItems))
    }
  }

  const getLoggedEntriesForItem = (itemName, category) => {
    const storageKey = `caregene-${category}-entries`
    const entries = JSON.parse(localStorage.getItem(storageKey) || "[]")
    return entries.filter(
      (entry) =>
        entry.name?.toLowerCase() === itemName.toLowerCase() && (!selectedChildId || entry.childId === selectedChildId),
    )
  }

  useEffect(() => {
    const savedPinnedItems = localStorage.getItem("caregene-pinned-items")
    if (savedPinnedItems) {
      setPinnedItems(JSON.parse(savedPinnedItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("caregene-pinned-items", JSON.stringify(pinnedItems))
  }, [pinnedItems])

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={handleChildSelect}>
      <div className="flex-1 px-3 sm:px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">What would you like to log?</h2>

              {getCurrentFlow().currentStep > 1 && renderStepper()}

              {getCurrentFlow().currentStep === 1 ? (
                <>
                  {/* Category Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto mb-6 px-2 sm:px-4">
                    {trackingCategories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <Card
                          key={category.id}
                          onClick={() => handleMobileCategoryClick(category.id)}
                          className={`cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-h-[80px] sm:min-h-auto ${
                            selectedCategory === category.id
                              ? "border-2 border-purple-400 bg-purple-50 shadow-lg"
                              : "border border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <CardContent className="p-4 text-center">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 ${category.iconBg} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg`}
                            >
                              <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-900">{category.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{category.description}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Page Indicator */}
                  <div className="flex justify-center items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div className="w-8 h-1 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div className="w-8 h-1 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                  </div>

                  {/* Content based on selected category */}
                  {selectedCategory && (
                    <div className="max-w-6xl mx-auto">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          Choose {selectedCategory} Type
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Search symptoms, nutrition, or medication..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <Button
                            onClick={() => showLoggedEntries("", selectedCategory)}
                            variant="outline"
                            className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500 hover:border-blue-600 whitespace-nowrap"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Log
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                        {/* Add New Item */}
                        <Card
                          onClick={() => setShowManualAdd(true)}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
                        >
                          <CardContent className="p-3 sm:p-4 text-center h-full flex flex-col justify-center min-h-[100px] sm:min-h-[120px]">
                            <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600">Add New</span>
                          </CardContent>
                        </Card>

                        {/* Existing Items */}
                        {typeData[selectedCategory]
                          ?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <Card
                              key={item.id}
                              onClick={() => {
                                if (selectedCategory === "symptom") {
                                  handleSymptomClick(item)
                                } else if (selectedCategory === "nutrition") {
                                  handleNutritionClick(item)
                                } else if (selectedCategory === "medication") {
                                  handleMedicationClick(item)
                                }
                              }}
                              className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 relative group"
                            >
                              <CardContent className="p-3 sm:p-4 text-center h-full flex flex-col justify-center min-h-[100px] sm:min-h-[120px]">
                                <div className="text-xl sm:text-2xl mb-2">{item.icon}</div>
                                <span className="text-xs sm:text-sm font-medium text-gray-800 leading-tight break-words">
                                  {item.name}
                                </span>

                                {/* Pin Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePin(item, selectedCategory)
                                  }}
                                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                                    isPinned(item, selectedCategory)
                                      ? "bg-blue-200 text-blue-800"
                                      : "bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  📌
                                </button>
                              </CardContent>
                            </Card>
                          ))}

                        {/* Custom Items */}
                        {customItems[selectedCategory]
                          ?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((item) => (
                            <Card
                              key={item.id}
                              onClick={() => {
                                if (selectedCategory === "symptom") {
                                  handleSymptomClick(item)
                                } else if (selectedCategory === "nutrition") {
                                  handleNutritionClick(item)
                                } else if (selectedCategory === "medication") {
                                  handleMedicationClick(item)
                                }
                              }}
                              className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 relative group"
                            >
                              <CardContent className="p-3 sm:p-4 text-center h-full flex flex-col justify-center min-h-[100px] sm:min-h-[120px]">
                                <div className="text-xl sm:text-2xl mb-2">{item.icon}</div>
                                <span className="text-xs sm:text-sm font-medium text-gray-800 leading-tight break-words">
                                  {item.name}
                                </span>

                                {/* Pin Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePin(item, selectedCategory)
                                  }}
                                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                                    isPinned(item, selectedCategory)
                                      ? "bg-blue-200 text-blue-800"
                                      : "bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  📌
                                </button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {selectedCategory === "symptom" && getCurrentFlow().currentStep === 2 && (
                    /* Symptom details form */
                    <div className="max-w-2xl mx-auto px-4">
                      <div className="mb-6">
                        <button
                          onClick={() => updateFlow("symptom", { currentStep: 1 })}
                          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Selection
                        </button>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Log {flows.symptom.selectedItem?.name}
                        </h3>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Start Time</Label>
                              <div className="flex gap-2 mt-1">
                                <Input
                                  type="datetime-local"
                                  value={flows.symptom.data.startTime}
                                  onChange={(e) => handleSymptomInputChange("startTime", e.target.value)}
                                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <Button
                                  onClick={() =>
                                    handleSymptomInputChange("startTime", new Date().toISOString().slice(0, 16))
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-300 hover:border-gray-400 bg-transparent"
                                >
                                  Now
                                </Button>
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">Duration (minutes)</Label>
                              <Input
                                type="number"
                                placeholder="e.g., 30"
                                value={flows.symptom.data.duration}
                                onChange={(e) => handleSymptomInputChange("duration", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Severity (1-5)</Label>
                            <div className="flex gap-2 mt-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                  key={level}
                                  onClick={() => handleSymptomInputChange("severity", level)}
                                  className={`w-12 h-12 rounded-full border-2 font-medium transition-all duration-200 ${
                                    flows.symptom.data.severity === level
                                      ? "border-blue-500 bg-blue-500 text-white shadow-md"
                                      : "border-gray-300 text-gray-600 hover:border-blue-300 hover:shadow-sm"
                                  }`}
                                >
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Context (select all that apply)</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {contextOptions.map((context) => (
                                <button
                                  key={context}
                                  onClick={() => handleContextToggle(context)}
                                  className={`px-3 py-1 rounded-full text-sm border transition-all duration-200 ${
                                    flows.symptom.data.context.includes(context)
                                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                                      : "border-gray-300 text-gray-600 hover:border-blue-300 hover:shadow-sm"
                                  }`}
                                >
                                  {context}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Notes</Label>
                            <div className="relative">
                              <Textarea
                                placeholder="Additional details about the symptom..."
                                value={flows.symptom.data.notes}
                                onChange={(e) => handleSymptomInputChange("notes", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                              />

                              {flows.symptom.showSuggestions && flows.symptom.suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-32 overflow-y-auto">
                                  {flows.symptom.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleSymptomSuggestionSelect(suggestion)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                                    >
                                      🔹 {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button
                              onClick={handleSaveSymptom}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm"
                            >
                              Save Entry
                            </Button>
                            <Button
                              onClick={() => updateFlow("symptom", { currentStep: 1 })}
                              variant="outline"
                              className="flex-1 border-gray-300 hover:border-gray-400"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCategory === "nutrition" && getCurrentFlow().currentStep === 2 && (
                    /* Nutrition details form */
                    <div className="max-w-2xl mx-auto px-4">
                      <div className="mb-6">
                        <button
                          onClick={() => updateFlow("nutrition", { currentStep: 1 })}
                          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Selection
                        </button>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Log {flows.nutrition.selectedItem?.name}
                        </h3>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Food Items</Label>
                            <div className="relative">
                              <Input
                                placeholder="Type food items..."
                                value={flows.nutrition.data.foods}
                                onChange={(e) => handleNutritionInputChange(e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />

                              {flows.nutrition.showSuggestions && flows.nutrition.suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-32 overflow-y-auto">
                                  {flows.nutrition.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleNutritionSuggestionSelect(suggestion)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                                    >
                                      🍽️ {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Portion Size</Label>
                              <Input
                                placeholder="e.g., 1 cup, 2 slices"
                                value={flows.nutrition.data.portionSize}
                                onChange={(e) =>
                                  updateFlow("nutrition", {
                                    data: { ...flows.nutrition.data, portionSize: e.target.value },
                                  })
                                }
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">Time</Label>
                              <Input
                                type="datetime-local"
                                value={flows.nutrition.data.time}
                                onChange={(e) =>
                                  updateFlow("nutrition", { data: { ...flows.nutrition.data, time: e.target.value } })
                                }
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Notes</Label>
                            <Textarea
                              placeholder="Additional notes about the meal..."
                              value={flows.nutrition.data.notes}
                              onChange={(e) =>
                                updateFlow("nutrition", { data: { ...flows.nutrition.data, notes: e.target.value } })
                              }
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button
                              onClick={handleSaveNutrition}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm"
                            >
                              Save Entry
                            </Button>
                            <Button
                              onClick={() => updateFlow("nutrition", { currentStep: 1 })}
                              variant="outline"
                              className="flex-1 border-gray-300 hover:border-gray-400"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCategory === "medication" && getCurrentFlow().currentStep === 2 && (
                    /* Medication details form */
                    <div className="max-w-2xl mx-auto px-4">
                      <div className="mb-6">
                        <button
                          onClick={() => updateFlow("medication", { currentStep: 1 })}
                          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Selection
                        </button>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Log {flows.medication.selectedItem?.name}
                        </h3>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <div className="space-y-6">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Medication Name</Label>
                            <div className="relative">
                              <Input
                                placeholder="Type medication name..."
                                value={flows.medication.data.medicationName}
                                onChange={(e) => handleMedicationInputChange("medicationName", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />

                              {flows.medication.showSuggestions && flows.medication.suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-32 overflow-y-auto">
                                  {flows.medication.suggestions.map((suggestion, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleMedicationSuggestionSelect(suggestion)}
                                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                                    >
                                      💊 {suggestion}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Dose Taken</Label>
                              <Input
                                placeholder="e.g., 5mg, 1 tablet"
                                value={flows.medication.data.doseTaken}
                                onChange={(e) => handleMedicationInputChange("doseTaken", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <Label className="text-sm font-medium text-gray-700">Time</Label>
                              <Input
                                type="datetime-local"
                                value={flows.medication.data.time}
                                onChange={(e) => handleMedicationInputChange("time", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Notes</Label>
                            <Textarea
                              placeholder="Additional notes about the medication..."
                              value={flows.medication.data.notes}
                              onChange={(e) => handleMedicationInputChange("notes", e.target.value)}
                              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button
                              onClick={handleSaveMedication}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm"
                            >
                              Save Entry
                            </Button>
                            <Button
                              onClick={() => updateFlow("medication", { currentStep: 1 })}
                              variant="outline"
                              className="flex-1 border-gray-300 hover:border-gray-400"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {/* Manual Add Modal */}
              {showManualAdd && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Add New {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                      </h3>
                      <button
                        onClick={() => {
                          setShowManualAdd(false)
                          setNewItemName("")
                          setSearchQuery("")
                          setShowManualAddSuggestions(false)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Item Name</Label>
                        <div className="relative">
                          <Input
                            placeholder={`Enter ${selectedCategory} name...`}
                            value={newItemName}
                            onChange={(e) => handleManualAddInputChange(e.target.value)}
                            className="mt-1"
                            autoFocus
                          />

                          {showManualAddSuggestions && manualAddSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                              {manualAddSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleManualAddSuggestionSelect(suggestion)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            if (newItemName.trim()) {
                              addCustomItem(selectedCategory, newItemName.trim())
                              setNewItemName("")
                              setShowManualAdd(false)
                              setShowManualAddSuggestions(false)
                            }
                          }}
                          disabled={!newItemName.trim()}
                          className="flex-1"
                        >
                          Add & Continue
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowManualAdd(false)
                            setNewItemName("")
                            setShowManualAddSuggestions(false)
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default GeneticTracker
