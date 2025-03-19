import { ClockIcon } from "lucide-react"

export default function ServerTimestamp() {
  const timestamp = new Date().toISOString()

  return (
    <div className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center">
      <ClockIcon className="w-3 h-3 mr-1" />
      Server rendered at: {timestamp}
    </div>
  )
}

