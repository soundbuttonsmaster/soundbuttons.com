"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowDownToLine } from "lucide-react"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import type { SoundEffect } from "@/lib/api/sound-effects"
import { generateSlug, tagToSearchSlug } from "@/lib/utils/slug"

interface SoundEffectCardProps {
  effect: SoundEffect
}

export default function SoundEffectCard({ effect }: SoundEffectCardProps) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrl = soundEffectsApi.getSoundFileUrl(effect)
  const detailPath = `/sound-effects/${generateSlug(effect.soundName) || `sound-effect-${effect.id}`}/${effect.id}`

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!audioUrl) return
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${effect.soundName || "sound"}.mp3`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!audioUrl) return
    window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: effect.id } }))
    if (!audioRef.current || audioRef.current.src !== audioUrl) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onpause = () => setIsPlaying(false)
    }
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current!.currentTime = 0
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const pauseAll = (e: Event) => {
      const ev = e as CustomEvent<{ exceptId: number }>
      if (ev.detail?.exceptId !== effect.id && audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
    window.addEventListener("pause-all-sounds", pauseAll as EventListener)
    return () => window.removeEventListener("pause-all-sounds", pauseAll as EventListener)
  }, [effect.id])

  const firstTag = effect.tags ? effect.tags.split(",")[0]?.trim() : ""

  return (
    <div
      className="block transition-all duration-200 hover:scale-105 cursor-pointer"
      onClick={() => router.push(detailPath)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && router.push(detailPath)}
    >
      <div className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition-all border border-border">
        <button
          type="button"
          className="min-w-[44px] min-h-[44px] w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 focus:outline-none p-1"
          onClick={(e) => {
            e.stopPropagation()
            handlePlayPause(e)
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="10,8 18,12 10,16" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-base font-semibold text-foreground truncate">
            {effect.soundName}
          </div>
          {firstTag && (
            <Link
              href={`/sound-effects/search/${tagToSearchSlug(firstTag)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-primary font-medium hover:underline"
            >
              {firstTag}
            </Link>
          )}
        </div>
        <button
          type="button"
          className="ml-2 min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-muted flex items-center justify-center flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            handleDownload(e)
          }}
          aria-label="Download"
        >
          <ArrowDownToLine className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
