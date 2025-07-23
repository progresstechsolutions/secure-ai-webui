"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Lightbulb, ArrowRight, ArrowLeft, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface GuidedOnboardingProps {
  onBack: () => void
  onCompleteOnboarding: () => void
}

const steps = [
  {
    title: "Welcome to Carelink!",
    description: "This guided tour will help you get the most out of our platform for rare genetic conditions.",
    icon: <Lightbulb className="h-12 w-12 text-rose-500" />,
    content: (
      <p className="text-muted-foreground">
        We're here to connect you with a supportive community, valuable resources, and expert insights tailored to rare
        genetic conditions. Let's explore how to get started.
      </p>
    ),
  },
  {
    title: "Discover Your Communities",
    description: "Find and join communities relevant to your specific rare genetic condition(s).",
    icon: <Lightbulb className="h-12 w-12 text-orange-500" />,
    content: (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          Our platform hosts dedicated communities for various rare genetic conditions like Phelan-McDermid Syndrome,
          Rett Syndrome, SMA, Batten Disease, and more.
        </p>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Use the "Your Communities" sidebar to quickly access your joined groups.</li>
          <li>Explore the "Suggested" tab in the main feed to discover new communities and popular discussions.</li>
          <li>If your condition isn't listed, the "General Genetic Conditions" community is a great starting point.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Engage with Posts & Discussions",
    description: "Share your experiences, ask questions, and connect with others.",
    icon: <Lightbulb className="h-12 w-12 text-pink-500" />,
    content: (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          The main feed is where you'll see posts from your communities and suggested content.
        </p>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Create new posts to share updates, ask for support, or discuss topics.</li>
          <li>React to posts with hearts, thumbs up, or other emojis to show support.</li>
          <li>Comment on posts to join conversations and offer advice.</li>
          <li>Use tags like #research, #treatment, #diagnosis to find specific topics.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Utilize Key Features",
    description: "Explore DMs, Milestones, Resources, and Expert Q&A.",
    icon: <Lightbulb className="h-12 w-12 text-rose-600" />,
    content: (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          Beyond the main feed, Carelink offers powerful tools to support your journey.
        </p>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>**Direct Messages (DMs):** Connect privately with other members for one-on-one support.</li>
          <li>**Milestones:** Track and celebrate personal achievements related to your health journey.</li>
          <li>**Resource Library:** Access curated articles, guides, and videos on rare genetic conditions.</li>
          <li>**Expert Q&A:** Submit questions to medical professionals and specialists.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Manage Your Profile & Privacy",
    description: "Control your personal information and how you interact with the platform.",
    icon: <Lightbulb className="h-12 w-12 text-orange-600" />,
    content: (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          Your privacy is important to us. You have full control over your profile.
        </p>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Update your profile with your conditions, bio, and region.</li>
          <li>Choose your profile visibility (public or private).</li>
          <li>Review and adjust your privacy settings at any time.</li>
          <li>Remember you can post anonymously in communities if you prefer.</li>
        </ul>
      </div>
    ),
  },
]

export function GuidedOnboarding(props: any) {
  const [currentStep, setCurrentStep] = useState(0)
  const [cardVisible, setCardVisible] = useState(false)
  const [iconPulse, setIconPulse] = useState(false)
  const [contentFade, setContentFade] = useState(true)
  const [progressValue, setProgressValue] = useState(((0 + 1) / steps.length) * 100)
  const [finishPulse, setFinishPulse] = useState(false)
  const router = useRouter()

  React.useEffect(() => {
    setTimeout(() => setCardVisible(true), 100)
  }, [])

  // Animate progress bar
  React.useEffect(() => {
    setProgressValue(((currentStep + 1) / steps.length) * 100)
  }, [currentStep])

  // Animate icon pulse/bounce on step change
  React.useEffect(() => {
    setIconPulse(true)
    setContentFade(false)
    setTimeout(() => {
      setIconPulse(false)
      setContentFade(true)
    }, 400)
  }, [currentStep])

  // Animate finish checkmark
  React.useEffect(() => {
    if (finishPulse) {
      setTimeout(() => setFinishPulse(false), 800)
    }
  }, [finishPulse])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setFinishPulse(true)
      setTimeout(() => props.onCompleteOnboarding(), 800)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      props.onBack() // Go back to previous screen if on first step
    }
  }

  const currentStepContent = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
         
        </div>
      </header>
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className={`transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}> 
          <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-2">Guided Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full h-2 bg-rose-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">Step {currentStep + 1} of {steps.length}</div>
              </div>
              <div className="flex flex-col items-center mb-4">
                <div className={`mb-2 transition-all duration-300 ${iconPulse ? 'animate-bounce-once' : ''}`}>
                  {currentStep === steps.length - 1 && finishPulse ? (
                    <CheckCircle className="h-14 w-14 text-green-500 animate-pulse-once" />
                  ) : (
                    currentStepContent.icon
                  )}
                </div>
                <CardTitle className="mb-4 text-2xl gradient-text text-center">{currentStepContent.title}</CardTitle>
                <p className="text-lg text-gray-700 mb-6 text-center">{currentStepContent.description}</p>
                <div className={`w-full ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}>{currentStepContent.content}</div>
              </div>
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="transition-all duration-150 ease-in-out bg-transparent active:scale-95 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="min-w-[120px] bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg transition-all duration-150 ease-in-out active:scale-95 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finish Tour
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
        @keyframes bounce-once {
          0% { transform: scale(1); }
          30% { transform: scale(1.2) translateY(-10px); }
          60% { transform: scale(0.95) translateY(2px); }
          100% { transform: scale(1); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes pulse-once {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pulse-once {
          animation: pulse-once 0.8s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  )
}
