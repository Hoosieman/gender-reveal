import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function GET() {
  try {
    // Get all keys
    const keys = await kv.keys("*")

    // Get the predictions
    const predictions = await kv.get("predictions")

    // Get environment info
    const envInfo = {
      hasKvUrl: !!process.env.KV_URL,
      hasKvRestApiToken: !!process.env.KV_REST_API_TOKEN,
      hasKvRestApiUrl: !!process.env.KV_REST_API_URL,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
    }

    return NextResponse.json(
      {
        keys,
        predictions,
        envInfo,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error: any) {
    console.error("Debug error:", error)
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 })
  }
}

