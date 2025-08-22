import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Check, Star, Shield, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function SubscriptionsPage() {
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
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Care Plans</h1>
                <p className="text-lg text-muted-foreground">Choose the perfect plan for your genetic health journey</p>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Care</CardTitle>
                <CardDescription>Essential genetic health tracking</CardDescription>
                <div className="text-2xl font-bold">Free</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Basic symptom logging</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Health trend tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Community access</span>
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                  <Link href="/signin">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">Pro Care</CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </div>
                <CardDescription>Advanced AI-powered insights</CardDescription>
                <div className="text-2xl font-bold">
                  $29<span className="text-sm font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Basic</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">AI pattern analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Personalized recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/signin">Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Care</CardTitle>
                <CardDescription>Complete family health management</CardDescription>
                <div className="text-2xl font-bold">
                  $79<span className="text-sm font-normal">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Up to 6 family members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Family health insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Genetic counselor access</span>
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
                  <Link href="/signin">Choose Family</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm">10,000+ Families</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm">AI-Powered</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of families who trust Caregene AI to help manage their genetic health journey with
              confidence and security.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
