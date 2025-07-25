"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { User, Mail, Lock } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onNewUser: () => void
}

export function LoginScreen({ onLogin, onNewUser }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Simple validation
    if (!formData.email) {
      setError("Please fill in all required fields")
      return
    }

    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
    const existingUser = existingUsers.find((user: any) => 
      user.username.toLowerCase() === formData.username.toLowerCase() || 
      user.email.toLowerCase() === formData.email.toLowerCase()
    )

    if (existingUser) {
      // User exists - verify password (in real app, this would be hashed)
      if (formData.password === existingUser.password) {
        // Successful login - restore their data
        onLogin(existingUser)
      } else {
        setError("Invalid password")
      }
    } else {
      // User doesn't exist
      setError("Account not found. Please click 'Start here' to create a new account.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-blue-100 mt-2">Sign in to your account</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
             

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={onNewUser}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create Account
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
