import fs from "fs/promises"
import path from "path"
import type { Prediction } from "./types"

const dataFilePath = path.join(process.cwd(), "data", "predictions.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get all predictions
export async function getPredictions(): Promise<Prediction[]> {
  try {
    await ensureDataDirectory()

    try {
      const data = await fs.readFile(dataFilePath, "utf8")
      return JSON.parse(data)
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      await fs.writeFile(dataFilePath, JSON.stringify([]), "utf8")
      return []
    }
  } catch (error) {
    console.error("Error reading predictions:", error)
    return []
  }
}

// Save a prediction
export async function savePrediction(prediction: Prediction): Promise<void> {
  try {
    await ensureDataDirectory()

    let predictions: Prediction[] = []

    try {
      const data = await fs.readFile(dataFilePath, "utf8")
      predictions = JSON.parse(data)
    } catch (error) {
      // If file doesn't exist or is invalid, create a new array
      predictions = []
    }

    predictions.push(prediction)
    await fs.writeFile(dataFilePath, JSON.stringify(predictions, null, 2), "utf8")
  } catch (error) {
    console.error("Error saving prediction:", error)
    throw new Error("Failed to save prediction")
  }
}

