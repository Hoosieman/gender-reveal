export interface Prediction {
  name: string
  gender: "boy" | "girl"
  dueDate: string | Date
  nameSuggestion: string
  timestamp: string
}

