"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ShoppingCart,
  MessageCircle,
  Share2,
  Printer,
  Info,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Sparkles,
  Clock,
  AlertCircle,
} from "lucide-react"

// Enhanced data structure for PMS guide items
interface PMSGuideItem {
  id: string
  name: string
  category: "food" | "supplement" | "medication" | "lifestyle"
  subcategory: string
  status: "safe" | "caution" | "avoid"
  rationale: string
  evidenceLevel: "strong" | "moderate" | "limited"
  concerns: string[]
  benefits?: string[]
  dosage?: string
  timing?: string
  interactions?: string[]
  contraindications?: string[]
  evidenceDetails: string
  lastUpdated: Date
  isNew: boolean
  personalizedRisk?: "high" | "medium" | "low"
  relatedConditions: string[]
}

// Mock user profile for personalization
const mockUserProfile = {
  isLoggedIn: true,
  childAllergies: ["dairy", "nuts"],
  childMedications: ["adhd medication", "asthma inhaler"],
  userConditions: ["pcos", "iron deficiency"],
  bookmarkedItems: ["magnesium", "omega-3", "dark-chocolate"],
  shoppingList: ["calcium", "vitamin-d"],
}

// Comprehensive PMS guide data
const pmsGuideData: PMSGuideItem[] = [
  // SAFE/RECOMMENDED ITEMS
  {
    id: "magnesium",
    name: "Magnesium Supplement",
    category: "supplement",
    subcategory: "Minerals",
    status: "safe",
    rationale: "Reduces cramping, bloating, and mood swings by 40-50%",
    evidenceLevel: "strong",
    concerns: [],
    benefits: ["Reduces muscle cramps", "Improves mood", "Better sleep quality", "Reduces bloating"],
    dosage: "200-400mg daily",
    timing: "Evening with food",
    interactions: ["May reduce absorption of some antibiotics"],
    evidenceDetails:
      "Multiple randomized controlled trials show magnesium supplementation significantly reduces PMS symptoms, particularly physical symptoms like cramping and bloating. A 2017 systematic review found 200-400mg daily reduced PMS severity by 40-50%.",
    lastUpdated: new Date("2024-01-10"),
    isNew: false,
    relatedConditions: ["pcos", "anxiety", "migraines"],
  },
  {
    id: "omega-3",
    name: "Omega-3 Fatty Acids",
    category: "supplement",
    subcategory: "Essential Fats",
    status: "safe",
    rationale: "Anti-inflammatory properties reduce menstrual pain and mood symptoms",
    evidenceLevel: "moderate",
    concerns: [],
    benefits: ["Reduces inflammation", "Decreases menstrual pain", "Mood stabilization", "Heart health"],
    dosage: "1000-2000mg EPA/DHA daily",
    timing: "With meals",
    interactions: ["May increase bleeding risk with blood thinners"],
    evidenceDetails:
      "Studies show omega-3 supplementation reduces inflammatory markers and prostaglandin production, leading to decreased menstrual pain. A 2018 study found significant reduction in PMS symptoms with 1000mg daily.",
    lastUpdated: new Date("2024-01-15"),
    isNew: true,
    relatedConditions: ["depression", "anxiety", "inflammation"],
  },
  {
    id: "dark-chocolate",
    name: "Dark Chocolate (70%+ Cacao)",
    category: "food",
    subcategory: "Antioxidants",
    status: "safe",
    rationale: "Rich in magnesium and mood-boosting compounds, satisfies cravings",
    evidenceLevel: "moderate",
    concerns: [],
    benefits: ["Natural magnesium source", "Mood enhancement", "Antioxidants", "Craving satisfaction"],
    dosage: "1-2 squares daily",
    timing: "When experiencing cravings",
    evidenceDetails:
      "Dark chocolate contains significant amounts of magnesium and phenylethylamine, which can improve mood. Studies show moderate consumption may help with PMS-related mood symptoms and chocolate cravings.",
    lastUpdated: new Date("2024-01-08"),
    isNew: false,
    relatedConditions: ["mood disorders", "cravings"],
  },
  {
    id: "leafy-greens",
    name: "Dark Leafy Greens",
    category: "food",
    subcategory: "Vegetables",
    status: "safe",
    rationale: "High in folate, magnesium, and iron - key nutrients for PMS relief",
    evidenceLevel: "moderate",
    concerns: [],
    benefits: ["Natural folate source", "Iron for energy", "Magnesium for cramps", "B-vitamins for mood"],
    dosage: "2-3 cups daily",
    timing: "Throughout the day",
    evidenceDetails:
      "Observational studies show women with higher intake of leafy greens have reduced PMS symptoms. These foods provide folate, magnesium, and iron - nutrients commonly deficient in women with severe PMS.",
    lastUpdated: new Date("2024-01-12"),
    isNew: false,
    relatedConditions: ["iron deficiency", "folate deficiency"],
  },
  {
    id: "calcium",
    name: "Calcium Supplement",
    category: "supplement",
    subcategory: "Minerals",
    status: "safe",
    rationale: "Reduces physical and emotional PMS symptoms by up to 48%",
    evidenceLevel: "strong",
    concerns: [],
    benefits: ["Reduces mood swings", "Decreases bloating", "Bone health", "Muscle function"],
    dosage: "1000-1200mg daily",
    timing: "Split doses with meals",
    interactions: ["Reduces iron absorption when taken together"],
    evidenceDetails:
      "Large-scale studies show calcium supplementation reduces PMS symptoms by up to 48%. The mechanism involves calcium's role in neurotransmitter function and muscle contraction regulation.",
    lastUpdated: new Date("2024-01-14"),
    isNew: true,
    relatedConditions: ["osteoporosis", "muscle cramps"],
  },

  // CAUTION ITEMS
  {
    id: "caffeine",
    name: "Caffeine (Coffee, Tea, Energy Drinks)",
    category: "food",
    subcategory: "Stimulants",
    status: "caution",
    rationale: "May worsen anxiety, breast tenderness, and sleep issues during PMS",
    evidenceLevel: "moderate",
    concerns: ["Increased anxiety", "Breast tenderness", "Sleep disruption", "Mood swings"],
    benefits: ["Energy boost", "Mental alertness"],
    dosage: "Limit to 1-2 cups coffee daily",
    timing: "Morning only, avoid after 2 PM",
    interactions: ["May interact with anxiety medications"],
    contraindications: ["Anxiety disorders", "Sleep disorders", "Breast tenderness"],
    evidenceDetails:
      "Studies show caffeine intake above 200mg daily is associated with increased PMS symptoms, particularly anxiety and breast tenderness. However, moderate intake may be tolerable for some women.",
    lastUpdated: new Date("2024-01-11"),
    isNew: false,
    personalizedRisk: "medium",
    relatedConditions: ["anxiety", "sleep disorders"],
  },
  {
    id: "dairy",
    name: "Dairy Products",
    category: "food",
    subcategory: "Proteins",
    status: "caution",
    rationale: "May increase inflammation and worsen symptoms in some women",
    evidenceLevel: "limited",
    concerns: ["Potential inflammation", "Digestive issues", "Hormonal effects"],
    benefits: ["Calcium source", "Protein", "B-vitamins"],
    dosage: "Monitor individual tolerance",
    timing: "Track symptoms with consumption",
    contraindications: ["Lactose intolerance", "Dairy allergy"],
    evidenceDetails:
      "Some observational studies suggest dairy consumption may worsen PMS symptoms in certain women, possibly due to hormonal content or inflammatory responses. However, evidence is mixed and individual tolerance varies.",
    lastUpdated: new Date("2024-01-09"),
    isNew: false,
    personalizedRisk: "high", // High risk due to child's dairy allergy
    relatedConditions: ["lactose intolerance", "inflammation"],
  },
  {
    id: "iron-supplement",
    name: "Iron Supplements",
    category: "supplement",
    subcategory: "Minerals",
    status: "caution",
    rationale: "Helpful if deficient, but can cause digestive upset if not needed",
    evidenceLevel: "moderate",
    concerns: ["Digestive upset", "Constipation", "Nausea", "Interactions with other minerals"],
    benefits: ["Treats iron deficiency", "Improves energy", "Reduces fatigue"],
    dosage: "18-25mg daily with Vitamin C",
    timing: "On empty stomach or with Vitamin C",
    interactions: ["Reduces absorption of calcium, zinc", "Coffee and tea reduce absorption"],
    contraindications: ["Hemochromatosis", "Normal iron levels"],
    evidenceDetails:
      "Iron supplementation is beneficial for women with iron deficiency, which is common with heavy periods. However, supplementation without deficiency can cause side effects and interfere with other mineral absorption.",
    lastUpdated: new Date("2024-01-13"),
    isNew: false,
    relatedConditions: ["iron deficiency", "heavy periods"],
  },

  // AVOID ITEMS
  {
    id: "alcohol",
    name: "Alcohol",
    category: "food",
    subcategory: "Beverages",
    status: "avoid",
    rationale: "Worsens mood swings, disrupts sleep, and depletes B-vitamins",
    evidenceLevel: "strong",
    concerns: ["Mood instability", "Sleep disruption", "B-vitamin depletion", "Liver stress", "Dehydration"],
    dosage: "Avoid or limit to 1 drink occasionally",
    timing: "Avoid during luteal phase",
    contraindications: ["Depression", "Anxiety", "Sleep disorders", "Liver disease"],
    evidenceDetails:
      "Research consistently shows alcohol consumption worsens PMS symptoms, particularly mood-related symptoms. Alcohol depletes B-vitamins essential for neurotransmitter production and disrupts sleep quality.",
    lastUpdated: new Date("2024-01-07"),
    isNew: false,
    relatedConditions: ["depression", "anxiety", "sleep disorders"],
  },
  {
    id: "processed-sugar",
    name: "Processed Sugar & Refined Carbs",
    category: "food",
    subcategory: "Carbohydrates",
    status: "avoid",
    rationale: "Causes blood sugar spikes leading to mood swings and increased cravings",
    evidenceLevel: "strong",
    concerns: ["Blood sugar spikes", "Mood swings", "Increased cravings", "Energy crashes", "Inflammation"],
    dosage: "Minimize intake",
    timing: "Avoid especially during PMS week",
    evidenceDetails:
      "Studies show high sugar intake increases PMS symptom severity by up to 40%. Sugar causes rapid blood glucose fluctuations that worsen mood instability and increase cravings for more sugar.",
    lastUpdated: new Date("2024-01-06"),
    isNew: false,
    relatedConditions: ["diabetes", "mood disorders", "cravings"],
  },
  {
    id: "high-sodium",
    name: "High Sodium Foods",
    category: "food",
    subcategory: "Processed Foods",
    status: "avoid",
    rationale: "Increases water retention, bloating, and breast tenderness",
    evidenceLevel: "moderate",
    concerns: ["Water retention", "Bloating", "Breast tenderness", "High blood pressure"],
    dosage: "Limit to <2300mg daily",
    timing: "Especially avoid week before period",
    contraindications: ["High blood pressure", "Heart disease", "Kidney disease"],
    evidenceDetails:
      "High sodium intake exacerbates fluid retention, which is already increased during the luteal phase. Studies show reducing sodium intake by 50% can decrease bloating and breast tenderness by 30%.",
    lastUpdated: new Date("2024-01-05"),
    isNew: false,
    relatedConditions: ["hypertension", "heart disease"],
  },
]

