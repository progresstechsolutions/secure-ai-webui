// Utility functions for milestone feature

export interface Child {
  id: string
  name: string
  nickname: string
  dateOfBirth: string
  age: string
  avatar?: string
  notes?: string
}

export interface MilestoneCategory {
  id: string
  name: string
  description: string
  completed: number
  total: number
}

// Mock data - in real app this would come from API/database
export const mockChildren: Child[] = [
  {
    id: "1",
    name: "Emma Johnson",
    nickname: "Emma",
    dateOfBirth: "2022-06-15",
    age: "18 months",
    avatar: "/images/child-avatar-1.jpg",
    notes: "Very active, loves to explore. Started walking early.",
  },
  {
    id: "2",
    name: "Liam Smith",
    nickname: "Liam",
    dateOfBirth: "2021-03-22",
    age: "3 years",
    avatar: "/images/child-avatar-2.jpg",
    notes: "Curious about everything, loves books and puzzles.",
  },
]

// Age range mappings
export const ageRanges = [
  { value: "0-6m", label: "0-6 months", months: [0, 6] },
  { value: "6-12m", label: "6-12 months", months: [6, 12] },
  { value: "12-18m", label: "12-18 months", months: [12, 18] },
  { value: "18-24m", label: "18-24 months", months: [18, 24] },
  { value: "2-3y", label: "2-3 years", months: [24, 36] },
  { value: "3-4y", label: "3-4 years", months: [36, 48] },
  { value: "4-5y", label: "4-5 years", months: [48, 60] },
]

// Calculate age in months from date of birth
export const calculateAgeInMonths = (dateOfBirth: string): number => {
  const birth = new Date(dateOfBirth)
  const now = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
}

// Format age display
export const formatAge = (months: number, format: "months" | "years" | "decimal" = "months"): string => {
  switch (format) {
    case "months":
      return `${months} months`
    case "years":
      if (months < 12) {
        return `${months} months`
      } else if (months < 24) {
        const remainingMonths = months % 12
        return remainingMonths > 0 ? `1 year ${remainingMonths} months` : "1 year"
      } else {
        const years = Math.floor(months / 12)
        const remainingMonths = months % 12
        return remainingMonths > 0 ? `${years} years ${remainingMonths} months` : `${years} years`
      }
    case "decimal":
      return `${(months / 12).toFixed(1)} years`
    default:
      return `${months} months`
  }
}

// Get appropriate age range for a child
export const getAgeRangeForChild = (childId: string): string => {
  const child = mockChildren.find((c) => c.id === childId)
  if (!child) return "current"

  const ageInMonths = calculateAgeInMonths(child.dateOfBirth)

  for (const range of ageRanges) {
    if (ageInMonths >= range.months[0] && ageInMonths < range.months[1]) {
      return range.value
    }
  }

  // If older than our ranges, return the last one
  return ageRanges[ageRanges.length - 1].value
}

// Get child by ID
export const getChildById = (childId: string): Child | undefined => {
  return mockChildren.find((child) => child.id === childId)
}

// Get child name by ID
export const getChildName = (childId: string): string => {
  const child = getChildById(childId)
  return child?.nickname || "Child"
}

// Check if child exists
export const childExists = (childId: string): boolean => {
  return mockChildren.some((child) => child.id === childId)
}

// Generate breadcrumb items for milestone pages
export const generateMilestoneBreadcrumbs = (childId?: string, ageKey?: string, currentPage?: string) => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Milestone", href: "/milestone" },
  ]

  if (childId) {
    const childName = getChildName(childId)
    breadcrumbs.push({ label: childName, href: `/milestone/summary/${childId}` })
  }

  if (ageKey && ageKey !== "current") {
    const ageRange = ageRanges.find((range) => range.value === ageKey)
    if (ageRange) {
      breadcrumbs.push({ label: ageRange.label, href: "#" })
    }
  }

  if (currentPage) {
    breadcrumbs.push({ label: currentPage, href: "#" })
  }

  return breadcrumbs
}

// Validate milestone route parameters
export const validateMilestoneRoute = (childId?: string, ageKey?: string) => {
  const errors: string[] = []

  if (childId && !childExists(childId)) {
    errors.push("Child not found")
  }

  if (ageKey && ageKey !== "current" && !ageRanges.some((range) => range.value === ageKey)) {
    errors.push("Invalid age range")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
