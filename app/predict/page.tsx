import PredictionForm from "@/components/prediction-form"

export default function PredictPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <a href="/" className="inline-flex items-center mb-6 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Back to all predictions
      </a>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Make Your Prediction</h1>
        <p className="text-gray-600">Fill out the form below to submit your gender reveal prediction</p>
      </div>

      <PredictionForm />
    </div>
  )
}