// Auto-complete suggestions
const getSearchSuggestions = (query: string): string[] => {
  if (query.length < 2) return []
  return pmsGuideData
    .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    .map((item) => item.name)
    .slice(0, 5)
}

export function PMSGuideEnhanced() {
  const [activeTab, setActiveTab] = React.useState("recommended")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [selectedConcern, setSelectedConcern] = React.useState("all")
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<PMSGuideItem | null>(null)
  const [bookmarkedItems, setBookmarkedItems] = React.useState<Set<string>>(new Set(mockUserProfile.bookmarkedItems))
  const [shoppingList, setShoppingList] = React.useState<Set<string>>(new Set(mockUserProfile.shoppingList))

  // Auto-complete functionality
  React.useEffect(() => {
    if (searchQuery.length > 1) {
      const newSuggestions = getSearchSuggestions(searchQuery)
      setSuggestions(newSuggestions)
      setShowSuggestions(newSuggestions.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Filter data based on current tab and filters
  const filteredData = React.useMemo(() => {
    let data = pmsGuideData

    // Filter by tab
    if (activeTab === "recommended") {
      data = data.filter((item) => item.status === "safe")
    } else {
      data = data.filter((item) => item.status === "caution" || item.status === "avoid")
    }

    // Apply search filter
    if (searchQuery) {
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.rationale.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subcategory.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      data = data.filter((item) => item.category === selectedCategory)
    }

    // Apply concern filter
    if (selectedConcern !== "all") {
      data = data.filter((item) => item.concerns.some((concern) => concern.toLowerCase().includes(selectedConcern)))
    }

    return data
  }, [activeTab, searchQuery, selectedCategory, selectedConcern])

  const handleBookmark = (itemId: string) => {
    setBookmarkedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
        toast({ title: "Removed from bookmarks", duration: 2000 })
      } else {
        newSet.add(itemId)
        toast({ title: "Added to bookmarks", duration: 2000 })
      }
      return newSet
    })
  }

  const handleAddToShoppingList = (itemId: string) => {
    setShoppingList((prev) => {
      const newSet = new Set(prev)
      if (!newSet.has(itemId)) {
        newSet.add(itemId)
        toast({ title: "Added to shopping list", duration: 2000 })
      } else {
        toast({ title: "Already in shopping list", duration: 2000 })
      }
      return newSet
    })
  }

  const handleAskClinician = (item: PMSGuideItem) => {
    toast({
      title: "Clinician consultation",
      description: `Question about ${item.name} has been prepared for your next appointment.`,
      duration: 3000,
    })
  }

  const handleShare = (item: PMSGuideItem) => {
    toast({
      title: "Sharing prepared",
      description: `Information about ${item.name} is ready to share.`,
      duration: 2000,
    })
  }

  const handlePrint = () => {
    window.print()
    toast({ title: "Print dialog opened", duration: 2000 })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "caution":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "avoid":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      safe: {
        label: "Safe",
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200",
      },
      caution: {
        label: "Caution",
        className: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200",
      },
      avoid: {
        label: "Avoid",
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200",
      },
    }
    const { label, className } = config[status as keyof typeof config]
    return (
      <Badge className={`${className} border font-medium`} aria-label={`${label} for PMS management`}>
        {label}
      </Badge>
    )
  }

  const getEvidenceIcon = (level: string) => {
    switch (level) {
      case "strong":
        return <Star className="h-3 w-3 text-yellow-600 fill-current" />
      case "moderate":
        return <Star className="h-3 w-3 text-yellow-600" />
      case "limited":
        return <Star className="h-3 w-3 text-gray-400" />
      default:
        return null
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedConcern("all")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            PMS Nutrition Guide
          </h1>
          <p className="text-muted-foreground mt-1">Evidence-based recommendations for PMS management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2 touch-manipulation bg-transparent">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" className="gap-2 touch-manipulation bg-transparent">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar with Auto-complete */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search foods, supplements, medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base touch-manipulation"
                aria-label="Search PMS guide items"
                aria-expanded={showSuggestions}
                aria-haspopup="listbox"
              />
              {showSuggestions && (
                <div
                  className="absolute top-full left-0 right-0 z-10 bg-background border rounded-md shadow-lg mt-1"
                  role="listbox"
                  aria-label="Search suggestions"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-muted text-sm touch-manipulation focus:bg-muted focus:outline-none"
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      role="option"
                      aria-selected={false}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 h-10 touch-manipulation">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Foods</SelectItem>
                  <SelectItem value="supplement">Supplements</SelectItem>
                  <SelectItem value="medication">Medications</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedConcern} onValueChange={setSelectedConcern}>
                <SelectTrigger className="w-full sm:w-48 h-10 touch-manipulation">
                  <SelectValue placeholder="Filter by concern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Concerns</SelectItem>
                  <SelectItem value="mood">Mood Issues</SelectItem>
                  <SelectItem value="cramp">Cramping</SelectItem>
                  <SelectItem value="bloating">Bloating</SelectItem>
                  <SelectItem value="sleep">Sleep Problems</SelectItem>
                  <SelectItem value="anxiety">Anxiety</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || selectedCategory !== "all" || selectedConcern !== "all") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2 touch-manipulation bg-transparent"
                  aria-label="Clear all filters"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger
            value="recommended"
            className="touch-manipulation text-sm sm:text-base"
            role="tab"
            aria-controls="recommended-panel"
            id="recommended-tab"
          >
            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            Recommended (Do's)
          </TabsTrigger>
          <TabsTrigger
            value="caution-avoid"
            className="touch-manipulation text-sm sm:text-base"
            role="tab"
            aria-controls="caution-avoid-panel"
            id="caution-avoid-tab"
          >
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
            Caution/Avoid (Don'ts)
          </TabsTrigger>
        </TabsList>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
          <span>
            Showing {filteredData.length} of {pmsGuideData.length} items
          </span>
          <div className="flex items-center gap-4">
            <span>{bookmarkedItems.size} bookmarked</span>
            <span>{shoppingList.size} in shopping list</span>
          </div>
        </div>

        <TabsContent
          value="recommended"
          className="space-y-4 mt-4"
          role="tabpanel"
          id="recommended-panel"
          aria-labelledby="recommended-tab"
        >
          {filteredData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No recommended items found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredData.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 hover:shadow-md transition-shadow ${
                    item.personalizedRisk === "high" ? "border-red-200 bg-red-50/30 dark:bg-red-950/10" : ""
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            {getStatusBadge(item.status)}
                            {item.isNew && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 gap-1">
                                <Sparkles className="h-3 w-3" />
                                New
                              </Badge>
                            )}
                            {item.personalizedRisk === "high" && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Personal Risk
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span>•</span>
                            <span>{item.subcategory}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {getEvidenceIcon(item.evidenceLevel)}
                              <span className="capitalize">{item.evidenceLevel} evidence</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{item.rationale}</p>
                        </div>
                      </div>

                      {/* Bookmark Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(item.id)}
                        className={`touch-manipulation ${bookmarkedItems.has(item.id) ? "text-amber-600" : ""}`}
                        aria-label={`${bookmarkedItems.has(item.id) ? "Remove from" : "Add to"} bookmarks`}
                      >
                        {bookmarkedItems.has(item.id) ? (
                          <BookmarkCheck className="h-4 w-4 fill-current" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                        className="h-auto p-0 text-sm gap-1 touch-manipulation"
                        aria-label={`View evidence for ${item.name}`}
                      >
                        <Info className="h-3 w-3" />
                        Why?
                      </Button>

                      <Separator orientation="vertical" className="h-4" />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToShoppingList(item.id)}
                        className="gap-1 text-xs touch-manipulation bg-transparent"
                        disabled={shoppingList.has(item.id)}
                      >
                        <ShoppingCart className="h-3 w-3" />
                        {shoppingList.has(item.id) ? "In List" : "Add to List"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAskClinician(item)}
                        className="gap-1 text-xs touch-manipulation bg-transparent"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Ask Clinician
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(item)}
                        className="gap-1 text-xs touch-manipulation bg-transparent"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </Button>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Updated {item.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="caution-avoid"
          className="space-y-4 mt-4"
          role="tabpanel"
          id="caution-avoid-panel"
          aria-labelledby="caution-avoid-tab"
        >
          {filteredData.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No caution/avoid items found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredData.map((item) => (
                <Card
                  key={item.id}
                  className={`p-4 hover:shadow-md transition-shadow ${
                    item.status === "avoid"
                      ? "border-red-200 bg-red-50/30 dark:bg-red-950/10"
                      : "border-amber-200 bg-amber-50/30 dark:bg-amber-950/10"
                  } ${item.personalizedRisk === "high" ? "border-red-300" : ""}`}
                >
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            {getStatusBadge(item.status)}
                            {item.isNew && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 gap-1">
                                <Sparkles className="h-3 w-3" />
                                New
                              </Badge>
                            )}
                            {item.personalizedRisk === "high" && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 gap-1">
                                <AlertCircle className="h-3 w-3" />
                                High Risk for You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span>•</span>
                            <span>{item.subcategory}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {getEvidenceIcon(item.evidenceLevel)}
                              <span className="capitalize">{item.evidenceLevel} evidence</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{item.rationale}</p>

                          {/* Concerns List */}
                          {item.concerns.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Concerns:</p>
                              <div className="flex flex-wrap gap-1">
                                {item.concerns.slice(0, 3).map((concern, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs text-red-700 border-red-200 dark:text-red-400 dark:border-red-800"
                                  >
                                    {concern}
                                  </Badge>
                                ))}
                                {item.concerns.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{item.concerns.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bookmark Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(item.id)}
                        className={`touch-manipulation ${bookmarkedItems.has(item.id) ? "text-amber-600" : ""}`}
                        aria-label={`${bookmarkedItems.has(item.id) ? "Remove from" : "Add to"} bookmarks`}
                      >
                        {bookmarkedItems.has(item.id) ? (
                          <BookmarkCheck className="h-4 w-4 fill-current" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                        className="h-auto p-0 text-sm gap-1 touch-manipulation"
                        aria-label={`View evidence for ${item.name}`}
                      >
                        <Info className="h-3 w-3" />
                        Why?
                      </Button>

                      <Separator orientation="vertical" className="h-4" />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAskClinician(item)}
                        className="gap-1 text-xs touch-manipulation bg-transparent"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Ask Clinician
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(item)}
                        className="gap-1 text-xs touch-manipulation bg-transparent"
                      >
                        <Share2 className="h-3 w-3" />
                        Share
                      </Button>
                    </div>

                    {/* Last Updated */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Updated {item.lastUpdated.toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Evidence Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Evidence for {selectedItem.name}
              </DialogTitle>
              <DialogDescription>Scientific evidence and detailed information</DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(selectedItem.status)}
                  <Badge variant="outline" className="capitalize">
                    {selectedItem.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {getEvidenceIcon(selectedItem.evidenceLevel)}
                    <span className="text-sm capitalize">{selectedItem.evidenceLevel} evidence</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Scientific Evidence</h4>
                  <p className="text-sm leading-relaxed">{selectedItem.evidenceDetails}</p>
                </div>

                {selectedItem.benefits && selectedItem.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-green-700 dark:text-green-400">Benefits</h4>
                    <ul className="text-sm space-y-1">
                      {selectedItem.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.concerns.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-700 dark:text-red-400">Concerns</h4>
                    <ul className="text-sm space-y-1">
                      {selectedItem.concerns.map((concern, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-red-600 flex-shrink-0" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.dosage && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-1">Recommended Dosage</h4>
                    <p className="text-sm">{selectedItem.dosage}</p>
                    {selectedItem.timing && (
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Timing:</strong> {selectedItem.timing}
                      </p>
                    )}
                  </div>
                )}

                {selectedItem.interactions && selectedItem.interactions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-amber-700 dark:text-amber-400">Interactions</h4>
                    <ul className="text-sm space-y-1">
                      {selectedItem.interactions.map((interaction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-amber-600 flex-shrink-0 mt-0.5" />
                          {interaction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.contraindications && selectedItem.contraindications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-700 dark:text-red-400">Contraindications</h4>
                    <ul className="text-sm space-y-1">
                      {selectedItem.contraindications.map((contraindication, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
                          {contraindication}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedItem.personalizedRisk && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="font-medium mb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Personalized Risk Alert
                    </h4>
                    <p className="text-sm">
                      This item has been flagged as higher risk for you based on your profile (child's allergies or
                      medications). Please consult with your healthcare provider before use.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
