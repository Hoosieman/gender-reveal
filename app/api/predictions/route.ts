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
export async function GET(request: Request) {
  try {
    console.log("GET /api/predictions - Starting")

    // Check environment variables
    if (!checkEnvVariables()) {
      console.error("GET /api/predictions - Missing environment variables")
      return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 })
    }

    // Check KV connection
    try {
      console.log("GET /api/predictions - Checking KV connection")
      await kv.ping()
      console.log("GET /api/predictions - KV connection successful")
    } catch (error: any) {
      console.error("GET /api/predictions - KV connection error:", error)
      return NextResponse.json({ error: "Failed to connect to KV store", details: error?.message }, { status: 500 })
    }

    console.log("GET /api/predictions - Fetching predictions")
    const predictions = await getAllPredictions()
    console.log(`GET /api/predictions - Found ${predictions.length} predictions`)

    // Add cache control headers
    return NextResponse.json(predictions, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error: any) {
    console.error("GET /api/predictions - Error:", error)
    return NextResponse.json({ error: "Failed to fetch predictions", details: error?.message }, { status: 500 })
  }
}

// POST - Create a new prediction
export async function POST(request: Request) {
  try {
    console.log("POST /api/predictions - Starting")

    // Check environment variables
    if (!checkEnvVariables()) {
      console.error("POST /api/predictions - Missing environment variables")
      return NextResponse.json({ error: "Missing required environment variables" }, { status: 500 })
    }

    // Check KV connection
    try {
      console.log("POST /api/predictions - Checking KV connection")
      await kv.ping()
      console.log("POST /api/predictions - KV connection successful")
    } catch (error: any) {
      console.error("POST /api/predictions - KV connection error:", error)
      return NextResponse.json({ error: "Failed to connect to KV store", details: error?.message }, { status: 500 })
    }

    const data = await request.json()
    console.log("POST /api/predictions - Received data:", data)

    const prediction: Partial<Prediction> = {
      name: data.name,
      gender: data.gender,
      dueDate: data.dueDate,
      nameSuggestion: data.nameSuggestion,
      timestamp: data.timestamp || new Date().toISOString(),
      guess: data.gender, // Add this to match the Prediction type
    }

    console.log("POST /api/predictions - Saving prediction")
    const savedPrediction = await savePrediction(prediction)
    console.log("POST /api/predictions - Prediction saved:", savedPrediction)

    return NextResponse.json({ success: true, prediction: savedPrediction })
  } catch (error: any) {
    console.error("POST /api/predictions - Error:", error)
    return NextResponse.json({ error: "Failed to save prediction", details: error?.message }, { status: 500 })
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
  } catch (error: any) {
    console.error("Error deleting prediction:", error)
    return NextResponse.json({ error: "Failed to delete prediction", details: error?.message }, { status: 500 })
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
  } catch (error: any) {
    console.error("Error updating prediction:", error)
    return NextResponse.json({ error: "Failed to update prediction", details: error?.message }, { status: 500 })
  }
}

