export type Emotion = "happy" | "neutral" | "sad" | "anxious" | "stressed" | "angry"
export type Personality = "supportive" | "therapist" | "coach"

export interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  emotion?: Emotion
  translated?: string // For storing translated text from Hindi to English
}
