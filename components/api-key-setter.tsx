"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { updateApiKey } from "@/lib/ai-helpers"
import { useToast } from "@/hooks/use-toast"
import { Key, RefreshCw } from "lucide-react"
import { getDefaultApiKey } from "@/lib/api-config"

interface ApiKeySetterProps {
  onApiKeySet: (isValid: boolean) => void
}

export function ApiKeySetter({ onApiKeySet }: ApiKeySetterProps) {
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Load the default API key on component mount
  useEffect(() => {
    setApiKey(getDefaultApiKey())
  }, [])

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const isValid = await updateApiKey(apiKey)

      if (isValid) {
        toast({
          title: "API Key Valid",
          description: "Your API key has been validated and is now being used.",
        })
        onApiKeySet(true)
      } else {
        toast({
          title: "Invalid API Key",
          description: "The provided API key is invalid. Please check and try again.",
          variant: "destructive",
        })
        onApiKeySet(false)
      }
    } catch (error) {
      console.error("Error updating API key:", error)
      toast({
        title: "API Key Error",
        description: "There was an error updating your API key.",
        variant: "destructive",
      })
      onApiKeySet(false)
    } finally {
      setIsLoading(false)
    }
  }

  const useDefaultKey = () => {
    setApiKey(getDefaultApiKey())
    toast({
      title: "Default Key Set",
      description: "The default API key has been entered. Click 'Set API Key' to use it.",
    })
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Set Google API Key</h3>
      <div className="space-y-4">
        <div className="relative">
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google API key"
            className="pr-10"
            type="password"
          />
          <Key className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={useDefaultKey} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Use Default Key
          </Button>
          <Button onClick={handleSetApiKey} disabled={isLoading} className="flex-1">
            {isLoading ? "Validating..." : "Set API Key"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Your API key is stored locally in your browser and is never sent to our servers.
        </p>
      </div>
    </Card>
  )
}
