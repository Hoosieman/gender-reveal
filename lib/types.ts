export interface Prediction {
  id: string
  name: string
  email?: string
  guess: string
  timestamp: string
  [key: string]: any // For any additional fields
}

export type PredictionArray = Prediction[]

