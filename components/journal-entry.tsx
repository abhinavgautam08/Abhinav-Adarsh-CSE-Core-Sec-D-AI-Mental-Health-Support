"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { Emotion } from "@/lib/types"
import { format } from "date-fns"
import { Edit, Save } from "lucide-react"

interface JournalEntryProps {
  entry: {
    content: string
    emotion: Emotion
    timestamp: Date
  }
  onSave: (content: string) => void
}

export function JournalEntry({ entry, onSave }: JournalEntryProps) {
  const [isEditing, setIsEditing] = useState(entry.content === "")
  const [content, setContent] = useState(entry.content)

  const handleSave = () => {
    onSave(content)
    setIsEditing(false)
  }

  // Get emoji for emotion
  const emotionEmojis: Record<Emotion, string> = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    anxious: "😰",
    stressed: "😓",
    angry: "😠",
  }

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-lg sm:text-xl">{emotionEmojis[entry.emotion]}</span>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {format(new Date(entry.timestamp), "MMM d, yyyy h:mm a")}
          </span>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
            autoFocus
          />
          <Button onClick={handleSave} className="w-full text-xs sm:text-sm">
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Save Entry
          </Button>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-sm sm:text-base">{content}</p>
      )}
    </Card>
  )
}
