import { format } from "date-fns"
import { kv } from "@vercel/kv"

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
      <div className="text-center py-12">
        <p className="text-gray-500">No predictions yet. Be the first to make one!</p>
        <div className="mt-4">
          <a href="/api/debug" target="_blank" className="text-blue-500 underline" rel="noreferrer">
            Debug KV Store
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {predictions.map((prediction, index) => (
        <div
          key={prediction.id || index}
          className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
        >
          <div className={`h-2 w-full ${prediction.gender === "boy" ? "bg-blue-500" : "bg-pink-500"}`} />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{prediction.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  prediction.gender === "boy" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                }`}
              >
                {prediction.gender === "boy" ? "Boy" : "Girl"}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Due Date Guess:</span>{" "}
                {format(new Date(prediction.dueDate), "MMMM d, yyyy")}
              </div>
              <div>
                <span className="font-medium">Name Suggestion:</span> {prediction.nameSuggestion}
              </div>
              <div className="text-xs text-gray-500 pt-2">
                Submitted on {format(new Date(prediction.timestamp), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

