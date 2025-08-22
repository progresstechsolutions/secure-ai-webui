import { BookOpen, Calendar, TrendingUp, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"

export default function HealthJournalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      <main className="ml-12 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              ← Back to home
            </Link>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">AI Health Journal</h1>
                <p className="text-lg text-muted-foreground">
                  Track your family's health journey with intelligent insights
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Daily Tracking</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Log symptoms, medications, and daily observations with AI-powered pattern recognition
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Symptom severity tracking</li>
                <li>• Medication adherence</li>
                <li>• Mood and energy levels</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Progress Analytics</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Visualize health trends and receive insights about your condition management
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Interactive health charts</li>
                <li>• Pattern identification</li>
                <li>• Progress reports</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Family Sharing</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Share health updates with family members and healthcare providers securely
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HIPAA-compliant sharing</li>
                <li>• Care team access</li>
                <li>• Emergency contacts</li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Ready to start your health journey?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of families using Caregene's AI Health Journal to better understand and manage rare genetic
              conditions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signin">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
