import type { Meta, StoryObj } from "@storybook/react"
import { DocumentViewer } from "@/components/features/document-viewer/DocumentViewer"
import type { Document } from "@/contexts/document-context"

const meta: Meta<typeof DocumentViewer> = {
  title: "Features/DocumentViewer",
  component: DocumentViewer,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockDocument: Document = {
  id: "story-doc-1",
  name: "Sample Document.pdf",
  type: "application/pdf",
  size: 1024 * 1024, // 1MB
  uploadDate: new Date(),
  category: "other",
  tags: ["sample", "test"],
  childId: "child-1",
  url: "/placeholder.svg?height=800&width=600&text=Sample+Document",
  content: "This is a sample document content for the storybook story.",
  aiSummary: "This is a sample document with test content for demonstrating the document viewer functionality in Storybook.",
  keyHighlights: ["Sample content", "Test document", "Storybook demonstration"],
}

export const Default: Story = {
  args: {
    document: mockDocument,
    isOpen: true,
    onClose: () => console.log("Document viewer closed"),
  },
}

export const Closed: Story = {
  args: {
    document: mockDocument,
    isOpen: false,
    onClose: () => console.log("Document viewer closed"),
  },
}
