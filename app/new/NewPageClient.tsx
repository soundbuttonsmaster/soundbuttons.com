"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import { getStrings } from "@/lib/i18n/strings"
import type { Sound } from "@/lib/types/sound"
import type { Locale } from "@/lib/i18n/strings"

const PAGE_SIZE = 35

function createSearchUrl(query: string): string {
  const slug = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""
  return slug ? `/search/${slug}` : "/search"
}

interface NewPageClientProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
  locale?: Locale
}

export default function NewPageClient({
  initialSounds,
  initialMeta,
  isMobileDevice,
  locale = "en",
}: NewPageClientProps) {
  const router = useRouter()
  const newPage = useMemo(() => getStrings(locale).newPage, [locale])
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
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
      const result = await apiClient.getNewSounds(nextPage, PAGE_SIZE)
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
    return () => { if (el) observer.unobserve(el) }
  }, [loadMoreSounds, hasMore, loading])

  const popularSearches = ["meme", "fart", "game", "discord", "get out"]

  return (
    <>
      <PageHero
        title={newPage.heroTitle}
        description={newPage.heroDescription}
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder={locale === "en" ? "Search Sound buttons..." : getStrings(locale).nav.searchPlaceholder} />
          </div>
        </div>
      
      </PageHero>

      <div className="mv-leaderboard w-full min-h-0" aria-hidden="true" />

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
        {sounds.length > 0 ? (
          <div className="trending-sounds-container">
          <>
            <SoundList
              title="New Sound Buttons"
              sounds={sounds}
              initialCount={isMobileDevice ? 20 : 35}
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
                <span className="text-muted-foreground">You&apos;ve reached the end of new sounds!</span>
              </div>
            )}
          </>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No new sounds found at the moment. Check back later!
            </p>
          </div>
        )}

        <div className="mt-16 max-w-none">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Receive Updates for New Sound Buttons
          </h2>
          <p className="text-muted-foreground mb-4">
            We update our sound buttons library daily with high-quality, trending audio. There is always something new to explore, so you never miss the latest meme drops, gaming stingers, or reaction-worthy clips.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
            What Makes Our New Sounds Unique?
          </h3>
          <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-1">
            <li>Brand-new daily content</li>
            <li>Quality clips curated for relevance</li>
            <li>Optimized for a variety of uses</li>
            <li>Ready to play on every device and platform</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
            Perfect for Creators
          </h3>
          <p className="text-muted-foreground mb-4">
            Whether you stream, craft memes, edit videos, or just love funny audio, our latest sound buttons keep your projects fresh. Stay on top of trends with new effects you can instantly play, download, and share. Check out our <Link href="/trends" className="text-primary underline hover:opacity-80">trending sounds</Link> and <Link href="/categories" className="text-primary underline hover:opacity-80">categories</Link> for more.
          </p>
        </div>
        </div>
      </div>
    </>
  )
}
