"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { RefreshCwIcon } from "lucide-react"

export default function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Force a hard refresh
    window.location.reload()
  }

  return (
    <button onClick={handleRefresh} disabled={isRefreshing} className="neutral-button group">
      <span className="flex items-center justify-center">
        {isRefreshing ? "Refreshing..." : "Refresh Predictions"}
        <RefreshCwIcon className="ml-2 w-5 h-5 group-hover:animate-spin" />
      </span>
    </button>
  )
}

