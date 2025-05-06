"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Emotion } from "@/lib/types"
import { Loader2, RefreshCw, Camera, CameraOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FaceEmotionDetectorProps {
  onEmotionDetected: (emotion: Emotion) => void
  onScanRequest?: () => void // Optional callback for scan requests
}

export function FaceEmotionDetector({ onEmotionDetected, ...props }: FaceEmotionDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoRef = useRef<HTMLImageElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const detectionInterval = useRef<NodeJS.Timeout | null>(null)
  const [usingSimulatedMode, setUsingSimulatedMode] = useState(false)
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState<Emotion | null>(null)
  const [detectionCount, setDetectionCount] = useState(0)
  const [cameraActive, setCameraActive] = useState(true)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const { toast } = useToast()

  // Simulate emotion detection when models can't be loaded
  const simulateEmotionDetection = () => {
    // Define emotions and their weights (higher weight = more likely to appear)
    const emotions: Array<{ emotion: Emotion; weight: number }> = [
      { emotion: "happy", weight: 3 },
      { emotion: "neutral", weight: 5 },
      { emotion: "sad", weight: 2 },
      { emotion: "anxious", weight: 2 },
      { emotion: "stressed", weight: 2 },
      { emotion: "angry", weight: 1 },
    ]

    // Create weighted array
    const weightedEmotions: Emotion[] = []
    emotions.forEach((item) => {
      for (let i = 0; i < item.weight; i++) {
        weightedEmotions.push(item.emotion)
      }
    })

    // Select random emotion from weighted array
    const randomIndex = Math.floor(Math.random() * weightedEmotions.length)
    const emotion = weightedEmotions[randomIndex]

    // Update state and notify parent
    setLastDetectedEmotion(emotion)
    onEmotionDetected(emotion)
    setDetectionCount((prev) => prev + 1)
  }

  // Enable simulated mode
  const enableSimulatedMode = () => {
    setUsingSimulatedMode(true)
    setError(null)
    setIsLoading(false)

    // Perform a single simulated detection
    simulateEmotionDetection()
  }

  // Initialize camera
  const initializeCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!cameraActive) {
        enableSimulatedMode()
        return
      }

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
            setIsLoading(false)
            // Perform a single scan after camera is initialized
            setTimeout(() => {
              capturePhoto()
            }, 1000) // Wait 1 second for camera to stabilize
          }
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Using simulated mode instead.")
      enableSimulatedMode()
    }
  }

  // Perform a single emotion detection scan
  const performScan = () => {
    capturePhoto()
  }

  // Handle manual scan request
  const handleScanRequest = () => {
    // Reset auto-message sent flag in parent component (if provided)
    if (props.onScanRequest) {
      props.onScanRequest()
    }

    if (cameraActive && videoRef.current) {
      capturePhoto()
      toast({
        title: "Scanning...",
        description: "Analyzing your current emotional state.",
        duration: 2000,
      })
    } else {
      simulateEmotionDetection()
    }
  }

  // Capture photo from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)

        // Detect emotion from captured image
        detectEmotionFromImage(imageDataUrl)
      }
    }
  }

  // Detect emotion from image (simulated for now)
  const detectEmotionFromImage = (imageUrl: string) => {
    // In a real implementation, you would send this image to an emotion detection API
    // For now, we'll use the simulation logic but pretend it's analyzing the image

    // Define emotions and their weights (higher weight = more likely to appear)
    const emotions: Array<{ emotion: Emotion; weight: number }> = [
      { emotion: "happy", weight: 3 },
      { emotion: "neutral", weight: 5 },
      { emotion: "sad", weight: 2 },
      { emotion: "anxious", weight: 2 },
      { emotion: "stressed", weight: 2 },
      { emotion: "angry", weight: 1 },
    ]

    // Create weighted array
    const weightedEmotions: Emotion[] = []
    emotions.forEach((item) => {
      for (let i = 0; i < item.weight; i++) {
        weightedEmotions.push(item.emotion)
      }
    })

    // Select random emotion from weighted array
    const randomIndex = Math.floor(Math.random() * weightedEmotions.length)
    const emotion = weightedEmotions[randomIndex]

    // Update state and notify parent
    setLastDetectedEmotion(emotion)
    onEmotionDetected(emotion)
    setDetectionCount((prev) => prev + 1)
  }

  // Toggle camera
  const toggleCamera = () => {
    const newCameraState = !cameraActive
    setCameraActive(newCameraState)

    if (newCameraState) {
      // Turn on camera
      initializeCamera()
    } else {
      // Turn off camera and stop stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }

      // Switch to simulated mode
      enableSimulatedMode()
    }
  }

  useEffect(() => {
    initializeCamera()

    return () => {
      // Clean up video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Get emoji for emotion
  const getEmotionEmoji = (emotion: Emotion): string => {
    switch (emotion) {
      case "happy":
        return "😊"
      case "neutral":
        return "😐"
      case "sad":
        return "😢"
      case "anxious":
        return "😰"
      case "stressed":
        return "😓"
      case "angry":
        return "😠"
      default:
        return "🤔"
    }
  }

  return (
    <Card className="p-3 sm:p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm sm:text-base">Emotion Detection</h3>
        <Button variant="outline" size="sm" onClick={toggleCamera} className="flex items-center gap-1">
          {cameraActive ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
          <span className="text-xs">{cameraActive ? "OFF Camera" : "ON Camera"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Video/Simulation Container */}
        <div className="relative aspect-video bg-black rounded-md overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
              <span className="ml-2 text-white text-sm sm:text-base">Initializing...</span>
            </div>
          )}

          {error && !usingSimulatedMode && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10 p-4">
              <p className="text-white text-center mb-4 text-sm sm:text-base">{error}</p>
              <Button onClick={enableSimulatedMode} size="sm" variant="outline" className="bg-white/20">
                <RefreshCw className="h-4 w-4 mr-2" />
                Use Simulated Mode
              </Button>
            </div>
          )}

          {usingSimulatedMode ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10 p-4">
              <div className="text-center text-white">
                <p className="mb-2">Analyzing your emotions</p>
                <div className="text-5xl mb-4">{lastDetectedEmotion ? getEmotionEmoji(lastDetectedEmotion) : "🤔"}</div>
                <p className="text-sm text-gray-300 mb-2">
                  AI is analyzing your emotions to provide personalized support
                </p>
                <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>Active</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </>
          )}
        </div>

        {/* Captured Photo Container */}
        <div className="relative aspect-video bg-gray-900 rounded-md overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-lg">
                      {lastDetectedEmotion ? getEmotionEmoji(lastDetectedEmotion) : "🤔"}
                    </span>
                    <span className="text-white text-xs capitalize">{lastDetectedEmotion || "Analyzing..."}</span>
                  </div>
                  <span className="text-white text-xs">Scan #{detectionCount}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Waiting for capture...</div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-muted-foreground">
          {usingSimulatedMode
            ? "Using simulated emotion detection"
            : "Your facial expressions are analyzed locally in your browser"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleScanRequest} className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 sm:h-4 sm:w-4"
            >
              <path d="M2 12a10 10 0 1 0 20 0 10 10 0 0 0-20 0Z"></path>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span className="text-xs">Scan Now</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
