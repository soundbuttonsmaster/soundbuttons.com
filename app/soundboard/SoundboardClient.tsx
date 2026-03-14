"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 44

interface SoundboardClientProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function SoundboardClient({
  initialSounds,
  initialMeta,
  isMobileDevice,
}: SoundboardClientProps) {
  const [sounds, setSounds] = useState(initialSounds)
  const [page, setPage] = useState(initialMeta.current_page)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialMeta.current_page < initialMeta.last_page || initialSounds.length >= PAGE_SIZE
  )
  const loadingRef = useRef<HTMLDivElement>(null)

  const loadMoreSounds = useCallback(async (): Promise<boolean> => {
    if (loading || !hasMore) return false
    setLoading(true)
    try {
      const { apiClient } = await import("@/lib/api/client")
      const nextPage = page + 1
      const result = await apiClient.getTrendingSounds(nextPage, PAGE_SIZE)
      const newSounds = result.data || []
      setSounds((prev) => [...prev, ...newSounds])
      setPage(nextPage)
      const meta = result.meta || {}
      const lastPage = meta.last_page || Math.ceil((meta.total_items || 0) / PAGE_SIZE)
      const gotFullPage = newSounds.length >= PAGE_SIZE
      const pastLastPage = lastPage >= 2 && nextPage >= lastPage
      const more = gotFullPage && !pastLastPage
      setHasMore(more)
      return more
    } catch {
      setHasMore(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMoreSounds()
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    )
    const el = loadingRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [loadMoreSounds, hasMore, loading])

  return (
    <>
      <PageHero
        title="Soundboard: Instant Play Sound Buttons & Meme Soundboard"
        description="Launch the ultimate meme soundboard experience featuring 100,000+ free sound buttons. Play viral audio instantly, download in seconds, and keep the meme magic unblocked on every device."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search soundboard..." />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {initialSounds.length > 0 ? (
            <>
              <SoundList
                title="Soundboard: Trending"
                sounds={sounds}
                initialCount={isMobileDevice ? 20 : 44}
                loadMoreCount={PAGE_SIZE}
                onLoadMore={loadMoreSounds}
                hasMoreSounds={hasMore}
                maxLines={100}
                useCompactView
                showLoadMore={false}
                showLoadingIndicator={false}
                isMobileDevice={isMobileDevice}
              />

              {hasMore && (
                <div ref={loadingRef} className="flex flex-col items-center gap-4 mt-8 py-8">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                      <span className="text-muted-foreground">Loading more sounds...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-muted-foreground">Scroll down for more sounds</span>
                      <button
                        type="button"
                        onClick={loadMoreSounds}
                        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                      >
                        Load more sounds
                      </button>
                    </>
                  )}
                </div>
              )}

              {!hasMore && sounds.length > 0 && (
                <div className="flex justify-center mt-8 py-4">
                  <span className="text-muted-foreground">
                    You&apos;ve reached the end of soundboard sounds!
                  </span>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="py-8 md:py-10 bg-background">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What is a Soundboard?
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                A <strong>soundboard</strong> is an engaging and interactive digital interface that
                fires off sound buttons the instant you click or tap. Our collection covers viral
                meme soundboard effects, gaming sounds, blockbuster movie quotes, and trending audio
                lifted from TikTok, Discord, and YouTube.
              </p>
              <p>
                Whether you create content, livestream, game with friends, or simply love internet
                culture, the SoundButtons.com soundboard puts instant entertainment at your
                fingertips. Enjoy seamless playback, mobile-friendly browsing, and downloads that
                work anywhere—no software required.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Reasons to Use Our Soundboard
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong>Huge library of sounds:</strong> Browse categories like meme soundboard,
                gaming soundboard, movie lines, Discord classics, and goofy comedy gold—with new
                buttons added daily.
              </li>
              <li>Click or tap any soundboard button and hear the sound instantly.</li>
              <li>Mobile-ready so you can take the soundboard anywhere.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Unblocked Soundboard for School
            </h2>
            <p className="text-muted-foreground">
              Use our soundboard for free on any network with our unblocked experience. Whether you
              are at school, work, or connected to public Wi-Fi, the browser-based player stays
              accessible where traditional software installers are blocked. Students love using our
              unblocked soundboard for class projects, presentations, and well-earned break-time
              laughs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">What is a soundboard?</h3>
                <p className="text-muted-foreground">
                  A soundboard is a digital collection of sound buttons that play specific audio
                  clips when clicked or tapped. Soundboards are popular for memes, gaming,
                  streaming, and entertainment, letting you instantly play funny, viral, or iconic
                  sounds with a single tap.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">How do I use a soundboard?</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Click or tap any soundboard button to instantly play the sound.</li>
                  <li>Download your favorite soundboard effects for offline use.</li>
                  <li>Share soundboard buttons with friends or on social media.</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/categories/memes"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Memes Soundboard
            </Link>
            <Link
              href="/categories/games"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Games Soundboard
            </Link>
            <Link
              href="/play-random"
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent font-medium"
            >
              Play Random
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
