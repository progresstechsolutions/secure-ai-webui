import React from "react"
import { Input, type InputProps } from "@/components/atoms/Input/Input"
import { cn } from "@/lib/utils"

export interface LabeledInputProps extends InputProps {
  label: string
  description?: string
  errorMessage?: string
  required?: boolean
}

const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, description, errorMessage, required, className, id, ...props }, ref) => {
    const inputId = React.useId()
    const descriptionId = description ? `${inputId}-description` : undefined
    const errorId = errorMessage ? `${inputId}-error` : undefined

    return (
      <div className={cn("space-y-2", className)}>
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        <Input
          ref={ref}
          id={inputId}
          error={!!errorMessage}
          aria-describedby={cn(descriptionId, errorId)}
          aria-invalid={!!errorMessage}
          {...props}
        />
        {errorMessage && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    )
  },
)
LabeledInput.displayName = "LabeledInput"

export { LabeledInput }
