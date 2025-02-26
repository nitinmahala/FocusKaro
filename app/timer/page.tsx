"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TimerPage() {
  const [mode, setMode] = useState<"work" | "break">("work")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      if (audioRef.current && !isMuted) {
        audioRef.current.play()
      }

      if (mode === "work") {
        toast.success("Work session complete! Time for a break.")
        setMode("break")
        setTimeLeft(breakDuration * 60)
      } else {
        toast.success("Break complete! Back to work.")
        setMode("work")
        setTimeLeft(workDuration * 60)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode, workDuration, breakDuration, isMuted])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === "work" ? workDuration * 60 : breakDuration * 60)
  }

  const handleWorkDurationChange = (value: string) => {
    const duration = Number.parseInt(value)
    setWorkDuration(duration)
    if (mode === "work" && !isActive) {
      setTimeLeft(duration * 60)
    }
  }

  const handleBreakDurationChange = (value: string) => {
    const duration = Number.parseInt(value)
    setBreakDuration(duration)
    if (mode === "break" && !isActive) {
      setTimeLeft(duration * 60)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = mode === "work" ? 1 - timeLeft / (workDuration * 60) : 1 - timeLeft / (breakDuration * 60)

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-3xl font-bold mb-8">Pomodoro Timer</h1>

        <Tabs defaultValue="timer" className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="flex flex-col items-center">
            <div className="relative w-64 h-64 mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={mode === "work" ? "#3b82f6" : "#10b981"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress) }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-lg font-medium capitalize text-muted-foreground mt-2">
                  {mode} {isActive ? "in progress" : "paused"}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className="w-24 h-12 transition-all"
                variant={isActive ? "outline" : "default"}
              >
                {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isActive ? "Pause" : "Start"}
              </Button>
              <Button size="lg" variant="outline" onClick={resetTimer} className="w-24 h-12">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="mt-2"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6 p-4 border border-border/40 rounded-lg bg-card/30 backdrop-blur-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Duration</label>
                <Select value={workDuration.toString()} onValueChange={handleWorkDurationChange} disabled={isActive}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Work" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Break Duration</label>
                <Select value={breakDuration.toString()} onValueChange={handleBreakDurationChange} disabled={isActive}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Break" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setWorkDuration(25)
                    setBreakDuration(5)
                    if (mode === "work") {
                      setTimeLeft(25 * 60)
                    } else {
                      setTimeLeft(5 * 60)
                    }
                    toast.success("Settings reset to default")
                  }}
                >
                  Reset to Default
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

