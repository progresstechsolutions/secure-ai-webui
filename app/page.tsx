
import { redirect } from "next/navigation"

export default async function HomePage() {

    // Check if user completed onboarding
    // In a real app, this would be stored in the database
    // For demo, check localStorage in client-side
    redirect("/dashboard")
  }

