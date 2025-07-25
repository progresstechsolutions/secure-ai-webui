"use client"

import { useState, useEffect } from "react"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { GuidedOnboarding } from "@/components/guided-onboarding"
import { LoginScreen } from "@/components/login-screen"
import { RegistrationScreen } from "@/components/registration-screen"
import { AnimatePresence, motion } from "framer-motion"
import CommunityHome from "@/components/community-home"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showGuidedOnboarding, setShowGuidedOnboarding] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)

  useEffect(() => {
    // Sync from localStorage
    const storedUser = localStorage.getItem("user")
    const storedUserData = localStorage.getItem("user_data")
    const storedOnboardingStatus = localStorage.getItem("onboarding_complete")
    const guidedOnboardingShown = localStorage.getItem("guided_onboarding_shown")
    
    if (storedUser && storedUserData && storedOnboardingStatus === "true") {
      // Returning user who has completed onboarding - go straight to home
      const userData = JSON.parse(storedUserData)
      setUser({ ...JSON.parse(storedUser), ...userData })
      setOnboardingComplete(true)
      setShowGuidedOnboarding(false)
      setShowLogin(false)
    } else if (storedUser) {
      // User exists but hasn't completed onboarding
      setUser(JSON.parse(storedUser))
      if (storedOnboardingStatus === "true") setOnboardingComplete(true)
      setShowGuidedOnboarding(!guidedOnboardingShown)
      setShowLogin(false)
    } else {
      // No user exists, show login screen
      setShowLogin(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setShowLogin(false)
    setShowRegistration(false)
    
    // Check if this user has completed onboarding before
    const existingUserData = localStorage.getItem("user_data")
    const onboardingStatus = localStorage.getItem("onboarding_complete")
    
    if (existingUserData && onboardingStatus === "true") {
      // Skip onboarding for returning users
      setOnboardingComplete(true)
      setShowGuidedOnboarding(false)
    } else {
      // New user - start with guided onboarding
      setShowGuidedOnboarding(true)
    }
  }

  const handleNewUser = () => {
    setShowLogin(false)
    setShowRegistration(true)
  }

  const handleRegister = (userData: any) => {
    // Save the user to registered users list
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
    registeredUsers.push(userData)
    localStorage.setItem("registered_users", JSON.stringify(registeredUsers))
    
    // Set as current user and start onboarding
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setShowRegistration(false)
    setShowGuidedOnboarding(true)
  }

  const handleBackToLogin = () => {
    setShowRegistration(false)
    setShowLogin(true)
  }

  const handleOnboardingComplete = (onboardingData: any) => {
    setOnboardingComplete(true)
    localStorage.setItem("onboarding_complete", "true")
    localStorage.setItem("user_data", JSON.stringify(onboardingData))
    
    // Update the user in the registered_users list with onboarding data
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
    const userIndex = registeredUsers.findIndex((u: any) => u.id === user.id)
    
    if (userIndex >= 0) {
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        ...onboardingData,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString()
      }
      localStorage.setItem("registered_users", JSON.stringify(registeredUsers))
    }
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
      {!loading && showLogin && (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <LoginScreen onLogin={handleLogin} onNewUser={handleNewUser} />
        </motion.div>
      )}
      {!loading && showRegistration && (
        <motion.div
          key="registration"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <RegistrationScreen onRegister={handleRegister} onBackToLogin={handleBackToLogin} />
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
