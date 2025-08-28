"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dna, BarChart3, ShoppingCart, Pill, Lightbulb, Zap, Moon, Smile, Frown, Brain, Heart, AlertTriangle, Activity, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function GeneticTrackerPage() {
  const [selectedLogType, setSelectedLogType] = useState<'symptom' | 'nutrition' | 'medication'>('symptom')
  const [activeTab, setActiveTab] = useState<'quick-log' | 'journal'>('quick-log')

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="ml-12 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              ← Back to home
            </Link>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Dna className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Log & Track</h1>
                  <p className="text-lg text-muted-foreground">
                    Capture today's care in seconds
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant={activeTab === 'quick-log' ? 'default' : 'outline'} size="sm">
                  Quick Log
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('quick-log')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'quick-log' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Quick Log
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'journal' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Journal
              </button>
            </div>
          </div>

          {/* What would you like to log section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-6">What would you like to log?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card 
                className={`cursor-pointer transition-all h-48 ${
                  selectedLogType === 'symptom' 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => setSelectedLogType('symptom')}
              >
                <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                    selectedLogType === 'symptom' ? 'bg-pink-500' : 'bg-gray-100'
                  }`}>
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Symptom</h3>
                  <p className="text-gray-600">Log symptoms and severity</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all h-48 ${
                  selectedLogType === 'nutrition' 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => setSelectedLogType('nutrition')}
              >
                <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                    selectedLogType === 'nutrition' ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    <ShoppingCart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Nutrition</h3>
                  <p className="text-gray-600">Track meals and food intake</p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all h-48 ${
                  selectedLogType === 'medication' 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => setSelectedLogType('medication')}
              >
                <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className={`w-16 h-16 rounded-xl mb-4 flex items-center justify-center ${
                    selectedLogType === 'medication' ? 'bg-blue-500' : 'bg-blue-100'
                  }`}>
                    <Pill className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Medication</h3>
                  <p className="text-gray-600">Record medication taken</p>
                </CardContent>
              </Card>
            </div>

            <Button className="w-full sm:w-auto">
              <Lightbulb className="h-4 w-4 mr-2" />
              Use AI to fill fields
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
              <span className="text-sm font-medium">Select Type</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">2</div>
              <span className="text-sm text-muted-foreground">Choose Details</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">3</div>
              <span className="text-sm text-muted-foreground">Submit</span>
            </div>
          </div>

          {/* Symptom Type Selection */}
          {selectedLogType === 'symptom' && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Choose Symptom Type</h2>
                <Link href="#" className="text-sm text-primary hover:underline">Manage</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Seizure</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Moon className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Sleep</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Smile className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">GI</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Frown className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Pain/Discomfort</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Brain className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Sensory/Autonomic</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Heart className="h-6 w-6 text-pink-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Respiratory/ENT</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Behavior Episode</h3>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-medium text-sm">Motor</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Emergency Information Banner */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800">
                  If you're concerned about safety, contact your clinician or local emergency services.
                </p>
                <Link href="#" className="text-sm text-yellow-700 underline hover:text-yellow-800">
                  View emergency info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


