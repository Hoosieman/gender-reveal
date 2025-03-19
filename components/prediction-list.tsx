import { format } from "date-fns"
import { getBaseUrl } from "@/lib/utils"

interface Prediction {
  name: string
  gender: string
  dueDate: string
  nameSuggestion: string
  timestamp: string
}

async function getPredictions(): Promise<Prediction[]> {
  // Use the utility function to get the base URL
  const baseUrl = getBaseUrl()

  try {
    const res = await fetch(`${baseUrl}/api/predictions`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error("Failed to fetch predictions")
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return [] // Return empty array on error
  }
}

export default async function PredictionList() {
  const predictions = await getPredictions()

  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No predictions yet. Be the first to make one!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {predictions.map((prediction, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
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

