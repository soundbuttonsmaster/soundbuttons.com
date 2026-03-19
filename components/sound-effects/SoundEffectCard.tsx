"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowDownToLine, Copy, Check } from "lucide-react"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import type { SoundEffect } from "@/lib/api/sound-effects"
import { generateSlug, tagToSearchSlug } from "@/lib/utils/slug"

interface SoundEffectCardProps {
  effect: SoundEffect
}

export default function SoundEffectCard({ effect }: SoundEffectCardProps) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)
  const audioUrl = soundEffectsApi.getSoundFileUrl(effect)
  const detailPath = `/sound-effects/${generateSlug(effect.soundName) || `sound-effect-${effect.id}`}/${effect.id}`

  const syncIsPlaying = (value: boolean) => {
    isPlayingRef.current = value
    setIsPlaying(value)
  }

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

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    const link = typeof window !== "undefined" ? `${window.location.origin}${detailPath}` : detailPath
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link)
      } else {
        const ta = document.createElement("textarea")
        ta.value = link
        ta.style.cssText = "position:fixed;left:-9999px;top:0"
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
      }
    } catch {
      const ta = document.createElement("textarea")
      ta.value = link
      ta.style.cssText = "position:fixed;left:-9999px;top:0"
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handlePlayPause = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!audioUrl) return

    if (isPlayingRef.current) {
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
      }
      syncIsPlaying(false)
      return
    }

    window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: effect.id } }))

    const audio = new Audio(audioUrl)
    audio.setAttribute("playsinline", "true")
    audio.onended = () => syncIsPlaying(false)
    audioRef.current = audio

    const p = audio.play()
    if (p && typeof p.then === "function") {
      p.then(() => syncIsPlaying(true)).catch(() => syncIsPlaying(false))
    } else {
      syncIsPlaying(true)
    }
  }

  useEffect(() => {
    const pauseAll = (e: Event) => {
      const ev = e as CustomEvent<{ exceptId: number }>
      if (ev.detail?.exceptId !== effect.id) {
        if (audioRef.current) {
          try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
        }
        syncIsPlaying(false)
      }
    }
    window.addEventListener("pause-all-sounds", pauseAll as EventListener)
    return () => {
      window.removeEventListener("pause-all-sounds", pauseAll as EventListener)
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
      }
    }
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
          onClick={handleCopyLink}
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
        </button>
        <button
          type="button"
          className="ml-1 min-w-[44px] min-h-[44px] p-2 rounded-full hover:bg-muted flex items-center justify-center flex-shrink-0"
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
