import { NextResponse } from "next/server"
import { getAllPredictions, savePrediction, deletePrediction, updatePrediction, kv } from "@/lib/kv"
import type { Prediction } from "@/lib/types"

// Helper function to check environment variables
function checkEnvVariables() {
  const requiredVars = ["KV_URL", "KV_REST_API_TOKEN", "KV_REST_API_URL"]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

// GET - Fetch all predictions
export async function GET() {
  try {
    // Check environment variables
    if (!checkEnvVariables()) {
      return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 })
    }

    // Check KV connection
    try {
      await kv.ping()
    } catch (error) {
      console.error("KV connection error:", error)
      return NextResponse.json({ error: "Failed to connect to KV store" }, { status: 500 })
    }

    const predictions = await getAllPredictions()

    // Add cache control headers
    return NextResponse.json(predictions, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return NextResponse.json({ error: "Failed to fetch predictions", details: error.message }, { status: 500 })
  }
}

// POST - Create a new prediction
export async function POST(request: Request) {
  try {
    // Check environment variables
    if (!checkEnvVariables()) {
      return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 })
    }

    // Check KV connection
    try {
      await kv.ping()
    } catch (error) {
      console.error("KV connection error:", error)
      return NextResponse.json({ error: "Failed to connect to KV store" }, { status: 500 })
    }

    const data = await request.json()
    console.log("Received prediction data:", data)

    const prediction = {
      name: data.name,
      gender: data.gender,
      dueDate: data.dueDate,
      nameSuggestion: data.nameSuggestion,
      timestamp: data.timestamp || new Date().toISOString(),
    }

    const savedPrediction = await savePrediction(prediction)
    return NextResponse.json({ success: true, prediction: savedPrediction })
  } catch (error) {
    console.error("Error saving prediction:", error)
    return NextResponse.json({ error: "Failed to save prediction", details: error.message }, { status: 500 })
  }
}

// DELETE - Delete a prediction by ID
export async function DELETE(request: Request) {
  try {
    // Check environment variables
    if (!checkEnvVariables()) {
      return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 })
    }

    const { id } = (await request.json()) as { id: string }
    if (!id) {
      return NextResponse.json({ error: "Prediction ID is required" }, { status: 400 })
    }

    await deletePrediction(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting prediction:", error)
    return NextResponse.json({ error: "Failed to delete prediction", details: error.message }, { status: 500 })
  }
}

// PUT - Update a prediction
export async function PUT(request: Request) {
  try {
    // Check environment variables
    if (!checkEnvVariables()) {
      return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 })
    }

    const { id, ...updateData } = (await request.json()) as Prediction & { id: string }
    if (!id) {
      return NextResponse.json({ error: "Prediction ID is required" }, { status: 400 })
    }

    const updatedPrediction = await updatePrediction(id, updateData)
    if (!updatedPrediction) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, prediction: updatedPrediction })
  } catch (error) {
    console.error("Error updating prediction:", error)
    return NextResponse.json({ error: "Failed to update prediction", details: error.message }, { status: 500 })
  }
}

