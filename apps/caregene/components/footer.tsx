import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, FileText, Brain, Activity, Microscope } from "lucide-react"

export function Footer() {
  const parentFeatures = [
    {
      icon: FileText,
      title: "Smart Health Records",
      description: "Organize medical records and get AI-powered insights for your family's health journey.",
      href: "/health-records",
    },
    {
      icon: Activity,
      title: "Symptom Analysis",
      description: "Track symptoms and get instant, trusted medical guidance powered by AI.",
      href: "/symptom-tracker",
    },
  ]

  const enterpriseFeatures = [
    {
      icon: Microscope,
      title: "Accelerated Research",
      description: "Speed up clinical research with AI-powered data analysis and pattern recognition.",
      href: "/research-platform",
    },
    {
      icon: Brain,
      title: "Regulatory Compliance",
      description: "Streamline FDA submissions with AI-assisted documentation and compliance tools.",
      href: "/fda-acceleration",
    },
  ]

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
              <Heart className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">For Families</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Care made simple</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {parentFeatures.map((feature, index) => (
              <Card key={index} className="border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={feature.href}>Learn more</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">For Enterprise</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Accelerate breakthroughs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {enterpriseFeatures.map((feature, index) => (
              <Card key={index} className="border hover:border-primary/50 transition-colors group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={feature.href}>Learn more</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mb-16 py-12 bg-muted/20 rounded-2xl">
          <h3 className="font-serif font-bold text-2xl text-foreground mb-4">Ready to get started?</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of families and researchers using Caregene AI to improve healthcare outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 rounded-xl" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 rounded-xl bg-transparent" asChild>
              <Link href="/contact">Enterprise Demo</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">Caregene AI</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              Empowering families with AI-driven healthcare insights while advancing medical research for everyone.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>FDA Recognized</span>
              </div>
            </div>
          </div>

          {/* Parent Resources */}
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-4">Parent Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/document-hub" className="text-muted-foreground hover:text-primary transition-colors">
                  Document Hub
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-muted-foreground hover:text-primary transition-colors">
                  Health Tracker
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Hub
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Daily Journal
                </Link>
              </li>
              <li>
                <Link href="/milestones" className="text-muted-foreground hover:text-primary transition-colors">
                  Growth & Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Resources */}
          <div>
            <h3 className="font-serif font-semibold text-foreground mb-4">Research Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/research" className="text-muted-foreground hover:text-primary transition-colors">
                  Research Platform
                </Link>
              </li>
              <li>
                <Link href="/fda-acceleration" className="text-muted-foreground hover:text-primary transition-colors">
                  FDA Acceleration
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="text-muted-foreground hover:text-primary transition-colors">
                  Enterprise Solutions
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/support" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Support
            </Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">© 2024 Caregene AI. All rights reserved.</div>
        </div>

        {/* HIPAA/PHI Disclaimer */}
        <div className="mt-8 p-4 bg-muted/20 rounded-lg border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Privacy & Security:</strong> Caregene AI is HIPAA compliant and follows strict data protection
            protocols. All personal health information (PHI) is encrypted and stored securely. We never share individual
            health data without explicit consent. For research purposes, only anonymized, aggregated data is used to
            advance medical knowledge.
          </p>
        </div>
      </div>
    </footer>
  )
}
