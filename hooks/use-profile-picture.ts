import { useState, useEffect } from 'react'

export function useProfilePicture() {
  const [profilePicture, setProfilePicture] = useState<string>("")

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        setProfilePicture(parsed.profilePicture || "")
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const updateProfilePicture = (newPicture: string) => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        const updated = { ...parsed, profilePicture: newPicture }
        localStorage.setItem("user_data", JSON.stringify(updated))
        setProfilePicture(newPicture)
      } catch (error) {
        console.error("Error updating profile picture:", error)
      }
    }
  }

  return { profilePicture, updateProfilePicture }
}
