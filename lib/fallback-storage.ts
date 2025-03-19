import fs from "fs/promises"
import path from "path"
import type { Prediction } from "./types"

const DATA_FILE = path.join(process.cwd(), "data", "predictions.json")

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch (error) {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Get all predictions from file
export async function getFileData(): Promise<Prediction[]> {
  try {
    await ensureDataDirectory()

    try {
      const data = await fs.readFile(DATA_FILE, "utf8")
      return JSON.parse(data)
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      return []
    }
  } catch (error: any) {
    console.error("Error reading file data:", error?.message)
    return []
  }
}

// Save predictions to file
export async function saveFileData(predictions: Prediction[]): Promise<void> {
  try {
    await ensureDataDirectory()
    await fs.writeFile(DATA_FILE, JSON.stringify(predictions, null, 2), "utf8")
  } catch (error: any) {
    console.error("Error saving file data:", error?.message)
  }
}

// Add a prediction to file
export async function addPredictionToFile(prediction: Prediction): Promise<Prediction> {
  try {
    const predictions = await getFileData()
    predictions.push(prediction)
    await saveFileData(predictions)
    return prediction
  } catch (error: any) {
    console.error("Error adding prediction to file:", error?.message)
    throw error
  }
}

