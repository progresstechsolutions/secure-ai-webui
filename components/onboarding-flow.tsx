"use client"

import React, { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Heart, Shield, CheckCircle, User, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface OnboardingFlowProps {
  onComplete: (userData: any) => void
  onBack?: () => void
}

const conditions = [
  "Phelan-McDermid Syndrome (PMS)",
  "Rett Syndrome",
  "Fragile X Syndrome",
  "Angelman Syndrome",
  "Prader-Willi Syndrome",
  "Down Syndrome",
  "Cystic Fibrosis",
  "Sickle Cell Anemia",
  "Huntington's Disease",
  "Spinal Muscular Atrophy (SMA)",
  "Batten Disease",
  "Tay-Sachs Disease",
  "Gaucher Disease",
  "Maple Syrup Urine Disease (MSUD)",
  "Phenylketonuria (PKU)",
  "Other Genetic Condition",
]

const regions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Other",
]

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [profileVisibility, setProfileVisibility] = useState("private")
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [error, setError] = useState("")
  const [cardVisible, setCardVisible] = useState(false)
  const [shake, setShake] = useState(false)
  const [progressValue, setProgressValue] = useState(((0 + 1) / 5) * 100)
  const [finishPulse, setFinishPulse] = useState(false)
  const [contentFade, setContentFade] = useState(true)

  // Persist onboarding choices to localStorage on change
  useEffect(() => {
    const onboardingData = {
      username,
      bio,
      region: selectedRegion,
      conditions: selectedConditions,
      profileVisibility,
      privacyConsent,
    }
    // Assign userKey if not present
    let stored = localStorage.getItem("user_data")
    interface StoredUserData {
      userKey: string;
      username: string;
      bio: string;
      region: string;
      conditions: string[];
      profileVisibility: string;
      privacyConsent: boolean;
    }

    let parsed: Partial<StoredUserData> = stored ? JSON.parse(stored) : {};
    const userKey: string = parsed.userKey ?? crypto.randomUUID();
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        ...onboardingData,
        userKey,
      })
    );
  }, [username, bio, selectedConditions, selectedRegion, profileVisibility, privacyConsent])

  useEffect(() => {
    setTimeout(() => setCardVisible(true), 100)
  }, [])

  useEffect(() => {
    setProgressValue(((step + 1) / 5) * 100)
  }, [step])

  useEffect(() => {
    setContentFade(false)
    setTimeout(() => setContentFade(true), 350)
  }, [step])

  useEffect(() => {
    if (finishPulse) {
      setTimeout(() => setFinishPulse(false), 800)
    }
  }, [finishPulse])

  const handleConditionToggle = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const handleNext = () => {
    setError("")
    if (!canProceed()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      switch (step) {
        case 0:
          setError("Please enter a username."); break;
        case 1:
          setError("Please select at least one condition."); break;
        case 2:
          setError("Please select your region."); break;
        case 4:
          setError("You must accept the privacy policy to continue."); break;
      }
      return;
    }
    if (step < 4) {
      setStep(step + 1)
    } else {
      setFinishPulse(true)
      toast({ title: "Onboarding Complete!", description: "Welcome to Carelink. Your profile is ready." })
      setTimeout(() => {
        onComplete({
          username,
          bio,
          conditions: selectedConditions,
          region: selectedRegion,
          profileVisibility,
          privacyConsent,
        })
      }, 800)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return username.trim().length > 0
      case 1:
        return selectedConditions.length > 0
      case 2:
        return selectedRegion !== ""
      case 3:
        return true
      case 4:
        return privacyConsent
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
        </div>
      </header>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className={`transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${shake ? 'animate-shake' : ''}`}> 
          <Card className="shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-2">Onboarding</CardTitle>
              <div className="text-sm text-muted-foreground mb-2">Step {step + 1} of 5</div>
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="w-full h-2 bg-rose-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-orange-400 transition-all duration-500"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardTitle className="mb-4 text-2xl gradient-text">Create Your Profile</CardTitle>
                    <div className={`space-y-4 ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}> 
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <input
                          id="username"
                          className="w-full border rounded px-3 py-2 mt-1 transition-all duration-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 border-2"
                          placeholder="Enter a username"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="w-full border rounded px-3 py-2 mt-1 min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 border-2"
                          placeholder="Tell us a little about yourself..."
                          value={bio}
                          onChange={e => setBio(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardTitle className="mb-4 text-2xl gradient-text">Welcome! Let's get started</CardTitle>
                    <p className="text-muted-foreground mb-6">
                      Select the rare genetic conditions you'd like to connect with others about. This helps us show you
                      relevant communities.
                    </p>
                    <div className={`grid grid-cols-2 gap-3 ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}>
                      {conditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={selectedConditions.includes(condition)}
                            onCheckedChange={() => handleConditionToggle(condition)}
                          />
                          <Label htmlFor={condition} className="text-sm">
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardTitle className="mb-4">Select Your Region</CardTitle>
                    <p className="text-muted-foreground mb-6">
                      This helps us connect you with local communities and resources.
                    </p>
                    <div className={contentFade ? 'animate-fade-in' : 'opacity-0'}>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardTitle className="mb-4">Profile Visibility</CardTitle>
                    <p className="text-muted-foreground mb-6">
                      Choose how visible your profile should be to other community members.
                    </p>
                    <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg transition-colors duration-200 hover:bg-gray-50">
                        <RadioGroupItem value="public" id="public" />
                        <div>
                          <Label htmlFor="public" className="font-medium">
                            Public Profile
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Other members can see your profile and connect with you
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg transition-colors duration-200 hover:bg-gray-50">
                        <RadioGroupItem value="private" id="private" />
                        <div>
                          <Label htmlFor="private" className="font-medium">
                            Private Profile
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Your profile is hidden, but you can still participate in communities
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardTitle className="mb-4">Privacy & Consent</CardTitle>
                    <p className="text-muted-foreground mb-6">
                      Please review and accept our privacy policy to continue using Carelink.
                    </p>
                    <div className={`flex items-center space-x-2 ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}>
                      <Checkbox
                        id="privacy-consent"
                        checked={privacyConsent}
                        onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
                      />
                      <Label htmlFor="privacy-consent">
                        I agree to the <a href="#" className="underline text-blue-600">privacy policy</a> and terms.
                      </Label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {error && <div className="text-sm text-red-500 mt-2 animate-fade-in">{error}</div>}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="transition-all duration-150 ease-in-out active:scale-95 focus:ring-2 focus:ring-rose-200 focus:outline-none"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`min-w-[120px] transition-all duration-150 ease-in-out active:scale-95 focus:ring-2 focus:ring-rose-200 focus:outline-none ${step === 4 && finishPulse ? 'animate-pulse-once' : ''}`}
                >
                  {step === 4 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Finish
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
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
