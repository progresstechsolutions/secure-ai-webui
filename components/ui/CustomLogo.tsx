import React from "react"

interface CustomLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  src: string
  alt?: string
}

export function CustomLogo({ 
  className = "", 
  size = "md", 
  src, 
  alt = "HealthBinder Logo"
}: CustomLogoProps) {
  const sizeClasses = {
    sm: "w-14 h-14",    // was w-9 h-9 (9 * 1.5 = 13.5, rounded to 14)
    md: "w-18 h-18",    // was w-12 h-12 (12 * 1.5 = 18)
    lg: "w-28 h-28"     // was w-18 h-18 (18 * 1.5 = 27, rounded to 28)
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
      />
    </div>
  )
}