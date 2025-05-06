import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import type { Emotion, Message, Personality } from "@/lib/types"
import { getApiKey, setApiKey } from "@/lib/api-config"

// Create a custom Google provider instance
let googleAI: ReturnType<typeof createGoogleGenerativeAI> | null = null
let apiKeyValidated = false
let apiKeyValid = false

// Function to update the API key
export async function updateApiKey(newApiKey: string): Promise<boolean> {
  // Reset validation state
  apiKeyValidated = false
  apiKeyValid = false
  googleAI = null

  // Update the API key in the config
  setApiKey(newApiKey)

  // Validate the new key
  return await initializeGoogleAI()
}

// Function to validate and initialize the Google AI provider
const initializeGoogleAI = async (): Promise<boolean> => {
  // If we've already validated, return the cached result
  if (apiKeyValidated) {
    return apiKeyValid
  }

  // Get the API key from the config
  const apiKey = getApiKey()

  // If no API key, don't even try
  if (!apiKey || apiKey.trim() === "") {
    console.warn("No Google API key found or key is empty")
    apiKeyValidated = true
    apiKeyValid = false
    return false
  }

  try {
    // Create the provider
    googleAI = createGoogleGenerativeAI({
      apiKey: apiKey,
    })

    // Test the API key with a simple request
    try {
      await generateText({
        model: googleAI("gemini-1.5-flash"),
        prompt: "test",
      })
      apiKeyValidated = true
      apiKeyValid = true
      return true
    } catch (error) {
      console.error("API key validation failed:", error)
      apiKeyValidated = true
      apiKeyValid = false
      googleAI = null
      return false
    }
  } catch (error) {
    console.error("Failed to initialize Google AI provider:", error)
    apiKeyValidated = true
    apiKeyValid = false
    return false
  }
}

