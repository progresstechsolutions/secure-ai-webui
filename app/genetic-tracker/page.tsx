"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, Flag as Flask, Search, X, ArrowLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const GeneticTracker = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSymptom, setSelectedSymptom] = useState(null)
  const [selectedNutrition, setSelectedNutrition] = useState(null)
  const [selectedMedication, setSelectedMedication] = useState(null)
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState("symptom")
  const [searchQuery, setSearchQuery] = useState("")
  const [showManualAdd, setShowManualAdd] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [showSymptomLogger, setShowSymptomLogger] = useState(false)
  const [showBehaviorLogger, setShowBehaviorLogger] = useState(false)
  const [showMobileSymptomBrowser, setShowMobileSymptomBrowser] = useState(false)
  const [mobileBrowserCategory, setMobileBrowserCategory] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")

  const [nutritionStep, setNutritionStep] = useState(1)
  const [medicationStep, setMedicationStep] = useState(1)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showVisitPacket, setShowVisitPacket] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [nutritionData, setNutritionData] = useState({
    intakeType: "",
    foods: [],
    portionSize: "",
    texture: [],
    setting: [],
    beverage: "",
    volume: "",
    formulaBrand: "",
    concentration: "",
    delivery: "",
    supplementName: "",
    form: "",
    strength: "",
    amount: "",
    time: new Date().toISOString().slice(0, 16),
    notes: "",
  })

  const [medicationData, setMedicationData] = useState({
    action: "record_dose",
    medicationName: "",
    doseTaken: "",
    scheduledWindow: "",
    actualTime: new Date().toISOString().slice(0, 16),
    lotBottle: "Current bottle",
    notes: "",
    // For new medication
    brandGeneric: "",
    form: "",
    strength: "",
    directions: "",
    scheduleWindows: [],
    pharmacy: "",
  })

  const [behaviorData, setBehaviorData] = useState({
    type: "",
    intensity: 5,
    duration: "",
    triggers: "",
    interventions: "",
    comments: "",
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
    typeSpecific: {
      seizureType: "unknown",
      recoveryState: "OK",
      clustering: false,
      sleepLatency: "",
      nightAwakenings: "",
      snoring: false,
      stoolType: "",
      straining: false,
      vomiting: false,
      faceGrimace: false,
      guarding: false,
      inconsolableCry: false,
      lessActive: false,
      triggers: [],
      flushing: false,
      sweating: false,
      cough: false,
      wheeze: false,
      runnyNose: false,
      mouthBreathing: false,
      episodeType: "irritability",
      impactLevel: "stopped activity",
      gaitInstability: false,
      fallsCount: "",
    },
  })

  const [pinnedItems, setPinnedItems] = useState({
    symptom: [],
    nutrition: [],
    medication: [],
  })

  useEffect(() => {
    const savedPinnedItems = localStorage.getItem("caregene-pinned-items")
    if (savedPinnedItems) {
      setPinnedItems(JSON.parse(savedPinnedItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("caregene-pinned-items", JSON.stringify(pinnedItems))
  }, [pinnedItems])

  const togglePin = (item, category) => {
    setPinnedItems((prev) => {
      const categoryPinned = prev[category] || []
      const isAlreadyPinned = categoryPinned.some((pinnedItem) => pinnedItem.id === item.id)

      if (isAlreadyPinned) {
        // Unpin the item
        return {
          ...prev,
          [category]: categoryPinned.filter((pinnedItem) => pinnedItem.id !== item.id),
        }
      } else {
        // Pin the item
        return {
          ...prev,
          [category]: [...categoryPinned, { ...item, category }],
        }
      }
    })
  }

  const isPinned = (item, category) => {
    const categoryPinned = pinnedItems[category] || []
    return categoryPinned.some((pinnedItem) => pinnedItem.id === item.id)
  }

  const assignEmojiToItem = (itemName, category) => {
    const name = itemName.toLowerCase()

    // Emoji mappings for different categories
    const emojiMaps = {
      symptom: {
        // Pain and discomfort
        pain: "😣",
        ache: "😖",
        hurt: "😣",
        sore: "😰",
        cramp: "😫",
        headache: "🤕",
        migraine: "🤕",
        backache: "😰",
        // Digestive
        nausea: "🤢",
        vomit: "🤮",
        stomach: "🤢",
        diarrhea: "😷",
        constipation: "😰",
        bloat: "😮‍💨",
        gas: "😮‍💨",
        indigestion: "🤢",
        // Respiratory
        cough: "😷",
        sneeze: "🤧",
        congestion: "🤧",
        wheeze: "😮‍💨",
        shortness: "😮‍💨",
        breathing: "😮‍💨",
        // Neurological
        dizzy: "😵‍💫",
        confusion: "😵‍💫",
        memory: "🤔",
        focus: "🤔",
        tremor: "🫨",
        shake: "🫨",
        twitch: "😬",
        // Mood and behavior
        anxiety: "😰",
        worry: "😟",
        stress: "😰",
        panic: "😨",
        sad: "😢",
        depression: "😔",
        mood: "😐",
        irritable: "😤",
        anger: "😠",
        frustrated: "😤",
        // Sleep
        insomnia: "😴",
        tired: "😴",
        fatigue: "😴",
        sleepy: "😴",
        nightmare: "😰",
        restless: "😵‍💫",
        // Skin
        rash: "🔴",
        itch: "😣",
        dry: "😐",
        swelling: "😮",
        // General
        fever: "🤒",
        chills: "🥶",
        weakness: "😵",
        energy: "⚡",
      },
      nutrition: {
        // Meals
        breakfast: "🍳",
        lunch: "🥗",
        dinner: "🍽️",
        snack: "🍎",
        meal: "🍽️",
        food: "🍽️",
        // Beverages
        water: "💧",
        juice: "🧃",
        coffee: "☕",
        tea: "🍵",
        milk: "🥛",
        soda: "🥤",
        smoothie: "🥤",
        // Food types
        fruit: "🍎",
        apple: "🍎",
        banana: "🍌",
        orange: "🍊",
        vegetable: "🥕",
        carrot: "🥕",
        broccoli: "🥦",
        salad: "🥗",
        protein: "🥩",
        meat: "🥩",
        chicken: "🍗",
        fish: "🐟",
        dairy: "🥛",
        cheese: "🧀",
        yogurt: "🥛",
        grain: "🌾",
        bread: "🍞",
        rice: "🍚",
        pasta: "🍝",
        supplement: "💊",
        vitamin: "💊",
        mineral: "💊",
      },
      medication: {
        // Timing
        morning: "🌅",
        afternoon: "☀️",
        evening: "🌆",
        night: "🌙",
        // Types
        pill: "💊",
        tablet: "💊",
        capsule: "💊",
        liquid: "🥤",
        injection: "💉",
        shot: "💉",
        vaccine: "💉",
        cream: "🧴",
        ointment: "🧴",
        lotion: "🧴",
        drops: "💧",
        spray: "💨",
        // Categories
        antibiotic: "💊",
        painkiller: "🩹",
        pain: "🩹",
        vitamin: "🌟",
        supplement: "💊",
        prescription: "📋",
        otc: "🏪",
        over: "🏪",
        emergency: "🚨",
        rescue: "🚨",
        needed: "⚡",
      },
    }

    // Find matching emoji based on keywords
    const categoryMap = emojiMaps[category] || {}
    for (const [keyword, emoji] of Object.entries(categoryMap)) {
      if (name.includes(keyword)) {
        return emoji
      }
    }

    // If no emoji found, return first initial of the item name
    const firstInitial = itemName.charAt(0).toUpperCase()
    return firstInitial
  }

  const trackingCategories = [
    {
      id: "symptom",
      title: "Symptom",
      description: "Log symptoms and severity",
      icon: BarChart3,
      iconBg: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      id: "nutrition",
      title: "Nutrition",
      description: "Track meals and food intake",
      icon: ShoppingCart,
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      id: "medication",
      title: "Medication",
      description: "Record medication taken",
      icon: Flask,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
  ]

  const nutritionIntakeTypes = [
    { id: "meal_snack", name: "Meal/Snack", icon: "🍽️", description: "Regular meals and snacks" },
    { id: "drink", name: "Drink", icon: "🥤", description: "Beverages and liquids" },
    { id: "enteral_feed", name: "Enteral Feed", icon: "🍼", description: "Formula and tube feeding" },
    { id: "supplement", name: "Supplement", icon: "💊", description: "Vitamins and supplements" },
  ]

  const medicationActions = [
    { id: "record_dose", name: "Record a dose", icon: "💊", description: "Log medication taken" },
    { id: "add_new", name: "Add new medication", icon: "➕", description: "Add medication to list" },
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
      { id: "dairy", name: "Dairy", icon: "🥛" },
      { id: "protein", name: "Protein", icon: "🥩" },
      { id: "carbs", name: "Carbs", icon: "🍞" },
      { id: "fruits", name: "Fruits", icon: "🍌" },
      { id: "vegetables", name: "Vegetables", icon: "🥕" },
    ],
    medication: [
      { id: "morning", name: "Morning Dose", icon: "🌅" },
      { id: "afternoon", name: "Afternoon Dose", icon: "☀️" },
      { id: "evening", name: "Evening Dose", icon: "🌆" },
      { id: "night", name: "Night Dose", icon: "🌙" },
      { id: "asneeded", name: "As Needed", icon: "⚡" },
      { id: "antibiotic", name: "Antibiotic", icon: "💊" },
      { id: "painkiller", name: "Pain Relief", icon: "🩹" },
      { id: "vitamin", name: "Vitamin", icon: "🌟" },
      { id: "prescription", name: "Prescription", icon: "📋" },
      { id: "otc", name: "Over Counter", icon: "🏪" },
      { id: "injection", name: "Injection", icon: "💉" },
    ],
  }

  const getAllItems = () => {
    return [
      ...typeData.symptom.map((item) => ({ ...item, category: "symptom" })),
      ...typeData.nutrition.map((item) => ({ ...item, category: "nutrition" })),
      ...typeData.medication.map((item) => ({ ...item, category: "medication" })),
      ...customItems.symptom.map((item) => ({ ...item, category: "symptom" })),
      ...customItems.nutrition.map((item) => ({ ...item, category: "nutrition" })),
      ...customItems.medication.map((item) => ({ ...item, category: "medication" })),
    ]
  }

  const getFilteredItems = () => {
    let items = []

    if (selectedCategory === "all") {
      items = [
        ...typeData.symptom.map((item) => ({ ...item, category: "symptom" })),
        ...typeData.nutrition.map((item) => ({ ...item, category: "nutrition" })),
        ...typeData.medication.map((item) => ({ ...item, category: "medication" })),
        ...customItems.symptom.map((item) => ({ ...item, category: "symptom" })),
        ...customItems.nutrition.map((item) => ({ ...item, category: "nutrition" })),
        ...customItems.medication.map((item) => ({ ...item, category: "medication" })),
      ]
    } else {
      items = [
        ...typeData[selectedCategory].map((item) => ({ ...item, category: selectedCategory })),
        ...customItems[selectedCategory].map((item) => ({ ...item, category: selectedCategory })),
      ]
    }

    if (searchQuery.trim()) {
      items = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return items.sort((a, b) => {
      const aIsPinned = isPinned(a, a.category)
      const bIsPinned = isPinned(b, b.category)

      if (aIsPinned && !bIsPinned) return -1
      if (!aIsPinned && bIsPinned) return 1
      return 0
    })
  }

  const getMobileFilteredItems = () => {
    let items = typeData[mobileBrowserCategory] || []

    if (mobileSearchQuery.trim()) {
      items = items.filter((item) => item.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()))
    }

    return items.sort((a, b) => {
      const aIsPinned = isPinned(a, mobileBrowserCategory)
      const bIsPinned = isPinned(b, mobileBrowserCategory)

      if (aIsPinned && !bIsPinned) return -1
      if (!aIsPinned && bIsPinned) return 1
      return 0
    })
  }

  const hasSearchResults = () => {
    if (!searchQuery.trim()) return true
    return getFilteredItems().length > 0
  }

  const getCategoryTitle = () => {
    if (searchQuery.trim()) return "Search All Types"
    const category = trackingCategories.find((cat) => cat.id === selectedCategory)
    return `Choose ${category?.title} Type`
  }

  const handleTypeSpecificChange = (field, value) => {
    setSymptomData((prev) => ({
      ...prev,
      typeSpecific: {
        ...prev.typeSpecific,
        [field]: value,
      },
    }))
  }

  const handleTriggerToggle = (trigger) => {
    setSymptomData((prev) => ({
      ...prev,
      typeSpecific: {
        ...prev.typeSpecific,
        triggers: prev.typeSpecific.triggers.includes(trigger)
          ? prev.typeSpecific.triggers.filter((t) => t !== trigger)
          : [...prev.typeSpecific.triggers, trigger],
      },
    }))
  }

  const handleSymptomClick = (item) => {
    if (item.category === "symptom" || selectedCategory === "symptom") {
      setSelectedSymptom(item)
      setCurrentPage(2)
      setHasUnsavedChanges(false)
      // Reset symptom data
      setSymptomData({
        startTime: new Date().toISOString().slice(0, 16),
        duration: "",
        ongoing: false,
        severity: 3,
        context: [],
        notes: "",
        typeSpecific: {
          seizureType: "unknown",
          recoveryState: "OK",
          clustering: false,
          sleepLatency: "",
          nightAwakenings: "",
          snoring: false,
          stoolType: "",
          straining: false,
          vomiting: false,
          faceGrimace: false,
          guarding: false,
          inconsolableCry: false,
          lessActive: false,
          triggers: [],
          flushing: false,
          sweating: false,
          cough: false,
          wheeze: false,
          runnyNose: false,
          mouthBreathing: false,
          episodeType: "irritability",
          impactLevel: "stopped activity",
          gaitInstability: false,
          fallsCount: "",
        },
      })
    } else if (item.category === "nutrition" || selectedCategory === "nutrition") {
      setSelectedNutrition(item)
      setNutritionStep(1)
      setCurrentPage(2)
      setHasUnsavedChanges(false)
      // Reset nutrition data
      setNutritionData({
        intakeType: "",
        foods: [],
        portionSize: "",
        texture: [],
        setting: [],
        beverage: "",
        volume: "",
        formulaBrand: "",
        concentration: "",
        delivery: "",
        supplementName: "",
        form: "",
        strength: "",
        amount: "",
        time: new Date().toISOString().slice(0, 16),
        notes: "",
      })
    } else if (item.category === "medication" || selectedCategory === "medication") {
      setSelectedMedication(item)
      setMedicationStep(1)
      setCurrentPage(2)
      setHasUnsavedChanges(false)
      // Reset medication data
      setMedicationData({
        action: "record_dose",
        medicationName: "",
        doseTaken: "",
        scheduledWindow: "",
        actualTime: new Date().toISOString().slice(0, 16),
        lotBottle: "Current bottle",
        notes: "",
        brandGeneric: "",
        form: "",
        strength: "",
        directions: "",
        scheduleWindows: [],
        pharmacy: "",
      })
    }
  }

  const handleMobileCategoryClick = (categoryId) => {
    if (isMobile) {
      setMobileBrowserCategory(categoryId)
      setShowMobileSymptomBrowser(true)
      setMobileSearchQuery("")
    } else {
      setSelectedCategory(categoryId)
      setSearchQuery("")
    }
  }

  const handleSaveSymptom = () => {
    console.log("[v0] handleSaveSymptom called")
    const logEntry = {
      symptom: selectedSymptom.name,
      startTime: symptomData.startTime,
      duration: symptomData.duration,
      ongoing: symptomData.ongoing,
      severity: symptomData.severity,
      context: symptomData.context,
      notes: symptomData.notes,
      typeSpecific: symptomData.typeSpecific,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Saving symptom log:", logEntry)

    setHasUnsavedChanges(false)
    console.log("[v0] Setting currentPage to 3")
    setCurrentPage(3)
  }

  const handleSaveNutrition = () => {
    console.log("[v0] handleSaveNutrition called")
    const logEntry = {
      nutrition: selectedNutrition?.name || nutritionData.intakeType,
      intakeType: nutritionData.intakeType,
      foods: nutritionData.foods,
      portionSize: nutritionData.portionSize,
      texture: nutritionData.texture,
      setting: nutritionData.setting,
      beverage: nutritionData.beverage,
      volume: nutritionData.volume,
      formulaBrand: nutritionData.formulaBrand,
      concentration: nutritionData.concentration,
      delivery: nutritionData.delivery,
      supplementName: nutritionData.supplementName,
      form: nutritionData.form,
      strength: nutritionData.strength,
      amount: nutritionData.amount,
      time: nutritionData.time,
      notes: nutritionData.notes,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Saving nutrition log:", logEntry)

    setHasUnsavedChanges(false)
    console.log("[v0] Setting currentPage to 3")
    setCurrentPage(3)
  }

  const handleSaveMedication = () => {
    console.log("[v0] handleSaveMedication called")
    const logEntry = {
      medication: selectedMedication?.name || medicationData.medicationName,
      action: medicationData.action,
      medicationName: medicationData.medicationName,
      doseTaken: medicationData.doseTaken,
      scheduledWindow: medicationData.scheduledWindow,
      actualTime: medicationData.actualTime,
      lotBottle: medicationData.lotBottle,
      notes: medicationData.notes,
      timestamp: new Date().toISOString(),
    }
    console.log("[v0] Saving medication log:", logEntry)

    setHasUnsavedChanges(false)
    console.log("[v0] Setting currentPage to 3")
    setCurrentPage(3)
  }

  const handleSaveAndAddAnother = () => {
    console.log("[v0] handleSaveAndAddAnother called")
    if (selectedSymptom) {
      handleSaveSymptom()
      setTimeout(() => {
        console.log("[v0] Setting currentPage back to 2 for add another")
        setCurrentPage(2)
      }, 100)
    } else if (selectedNutrition) {
      handleSaveNutrition()
      setTimeout(() => {
        console.log("[v0] Setting currentPage back to 2 for add another")
        setCurrentPage(2)
      }, 100)
    } else if (selectedMedication) {
      handleSaveMedication()
      setTimeout(() => {
        console.log("[v0] Setting currentPage back to 2 for add another")
        setCurrentPage(2)
      }, 100)
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        setCurrentPage(1)
        setHasUnsavedChanges(false)
      }
    } else {
      setCurrentPage(1)
    }
  }

  const handleSaveBehaviorEpisode = () => {
    const behaviorEntry = {
      type: behaviorData.type,
      intensity: behaviorData.intensity,
      duration: behaviorData.duration,
      triggers: behaviorData.triggers,
      interventions: behaviorData.interventions,
      comments: behaviorData.comments,
      timestamp: new Date().toISOString(),
    }
    console.log("Saving behavior episode:", behaviorEntry)
    // Here you would save to your data store
    setShowBehaviorLogger(false)
  }

  const contextOptions = ["therapy day", "illness", "travel", "loud environment", "school day", "menses"]

  const handleContextToggle = (context) => {
    setSymptomData((prev) => ({
      ...prev,
      context: prev.context.includes(context) ? prev.context.filter((c) => c !== context) : [...prev.context, context],
    }))
  }

  const setCurrentTime = () => {
    setSymptomData((prev) => ({
      ...prev,
      startTime: new Date().toISOString().slice(0, 16),
    }))
  }

  const categories = [
    {
      id: "symptom",
      name: "Symptom",
      description: "Track symptoms and severity",
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      color: "bg-red-500",
    },
    {
      id: "nutrition",
      name: "Nutrition",
      description: "Track meals and food intake",
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      color: "bg-green-500",
    },
    {
      id: "medication",
      name: "Medication",
      description: "Record medication taken",
      icon: <Flask className="h-6 w-6 text-white" />,
      color: "bg-blue-500",
    },
  ]

  const renderPage3Content = () => {
    const getSuccessMessage = () => {
      if (selectedSymptom) return `${selectedSymptom.name} symptom logged successfully!`
      if (selectedNutrition) return `${selectedNutrition.name} nutrition logged successfully!`
      if (selectedMedication) return `${selectedMedication.name} medication logged successfully!`
      return "Entry logged successfully!"
    }

    const getEntryType = () => {
      if (selectedSymptom) return "symptom"
      if (selectedNutrition) return "nutrition"
      if (selectedMedication) return "medication"
      return "entry"
    }

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" onClick={() => setCurrentPage(1)} className="mb-4 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tracker
          </Button>

          {/* Page indicator */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-semibold">
                ✓
              </div>
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-semibold">
                ✓
              </div>
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-semibold">
                3
              </div>
            </div>
          </div>

          {/* Success message */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">{getSuccessMessage()}</h2>

              <p className="text-gray-600 mb-6">
                Your {getEntryType()} has been saved and can be found in your health journal.
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  className="bg-transparent border-gray-300 hover:border-gray-400"
                >
                  Back to Tracker
                </Button>
                <Button onClick={() => setCurrentPage(2)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Log Another {getEntryType()}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderPage2Content = () => {
    if (selectedSymptom) {
      return renderSymptomLogging()
    } else if (selectedNutrition || selectedCategory === "nutrition") {
      return renderNutritionLogging()
    } else if (selectedMedication || selectedCategory === "medication") {
      return renderMedicationLogging()
    }
    return null
  }

  const renderSymptomLogging = () => (
    <div className="max-w-2xl mx-auto px-6">
      {/* Page indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
            1
          </div>
          <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-medium">
            2
          </div>
          <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
            3
          </div>
        </div>
      </div>

      {/* Back button */}
      <Button
        variant="ghost"
        onClick={handleCancel}
        className="mb-6 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Core Information</h2>
          <p className="text-gray-600">Record essential details about your symptom experience</p>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Start Time */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-1">
              Start Time <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSymptomData((prev) => ({ ...prev, startTime: new Date().toISOString().slice(0, 16) }))
                  setHasUnsavedChanges(true)
                }}
                className="px-3 py-2 text-sm border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                Now
              </Button>
              <Input
                type="datetime-local"
                value={symptomData.startTime}
                onChange={(e) => {
                  setSymptomData((prev) => ({ ...prev, startTime: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-1">
              Duration <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="text"
                placeholder="Enter duration (e.g., 30 minutes)"
                value={symptomData.duration}
                onChange={(e) => {
                  setSymptomData((prev) => ({ ...prev, duration: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ongoing"
                  checked={symptomData.ongoing}
                  onChange={(e) => {
                    setSymptomData((prev) => ({ ...prev, ongoing: e.target.checked }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="ongoing" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Ongoing
                </Label>
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-1">
              Severity: {symptomData.severity}/5 <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={symptomData.severity}
                onChange={(e) => {
                  setSymptomData((prev) => ({ ...prev, severity: Number.parseInt(e.target.value) }))
                  setHasUnsavedChanges(true)
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>None</span>
                <span>Severe</span>
              </div>
            </div>
          </div>

          {/* Type-specific fields */}
          {selectedSymptom && renderTypeSpecificFields()}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              Notes <span className="text-gray-500 text-sm font-normal">(optional)</span>
            </Label>
            <div className="space-y-1">
              <Textarea
                placeholder="Describe what you're experiencing..."
                value={symptomData.notes}
                onChange={(e) => {
                  setSymptomData((prev) => ({ ...prev, notes: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="min-h-[80px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                maxLength={300}
              />
              <div className="flex justify-end text-xs text-gray-500">
                <span>{symptomData.notes.length}/300</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-gray-300 hover:border-gray-400 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSymptom} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              Save
            </Button>
            <Button onClick={handleSaveAndAddAnother} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              Save & Add Another
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNutritionLogging = () => {
    if (nutritionStep === 1) {
      return (
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-medium">
                1
              </div>
              <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
                2
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-6 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose Intake Type</h2>
              <p className="text-gray-600">Select the type of nutrition you want to log</p>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nutritionIntakeTypes.map((type) => (
                  <Card
                    key={type.id}
                    onClick={() => {
                      setNutritionData((prev) => ({ ...prev, intakeType: type.name }))
                      setNutritionStep(2)
                      setHasUnsavedChanges(true)
                    }}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-300 hover:border-blue-400"
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
              1
            </div>
            <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-medium">
              2
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => setNutritionStep(1)}
          className="mb-6 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{nutritionData.intakeType} Details</h2>
            <p className="text-gray-600">Record specific information about this intake</p>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Common time field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Time</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNutritionData((prev) => ({ ...prev, time: new Date().toISOString().slice(0, 16) }))
                    setHasUnsavedChanges(true)
                  }}
                  className="px-3 py-2 text-sm"
                >
                  Now
                </Button>
                <Input
                  type="datetime-local"
                  value={nutritionData.time}
                  onChange={(e) => {
                    setNutritionData((prev) => ({ ...prev, time: e.target.value }))
                    setHasUnsavedChanges(true)
                  }}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Type-specific fields */}
            {nutritionData.intakeType === "Meal/Snack" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Foods</Label>
                  <Input
                    placeholder="Enter foods (e.g., chicken, rice, broccoli)"
                    value={nutritionData.foods.join(", ")}
                    onChange={(e) => {
                      setNutritionData((prev) => ({
                        ...prev,
                        foods: e.target.value.split(", ").filter((f) => f.trim()),
                      }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Portion Size</Label>
                  <select
                    value={nutritionData.portionSize}
                    onChange={(e) => {
                      setNutritionData((prev) => ({ ...prev, portionSize: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select portion size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Texture</Label>
                  <div className="flex flex-wrap gap-2">
                    {["puree", "soft", "regular"].map((texture) => (
                      <Badge
                        key={texture}
                        variant={nutritionData.texture.includes(texture) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setNutritionData((prev) => ({
                            ...prev,
                            texture: prev.texture.includes(texture)
                              ? prev.texture.filter((t) => t !== texture)
                              : [...prev.texture, texture],
                          }))
                          setHasUnsavedChanges(true)
                        }}
                      >
                        {texture}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {nutritionData.intakeType === "Drink" && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Beverage</Label>
                  <select
                    value={nutritionData.beverage}
                    onChange={(e) => {
                      setNutritionData((prev) => ({ ...prev, beverage: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select beverage</option>
                    <option value="water">Water</option>
                    <option value="milk">Milk</option>
                    <option value="juice">Juice</option>
                    <option value="formula">Formula</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Volume (mL/oz)</Label>
                  <Input
                    placeholder="Enter volume"
                    value={nutritionData.volume}
                    onChange={(e) => {
                      setNutritionData((prev) => ({ ...prev, volume: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Notes (optional)</Label>
              <Textarea
                placeholder="Additional notes about this intake..."
                value={nutritionData.notes}
                onChange={(e) => {
                  setNutritionData((prev) => ({ ...prev, notes: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSaveNutrition} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                Save
              </Button>
              <Button onClick={handleSaveAndAddAnother} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                Save & Add Another
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderMedicationLogging = () => {
    if (medicationStep === 1) {
      return (
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-medium">
                1
              </div>
              <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
                2
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-6 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Choose Action</h2>
              <p className="text-gray-600">What would you like to do?</p>
            </div>

            <div className="px-6 py-5">
              <div className="space-y-3">
                {medicationActions.map((action) => (
                  <Card
                    key={action.id}
                    onClick={() => {
                      setMedicationData((prev) => ({ ...prev, action: action.id }))
                      setMedicationStep(2)
                      setHasUnsavedChanges(true)
                    }}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-300 hover:border-blue-400"
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="text-xl">{action.icon}</div>
                      <div>
                        <h3 className="font-semibold text-sm">{action.name}</h3>
                        <p className="text-xs text-gray-600">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-sm font-medium">
              1
            </div>
            <div className="w-8 h-0.5 bg-gray-200 rounded-full"></div>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white text-sm font-medium">
              2
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => setMedicationStep(1)}
          className="mb-6 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {medicationData.action === "record_dose" ? "Record a Dose" : "Add New Medication"}
            </h2>
            <p className="text-gray-600">
              {medicationData.action === "record_dose"
                ? "Log medication that was taken"
                : "Add a new medication to your list"}
            </p>
          </div>

          <div className="px-6 py-5 space-y-6">
            {medicationData.action === "record_dose" ? (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Medication Name</Label>
                  <Input
                    placeholder="Search or enter medication name"
                    value={medicationData.medicationName}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, medicationName: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Dose Taken</Label>
                  <Input
                    placeholder="e.g., 2 tablets, 5 mL, 2 puffs"
                    value={medicationData.doseTaken}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, doseTaken: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Scheduled Window</Label>
                  <select
                    value={medicationData.scheduledWindow}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, scheduledWindow: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select window</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                    <option value="Noon">Noon</option>
                    <option value="HS">HS (Bedtime)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Actual Time</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMedicationData((prev) => ({ ...prev, actualTime: new Date().toISOString().slice(0, 16) }))
                        setHasUnsavedChanges(true)
                      }}
                      className="px-3 py-2 text-sm"
                    >
                      Now
                    </Button>
                    <Input
                      type="datetime-local"
                      value={medicationData.actualTime}
                      onChange={(e) => {
                        setMedicationData((prev) => ({ ...prev, actualTime: e.target.value }))
                        setHasUnsavedChanges(true)
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Name (brand/generic)</Label>
                  <Input
                    placeholder="Enter medication name"
                    value={medicationData.brandGeneric}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, brandGeneric: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Form</Label>
                  <select
                    value={medicationData.form}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, form: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select form</option>
                    <option value="tablet">Tablet</option>
                    <option value="liquid">Liquid</option>
                    <option value="inhaler">Inhaler</option>
                    <option value="patch">Patch</option>
                    <option value="topical">Topical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Strength</Label>
                  <Input
                    placeholder="e.g., 5 mg or 125 mg/5 mL"
                    value={medicationData.strength}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, strength: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Directions</Label>
                  <Input
                    placeholder="e.g., 5 mL twice daily"
                    value={medicationData.directions}
                    onChange={(e) => {
                      setMedicationData((prev) => ({ ...prev, directions: e.target.value }))
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Notes (optional)</Label>
              <Textarea
                placeholder="Additional notes..."
                value={medicationData.notes}
                onChange={(e) => {
                  setMedicationData((prev) => ({ ...prev, notes: e.target.value }))
                  setHasUnsavedChanges(true)
                }}
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSaveMedication} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                {medicationData.action === "record_dose" ? "Save" : "Add Medication"}
              </Button>
              {medicationData.action === "record_dose" && (
                <Button onClick={handleSaveAndAddAnother} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  Save & Add Another
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTypeSpecificFields = () => {
    if (!selectedSymptom) return null

    return (
      <div className="border-t border-gray-100 pt-6 space-y-6">
        {/* Removed: Seizure Specific Details section with "Additional information specific to this symptom type" */}

        {/* Seizure specific fields */}
        {selectedSymptom.id === "seizure" && (
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Type</Label>
              <select
                value={symptomData.typeSpecific.seizureType}
                onChange={(e) => {
                  handleTypeSpecificChange("seizureType", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="unknown">Unknown</option>
                <option value="new">New</option>
                <option value="focal">Focal</option>
                <option value="generalized">Generalized</option>
              </select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Recovery State</Label>
              <select
                value={symptomData.typeSpecific.recoveryState}
                onChange={(e) => {
                  handleTypeSpecificChange("recoveryState", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="OK">OK</option>
                <option value="tired">Tired</option>
                <option value="confused">Confused</option>
              </select>
            </div>
            <Label className="flex items-center">
              <input
                type="checkbox"
                checked={symptomData.typeSpecific.clustering}
                onChange={(e) => {
                  handleTypeSpecificChange("clustering", e.target.checked)
                  setHasUnsavedChanges(true)
                }}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-900">Clustering</span>
            </Label>
          </div>
        )}

        {/* Sleep specific fields */}
        {selectedSymptom.id === "sleep" && (
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Sleep Latency (minutes)</Label>
              <Input
                type="number"
                value={symptomData.typeSpecific.sleepLatency}
                onChange={(e) => {
                  handleTypeSpecificChange("sleepLatency", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Night Awakenings Count</Label>
              <Input
                type="number"
                value={symptomData.typeSpecific.nightAwakenings}
                onChange={(e) => {
                  handleTypeSpecificChange("nightAwakenings", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Label className="flex items-center">
              <input
                type="checkbox"
                checked={symptomData.typeSpecific.snoring}
                onChange={(e) => {
                  handleTypeSpecificChange("snoring", e.target.checked)
                  setHasUnsavedChanges(true)
                }}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-900">Snoring</span>
            </Label>
          </div>
        )}

        {/* GI specific fields */}
        {selectedSymptom.id === "gi" && (
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Stool Type (Bristol Scale)</Label>
              <select
                value={symptomData.typeSpecific.stoolType}
                onChange={(e) => {
                  handleTypeSpecificChange("stoolType", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="1">Type 1 - Separate hard lumps</option>
                <option value="2">Type 2 - Lumpy and sausage like</option>
                <option value="3">Type 3 - A sausage shape with cracks in the surface</option>
                <option value="4">Type 4 - Like a smooth, soft sausage or snake</option>
                <option value="5">Type 5 - Soft blobs with clear-cut edges</option>
                <option value="6">Type 6 - Mushy consistency with ragged edges</option>
                <option value="7">Type 7 - Liquid consistency with no solid pieces</option>
              </select>
            </div>
            <div className="flex gap-6">
              <Label className="flex items-center">
                <input
                  type="checkbox"
                  checked={symptomData.typeSpecific.straining}
                  onChange={(e) => {
                    handleTypeSpecificChange("straining", e.target.checked)
                    setHasUnsavedChanges(true)
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-900">Straining</span>
              </Label>
              <Label className="flex items-center">
                <input
                  type="checkbox"
                  checked={symptomData.typeSpecific.vomiting}
                  onChange={(e) => {
                    handleTypeSpecificChange("vomiting", e.target.checked)
                    setHasUnsavedChanges(true)
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-900">Vomiting</span>
              </Label>
            </div>
          </div>
        )}

        {/* Pain/Discomfort specific fields */}
        {selectedSymptom.id === "pain" && (
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Quick Checklist</Label>
              <div className="space-y-2">
                {[
                  { key: "faceGrimace", label: "Face grimace" },
                  { key: "guarding", label: "Guarding" },
                  { key: "inconsolableCry", label: "Inconsolable cry" },
                  { key: "lessActive", label: "Less active" },
                ].map(({ key, label }) => (
                  <Label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={symptomData.typeSpecific[key]}
                      onChange={(e) => {
                        handleTypeSpecificChange(key, e.target.checked)
                        setHasUnsavedChanges(true)
                      }}
                      className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
                    />
                    <span className="text-sm text-gray-900">{label}</span>
                  </Label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sensory/Autonomic specific fields */}
        {selectedSymptom.id === "sensory" && (
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Triggers</Label>
              <div className="flex flex-wrap gap-2">
                {["sound", "light", "touch"].map((trigger) => (
                  <Badge
                    key={trigger}
                    variant={symptomData.typeSpecific.triggers.includes(trigger) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      handleTriggerToggle(trigger)
                      setHasUnsavedChanges(true)
                    }}
                  >
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-6">
              <Label className="flex items-center">
                <input
                  type="checkbox"
                  checked={symptomData.typeSpecific.flushing}
                  onChange={(e) => {
                    handleTypeSpecificChange("flushing", e.target.checked)
                    setHasUnsavedChanges(true)
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-900">Flushing</span>
              </Label>
              <Label className="flex items-center">
                <input
                  type="checkbox"
                  checked={symptomData.typeSpecific.sweating}
                  onChange={(e) => {
                    handleTypeSpecificChange("sweating", e.target.checked)
                    setHasUnsavedChanges(true)
                  }}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-900">Sweating</span>
              </Label>
            </div>
          </div>
        )}

        {/* Respiratory/ENT specific fields */}
        {selectedSymptom.id === "respiratory" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "cough", label: "Cough" },
                { key: "wheeze", label: "Wheeze" },
                { key: "runnyNose", label: "Runny nose" },
                { key: "mouthBreathing", label: "Mouth breathing" },
              ].map(({ key, label }) => (
                <Label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={symptomData.typeSpecific[key]}
                    onChange={(e) => {
                      handleTypeSpecificChange(key, e.target.checked)
                      setHasUnsavedChanges(true)
                    }}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
                  />
                  <span className="text-sm text-gray-900">{label}</span>
                </Label>
              ))}
            </div>
          </div>
        )}

        {/* Behavior Episode specific fields */}
        {selectedSymptom.id === "behavior" && (
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Episode Type</Label>
              <select
                value={symptomData.typeSpecific.episodeType}
                onChange={(e) => {
                  handleTypeSpecificChange("episodeType", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="irritability">Irritability</option>
                <option value="agitation">Agitation</option>
                <option value="elopement">Elopement</option>
                <option value="repetitive">Repetitive</option>
              </select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Impact</Label>
              <select
                value={symptomData.typeSpecific.impactLevel}
                onChange={(e) => {
                  handleTypeSpecificChange("impactLevel", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="stopped activity">Stopped activity</option>
                <option value="needed support">Needed support</option>
              </select>
            </div>
          </div>
        )}

        {/* Motor specific fields */}
        {selectedSymptom.id === "motor" && (
          <div className="space-y-4">
            <Label className="flex items-center">
              <input
                type="checkbox"
                checked={symptomData.typeSpecific.gaitInstability}
                onChange={(e) => {
                  handleTypeSpecificChange("gaitInstability", e.target.checked)
                  setHasUnsavedChanges(true)
                }}
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mr-3"
              />
              <span className="text-sm text-gray-900">Gait instability</span>
            </Label>
            <div>
              <Label className="block text-sm font-medium text-gray-900 mb-2">Falls Count</Label>
              <Input
                type="number"
                value={symptomData.typeSpecific.fallsCount}
                onChange={(e) => {
                  handleTypeSpecificChange("fallsCount", e.target.value)
                  setHasUnsavedChanges(true)
                }}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <Navigation />
      <main className="pl-12 sm:pl-12 md:pl-12 lg:pl-14 xl:pl-16 h-full flex flex-col">
        <div className="flex-1 px-3 sm:px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">What would you like to log?</h2>

                {currentPage === 1 ? (
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
                                ? "border-2 border-blue-400 bg-blue-50 shadow-lg"
                                : "border border-gray-300 bg-white hover:border-gray-400"
                            }`}
                          >
                            <CardContent className="p-4 text-center">
                              <div
                                className={`w-10 h-10 sm:w-12 sm:h-12 ${category.iconBg} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg`}
                              >
                                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                              </div>
                              <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-900">
                                {category.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">{category.description}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {!isMobile && (
                      <>
                        <div className="flex justify-center mb-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                              1
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-gray-500 rounded-full text-xs sm:text-sm font-semibold">
                              2
                            </div>
                            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 text-gray-500 rounded-full text-xs sm:text-sm font-semibold">
                              3
                            </div>
                          </div>
                        </div>

                        <div className="max-w-4xl mx-auto">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2 sm:gap-0">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900">{getCategoryTitle()}</h3>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <div className="relative bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-colors flex-1 sm:flex-none">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                                <Input
                                  placeholder="Search all types..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-7 pr-3 py-1 text-xs w-full sm:w-40 h-8 sm:h-7 border-0 bg-transparent focus:ring-1 focus:ring-blue-400"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
                            {/* Add New Card - Always first */}
                            <Card
                              className="cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 min-h-[80px] sm:min-h-auto"
                              onClick={() => setShowManualAdd(true)}
                            >
                              <CardContent className="p-2 sm:p-3 text-center flex flex-col items-center justify-center h-full">
                                <div className="text-2xl sm:text-3xl text-gray-400">+</div>
                                <p className="text-[8px] sm:text-[10px] text-gray-500 mt-1">Add New</p>
                              </CardContent>
                            </Card>

                            {getFilteredItems().map((item) => (
                              <Card
                                key={item.id}
                                onClick={() => handleSymptomClick(item)}
                                className={`cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 border bg-white hover:border-blue-400 hover:bg-blue-50 min-h-[80px] sm:min-h-auto relative group ${
                                  isPinned(item, item.category)
                                    ? "border-yellow-400 bg-yellow-50 ring-1 ring-yellow-200"
                                    : "border-gray-300"
                                }`}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePin(item, item.category)
                                  }}
                                  className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                                    isPinned(item, item.category)
                                      ? "bg-yellow-500 text-white shadow-sm"
                                      : "bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-yellow-500 hover:text-white"
                                  }`}
                                  title={isPinned(item, item.category) ? "Unpin item" : "Pin item"}
                                >
                                  📌
                                </button>

                                <CardContent className="p-2 sm:p-3 text-center flex flex-col items-center justify-center h-full">
                                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">
                                    {item.icon.length === 1 && /^[A-Z]$/.test(item.icon) ? (
                                      <div className="w-6 h-6 sm:w-8 sm:h-8 mx-auto bg-gray-400 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold shadow-sm">
                                        {item.icon}
                                      </div>
                                    ) : (
                                      item.icon
                                    )}
                                  </div>
                                  <p className="text-[10px] sm:text-xs font-medium text-gray-800 leading-tight text-center">
                                    {item.name}
                                  </p>
                                  {searchQuery.trim() && (
                                    <p className="text-[8px] sm:text-[10px] text-gray-500 mt-1 capitalize">
                                      {item.category}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : currentPage === 2 ? (
                  renderPage2Content()
                ) : currentPage === 3 ? (
                  renderPage3Content()
                ) : null}

                {/* Shared Components */}
                {showAIModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Use AI to fill fields (coming soon)</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex gap-2">
                          <Button variant="outline" disabled className="flex-1 bg-transparent">
                            Text
                          </Button>
                          <Button variant="outline" disabled className="flex-1 bg-transparent">
                            Photo/Video
                          </Button>
                          <Button variant="outline" disabled className="flex-1 bg-transparent">
                            Voice
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                          Your privacy is protected. All data is processed securely.
                        </p>
                      </div>
                      <Button onClick={() => setShowAIModal(false)} className="w-full">
                        Close
                      </Button>
                    </div>
                  </div>
                )}

                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete entry?</h3>
                      <p className="text-gray-600 mb-6">This can't be undone.</p>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            console.log("Deleting item:", itemToDelete)
                            setShowDeleteConfirm(false)
                            setItemToDelete(null)
                          }}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {showMobileSymptomBrowser && (
                  <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowMobileSymptomBrowser(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <h2 className="text-lg font-semibold text-gray-900 capitalize">
                          {mobileBrowserCategory} Types
                        </h2>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white border-b border-gray-100 px-4 py-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder={`Search ${mobileBrowserCategory} types...`}
                          value={mobileSearchQuery}
                          onChange={(e) => setMobileSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <Card
                          className="cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 border-2 border-dashed border-gray-300 bg-white hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white min-h-[100px]"
                          onClick={() => {
                            setSelectedCategory(mobileBrowserCategory)
                            setSearchQuery(mobileSearchQuery)
                            setShowMobileSymptomBrowser(false)
                            setShowManualAdd(true)
                          }}
                        >
                          <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                            <div className="text-3xl text-gray-400 mb-2">+</div>
                            <p className="text-xs text-gray-600">Add New</p>
                            {mobileSearchQuery.trim() && (
                              <p className="text-[10px] text-gray-500 mt-1">"{mobileSearchQuery}"</p>
                            )}
                          </CardContent>
                        </Card>

                        {getMobileFilteredItems().map((item) => (
                          <Card
                            key={item.id}
                            onClick={() => {
                              setShowMobileSymptomBrowser(false)
                              handleSymptomClick({ ...item, category: mobileBrowserCategory })
                            }}
                            className={`cursor-pointer hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 border bg-white hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white min-h-[100px] relative group ${
                              isPinned(item, mobileBrowserCategory)
                                ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white ring-1 ring-yellow-200"
                                : "border-gray-300"
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                togglePin(item, mobileBrowserCategory)
                              }}
                              className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                                isPinned(item, mobileBrowserCategory)
                                  ? "bg-yellow-500 text-white shadow-sm"
                                  : "bg-gray-200 text-gray-600 hover:bg-yellow-500 hover:text-white"
                              }`}
                              title={isPinned(item, mobileBrowserCategory) ? "Unpin item" : "Pin item"}
                            >
                              📌
                            </button>

                            <CardContent className="p-4 text-center flex flex-col items-center justify-center h-full">
                              <div className="text-2xl mb-2">
                                {item.icon.length === 1 && /^[A-Z]$/.test(item.icon) ? (
                                  <div className="w-8 h-8 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                                    {item.icon}
                                  </div>
                                ) : (
                                  item.icon
                                )}
                              </div>
                              <p className="text-xs font-medium text-gray-800 leading-tight text-center">{item.name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* No Results */}
                      {mobileSearchQuery.trim() && getMobileFilteredItems().length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">
                            No {mobileBrowserCategory} types found for "{mobileSearchQuery}"
                          </p>
                          <Button
                            onClick={() => {
                              setSelectedCategory(mobileBrowserCategory)
                              setSearchQuery(mobileSearchQuery)
                              setShowMobileSymptomBrowser(false)
                              setShowManualAdd(true)
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            Add "{mobileSearchQuery}" as new {mobileBrowserCategory}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showSymptomLogger && selectedSymptom && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
                        <div className="flex items-start sm:items-center gap-3 flex-1">
                          <div className="text-xl sm:text-2xl">{selectedSymptom.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                              Log {selectedSymptom.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">Record details about this symptom</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowSymptomLogger(false)
                            setSelectedSymptom(null)
                          }}
                          className="h-8 w-8 p-0 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        {/* Severity Level */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            Severity Level: {symptomData.severity}/10
                          </label>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] sm:text-xs text-gray-500">Mild</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={symptomData.severity}
                              onChange={(e) =>
                                setSymptomData({ ...symptomData, severity: Number.parseInt(e.target.value) })
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #10b981 0%, #f59e0b ${symptomData.severity * 10}%, #ef4444 100%)`,
                              }}
                            />
                            <span className="text-[10px] sm:text-xs text-gray-500">Severe</span>
                          </div>
                          <div className="flex justify-between text-[8px] sm:text-xs text-gray-400">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>7</span>
                            <span>8</span>
                            <span>9</span>
                            <span>10</span>
                          </div>
                        </div>

                        {/* Time of Day */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Time of Day</label>
                          <Input
                            type="time"
                            value={symptomData.timeOfDay}
                            onChange={(e) => setSymptomData({ ...symptomData, timeOfDay: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <Input
                            placeholder="e.g., 30 minutes, 2 hours, ongoing"
                            value={symptomData.duration}
                            onChange={(e) => setSymptomData({ ...symptomData, duration: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Location (for pain/discomfort) */}
                        {(selectedSymptom.id === "pain" ||
                          selectedSymptom.id === "gi" ||
                          selectedSymptom.id === "respiratory") && (
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                              Location/Area
                            </label>
                            <Input
                              placeholder="e.g., head, stomach, chest, left arm"
                              value={symptomData.location}
                              onChange={(e) => setSymptomData({ ...symptomData, location: e.target.value })}
                              className="w-full text-sm"
                            />
                          </div>
                        )}

                        {/* Triggers */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Possible Triggers
                          </label>
                          <Input
                            placeholder="e.g., noise, change in routine, frustration, pain"
                            value={behaviorData.triggers}
                            onChange={(e) => setBehaviorData({ ...behaviorData, triggers: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Comments */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            placeholder="Describe the symptom in detail, what helped, what made it worse, etc."
                            value={symptomData.comments}
                            onChange={(e) => setSymptomData({ ...symptomData, comments: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 sm:h-24 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowSymptomLogger(false)
                              setSelectedSymptom(null)
                            }}
                            className="w-full sm:flex-1 text-sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveSymptom}
                            className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-sm"
                          >
                            Save Symptom Log
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showBehaviorLogger && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
                        <div className="flex items-start sm:items-center gap-3 flex-1">
                          <div className="text-xl sm:text-2xl">🤯</div>
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Log Behavior Episode</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Record behavioral changes or episodes</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowBehaviorLogger(false)}
                          className="h-8 w-8 p-0 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4 sm:space-y-6">
                        {/* Behavior Type */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Behavior Type
                          </label>
                          <Input
                            placeholder="e.g., aggression, self-injury, repetitive behavior, withdrawal"
                            value={behaviorData.type}
                            onChange={(e) => setBehaviorData({ ...behaviorData, type: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Intensity Level */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            Intensity Level: {behaviorData.intensity}/10
                          </label>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] sm:text-xs text-gray-500">Mild</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={behaviorData.intensity}
                              onChange={(e) =>
                                setBehaviorData({ ...behaviorData, intensity: Number.parseInt(e.target.value) })
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #10b981 0%, #f59e0b ${behaviorData.intensity * 10}%, #ef4444 100%)`,
                              }}
                            />
                            <span className="text-[10px] sm:text-xs text-gray-500">Severe</span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <Input
                            placeholder="e.g., 5 minutes, 1 hour, intermittent"
                            value={behaviorData.duration}
                            onChange={(e) => setBehaviorData({ ...behaviorData, duration: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Triggers */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Possible Triggers
                          </label>
                          <Input
                            placeholder="e.g., noise, change in routine, frustration, pain"
                            value={behaviorData.triggers}
                            onChange={(e) => setBehaviorData({ ...behaviorData, triggers: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Interventions */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Interventions Used
                          </label>
                          <Input
                            placeholder="e.g., redirection, calming techniques, medication, removal from situation"
                            value={behaviorData.interventions}
                            onChange={(e) => setBehaviorData({ ...behaviorData, interventions: e.target.value })}
                            className="w-full text-sm"
                          />
                        </div>

                        {/* Comments */}
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            placeholder="Describe the behavior episode, what preceded it, what helped, environmental factors, etc."
                            value={behaviorData.comments}
                            onChange={(e) => setBehaviorData({ ...behaviorData, comments: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 sm:h-24 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowBehaviorLogger(false)}
                            className="w-full sm:flex-1 text-sm"
                          >
                            Skip
                          </Button>
                          <Button
                            onClick={handleSaveBehaviorEpisode}
                            className="w-full sm:flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-sm"
                          >
                            Save Behavior Log
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showManualAdd && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex flex-col">
                      <div className="flex justify-between items-start sm:items-center mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1">
                          Add New {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowManualAdd(false)
                            setNewItemName("")
                          }}
                          className="h-8 w-8 p-0 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Item Name</label>
                          <Input
                            placeholder={`Enter new ${selectedCategory} name...`}
                            value={newItemName || searchQuery}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="mb-3 text-sm"
                            autoFocus
                          />

                          {(newItemName || searchQuery) && (
                            <div className="mb-4">
                              {(() => {
                                const searchTerm = (newItemName || searchQuery).toLowerCase().trim()
                                const existingItems = [...typeData[selectedCategory], ...customItems[selectedCategory]]
                                const matchingItems = existingItems.filter((item) =>
                                  item.name.toLowerCase().includes(searchTerm),
                                )

                                if (matchingItems.length > 0) {
                                  return (
                                    <div>
                                      <p className="text-xs text-gray-600 mb-2">Existing options:</p>
                                      <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 border border-gray-200 rounded-md">
                                        {matchingItems.map((item) => (
                                          <div
                                            key={item.id}
                                            onClick={() => {
                                              setShowManualAdd(false)
                                              setNewItemName("")
                                              setSearchQuery("")
                                              handleSymptomClick({ ...item, category: selectedCategory })
                                            }}
                                            className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                          >
                                            <div className="text-sm">
                                              {item.icon.length === 1 && /^[A-Z]$/.test(item.icon) ? (
                                                <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                                  {item.icon}
                                                </div>
                                              ) : (
                                                item.icon
                                              )}
                                            </div>
                                            <span className="text-sm text-gray-800">{item.name}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )
                                }
                                return null
                              })()}
                            </div>
                          )}

                          <Button
                            onClick={() => {
                              const itemName = newItemName || searchQuery
                              if (itemName.trim()) {
                                const existingItems = [...typeData[selectedCategory], ...customItems[selectedCategory]]
                                const itemExists = existingItems.some(
                                  (item) => item.name.toLowerCase() === itemName.trim().toLowerCase(),
                                )

                                if (itemExists) {
                                  console.log(
                                    `"${itemName.trim()}" already exists. Please select it from the options above or choose a different name.`,
                                  )
                                  return
                                }

                                const newItem = {
                                  id: `custom-${Date.now()}`,
                                  name: itemName.trim(),
                                  icon: assignEmojiToItem(itemName.trim(), selectedCategory),
                                }

                                setCustomItems((prev) => ({
                                  ...prev,
                                  [selectedCategory]: [...prev[selectedCategory], newItem],
                                }))

                                console.log(`Added new ${selectedCategory}: ${itemName} with emoji: ${newItem.icon}`)
                                setNewItemName("")
                                setShowManualAdd(false)
                                setSearchQuery("")

                                handleSymptomClick({ ...newItem, category: selectedCategory })
                              }
                            }}
                            disabled={!(newItemName || searchQuery)?.trim()}
                            className="w-full text-sm"
                          >
                            Add New {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
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
      </main>
    </div>
  )
}

export default GeneticTracker
