import React from "react"

interface HealthBinderLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function HealthBinderLogo({ className = "", size = "md" }: HealthBinderLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Binder base */}
        <rect
          x="6"
          y="10"
          width="18"
          height="16"
          rx="2"
          fill="url(#binderGradient)"
          stroke="url(#binderStroke)"
          strokeWidth="1.5"
        />
        
        {/* Binder rings */}
        <circle cx="12" cy="18" r="1.5" fill="url(#ringGradient)" />
        <circle cx="18" cy="18" r="1.5" fill="url(#ringGradient)" />
        
        {/* Paper corner poking out */}
        <path
          d="M8 8 L16 4 L24 8 L22 10 L16 6 L10 10 Z"
          fill="white"
          stroke="url(#paperStroke)"
          strokeWidth="0.5"
        />
        
        {/* Heart on binder */}
        <path
          d="M14 14 L15 13 L16 14 L17 13 L18 14 L17 15 L16 16 L15 15 L14 14 Z"
          fill="url(#heartGradient)"
          stroke="url(#heartStroke)"
          strokeWidth="0.5"
        />
        
        {/* Pulse line inside heart */}
        <path
          d="M14.5 14.5 L15.5 14 L16.5 14.5 L17.5 13.5 L18.5 14.5"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="binderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="binderStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="paperStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#D1D5DB" />
          </linearGradient>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="heartStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
} 