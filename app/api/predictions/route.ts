import { NextResponse } from "next/server"
import { getAllPredictions, savePrediction, deletePrediction, updatePrediction } from "@/lib/kv"
import type { Prediction } from "@/lib/types"

// GET - Fetch all predictions
export async function GET() {
  try {
    const predictions = await getAllPredictions()
    return NextResponse.json(predictions)
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
  }
}

// POST - Create a new prediction
export async function POST(request: Request) {
  try {
    const prediction = (await request.json()) as Partial<Prediction>
    const savedPrediction = await savePrediction(prediction)
    return NextResponse.json({ success: true, prediction: savedPrediction })
  } catch (error) {
    console.error("Error saving prediction:", error)
    return NextResponse.json({ error: "Failed to save prediction" }, { status: 500 })
  }
}

// DELETE - Delete a prediction by ID
export async function DELETE(request: Request) {
  try {
    const { id } = (await request.json()) as { id: string }
    if (!id) {
      return NextResponse.json({ error: "Prediction ID is required" }, { status: 400 })
    }

    await deletePrediction(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting prediction:", error)
    return NextResponse.json({ error: "Failed to delete prediction" }, { status: 500 })
  }
}

// PUT - Update a prediction
export async function PUT(request: Request) {
  try {
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
    return NextResponse.json({ error: "Failed to update prediction" }, { status: 500 })
  }
}