// Function to translate text using the free Google Translate API
async function translateWithFreeAPI(text: string, fromLang: string, toLang: string): Promise<string> {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`,
    )

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Extract translated text from response
    let translatedText = ""
    if (data && data[0]) {
      data[0].forEach((item: any) => {
        if (item[0]) translatedText += item[0]
      })
    }

    return translatedText || text
  } catch (fallbackError) {
    console.error("Error using free translation API:", fallbackError)
    return text // Return original text if translation fails
  }
}

// Function to translate text from one language to another
export async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  // If text is empty or languages are the same, return the original text
  if (!text.trim() || fromLang === toLang) {
    return text
  }

  try {
    // Check API key validity if not already checked
    if (!apiKeyValidated) {
      await initializeGoogleAI()
    }

    // Only try Google AI if we have a valid API key and provider
    if (apiKeyValid && googleAI) {
      try {
        const { text: translatedText } = await generateText({
          model: googleAI("gemini-1.5-flash"),
          prompt: `Translate the following text from ${fromLang} to ${toLang}. Only respond with the translation, nothing else:
          
          "${text}"`,
        })

        if (translatedText && translatedText.trim()) {
          return translatedText.trim()
        }
      } catch (error) {
        console.error("Error using AI for translation, falling back to free API:", error)
        // Continue to fallback
      }
    }

    // Always fall back to free translation API if Google AI fails or is not available
    return await translateWithFreeAPI(text, fromLang, toLang)
  } catch (error) {
    console.error("Translation error:", error)

    // Final fallback - try the free API directly
    try {
      return await translateWithFreeAPI(text, fromLang, toLang)
    } catch (finalError) {
      console.error("Final translation fallback failed:", finalError)
      return text // Return original text if all translation attempts fail
    }
  }
}

// Function to detect emotion from text using keyword-based approach
function detectEmotionFromKeywords(text: string): Emotion {
  const lowerText = text.toLowerCase()

  if (
    lowerText.includes("happy") ||
    lowerText.includes("joy") ||
    lowerText.includes("great") ||
    lowerText.includes("wonderful") ||
    // Hindi keywords for happy
    lowerText.includes("खुश") ||
    lowerText.includes("प्रसन्न") ||
    lowerText.includes("आनंदित")
  ) {
    return "happy"
  } else if (
    lowerText.includes("sad") ||
    lowerText.includes("depressed") ||
    lowerText.includes("unhappy") ||
    lowerText.includes("miserable") ||
    // Hindi keywords for sad
    lowerText.includes("दुखी") ||
    lowerText.includes("उदास") ||
    lowerText.includes("निराश")
  ) {
    return "sad"
  } else if (
    lowerText.includes("anxious") ||
    lowerText.includes("worry") ||
    lowerText.includes("nervous") ||
    lowerText.includes("fear") ||
    // Hindi keywords for anxious
    lowerText.includes("चिंतित") ||
    lowerText.includes("घबराहट") ||
    lowerText.includes("डर")
  ) {
    return "anxious"
  } else if (
    lowerText.includes("stress") ||
    lowerText.includes("overwhelm") ||
    lowerText.includes("pressure") ||
    // Hindi keywords for stressed
    lowerText.includes("तनाव") ||
    lowerText.includes("दबाव") ||
    lowerText.includes("परेशान")
  ) {
    return "stressed"
  } else if (
    lowerText.includes("angry") ||
    lowerText.includes("mad") ||
    lowerText.includes("furious") ||
    lowerText.includes("upset") ||
    // Hindi keywords for angry
    lowerText.includes("गुस्सा") ||
    lowerText.includes("क्रोधित") ||
    lowerText.includes("नाराज")
  ) {
    return "angry"
  }

  // Default to neutral if no keywords match
  return "neutral"
}

// Function to detect emotion from text
export async function detectEmotion(text: string, offlineMode = false): Promise<Emotion> {
  try {
    // Always use keyword-based detection first
    const keywordEmotion = detectEmotionFromKeywords(text)

    // If in offline mode, just return the keyword-based emotion
    if (offlineMode) {
      return keywordEmotion
    }

    // Check API key validity if not already checked
    if (!apiKeyValidated) {
      await initializeGoogleAI()
    }

    // Only try AI-based detection if Google AI is available and API key is valid
    if (apiKeyValid && googleAI) {
      try {
        const { text: result } = await generateText({
          model: googleAI("gemini-1.5-flash"),
          prompt: `
            Analyze the following text and determine the primary emotion expressed.
            Choose exactly one emotion from this list: happy, neutral, sad, anxious, stressed, angry.
            Only respond with the emotion name, nothing else.
            
            Text: "${text}"
          `,
        })

        const aiEmotion = result.trim().toLowerCase() as Emotion

        // Validate the emotion is one of our accepted types
        if (["happy", "neutral", "sad", "anxious", "stressed", "angry"].includes(aiEmotion)) {
          return aiEmotion
        }
      } catch (innerError) {
        console.error("Error in AI emotion detection, using keyword-based fallback:", innerError)
        // Continue with keyword-based detection
      }
    }

    // Return the emotion detected by keywords if AI detection fails or is unavailable
    return keywordEmotion
  } catch (error) {
    console.error("Error detecting emotion:", error)
    // Return neutral as a safe fallback
    return "neutral"
  }
}

// Function to get AI response based on personality and emotion
export async function getAIResponse(
  userMessage: string,
  personality: Personality,
  detectedEmotion: Emotion,
  messageHistory: Message[],
  offlineMode = false,
): Promise<string> {
  // Create a context from the message history (last 10 messages)
  const recentMessages = messageHistory
    .slice(-10)
    .map((msg) => {
      const content = msg.translated && msg.role === "user" ? msg.translated : msg.content
      return `${msg.role === "user" ? "User" : "Assistant"}: ${content}`
    })
    .join("\n")

  // Create personality-specific system prompts
  const personalityPrompts = {
    supportive: `You are a supportive friend who listens and provides emotional support. 
      You're warm, empathetic, and non-judgmental. You validate feelings and offer gentle encouragement.
      The user's current emotional state appears to be: ${detectedEmotion}.`,

    therapist: `You are a professional therapist who helps people understand their thoughts and feelings. 
      You use therapeutic techniques like cognitive reframing and mindfulness. You ask thoughtful questions
      and provide evidence-based guidance.
      The user's current emotional state appears to be: ${detectedEmotion}.`,

    coach: `You are a motivational coach who helps people achieve their goals. 
      You're action-oriented, encouraging, and focused on solutions. You help break down problems
      into manageable steps and provide accountability.
      The user's current emotional state appears to be: ${detectedEmotion}.`,
  }

  // Create emotion-specific guidance
  const emotionGuidance = {
    happy: "Celebrate their positive feelings and help maintain this state.",
    neutral: "Engage them in thoughtful conversation and explore their current situation.",
    sad: "Provide comfort and validate their feelings. Offer gentle perspective when appropriate.",
    anxious: "Help them ground themselves and break down their worries. Suggest calming techniques.",
    stressed: "Acknowledge their stress and help prioritize. Suggest stress management techniques.",
    angry: "Allow them to express feelings safely. Help identify the source of anger and constructive outlets.",
  }

  // Fallback responses based on emotion and personality
  const fallbackResponses = {
    supportive: {
      happy: "That's wonderful to hear! I'm glad things are going well for you. What's been bringing you joy lately?",
      neutral: "I'm here to chat. How has your day been going so far?",
      sad: "I'm sorry you're feeling down. It's okay to feel this way, and I'm here to listen if you want to talk more about it.",
      anxious:
        "It sounds like you're feeling anxious. Let's take a deep breath together. What's on your mind right now?",
      stressed: "It seems like you're under a lot of pressure. What's one small thing we could focus on right now?",
      angry: "I can see you're upset. It's okay to feel angry sometimes. Would it help to talk about what happened?",
    },
    therapist: {
      happy: "I notice you're in a positive state. What factors do you think contributed to this feeling?",
      neutral: "How would you describe your emotional state right now? What thoughts are you having?",
      sad: "Depression and sadness are common human experiences. Can you identify what might be contributing to these feelings?",
      anxious: "Anxiety often involves worrying about future events. What specific concerns are on your mind?",
      stressed:
        "Stress is your body's response to demands. Let's identify what's causing this pressure and explore coping strategies.",
      angry: "Anger often masks other emotions. When you look beneath the anger, what other feelings might be present?",
    },
    coach: {
      happy:
        "Great energy! Let's channel this positive momentum. What's one goal you'd like to make progress on today?",
      neutral: "Let's set an intention for our conversation. What would you like to accomplish or work toward?",
      sad: "Even when motivation is low, small steps matter. What's one tiny action that might feel manageable right now?",
      anxious:
        "Let's break down what's causing worry into smaller, actionable parts. What's the most immediate concern?",
      stressed:
        "When we're overwhelmed, prioritization is key. What's the most important thing that needs your attention?",
      angry:
        "That energy can be redirected productively. Once you've processed this feeling, what constructive action could you take?",
    },
  }

  // If in offline mode, just return the fallback response
  if (offlineMode) {
    return fallbackResponses[personality][detectedEmotion]
  }

  try {
    // Skip Google AI response attempt if we know the API key is invalid
    if (!apiKeyValidated) {
      await initializeGoogleAI()
    }

    // Only attempt AI response if Google AI is available and API key is valid
    if (apiKeyValid && googleAI) {
      try {
        const { text } = await generateText({
          model: googleAI("gemini-1.5-flash"),
          system: `${personalityPrompts[personality]}
            
            Guidelines:
            - ${emotionGuidance[detectedEmotion]}
            - Keep responses concise (2-4 sentences) and conversational.
            - Never identify yourself as an AI, model, or assistant. Respond as the personality type.
            - Don't use phrases like "I understand" or "I'm sorry to hear that" too frequently.
            - Avoid clinical language unless you're in therapist mode.
            - Never suggest medical treatments or diagnose conditions.
            - If the user mentions self-harm or suicide, provide crisis resources.
            
            Recent conversation:
            ${recentMessages}`,
          prompt: userMessage,
        })

        return text
      } catch (innerError) {
        console.error("Error in AI response generation, using fallback:", innerError)
        // Continue to fallback
      }
    }

    // Use fallback responses if API call fails or no API key
    return fallbackResponses[personality][detectedEmotion]
  } catch (error) {
    console.error("Error getting AI response:", error)
    return fallbackResponses[personality][detectedEmotion]
  }
}

// Export a function to check if the API key is valid
export async function isApiKeyValid(): Promise<boolean> {
  await initializeGoogleAI()
  return apiKeyValid
}
