"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../lib/utils"
import { X } from "lucide-react"

const tagVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "text-foreground border border-input hover:bg-accent",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
)

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tagVariants> {
  onRemove?: () => void
  removable?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, onRemove, removable, children, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(tagVariants({ variant, size }), className)} {...props}>
        {children}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 rounded-full hover:bg-black/10 p-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Remove tag"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    )
  },
)
Tag.displayName = "Tag"

export { Tag, tagVariants }
