export interface Prediction {
  id: string
  name: string
  gender: string
  dueDate: string
  nameSuggestion: string
  timestamp: string
  guess?: string // Make this optional since we're not using it
  email?: string // Keep this optional
  [key: string]: any // For any additional fields
}

export type PredictionArray = Prediction[]

