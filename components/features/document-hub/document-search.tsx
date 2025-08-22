"use client"

import { Input } from "../../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Label } from "../../ui/label"
import { Search, Filter } from "lucide-react"

interface DocumentSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function DocumentSearch({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: DocumentSearchProps) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Documents</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name, tags, or content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vaccination">Vaccination Records</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="lab-result">Lab Results</SelectItem>
              <SelectItem value="visit-summary">Visit Summaries</SelectItem>
              <SelectItem value="insurance">Insurance Documents</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          Searching for: <span className="font-medium">"{searchQuery}"</span>
        </div>
      )}
    </div>
  )
}
