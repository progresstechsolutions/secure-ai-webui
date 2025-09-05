"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { ManageChildren } from "@/components/features/manage-children/ManageChildren"
import { useState } from "react"
import type { Child } from "@/contexts/child-profile-context"

const meta: Meta<typeof ManageChildren> = {
  title: "Features/ManageChildren",
  component: ManageChildren,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A comprehensive child management interface that allows parents to add, edit, delete, and manage access to their children's profiles. Features include medical information tracking, document statistics, and parent invitation system.",
      },
    },
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

const sampleChildren: Child[] = [
  {
    id: "child-1",
    name: "Emma Johnson",
    age: 8,
    dateOfBirth: "2016-03-15",
    avatar: "/placeholder.svg?height=40&width=40",
    allergies: ["Peanuts", "Shellfish"],
    conditions: ["Asthma"],
    medications: ["Inhaler"],
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      relationship: "Mother",
    },
    stats: {
      totalDocuments: 12,
      totalFolders: 3,
      lastActivity: new Date("2024-01-15"),
    },
    sharedWith: [
      {
        id: "share-1",
        email: "grandma@example.com",
        name: "Grandma Johnson",
        role: "read-only" as const,
        invitedAt: new Date("2024-01-10"),
      },
    ],
  },
  {
    id: "child-2",
    name: "Liam Johnson",
    age: 5,
    dateOfBirth: "2019-07-22",
    avatar: "/placeholder.svg?height=40&width=40",
    allergies: [],
    conditions: [],
    medications: [],
    stats: {
      totalDocuments: 8,
      totalFolders: 2,
      lastActivity: new Date("2024-01-12"),
    },
    sharedWith: [],
  },
]

export const Default: Story = {
  render: () => {
    const [children, setChildren] = useState(sampleChildren)
    const [activeChildId, setActiveChildId] = useState("child-1")

    return (
      <div className="p-6 bg-background min-h-screen">
        <ManageChildren
          children={children}
          activeChildId={activeChildId}
          onChildrenChange={setChildren}
          onActiveChildChange={setActiveChildId}
        />
      </div>
    )
  },
}

export const EmptyState: Story = {
  render: () => {
    const [children, setChildren] = useState<Child[]>([])
    const [activeChildId, setActiveChildId] = useState("")

    return (
      <div className="p-6 bg-background min-h-screen">
        <ManageChildren
          children={children}
          activeChildId={activeChildId}
          onChildrenChange={setChildren}
          onActiveChildChange={setActiveChildId}
        />
      </div>
    )
  },
}

export const SingleChild: Story = {
  render: () => {
    const [children, setChildren] = useState<Child[]>([sampleChildren[0]])
    const [activeChildId, setActiveChildId] = useState("child-1")

    return (
      <div className="p-6 bg-background min-h-screen">
        <ManageChildren
          children={children}
          activeChildId={activeChildId}
          onChildrenChange={setChildren}
          onActiveChildChange={setActiveChildId}
        />
      </div>
    )
  },
}

export const ManyChildren: Story = {
  render: () => {
    const manyChildren: Child[] = [
      ...sampleChildren,
      {
        id: "child-3",
        name: "Sophia Martinez",
        age: 12,
        dateOfBirth: "2012-09-08",
        allergies: ["Dairy", "Eggs"],
        conditions: ["Type 1 Diabetes"],
        medications: ["Insulin"],
        stats: {
          totalDocuments: 25,
          totalFolders: 5,
          lastActivity: new Date("2024-01-20"),
        },
        sharedWith: [
          {
            id: "share-2",
            email: "dad@example.com",
            name: "Dad Martinez",
            role: "admin" as const,
            invitedAt: new Date("2024-01-05"),
          },
        ],
      },
      {
        id: "child-4",
        name: "Oliver Chen",
        age: 3,
        dateOfBirth: "2021-11-30",
        allergies: ["Tree nuts"],
        conditions: [],
        medications: [],
        stats: {
          totalDocuments: 6,
          totalFolders: 1,
          lastActivity: new Date("2024-01-18"),
        },
        sharedWith: [],
      },
      {
        id: "child-5",
        name: "Ava Thompson",
        age: 15,
        dateOfBirth: "2009-04-12",
        allergies: [],
        conditions: ["ADHD"],
        medications: ["Adderall"],
        stats: {
          totalDocuments: 18,
          totalFolders: 4,
          lastActivity: new Date("2024-01-22"),
        },
        sharedWith: [
          {
            id: "share-3",
            email: "school@example.com",
            name: "School Nurse",
            role: "read-only" as const,
            invitedAt: new Date("2024-01-01"),
          },
          {
            id: "share-4",
            email: "therapist@example.com",
            name: "Dr. Smith",
            role: "read-only" as const,
            invitedAt: new Date("2024-01-08"),
          },
        ],
      },
    ]

    const [children, setChildren] = useState(manyChildren)
    const [activeChildId, setActiveChildId] = useState("child-1")

    return (
      <div className="p-6 bg-background min-h-screen">
        <ManageChildren
          children={children}
          activeChildId={activeChildId}
          onChildrenChange={setChildren}
          onActiveChildChange={setActiveChildId}
        />
      </div>
    )
  },
}

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  render: () => {
    const [children, setChildren] = useState(sampleChildren)
    const [activeChildId, setActiveChildId] = useState("child-1")

    return (
      <div className="p-4 bg-background min-h-screen">
        <ManageChildren
          children={children}
          activeChildId={activeChildId}
          onChildrenChange={setChildren}
          onActiveChildChange={setActiveChildId}
        />
      </div>
    )
  },
}

export const AccessibilityDemo: Story = {
  render: () => {
    const [children, setChildren] = useState(sampleChildren)
    const [activeChildId, setActiveChildId] = useState("child-1")

    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Accessibility Features</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use Tab to navigate between interactive elements</li>
            <li>• Press Enter or Space to activate buttons and cards</li>
            <li>• Use Escape to close modals</li>
            <li>• Screen reader announcements for all actions</li>
            <li>• High contrast focus indicators</li>
            <li>• Proper ARIA labels and roles</li>
          </ul>
        </div>
        <ManageChildren
          children={children}
          activeChildId={activeChildId}
          onChildrenChange={setChildren}
          onActiveChildChange={setActiveChildId}
        />
      </div>
    )
  },
}
