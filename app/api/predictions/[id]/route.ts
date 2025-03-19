import { NextResponse } from "next/server"
import { getPredictionById } from "@/lib/kv"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const prediction = await getPredictionById(id)

    if (!prediction) {
      return NextResponse.json({ error: "Prediction not found" }, { status: 404 })
    }

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error fetching prediction:", error)
    return NextResponse.json({ error: "Failed to fetch prediction" }, { status: 500 })
  }
}

