import { Navigation } from "@/components/navigation"
import { ArrowLeft, Heart, Shield, Microscope, Users } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Main content with responsive margins for navigation */}
      <main className="ml-12 lg:ml-12 transition-all duration-300">
        {/* Header with back navigation */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6">About Caregene</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Empowering families and healthcare professionals with AI-driven insights for rare genetic conditions and
              personalized healthcare guidance.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="mb-12 lg:mb-16">
            <div className="bg-primary/5 rounded-2xl p-6 sm:p-8 lg:p-10 border border-primary/10">
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 lg:mb-6">Our Mission</h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                At Caregene, we believe every family deserves access to comprehensive, understandable information about
                rare genetic conditions. Our AI-powered platform bridges the gap between complex medical research and
                practical, actionable guidance for patients, caregivers, and healthcare professionals.
              </p>
            </div>
          </div>

          {/* Our Story */}
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-6 lg:mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4 sm:mb-6">
                Caregene was founded by a team of geneticists, AI researchers, and healthcare advocates who witnessed
                firsthand the challenges families face when navigating rare genetic conditions. Too often, families
                spend months or years searching for answers, struggling to understand complex medical terminology, and
                feeling isolated in their journey.
              </p>
              <p className="mb-4 sm:mb-6">
                Our founders recognized that while medical knowledge about rare diseases was advancing rapidly, this
                information wasn't reaching the people who needed it most in an accessible, actionable format. This gap
                inspired the creation of Caregene's specialized AI platform.
              </p>
              <p>
                Today, Caregene serves thousands of families worldwide, providing personalized guidance, connecting
                communities, and empowering informed healthcare decisions through cutting-edge AI technology and
                compassionate human expertise.
              </p>
            </div>
          </div>

          {/* Value Pillars */}
          <div className="mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8 lg:mb-12 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Trust & Privacy */}
              <div className="bg-card rounded-xl p-6 lg:p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Trust & Privacy</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your health information is sacred. We maintain the highest standards of data security and privacy,
                  ensuring your personal health journey remains confidential and protected.
                </p>
              </div>

              {/* Scientific Excellence */}
              <div className="bg-card rounded-xl p-6 lg:p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Microscope className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Scientific Excellence</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI is trained on the latest peer-reviewed research and clinical guidelines, ensuring you receive
                  accurate, evidence-based information about genetic conditions and treatment options.
                </p>
              </div>

              {/* Compassionate Care */}
              <div className="bg-card rounded-xl p-6 lg:p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Compassionate Care</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Behind every query is a human story. We approach each interaction with empathy, understanding the
                  emotional weight of genetic health concerns and providing support with warmth and dignity.
                </p>
              </div>

              {/* Community Connection */}
              <div className="bg-card rounded-xl p-6 lg:p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Community Connection</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  No one should face genetic health challenges alone. We foster connections between families, healthcare
                  providers, and researchers to build supportive communities around shared experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12 border border-primary/20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 lg:mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto">
              Join thousands of families who trust Caregene for personalized genetic health guidance. Start your journey
              with our AI assistant today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Try Caregene AI
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
