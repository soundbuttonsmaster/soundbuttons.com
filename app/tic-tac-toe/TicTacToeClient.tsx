"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import SoundButton from "@/components/sound/sound-button"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

function getSoundUrl(sound: Sound): string {
  const url = apiClient.getSoundAudioUrl(sound as { sound_file?: string } | number)
  return typeof url === "string" ? url : ""
}

type BoardCell = null | "user" | "bot"
const WIN_LINES: [number, number][][] = [
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
]

function checkWinner(board: BoardCell[][]): {
  winner: "user" | "bot" | null
  line: [number, number][] | null
} {
  for (const line of WIN_LINES) {
    const [a, b, c] = line
    const v1 = board[a[0]][a[1]]
    const v2 = board[b[0]][b[1]]
    const v3 = board[c[0]][c[1]]
    if (v1 && v2 && v3 && v1 === v2 && v2 === v3) {
      return { winner: v1, line }
    }
  }
  return { winner: null, line: null }
}

function getBestBotMove(board: BoardCell[][]): [number, number] {
  for (const line of WIN_LINES) {
    const cells = line.map(([i, j]) => board[i][j])
    if (cells.filter((c) => c === "bot").length === 2 && cells.includes(null)) {
      const idx = cells.findIndex((c) => c === null)
      return line[idx]
    }
  }
  for (const line of WIN_LINES) {
    const cells = line.map(([i, j]) => board[i][j])
    if (cells.filter((c) => c === "user").length === 2 && cells.includes(null)) {
      const idx = cells.findIndex((c) => c === null)
      return line[idx]
    }
  }
  if (!board[1][1]) return [1, 1]
  const empties: [number, number][] = []
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (!cell) empties.push([i, j])
    })
  )
  return empties[Math.floor(Math.random() * empties.length)]
}

