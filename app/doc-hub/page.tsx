"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Search } from "lucide-react"
import PageWrapper from "@/components/page-wrapper"

export default function DocHubPage() {
  const [selectedChildId, setSelectedChildId] = useState<string>("")
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId)
  }

  useEffect(() => {
    const loadDocuments = () => {
      try {
        const allDocuments = JSON.parse(localStorage.getItem("caregene-documents") || "[]")
        const childDocuments = selectedChildId
          ? allDocuments.filter((doc: any) => doc.childId === selectedChildId)
          : allDocuments
        setDocuments(allDocuments)
        setFilteredDocuments(childDocuments)
      } catch (error) {
        console.error("Error loading documents:", error)
        setDocuments([])
        setFilteredDocuments([])
      }
    }

    loadDocuments()
  }, [selectedChildId])

  return (
    <PageWrapper selectedChildId={selectedChildId} onChildSelect={handleChildSelect}>
      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Hub</h1>
          <p className="text-gray-600">Manage and organize all your child's health documents</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900">Upload Documents</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Add medical records, test results, and reports</p>
              <Button className="w-full">Upload Files</Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Generate Report</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Create comprehensive health summaries</p>
              <Button variant="outline" className="w-full bg-transparent">
                Create Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Search className="h-5 w-5 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-900">Search Documents</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Find specific documents quickly</p>
              <Button variant="outline" className="w-full bg-transparent">
                Search
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Document Categories */}
        <Card className="border-gray-200 shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
            <CardDescription>
              {selectedChildId ? "Documents for selected child" : "All documents"} organized by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Medical Records",
                  count: filteredDocuments.filter((d) => d.category === "medical").length,
                  color: "bg-blue-100 text-blue-800",
                },
                {
                  name: "Test Results",
                  count: filteredDocuments.filter((d) => d.category === "tests").length,
                  color: "bg-green-100 text-green-800",
                },
                {
                  name: "Prescriptions",
                  count: filteredDocuments.filter((d) => d.category === "prescriptions").length,
                  color: "bg-purple-100 text-purple-800",
                },
                {
                  name: "Insurance",
                  count: filteredDocuments.filter((d) => d.category === "insurance").length,
                  color: "bg-orange-100 text-orange-800",
                },
              ].map((category) => (
                <div
                  key={category.name}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <Badge className={category.color}>{category.count}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">View all documents</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
