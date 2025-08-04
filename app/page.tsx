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
}
