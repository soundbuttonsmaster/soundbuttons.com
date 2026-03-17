"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 44

interface MemeButtonsClientProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function MemeButtonsClient({
  initialSounds,
  initialMeta,
  isMobileDevice,
}: MemeButtonsClientProps) {
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
      const nextPage = page + 1
      const result = await apiClient.getSoundsByCategory("Memes", nextPage, PAGE_SIZE)
      const newSounds = result.data || []
      if (newSounds.length === 0) {
        const fallback = await apiClient.getTrendingSounds(nextPage, PAGE_SIZE)
        const fallbackData = fallback.data || []
        setSounds((prev) => [...prev, ...fallbackData])
        const m = fallback.meta || {}
        const lastPage = m.last_page || Math.ceil((m.total_items || 0) / PAGE_SIZE)
        setHasMore(nextPage < lastPage)
      } else {
        setSounds((prev) => [...prev, ...newSounds])
        const meta = result.meta || {}
        const lastPage = meta.last_page || Math.ceil((meta.total_items || 0) / PAGE_SIZE)
        setHasMore(nextPage < lastPage)
      }
      setPage(nextPage)
      return true
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
        title="Meme Buttons: 100,000+ Sound Buttons with Soundboard Unblocked"
        description="Play the best meme buttons! Thousands of viral meme sounds, funny sound effects, and trending audio. Free meme sound buttons for Discord, TikTok, streaming, and more."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search meme buttons..." />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {sounds.length > 0 ? (
            <>
              <SoundList
                title="Meme Buttons"
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
                      <span className="text-muted-foreground">Loading more meme buttons...</span>
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
                    You&apos;ve reached the end of meme buttons!
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No meme buttons found. Check back later!
              </p>
            </div>
          )}

          <div className="mt-16 max-w-none">
            <p className="text-muted-foreground">
              Explore more{" "}
              <Link href="/meme-soundboard" className="text-primary underline hover:opacity-80">
                meme soundboard
              </Link>
              ,{" "}
              <Link href="/trends" className="text-primary underline hover:opacity-80">
                trending sounds
              </Link>
              , and{" "}
              <Link href="/categories" className="text-primary underline hover:opacity-80">
                categories
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
