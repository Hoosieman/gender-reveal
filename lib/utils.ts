import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this function if it doesn't exist
export function getBaseUrl() {
  // Check if we're running in a browser environment
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // For server-side rendering
  const url = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"
  return url.startsWith("http") ? url : `https://${url}`
}

