import Image from "next/image"
import PredictionForm from "@/components/prediction-form"
import { ArrowLeft } from "lucide-react"

export default function PredictPage() {
  return (
    <div className="confetti-bg min-h-screen py-12">
      <div className="gender-reveal-container max-w-4xl">
        <a href="/" className="inline-flex items-center mb-8 text-violet-500 hover:text-violet-700 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all predictions
        </a>

        <div className="mb-10 text-center fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-pink-100 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-sky-100 rounded-full animate-pulse delay-300"></div>
              <div className="relative z-10 w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image src="/images/IMG_7159.jpeg" alt="Baby" fill style={{ objectFit: "cover" }} priority />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 gender-reveal-heading">Make Your Prediction</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Fill out the form below to submit your gender reveal prediction. Will it be a bouncing baby boy or a
            gorgeous baby girl?
          </p>
        </div>

        <PredictionForm />
      </div>
    </div>
  )
}

