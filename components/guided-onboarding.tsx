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
    title: "Welcome to Caregene! 👋",
    description: "Your supportive community for rare genetic conditions",
    icon: "🌟",
    emoji: "🎉",
    content: (
      <div className="text-center space-y-3 sm:space-y-4">
        <p className="text-sm sm:text-base text-gray-600">
          Connect with others who understand your journey
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
          <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
            <div className="text-lg sm:text-xl mb-1">👥</div>
            <p className="text-xs sm:text-sm font-medium">Community</p>
          </div>
          <div className="bg-purple-50 p-2 sm:p-3 rounded-lg">
            <div className="text-lg sm:text-xl mb-1">💬</div>
            <p className="text-xs sm:text-sm font-medium">Support</p>
          </div>
          <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
            <div className="text-lg sm:text-xl mb-1">📚</div>
            <p className="text-xs sm:text-sm font-medium">Resources</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Find Your Tribe 🔍",
    description: "Discover communities that feel like home",
    icon: "👥",
    emoji: "🏠",
    content: (
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🧬</span>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm">Condition-Specific Groups</h4>
              <p className="text-xs text-gray-600">Phelan-McDermid, Rett Syndrome & more</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">💡</span>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm">Quick Tip</h4>
              <p className="text-xs text-gray-600">Check "Suggested" tab for popular discussions</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Share & Connect 💬",
    description: "Your voice matters in our community",
    icon: "💝",
    emoji: "✨",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-pink-50 p-3 rounded-lg text-center">
            <div className="text-lg sm:text-xl mb-1">📝</div>
            <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1">Create Posts</h4>
            <p className="text-xs text-gray-600">Share your story</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-lg sm:text-xl mb-1">❤️</div>
            <h4 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1">Show Support</h4>
            <p className="text-xs text-gray-600">React & comment</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-center">
            <span className="text-sm">🏷️</span>
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Use tags like <span className="bg-purple-100 px-1 py-0.5 rounded text-xs">#research</span>
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Powerful Tools 🛠️",
    description: "Everything you need in one place",
    icon: "🚀",
    emoji: "💪",
    content: (
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
          <div className="text-lg sm:text-xl mb-1">💬</div>
          <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Messages</h4>
          <p className="text-xs text-gray-600 mt-1">One-on-one support</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
          <div className="text-lg sm:text-xl mb-1">🎯</div>
          <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Milestones</h4>
          <p className="text-xs text-gray-600 mt-1">Track progress</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
          <div className="text-lg sm:text-xl mb-1">📚</div>
          <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Resources</h4>
          <p className="text-xs text-gray-600 mt-1">Curated guides</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
          <div className="text-lg sm:text-xl mb-1">👨‍⚕️</div>
          <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">Expert Q&A</h4>
          <p className="text-xs text-gray-600 mt-1">Ask specialists</p>
        </div>
      </div>
    ),
  },
  {
    title: "Your Privacy First 🔒",
    description: "You're in complete control",
    icon: "🛡️",
    emoji: "✅",
    content: (
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">👤</span>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm">Your Profile, Your Rules</h4>
              <p className="text-xs text-gray-600">Public, private, or anonymous posting</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 bg-blue-50 p-3 rounded-lg">
          <span className="text-lg">🔐</span>
          <p className="text-xs sm:text-sm font-medium text-gray-700">
            Update privacy settings anytime
          </p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Top Bar - More compact on mobile */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <User className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Caregene</span>
              <p className="text-xs text-gray-500 hidden sm:block">Getting Started Tour</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <span>{currentStep + 1} of {steps.length}</span>
          </div>
        </div>
      </header>

      {/* Main Content - Flex grow to fill remaining space */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-8">
        <div className="w-full max-w-3xl">
          <div className={`transition-all duration-500 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}> 
            <Card className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {/* Progress Bar - More compact */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Progress</span>
                    <span className="text-xs sm:text-sm font-bold text-blue-600">{Math.round(progressValue)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progressValue}%` }}
                    />
                  </div>
                </div>

                {/* Main Content - Optimized for mobile */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className={`mb-3 sm:mb-4 transition-all duration-300 ${iconPulse ? 'scale-105' : 'scale-100'}`}>
                    {currentStep === steps.length - 1 && finishPulse ? (
                      <div className="text-4xl sm:text-6xl">🎉</div>
                    ) : (
                      <div className="text-4xl sm:text-6xl mb-1 sm:mb-2">{currentStepContent.icon}</div>
                    )}
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 px-2">
                    {currentStepContent.title}
                  </h1>
                  
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 max-w-xl mx-auto px-2">
                    {currentStepContent.description}
                  </p>
                  
                  <div className={`transition-all duration-300 ${contentFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} max-w-xl mx-auto px-2`}>
                    {currentStepContent.content}
                  </div>
                </div>

                {/* Navigation - More compact and mobile-friendly */}
                <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="px-3 sm:px-4 py-2 rounded-lg border hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 text-sm"
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                  
                  <div className="flex space-x-1 sm:space-x-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                          index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={handleNext}
                    className={`px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md transition-all duration-200 text-sm ${
                      finishPulse ? 'animate-pulse' : ''
                    }`}
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Get Started!</span>
                        <span className="sm:hidden">Start</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Next</span>
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-0 sm:ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Animations - Simplified */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
