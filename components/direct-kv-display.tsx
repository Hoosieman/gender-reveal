import { kv } from "@vercel/kv"
import { format } from "date-fns"
import { DatabaseIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react"

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
      <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-start">
          <AlertCircleIcon className="w-5 h-5 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-red-700">Direct KV Access Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!predictions || predictions.length === 0) {
    return (
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-start">
          <DatabaseIcon className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-amber-700">Direct KV Access</h3>
            <p className="text-amber-600 text-sm mt-1">No predictions found in KV store</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
      <div className="flex items-start">
        <CheckCircleIcon className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-green-700">Direct KV Access</h3>
          <p className="text-green-600 text-sm mt-1">Found {predictions.length} predictions in KV store</p>
          <div className="mt-3 max-h-40 overflow-y-auto text-xs bg-white p-3 rounded border border-green-100">
            <ul className="space-y-1">
              {predictions.map((pred) => (
                <li key={pred.id} className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${pred.gender === "boy" ? "bg-sky-400" : "bg-pink-400"}`}
                  ></span>
                  <span className="font-medium">{pred.name}</span>
                  <span className="mx-1">-</span>
                  <span className={pred.gender === "boy" ? "text-sky-600" : "text-pink-600"}>{pred.gender}</span>
                  <span className="mx-1">-</span>
                  <span className="text-gray-500">{format(new Date(pred.timestamp), "MMM d, yyyy")}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

