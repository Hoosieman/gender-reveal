"use client"

import { useEffect, useState } from "react"
import { ClockIcon } from "lucide-react"

export default function TimestampDisplay() {
  const [timestamp, setTimestamp] = useState<string>("")

  useEffect(() => {
    setTimestamp(new Date().toISOString())
  }, [])

  return (
    <div className="text-xs text-gray-500 text-center flex items-center justify-center">
      <ClockIcon className="w-3 h-3 mr-1" />
      Page rendered at: {timestamp}
    </div>
  )
}

