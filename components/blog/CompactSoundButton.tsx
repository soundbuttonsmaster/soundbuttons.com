"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import { Volume2 } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { getSoundDetailPath } from "@/lib/utils/slug"
import type { ProcessedSound } from "@/lib/api/client"

const MEDIA_BASE = "https://api-v6.soundbuttons.com/media"

function getAudioUrl(sound: ProcessedSound): string {
  if (sound.sound_file?.startsWith("http")) return sound.sound_file
  const path = (sound.sound_file || "").replace(/^\/+/, "").replace(/^media\//, "")
  return path ? `${MEDIA_BASE}/${path}` : apiClient.getSoundAudioUrl(sound.id)
}

interface CompactSoundButtonProps {
  sound: ProcessedSound
}

export default function CompactSoundButton({ sound }: CompactSoundButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const handler = (e: CustomEvent<{ exceptId?: number }>) => {
      if (e.detail?.exceptId === sound.id) return
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsPlaying(false)
    }
    window.addEventListener("pause-all-sounds", handler as EventListener)
    return () => window.removeEventListener("pause-all-sounds", handler as EventListener)
  }, [sound.id])

  const handlePlay = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const url = getAudioUrl(sound)
      if (!url) return
      if (isPlaying && audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
        return
      }
      window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: sound.id } }))
      let audio = audioRef.current
      if (!audio || audio.src !== url) {
        audio = new Audio(url)
        audio.crossOrigin = "anonymous"
        audio.setAttribute("playsinline", "true")
        audio.onended = () => {
          setIsPlaying(false)
        }
        audioRef.current = audio
      }
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    },
    [sound, isPlaying]
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
