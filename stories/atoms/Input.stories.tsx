import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "@/components/atoms/Input/Input"
import { Search, User, Mail, Lock } from "lucide-react"

const meta: Meta<typeof Input> = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A flexible input component with support for icons, error states, and full accessibility.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url"],
      description: "The input type",
    },
    error: {
      control: "boolean",
      description: "Shows error state styling",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Search..." leftIcon={<Search className="h-4 w-4" />} />
      <Input placeholder="Username" leftIcon={<User className="h-4 w-4" />} />
      <Input placeholder="Email" type="email" leftIcon={<Mail className="h-4 w-4" />} />
      <Input placeholder="Password" type="password" leftIcon={<Lock className="h-4 w-4" />} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input placeholder="Normal state" />
      <Input placeholder="Error state" error />
      <Input placeholder="Disabled state" disabled />
      <Input placeholder="With value" defaultValue="Sample text" />
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input type="text" placeholder="Text input" />
      <Input type="email" placeholder="Email input" />
      <Input type="password" placeholder="Password input" />
      <Input type="search" placeholder="Search input" />
      <Input type="tel" placeholder="Phone input" />
      <Input type="url" placeholder="URL input" />
    </div>
  ),
}
