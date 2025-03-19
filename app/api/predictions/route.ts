import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

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

export async function GET() {
  try {
    await ensureDataDirectory()

    try {
      const data = await fs.readFile(dataFilePath, "utf8")
      return NextResponse.json(JSON.parse(data))
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      await fs.writeFile(dataFilePath, JSON.stringify([]), "utf8")
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error reading predictions:", error)
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const prediction = await request.json()

    await ensureDataDirectory()

    let predictions = []

    try {
      const data = await fs.readFile(dataFilePath, "utf8")
      predictions = JSON.parse(data)
    } catch (error) {
      // If file doesn't exist or is invalid, create a new array
      predictions = []
    }

    predictions.push(prediction)
    await fs.writeFile(dataFilePath, JSON.stringify(predictions, null, 2), "utf8")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving prediction:", error)
    return NextResponse.json({ error: "Failed to save prediction" }, { status: 500 })
  }
}

