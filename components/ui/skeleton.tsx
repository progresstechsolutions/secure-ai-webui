import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted animate-pulse",
        className
      )}
      {...props}
    >
      <span className="absolute inset-0 block h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.5s_infinite]" style={{ pointerEvents: 'none' }} />
    </div>
  )
}

// Add shimmer keyframes to global CSS or Tailwind config if not present
// @keyframes shimmer { 100% { transform: translateX(100%); } }

export { Skeleton }
