"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { Volume2 } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { getSoundDetailPath } from "@/lib/utils/slug"
import type { ProcessedSound } from "@/lib/api/client"

interface CompactSoundButtonProps {
  sound: ProcessedSound
}

export default function CompactSoundButton({ sound }: CompactSoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  const syncIsPlaying = (value: boolean) => {
    isPlayingRef.current = value
    setIsPlaying(value)
  }

  useEffect(() => {
    const handler = (e: CustomEvent<{ exceptId?: number }>) => {
      if (e.detail?.exceptId === sound.id) return
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
      }
      syncIsPlaying(false)
    }
    window.addEventListener("pause-all-sounds", handler as EventListener)
    return () => {
      window.removeEventListener("pause-all-sounds", handler as EventListener)
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
      }
    }
  }, [sound.id])

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const url = apiClient.getSoundAudioUrl(sound.id)
      if (!url) return

      if (isPlayingRef.current) {
        if (audioRef.current) {
          try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
        }
        syncIsPlaying(false)
        return
      }

      window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: sound.id } }))

      const audio = new Audio(url)
      audio.setAttribute("playsinline", "true")
      audio.onended = () => syncIsPlaying(false)
      audioRef.current = audio

      const p = audio.play()
      if (p && typeof p.then === "function") {
        p.then(() => syncIsPlaying(true)).catch(() => syncIsPlaying(false))
      } else {
        syncIsPlaying(true)
      }
    },
    [sound.id]
  )

  const detailPath = getSoundDetailPath(sound.name, sound.id)

  return (
    <div className="flex flex-col items-center gap-2">
      <Link
        href={detailPath}
        className="flex flex-col items-center gap-1 group"
        onClick={(e) => handlePlay(e)}
      >
        <button
          type="button"
          className="w-16 h-16 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors border border-border"
          aria-label={`Play ${sound.name}`}
        >
          <Volume2 className="h-7 w-7 text-primary" />
        </button>
        <span className="text-xs text-muted-foreground text-center line-clamp-2 max-w-[80px] group-hover:text-foreground">
          {sound.name}
        </span>
      </Link>
    </div>
  )
}
