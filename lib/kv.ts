import { kv } from "@vercel/kv"
import type { Prediction } from "./types"
import { getFileData, saveFileData, addPredictionToFile } from "./fallback-storage"

// Export kv for use in other files
export { kv }

// Helper function to check if KV is connected
async function checkKVConnection() {
  try {
    console.log("Checking KV connection...")
    await kv.ping()
    console.log("KV connection successful")
    return true
  } catch (error: any) {
    console.error("KV connection error:", error?.message)
    return false
  }
}

// Helper functions for predictions
export async function getAllPredictions(): Promise<Prediction[]> {
  try {
    console.log("getAllPredictions - Starting")

    // Check connection first
    const isConnected = await checkKVConnection()
    if (!isConnected) {
      console.warn("getAllPredictions - KV not connected, using file storage fallback")
      const fileData = await getFileData()
      console.log(`getAllPredictions - Got ${fileData.length} predictions from file`)
      return fileData
    }

    console.log("getAllPredictions - Fetching from KV")
    const predictions = (await kv.get<Prediction[]>("predictions")) || []
    console.log(`getAllPredictions - Got ${predictions.length} predictions from KV:`, predictions)

    return Array.isArray(predictions) ? predictions : []
  } catch (error: any) {
    console.error("getAllPredictions - Error:", error?.message)
    // Fallback to file storage
    console.log("getAllPredictions - Falling back to file storage")
    return getFileData()
  }
}

export async function savePrediction(prediction: Partial<Prediction>): Promise<Prediction> {
  try {
    // Create a new prediction with required fields
    const newPrediction: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: prediction.name || "Anonymous",
      gender: prediction.gender || "boy",
      dueDate: prediction.dueDate || new Date().toISOString().split("T")[0],
      nameSuggestion: prediction.nameSuggestion || "",
      timestamp: prediction.timestamp || new Date().toISOString(),
      guess: prediction.gender || "boy", // Add this to match the Prediction type
    }

    // Check connection first
    const isConnected = await checkKVConnection()
    if (!isConnected) {
      console.warn("KV not connected, using file storage fallback")
      return addPredictionToFile(newPrediction)
    }

    // Get existing predictions
    const predictions = await getAllPredictions()

    // Add new prediction to the array
    const updatedPredictions = [...predictions, newPrediction]

    // Save back to KV
    await kv.set("predictions", updatedPredictions)

    // Also save to file as backup
    await saveFileData(updatedPredictions)

    return newPrediction
  } catch (error: any) {
    console.error("Error saving prediction:", error?.message)

    // Try fallback to file storage
    try {
      const newPrediction: Prediction = {
        id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        name: prediction.name || "Anonymous",
        gender: prediction.gender || "boy",
        dueDate: prediction.dueDate || new Date().toISOString().split("T")[0],
        nameSuggestion: prediction.nameSuggestion || "",
        timestamp: prediction.timestamp || new Date().toISOString(),
        guess: prediction.gender || "boy", // Add this to match the Prediction type
      }

      return addPredictionToFile(newPrediction)
    } catch (fallbackError: any) {
      console.error("Fallback storage also failed:", fallbackError?.message)
      throw error
    }
  }
}

export async function deletePrediction(id: string): Promise<void> {
  try {
    // Check connection first
    const isConnected = await checkKVConnection()
    if (!isConnected) {
      console.warn("KV not connected, using file storage fallback for delete")
      // Implement file-based deletion here if needed
      let predictions = await getFileData()
      predictions = predictions.filter((p) => p.id !== id)
      await saveFileData(predictions)
      return
    }

    const predictions = await getAllPredictions()
    const updatedPredictions = predictions.filter((prediction) => prediction.id !== id)
    await kv.set("predictions", updatedPredictions)
    await saveFileData(updatedPredictions) // Keep file storage in sync
  } catch (error: any) {
    console.error("Error deleting prediction:", error?.message)
    // Implement file-based deletion fallback here if needed
    throw error
  }
}

export async function updatePrediction(id: string, updateData: Partial<Prediction>): Promise<Prediction | null> {
  try {
    // Check connection first
    const isConnected = await checkKVConnection()
    if (!isConnected) {
      console.warn("KV not connected, using file storage fallback for update")
      // Implement file-based update here if needed
      const predictions = await getFileData()
      const index = predictions.findIndex((p) => p.id === id)
      if (index === -1) {
        return null
      }
      predictions[index] = { ...predictions[index], ...updateData }
      await saveFileData(predictions)
      return predictions[index]
    }

    const predictions = await getAllPredictions()
    const index = predictions.findIndex((prediction) => prediction.id === id)

    if (index === -1) {
      return null
    }

    const updatedPrediction = { ...predictions[index], ...updateData }
    predictions[index] = updatedPrediction

    await kv.set("predictions", predictions)
    await saveFileData(predictions) // Keep file storage in sync

    return updatedPrediction
  } catch (error: any) {
    console.error("Error updating prediction:", error?.message)
    // Implement file-based update fallback here if needed
    throw error
  }
}

export async function getPredictionById(id: string): Promise<Prediction | null> {
  try {
    // Check connection first
    const isConnected = await checkKVConnection()
    if (!isConnected) {
      console.warn("KV not connected, using file storage fallback for get by id")
      const predictions = await getFileData()
      return predictions.find((prediction) => prediction.id === id) || null
    }

    const predictions = await getAllPredictions()
    return predictions.find((prediction) => prediction.id === id) || null
  } catch (error: any) {
    console.error("Error getting prediction by id:", error?.message)
    return null
  }
}

