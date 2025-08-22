import Link from "next/link"
import { ArrowLeft, FileText, AlertTriangle, Shield, Scale } from "lucide-react"

export default function TermsOfServicePage() {
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

        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Scale className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">Legal Terms</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">Last updated: December 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 sm:p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-amber-800 dark:text-amber-200">
                  Important Medical Disclaimer
                </h3>
                <p className="text-sm sm:text-base text-amber-700 dark:text-amber-300">
                  Caregene AI provides informational support and is not a substitute for professional medical advice,
                  diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="space-y-8 sm:space-y-12">
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="font-serif font-bold text-xl sm:text-2xl">Acceptance of Terms</h2>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    By accessing or using Caregene AI's services, you agree to be bound by these Terms of Service and
                    our Privacy Policy. If you do not agree to these terms, please do not use our services.
                  </p>
                  <p>
                    These terms apply to all users, including families, healthcare providers, researchers, and
                    enterprise customers.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Service Description</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>Caregene AI provides:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>AI-powered healthcare guidance and information</li>
                    <li>Genetic health tracking and analysis tools</li>
                    <li>Research platform for medical professionals</li>
                    <li>Care coordination and family support features</li>
                    <li>Educational resources about rare genetic conditions</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">User Responsibilities</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>You agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the service only for lawful purposes</li>
                    <li>Respect the privacy and rights of other users</li>
                    <li>Not attempt to reverse engineer or compromise our systems</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>
              </section>

              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="font-serif font-bold text-xl sm:text-2xl">Medical Information Disclaimer</h2>
                </div>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    <strong>Caregene AI is not a medical device and does not provide medical advice.</strong> Our
                    AI-powered insights are for informational purposes only and should not replace professional medical
                    consultation.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Always consult healthcare professionals for medical decisions</li>
                    <li>Do not delay seeking medical care based on our information</li>
                    <li>In emergencies, contact emergency services immediately</li>
                    <li>Our service is not intended to diagnose, treat, cure, or prevent any disease</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Intellectual Property</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    Caregene AI and its licensors own all rights to the service, including software, algorithms,
                    content, and trademarks. You retain ownership of your personal data and content you upload.
                  </p>
                  <p>
                    By using our service, you grant us a limited license to use your data to provide and improve our
                    services, subject to our Privacy Policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Limitation of Liability</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    To the maximum extent permitted by law, Caregene AI shall not be liable for any indirect,
                    incidental, special, consequential, or punitive damages, including but not limited to loss of
                    profits, data, or use.
                  </p>
                  <p>
                    Our total liability for any claims shall not exceed the amount you paid for our services in the 12
                    months preceding the claim.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Termination</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    Either party may terminate this agreement at any time. Upon termination, your access to the service
                    will cease, and we will delete your personal data according to our Privacy Policy, except as
                    required by law.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Changes to Terms</h2>
                <div className="space-y-4 text-sm sm:text-base">
                  <p>
                    We may update these terms from time to time. We will notify you of material changes via email or
                    through our service. Continued use after changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </section>

              <section className="bg-muted/20 rounded-lg p-4 sm:p-6">
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Contact Information</h2>
                <p className="text-sm sm:text-base mb-4">For questions about these Terms of Service, please contact:</p>
                <div className="text-sm sm:text-base">
                  <p>
                    <strong>Legal Department</strong>
                  </p>
                  <p>Email: legal@caregene.ai</p>
                  <p>Phone: 1-800-CAREGENE</p>
                  <p>Address: 123 Innovation Drive, Boston, MA 02115</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
