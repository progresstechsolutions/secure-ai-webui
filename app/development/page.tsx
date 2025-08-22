import { Navigation } from "@/components/navigation"
import { Zap, Target, Calendar, TrendingUp, Baby, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DevelopmentPage() {
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
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Development Milestones</h1>
                <p className="text-lg text-muted-foreground">Track your child's growth with AI-powered insights</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Milestone Tracking</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Monitor developmental milestones with personalized timelines for your child's condition
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Motor skill development</li>
                <li>• Speech and language</li>
                <li>• Cognitive milestones</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Growth Charts</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Specialized growth charts adapted for rare genetic conditions and syndromes
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Height and weight tracking</li>
                <li>• Head circumference</li>
                <li>• Condition-specific metrics</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Progress Reports</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Generate comprehensive reports for healthcare providers and therapy teams
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Therapy progress tracking</li>
                <li>• Medical appointment prep</li>
                <li>• Educational planning</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Baby className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Early Intervention</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                AI-powered alerts for potential developmental delays or concerns
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Early warning system</li>
                <li>• Intervention recommendations</li>
                <li>• Resource connections</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Family Support</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Connect with other families and access condition-specific resources
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Parent community</li>
                <li>• Expert guidance</li>
                <li>• Educational materials</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">AI Insights</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Personalized recommendations based on your child's unique development pattern
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Predictive analytics</li>
                <li>• Personalized goals</li>
                <li>• Activity suggestions</li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Support your child's development journey</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join families worldwide who trust Caregene to track and support their child's unique developmental path
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signin">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
