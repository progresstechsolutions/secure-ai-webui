"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, X, AlertCircle, CheckCircle2 } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  variant?: "outlined" | "filled" | "ghost"
  inputSize?: "sm" | "md" | "lg"
  error?: string
  success?: string
  isLoading?: boolean
  counter?: boolean
  maxLength?: number
  onClear?: () => void
  showPasswordToggle?: boolean
  srOnlyLabel?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      description,
      prefix,
      suffix,
      leadingIcon,
      trailingIcon,
      variant = "outlined",
      inputSize = "md",
      error,
      success,
      isLoading,
      counter,
      maxLength,
      onClear,
      showPasswordToggle,
      srOnlyLabel,
      disabled,
      required,
      id,
      value,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    const describedBy = [description && `${inputId}-desc`, (error || success) && `${inputId}-msg`]
      .filter(Boolean)
      .join(" ")

    const hasValue = value !== undefined ? String(value).length > 0 : false
    const currentLength = value ? String(value).length : 0
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    const handlePasswordToggle = () => {
      setShowPassword(!showPassword)
    }

    const handleClear = () => {
      onClear?.()
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-[0.875rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              "text-[hsl(var(--input-fg))]",
              srOnlyLabel && "sr-only",
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-[hsl(var(--input-destructive))]" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div
          className={cn(
            "group relative flex items-center transition-all duration-150 ease-out",
            "border bg-[hsl(var(--input-bg))] text-[hsl(var(--input-fg))]",

            // Variants
            variant === "outlined" && "border-[hsl(var(--input-border))]",
            variant === "filled" && "bg-[hsl(var(--input-muted))] border-transparent",
            variant === "ghost" && "border-transparent bg-transparent",

            // Sizes
            inputSize === "sm" && "h-9 rounded-[0.375rem] px-3 text-sm",
            inputSize === "md" && "h-10 rounded-[0.5rem] px-3.5",
            inputSize === "lg" && "h-11 rounded-[0.75rem] px-4 text-base",

            // States
            isFocused &&
              !disabled &&
              !error && [
                "ring-2 ring-[hsl(var(--input-ring))] border-[hsl(var(--input-primary))]",
                "shadow-[var(--shadow-focus)]",
              ],
            error && "border-[hsl(var(--input-destructive))] ring-2 ring-[hsl(var(--input-destructive))]",
            success && "border-[hsl(var(--input-success))] ring-2 ring-[hsl(var(--input-success))]",
            disabled && "opacity-60 cursor-not-allowed bg-[hsl(var(--input-muted))]",

            // Hover
            !disabled && !isFocused && "hover:border-[hsl(var(--input-primary))]",

            className,
          )}
        >
          {leadingIcon && <div className="mr-2 flex-shrink-0 text-[hsl(var(--input-muted-fg))]">{leadingIcon}</div>}

          {prefix && <span className="mr-2 text-[hsl(var(--input-muted-fg))] whitespace-nowrap">{prefix}</span>}

          <input
            id={inputId}
            ref={ref}
            type={inputType}
            value={value}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={describedBy || undefined}
            aria-required={required}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "peer w-full bg-transparent outline-none",
              "placeholder:text-[hsl(var(--input-muted-fg))]",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            )}
            {...props}
          />

          {counter && typeof maxLength === "number" && (
            <span
              className={cn(
                "ml-2 text-[0.8125rem] tabular-nums flex-shrink-0",
                currentLength > maxLength
                  ? "text-[hsl(var(--input-destructive))]"
                  : "text-[hsl(var(--input-muted-fg))]",
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}

          {suffix && <span className="ml-2 text-[hsl(var(--input-muted-fg))] whitespace-nowrap">{suffix}</span>}

          {trailingIcon && <div className="ml-2 flex-shrink-0 text-[hsl(var(--input-muted-fg))]">{trailingIcon}</div>}

          {isLoading && (
            <div className="ml-2 flex-shrink-0">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[hsl(var(--input-muted-fg))] border-t-[hsl(var(--input-primary))]" />
            </div>
          )}

          {showPasswordToggle && isPassword && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className={cn(
                "ml-2 flex-shrink-0 rounded-md p-1 text-[hsl(var(--input-muted-fg))]",
                "hover:bg-[hsl(var(--input-muted))] hover:text-[hsl(var(--input-fg))]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--input-ring))]",
                "transition-colors duration-150",
              )}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {onClear && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "ml-2 flex-shrink-0 rounded-md p-1 text-[hsl(var(--input-muted-fg))]",
                "hover:bg-[hsl(var(--input-muted))] hover:text-[hsl(var(--input-fg))]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--input-ring))]",
                "transition-colors duration-150",
              )}
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {description && (
          <p id={`${inputId}-desc`} className="text-[0.8125rem] text-[hsl(var(--input-muted-fg))]">
            {description}
          </p>
        )}

        {(error || success) && (
          <div
            id={`${inputId}-msg`}
            role="alert"
            className={cn(
              "flex items-center gap-1.5 text-[0.8125rem]",
              error ? "text-[hsl(var(--input-destructive))]" : "text-[hsl(var(--input-success))]",
            )}
          >
            {error && <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />}
            {success && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />}
            <span>{error || success}</span>
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
