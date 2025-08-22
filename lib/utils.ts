import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Logs a user activity string with timestamp to localStorage for recent activity tracking.
 * @param activity - Description of the activity performed by the user.
 */
export function logUserActivity(activity: string) {
  const key = "user_activity";
  const now = new Date().toLocaleString();
  const entry = `${activity} (${now})`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 50)));
}
