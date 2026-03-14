"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import SoundButton from "@/components/sound/sound-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Volume2, Trophy, Star, Target } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

function getSoundUrl(sound: Sound): string {
  const url = apiClient.getSoundAudioUrl(sound as { sound_file?: string } | number)
  return typeof url === "string" ? url : ""
}

interface Mole {
  id: number
  isVisible: boolean
  isHit: boolean
  position: { x: number; y: number }
}

export default function WhackAMoleClient() {
  const [sounds, setSounds] = useState<Sound[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120)
  const [moles, setMoles] = useState<Mole[]>([])
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null)
  const [selecting, setSelecting] = useState(true)
  const [highScore, setHighScore] = useState(0)
  const [gameSpeed] = useState(800)
  const [loading, setLoading] = useState(true)

  const loadSounds = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const result = await apiClient.getTrendingSounds(page, 20)
      setSounds(result.data)
    } catch {
      setSounds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSounds(1)
  }, [loadSounds])

  useEffect(() => {
    const saved = localStorage.getItem("whack-a-mole-high-score")
    if (saved) setHighScore(parseInt(saved, 10))
  }, [])

  const initializeMoles = useCallback(() => {
    const positions = [
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 90, y: 10 },
      { x: 10, y: 50 },
      { x: 50, y: 50 },
      { x: 90, y: 50 },
      { x: 10, y: 90 },
      { x: 50, y: 90 },
      { x: 90, y: 90 },
    ]
    setMoles(
      positions.map((pos, i) => ({
        id: i,
        isVisible: false,
        isHit: false,
        position: pos,
      }))
    )
  }, [])

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setGameStarted(false)
      setGameOver(true)
      if (score > highScore) {
        setHighScore(score)
        localStorage.setItem("whack-a-mole-high-score", String(score))
      }
    }
  }, [gameStarted, gameOver, timeLeft, score, highScore])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const interval = setInterval(() => {
      setMoles((prev) => {
        const available = prev.filter((m) => !m.isVisible)
        if (available.length === 0) return prev
        const random = available[Math.floor(Math.random() * available.length)]
        return prev.map((m) =>
          m.id === random.id ? { ...m, isVisible: true, isHit: false } : m
        )
      })
    }, gameSpeed)
    return () => clearInterval(interval)
  }, [gameStarted, gameOver, gameSpeed])

  useEffect(() => {
    if (!gameStarted || gameOver) return
    const interval = setInterval(() => {
      setMoles((prev) =>
        prev.map((m) =>
          m.isVisible ? { ...m, isVisible: false, isHit: false } : m
        )
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  const handleSoundSelect = (sound: Sound) => {
    setSelectedSound(sound)
    setSelecting(false)
    initializeMoles()
    setTimeout(() => {
      setGameStarted(true)
      setGameOver(false)
      setScore(0)
      setTimeLeft(120)
    }, 500)
  }

  const whackMole = (moleId: number) => {
    if (!gameStarted || gameOver) return
    setMoles((prev) => {
      const mole = prev.find((m) => m.id === moleId)
      if (!mole || !mole.isVisible || mole.isHit) return prev
      if (selectedSound) {
        const url = getSoundUrl(selectedSound)
        if (url) new Audio(url).play().catch(() => {})
      }
      setScore((s) => s + 10)
      return prev.map((m) =>
        m.id === moleId ? { ...m, isHit: true, isVisible: false } : m
      )
    })
  }

  const resetGame = () => {
    setSelecting(true)
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
    setTimeLeft(120)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100 dark:from-green-950 dark:via-yellow-950 dark:to-orange-950 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce" />
      <div className="absolute top-32 right-20 w-12 h-12 bg-yellow-300 rounded-full opacity-20 animate-pulse" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-green-400 to-yellow-500 p-4 rounded-full shadow-lg">
              <Target className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                Whack-a-Mole!
              </h1>
            </div>
          </div>
          <p className="text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
            Hit the moles as they pop up and score points in 2 minutes! Each mole plays your chosen
            sound when you whack it.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <div className="bg-card rounded-xl p-3 shadow-lg border-2 border-green-200 dark:border-green-800">
            <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600 dark:text-green-400">Score: {score}</div>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-lg border-2 border-orange-200 dark:border-orange-800">
            <Gamepad2 className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              Time: {timeLeft}s
            </div>
          </div>
          <div className="bg-card rounded-xl p-3 shadow-lg border-2 border-purple-200 dark:border-purple-800">
            <Star className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              Best: {highScore}
            </div>
          </div>
        </div>

        {selecting && (
          <div className="mb-8">
            <Card className="max-w-4xl mx-auto shadow-xl border-4 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-green-600 dark:text-green-400">
                  Choose Your Sound!
                </CardTitle>
                <CardDescription className="text-center">
                  Pick a sound that will play when you whack the moles!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12 text-muted-foreground">
                    Loading sounds...
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-h-64 overflow-y-auto">
                    {sounds.map((sound) => (
                      <button
                        key={sound.id}
                        type="button"
                        onClick={() => handleSoundSelect(sound)}
                        className="cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                      >
                        <SoundButton
                          sound={sound}
                          hideLabel={false}
                          customSize={64}
                          isAboveTheFold
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!selecting && (
          <div className="flex justify-center mb-8">
            <div className="relative bg-gradient-to-br from-green-200 to-yellow-200 dark:from-green-800 dark:to-yellow-800 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-green-300 dark:border-green-700 max-w-2xl w-full">
              {!gameStarted && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center z-10 rounded-3xl bg-black/20">
                  <Button
                    onClick={resetGame}
                    size="lg"
                    className="text-xl py-6 px-8 bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold"
                  >
                    Start Game
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 md:gap-4 aspect-square">
                {moles.map((mole) => (
                  <div
                    key={mole.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => whackMole(mole.id)}
                    onKeyDown={(e) => e.key === "Enter" && whackMole(mole.id)}
                    className="relative aspect-square bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-700 dark:to-orange-700 rounded-2xl border-4 border-yellow-500 dark:border-yellow-600 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="absolute inset-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl" />
                    {mole.isVisible && !mole.isHit && (
                      <div className="absolute inset-1 flex items-center justify-center">
                        <span className="text-4xl md:text-6xl">🐹</span>
                      </div>
                    )}
                    {mole.isHit && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl animate-ping">💥</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="text-center space-y-4 mb-8">
            <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
              Game Over!
            </div>
            <div className="text-xl text-muted-foreground">
              Final Score: <span className="font-bold text-green-600">{score}</span>
            </div>
            {score === highScore && score > 0 && (
              <div className="text-lg font-bold text-yellow-600">New High Score!</div>
            )}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold"
              >
                Play Again
              </Button>
              <Button variant="outline" onClick={resetGame}>
                Change Sound
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-center bg-card/80 rounded-2xl p-6 border">
          <h3 className="text-xl font-bold mb-4">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-2xl mb-2">1</div>
              <div className="font-bold">Choose Sound</div>
              <div className="text-sm text-muted-foreground">Pick your favorite sound effect</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-2xl mb-2">2</div>
              <div className="font-bold">Hit Moles</div>
              <div className="text-sm text-muted-foreground">Click on moles as they pop up</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-2xl mb-2">3</div>
              <div className="font-bold">Score Points</div>
              <div className="text-sm text-muted-foreground">10 points per mole in 2 minutes</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/games">
            <Button variant="outline" size="lg">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
