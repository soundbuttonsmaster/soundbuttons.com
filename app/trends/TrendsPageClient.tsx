"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 44

function createSearchUrl(query: string): string {
  const slug = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""
  return slug ? `/search/${slug}` : "/search"
}

interface TrendsPageClientProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function TrendsPageClient({
  initialSounds,
  initialMeta,
  isMobileDevice,
}: TrendsPageClientProps) {
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

  const popularSearches = ["meme", "fart", "game", "discord", "get out"]

  return (
    <>
      <PageHero
        title="Trending Sound Buttons & Viral Meme Soundboard"
        description="Discover the most popular trending sound buttons and viral meme soundboard sound effects on SoundButtons.com. Play, download, and share the audio everyone is using across social media, gaming chats, and creator communities."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search Sound buttons..." />
          </div>
        </div>
     
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {sounds.length > 0 ? (
            <>
              <SoundList
                title="Trending Sound Buttons"
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
                    You&apos;ve reached the end of trending sounds!
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No trending sounds found at the moment. Check back later!
              </p>
            </div>
          )}

          <div className="mt-16 max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              What Defines a Trending Sound?
            </h2>
            <p className="text-muted-foreground mb-4">
              At SoundButtons.com, trending sounds are powered by popularity, interaction, and viral
              potential. These are the clips everyone talks about across social media threads,
              gaming communities, and creator forums.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
              How We Track Trending Sounds
            </h3>
            <p className="text-muted-foreground mb-4">
              Our trending sound algorithm looks at plays, downloads, social media shares, and user
              ratings to surface the most relevant audio of the moment. If it&apos;s trending
              anywhere, you&apos;ll find it highlighted here.
            </p>

            <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
              Why Use Trending Sounds?
            </h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-1">
              <li>Ride the wave of viral content and memes</li>
              <li>Boost audience engagement with familiar audio hooks</li>
              <li>Increase discoverability across platforms and feeds</li>
              <li>Join the conversation with trending communities</li>
            </ul>

            <p className="text-muted-foreground mt-6">
              Explore more with our{" "}
              <Link href="/new" className="text-primary underline hover:opacity-80">
                new sounds
              </Link>{" "}
              and{" "}
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
