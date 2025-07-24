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
  const [profilePicture, setProfilePicture] = useState("")
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [profileVisibility, setProfileVisibility] = useState("private")
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [error, setError] = useState("")
  const [cardVisible, setCardVisible] = useState(false)
  const [shake, setShake] = useState(false)
  const [progressValue, setProgressValue] = useState(((0 + 1) / 6) * 100)
  const [finishPulse, setFinishPulse] = useState(false)
  const [contentFade, setContentFade] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Persist onboarding choices to localStorage on change
  useEffect(() => {
    const onboardingData = {
      username,
      bio,
      profilePicture,
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
      profilePicture: string;
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
  }, [username, bio, profilePicture, selectedConditions, selectedRegion, profileVisibility, privacyConsent])

  useEffect(() => {
    setTimeout(() => setCardVisible(true), 100)
  }, [])

  useEffect(() => {
    setProgressValue(((step + 1) / 6) * 100)
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB")
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePicture(result)
        setError("")
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfilePicture = () => {
    setProfilePicture("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleNext = () => {
    setError("")
    if (!canProceed()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      switch (step) {
        case 0:
          setError("Please enter a username."); break;
        case 2:
          setError("Please select at least one condition."); break;
        case 3:
          setError("Please select your region."); break;
        case 5:
          setError("You must accept the privacy policy to continue."); break;
      }
      return;
    }
    if (step < 5) {
      setStep(step + 1)
    } else {
      setFinishPulse(true)
      toast({ title: "Onboarding Complete!", description: "Welcome to Caregene. Your profile is ready." })
      setTimeout(() => {
        onComplete({
          username,
          bio,
          profilePicture,
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
        return true // Photo is optional
      case 2:
        return selectedConditions.length > 0
      case 3:
        return selectedRegion !== ""
      case 4:
        return true
      case 5:
        return privacyConsent
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Caregene
              </h1>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Step {step + 1} of 6
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Profile</span>
            <span>Picture</span>
            <span>Conditions</span>
            <span>Region</span>
            <span>Privacy</span>
            <span>Complete</span>
          </div>
        </div>

        <div className={`transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${shake ? 'animate-shake' : ''}`}> 
          <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      👋 Welcome to Caregene!
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Let's create your profile to connect you with the right communities and resources.
                    </p>
                    <div className={`space-y-6 max-w-md mx-auto ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}> 
                      <div className="text-left">
                        <Label htmlFor="username" className="text-base font-medium text-gray-700 mb-2 block">
                          Choose a Username
                        </Label>
                        <input
                          id="username"
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300"
                          placeholder="Enter your username"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="text-left">
                        <Label htmlFor="bio" className="text-base font-medium text-gray-700 mb-2 block">
                          Tell Us About Yourself (Optional)
                        </Label>
                        <textarea
                          id="bio"
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 hover:border-gray-300 resize-none"
                          placeholder="Share a bit about yourself and your journey..."
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
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">📸</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      📷 Add Your Photo (Optional)
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Upload a profile picture to help others recognize you in the community. You can always add this later.
                    </p>
                    <div className={`max-w-md mx-auto ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}>
                      <div className="flex flex-col items-center space-y-4">
                        {/* Profile Picture Preview */}
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                            {profilePicture ? (
                              <img 
                                src={profilePicture} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          {profilePicture && (
                            <button
                              onClick={removeProfilePicture}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                        
                        {/* Upload Button */}
                        <div className="flex flex-col items-center space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="px-6 py-3 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
                          >
                            {profilePicture ? "Change Photo" : "Upload Photo"}
                          </Button>
                          <p className="text-xs text-gray-500">
                            Optional • Max 5MB • JPG, PNG, GIF
                          </p>
                        </div>
                      </div>
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
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      🧬 Your Health Journey
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                      Select the conditions you'd like to connect with others about. This helps us show you relevant communities and resources.
                    </p>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}>
                      {conditions.map((condition) => (
                        <div 
                          key={condition} 
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                            selectedConditions.includes(condition) 
                              ? 'border-blue-400 bg-blue-50 shadow-sm' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleConditionToggle(condition)}
                        >
                          <Checkbox
                            id={condition}
                            checked={selectedConditions.includes(condition)}
                            onCheckedChange={() => handleConditionToggle(condition)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label htmlFor={condition} className="text-sm font-medium cursor-pointer flex-1 text-left">
                            {condition}
                          </Label>
                        </div>
                      ))}
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
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl">🌍</span>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      🗺️ Where Are You Located?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      This helps us connect you with local communities and region-specific resources.
                    </p>
                    <div className={`max-w-md mx-auto ${contentFade ? 'animate-fade-in' : 'opacity-0'}`}>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="w-full h-12 text-base border-2 border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400">
                          <SelectValue placeholder="Choose your region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region} className="text-base py-3">
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      🔒 Privacy Settings
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Choose how visible your profile should be to other community members.
                    </p>
                    <div className="max-w-lg mx-auto">
                      <RadioGroup value={profileVisibility} onValueChange={setProfileVisibility} className="space-y-4">
                        <div className="flex items-start space-x-4 p-6 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300 hover:shadow-md data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-50">
                          <RadioGroupItem value="public" id="public" className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                          <div className="flex-1 text-left">
                            <Label htmlFor="public" className="text-lg font-semibold text-gray-900 block mb-2 cursor-pointer">
                              🌟 Public Profile
                            </Label>
                            <p className="text-sm text-gray-600">
                              Other members can see your profile and connect with you directly
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4 p-6 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300 hover:shadow-md data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-50">
                          <RadioGroupItem value="private" id="private" className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                          <div className="flex-1 text-left">
                            <Label htmlFor="private" className="text-lg font-semibold text-gray-900 block mb-2 cursor-pointer">
                              🔐 Private Profile
                            </Label>
                            <p className="text-sm text-gray-600">
                              Your profile is hidden, but you can still participate in communities
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </motion.div>
                )}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      🎉 Almost Done!
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Please review and accept our privacy policy to complete your registration.
                    </p>
                    <div className="max-w-lg mx-auto">
                      <div className={`flex items-start space-x-4 p-6 border-2 border-gray-200 rounded-xl transition-all duration-200 hover:border-blue-300 ${contentFade ? 'animate-fade-in' : 'opacity-0'} ${privacyConsent ? 'border-blue-400 bg-blue-50' : ''}`}>
                        <Checkbox
                          id="privacy-consent"
                          checked={privacyConsent}
                          onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div className="flex-1 text-left">
                          <Label htmlFor="privacy-consent" className="text-base font-medium text-gray-900 block mb-2 cursor-pointer">
                            📋 Privacy Agreement
                          </Label>
                          <p className="text-sm text-gray-600">
                            I agree to the <a href="#" className="underline text-blue-600 hover:text-blue-800">privacy policy</a> and terms of service. I understand how my data will be used to connect me with relevant communities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center animate-fade-in">{error}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="px-6 py-3 transition-all duration-150 ease-in-out active:scale-95 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-8 py-3 min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-150 ease-in-out active:scale-95 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${step === 4 && finishPulse ? 'animate-pulse-once' : ''}`}
                >
                  {step === 5 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Setup
                    </>
                  ) : (
                    <>
                      Continue
                      <span className="ml-2">→</span>
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
