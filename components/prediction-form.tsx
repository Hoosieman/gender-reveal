"use client"

import type React from "react"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { getBaseUrl } from "@/lib/utils"
import { CalendarIcon, CheckIcon, XIcon, LoaderIcon } from "lucide-react"

export default function PredictionForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    gender: "boy",
    dueDate: "",
    nameSuggestion: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Use the absolute URL with the base URL
      const baseUrl = getBaseUrl()
      console.log("Submitting to:", `${baseUrl}/api/predictions`)
      console.log("Form data:", formData)

      const response = await fetch(`${baseUrl}/api/predictions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit prediction")
      }

      // Force a hard navigation to refresh the page completely
      window.location.href = "/"
    } catch (error: any) {
      console.error("Error submitting prediction:", error)
      setError(error?.message || "Failed to submit prediction. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="gender-reveal-card p-8 max-w-2xl mx-auto slide-up">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
          <XIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="gender-reveal-input"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Gender Prediction</label>
          <div className="flex space-x-4">
            <label className="relative flex-1">
              <input
                type="radio"
                name="gender"
                value="boy"
                checked={formData.gender === "boy"}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`
                w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                ${
                  formData.gender === "boy"
                    ? "border-sky-500 bg-sky-50 text-sky-700"
                    : "border-gray-200 hover:border-sky-200 text-gray-500"
                }
              `}
              >
                <span className="font-medium">Boy</span>
                {formData.gender === "boy" && <CheckIcon className="w-5 h-5 ml-2 text-sky-500" />}
              </div>
            </label>

            <label className="relative flex-1">
              <input
                type="radio"
                name="gender"
                value="girl"
                checked={formData.gender === "girl"}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                className={`
                w-full py-4 px-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                ${
                  formData.gender === "girl"
                    ? "border-pink-500 bg-pink-50 text-pink-700"
                    : "border-gray-200 hover:border-pink-200 text-gray-500"
                }
              `}
              >
                <span className="font-medium">Girl</span>
                {formData.gender === "girl" && <CheckIcon className="w-5 h-5 ml-2 text-pink-500" />}
              </div>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date Guess
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="gender-reveal-input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="nameSuggestion" className="block text-sm font-medium text-gray-700 mb-2">
            Name Suggestion
          </label>
          <textarea
            id="nameSuggestion"
            name="nameSuggestion"
            value={formData.nameSuggestion}
            onChange={handleChange}
            required
            rows={3}
            className="gender-reveal-input resize-none"
            placeholder="Suggest a name for the baby"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full neutral-button flex items-center justify-center ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? (
            <>
              <LoaderIcon className="animate-spin mr-2 h-5 w-5" />
              Submitting...
            </>
          ) : (
            "Submit Prediction"
          )}
        </button>
      </form>
    </div>
  )
}

