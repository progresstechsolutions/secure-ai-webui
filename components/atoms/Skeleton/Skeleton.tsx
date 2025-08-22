import React from "react"
import { cn } from "../../../lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-muted",
          variant === "circular" && "rounded-full",
          variant === "rectangular" && "rounded-md",
          variant === "default" && "rounded-md",
          className,
        )}
        style={{
          width,
          height,
          ...style,
        }}
        {...props}
      />
    )
  },
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
