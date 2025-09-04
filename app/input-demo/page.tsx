"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input-branded"
import { Search, Mail, Lock, User, Phone, CreditCard } from "lucide-react"

export default function InputDemoPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")

  return (
    <div className="container mx-auto max-w-4xl p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Input Component Demo</h1>
        <p className="text-muted-foreground">Comprehensive input component following Caregene brand tokens</p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Basic Variants</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Input variant="outlined" label="Outlined" placeholder="Default variant" />
          <Input variant="filled" label="Filled" placeholder="Filled background" />
          <Input variant="ghost" label="Ghost" placeholder="Minimal styling" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <div className="space-y-4">
          <Input inputSize="sm" label="Small" placeholder="Small input" />
          <Input inputSize="md" label="Medium" placeholder="Default size" />
          <Input inputSize="lg" label="Large" placeholder="Large input" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">States</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Default" placeholder="Normal state" />
          <Input label="Disabled" placeholder="Cannot interact" disabled />
          <Input label="Loading" placeholder="Processing..." isLoading />
          <Input label="Read Only" value="Read only value" readOnly />
          <Input label="Error State" placeholder="Invalid input" error="This field is required" />
          <Input label="Success State" placeholder="Valid input" success="Email format is correct" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">With Icons & Actions</h2>
        <div className="space-y-4">
          <Input
            label="Search Users"
            placeholder="Type to search..."
            leadingIcon={<Search className="h-4 w-4" />}
            onClear={() => {}}
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            leadingIcon={<Mail className="h-4 w-4" />}
            onClear={() => setEmail("")}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter secure password"
            leadingIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Prefix & Suffix</h2>
        <div className="space-y-4">
          <Input label="Website URL" placeholder="mysite" prefix="https://" suffix=".com" />
          <Input label="Phone Number" placeholder="555-0123" prefix="+1" leadingIcon={<Phone className="h-4 w-4" />} />
          <Input label="Price" placeholder="0.00" prefix="$" suffix="USD" type="number" />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Character Counter</h2>
        <Input
          label="Bio"
          placeholder="Tell us about yourself..."
          description="Brief description for your profile (max 160 characters)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          counter
          maxLength={160}
          leadingIcon={<User className="h-4 w-4" />}
        />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Form Example</h2>
        <div className="max-w-md space-y-4 p-6 border rounded-lg">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            required
            leadingIcon={<User className="h-4 w-4" />}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            required
            leadingIcon={<Mail className="h-4 w-4" />}
          />
          <Input
            label="Credit Card"
            placeholder="1234 5678 9012 3456"
            leadingIcon={<CreditCard className="h-4 w-4" />}
            description="We'll never store your card details"
          />
          <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
            Submit Form
          </button>
        </div>
      </section>
    </div>
  )
}
