import type { Emotion } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { format, subDays } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MoodTrackerProps {
  emotions: { emotion: Emotion; timestamp: Date }[]
}

export function MoodTracker({ emotions }: MoodTrackerProps) {
  // Create data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, "MMM dd"),
      timestamp: date,
      value: 0,
      count: 0,
    }
  })

  // Map emotions to numerical values
  const emotionValues: Record<Emotion, number> = {
    happy: 5,
    neutral: 3,
    sad: 1,
    anxious: 2,
    stressed: 2,
    angry: 1,
  }

  // Aggregate emotions by day
  emotions.forEach((emotion) => {
    const day = last7Days.find(
      (d) => format(d.timestamp, "yyyy-MM-dd") === format(new Date(emotion.timestamp), "yyyy-MM-dd"),
    )
    if (day) {
      day.value += emotionValues[emotion.emotion]
      day.count += 1
    }
  })

  // Calculate average mood per day
  const chartData = last7Days.map((day) => ({
    date: day.date,
    mood: day.count > 0 ? day.value / day.count : null,
  }))

  // Get the most recent emotion
  const currentMood = emotions.length > 0 ? emotions[emotions.length - 1].emotion : "neutral"

  // Get emoji for current mood
  const moodEmojis: Record<Emotion, string> = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
    anxious: "😰",
    stressed: "😓",
    angry: "😠",
  }

  // Get color for current mood
  const moodColors: Record<Emotion, string> = {
    happy: "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700",
    neutral: "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
    sad: "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700",
    anxious: "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700",
    stressed: "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
    angry: "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700",
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h3 className="font-medium text-sm sm:text-base">Current Mood</h3>
        <Card className={`p-3 sm:p-4 mt-1 sm:mt-2 border-2 ${moodColors[currentMood]}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl sm:text-2xl font-bold capitalize">{currentMood}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {emotions.length > 0
                  ? `Last updated ${format(new Date(emotions[emotions.length - 1].timestamp), "h:mm a")}`
                  : "No data yet"}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl">{moodEmojis[currentMood]}</div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="font-medium text-sm sm:text-base">Mood History</h3>
        <Card className="p-3 sm:p-4 mt-1 sm:mt-2 h-[180px] sm:h-[200px]">
          {emotions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip
                  formatter={(value: any) => {
                    if (value === null) return ["No data", ""]
                    const numValue = Number(value)
                    if (numValue >= 4.5) return ["Happy", ""]
                    if (numValue >= 3.5) return ["Good", ""]
                    if (numValue >= 2.5) return ["Neutral", ""]
                    if (numValue >= 1.5) return ["Low", ""]
                    return ["Very Low", ""]
                  }}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-xs sm:text-sm">
              No data available yet
            </div>
          )}
        </Card>
      </div>

      {/* Recent Mood Changes */}
      {emotions.length > 1 && (
        <div>
          <h3 className="font-medium text-sm sm:text-base">Recent Mood Changes</h3>
          <div className="mt-1 sm:mt-2 space-y-2">
            {emotions
              .slice(-5)
              .reverse()
              .map((emotion, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{moodEmojis[emotion.emotion]}</span>
                    <span className="text-sm capitalize">{emotion.emotion}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{format(new Date(emotion.timestamp), "h:mm a")}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
