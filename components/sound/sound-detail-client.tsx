"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Download, Share2, Code, Eye } from "lucide-react"
import { Heart as HeartFilled } from "lucide-react"
import ShareModal from "@/components/share/share-modal"
import SoundButton from "@/components/sound/sound-button"
import SoundList from "@/components/home/SoundList"
import { Button } from "@/components/ui/button"
import type { Sound } from "@/lib/types/sound"
import { SITE } from "@/lib/constants/site"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import { getSoundDetailPath } from "@/lib/utils/slug"

interface SoundDetailClientProps {
  sound: Sound
  relatedSounds: Sound[]
  isMobileDevice?: boolean
  categorySlug: string
  categoryName: string
}

function parseViews(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0
  if (typeof value === "string") {
    const n = Number(String(value).replace(/,/g, "").trim())
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function getSoundViews(sound: Sound): number {
  const s = sound as unknown as Record<string, unknown>
  return parseViews(s.views ?? s.view_count ?? s.views_count ?? s.viewCount)
}

export default function SoundDetailClient({
  sound,
  relatedSounds,
  isMobileDevice,
  categorySlug,
  categoryName,
}: SoundDetailClientProps) {
  const { token } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [viewCount, setViewCount] = useState(() => getSoundViews(sound))
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEmbedModal, setShowEmbedModal] = useState(false)

  const soundDetailPath = getSoundDetailPath(sound.name, sound.id)
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${soundDetailPath}` : `${SITE.baseUrl}${soundDetailPath}`

  useEffect(() => {
    if (token) {
      setIsFavorited(!!(sound as { is_favorited?: boolean }).is_favorited)
    } else {
      setIsFavorited(false)
    }
  }, [sound.id, (sound as { is_favorited?: boolean }).is_favorited, token])

  useEffect(() => {
    const initial = getSoundViews(sound)
    setViewCount(initial)
  }, [sound.id])

  const handleFavorite = async () => {
    if (!token) {
      window.location.href = `/login?redirect=${encodeURIComponent(soundDetailPath)}`
      return
    }
    try {
      if (isFavorited) await apiClient.unfavoriteSound(token, sound.id)
      else await apiClient.favoriteSound(token, sound.id)
      const key = "sb_favorites"
      let favs: number[] = JSON.parse(localStorage.getItem(key) ?? "[]")
      if (isFavorited) {
        setIsFavorited(false)
        favs = favs.filter((id) => id !== sound.id)
      } else {
        setIsFavorited(true)
        favs.push(sound.id)
      }
      localStorage.setItem(key, JSON.stringify(favs))
      window.dispatchEvent(
        new CustomEvent("favoritesUpdated", { detail: { action: isFavorited ? "remove" : "add", soundId: sound.id } })
      )
    } catch (err) {
      console.error("Error favoriting sound:", err)
    }
  }

  const downloadUrl = apiClient.getSoundDownloadUrl(sound)

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-4xl px-4 py-4 sm:py-5">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-3 flex justify-center">
            <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/new" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                  Sounds
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/categories/${categorySlug}`}
                  className="transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  {categoryName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-slate-900 dark:text-white" aria-current="page">
                {sound.name}
              </li>
            </ol>
          </nav>

          {/* Main Sound Card */}
          <article className="mx-auto w-full">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/90">
              <div className="px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
                <h1 className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {sound.name} Sound Buttons
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  <Link
                    href={`/categories/${categorySlug}`}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    {categoryName}
                  </Link>
                  <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Eye className="h-3.5 w-3.5" />
                    {viewCount.toLocaleString("en-US")} views
                  </span>
                  {(sound.likes_count ?? 0) > 0 && (
                    <span className="text-slate-500 dark:text-slate-400">
                      {(sound.likes_count ?? 0).toLocaleString("en-US")} likes
                    </span>
                  )}
                </div>
              </div>

              {/* Play area */}
              <div className="flex items-center justify-center px-4 py-4 sm:py-5">
                <div className="flex h-[200px] w-[200px] shrink-0 items-center justify-center sm:h-[240px] sm:w-[240px]">
                  <SoundButton sound={sound} hideActions={true} customSize={160} hideLabel={true} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <a
                    href={downloadUrl}
                    download={`${sound.name}.mp3`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                  <Button
                    type="button"
                    onClick={handleFavorite}
                    className="h-10 gap-2 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
                    {isFavorited ? "Saved" : "Favorite"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="h-10 gap-2 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowEmbedModal(true)}
                    className="h-10 gap-2 rounded-lg bg-slate-100 px-4 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    <Code className="h-4 w-4" />
                    Embed
                  </Button>
                </div>
              </div>
            </div>

            {/* You Might Like */}
            {relatedSounds.length > 0 && (
              <div className="mt-6 w-full">
                <SoundList
                  title="You Might Like"
                  sounds={relatedSounds}
                  viewAllLink="/new"
                  useCompactView={true}
                  maxCols={8}
                  showLoadMore={false}
                  hasMoreSounds={false}
                  initialCount={isMobileDevice ? 16 : 40}
                  maxLines={isMobileDevice ? 4 : 5}
                  isMobileDevice={isMobileDevice}
                />
              </div>
            )}

            {/* SEO content */}
            <div className="mt-6 space-y-4">
              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/90 sm:p-5">
                <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">About This Sound</h2>
                <p className="mb-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  The <strong className="text-slate-800 dark:text-slate-200">{sound.name}</strong> sound button is a
                  popular audio clip perfect for your soundboard, content creation, and entertainment. This high-quality
                  sound effect is part of {SITE.domain}&apos;s collection of free, unblocked sound buttons that work on
                  all devices - from smartphones to desktop computers.
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Play and download the <strong className="text-slate-800 dark:text-slate-200">{sound.name}</strong> sound
                  effect buttons instantly! Ideal for memes, pranks, gaming, editing, and sharing fun moments with
                  everyone.
                </p>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/90 sm:p-5">
                <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">How to Use This Sound</h2>
                <ol className="list-inside list-decimal space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Play instantly:</strong> Click the sound
                    button above to play the {sound.name} sound immediately in your browser.
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Download for free:</strong> Click the
                    &quot;Download&quot; button to save this sound to your device for offline use.
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Use in content:</strong> Perfect for memes,
                    TikTok videos, YouTube content, Discord servers, streaming, and more.
                  </li>
                  <li>
                    <strong className="text-slate-800 dark:text-slate-200">Share with friends:</strong> Use the share
                    button to send this sound to others or embed it on your website.
                  </li>
                </ol>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/90 sm:p-5">
                <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">Popular Uses</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <li>Meme creation and viral content</li>
                  <li>TikTok videos and social media posts</li>
                  <li>Discord soundboards and voice chat</li>
                  <li>Streaming and live broadcasts</li>
                  <li>YouTube videos and content creation</li>
                  <li>Gaming streams and reactions</li>
                  <li>Notification sounds and ringtones</li>
                </ul>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/90 sm:p-5">
                <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Explore More Sounds</h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/categories/${categorySlug}`}
                    className="inline-flex h-9 items-center rounded-lg bg-slate-900 px-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    More {categoryName} Sounds
                  </Link>
                  <Link
                    href="/trends"
                    className="inline-flex h-9 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    Trending
                  </Link>
                  <Link
                    href="/new"
                    className="inline-flex h-9 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    New Sounds
                  </Link>
                  <Link
                    href="/categories"
                    className="inline-flex h-9 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    Soundboard
                  </Link>
                </div>
              </section>
            </div>

            <ShareModal
              soundName={sound.name}
              soundId={sound.id}
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              shareUrl={shareUrl}
            />

            {showEmbedModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                onClick={() => setShowEmbedModal(false)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Escape" && setShowEmbedModal(false)}
              >
                <div
                  className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                >
                  <button
                    type="button"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
                    aria-label="Close"
                    onClick={() => setShowEmbedModal(false)}
                  >
                    &times;
                  </button>
                  <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Embed this sound</h3>
                  <textarea
                    readOnly
                    className="mb-3 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    rows={3}
                    onFocus={(e) => e.currentTarget.select()}
                    value={`<iframe src="${SITE.baseUrl}/embed${soundDetailPath}" width="300" height="90" style="max-width:100%;border:0;" loading="lazy"></iframe>`}
                    aria-label="Embed code for this sound"
                  />
                  <Button
                    onClick={() => {
                      const code = `<iframe src="${SITE.baseUrl}/embed${soundDetailPath}" width="300" height="90" style="max-width:100%;border:0;" loading="lazy"></iframe>`
                      navigator.clipboard.writeText(code).then(() => setShowEmbedModal(false)).catch(() => {})
                    }}
                    className="h-10 w-full rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    Copy embed code
                  </Button>
                </div>
              </div>
            )}
          </article>
        </main>
      </div>
    </>
  )
}
