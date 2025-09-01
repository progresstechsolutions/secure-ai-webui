import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Logs a user activity string with timestamp for tracking.
 * In the future, this should send activity data to backend analytics API.
 * @param activity - Description of the activity performed by the user.
 */
export function logUserActivity(activity: string) {
  const now = new Date().toLocaleString();
  const entry = `${activity} (${now})`;
  
  // For now, just log to console - replace with API call in the future
  console.log("🎯 User Activity:", entry);
  
  // TODO: Send activity data to backend analytics API
  // await apiClient.logActivity({ activity, timestamp: now });
}

export interface GeoLocation {
  lat: number
  lng: number
}

export function getBrowserGeolocation(timeoutMs = 5000): Promise<GeoLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60000 }
    )
  })
}