export default function TicTacToeClient() {
  const [sounds, setSounds] = useState<Sound[]>([])
  const [board, setBoard] = useState<BoardCell[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])
  const [turn, setTurn] = useState<"user" | "bot">("user")
  const [winner, setWinner] = useState<null | "user" | "bot" | "draw">(null)
  const [winningLine, setWinningLine] = useState<[number, number][] | null>(null)
  const [effect, setEffect] = useState<"confetti" | "botwin" | null>(null)
  const [playerSound, setPlayerSound] = useState<Sound | null>(null)
  const [botSound, setBotSound] = useState<Sound | null>(null)
  const [selecting, setSelecting] = useState(true)

  useEffect(() => {
    async function loadSounds() {
      const [trending, latest] = await Promise.all([
        apiClient.getTrendingSounds(1, 50),
        apiClient.getNewSounds(1, 50),
      ])
      const combined = [
        ...trending.data,
        ...latest.data.filter((s) => !trending.data.some((t) => t.id === s.id)),
      ]
      setSounds(combined)
    }
    loadSounds()
  }, [])

  useEffect(() => {
    const { winner: w, line } = checkWinner(board)
    if (w) {
      setWinner(w)
      setWinningLine(line)
      setTurn("user")
      setTimeout(() => {
        setEffect(w === "user" ? "confetti" : "botwin")
        const sound = w === "user" ? playerSound : botSound
        if (sound) {
          const url = getSoundUrl(sound)
          if (url) new Audio(url).play().catch(() => {})
        }
      }, 400)
    } else if (board.flat().every((cell) => cell)) {
      setWinner("draw")
      setWinningLine(null)
      setTurn("user")
      setTimeout(() => {
        if (playerSound) {
          const url = getSoundUrl(playerSound)
          if (url) new Audio(url).play().catch(() => {})
        }
      }, 400)
    }
  }, [board])

  useEffect(() => {
    if (turn === "bot" && !winner && playerSound && botSound) {
      const { winner: currentWinner } = checkWinner(board)
      if (currentWinner) return
      const empties = board.flat().filter((cell) => !cell).length
      if (empties === 0) return
      const timeout = setTimeout(() => {
        const { winner: timeoutWinner } = checkWinner(board)
        if (timeoutWinner) return
        const move = getBestBotMove(board)
        const [i, j] = move
        const newBoard = board.map((row) => [...row])
        newBoard[i][j] = "bot"
        setBoard(newBoard)
        const url = getSoundUrl(botSound)
        if (url) new Audio(url).play().catch(() => {})
        setTurn("user")
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [turn, board, winner, playerSound, botSound])

  const handleCellClick = (i: number, j: number) => {
    if (winner || turn !== "user" || board[i][j] || !playerSound) return
    const newBoard = board.map((row) => [...row])
    newBoard[i][j] = "user"
    setBoard(newBoard)
    const url = getSoundUrl(playerSound)
    if (url) new Audio(url).play().catch(() => {})
    setTurn("bot")
  }

  const handleSoundSelect = (sound: Sound) => {
    setPlayerSound(sound)
    let botPick = sound
    while (botPick.id === sound.id && sounds.length > 1) {
      botPick = sounds[Math.floor(Math.random() * sounds.length)]
    }
    setBotSound(botPick)
    setSelecting(false)
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ])
    setTurn("user")
    setWinner(null)
    setEffect(null)
    setWinningLine(null)
  }

  const resetGame = () => setSelecting(true)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-2">Tic Tac Toe with Sound Buttons</h1>
        <p className="text-center text-lg text-muted-foreground mb-8 max-w-xl">
          Pick your sound button and color! You and the bot will play with your chosen sounds. First
          to 3 in a row wins.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-6 w-full max-w-[600px] mx-auto">
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg px-4 py-4 border-2 border-blue-400 min-w-[140px] max-w-[180px] w-full">
            <div className="mb-2">
              {playerSound && (
                <SoundButton sound={playerSound} hideLabel hideActions customSize={64} isAboveTheFold />
              )}
            </div>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">You</span>
            <span className="text-xs text-muted-foreground text-center break-words">
              {playerSound?.name || "—"}
            </span>
            {turn === "user" && (
              <span className="mt-1 inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                Your Turn
              </span>
            )}
          </div>
          <div className="hidden md:block text-2xl font-bold text-muted-foreground">VS</div>
          <div className="flex flex-col items-center bg-card rounded-xl shadow-lg px-4 py-4 border-2 border-pink-400 min-w-[140px] max-w-[180px] w-full">
            <div className="mb-2">
              {botSound && (
                <SoundButton sound={botSound} hideLabel hideActions customSize={64} isAboveTheFold />
              )}
            </div>
            <span className="font-bold text-pink-600 dark:text-pink-400 text-sm">Bot</span>
            <span className="text-xs text-muted-foreground text-center break-words">
              {botSound?.name || "—"}
            </span>
            {turn === "bot" && (
              <span className="mt-1 inline-block bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                Bot&apos;s Turn
              </span>
            )}
          </div>
        </div>
        <div className="flex md:hidden text-xl font-bold text-muted-foreground mb-2">VS</div>

        <div className="w-full flex justify-center mb-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-[400px] aspect-square">
            {board.map((row, i) =>
              row.map((cell, j) => {
                const isWinningCell =
                  winningLine && winningLine.some(([wi, wj]) => wi === i && wj === j)
                return (
                  <div
                    key={`${i}-${j}`}
                    className={`flex items-center justify-center border-4 rounded-2xl cursor-pointer transition-all duration-200
                      ${cell === "user" ? "border-blue-500" : ""}
                      ${cell === "bot" ? "border-pink-500" : ""}
                      ${!cell ? "border-gray-200 dark:border-gray-700 hover:border-blue-400" : ""}
                      ${isWinningCell ? "shadow-xl scale-105 border-yellow-400" : ""}
                    `}
                    onClick={() => handleCellClick(i, j)}
                  >
                    {isWinningCell && effect === "confetti" && (
                      <span className="absolute text-4xl animate-bounce">🎉</span>
                    )}
                    {isWinningCell && effect === "botwin" && (
                      <span className="absolute text-4xl animate-pulse">💀</span>
                    )}
                    {cell === "user" && playerSound && (
                      <SoundButton sound={playerSound} hideLabel hideActions customSize={80} isAboveTheFold />
                    )}
                    {cell === "bot" && botSound && (
                      <SoundButton sound={botSound} hideLabel hideActions customSize={80} isAboveTheFold />
                    )}
                    {!cell && <span className="text-4xl text-gray-300">+</span>}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {winner && (
          <div className="mb-6 text-2xl font-bold text-center">
            {winner === "user" && <span className="text-green-600">You win! 🎉</span>}
            {winner === "bot" && <span className="text-pink-600">Bot wins! 🤖</span>}
            {winner === "draw" && <span className="text-muted-foreground">It&apos;s a draw!</span>}
          </div>
        )}

        <Button
          onClick={resetGame}
          className="mb-8 text-xl px-12 py-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold hover:opacity-90 transition"
        >
          Play Again
        </Button>

        <section className="w-full max-w-3xl bg-card rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold mb-4 text-center">About Tic Tac Toe with Sound Buttons</h2>
          <p className="mb-4 text-muted-foreground text-center">
            Pick your favorite sound button, challenge a smart bot, and enjoy fun sound effects with
            every move. First to get 3 in a row wins!
          </p>
          <h3 className="text-lg font-semibold mb-2">How to Play</h3>
          <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1">
            <li>Pick your sound button from the selection.</li>
            <li>The bot will pick a different sound.</li>
            <li>Take turns placing your sound. Each move plays your chosen sound.</li>
            <li>First to 3 in a row wins!</li>
          </ul>
          <details className="py-2">
            <summary className="font-semibold cursor-pointer">Can I play again with different sounds?</summary>
            <p className="mt-2 text-muted-foreground">Yes! Click &quot;Play Again&quot; to pick new sounds.</p>
          </details>
          <details className="py-2">
            <summary className="font-semibold cursor-pointer">Is the bot really smart?</summary>
            <p className="mt-2 text-muted-foreground">The bot blocks your wins and tries to win. Can you beat it?</p>
          </details>
        </section>

        <div className="mt-8">
          <Link href="/games">
            <Button variant="outline" size="lg">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>

      {selecting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-center">Pick Your Sound Button</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[360px] overflow-y-auto">
              {sounds.map((sound) => (
                <div key={sound.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleSoundSelect(sound)}
                    className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                  >
                    <SoundButton sound={sound} hideLabel hideActions customSize={72} isAboveTheFold />
                  </button>
                  <span
                    className="mt-2 text-sm font-medium text-center break-words line-clamp-2"
                    style={{ maxWidth: "100px" }}
                  >
                    {sound.name}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSelecting(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
