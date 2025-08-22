"use client"

import React from "react"
import { cn } from "../../../lib/utils"
import { Check, Minus } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate, label, id, ...props }, ref) => {
    const checkboxId = React.useId()
    const resolvedId = id || checkboxId

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input type="checkbox" ref={ref} id={resolvedId} className="sr-only" {...props} />
          <div
            className={cn(
              "h-4 w-4 rounded border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              (props.checked || indeterminate) && "bg-primary border-primary text-primary-foreground",
              className,
            )}
            onClick={() => {
              const input = document.getElementById(resolvedId) as HTMLInputElement
              input?.click()
            }}
          >
            {props.checked && !indeterminate && (
              <Check className="h-3 w-3 text-primary-foreground absolute top-0.5 left-0.5" />
            )}
            {indeterminate && <Minus className="h-3 w-3 text-primary-foreground absolute top-0.5 left-0.5" />}
          </div>
        </div>
        {label && (
          <label
            htmlFor={resolvedId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    )
  },
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
