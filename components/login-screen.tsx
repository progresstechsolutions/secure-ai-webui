"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Mail, CheckCircle, User, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginScreenProps {
  onLogin: (userData: any) => void
}

export function LoginScreen(props: any) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cardVisible, setCardVisible] = useState(false)
  const [shake, setShake] = useState(false)
  const [successPulse, setSuccessPulse] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const onBack = props.onBack || (() => router.back())

  // Animate card on mount
  React.useEffect(() => {
    setTimeout(() => setCardVisible(true), 100)
  }, [])

  // Animate progress bar when loading
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (showProgress && isLoading) {
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 200)
    } else {
      setProgress(0)
    }
    return () => clearInterval(interval)
  }, [showProgress, isLoading])

  // Success pulse animation
  React.useEffect(() => {
    if (linkSent) {
      setSuccessPulse(true)
      setTimeout(() => setSuccessPulse(false), 600)
    }
  }, [linkSent])

  const isValidEmail = (value: string): boolean => {
    // Simple RFC 5322 compliant regex
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (!value) {
      setEmailError(null)
      return
    }
    setEmailError(isValidEmail(value) ? null : "Please enter a valid email address.")
  }

  const handleSendLink = async () => {
    if (!email) return
    if (!isValidEmail(email)) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setEmailError("Please enter a valid email address.")
      inputRef.current?.focus()
      return
    }
    setIsLoading(true)
    setShowProgress(true)
    // Simulate sending magic link
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLinkSent(true)
    setIsLoading(false)
    setShowProgress(false)
    setProgress(100)
    // Simulate clicking the magic link after 3 seconds
    setTimeout(() => {
      props.onLogin({
        email,
        id: Math.random().toString(36).substr(2, 9),
        joinedAt: new Date().toISOString(),
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-rose-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-rose-500" />
            <span className="text-2xl font-bold gradient-text">Carelink</span>
          </div>
         
        </div>
      </header>
      <div className="max-w-md mx-auto py-10 px-4">
        <div
          className={`transition-all duration-700 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${shake ? 'animate-shake' : ''}`}
        >
          <Card className={`shadow-2xl rounded-xl border border-gray-200 bg-white overflow-hidden ${successPulse ? 'animate-pulse' : ''}`}> 
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-2">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Place login form here */}
              {!linkSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      ref={inputRef}
                      className={`transition-all duration-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 border-2 ${emailError ? 'border-red-400' : 'border-gray-200'} ${shake ? 'animate-shake' : ''}`}
                    />
                    {emailError && (
                      <p className="text-xs text-red-500 mt-1 animate-fade-in">{emailError}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleSendLink}
                    disabled={!email || !!emailError || isLoading}
                    className={`w-full mt-4 transition-all duration-150 ease-in-out active:scale-95 focus:ring-2 focus:ring-rose-200 focus:outline-none ${isLoading ? 'cursor-wait' : ''}`}
                    style={{ boxShadow: isLoading ? '0 0 0 2px #f43f5e33' : undefined }}
                  >
                    {isLoading ? (
                      <>
                        <Mail className="h-4 w-4 mr-2 animate-spin" />
                        Sending Link...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Login Link
                      </>
                    )}
                  </Button>
                  {/* Progress bar */}
                  {showProgress && (
                    <div className="w-full h-1 bg-rose-100 rounded mt-3 overflow-hidden">
                      <div
                        className="h-full bg-rose-400 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className={`h-12 w-12 text-green-500 transition-all duration-500 ${successPulse ? 'scale-110' : ''}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">Check Your Email</h3>
                    <p className="text-sm text-muted-foreground mt-1">We've sent a secure login link to {email}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg animate-fade-in">
                    <p className="text-xs text-blue-700">
                      For demo purposes, you'll be automatically logged in in a few seconds...
                    </p>
                  </div>
                </div>
              )}
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
      `}</style>
    </div>
  )
}
