"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import AutoLoadingNewSoundsSection from "@/components/home/AutoLoadingNewSoundsSection"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 44

interface MemeSoundboardClientProps {
  initialTrendingSounds: Sound[]
  initialNewSounds: Sound[]
  initialTrendingMeta: { current_page: number; last_page: number; total_items?: number }
  initialNewMeta: { current_page: number; last_page: number }
  isMobileDevice: boolean
}

export default function MemeSoundboardClient({
  initialTrendingSounds,
  initialNewSounds,
  initialTrendingMeta,
  isMobileDevice,
}: MemeSoundboardClientProps) {
  const [trendingSounds, setTrendingSounds] = useState(initialTrendingSounds)
  const [page, setPage] = useState(initialTrendingMeta?.current_page ?? 1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    (initialTrendingMeta?.current_page ?? 1) < (initialTrendingMeta?.last_page ?? 1) ||
    initialTrendingSounds.length >= PAGE_SIZE
  )
  const loadingRef = useRef<HTMLDivElement>(null)

  const loadMoreTrending = useCallback(async (): Promise<boolean> => {
    if (loading || !hasMore) return false
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await apiClient.getTrendingSounds(nextPage, PAGE_SIZE)
      const newData = result.data || []
      setTrendingSounds((prev) => [...prev, ...newData])
      setPage(nextPage)
      const meta = result.meta || {}
      const lastPage = meta.last_page || Math.ceil((meta.total_items || 0) / PAGE_SIZE)
      const gotFullPage = newData.length >= PAGE_SIZE
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
          loadMoreTrending()
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    )
    const el = loadingRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [loadMoreTrending, hasMore, loading])

  return (
    <>
      <PageHero
        title="Meme Soundboard: 9,99,999+ Sound Buttons Unblocked"
        description="Explore the ultimate collection of meme soundboard buttons unblocked! Play thousands of viral meme sounds, funny sound effects, and unblocked meme soundboard buttons. Perfect for school, work, or home - all completely free and unblocked!"
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search meme soundboard..." />
          </div>
        </div>
      </PageHero>

      <div className="flex flex-col bg-background">
        <main className="flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto py-8 px-4 space-y-8">
            <div>
              {initialTrendingSounds.length > 0 ? (
                <>
                  <SoundList
                    title="Meme Soundboard: Trending"
                    sounds={trendingSounds}
                    initialCount={isMobileDevice ? 20 : 44}
                    loadMoreCount={PAGE_SIZE}
                    onLoadMore={loadMoreTrending}
                    hasMoreSounds={hasMore}
                    maxLines={100}
                    useCompactView
                    showLoadMore={false}
                    showLoadingIndicator={false}
                    isMobileDevice={isMobileDevice}
                  />

                  {hasMore && (
                    <div
                      ref={loadingRef}
                      className="flex flex-col items-center gap-4 mt-8 py-8"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                          <span className="text-muted-foreground">
                            Loading more sounds...
                          </span>
                        </div>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            Scroll down for more sounds
                          </span>
                          <button
                            type="button"
                            onClick={loadMoreTrending}
                            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
                          >
                            Load more sounds
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {!hasMore && trendingSounds.length > 0 && (
                    <div className="flex justify-center mt-8 py-4">
                      <span className="text-muted-foreground">
                        You&apos;ve reached the end of trending meme sounds!
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No trending sounds found. Check back later!
                  </p>
                </div>
              )}
            </div>

            <div className="trending-sounds-container min-h-[400px]">
              <AutoLoadingNewSoundsSection
                initialSounds={initialNewSounds}
                isMobileDevice={isMobileDevice}
                title="Meme Soundboard: New"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
