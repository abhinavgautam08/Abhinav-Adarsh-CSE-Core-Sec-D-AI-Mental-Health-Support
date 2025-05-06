import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%]", isUser ? "ml-auto" : "mr-auto")}>
      {!isUser && (
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div className="max-w-full">
        <div
          className={cn(
            "rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          )}
        >
          {message.content}

          {/* Show translation if available */}
          {message.translated && (
            <div className="mt-2 pt-2 border-t border-primary-foreground/20 text-xs sm:text-sm opacity-80">
              <Badge variant="outline" className="mb-1 text-xs">
                Translated from Hindi
              </Badge>
              <div>{message.translated}</div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
