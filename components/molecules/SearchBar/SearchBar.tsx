"use client"

import React from "react"
import { Input } from "../../atoms/Input/Input"
import { Button } from "../../atoms/Button/Button"
import { Search, X } from "lucide-react"
import { cn } from "../../../lib/utils"

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void
  showClearButton?: boolean
  onSearch?: (value: string) => void
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, showClearButton = true, onSearch, value, onChange, ...props }, ref) => {
    const handleClear = () => {
      onClear?.()
      onSearch?.("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        onSearch?.(e.currentTarget.value)
      }
    }

    return (
      <div className={cn("relative flex items-center", className)}>
        <Input
          ref={ref}
          type="search"
          leftIcon={<Search className="h-4 w-4" />}
          rightIcon={
            showClearButton && value ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-transparent"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </Button>
            ) : undefined
          }
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </div>
    )
  },
)
SearchBar.displayName = "SearchBar"

export { SearchBar }
