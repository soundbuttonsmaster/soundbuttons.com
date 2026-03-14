"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Download, Share2 } from "lucide-react"
import ShareModal from "@/components/share/share-modal"
import SoundEffectCard from "./SoundEffectCard"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import type { SoundEffect } from "@/lib/api/sound-effects"
import { getSoundEffectDetailPath } from "@/lib/utils/slug"

interface SoundEffectDetailClientProps {
  soundEffect: SoundEffect
  relatedEffects: SoundEffect[]
}

export default function SoundEffectDetailClient({
  soundEffect,
  relatedEffects,
}: SoundEffectDetailClientProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrl = soundEffectsApi.getSoundFileUrl(soundEffect)
  const path = getSoundEffectDetailPath(soundEffect.soundName, soundEffect.id)
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : ""

  const handlePlay = () => {
    if (!audioUrl) return
    window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: soundEffect.id } }))
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
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!audioUrl) return
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${soundEffect.soundName || "sound-effect"}.mp3`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    const pauseAll = (e: Event) => {
      const ev = e as CustomEvent<{ exceptId: number }>
      if (ev.detail?.exceptId !== soundEffect.id && audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
    window.addEventListener("pause-all-sounds", pauseAll as EventListener)
    return () => window.removeEventListener("pause-all-sounds", pauseAll as EventListener)
  }, [soundEffect.id])

  const firstTag = soundEffect.tags ? soundEffect.tags.split(",")[0]?.trim() : ""

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="w-full max-w-4xl mx-auto px-4 py-6">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/sound-effects" className="hover:text-foreground">Sound Effects</Link>
            <span>/</span>
            <span className="font-medium text-foreground" aria-current="page">{soundEffect.soundName}</span>
          </nav>

          <article className="rounded-xl border border-border bg-card shadow-sm p-6 md:p-8">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handlePlay}
                className={`w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transition-transform ${isPressed ? "scale-95" : "hover:scale-105"}`}
              >
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-3 h-10 bg-white rounded-full animate-pulse" />
                    <div className="w-3 h-10 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <div className="w-3 h-10 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  </div>
                ) : (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold text-center">{soundEffect.soundName}</h1>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {firstTag && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{firstTag}</span>
                )}
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  {soundEffect.views ?? 0} views
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Download MP3
                </button>
                <button
                  type="button"
                  onClick={() => setShowShare(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent font-medium"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {relatedEffects.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">You might also like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedEffects.map((eff) => (
                    <SoundEffectCard key={eff.id} effect={eff} />
                  ))}
                </div>
              </section>
            )}
          </article>
        </main>
      </div>
      <ShareModal
        soundName={soundEffect.soundName}
        soundId={soundEffect.id}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={shareUrl}
      />
    </>
  )
}
