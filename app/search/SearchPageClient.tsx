"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import { getStrings } from "@/lib/i18n/strings"
import type { Locale } from "@/lib/i18n/strings"

const popularSearches = [
  "meme sounds",
  "sound effects",
  "audio clips",
  "soundboard",
  "funny sounds",
  "gaming sounds",
  "prank sounds",
  "voice clips",
  "cartoon sounds",
  "music sounds",
  "anime sounds",
  "movie quotes",
  "tiktok sounds",
  "discord sounds",
  "fart sounds",
]

const trendingCategories = [
  { name: "Memes Soundboard", slug: "memes" },
  { name: "Games Soundboard", slug: "games" },
  { name: "Anime Soundboard", slug: "anime" },
  { name: "Reactions Soundboard", slug: "reactions" },
  { name: "Movies Soundboard", slug: "movies" },
  { name: "Sound Effects Soundboard", slug: "sound-effects" },
]

interface SearchPageClientProps {
  locale?: Locale
}

export default function SearchPageClient({ locale = "en" }: SearchPageClientProps) {
  const router = useRouter()
  const searchStrings = useMemo(() => getStrings(locale).search, [locale])
  const navStrings = useMemo(() => getStrings(locale).nav, [locale])
  const localePrefix = locale === "en" ? "" : `/${locale}`

  const handleSuggestionClick = (suggestion: string) => {
    const slug = suggestion
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
    if (slug) router.push(`${localePrefix}/search/${slug}`)
  }

  return (
    <>
      <PageHero
        title={searchStrings.heroTitle}
        description={searchStrings.heroDescription}
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder={searchStrings.searchMorePlaceholder} />
          </div>
        </div>
      </PageHero>

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
            <span className="text-foreground font-medium">{searchStrings.pageTitle}</span>
          </nav>

          {/* Popular Searches */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-foreground text-center">Popular Searches</h2>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {popularSearches.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Browse by Category */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 text-foreground text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {trendingCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`${localePrefix}/categories/${category.slug}`}
                  className="px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-medium hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-16 space-y-6 max-w-3xl mx-auto">
            <section>
              <h2 className="text-xl font-bold mb-4 text-foreground">How to Search Sound Buttons</h2>
              <p className="text-muted-foreground mb-4">
                Use our powerful search feature to find exactly the sound buttons you need. Simply
                enter your search term in the search box above, and we&apos;ll show you all matching
                sound effects, meme sounds, and audio clips from our extensive library.
              </p>

              <h3 className="text-lg font-bold mt-6 mb-3 text-foreground">Search Tips</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use specific keywords for better results (e.g., &quot;dog bark&quot;, &quot;car horn&quot;, &quot;meme laugh&quot;)</li>
                <li>Try different variations of your search term if you don&apos;t find what you&apos;re looking for</li>
                <li>Browse popular searches or categories for inspiration</li>
                <li>All sound buttons are free to play, download, and share</li>
              </ul>

              <h3 className="text-lg font-bold mt-6 mb-3 text-foreground">What Can You Search?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <h4 className="font-semibold text-foreground mb-2">Sound Effects</h4>
                  <p className="text-muted-foreground text-sm">
                    Find thousands of high-quality sound effects for videos, games, and multimedia
                    projects.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <h4 className="font-semibold text-foreground mb-2">Meme Sounds</h4>
                  <p className="text-muted-foreground text-sm">
                    Discover viral meme sounds and audio clips that are perfect for social media
                    content.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <h4 className="font-semibold text-foreground mb-2">Audio Clips</h4>
                  <p className="text-muted-foreground text-sm">
                    Search for music snippets, voice clips, and other audio content for your projects.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <h4 className="font-semibold text-foreground mb-2">Soundboards</h4>
                  <p className="text-muted-foreground text-sm">
                    Browse curated collections of sounds organized by category, theme, or popularity.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold mt-6 mb-3 text-foreground">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground">Are the sound buttons free?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes! All sound buttons on SoundButtons.com are completely free to play, download,
                    and use in your projects.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">How do I download a sound button?</h4>
                  <p className="text-muted-foreground text-sm">
                    Once you find a sound button you like, simply click the download icon on the sound
                    card to save it as an MP3 file to your device.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Can I use these sounds in my videos?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes, you can use our sound buttons in your videos, streams, memes, and other
                    creative projects without any restrictions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">How often is the sound library updated?</h4>
                  <p className="text-muted-foreground text-sm">
                    We regularly add new sound buttons to our library. Check back frequently to
                    discover the latest sounds and trending audio clips.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
