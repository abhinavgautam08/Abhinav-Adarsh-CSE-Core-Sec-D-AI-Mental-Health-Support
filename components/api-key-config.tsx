"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Key } from "lucide-react"

interface ApiKeyConfigProps {
  onApiKeyChange: (apiKey: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeyConfig({ onApiKeyChange, isOpen, onOpenChange }: ApiKeyConfigProps) {
  const [apiKey, setApiKey] = useState("")
  const { toast } = useToast()

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid API key.",
        variant: "destructive",
      })
      return
    }

    // Save the API key
    onApiKeyChange(apiKey)

    toast({
      title: "API Key Updated",
      description: "Your API key has been updated successfully.",
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update API Key</DialogTitle>
          <DialogDescription>Enter your Google API key to enable AI-powered features.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google API key"
                className="pr-10"
              />
              <Key className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
