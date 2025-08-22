import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Heart,
  Building2,
  BookOpen,
  Users,
  Shield,
  AlertTriangle,
} from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm sm:text-base">Back to home</span>
        </Link>

        <div className="text-center mb-12 sm:mb-16">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6">
            Support Center
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get the help you need with our comprehensive support resources and dedicated assistance team.
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-2">Medical Emergency</h3>
              <p className="text-red-700 text-xs sm:text-sm">
                For urgent medical questions or emergencies, please contact your healthcare provider immediately or call
                emergency services (911). Caregene AI provides informational support and is not a substitute for
                professional medical advice.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Family Support */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-lg sm:text-xl flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Family Support</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Dedicated assistance for families navigating genetic health journeys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">families@caregene.ai</p>
                    <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">1-800-CAREGENE</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 8AM-8PM EST</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Live Chat</p>
                    <p className="text-xs text-muted-foreground">24/7 availability</p>
                  </div>
                </div>
              </div>
              <Button className="w-full text-sm" asChild>
                <Link href="/contact">Contact Family Support</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Technical Support */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-lg sm:text-xl flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <span>Technical Support</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Help with platform features, account issues, and technical questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">support@caregene.ai</p>
                    <p className="text-xs text-muted-foreground">Response within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Business Hours</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Help Documentation</p>
                    <p className="text-xs text-muted-foreground">Self-service guides</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full text-sm bg-transparent">
                View Help Docs
              </Button>
            </CardContent>
          </Card>

          {/* Community Support */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-serif text-lg sm:text-xl flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Community Support</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Connect with other families and share experiences in our community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Join our supportive community of families navigating similar journeys
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">• Share experiences and tips</p>
                    <p className="text-xs text-muted-foreground">• Ask questions to the community</p>
                    <p className="text-xs text-muted-foreground">• Access expert-moderated discussions</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full text-sm bg-transparent" asChild>
                <Link href="/care-community">Join Community</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">How do I get started with Caregene AI?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simply sign up for a free account and begin by asking questions about genetic conditions, symptoms, or
                  care guidance. Our AI will provide personalized responses based on your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Is my health information secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, we are HIPAA compliant and use enterprise-grade security measures to protect your health
                  information. All data is encrypted and stored securely.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Can Caregene AI replace my doctor?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No, Caregene AI is designed to complement, not replace, professional medical care. Always consult with
                  your healthcare provider for medical decisions and treatment plans.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">What types of genetic conditions do you cover?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI specializes in rare genetic conditions and provides guidance on symptoms, care coordination,
                  daily support, and emergency preparedness for a wide range of genetic disorders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-muted/20 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
            <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-serif font-semibold text-lg sm:text-xl mb-2">Still need help?</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Our support team is here to assist you with any questions or concerns you may have.
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
