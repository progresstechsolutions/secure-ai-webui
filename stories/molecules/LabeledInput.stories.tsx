import type { Meta, StoryObj } from "@storybook/react"
import { LabeledInput } from "@/components/molecules/LabeledInput/LabeledInput"
import { Mail, User } from "lucide-react"

const meta: Meta<typeof LabeledInput> = {
  title: "Molecules/LabeledInput",
  component: LabeledInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A labeled input component that combines Input with proper labeling, descriptions, and error handling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
      description: "Shows required indicator",
    },
    error: {
      control: "boolean",
      description: "Shows error state",
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
}

export const WithDescription: Story = {
  args: {
    label: "Username",
    description: "Choose a unique username for your account",
    placeholder: "Enter username",
    leftIcon: <User className="h-4 w-4" />,
  },
}

export const Required: Story = {
  args: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
    required: true,
    leftIcon: <Mail className="h-4 w-4" />,
  },
}

export const WithError: Story = {
  args: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
    required: true,
    errorMessage: "Please enter a valid email address",
    defaultValue: "invalid-email",
    leftIcon: <Mail className="h-4 w-4" />,
  },
}

export const FormExample: Story = {
  render: () => (
    <form className="space-y-6 w-96">
      <LabeledInput
        label="Full Name"
        placeholder="Enter your full name"
        required
        leftIcon={<User className="h-4 w-4" />}
      />
      <LabeledInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        description="We'll never share your email with anyone else"
        required
        leftIcon={<Mail className="h-4 w-4" />}
      />
      <LabeledInput
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        description="Optional - for account recovery"
      />
    </form>
  ),
}
