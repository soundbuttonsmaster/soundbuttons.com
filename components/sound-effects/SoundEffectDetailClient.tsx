"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Download, Share2, ChevronRight, Copy } from "lucide-react"
import ShareModal from "@/components/share/share-modal"
import SoundEffectCard from "./SoundEffectCard"
import { soundEffectsApi } from "@/lib/api/sound-effects"
import type { SoundEffect } from "@/lib/api/sound-effects"
import { getSoundEffectDetailPath, generateSlug, tagToSearchSlug } from "@/lib/utils/slug"
import { SITE } from "@/lib/constants/site"
import { getNameForTitle } from "@/lib/utils"

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
  const isPlayingRef = useRef(false)
  const audioUrl = soundEffectsApi.getSoundFileUrl(soundEffect)
  const path = getSoundEffectDetailPath(soundEffect.soundName, soundEffect.id)
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : ""

  const syncIsPlaying = (value: boolean) => {
    isPlayingRef.current = value
    setIsPlaying(value)
  }

  const handlePlay = () => {
    if (!audioUrl) return

    if (isPlayingRef.current) {
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.currentTime = 0 } catch { /* ignore */ }
      }
      syncIsPlaying(false)
      return
    }

    window.dispatchEvent(new CustomEvent("pause-all-sounds", { detail: { exceptId: soundEffect.id } }))

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
    soundEffectsApi.incrementViews(soundEffect.id).catch(() => {})
  }, [soundEffect.id])

  useEffect(() => {
    const pauseAll = (e: Event) => {
      const ev = e as CustomEvent<{ exceptId: number }>
      if (ev.detail?.exceptId !== soundEffect.id) {
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
  }, [soundEffect.id])

  const tags = soundEffect.tags
    ? soundEffect.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : []
  const displayName = getNameForTitle(soundEffect.soundName || "")
  const faqSuffix = /sound\s*effect/i.test(soundEffect.soundName || "") ? "" : " sound effect"
  const faqs = [
    {
      question: `What is the ${displayName || "this"}${faqSuffix}?`,
      answer: `The ${displayName || "this"}${faqSuffix} is a high-quality audio clip you can play, download, and use in your creative projects. It's perfect for videos, games, podcasts, streams, and multimedia content. All sound effects on SoundButtons are free to use.`,
    },
    {
      question: `How can I download the ${displayName || "this"}${faqSuffix}?`,
      answer: `Click the "Download MP3" button above to save the ${displayName || "this"}${faqSuffix} to your device. The file will download as an MP3 that you can use in any video editor, game, or audio project.`,
    },
    {
      question: `Can I use the ${displayName || "this"}${faqSuffix} for free?`,
      answer: `Yes! All sound effects on SoundButtons.com are free to play and download. You can use them in personal and commercial projects including videos, games, podcasts, and streams. Check the sound detail page for any specific licensing notes.`,
    },
    {
      question: `How do I embed the ${displayName || "this"}${faqSuffix} on my website?`,
      answer: `Use the embed section below to copy an iframe code. Paste it into your HTML to add a playable sound button to your site. The embed is responsive and works on all devices.`,
    },
    {
      question: `What format is the ${displayName || "this"}${faqSuffix} available in?`,
      answer: `The ${displayName || "this"}${faqSuffix} is available as an MP3 file. MP3 is widely supported across video editors, game engines, streaming software, and audio applications.`,
    },
  ]
  const embedSlug = generateSlug(soundEffect.soundName || "") || "sound-effect"
  const embedPath = `/sound-effects/embed/${embedSlug}/${soundEffect.id}`
  const embedCode = `<iframe src="${SITE.baseUrl}${embedPath}" width="300" height="90" style="max-width:100%;border:0;" loading="lazy"></iframe>`

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
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/sound-effects/search/${tagToSearchSlug(tag)}`}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
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

            <section className="mt-8 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold mb-3">Embed this sound effect on your site</h2>
              <textarea
                readOnly
                rows={3}
                value={embedCode}
                className="w-full resize-none rounded-lg border border-border bg-muted/50 p-3 text-xs font-mono text-foreground"
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Embed code for this sound effect"
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(embedCode).catch(() => {})}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                <Copy className="h-4 w-4" />
                Copy embed code
              </button>
            </section>

            <section className="mt-8 pt-6 border-t border-border">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group rounded-lg border border-border bg-card overflow-hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 font-medium text-foreground hover:bg-accent/50 transition-colors [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 py-3 pt-0 text-muted-foreground border-t border-border">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {relatedEffects.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold mb-4">Similar Sound Effects</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
