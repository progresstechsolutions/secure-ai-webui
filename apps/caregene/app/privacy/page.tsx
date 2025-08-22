import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
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
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-primary">HIPAA Compliant</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Last updated: December 2024</p>
        </div>

        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">Your Privacy is Our Priority</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Caregene AI is committed to protecting your personal health information (PHI) and maintaining the
                  highest standards of data security and privacy compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl">Information We Collect</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal Information:</strong> Name, email address, phone number, and account credentials
                  </li>
                  <li>
                    <strong>Health Information:</strong> Medical history, symptoms, genetic data, and health records you
                    choose to share
                  </li>
                  <li>
                    <strong>Usage Data:</strong> How you interact with our platform, search queries, and feature usage
                  </li>
                  <li>
                    <strong>Device Information:</strong> IP address, browser type, operating system, and device
                    identifiers
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl">How We Protect Your Data</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                <p>We implement industry-leading security measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Encryption:</strong> All data is encrypted in transit and at rest using AES-256 encryption
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Strict role-based access controls and multi-factor authentication
                  </li>
                  <li>
                    <strong>HIPAA Compliance:</strong> Full compliance with HIPAA privacy and security rules
                  </li>
                  <li>
                    <strong>Regular Audits:</strong> Third-party security audits and penetration testing
                  </li>
                  <li>
                    <strong>Data Minimization:</strong> We only collect and retain data necessary for our services
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl">How We Use Your Information</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide personalized healthcare guidance and AI-powered insights</li>
                  <li>Improve our services and develop new features</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations and regulatory requirements</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl">Information Sharing</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                <p>
                  We do not sell your personal information. We may share information only in these limited
                  circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly authorize us to share your information
                  </li>
                  <li>
                    <strong>Healthcare Providers:</strong> With your designated healthcare team when authorized
                  </li>
                  <li>
                    <strong>Research Partners:</strong> Anonymized, aggregated data for medical research (opt-in only)
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Trusted third parties who help us operate our platform
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect rights and safety
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="font-serif font-bold text-xl sm:text-2xl">Your Rights</h2>
              </div>
              <div className="space-y-4 text-sm sm:text-base">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal information
                  </li>
                  <li>
                    <strong>Correct:</strong> Update or correct inaccurate information
                  </li>
                  <li>
                    <strong>Delete:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Port:</strong> Export your data in a machine-readable format
                  </li>
                  <li>
                    <strong>Restrict:</strong> Limit how we process your information
                  </li>
                  <li>
                    <strong>Object:</strong> Opt out of certain data processing activities
                  </li>
                </ul>
                <p>
                  To exercise these rights, contact us at <strong>privacy@caregene.ai</strong>
                </p>
              </div>
            </section>

            <section className="bg-muted/20 rounded-lg p-4 sm:p-6">
              <h2 className="font-serif font-bold text-xl sm:text-2xl mb-4">Contact Us</h2>
              <p className="text-sm sm:text-base mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact:
              </p>
              <div className="text-sm sm:text-base">
                <p>
                  <strong>Privacy Officer</strong>
                </p>
                <p>Email: privacy@caregene.ai</p>
                <p>Phone: 1-800-CAREGENE</p>
                <p>Address: 123 Innovation Drive, Boston, MA 02115</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
