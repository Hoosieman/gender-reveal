import Link from "next/link"
import { Suspense } from "react"
import Image from "next/image"
import PredictionList from "@/components/prediction-list"
import RefreshButton from "@/components/refresh-button"
import TimestampDisplay from "@/components/timestamp-display"
import ServerTimestamp from "@/components/server-timestamp"
import DirectKVDisplay from "@/components/direct-kv-display"
import { Heart } from "lucide-react"

// Force dynamic rendering and disable caching
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default function Home() {
  return (
    <main className="confetti-bg min-h-screen pb-16">
      <div className="gender-reveal-container">
        <div className="mb-12 text-center max-w-3xl mx-auto fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-pink-100 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-sky-100 rounded-full animate-pulse delay-300"></div>
              <div className="relative z-10 w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image src="/images/IMG_7159.jpeg" alt="Baby" fill style={{ objectFit: "cover" }} priority />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6 gender-reveal-heading">Parker & Katie</h1>
          <h1 className="text-5xl font-bold mb-6 gender-reveal-heading">Baby Gender Reveal</h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the fun and share your prediction for our upcoming bundle of joy! Will it have Parker's big ears or Katie's beautiful eyes?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/predict" className="boy-button group">
              <span className="flex items-center justify-center">
                Make Your Prediction
                <Heart className="ml-2 w-5 h-5 group-hover:animate-ping" />
              </span>
            </Link>
            <RefreshButton />
          </div>
        </div>

        <div className="mt-16 slide-up">
          <div className="flex items-center justify-center mb-8">
            <div className="h-0.5 bg-gradient-to-r from-sky-300 to-transparent flex-1"></div>
            <h2 className="text-3xl font-bold px-6 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-pink-500">
                All Predictions
              </span>
            </h2>
            <div className="h-0.5 bg-gradient-to-l from-pink-300 to-transparent flex-1"></div>
          </div>

          <Suspense
            fallback={
              <div className="text-center py-12">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading predictions...</p>
              </div>
            }
          >
            <PredictionList />
          </Suspense>
        </div>

        <Suspense fallback={<div className="text-center">Loading direct KV access...</div>}>
          <DirectKVDisplay />
        </Suspense>

        <div className="mt-12 text-center">
          <TimestampDisplay />
          <ServerTimestamp />
        </div>
      </div>
    </main>
  )
}

