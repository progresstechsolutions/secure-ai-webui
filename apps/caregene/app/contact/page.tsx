import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, MapPin, Clock, MessageSquare, Building2, Heart, Shield } from "lucide-react"

export default function ContactPage() {
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
            Get in touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're here to help families navigate their healthcare journey and support researchers in advancing genetic
            medicine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="font-serif text-xl sm:text-2xl">Send us a message</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First name
                  </Label>
                  <Input id="firstName" placeholder="Enter your first name" className="h-10 sm:h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last name
                  </Label>
                  <Input id="lastName" placeholder="Enter your last name" className="h-10 sm:h-11" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input id="email" type="email" placeholder="Enter your email" className="h-10 sm:h-11" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiryType" className="text-sm font-medium">
                  Inquiry type
                </Label>
                <Select>
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent/Family Support</SelectItem>
                    <SelectItem value="research">Research Partnership</SelectItem>
                    <SelectItem value="healthcare">Healthcare Provider</SelectItem>
                    <SelectItem value="enterprise">Enterprise Solutions</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <Button className="w-full h-10 sm:h-11 text-sm sm:text-base">Send message</Button>

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Your information is protected by HIPAA compliance standards</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6 sm:space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg sm:text-xl flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Family Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Email Support</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">families@caregene.ai</p>
                    <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Live Chat</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Available 24/7 for urgent questions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Phone Support</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">1-800-CAREGENE</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri 8AM-8PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg sm:text-xl flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Enterprise & Research</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Business Development</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">enterprise@caregene.ai</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Headquarters</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      123 Innovation Drive
                      <br />
                      Boston, MA 02115
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm sm:text-base">Business Hours</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Monday - Friday, 9AM - 6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/20 rounded-lg p-4 sm:p-6">
              <h3 className="font-serif font-semibold text-base sm:text-lg mb-2">Emergency Support</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                For urgent medical questions, please contact your healthcare provider immediately or call emergency
                services.
              </p>
              <p className="text-xs text-muted-foreground">
                Caregene AI provides informational support and is not a substitute for professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
