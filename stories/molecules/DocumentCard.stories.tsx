import type { Meta, StoryObj } from "@storybook/react"
import { DocumentCard } from "@/components/molecules/DocumentCard/DocumentCard"

const meta: Meta<typeof DocumentCard> = {
  title: "Molecules/DocumentCard",
  component: DocumentCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A card component for displaying document information with actions and metadata.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    compact: {
      control: "boolean",
      description: "Renders a more compact version of the card",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleDocument = {
  id: "1",
  name: "Annual Checkup Report 2024.pdf",
  type: "application/pdf",
  size: 2048000,
  uploadDate: new Date("2024-01-15"),
  category: "visit-summary",
  tags: ["annual", "checkup", "2024", "pediatric"],
}

export const Default: Story = {
  args: {
    document: sampleDocument,
    onView: (id) => console.log("View:", id),
    onDownload: (id) => console.log("Download:", id),
    onMore: (id) => console.log("More:", id),
  },
}

export const Compact: Story = {
  args: {
    document: sampleDocument,
    compact: true,
    onView: (id) => console.log("View:", id),
    onDownload: (id) => console.log("Download:", id),
    onMore: (id) => console.log("More:", id),
  },
}

export const DifferentCategories: Story = {
  render: () => {
    const documents = [
      {
        ...sampleDocument,
        id: "1",
        name: "Vaccination Record.pdf",
        category: "vaccination",
        tags: ["vaccination", "immunization"],
      },
      {
        ...sampleDocument,
        id: "2",
        name: "Blood Test Results.pdf",
        category: "lab-result",
        tags: ["blood", "lab", "results"],
      },
      {
        ...sampleDocument,
        id: "3",
        name: "Prescription - Antibiotics.pdf",
        category: "prescription",
        tags: ["prescription", "antibiotics"],
      },
    ]

    return (
      <div className="grid gap-4 w-96">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onView={(id) => console.log("View:", id)}
            onDownload={(id) => console.log("Download:", id)}
            onMore={(id) => console.log("More:", id)}
          />
        ))}
      </div>
    )
  },
}
