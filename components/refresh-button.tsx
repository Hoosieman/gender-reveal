"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Force a hard refresh
    window.location.reload()
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
    >
      {isRefreshing ? "Refreshing..." : "Refresh Predictions"}
    </button>
  )
}

