"use client"

import { useState, useEffect } from "react"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { GuidedOnboarding } from "@/components/guided-onboarding"
import { AnimatePresence, motion } from "framer-motion"
import CommunityHome from "@/components/community-home"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showGuidedOnboarding, setShowGuidedOnboarding] = useState(false)

  useEffect(() => {
    // Sync from localStorage
    const storedUser = localStorage.getItem("user")
    const storedOnboardingStatus = localStorage.getItem("onboarding_complete")
    const guidedOnboardingShown = localStorage.getItem("guided_onboarding_shown")
    
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      if (storedOnboardingStatus === "true") setOnboardingComplete(true)
      setShowGuidedOnboarding(!guidedOnboardingShown)
    } else {
      // No user exists, create a default user and start guided onboarding
      const defaultUser = {
        id: "default-user",
        username: "User",
        email: "user@example.com",
        role: "Member",
        joined: "today"
      }
      setUser(defaultUser)
      localStorage.setItem("user", JSON.stringify(defaultUser))
      setShowGuidedOnboarding(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleOnboardingComplete = (onboardingData: any) => {
    setOnboardingComplete(true)
    localStorage.setItem("onboarding_complete", "true")
    localStorage.setItem("user_data", JSON.stringify(onboardingData))
  }

  const handleGuidedOnboardingComplete = () => {
    setShowGuidedOnboarding(false)
    localStorage.setItem("guided_onboarding_shown", "true")
  }

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center min-h-screen bg-background">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </motion.div>
      )}
      {!loading && user && showGuidedOnboarding && (
        <motion.div
          key="guided-onboarding"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <GuidedOnboarding onBack={() => setShowGuidedOnboarding(false)} onCompleteOnboarding={handleGuidedOnboardingComplete} />
        </motion.div>
      )}
      {!loading && user && !showGuidedOnboarding && !onboardingComplete && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </motion.div>
      )}
      {!loading && user && !showGuidedOnboarding && onboardingComplete && (
        <motion.div
          key="home"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          <CommunityHome user={user} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
