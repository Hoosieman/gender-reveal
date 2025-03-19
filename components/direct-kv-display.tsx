import { kv } from "@vercel/kv"
import { format } from "date-fns"

interface Prediction {
  name: string
  gender: string
  dueDate: string
  nameSuggestion: string
  timestamp: string
  id: string
  guess?: string
}

export default async function DirectKVDisplay() {
  let predictions: Prediction[] = []
  let error: string | null = null

  try {
    predictions = (await kv.get<Prediction[]>("predictions")) || []
  } catch (err: any) {
    error = err?.message || "Failed to fetch from KV"
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-semibold text-red-700">Direct KV Access Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!predictions || predictions.length === 0) {
    return (
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-lg font-semibold text-yellow-700">Direct KV Access</h3>
        <p className="text-yellow-600">No predictions found in KV store</p>
      </div>
    )
  }

  return (
    <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
      <h3 className="text-lg font-semibold text-green-700">Direct KV Access</h3>
      <p className="text-green-600 mb-2">Found {predictions.length} predictions in KV store</p>
      <div className="max-h-40 overflow-y-auto text-xs">
        <ul className="list-disc pl-5">
          {predictions.map((pred) => (
            <li key={pred.id} className="mb-1">
              {pred.name} - {pred.gender} - {format(new Date(pred.timestamp), "MMM d, yyyy")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

