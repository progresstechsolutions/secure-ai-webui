import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Stethoscope, Users, BarChart3, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function BusinessPage() {
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
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">For Healthcare</h1>
                <p className="text-lg text-muted-foreground">Enterprise solutions for healthcare organizations</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Stethoscope className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Clinical Integration</CardTitle>
                <CardDescription>Seamless EHR integration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Integrate Caregene AI directly into your existing clinical workflows and electronic health records.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Population Health</CardTitle>
                <CardDescription>Genetic health analytics at scale</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze genetic health trends across patient populations to improve care outcomes and resource
                  allocation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Enterprise Security</CardTitle>
                <CardDescription>HIPAA-compliant infrastructure</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bank-level security with full HIPAA compliance, SOC 2 certification, and enterprise-grade data
                  protection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Team Collaboration</CardTitle>
                <CardDescription>Multi-disciplinary care teams</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enable seamless collaboration between genetic counselors, physicians, and care coordinators.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
                <CardDescription>Clinical decision support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Leverage AI to provide clinical decision support and identify patients who may benefit from genetic
                  testing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-6 w-6 text-primary mb-2" />
                <CardTitle className="text-lg">Custom Reporting</CardTitle>
                <CardDescription>Tailored analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate custom reports and analytics tailored to your organization's specific needs and metrics.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Transform Your Healthcare Organization</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join leading healthcare organizations using Caregene AI to improve genetic health outcomes and streamline
              care delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Request Demo</Link>
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
