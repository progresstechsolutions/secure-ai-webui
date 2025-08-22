import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dna, TrendingUp, Calendar, FileText } from "lucide-react"
import Link from "next/link"

export default function GeneticTrackerPage() {
  return (
    <div className="min-h-screen bg-background">
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
                <Dna className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Genetic Health Tracker</h1>
                <p className="text-lg text-muted-foreground">
                  Monitor and track genetic health patterns for your family
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <TrendingUp className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Health Trends</CardTitle>
                <CardDescription>Track genetic health patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor symptoms, treatments, and health outcomes to identify patterns and trends in genetic
                  conditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Milestone Tracking</CardTitle>
                <CardDescription>Record important health milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Document key health events, test results, and treatment milestones for comprehensive care tracking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Health Reports</CardTitle>
                <CardDescription>Generate detailed health summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create comprehensive reports to share with healthcare providers and track progress over time.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Start Tracking Your Genetic Health</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Take control of your family's genetic health journey with our comprehensive tracking tools and AI-powered
              insights.
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
