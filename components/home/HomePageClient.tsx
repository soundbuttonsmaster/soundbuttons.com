"use client"

import { useState, useCallback, useMemo } from "react"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import AutoLoadingNewSoundsSection from "@/components/home/AutoLoadingNewSoundsSection"
import AboutContent from "@/components/home/AboutContent"
import { apiClient } from "@/lib/api/client"
import { getStrings } from "@/lib/i18n/strings"
import type { Sound } from "@/lib/types/sound"
import type { Locale } from "@/lib/i18n/strings"

type ProcessedSound = Sound & { sound_file: string }

interface HomePageClientProps {
  initialTrendingSounds: ProcessedSound[]
  initialNewSounds: ProcessedSound[]
  initialTrendingMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
  locale?: Locale
}

export default function HomePageClient({
  initialTrendingSounds,
  initialNewSounds,
  initialTrendingMeta,
  isMobileDevice,
  locale = "en",
}: HomePageClientProps) {
  const home = useMemo(() => getStrings(locale).home, [locale])
  const localePrefix = locale === "en" ? "" : `/${locale}`
  const [trendingSounds, setTrendingSounds] = useState(initialTrendingSounds)
  const [currentTrendingPage, setCurrentTrendingPage] = useState(
    initialTrendingMeta?.current_page || 1
  )
  const [totalTrendingPages, setTotalTrendingPages] = useState(
    initialTrendingMeta?.last_page || 1
  )

  const loadMoreTrending = useCallback(async () => {
    if (currentTrendingPage >= totalTrendingPages) return false
    try {
      const nextPage = currentTrendingPage + 1
      const loadMoreCount = isMobileDevice ? 8 : 22
      const { data: newSounds, meta } = await apiClient.getTrendingSounds(
        nextPage,
        loadMoreCount
      )
      if (newSounds?.length) {
        setTrendingSounds((prev) => [...prev, ...newSounds])
        setCurrentTrendingPage(nextPage)
        setTotalTrendingPages(meta?.last_page ?? totalTrendingPages)
        return true
      }
    } catch {
      // ignore
    }
    return false
  }, [currentTrendingPage, totalTrendingPages, isMobileDevice])

  return (
    <>
      <section className="hero-section-lcp" suppressHydrationWarning>
        <div className="hero-container-lcp">
          <div className="hero-inner-lcp">
            <h1 className="hero-title-lcp">
              {home.heroTitle}
            </h1>
            <p className="hero-text-lcp">
              {home.heroDescription}
            </p>
            <div className="flex justify-center mt-2 px-2">
              <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
                <SearchBar placeholder={home.searchPlaceholder} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col bg-background">
        <main className="flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto pt-2 pb-0 px-2 sm:px-4 lg:px-6">
            <div className="trending-sounds-container">
              <SoundList
                title={home.trendingTitle}
                sounds={trendingSounds}
                initialCount={isMobileDevice ? 16 : 44}
                loadMoreCount={isMobileDevice ? 8 : 22}
                viewAllLink={`${localePrefix}/trends`}
                onLoadMore={loadMoreTrending}
                hasMoreSounds={currentTrendingPage < totalTrendingPages}
                maxLines={4}
                useCompactView
                showLoadMore
                showLoadingIndicator={false}
                isMobileDevice={isMobileDevice}
              />
            </div>

            <div className="new-sounds-container">
              <AutoLoadingNewSoundsSection
                initialSounds={initialNewSounds}
                isMobileDevice={isMobileDevice}
                title={home.newTitle}
                locale={locale}
              />
            </div>
          </div>
        </main>

        <AboutContent locale={locale} />
      </div>
    </>
  )
}
