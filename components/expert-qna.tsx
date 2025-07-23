"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, MessageCircle, Plus, User, Clock, CheckCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ExpertQnAProps {
  onBack: () => void
}

const mockQuestions = [
  {
    id: "q1",
    question: "What are the latest advancements in gene therapy for Spinal Muscular Atrophy (SMA)?",
    details: "I'm looking for information on recent breakthroughs and clinical trials for SMA gene therapy.",
    askedBy: "SMAFamily",
    timestamp: "2 hours ago",
    status: "answered",
    expert: "Dr. Anya Sharma (Geneticist)",
    answer:
      "Recent advancements in SMA gene therapy include FDA-approved treatments like Zolgensma, Spinraza, and Evrysdi. Zolgensma is a one-time gene therapy for SMA Type 1, delivering a functional copy of the SMN1 gene. Spinraza and Evrysdi are antisense oligonucleotide therapies that increase SMN protein production. Clinical trials are ongoing for new delivery methods and combination therapies. It's crucial to discuss these options with your neurologist to determine the best course for your specific situation.",
    tags: ["SMA", "gene therapy", "treatment", "research"],
    community: "sma-support",
  },
  {
    id: "q2",
    question: "How can I best support my child with Angelman Syndrome in developing communication skills?",
    details:
      "My child is 5 and has Angelman Syndrome. We're struggling with communication. Any strategies or resources?",
    askedBy: "AngelMom",
    timestamp: "5 hours ago",
    status: "pending",
    expert: null,
    answer: null,
    tags: ["Angelman Syndrome", "communication", "therapy", "parenting"],
    community: "angelman-support",
  },
  {
    id: "q3",
    question: "What are the dietary considerations for managing Maple Syrup Urine Disease (MSUD) in adults?",
    details:
      "As an adult with MSUD, I find it challenging to maintain the strict diet. Are there new approaches or resources for adults?",
    askedBy: "MSUDAdult",
    timestamp: "1 day ago",
    status: "answered",
    expert: "Dr. Emily Chen (Metabolic Dietitian)",
    answer:
      "Managing MSUD in adulthood requires lifelong adherence to a low-leucine diet. New approaches include specialized medical foods and formulas designed for adults, and some research is exploring enzyme replacement therapies, though these are not yet standard. Regular monitoring of amino acid levels is crucial. Connecting with a metabolic dietitian specializing in MSUD can provide personalized guidance and support for meal planning and managing dietary challenges.",
    tags: ["MSUD", "diet", "adults", "nutrition"],
    community: "msud-support",
  },
  {
    id: "q4",
    question: "What are the early signs of Batten Disease and how is it typically diagnosed?",
    details: "I'm concerned about some symptoms my child is showing and want to understand more about Batten Disease.",
    askedBy: "WorriedParent",
    timestamp: "2 days ago",
    status: "pending",
    expert: null,
    answer: null,
    tags: ["Batten Disease", "symptoms", "diagnosis", "early signs"],
    community: "batten-disease-support",
  },
  {
    id: "q5",
    question: "Are there any new non-invasive diagnostic methods for Phenylketonuria (PKU)?",
    details: "My newborn screening was positive for PKU, and I'm curious about less invasive follow-up tests.",
    askedBy: "PKUNewMom",
    timestamp: "3 days ago",
    status: "answered",
    expert: "Dr. David Lee (Pediatric Geneticist)",
    answer:
      "Newborn screening for PKU is highly effective. While blood tests remain the gold standard for confirmation and ongoing monitoring, research is exploring non-invasive methods like dried urine spot analysis and breath tests for phenylalanine levels. However, these are mostly in research phases and not yet widely adopted for primary diagnosis or management. Always follow up with your metabolic specialist for definitive diagnosis and treatment plans.",
    tags: ["PKU", "diagnosis", "newborn screening", "genetic testing"],
    community: "pku-support",
  },
  {
    id: "q6",
    question: "What are the best practices for managing chronic pain in Sickle Cell Anemia?",
    details: "Dealing with frequent pain crises. Looking for expert advice on pain management strategies.",
    askedBy: "SickleCellStrong",
    timestamp: "4 days ago",
    status: "answered",
    expert: "Dr. Olivia Green (Hematologist)",
    answer:
      "Chronic pain management for Sickle Cell Anemia often involves a multi-modal approach. This includes regular use of prescribed analgesics (opioid and non-opioid), NSAIDs, and sometimes nerve blocks or neuromodulation. Non-pharmacological strategies like physical therapy, acupuncture, mindfulness, and cognitive behavioral therapy can also be very effective. Hydration, warmth, and avoiding triggers are crucial. A comprehensive pain management plan should be developed with your hematologist and a pain specialist.",
    tags: ["Sickle Cell Anemia", "pain management", "chronic pain", "coping"],
    community: "sickle-cell-anemia-support",
  },
  {
    id: "q7",
    question: "What are the long-term neurological impacts of Huntington's Disease and how are they managed?",
    details:
      "My family has a history of Huntington's, and I want to understand the progression and management of neurological symptoms.",
    askedBy: "HDConcerned",
    timestamp: "5 days ago",
    status: "pending",
    expert: null,
    answer: null,
    tags: ["Huntington's Disease", "neurology", "symptoms", "management"],
    community: "huntingtons-disease-support",
  },
]

