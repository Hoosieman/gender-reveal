"use client"

import { useEffect, useState } from "react"

export default function TimestampDisplay() {
  const [timestamp, setTimestamp] = useState<string>("")

  useEffect(() => {
    setTimestamp(new Date().toISOString())
  }, [])

  return <div className="text-xs text-gray-500 text-center mt-8">Page rendered at: {timestamp}</div>
}

