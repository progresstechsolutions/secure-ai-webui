"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Bookmark, Share2, Printer, Info, Star, CheckCircle, AlertCircle, XCircle } from "lucide-react"

// Sample data for PMS nutrition guide
const nutritionItems = [
  {
    id: 1,
    name: "Magnesium",
    type: "supplement",
    category: "Minerals",
    status: "recommended",
    description: "Helps reduce cramping and mood swings",
    dosage: "200-400mg daily",
    timing: "Evening with food",
    evidence: "Strong clinical evidence for PMS symptom relief",
    bookmarked: true,
  },
  {
    id: 2,
    name: "Dark Chocolate",
    type: "food",
    category: "Antioxidants",
    status: "beneficial",
    description: "Rich in magnesium and mood-boosting compounds",
    dosage: "1-2 squares (70%+ cacao)",
    timing: "When craving sweets",
    evidence: "Moderate evidence for mood improvement",
    bookmarked: false,
  },
  {
    id: 3,
    name: "Calcium",
    type: "supplement",
    category: "Minerals",
    status: "recommended",
    description: "May reduce physical and emotional PMS symptoms",
    dosage: "1000-1200mg daily",
    timing: "Split doses with meals",
    evidence: "Good clinical evidence",
    bookmarked: true,
  },
  {
    id: 4,
    name: "Leafy Greens",
    type: "food",
    category: "Vegetables",
    status: "beneficial",
    description: "High in folate, magnesium, and iron",
    dosage: "2-3 cups daily",
    timing: "Throughout the day",
    evidence: "Observational studies support benefits",
    bookmarked: false,
  },
  {
    id: 5,
    name: "Ibuprofen",
    type: "medication",
    category: "NSAIDs",
    status: "caution",
    description: "Effective for cramping but use sparingly",
    dosage: "200-400mg as needed",
    timing: "With food to prevent stomach upset",
    evidence: "Proven effective but has side effects",
    bookmarked: false,
  },
  {
    id: 6,
    name: "Omega-3 Fatty Acids",
    type: "supplement",
    category: "Essential Fats",
    status: "recommended",
    description: "Anti-inflammatory properties may reduce cramping",
    dosage: "1000-2000mg EPA/DHA daily",
    timing: "With meals",
    evidence: "Moderate evidence for pain reduction",
    bookmarked: true,
  },
]

export function PMSNutritionGuide() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")
  const [bookmarkedItems, setBookmarkedItems] = React.useState<number[]>(
    nutritionItems.filter((item) => item.bookmarked).map((item) => item.id),
  )

  const filteredItems = nutritionItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const toggleBookmark = (itemId: number) => {
    setBookmarkedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "recommended":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "beneficial":
        return <Star className="h-4 w-4 text-blue-600" />
      case "caution":
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      case "avoid":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "beneficial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "caution":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      case "avoid":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌸</span>
              PMS Nutrition Guide
            </CardTitle>
            <CardDescription>Evidence-based foods, supplements, and medications for PMS management</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Bookmark className="h-4 w-4" />
              Bookmarks
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search foods, supplements, medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search nutrition items"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="food">Foods</SelectItem>
                <SelectItem value="supplement">Supplements</SelectItem>
                <SelectItem value="medication">Medications</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="beneficial">Beneficial</SelectItem>
                <SelectItem value="caution">Use with Caution</SelectItem>
                <SelectItem value="avoid">Avoid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filteredItems.length} of {nutritionItems.length} items
          </span>
          <span>{bookmarkedItems.length} bookmarked</span>
        </div>

        {/* Items List */}
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>{item.status}</Badge>
                          <span className="text-sm text-muted-foreground">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(item.id)}
                      className={bookmarkedItems.includes(item.id) ? "text-amber-600" : ""}
                      aria-label={`${bookmarkedItems.includes(item.id) ? "Remove from" : "Add to"} bookmarks`}
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarkedItems.includes(item.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <p className="text-muted-foreground">{item.description}</p>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                    <div>
                      <span className="font-medium">Dosage:</span>
                      <p className="text-muted-foreground">{item.dosage}</p>
                    </div>
                    <div>
                      <span className="font-medium">Timing:</span>
                      <p className="text-muted-foreground">{item.timing}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Button variant="link" className="h-auto p-0 text-sm" asChild>
                        <span className="flex items-center gap-1 cursor-pointer">
                          <Info className="h-3 w-3" />
                          Why?
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Evidence:</span> {item.evidence}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items found matching your search criteria.</p>
            <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
