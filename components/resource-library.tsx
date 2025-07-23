"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, BookOpen, Video, Link, Filter } from "lucide-react"

interface ResourceLibraryProps {
  onBack: () => void
}

const mockResources = [
  {
    id: "res1",
    title: "Understanding Phelan-McDermid Syndrome: A Parent's Guide",
    type: "article",
    category: "PMS",
    url: "#",
    tags: ["PMS", "diagnosis", "parenting", "guide"],
  },
  {
    id: "res2",
    title: "Rett Syndrome: Communication Strategies for Non-Verbal Individuals",
    type: "video",
    category: "Rett Syndrome",
    url: "#",
    tags: ["Rett Syndrome", "communication", "therapy"],
  },
  {
    id: "res3",
    title: "Latest Research on Fragile X Syndrome Treatments",
    type: "article",
    category: "Fragile X Syndrome",
    url: "#",
    tags: ["Fragile X", "research", "treatment"],
  },
  {
    id: "res4",
    title: "Angelman Syndrome: Managing Sleep Disturbances",
    type: "guide",
    category: "Angelman Syndrome",
    url: "#",
    tags: ["Angelman Syndrome", "sleep", "parenting"],
  },
  {
    id: "res5",
    title: "Prader-Willi Syndrome: Nutritional Guidelines and Meal Planning",
    type: "article",
    category: "Prader-Willi Syndrome",
    url: "#",
    tags: ["Prader-Willi", "nutrition", "diet"],
  },
  {
    id: "res6",
    title: "Spinal Muscular Atrophy (SMA): Treatment Options Explained",
    type: "video",
    category: "SMA",
    url: "#",
    tags: ["SMA", "treatment", "gene therapy"],
  },
  {
    id: "res7",
    title: "Batten Disease: Understanding the Different Types",
    type: "article",
    category: "Batten Disease",
    url: "#",
    tags: ["Batten Disease", "types", "overview"],
  },
  {
    id: "res8",
    title: "Tay-Sachs Disease: Genetic Testing and Family Planning",
    type: "guide",
    category: "Tay-Sachs Disease",
    url: "#",
    tags: ["Tay-Sachs", "genetic testing", "family planning"],
  },
  {
    id: "res9",
    title: "Gaucher Disease: Living with Enzyme Replacement Therapy",
    type: "article",
    category: "Gaucher Disease",
    url: "#",
    tags: ["Gaucher Disease", "treatment", "ERT"],
  },
  {
    id: "res10",
    title: "Maple Syrup Urine Disease (MSUD): Emergency Protocol",
    type: "guide",
    category: "MSUD",
    url: "#",
    tags: ["MSUD", "emergency", "protocol"],
  },
  {
    id: "res11",
    title: "Phenylketonuria (PKU): Low-Protein Recipes Collection",
    type: "article",
    category: "PKU",
    url: "#",
    tags: ["PKU", "diet", "recipes"],
  },
  {
    id: "res12",
    title: "Advocacy for Rare Genetic Conditions: A Comprehensive Toolkit",
    type: "guide",
    category: "General Genetic Conditions",
    url: "#",
    tags: ["advocacy", "rare disease", "toolkit"],
  },
  {
    id: "res13",
    title: "Coping with a Rare Disease Diagnosis: Emotional Support",
    type: "video",
    category: "General Genetic Conditions",
    url: "#",
    tags: ["emotional support", "diagnosis", "coping"],
  },
]

export function ResourceLibrary({ onBack }: ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const filteredResources = mockResources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === "all" || resource.type === filterType
    const matchesCategory = filterCategory === "all" || resource.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const uniqueCategories = Array.from(new Set(mockResources.map((res) => res.category)))

  const getIconForType = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="h-5 w-5 text-gray-500" />
      case "video":
        return <Video className="h-5 w-5 text-gray-500" />
      case "guide":
        return <Link className="h-5 w-5 text-gray-500" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold gradient-text">Resource Library</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <Card className="shadow-md rounded-lg">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="filter-type" className="text-sm">
                  Resource Type
                </Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-category" className="text-sm">
                  Category (Condition)
                </Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger id="filter-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource List */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" /> All Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredResources.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No resources found matching your criteria.</p>
            ) : (
              filteredResources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getIconForType(resource.type)}
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {resource.category} • {resource.type}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resource.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </a>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
