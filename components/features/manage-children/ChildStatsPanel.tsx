"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { FileText, Users, Activity, X } from "lucide-react"
import { cn } from "../../../lib/utils"

interface ChildStats {
  totalDocuments: number
}

interface Child {
  id: string
  name: string
  age: number
  avatar?: string
  stats?: ChildStats
}

interface ChildStatsPanelProps {
  children: Child[]
}

export function ChildStatsPanel({ children }: ChildStatsPanelProps) {
  // Calculate total statistics
  const totalStats = children.reduce(
    (acc, child) => ({
      totalDocuments: acc.totalDocuments + (child.stats?.totalDocuments || 0),
    }),
    { totalDocuments: 0 },
  )

  // Find most active child
  const mostActiveChild = children.reduce((most, child) => {
    const childTotal = (child.stats?.totalDocuments || 0)
    const mostTotal = (most.stats?.totalDocuments || 0)
    return childTotal > mostTotal ? child : most
  }, children[0])

  // Calculate average documents per child
  const avgDocumentsPerChild = children.length > 0 ? totalStats.totalDocuments / children.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Child Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Children */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{children.length}</div>
            <div className="text-sm text-muted-foreground">Children</div>
          </div>

          {/* Total Documents */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{totalStats.totalDocuments}</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </div>

          {/* Average Documents */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{avgDocumentsPerChild.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg per Child</div>
          </div>

          {/* Most Active Child */}
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-lg font-bold text-foreground truncate">{mostActiveChild?.name || "None"}</div>
            <div className="text-sm text-muted-foreground">Most Active</div>
          </div>
        </div>

        {/* Child Breakdown */}
        <div className="mt-8">
          <h4 className="font-semibold mb-4">Document Distribution</h4>
          <div className="space-y-3">
            {children.map((child) => {
              const documentCount = child.stats?.totalDocuments || 0
              const percentage = totalStats.totalDocuments > 0 ? (documentCount / totalStats.totalDocuments) * 100 : 0
              
              return (
                <div key={child.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={child.avatar} alt={child.name} />
                    <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{child.name}</span>
                      <span className="text-sm text-muted-foreground">{documentCount} docs</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{children.length}</div>
            <div className="text-sm text-muted-foreground">Total Children</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{totalStats.totalDocuments}</div>
            <div className="text-sm text-muted-foreground">Total Documents</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{avgDocumentsPerChild.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Documents</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
