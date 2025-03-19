import { kv } from "@vercel/kv"
import type { Prediction, PredictionArray } from "./types"

export { kv }

// Helper functions for predictions
export async function getAllPredictions(): Promise<PredictionArray> {
  try {
    const predictions = (await kv.get<PredictionArray>("predictions")) || []
    return Array.isArray(predictions) ? predictions : []
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return []
  }
}

export async function savePrediction(prediction: Partial<Prediction>): Promise<Prediction> {
  try {
    // Get existing predictions
    const predictions = await getAllPredictions()

    // Add timestamp and unique ID
    const newPrediction: Prediction = {
      ...prediction,
      id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      name: prediction.name || "Anonymous",
      guess: prediction.guess || "",
    }

    // Add new prediction to the array
    const updatedPredictions = [...predictions, newPrediction]

    // Save back to KV
    await kv.set("predictions", updatedPredictions)

    return newPrediction
  } catch (error) {
    console.error("Error saving prediction:", error)
    throw error
  }
}

export async function deletePrediction(id: string): Promise<boolean> {
  try {
    const predictions = await getAllPredictions()
    const updatedPredictions = predictions.filter((pred) => pred.id !== id)
    await kv.set("predictions", updatedPredictions)
    return true
  } catch (error) {
    console.error("Error deleting prediction:", error)
    throw error
  }
}

export async function updatePrediction(id: string, updatedData: Partial<Prediction>): Promise<Prediction | null> {
  try {
    const predictions = await getAllPredictions()
    const predictionIndex = predictions.findIndex((pred) => pred.id === id)

    if (predictionIndex === -1) {
      return null
    }

    const updatedPredictions = [...predictions]
    updatedPredictions[predictionIndex] = {
      ...updatedPredictions[predictionIndex],
      ...updatedData,
    }

    await kv.set("predictions", updatedPredictions)
    return updatedPredictions[predictionIndex]
  } catch (error) {
    console.error("Error updating prediction:", error)
    throw error
  }
}

export async function getPredictionById(id: string): Promise<Prediction | null> {
  try {
    const predictions = await getAllPredictions()
    return predictions.find((pred) => pred.id === id) || null
  } catch (error) {
    console.error("Error fetching prediction by ID:", error)
    return null
  }
}

