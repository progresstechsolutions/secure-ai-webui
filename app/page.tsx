<<<<<<< HEAD
"use client"
import { AuthProvider } from "@/contexts/auth-context"
import { ChildProfileProvider } from "@/contexts/child-profile-context"
import { DocumentProvider } from "@/contexts/document-context"
import HealthBinderApp from "@/components/HealthBinderApp"
import type { Child } from "@/contexts/child-profile-context"

const sampleChildren: Child[] = [
  {
    id: "child-1",
    name: "Emma Johnson",
    age: 8,
    dateOfBirth: "2016-03-15",
    gender: "female",
    avatar: "/placeholder.svg?height=40&width=40",
    allergies: ["Peanuts", "Shellfish"],
    conditions: ["Asthma"],
    medications: ["Inhaler"],
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      relationship: "Mother",
    },
    stats: {
      totalDocuments: 12,
    },
  },
  {
    id: "child-2",
    name: "Liam Johnson",
    age: 5,
    dateOfBirth: "2019-07-22",
    gender: "male",
    avatar: "/placeholder.svg?height=40&width=40",
    allergies: [],
    conditions: [],
    medications: [],
    stats: {
      totalDocuments: 8,
    },
  },
]

export default function HomePage() {
  return (
    <AuthProvider>
      <ChildProfileProvider>
        <DocumentProvider>
          <HealthBinderApp />
        </DocumentProvider>
      </ChildProfileProvider>
    </AuthProvider>
  )
=======
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()
  
  if (session) {
    // Check if user completed onboarding
    // In a real app, this would be stored in the database
    // For demo, check localStorage in client-side
    redirect("/dashboard")
  }
  
  // Show landing page for unauthenticated users
  redirect("/auth/signin")
>>>>>>> origin/Bishwas
}
