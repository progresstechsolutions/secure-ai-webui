"use client"

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
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Documents
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search by name, tags, or content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">All Categories</option>
          <option value="vaccination">Vaccination Records</option>
          <option value="prescription">Prescriptions</option>
          <option value="lab-result">Lab Results</option>
          <option value="visit-summary">Visit Summaries</option>
          <option value="insurance">Insurance Documents</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-gray-500">
          Searching for: <span className="font-medium">"{searchQuery}"</span>
        </div>
      )}
    </div>
  )
}