export function ExpertQnA({ onBack }: ExpertQnAProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCommunity, setFilterCommunity] = useState("all")
  const [showAskModal, setShowAskModal] = useState(false)
  const [newQuestionTitle, setNewQuestionTitle] = useState("")
  const [newQuestionDetails, setNewQuestionDetails] = useState("")
  const [newQuestionCommunity, setNewQuestionCommunity] = useState("")
  const [newQuestionTags, setNewQuestionTags] = useState<string[]>([])

  const filteredQuestions = mockQuestions.filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === "all" || q.status === filterStatus
    const matchesCommunity = filterCommunity === "all" || q.community === filterCommunity
    return matchesSearch && matchesStatus && matchesCommunity
  })

  const uniqueCommunities = Array.from(new Set(mockQuestions.map((q) => q.community)))
  const availableTags = Array.from(new Set(mockQuestions.flatMap((q) => q.tags)))

  const handleAskQuestion = () => {
    if (newQuestionTitle.trim() && newQuestionDetails.trim() && newQuestionCommunity) {
      const newQ = {
        id: `q${Date.now()}`,
        question: newQuestionTitle.trim(),
        details: newQuestionDetails.trim(),
        askedBy: "Current User", // Replace with actual user
        timestamp: "just now",
        status: "pending",
        expert: null,
        answer: null,
        tags: newQuestionTags,
        community: newQuestionCommunity,
      }
      mockQuestions.unshift(newQ) // Add to the beginning of mock data
      setShowAskModal(false)
      setNewQuestionTitle("")
      setNewQuestionDetails("")
      setNewQuestionCommunity("")
      setNewQuestionTags([])
    } else {
      alert("Please fill in all required fields.")
    }
  }

  const handleTagToggle = (tag: string) => {
    setNewQuestionTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold gradient-text">Expert Q&A</h1>
            </div>
            <Button
              onClick={() => setShowAskModal(true)}
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <Card className="shadow-md rounded-lg">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="filter-status" className="text-sm">
                  Status
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter-status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="answered">Answered</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-community" className="text-sm">
                  Community
                </Label>
                <Select value={filterCommunity} onValueChange={setFilterCommunity}>
                  <SelectTrigger id="filter-community">
                    <SelectValue placeholder="All Communities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Communities</SelectItem>
                    {uniqueCommunities.map((community) => (
                      <SelectItem key={community} value={community}>
                        {community.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question List */}
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" /> All Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No questions found matching your criteria.</p>
            ) : (
              filteredQuestions.map((q) => (
                <div key={q.id} className="border p-4 rounded-lg shadow-sm bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg">{q.question}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <User className="h-3 w-3" />
                        <span>{q.askedBy}</span>
                        <Clock className="h-3 w-3" />
                        <span>{q.timestamp}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge
                          variant={
                            q.status === "answered" ? "success" : q.status === "pending" ? "default" : "secondary"
                          }
                        >
                          {q.status}
                        </Badge>
                        <Badge variant="outline">{q.community}</Badge>
                        {q.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">{q.details}</p>
                  {q.answer && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
                      <div className="flex items-center space-x-2 text-sm font-medium text-blue-700 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Answer from {q.expert}</span>
                      </div>
                      <p className="text-sm text-gray-800">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="gradient-text">Ask an Expert</CardTitle>
              <CardContent className="p-0 pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question-title">Question Title</Label>
                    <Input
                      id="question-title"
                      placeholder="Summarize your question"
                      value={newQuestionTitle}
                      onChange={(e) => setNewQuestionTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-details">Details</Label>
                    <Textarea
                      id="question-details"
                      placeholder="Provide more context for your question"
                      value={newQuestionDetails}
                      onChange={(e) => setNewQuestionDetails(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="question-community">Community (Optional)</Label>
                    <Select value={newQuestionCommunity} onValueChange={setNewQuestionCommunity}>
                      <SelectTrigger id="question-community">
                        <SelectValue placeholder="Select relevant community" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueCommunities.map((community) => (
                          <SelectItem key={community} value={community}>
                            {community.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                        <SelectItem value="general-genetic-conditions">General Genetic Conditions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (Optional)</Label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border p-2 rounded-md">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={newQuestionTags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer ${newQuestionTags.includes(tag) ? "bg-rose-500 text-white" : "hover:bg-gray-100"}`}
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAskModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAskQuestion}>Submit Question</Button>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  )
}
