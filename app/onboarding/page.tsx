"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/ui/user-avatar"
import { Heart, MapPin, Activity, ArrowRight, ArrowLeft, Search, Camera, User, Mail, AtSign } from "lucide-react"

const healthConditions = [
  "Huntington's Disease", "Cystic Fibrosis", "Sickle Cell Anemia", "Fragile X Syndrome", 
  "Down Syndrome", "Phelan-McDermid Syndrome (PMS)", "Rett Syndrome", "Angelman Syndrome", 
  "Prader-Willi Syndrome", "Spinal Muscular Atrophy (SMA)", "Batten Disease", "Tay-Sachs Disease", 
  "Gaucher Disease", "Maple Syrup Urine Disease (MSUD)", "Phenylketonuria (PKU)", 
  "Hemophilia", "Duchenne Muscular Dystrophy", "Marfan Syndrome", "Neurofibromatosis", 
  "Polycystic Kidney Disease", "BRCA1/BRCA2 Mutations", "Lynch Syndrome", "Familial Adenomatous Polyposis",
  "Hereditary Hemorrhagic Telangiectasia", "Wilson's Disease", "Alpha-1 Antitrypsin Deficiency",
  "Fabry Disease", "Pompe Disease", "Other Genetic Condition"
]

const regions = [
  { 
    id: "us", 
    name: "United States", 
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
      "Wisconsin", "Wyoming", "Washington DC"
    ] 
  },
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia" },
  { id: "south-america", name: "South America" },
  { id: "other", name: "Other" }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0) // Start at 0 for profile setup
  const [user, setUser] = useState<any>(null)
  const [stateSearchQuery, setStateSearchQuery] = useState("")
  const [conditionSearchQuery, setConditionSearchQuery] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    healthConditions: [] as string[],
    region: "",
    state: "",
    careRole: "",
    privacy: "public",
    profilePicture: ""
  })

  useEffect(() => {
    // Get user from signup localStorage
    const signupUser = localStorage.getItem('signup_user')
    const onboardingData = localStorage.getItem('onboardingData')
    
    if (signupUser) {
      setUser(JSON.parse(signupUser))
    } else if (onboardingData) {
      setUser(JSON.parse(onboardingData))
    } else {
      // Mock user for demo
      setUser({
        id: "current-user",
        email: "user@example.com",
        username: "current_user"
      })
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setProfileImage(imageUrl)
        setFormData(prev => ({ ...prev, profilePicture: imageUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: checked 
        ? [...prev.healthConditions, condition]
        : prev.healthConditions.filter(c => c !== condition)
    }))
  }

  const handleComplete = () => {
    // Save user preferences but keep them as pending until guided onboarding is complete
    const updatedUser = {
      ...user,
      healthConditions: formData.healthConditions,
      location: { region: formData.region, state: formData.state },
      careRole: formData.careRole,
      privacy: formData.privacy,
      profilePicture: formData.profilePicture,
      profileComplete: true
    }
    
    console.log('=== Main Onboarding Complete ===')
    console.log('Selected health conditions:', formData.healthConditions)
    console.log('Updated user object:', updatedUser)
    console.log('=== End Debug ===')
    
    localStorage.setItem('onboardingData', JSON.stringify(formData))
    localStorage.setItem('pending_user', JSON.stringify(updatedUser))
    localStorage.removeItem('signup_user') // Remove signup data
    
    // Redirect to guided onboarding
    router.push("/onboarding/guided")
  }

  const selectedRegion = regions.find(r => r.id === formData.region)

  // Filter states based on search query
  const filteredStates = useMemo(() => {
    if (!selectedRegion?.states) return []
    if (!stateSearchQuery.trim()) return selectedRegion.states
    
    return selectedRegion.states.filter(state =>
      state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    )
  }, [selectedRegion, stateSearchQuery])

  // Filter health conditions based on search query
  const filteredConditions = useMemo(() => {
    if (!conditionSearchQuery.trim()) return healthConditions
    
    return healthConditions.filter(condition =>
      condition.toLowerCase().includes(conditionSearchQuery.toLowerCase())
    )
  }, [conditionSearchQuery])

  // Reset state search when region changes
  useEffect(() => {
    setStateSearchQuery("")
  }, [formData.region])

  // Show loading while user data is being loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Caregene</h1>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full transition-colors ${
                  stepNumber <= step + 1 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-8">
            {step === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Set up your profile
                  </h2>
                  <p className="text-gray-600">
                    Add a profile picture and review your account information.
                  </p>
                </div>

                {/* Profile Picture Section */}
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <UserAvatar
                      username={user?.username || 'User'}
                      profilePicture={profileImage || undefined}
                      size="xl"
                      className="w-32 h-32 border-4 border-white shadow-lg"
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {profileImage ? 'Change Photo' : 'Add Profile Photo'}
                    </Button>
                    
                    {profileImage && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setProfileImage(null)
                          setFormData(prev => ({ ...prev, profilePicture: "" }))
                        }}
                        className="w-full sm:w-auto text-red-600 hover:text-red-700"
                      >
                        Remove Photo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Account Information Display */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 text-center">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.username && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <AtSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Username</p>
                            <p className="text-sm font-medium text-gray-900">@{user.username}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {user?.email && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Email</p>
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What genetic conditions are you managing?
                  </h2>
                  <p className="text-gray-600">
                    Help us connect you with the right genetic health support communities. Select all that apply.
                  </p>
                </div>

                {/* Condition Search Input */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search genetic conditions..."
                    value={conditionSearchQuery}
                    onChange={(e) => setConditionSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>

                {/* Conditions Grid */}
                <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredConditions.length > 0 ? (
                      filteredConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                          <Checkbox
                            id={condition}
                            checked={formData.healthConditions.includes(condition)}
                            onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                          />
                          <Label htmlFor={condition} className="flex-1 cursor-pointer text-sm">
                            {condition}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        No conditions found matching "{conditionSearchQuery}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={formData.healthConditions.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Where are you located?
                  </h2>
                  <p className="text-gray-600">
                    This helps us connect you with local resources and communities.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Select your region:</Label>
                    <RadioGroup
                      value={formData.region}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, region: value, state: "" }))}
                    >
                      {regions.map((region) => (
                        <div key={region.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300">
                          <RadioGroupItem value={region.id} id={region.id} />
                          <Label htmlFor={region.id} className="flex-1 cursor-pointer">
                            {region.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {selectedRegion?.states && (
                    <div>
                      <Label className="text-base font-medium mb-3 block">Select your state:</Label>
                      
                      {/* State Search Input */}
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search for your state..."
                          value={stateSearchQuery}
                          onChange={(e) => setStateSearchQuery(e.target.value)}
                          className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        />
                      </div>

                      {/* States List */}
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        <RadioGroup
                          value={formData.state}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                        >
                          {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                              <div key={state} className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                                <RadioGroupItem value={state} id={state} />
                                <Label htmlFor={state} className="flex-1 cursor-pointer">
                                  {state}
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No states found matching "{stateSearchQuery}"
                            </div>
                          )}
                        </RadioGroup>
                      </div>
                      
                      {/* Selected State Display */}
                      {formData.state && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Selected:</span> {formData.state}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.region || (selectedRegion?.states && !formData.state)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    What's your care role?
                  </h2>
                  <p className="text-gray-600">
                    This helps us personalize your experience.
                  </p>
                </div>

                <RadioGroup
                  value={formData.careRole}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, careRole: value }))}
                >
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300">
                    <RadioGroupItem value="caregiver" id="caregiver" />
                    <Label htmlFor="caregiver" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Caregiver</div>
                        <div className="text-sm text-gray-500">I care for someone with a health condition</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300">
                    <RadioGroupItem value="family" id="family" />
                    <Label htmlFor="family" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Family Member</div>
                        <div className="text-sm text-gray-500">I support a family member with their health</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Expert</div>
                        <div className="text-sm text-gray-500">I want to help and support others in their health journeys</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={!formData.careRole}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Setup
                    <Heart className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
