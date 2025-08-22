import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageCircle, Shield, UserCheck } from "lucide-react"
import Link from "next/link"

export default function CareCommunityPage() {
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
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Care Community</h1>
                <p className="text-lg text-muted-foreground">
                  Connect with families facing similar genetic health journeys
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <MessageCircle className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Support Groups</CardTitle>
                <CardDescription>Connect with others who understand</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join condition-specific support groups to share experiences, ask questions, and find emotional
                  support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <UserCheck className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Expert Guidance</CardTitle>
                <CardDescription>Access to healthcare professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get guidance from genetic counselors, specialists, and healthcare professionals in our community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Safe Space</CardTitle>
                <CardDescription>Privacy-first community platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share your journey in a secure, HIPAA-compliant environment designed for sensitive health discussions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Join Our Caring Community</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              You're not alone in your genetic health journey. Connect with others who understand and support each
              other.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signin">Join Community</Link>
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
