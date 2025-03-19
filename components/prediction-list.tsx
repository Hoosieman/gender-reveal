import { format } from "date-fns"
import { kv } from "@vercel/kv"
import { CalendarIcon, UserIcon, MessageSquareIcon, PartyPopperIcon } from "lucide-react"
import Link from "next/link"

interface Prediction {
  name: string
  gender: string
  dueDate: string
  nameSuggestion: string
  timestamp: string
  id: string
  guess?: string
}

// Fetch directly from KV instead of using the API
async function getPredictions(): Promise<Prediction[]> {
  console.log("Fetching predictions directly from KV")

  try {
    // Try to get predictions directly from KV
    const predictions = (await kv.get<Prediction[]>("predictions")) || []
    console.log(`Got ${predictions.length} predictions directly from KV:`, predictions)

    return Array.isArray(predictions) ? predictions : []
  } catch (error: any) {
    console.error("Error fetching predictions from KV:", error?.message)

    // If direct KV access fails, try the API as fallback
    try {
      console.log("Falling back to API fetch")
      const res = await fetch(`/api/predictions?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!res.ok) {
        throw new Error(`API fetch failed: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      console.log("Fetched predictions from API:", data)
      return data
    } catch (apiFetchError: any) {
      console.error("API fetch also failed:", apiFetchError?.message)
      return []
    }
  }
}

export default async function PredictionList() {
  const predictions = await getPredictions()

  console.log(`PredictionList rendering with ${predictions.length} predictions`)

  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center py-12 gender-reveal-card p-8 max-w-md mx-auto">
        <div className="text-violet-500 mb-4">
          <PartyPopperIcon size={48} className="mx-auto" />
        </div>
        <p className="text-gray-600 mb-4">No predictions yet. Be the first to make one!</p>
        <Link href="/predict" className="neutral-button inline-block">
          Make a Prediction
        </Link>
        <div className="mt-6">
          <a href="/api/debug" target="_blank" className="text-xs text-violet-500 underline" rel="noreferrer">
            Debug KV Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {predictions.map((prediction, index) => (
        <div
          key={prediction.id || index}
          className="gender-reveal-card group bounce-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`h-3 w-full ${prediction.gender === "boy" ? "bg-gradient-to-r from-sky-400 to-sky-600" : "bg-gradient-to-r from-pink-400 to-pink-600"}`}
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${prediction.gender === "boy" ? "bg-sky-100 text-sky-600" : "bg-pink-100 text-pink-600"}`}
                >
                  <UserIcon size={20} />
                </div>
                <h3 className="font-bold text-lg ml-3 group-hover:text-violet-600 transition-colors">
                  {prediction.name}
                </h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  prediction.gender === "boy"
                    ? "bg-sky-100 text-sky-800 border border-sky-200"
                    : "bg-pink-100 text-pink-800 border border-pink-200"
                }`}
              >
                {prediction.gender === "boy" ? "Boy" : "Girl"}
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <div className="mt-0.5 mr-3 text-violet-500">
                  <CalendarIcon size={16} />
                </div>
                <div>
                  <span className="font-medium text-gray-700">Due Date Guess:</span>{" "}
                  <span className="text-gray-600">{format(new Date(prediction.dueDate), "MMMM d, yyyy")}</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-0.5 mr-3 text-violet-500">
                  <MessageSquareIcon size={16} />
                </div>
                <div>
                  <span className="font-medium text-gray-700">Name Suggestion:</span>{" "}
                  <span className="text-gray-600">{prediction.nameSuggestion}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                <span>Submitted on {format(new Date(prediction.timestamp), "MMM d, yyyy")}</span>
                <div
                  className={`w-2 h-2 rounded-full ${prediction.gender === "boy" ? "bg-sky-400" : "bg-pink-400"} animate-pulse`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

