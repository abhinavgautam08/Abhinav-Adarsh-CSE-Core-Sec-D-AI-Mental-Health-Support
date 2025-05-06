import { createAI } from "ai/rsc"

// Configure the AI SDK with Google's Gemini model
export const ai = createAI({
  actions: {
    detectEmotion: async (text: string) => {
      "use server"

      // Check if API key exists and is not empty
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY.trim() === "AIzaSyB5NXY1eAIjONF1FYT0fM5fZNZXXLxkz24") {
        console.warn("No Google API key found or key is empty, returning neutral emotion")
        return "neutral"
      }

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.GOOGLE_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `
                      Analyze the following text and determine the primary emotion expressed.
                      Choose exactly one emotion from this list: happy, neutral, sad, anxious, stressed, angry.
                      Only respond with the emotion name, nothing else.
                      
                      Text: "${text}"
                    `,
                    },
                  ],
                },
              ],
            }),
          },
        )

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error from Google API:", errorData)
          return "neutral"
        }

        const data = await response.json()
        const result = data.candidates[0].content.parts[0].text.trim().toLowerCase()

        if (["happy", "neutral", "sad", "anxious", "stressed", "angry"].includes(result)) {
          return result
        }

        return "neutral"
      } catch (error) {
        console.error("Error in server-side emotion detection:", error)
        return "neutral"
      }
    },
  },
})
