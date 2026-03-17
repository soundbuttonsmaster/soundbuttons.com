"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import { getStrings } from "@/lib/i18n/strings"
import type { Sound } from "@/lib/types/sound"
import type { Locale } from "@/lib/i18n/strings"

const PAGE_SIZE = 35

interface SearchResultsClientProps {
  searchQuery: string
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
  locale?: Locale
}

export default function SearchResultsClient({
  searchQuery,
  initialSounds,
  initialMeta,
  isMobileDevice,
  locale = "en",
}: SearchResultsClientProps) {
  const searchStrings = useMemo(() => getStrings(locale).search, [locale])
  const navStrings = useMemo(() => getStrings(locale).nav, [locale])
  const localePrefix = locale === "en" ? "" : `/${locale}`
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
      const result = await apiClient.searchSounds(searchQuery, nextPage, PAGE_SIZE)
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
  }, [searchQuery, page, loading, hasMore])

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

  const countStr = initialMeta.total_items.toLocaleString(locale === "en" ? "en-US" : locale === "es" ? "es-ES" : locale === "pt" ? "pt-BR" : "fr-FR")
  const heroTitle = searchStrings.heroTitleTemplate.replace("{count}", countStr).replace("{query}", searchQuery)
  const heroDescription = searchStrings.heroDescriptionTemplate.replace("{count}", countStr)
  const listTitle = searchStrings.soundListTitleTemplate.replace("{query}", searchQuery)

  return (
    <>
      <PageHero
        title={heroTitle}
        description={heroDescription}
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar
              placeholder={searchStrings.searchMorePlaceholder}
            />
          </div>
        </div>
      </PageHero>

      <div className="mv-leaderboard w-full min-h-0" aria-hidden="true" />

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          <nav
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
            aria-label="Breadcrumb"
          >
            <Link href={localePrefix || "/"} className="hover:text-foreground transition-colors">
              {navStrings.home}
            </Link>
            <span>/</span>
            <Link href={`${localePrefix}/search`} className="hover:text-foreground transition-colors">
              {searchStrings.pageTitle}
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{searchQuery}</span>
          </nav>

          {sounds.length > 0 ? (
            <div className="trending-sounds-container">
            <>
              <SoundList
                title={listTitle}
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
                      <span className="text-muted-foreground">{searchStrings.loadingMore}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{searchStrings.scrollForMore}</span>
                  )}
                </div>
              )}

              {/* SEO Content - from sbmain */}
              <div className="mt-16 space-y-6 max-w-3xl mx-auto">
                <section>
                  <h2 className="text-xl font-bold mb-4 text-foreground">
                    About {searchQuery} Sound Buttons
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Find the best {searchQuery} sound buttons and sounds on SoundButtons.com. Our
                    sound button collection is full of free, high-quality audio clips for your memes,
                    content creations, gaming, and anything you might want to entertain yourself
                    with. All sound buttons are free to download and listen to.
                  </p>

                  <h3 className="text-lg font-bold mt-6 mb-3 text-foreground">
                    How to Use {searchQuery} Sound Buttons
                  </h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Hit any sound button, and it will play instantly.</li>
                    <li>Use the download icon to download the sound button as an MP3.</li>
                    <li>Hit the share button to share your sound button with friends.</li>
                    <li>Perfect for memes, videos, and streaming.</li>
                  </ul>

                  <h3 className="text-lg font-bold mt-6 mb-3 text-foreground">
                    FAQ for {searchQuery} Sound Buttons
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        What are {searchQuery} sound buttons?
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {searchQuery} sound buttons are audio you can play on our website instantly.
                        They are perfect for memes, sound effects for videos, or just for
                        entertaining any kind of content you want.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        How many {searchQuery} sound buttons do you have?
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        As of now, we have {initialMeta.total_items.toLocaleString("en-US")}{" "}
                        {searchQuery} sound buttons that are all free to download and stream.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Are sound buttons in {searchQuery} free of charge?
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        All of our sound buttons in {searchQuery} are available to play, download
                        and use in your project at no cost.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Can I download sound buttons in {searchQuery}?
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Absolutely! You can simply click the download button on any sound buttons in{" "}
                        {searchQuery}. Sound buttons will be downloaded directly as an MP3 file to
                        your device.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchStrings.noResults}
              </p>
              <p className="text-muted-foreground mb-6">
                {searchStrings.tryDifferentSearch}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={`${localePrefix}/categories`}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {searchStrings.browseCategories}
                </Link>
                <Link
                  href={`${localePrefix}/trends`}
                  className="px-6 py-3 border border-input rounded-lg hover:bg-accent transition-colors"
                >
                  {searchStrings.trendingSounds}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
