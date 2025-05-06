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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Languages } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

interface SettingsDialogProps {
  onLanguageChange: (language: string) => void
  onAutoMessageChange: (enabled: boolean) => void
  currentLanguage: string
  autoMessageEnabled: boolean
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({
  onLanguageChange,
  onAutoMessageChange,
  currentLanguage,
  autoMessageEnabled,
  isOpen,
  onOpenChange,
}: SettingsDialogProps) {
  const [language, setLanguage] = useState(currentLanguage)
  const { toast } = useToast()

  const handleSave = () => {
    // Save language preference
    if (language !== currentLanguage) {
      onLanguageChange(language)
      toast({
        title: "Language Updated",
        description: `Voice input language set to ${language === "en-US" ? "English" : "Hindi"}.`,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your application settings.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="language" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="language" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <Label>Voice Input Language</Label>
              </div>

              <RadioGroup value={language} onValueChange={setLanguage} className="grid grid-cols-1 gap-4">
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
          </TabsContent>

          <TabsContent value="features" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-message">Auto Message Mood</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically send a message when a new mood is detected
                  </p>
                </div>
                <Switch id="auto-message" checked={autoMessageEnabled} onCheckedChange={onAutoMessageChange} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
