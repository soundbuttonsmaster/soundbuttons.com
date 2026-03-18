"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Download } from "lucide-react"
import ShareModal from "@/components/share/share-modal"
import { kidsSoundboardApi } from "@/lib/api/kids-soundboard"
import type { KidsSoundboard } from "@/lib/api/kids-soundboard"

type KidsCardSoundInput = KidsSoundboard

interface KidsCardSoundProps {
  sound: KidsCardSoundInput
  isAboveTheFold?: boolean
  onRainEffect?: (imageUrl: string) => void
}

export default function KidsCardSound({
  sound,
  onRainEffect,
}: KidsCardSoundProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isPlayingRef = useRef(false)

  const audioUrl = kidsSoundboardApi.getSoundFileUrl(sound)
  const imageUrl = kidsSoundboardApi.getImageUrl(sound)

  const syncIsPlaying = (value: boolean) => {
    isPlayingRef.current = value
    setIsPlaying(value)
  }

  const handlePlay = useCallback(() => {
    try {
      if (!audioUrl) return

      if (isPlayingRef.current) {
        if (audioRef.current) {
          try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
        }
        syncIsPlaying(false)
        return
      }

      window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: sound.id } }))

      const audio = new Audio(audioUrl)
      audio.setAttribute("playsinline", "true")
      audio.onended = () => syncIsPlaying(false)
      audioRef.current = audio

      const p = audio.play()
      if (p && typeof p.then === "function") {
        p.then(() => {
          syncIsPlaying(true)
          if (onRainEffect && imageUrl) onRainEffect(imageUrl)
        }).catch(() => syncIsPlaying(false))
      } else {
        syncIsPlaying(true)
        if (onRainEffect && imageUrl) onRainEffect(imageUrl)
      }

      setIsPressed(true)
      setTimeout(() => setIsPressed(false), 200)
    } catch {
      // ignore
    }
  }, [sound.id, audioUrl, imageUrl, onRainEffect])

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioUrl) return
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${sound.soundName || "sound"}.mp3`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ exceptId: number }>
      if (ev.detail?.exceptId !== sound.id) {
        if (audioRef.current) {
          try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
        }
        syncIsPlaying(false)
      }
    }
    window.addEventListener("pause-all-sounds", handler as EventListener)
    return () => {
      window.removeEventListener("pause-all-sounds", handler as EventListener)
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
      }
    }
  }, [sound.id])

  const getButtonColor = () => {
    const colors = [
      "bg-red-400 dark:bg-red-700",
      "bg-blue-400 dark:bg-blue-700",
      "bg-purple-400 dark:bg-purple-700",
      "bg-green-400 dark:bg-green-700",
    ]
    return colors[sound.category % colors.length] || "bg-gray-400 dark:bg-gray-700"
  }

  const soundSlug = (sound.soundName || "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || `sound-${sound.id}`

  return (
    <>
      <div
        className="flex flex-col border-2 border-border rounded-lg overflow-hidden hover:shadow-md transition-all min-h-[140px]"
        style={{ willChange: "auto" }}
      >
        <div className="relative p-2">
          <button
            type="button"
            className="w-full min-h-[44px] p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            onClick={handlePlay}
            aria-label={`Play ${sound.soundName || "Sound"}`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={sound.soundName || "Sound"}
                className={`w-full h-28 object-cover rounded transition-transform ${isPressed ? "scale-95" : ""}`}
              />
            ) : (
              <div
                className={`h-28 flex items-center justify-center rounded transition-transform ${getButtonColor()} ${isPressed ? "scale-95" : ""}`}
              >
                <span className="text-white font-bold text-lg">
                  {(sound.soundName || "").substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </button>
          {isPlaying && (
            <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-2 flex-1">
          <h3 className="text-base font-semibold text-foreground text-center leading-tight line-clamp-2">
            {sound.soundName}
          </h3>
        </div>
        <div className="flex justify-center px-3 py-2 bg-muted/30 gap-4">
          <button
            type="button"
            onClick={handleDownload}
            className="text-muted-foreground hover:text-primary"
            aria-label={`Download ${sound.soundName}`}
          >
            <Download size={14} />
          </button>
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="text-muted-foreground hover:text-primary"
            aria-label="Share"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
      <ShareModal
        soundName={sound.soundName}
        soundId={sound.id}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/${soundSlug}/${sound.id}`}
      />
    </>
  )
}
