"use client"

import React, {
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
} from "react"
import { Heart, Share2, Download } from "lucide-react"
import { Heart as HeartFilled } from "lucide-react"
import type { Sound } from "@/lib/types/sound"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api/client"
import ShareModal from "@/components/share/share-modal"

interface CompactSoundButtonProps {
  sound: Sound & { sound_file: string }
  isAboveTheFold?: boolean
  customSize?: number
  hideLabel?: boolean
  hideActions?: boolean
}

let audioContext: AudioContext | null = null
let audioContextUnlocked = false

function unlockAudioContextOnce() {
  if (audioContextUnlocked || typeof window === "undefined") return
  audioContextUnlocked = true
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)()
    }
    if (audioContext?.state === "suspended") {
      audioContext.resume().catch(() => {})
    }
  } catch {}
  document.removeEventListener("click", unlockAudioContextOnce, true)
  document.removeEventListener("touchstart", unlockAudioContextOnce, true)
  document.removeEventListener("keydown", unlockAudioContextOnce, true)
}

const getIsMobile = (): boolean => {
  if (typeof navigator === "undefined") return false
  return (
    /iPhone|iPad|iPod|Android|webOS|Mobile/i.test(navigator.userAgent) ||
    (typeof window !== "undefined" &&
      "ontouchstart" in window &&
      window.innerWidth < 1024)
  )
}

const audioCache = new Map<string, HTMLAudioElement>()
const MAX_CACHE_SIZE = getIsMobile() ? 5 : 50

function createAudio(audioUrl: string): HTMLAudioElement {
  if (audioCache.has(audioUrl)) {
    const cached = audioCache.get(audioUrl)!
    if (cached.currentTime > 0) cached.currentTime = 0
    if (!cached.paused) {
      cached.pause()
      cached.currentTime = 0
    }
    return cached
  }
  if (audioCache.size >= MAX_CACHE_SIZE) {
    const first = audioCache.keys().next().value
    if (first) {
      const a = audioCache.get(first)
      if (a) {
        try {
          a.pause()
          a.src = ""
        } catch {}
      }
      audioCache.delete(first)
    }
  }
  const audio = new Audio(audioUrl)
  audio.preload = "auto"
  audio.crossOrigin = "anonymous"
  audio.setAttribute("playsinline", "true")
  audio.setAttribute("webkit-playsinline", "true")
  audio.load()
  return audio
}

function normalizeAudioUrl(sound: Sound & { sound_file: string }): string | null {
  return apiClient.getSoundAudioUrl(sound) || null
}

