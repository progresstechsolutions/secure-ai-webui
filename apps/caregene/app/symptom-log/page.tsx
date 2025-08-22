import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, BarChart3, Bell } from "lucide-react"
import Link from "next/link"

export default function SymptomLogPage() {
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
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Symptom Logger</h1>
                <p className="text-lg text-muted-foreground">Track symptoms and identify patterns with AI assistance</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Clock className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Real-time Logging</CardTitle>
                <CardDescription>Log symptoms as they occur</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Quickly record symptoms with timestamps, severity levels, and contextual information for accurate
                  tracking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Pattern Analysis</CardTitle>
                <CardDescription>AI-powered pattern recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your symptom data to identify patterns, triggers, and correlations you might miss.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Smart Reminders</CardTitle>
                <CardDescription>Never miss important logging</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Customizable reminders help you maintain consistent logging habits for better health insights.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Start Logging Your Symptoms Today</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Gain valuable insights into your health patterns with our intelligent symptom tracking system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signin">Begin Tracking</Link>
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
