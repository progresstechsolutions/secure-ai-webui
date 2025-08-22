import { User } from "lucide-react"
import { useProfilePicture } from "../../hooks/use-profile-picture"

interface UserAvatarProps {
  username?: string
  size?: "sm" | "md" | "lg" | "xl"
  profilePicture?: string
  className?: string
  showFallback?: boolean
}

export function UserAvatar({ 
  username, 
  size = "md", 
  profilePicture: externalProfilePicture,
  className = "",
  showFallback = true 
}: UserAvatarProps) {
  const { profilePicture: currentUserProfilePicture } = useProfilePicture()
  
  // Use external profile picture if provided, otherwise use current user's picture
  const displayPicture = externalProfilePicture || currentUserProfilePicture
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  }
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5",
    xl: "h-6 w-6"
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
      {displayPicture ? (
        <img 
          src={displayPicture} 
          alt={username || "User"} 
          className="w-full h-full object-cover"
        />
      ) : showFallback ? (
        <User className={`${iconSizes[size]} text-gray-400`} />
      ) : (
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center`}>
          <span className="text-white font-semibold text-xs">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
      )}
    </div>
  )
}
