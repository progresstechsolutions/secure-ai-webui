"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles, Brain, Zap, Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const models = [
  {
    id: "rare-gene",
    name: "Rare gene LLM",
    description: "Specialized for rare diseases and genetic conditions",
    icon: Sparkles,
    isPro: false,
    isDefault: true,
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Advanced reasoning and analysis",
    icon: Brain,
    isPro: true,
  },
  {
    id: "claude-3",
    name: "Claude 3",
    description: "Thoughtful and nuanced responses",
    icon: Zap,
    isPro: true,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Google's most capable model",
    icon: Globe,
    isPro: true,
  },
]

interface ModelSelectorProps {
  isSignedIn?: boolean
}

export function ModelSelector({ isSignedIn = false }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState(models[0])

  const availableModels = isSignedIn ? models : models.filter((m) => !m.isPro)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 px-3 text-sm font-medium text-muted-foreground hover:text-foreground">
          <selectedModel.icon className="h-4 w-4 mr-2" />
          {selectedModel.name}
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {availableModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setSelectedModel(model)}
            className="flex items-start gap-3 p-3"
          >
            <model.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{model.name}</span>
                {model.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Default</span>
                )}
                {model.isPro && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Pro</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
            </div>
          </DropdownMenuItem>
        ))}

        {!isSignedIn && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-2">Sign in to access more models</p>
              <Button size="sm" className="w-full">
                Sign in
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
