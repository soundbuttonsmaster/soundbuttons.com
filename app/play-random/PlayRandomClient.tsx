"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Dice5, Sparkles, ArrowLeft, Volume2 } from "lucide-react"
import SoundButton from "@/components/sound/sound-button"
import type { Sound } from "@/lib/types/sound"

const getRandomItem = (arr: Sound[]): Sound => arr[Math.floor(Math.random() * arr.length)]

interface PlayRandomClientProps {
  initialSounds: Sound[]
}

function useSoundButtonSize() {
  const [size, setSize] = useState(200)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setSize(w < 640 ? 120 : w < 768 ? 160 : 200)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  return size
}

export default function PlayRandomClient({ initialSounds }: PlayRandomClientProps) {
  const [sounds] = useState<Sound[]>(initialSounds)
  const [randomSound, setRandomSound] = useState<Sound | null>(null)
  const [animating, setAnimating] = useState(false)
  const [mascotDance, setMascotDance] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const soundButtonSize = useSoundButtonSize()

  const playRandom = useCallback(() => {
    if (sounds.length === 0) return
    window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: null } }))
    setAnimating(true)
    setMascotDance(true)
    setConfetti(false)
    setRevealed(false)

    setTimeout(() => {
      setRandomSound(getRandomItem(sounds))
      setConfetti(true)
      setTimeout(() => setRevealed(true), 50)
      setAnimating(false)
      setTimeout(() => setMascotDance(false), 1200)
    }, 600)
  }, [sounds])

  useEffect(() => {
    if (sounds.length > 0 && !randomSound) {
      playRandom()
    }
  }, [sounds]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && !animating && sounds.length > 0) {
        e.preventDefault()
        playRandom()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [playRandom, animating, sounds.length])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 transition-all">
      <div className="flex flex-col items-center justify-center flex-1 py-3 px-3 sm:py-5 md:py-8">
        {/* Mascot - compact on small screens */}
        <div className="flex flex-col items-center mb-1 sm:mb-3">
          <span
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl transition-transform duration-500 ${
              mascotDance ? "animate-bounce" : ""
            }`}
            role="img"
            aria-label="Dancing Cat"
          >
            🐱‍👓
          </span>
          <span className="text-xs sm:text-sm md:text-base font-bold text-pink-500 dark:text-pink-400 mt-0.5 sm:mt-1">
            {mascotDance ? "Yay! That was fun!" : "Let's play a random sound!"}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-center mb-1 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2 text-pink-600 dark:text-pink-400 drop-shadow-lg flex-wrap px-1">
          <Dice5 className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-yellow-500 dark:text-yellow-400 animate-bounce shrink-0" />
          Play Random Sound Buttons
          <span className="px-1.5 py-0.5 sm:ml-1 sm:px-2 sm:py-1 bg-green-800 text-white rounded-full text-[10px] sm:text-xs font-bold animate-pulse">
            NEW
          </span>
        </h1>
        <p className="mb-2 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-lg text-center text-blue-700 dark:text-blue-200 font-semibold max-w-xl px-1">
          One click unlocks a surprise sound from our meme soundboard. Try your luck and keep the fun rolling!{" "}
          <Sparkles className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-pink-400 dark:text-pink-300 animate-pulse" />
        </p>

        {/* Main card area - compact height on mobile */}
        <div className="relative w-full max-w-2xl min-h-[180px] sm:min-h-[280px] md:min-h-[360px] flex items-center justify-center mb-3 sm:mb-5 md:mb-8">
          {sounds.length === 0 ? (
            <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-xl md:rounded-2xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center gap-2 sm:gap-4 text-sm sm:text-lg text-gray-500 dark:text-gray-400">
              <Volume2 className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" />
              No sounds found.
            </div>
          ) : (
            <>
              {/* Confetti when animating - same as sbmain */}
              {animating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce">🎉</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl animate-bounce absolute" style={{ animationDelay: "0.2s" }}>
                    🎈
                  </span>
                  <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce absolute" style={{ animationDelay: "0.3s" }}>
                    ✨
                  </span>
                </div>
              )}

              {/* Extra confetti burst on reveal */}
              {confetti && !animating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                  {["🎉", "✨", "🎈", "🌟", "💫"].map((emoji, i) => (
                    <div key={i} className="absolute" style={{ transform: `rotate(${i * 72}deg)` }}>
                      <span
                        className="block text-2xl sm:text-3xl md:text-4xl animate-play-random-confetti"
                        style={{ animationDelay: `${i * 0.06}s`, animationFillMode: "forwards" }}
                      >
                        {emoji}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sound display */}
              {randomSound && (
                <div
                  className={`flex flex-col items-center transition-all duration-500 ${
                    animating ? "scale-75 opacity-0" : "scale-100 opacity-100"
                  } ${revealed ? "animate-play-random-spin-in" : ""}`}
                  key={randomSound.id}
                >
                  <SoundButton
                    sound={randomSound}
                    customSize={soundButtonSize}
                    hideLabel
                    hideActions
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Play Random button - compact on small screens */}
        <button
          type="button"
          onClick={playRandom}
          disabled={sounds.length === 0 || animating}
          className="relative overflow-hidden bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white text-base sm:text-lg md:text-xl font-bold rounded-xl sm:rounded-2xl px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-6 shadow-xl shadow-blue-500/30 hover:shadow-blue-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mb-2 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-blue-500/20"
          aria-label="Play random sound"
        >
          <Dice5 className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 shrink-0 ${animating ? "animate-spin" : ""}`} />
          Play Random
        </button>

        {/* Back button */}
        <Link
          href="/"
          className="mt-3 sm:mt-5 md:mt-10 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full border-2 border-blue-400 dark:border-blue-500 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 text-sm sm:text-base md:text-xl font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          Back to Home
        </Link>

        <div className="mt-2 sm:mt-4 md:mt-8 text-center text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-300">
          <b>Tip:</b> Try again and again for more fun sounds!
        </div>

        {sounds.length > 0 && (
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono text-[10px] sm:text-xs">Space</kbd> to
            spin • {sounds.length.toLocaleString()} sounds in the pool
          </p>
        )}
      </div>

      {/* SEO Content Section - compact on small screens */}
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 mt-4 sm:mt-8 md:mt-16 mb-6 sm:mb-10 md:mb-12">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-3xl font-bold mb-3 sm:mb-6 text-center text-blue-600 dark:text-blue-400">
            🎲 What is Play Random Sound?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">
            <strong>Play Random Sound</strong> lets you click once and hear a random sound button that might be funny,
            nostalgic, or totally unexpected. Each tap of the Play Random button pulls from thousands of new and
            trending sound effects, so the surprise never stops.
          </p>

          <h3 className="text-base sm:text-lg md:text-2xl font-bold mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-4 text-blue-600 dark:text-blue-400">
            ✨ How to Use Random Sound Generator
          </h3>

          <ul className="space-y-1.5 sm:space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li>
              <strong>🎯 Search and Find New Favorites:</strong> Discover sounds you never thought to search for and
              uncover hidden gems.
            </li>
            <li>
              <strong>🎉 Entertainment:</strong> Perfect for parties, games, or just sharing laughs with friends and
              family.
            </li>
            <li>
              <strong>⚡ One Click = Fun, Fast & Easy:</strong> Skip browsing—just click and enjoy.
            </li>
            <li>
              <strong>🔄 A New Experience Every Time:</strong> With thousands of sound buttons, no two spins feel the
              same.
            </li>
            <li>
              <strong>👨‍👩‍👧‍👦 Family Friendly:</strong> Safe, hilarious fun that kids and adults can enjoy together.
            </li>
          </ul>

          <h3 className="text-base sm:text-lg md:text-2xl font-bold mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-4 text-blue-600 dark:text-blue-400">
            🎮 Four Easy Steps to Use Play Random
          </h3>

          <ol className="space-y-1.5 sm:space-y-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li>
              <strong>1. Click the Play Random Button:</strong> Tap the colorful button to instantly generate a new
              sound.
            </li>
            <li>
              <strong>2. Listen & Enjoy:</strong> The audio plays automatically—have fun with the surprise.
            </li>
            <li>
              <strong>3. Play Again:</strong> Keep clicking for endless random sound adventures.
            </li>
            <li>
              <strong>4. Share Fun with Friends:</strong> When you hit a hilarious clip, spread the joy.
            </li>
          </ol>

          <h3 className="text-base sm:text-lg md:text-2xl font-bold mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-4 text-blue-600 dark:text-blue-400">
            🌟 Characteristics of the Random Sound Player
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 sm:p-4 rounded-lg">
              <strong>📱 Mobile Friendly</strong>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Runs smoothly on phones, tablets, and desktops.</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-2.5 sm:p-4 rounded-lg">
              <strong>🚀 Quick Loading</strong>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Sounds fire instantly—no buffering, no delays.</p>
            </div>
            <div className="bg-pink-50 dark:bg-pink-900/30 p-2.5 sm:p-4 rounded-lg">
              <strong>🎨 Fun Interface</strong>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Colorful animations and our playful mascot keep every spin exciting.</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2.5 sm:p-4 rounded-lg">
              <strong>🔊 High Quality</strong>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Each clip is hand-selected for crisp audio.</p>
            </div>
          </div>

          <h3 className="text-base sm:text-lg md:text-2xl font-bold mt-4 sm:mt-6 md:mt-8 mb-2 sm:mb-4 text-blue-600 dark:text-blue-400">
            💡 Added Use Cases
          </h3>

          <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            <li>🎭 <strong>Icebreakers:</strong> Kick off conversations and events with a random laugh.</li>
            <li>🎪 <strong>Party Entertainment:</strong> Keep celebrations lively with unexpected audio.</li>
            <li>🎬 <strong>Unique Content:</strong> Grab distinct sounds for videos, livestreams, and podcasts.</li>
            <li>😄 <strong>Comedy & Pranks:</strong> Create hilarious moments on demand.</li>
            <li>🧘 <strong>Stress Relief:</strong> Take a playful break and reset your mood.</li>
            <li>🎓 <strong>Educational Enjoyment:</strong> Teachers use the random player for fun class interludes.</li>
          </ul>

          <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-5 md:p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg text-center">
            <p className="text-base sm:text-lg md:text-xl font-bold text-blue-700 dark:text-blue-300 mb-1 sm:mb-2">
              🎉 Are You Ready to Have Even More Fun?
            </p>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
              With thousands of meme sounds, viral audio, trending music, and classic clips, SoundButtons.com is your
              go-to destination for endless audio entertainment. Spin the Random Sound Player now and uncover your next
              favorite button!
            </p>
          </div>

          <div className="mt-3 sm:mt-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <p>
              🔗 <strong>Related:</strong> Check out our{" "}
              <Link href="/trends" className="text-blue-600 dark:text-blue-400 hover:underline">
                trending sounds
              </Link>
              , explore{" "}
              <Link href="/new" className="text-blue-600 dark:text-blue-400 hover:underline">
                new sound buttons
              </Link>
              , or browse organized{" "}
              <Link href="/categories" className="text-blue-600 dark:text-blue-400 hover:underline">
                sound categories
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
