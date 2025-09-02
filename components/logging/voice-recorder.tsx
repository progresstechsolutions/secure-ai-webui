"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Play, Pause, RotateCcw, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, transcript?: string) => void
  onCancel?: () => void
  maxDuration?: number // in seconds
  className?: string
}

type RecordingState = "idle" | "recording" | "paused" | "completed" | "playing"

export function VoiceRecorder({
  onRecordingComplete,
  onCancel,
  maxDuration = 300, // 5 minutes default
  className,
}: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcript, setTranscript] = useState<string>("")
  const [error, setError] = useState<string>("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        setRecordingState("completed")

        // Simulate transcription (in real app, this would call a transcription service)
        setTimeout(() => {
          setTranscript(
            "This is a simulated transcription of your voice recording. In a real implementation, this would be the actual transcribed text from your speech.",
          )
        }, 1000)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setRecordingState("recording")
      setDuration(0)

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1
          if (newDuration >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return newDuration
        })
      }, 1000)
    } catch (err) {
      setError("Unable to access microphone. Please check your permissions.")
      console.error("Recording error:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setRecordingState("playing")

      audioRef.current.onended = () => {
        setRecordingState("completed")
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  const pausePlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setRecordingState("completed")
    }
  }

  const resetRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    setRecordingState("idle")
    setDuration(0)
    setAudioBlob(null)
    setTranscript("")
    setError("")
  }

  const handleComplete = () => {
    if (audioBlob) {
      onRecordingComplete?.(audioBlob, transcript)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (duration / maxDuration) * 100

  return (
    <div className={cn("space-y-6", className)}>
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Voice Recording</h2>
        <p className="text-muted-foreground text-sm">
          {recordingState === "idle" && "Tap the microphone to start recording"}
          {recordingState === "recording" && "Recording your voice..."}
          {recordingState === "completed" && "Review your recording below"}
          {recordingState === "playing" && "Playing back your recording"}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <Card className="p-4 border-destructive/20 bg-destructive/5">
          <p className="text-destructive text-sm text-center">{error}</p>
        </Card>
      )}

      {/* Recording visualization */}
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Main recording button */}
          <div className="relative">
            <Button
              size="lg"
              variant={recordingState === "recording" ? "destructive" : "default"}
              onClick={recordingState === "idle" ? startRecording : stopRecording}
              disabled={recordingState === "completed" || recordingState === "playing"}
              className={cn(
                "w-20 h-20 rounded-full p-0 transition-all duration-200",
                recordingState === "recording" && "animate-pulse",
              )}
              aria-label={recordingState === "recording" ? "Stop recording" : "Start recording"}
            >
              {recordingState === "recording" ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>

            {/* Recording indicator ring */}
            {recordingState === "recording" && (
              <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping" />
            )}
          </div>

          {/* Duration and progress */}
          {(recordingState === "recording" || recordingState === "completed" || recordingState === "playing") && (
            <div className="w-full space-y-2">
              <div className="text-center">
                <span className="text-2xl font-mono font-semibold text-foreground">{formatTime(duration)}</span>
                <span className="text-muted-foreground text-sm ml-2">/ {formatTime(maxDuration)}</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          )}
        </div>
      </Card>

      {/* Playback controls */}
      {recordingState === "completed" && audioBlob && (
        <Card className="p-4">
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={playRecording} aria-label="Play recording">
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            <Button variant="outline" size="sm" onClick={resetRecording} aria-label="Record again">
              <RotateCcw className="h-4 w-4 mr-2" />
              Record Again
            </Button>
          </div>
        </Card>
      )}

      {/* Playback controls during playback */}
      {recordingState === "playing" && (
        <Card className="p-4">
          <div className="flex items-center justify-center">
            <Button variant="outline" size="sm" onClick={pausePlayback} aria-label="Pause playback">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          </div>
        </Card>
      )}

      {/* Transcript preview */}
      {transcript && recordingState === "completed" && (
        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Transcript Preview</h3>
            <p className="text-sm text-muted-foreground italic">{transcript}</p>
          </div>
        </Card>
      )}

      {/* Action buttons */}
      {recordingState === "completed" && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleComplete} className="flex-1" disabled={!audioBlob}>
            <Check className="h-4 w-4 mr-2" />
            Use Recording
          </Button>
        </div>
      )}
    </div>
  )
}
