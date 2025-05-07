"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getApiKey, setApiKey, clearApiKey, resetToDefaultApiKey, getDefaultApiKey } from "@/lib/api-config"
import { updateApiKey } from "@/lib/ai-helpers"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Key, Settings, Languages, Check, X, Loader2, Copy, Trash } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AccountPage() {
  const { toast } = useToast()
  const router = useRouter()

  // API key state
  const [apiKey, setApiKeyState] = useState("")
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false)
  const [isTestingApiKey, setIsTestingApiKey] = useState(false)
  const [apiKeyStatus, setApiKeyStatus] = useState<"valid" | "invalid" | "untested">("untested")
  const [showApiKey, setShowApiKey] = useState(false)

  // Preferences state
  const [autoMessageEnabled, setAutoMessageEnabled] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false)

  // Language state
  const [voiceLanguage, setVoiceLanguage] = useState("en-US")
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false)

  // Load saved settings on component mount
  useEffect(() => {
    // Load API key
    const savedApiKey = getApiKey() || ""
    setApiKeyState(savedApiKey)

    // Check if API key is valid on load
    if (savedApiKey) {
      checkApiKeyValidity(savedApiKey)
    }

    // Load other settings from localStorage if available
    try {
      const savedSettings = localStorage.getItem("app_settings")
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        if (settings.autoMessageEnabled !== undefined) setAutoMessageEnabled(settings.autoMessageEnabled)
        if (settings.offlineMode !== undefined) setOfflineMode(settings.offlineMode)
        if (settings.voiceLanguage) setVoiceLanguage(settings.voiceLanguage)
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error)
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settings = {
        autoMessageEnabled,
        offlineMode,
        voiceLanguage,
      }
      localStorage.setItem("app_settings", JSON.stringify(settings))
    } catch (error) {
      console.error("Error saving settings to localStorage:", error)
    }
  }

  // Check if API key is valid
  const checkApiKeyValidity = async (keyToCheck: string) => {
    setIsTestingApiKey(true)
    try {
      const valid = await updateApiKey(keyToCheck)
      setApiKeyStatus(valid ? "valid" : "invalid")
      return valid
    } catch (error) {
      console.error("Error checking API key validity:", error)
      setApiKeyStatus("invalid")
      return false
    } finally {
      setIsTestingApiKey(false)
    }
  }

  // Handle API key update
  const handleApiKeyUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingApiKey(true)

    try {
      if (!apiKey.trim()) {
        toast({
          title: "API Key Required",
          description: "Please enter a valid API key.",
          variant: "destructive",
        })
        setIsUpdatingApiKey(false)
        return
      }

      // Test the API key before saving
      const isValid = await checkApiKeyValidity(apiKey)

      if (isValid) {
        // Update API key in local storage
        setApiKey(apiKey)

        toast({
          title: "API Key Updated",
          description: "Your API key has been validated and saved successfully.",
        })
      } else {
        toast({
          title: "Invalid API Key",
          description: "The API key could not be validated. Please check and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating API key:", error)
      toast({
        title: "Update Failed",
        description: "There was a problem updating your API key.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingApiKey(false)
    }
  }

  // Handle API key test
  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to test.",
        variant: "destructive",
      })
      return
    }

    const isValid = await checkApiKeyValidity(apiKey)

    if (isValid) {
      toast({
        title: "API Key Valid",
        description: "The API key was successfully validated.",
      })
    } else {
      toast({
        title: "Invalid API Key",
        description: "The API key could not be validated. Please check and try again.",
        variant: "destructive",
      })
    }
  }

  // Handle API key clear
  const handleClearApiKey = () => {
    setApiKeyState("")
    clearApiKey()
    setApiKeyStatus("untested")
    toast({
      title: "API Key Cleared",
      description: "Your API key has been removed.",
    })
  }

  // Copy API key to clipboard
  const handleCopyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      toast({
        title: "API Key Copied",
        description: "Your API key has been copied to clipboard.",
      })
    }
  }

  // Handle preferences update
  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPreferences(true)

    try {
      // Save preferences to localStorage
      saveSettings()

      toast({
        title: "Preferences Updated",
        description: "Your preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating preferences:", error)
      toast({
        title: "Update Failed",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPreferences(false)
    }
  }

  // Handle language update
  const handleLanguageUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingLanguage(true)

    try {
      // Save language preference to localStorage
      saveSettings()

      toast({
        title: "Language Updated",
        description: `Voice input language set to ${voiceLanguage === "en-US" ? "English" : "Hindi"}.`,
      })
    } catch (error) {
      console.error("Error updating language:", error)
      toast({
        title: "Update Failed",
        description: "There was a problem updating your language preference.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingLanguage(false)
    }
  }

  // Handle reset to default API key
  const handleResetToDefaultApiKey = () => {
    resetToDefaultApiKey()
    setApiKeyState(getDefaultApiKey())
    checkApiKeyValidity(getDefaultApiKey())
    toast({
      title: "Default API Key Restored",
      description: "The application's default API key has been restored.",
    })
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </Link>
        </div>
        <ModeToggle />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <Tabs defaultValue="api-key" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="api-key" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Key</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Language</span>
          </TabsTrigger>
        </TabsList>

        {/* API Key Tab */}
        <TabsContent value="api-key">
          <Card>
            <CardHeader>
              <CardTitle>Google Gemini API Key</CardTitle>
              <CardDescription>Manage your API key for AI-powered features</CardDescription>
            </CardHeader>
            <form onSubmit={handleApiKeyUpdate}>
              <CardContent className="space-y-4">
                {apiKeyStatus === "valid" && (
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      Your API key is valid and working correctly.
                    </AlertDescription>
                  </Alert>
                )}

                {apiKeyStatus === "invalid" && (
                  <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-600 dark:text-red-400">
                      Your API key is invalid or has expired. Please update it.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="api-key">API Key</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="h-6 px-2 text-xs"
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKeyState(e.target.value)
                        setApiKeyStatus("untested")
                      }}
                      placeholder="Enter your Google Gemini API key"
                      className={`pr-20 ${
                        apiKeyStatus === "valid"
                          ? "border-green-500 focus-visible:ring-green-300"
                          : apiKeyStatus === "invalid"
                            ? "border-red-500 focus-visible:ring-red-300"
                            : ""
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      {apiKey && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleCopyApiKey}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy API key</span>
                        </Button>
                      )}
                      {apiKey && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleClearApiKey}
                          className="h-6 w-6 text-red-500"
                        >
                          <Trash className="h-3 w-3" />
                          <span className="sr-only">Clear API key</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and never sent to our servers.
                    {apiKey === getDefaultApiKey() && (
                      <span className="ml-1 text-green-600 dark:text-green-400">
                        Currently using the default API key.
                      </span>
                    )}
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">How to get a Google Gemini API key:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>
                      Go to{" "}
                      <a
                        href="https://ai.google.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Google AI Studio
                      </a>
                    </li>
                    <li>Sign in with your Google account</li>
                    <li>Navigate to the API keys section</li>
                    <li>Create a new API key</li>
                    <li>Copy and paste it here</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetToDefaultApiKey}
                  className="w-full sm:w-auto"
                >
                  Reset to Default
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestApiKey}
                  disabled={isTestingApiKey || !apiKey.trim()}
                  className="w-full sm:w-auto"
                >
                  {isTestingApiKey ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Test API Key"
                  )}
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingApiKey || isTestingApiKey || !apiKey.trim()}
                  className="w-full sm:w-auto"
                >
                  {isUpdatingApiKey ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save API Key"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Customize your application experience</CardDescription>
            </CardHeader>
            <form onSubmit={handlePreferencesUpdate}>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-message">Auto Message Mood</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send a message when a new mood is detected
                    </p>
                  </div>
                  <Switch id="auto-message" checked={autoMessageEnabled} onCheckedChange={setAutoMessageEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offline-mode">Offline Mode</Label>
                    <p className="text-sm text-muted-foreground">Use local responses without making API calls</p>
                  </div>
                  <Switch id="offline-mode" checked={offlineMode} onCheckedChange={setOfflineMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <ModeToggle />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdatingPreferences} className="w-full sm:w-auto">
                  {isUpdatingPreferences ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Configure language preferences for voice input and interface</CardDescription>
            </CardHeader>
            <form onSubmit={handleLanguageUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <Label>Voice Input Language</Label>
                  </div>

                  <RadioGroup value={voiceLanguage} onValueChange={setVoiceLanguage} className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="en-US" id="en-US" />
                      <Label htmlFor="en-US" className="font-normal">
                        English (US)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hi-IN" id="hi-IN" />
                      <Label htmlFor="hi-IN" className="font-normal">
                        Hindi (India)
                      </Label>
                    </div>
                  </RadioGroup>

                  <p className="text-xs text-muted-foreground">
                    Select the language for voice input. This affects speech recognition only.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdatingLanguage} className="w-full sm:w-auto">
                  {isUpdatingLanguage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Language"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