const CompactSoundButton: React.FC<CompactSoundButtonProps> = ({
  sound,
  isAboveTheFold = false,
  customSize,
  hideLabel = false,
  hideActions = false,
}) => {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTouchAtRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const nameSlug = React.useMemo(() => {
    const base =
      sound.name
        ?.toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "sound"
    return base
  }, [sound.name])

  const detailUrl = `/${nameSlug}/${sound.id}`

  useEffect(() => {
    if (typeof document === "undefined" || audioContextUnlocked) return
    document.addEventListener("click", unlockAudioContextOnce, true)
    document.addEventListener("touchstart", unlockAudioContextOnce, true)
    document.addEventListener("keydown", unlockAudioContextOnce, true)
    return () => {
      document.removeEventListener("click", unlockAudioContextOnce, true)
      document.removeEventListener("touchstart", unlockAudioContextOnce, true)
      document.removeEventListener("keydown", unlockAudioContextOnce, true)
    }
  }, [])

  const handlePlay = useCallback(async () => {
    if (typeof window !== "undefined") {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext)()
        } catch {}
      }
      if (audioContext?.state === "suspended") {
        await audioContext.resume().catch(() => {})
      }
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setIsLoading(false)
      return
    }

    window.dispatchEvent(
      new CustomEvent("pause-all-sounds", { detail: { exceptId: sound.id } })
    )

    const audioUrl = normalizeAudioUrl(sound)
    if (!audioUrl) return

    let audio = audioRef.current
    if (!audio || audio.src !== audioUrl) {
      audio = createAudio(audioUrl)
      audioRef.current = audio
      if (!audioCache.has(audioUrl)) audioCache.set(audioUrl, audio)

      audio.onended = () => {
        setIsPlaying(false)
        setIsLoading(false)
        setIsPressed(false)
        window.dispatchEvent(
          new CustomEvent("sound-ended", { detail: { soundId: sound.id } })
        )
      }
      audio.onerror = () => {
        setIsPlaying(false)
        setIsLoading(false)
        audioCache.delete(audioUrl)
      }
    }

    audio.currentTime = 0
    if (!audio.paused) {
      audio.pause()
      audio.currentTime = 0
    }

    setIsPressed(true)
    setIsLoading(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsLoading(false), 3000)

    try {
      await audio.play()
      setIsPlaying(true)
      setIsLoading(false)
    } catch {
      setIsPlaying(false)
      setIsLoading(false)
    }
  }, [isPlaying, sound.id, sound.name, sound.sound_file])

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(detailUrl)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/login?redirect=${encodeURIComponent(detailUrl)}`)
  }

  useEffect(() => {
    const handlePauseAll = (e: Event) => {
      const ev = e as CustomEvent<{ exceptId: number | null }>
      if (ev.detail?.exceptId !== sound.id && audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
        setIsLoading(false)
      }
    }
    const handleAutoPlay = (e: Event) => {
      const ev = e as CustomEvent<{ soundId: number }>
      if (ev.detail?.soundId === sound.id) {
        setIsPressed(true)
        setTimeout(() => setIsPressed(false), 150)
        handlePlay()
      }
    }
    window.addEventListener("pause-all-sounds", handlePauseAll as EventListener)
    window.addEventListener("play-sound-auto", handleAutoPlay as EventListener)
    return () => {
      window.removeEventListener(
        "pause-all-sounds",
        handlePauseAll as EventListener
      )
      window.removeEventListener(
        "play-sound-auto",
        handleAutoPlay as EventListener
      )
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [sound.id, handlePlay])

  const colorPalette = [
    "#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181", "#AA96DA",
    "#FCBAD3", "#A8E6CF", "#FFD3A5", "#C7CEEA", "#FF8B94", "#FFD93D",
    "#6BCB77", "#FF6B9D", "#C44569", "#F8B500", "#4A90E2", "#9B59B6",
    "#1ABC9C", "#E74C3C", "#3498DB", "#F39C12",
  ]
  const innerHex = colorPalette[sound.id % colorPalette.length]

  const baseSize = customSize ?? 90
  const size = Math.floor(baseSize * 0.92)
  const buttonSize = Math.floor(size * 1.15)
  const isDetailPage = customSize !== undefined && customSize >= 200

  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return r
      ? {
          r: parseInt(r[1], 16),
          g: parseInt(r[2], 16),
          b: parseInt(r[3], 16),
        }
      : { r: 107, g: 114, b: 128 }
  }
  const rgb = hexToRgb(innerHex)
  const buttonId = `button-${sound.id}`
  const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b]
      .map((x) =>
        Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")
      )
      .join("")}`

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center"
      style={{
        width: isDetailPage ? `${customSize}px` : "100%",
        minWidth: isDetailPage ? `${customSize}px` : "auto",
      }}
    >
      <div
        className={`sound-button-container w-full aspect-square ${isPressed ? "pressed" : ""}`}
        role="button"
        aria-label={`Play ${sound.name}`}
        onClick={(e) => {
          e.preventDefault()
          if (Date.now() - lastTouchAtRef.current < 400) return
          handlePlay()
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => {
          setIsPressed(true)
          lastTouchAtRef.current = Date.now()
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          handlePlay()
          setIsPressed(false)
        }}
        style={{
          cursor: "pointer",
          position: "relative",
          overflow: "visible",
          width: isDetailPage ? `${customSize}px` : "100%",
          maxWidth: isDetailPage ? `${customSize}px` : "100%",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          className="w-full h-auto"
          style={{
            display: "block",
            overflow: "visible",
            width: "100%",
            aspectRatio: "1/1",
          }}
        >
          <defs>
            <style>{`
              .cls-2-${buttonId} { fill: ${innerHex}; }
              .cls-3-${buttonId} { fill: ${rgbToHex(rgb.r - 20, rgb.g - 20, rgb.b - 20)}; }
              .button-top-${buttonId} { transition: transform 0.15s ease-out; transform-origin: center; }
            `}</style>
          </defs>
          <g className="button-base">
            <ellipse
              cx="497.32"
              cy="552.26"
              rx="410.95"
              ry="280.5"
              fill="#b0aaab"
            />
          </g>
          <g
            className={`button-top-${buttonId}`}
            transform={
              isPressed
                ? "translate(0, 25) scale(0.95, 0.92)"
                : "translate(0, 0)"
            }
          >
            <ellipse
              className={`cls-3-${buttonId}`}
              cx="495.79"
              cy="349.14"
              rx="363.78"
              ry="243.13"
            />
            <ellipse
              className={`cls-2-${buttonId}`}
              cx="494.83"
              cy="349.01"
              rx="363.47"
              ry="243.26"
            />
          </g>
        </svg>

        {isLoading && (
          <div
            className="loading-ring"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${buttonSize + 20}px`,
              height: `${buttonSize + 20}px`,
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <svg width={buttonSize + 20} height={buttonSize + 20}>
              <circle
                cx={(buttonSize + 20) / 2}
                cy={(buttonSize + 20) / 2}
                r={(buttonSize + 20) / 2 - 3}
                fill="none"
                stroke={innerHex}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={Math.PI * (buttonSize + 20)}
                strokeDashoffset={Math.PI * (buttonSize + 20) * 0.75}
                opacity="0.6"
                className="animate-spin"
                style={{ transformOrigin: "center" }}
              />
            </svg>
          </div>
        )}
      </div>

      {!hideLabel && (
        <Link
          href={detailUrl}
          prefetch={isAboveTheFold}
          className="text-center block w-full max-w-[90px] sm:max-w-[95px] md:max-w-[100px] lg:max-w-[104px] mt-1"
          aria-label={`${sound.name} - view details`}
        >
          <span
            className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition-colors cursor-pointer leading-tight text-center break-words line-clamp-2 block"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {sound.name}
          </span>
        </Link>
      )}

      {!hideActions && (
        <div className="flex items-center justify-center gap-1.5 mt-1.5 mb-1">
          <button
            onClick={handleFavorite}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            style={{
              background: "linear-gradient(135deg, #f9a8d4 0%, #fb7185 100%)",
            }}
            title="Add to favorites"
          >
            <HeartFilled className="w-4 h-4 text-white drop-shadow-sm" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowShareModal(true)
            }}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            style={{
              background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
            }}
            title="Share"
          >
            <Share2 className="w-4 h-4 text-white drop-shadow-sm" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-full transition-all hover:scale-110 flex items-center justify-center shadow-md"
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
            }}
            title="Download / Details"
          >
            <Download className="w-4 h-4 text-white drop-shadow-sm" />
          </button>
        </div>
      )}

      <ShareModal
        soundName={sound.name || ""}
        soundId={sound.id}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  )
}

export default memo(CompactSoundButton)
