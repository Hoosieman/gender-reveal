export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Updated getBaseUrl function to handle build environment
export function getBaseUrl() {
  // Check if we're running in the browser
  if (typeof window !== "undefined") {
    // In the browser, we can use the window.location.origin
    return window.location.origin
  }

  // On the server side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // During build time, we might not have a valid URL
  // Return a placeholder that will be replaced at runtime
  if (process.env.NODE_ENV === "production") {
    // For production builds, return an empty string to avoid build errors
    // The actual URL will be determined at runtime
    return ""
  }

  // Fallback for local development
  return "http://localhost:3000"
}

