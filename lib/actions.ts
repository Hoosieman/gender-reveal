"use server"

import { savePrediction } from "./predictions"
import type { Prediction } from "./types"
import { revalidatePath } from "next/cache"

export async function addPrediction(prediction: Prediction) {
  await savePrediction(prediction)
  revalidatePath("/")
}

