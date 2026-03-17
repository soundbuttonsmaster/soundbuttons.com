"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import SearchBar from "@/components/search-bar"
import AutoLoadingTrendingSection from "@/components/home/AutoLoadingTrendingSection"
import AutoLoadingNewSoundsSection from "@/components/home/AutoLoadingNewSoundsSection"

const AboutContent = dynamic(
  () => import("@/components/home/AboutContent").then((m) => m.default),
  { ssr: true, loading: () => <div className="min-h-[200px]" aria-hidden /> }
)
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
              <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[96rem] w-full shadow-lg">
                <SearchBar placeholder={home.searchPlaceholder} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mv-leaderboard w-full min-h-0" aria-hidden="true" />

      <div className="flex flex-col bg-background">
        <main className="flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto pt-2 pb-0 px-2 sm:px-4 lg:px-6">
            <div className="trending-sounds-container">
              <AutoLoadingTrendingSection
                initialSounds={initialTrendingSounds}
                initialMeta={initialTrendingMeta}
                isMobileDevice={isMobileDevice}
                title={home.trendingTitle}
                viewAllLink={`${localePrefix}/trends`}
                locale={locale}
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
