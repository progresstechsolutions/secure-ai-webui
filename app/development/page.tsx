"use client"

import { Navigation } from "@/components/navigation"
import { Zap, Target, Calendar, TrendingUp, Baby, Heart, User, MessageCircle, Smile, Puzzle, Shirt, Info, ChevronDown, ToggleLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DevelopmentPage() {
  const [activeTab, setActiveTab] = useState<'domains' | 'overview' | 'reports' | 'ideas-library'>('domains')
  const [useDevelopmentalLevel, setUseDevelopmentalLevel] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Growth & Milestones</h1>
                  <p className="text-lg text-muted-foreground">Track observed skills across domains at your child's pace</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Suggest next skills (AI)
                </Button>
                <Button variant="outline" size="sm">
                  Generate Milestone Report
                </Button>
                <Button size="sm" className="bg-blue-800 hover:bg-blue-900">
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('domains')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'domains' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Domains
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'reports' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() => setActiveTab('ideas-library')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'ideas-library' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Ideas Library
              </button>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Age:</span>
                <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm">
                  6 months
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Use developmental level instead:</span>
                <button 
                  onClick={() => setUseDevelopmentalLevel(!useDevelopmentalLevel)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    useDevelopmentalLevel ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    useDevelopmentalLevel ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Time scope:</span>
                <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm">
                  30 days
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Motor</h3>
                  <p className="text-sm text-gray-600">Gross & Fine</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">8/12</span>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">67%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Observed 8 of 12 suggested skills</p>
                <p className="text-xs text-gray-500">Last new skill: Rolls both ways on 2024-03-15</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">Open</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Communication</h3>
                  <p className="text-sm text-gray-600">Expressive & Receptive</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">5/10</span>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">50%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Observed 5 of 10 suggested skills</p>
                <p className="text-xs text-gray-500">Last new skill: Uses 3 words on 2024-03-12</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">Open</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Smile className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Social-Emotional</h3>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">6/8</span>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">75%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Observed 6 of 8 suggested skills</p>
                <p className="text-xs text-gray-500">Last new skill: Social smile on 2024-03-10</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">Open</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Puzzle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cognitive/Play</h3>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">4/9</span>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">44%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Observed 4 of 9 suggested skills</p>
                <p className="text-xs text-gray-500">Last new skill: Bangs objects together on 2024-03-08</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">Open</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shirt className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Adaptive/Self-Help</h3>
                  <p className="text-sm text-gray-600">feeding, dressing, toileting</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-800">3/7</span>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">43%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Observed 3 of 7 suggested skills</p>
                <p className="text-xs text-gray-500">Last new skill: Finger feeds on 2024-03-05</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">Open</Button>
            </div>

            {/* Care Ideas Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Care Ideas</h3>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Coming in Phase 5B</p>
                <p className="text-xs text-gray-500">Personalized care recommendations and strategies</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/50 rounded-lg p-6 lg:p-8 text-center mb-12">
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">Support your child's development journey</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join families worldwide who trust Caregene to track and support their child's unique developmental path
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signin">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>

          {/* Recent Milestone Entries */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent milestone entries</h2>
              <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all</Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Rolls both ways</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Observed</span>
                      <span className="text-sm text-gray-500">2024-03-15 • Home</span>
                    </div>
                  </div>
                </div>
                <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</Link>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Uses 3 words</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Observed</span>
                      <span className="text-sm text-gray-500">2024-03-12 • Therapy</span>
                    </div>
                  </div>
                </div>
                <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</Link>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Smile className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Social smile</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Emerging</span>
                      <span className="text-sm text-gray-500">2024-03-10 • Home</span>
                    </div>
                  </div>
                </div>
                <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">View</Link>
              </div>
            </div>
          </div>

          {/* Tracking Information and Settings */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-gray-500 text-sm">CareGene • Growth & Development Tracking</span>
            <Link href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Milestone settings</Link>
          </div>

          {/* Progress Timeline */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Progress Timeline</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Time scope:</span>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md">30 days</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200">90 days</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200">Custom</button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <div className="flex space-x-1">
                    <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-md">By date</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200">By subdomain</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No progress data available for this domain.</p>
            </div>
          </div>

          {/* New Skills Added */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">New skills added</h2>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No new skills in the selected time period.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
