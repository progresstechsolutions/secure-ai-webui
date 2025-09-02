export type AgeKey = "2m" | "4m" | "6m" | "9m" | "12m" | "15m" | "18m" | "2y" | "30m" | "3y" | "4y" | "5y"
export type Category = "social" | "language" | "cognitive" | "movement"
export type Child = {
  id: string
  firstName: string
  birthDate: string
  dueDate?: string
  photoUrl?: string
  sex?: "F" | "M" | "X"
}
export type MilestoneItem = {
  id: string
  category: Category
  label: string
  helpText?: string
  media?: {
    type: "image" | "video"
    src: string
    alt: string
  }
  isKeyItem?: boolean
}
export type Checklist = {
  ageKey: AgeKey
  items: MilestoneItem[]
}
export type ChecklistResponse = {
  childId: string
  ageKey: AgeKey
  answers: Record<string, "yes" | "not_yet" | "not_sure">
  notes?: Record<string, string>
  completedAt?: string
}
export type Tip = {
  id: string
  ageKey: AgeKey
  title: string
  body: string
  bookmarked?: boolean
}
export type Appointment = {
  id: string
  childId: string
  type: "well_visit" | "vaccine" | "screening" | "other"
  dateTimeISO: string
  location?: string
  notes?: string
}
export type ReminderPreference = {
  childId: string
  channels: {
    push: boolean
    email?: boolean
  }
  checklistReminders: boolean
  appointmentReminders: boolean
  tipNudges: boolean
}
export type ExportSummary = {
  child: Child
  ageKey: AgeKey
  met: string[]
  notYet: string[]
  notSure: string[]
  notes?: Record<string, string>
  generatedAt: string
}
