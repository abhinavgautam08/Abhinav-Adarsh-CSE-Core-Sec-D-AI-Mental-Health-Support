// API Configuration file
// This file stores API keys and configuration settings

// Default API key (can be set from environment variable)
const DEFAULT_API_KEY = process.env.GOOGLE_API_KEY || ""

// Store API key configuration
let apiKey: string = DEFAULT_API_KEY

// Function to get the current API key
export function getApiKey(): string {
  // Try to get from localStorage if in browser environment
  if (typeof window !== "undefined") {
    const storedKey = localStorage.getItem("gemini_api_key")
    if (storedKey) {
      return storedKey
    }
  }
  return apiKey
}

// Function to set a new API key
export function setApiKey(newApiKey: string): void {
  apiKey = newApiKey

  // Store in localStorage if in browser environment
  if (typeof window !== "undefined") {
    localStorage.setItem("gemini_api_key", newApiKey)
  }
}

// Function to check if an API key exists
export function hasApiKey(): boolean {
  return getApiKey().trim() !== ""
}

// Function to clear the API key
export function clearApiKey(): void {
  apiKey = DEFAULT_API_KEY

  // Remove from localStorage if in browser environment
  if (typeof window !== "undefined") {
    localStorage.removeItem("gemini_api_key")
  }
}
