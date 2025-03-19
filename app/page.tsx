import Link from "next/link"
import { Suspense } from "react"
import PredictionList from "@/components/prediction-list"
import RefreshButton from "@/components/refresh-button"
import TimestampDisplay from "@/components/timestamp-display"
import ServerTimestamp from "@/components/server-timestamp"
import DirectKVDisplay from "@/components/direct-kv-display"

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Baby Gender Reveal Predictions</h1>
        <p className="text-lg text-gray-600 mb-6">
          Join the fun and share your prediction for our upcoming bundle of joy!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/predict"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Make Your Prediction
          </Link>
          <RefreshButton />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">All Predictions</h2>
        <Suspense fallback={<div className="text-center">Loading predictions...</div>}>
          <PredictionList />
        </Suspense>
      </div>

      <Suspense fallback={<div className="text-center">Loading direct KV access...</div>}>
        <DirectKVDisplay />
      </Suspense>

      <TimestampDisplay />
      <ServerTimestamp />
    </main>
  )
}

