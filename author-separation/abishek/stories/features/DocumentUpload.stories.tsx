"use client"

import type { Meta, StoryObj } from "@storybook/react"
import DocumentUpload from "@/components/features/upload/DocumentUpload"
import { AuthProvider } from "@/contexts/auth-context"
import { ChildProfileProvider } from "@/contexts/child-profile-context"
import { DocumentProvider } from "@/contexts/document-context"

const meta: Meta<typeof DocumentUpload> = {
  title: "Features/DocumentUpload",
  component: DocumentUpload,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <ChildProfileProvider>
          <DocumentProvider>
            <Story />
          </DocumentProvider>
        </ChildProfileProvider>
      </AuthProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Upload modal closed"),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Upload modal closed"),
  },
}
