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
import { getApiKey, setApiKey } from "@/lib/api-config"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Key, Settings, Languages } from "lucide-react"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AccountPage() {
  const { toast } = useToast()
  const router = useRouter()

  // API key state
  const [apiKey, setApiKeyState] = useState("")
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false)

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

  // Handle API key update
  const handleApiKeyUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingApiKey(true)

    try {
      // Update API key in local storage
      setApiKey(apiKey)

      toast({
        title: "API Key Updated",
        description: "Your API key has been updated successfully.",
      })
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
              <CardTitle>API Key</CardTitle>
              <CardDescription>Manage your Google Gemini API key</CardDescription>
            </CardHeader>
            <form onSubmit={handleApiKeyUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Google Gemini API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKeyState(e.target.value)}
                    placeholder="Enter your API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally and never sent to our servers.
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
              <CardFooter>
                <Button type="submit" disabled={isUpdatingApiKey} className="w-full sm:w-auto">
                  {isUpdatingApiKey ? "Updating..." : "Update API Key"}
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
                  {isUpdatingPreferences ? "Saving..." : "Save Preferences"}
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
                  {isUpdatingLanguage ? "Updating..." : "Update Language"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
