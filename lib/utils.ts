export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Updated getBaseUrl function to work more reliably
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

  // Fallback for local development
  return "http://localhost:3000"
}

