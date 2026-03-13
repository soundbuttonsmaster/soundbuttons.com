"use client"

import { useState, useCallback } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import AutoLoadingNewSoundsSection from "@/components/home/AutoLoadingNewSoundsSection"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

type ProcessedSound = Sound & { sound_file: string }

interface HomePageClientProps {
  initialTrendingSounds: ProcessedSound[]
  initialNewSounds: ProcessedSound[]
  initialTrendingMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function HomePageClient({
  initialTrendingSounds,
  initialNewSounds,
  initialTrendingMeta,
  isMobileDevice,
}: HomePageClientProps) {
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
      <Header />
      <section className="hero-section-lcp" suppressHydrationWarning>
        <div className="hero-container-lcp">
          <div className="hero-inner-lcp">
            <h1 className="hero-title-lcp">
              Sound Buttons + Meme Soundboard: 100,000+ Unblocked Instant Play
              Effect Buttons
            </h1>
            <p className="hero-text-lcp">
              Explore a huge collection of hilarious sound buttons, meme
              soundboard, sound effects, and unblocked soundboards all free!
              Create custom sound buttons from your smartphone, desktop,
              Chromebook, or tablet.
            </p>
            <div className="flex justify-center mt-2 px-2">
              <div className="flex justify-center max-w-2xl md:max-w-3xl w-full shadow-lg">
                <SearchBar placeholder="Search Sound buttons..." />
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
                title="Trending Meme Soundboard"
                sounds={trendingSounds}
                initialCount={isMobileDevice ? 16 : 44}
                loadMoreCount={isMobileDevice ? 8 : 22}
                viewAllLink="/trends"
                onLoadMore={isMobileDevice ? undefined : loadMoreTrending}
                hasMoreSounds={currentTrendingPage < totalTrendingPages}
                maxLines={4}
                useCompactView
                showLoadMore={!isMobileDevice}
                showRedirectButton
                showLoadingIndicator={false}
                isMobileDevice={isMobileDevice}
              />
            </div>

            <div className="new-sounds-container">
              <AutoLoadingNewSoundsSection
                initialSounds={initialNewSounds}
                isMobileDevice={isMobileDevice}
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
