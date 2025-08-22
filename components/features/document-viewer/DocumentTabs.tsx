"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { RawDocumentView } from "./RawDocumentView"
import { AISummaryView } from "./AISummaryView"
import { KeyHighlightsView } from "./KeyHighlightsView"
import type { Document } from "../../../contexts/document-context"

interface DocumentTabsProps {
  document: Document
  activeTab: "raw" | "summary" | "highlights"
  setActiveTab: (tab: "raw" | "summary" | "highlights") => void
  zoomLevel: number
  fontSize: number
}

export function DocumentTabs({ document, activeTab, setActiveTab, zoomLevel, fontSize }: DocumentTabsProps) {
  return (
    <div className="flex-1 h-full min-h-0 flex flex-col overflow-y-auto">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "raw" | "summary" | "highlights")}
        className="h-full flex flex-col min-h-0"
      >
        <TabsList className="grid w-full grid-cols-3 mx-6">
          <TabsTrigger value="raw">Document</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
          <TabsTrigger value="highlights">Key Points</TabsTrigger>
        </TabsList>

        <TabsContent value="raw" className="flex-1 min-h-0 overflow-y-auto m-0">
          <RawDocumentView document={document} zoomLevel={zoomLevel} fontSize={fontSize} />
        </TabsContent>

        <TabsContent value="summary" className="flex-1 min-h-0 overflow-y-auto m-0">
          <AISummaryView document={document} fontSize={fontSize} />
        </TabsContent>

        <TabsContent value="highlights" className="flex-1 min-h-0 overflow-y-auto m-0">
          <KeyHighlightsView document={document} fontSize={fontSize} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
