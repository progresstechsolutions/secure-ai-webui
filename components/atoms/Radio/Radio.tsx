"use client"

import React from "react"
import { cn } from "../../../lib/utils"

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className, label, id, ...props }, ref) => {
  const radioId = React.useId() // Moved React.useId to the top level
  const finalId = id || radioId

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input type="radio" ref={ref} id={finalId} className="sr-only" {...props} />
        <div
          className={cn(
            "h-4 w-4 rounded-full border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            props.checked && "border-primary",
            className,
          )}
          onClick={() => {
            const input = document.getElementById(finalId) as HTMLInputElement
            input?.click()
          }}
        >
          {props.checked && <div className="h-2 w-2 rounded-full bg-primary absolute top-1 left-1" />}
        </div>
      </div>
      {label && (
        <label
          htmlFor={finalId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  )
})
Radio.displayName = "Radio"

export { Radio }
