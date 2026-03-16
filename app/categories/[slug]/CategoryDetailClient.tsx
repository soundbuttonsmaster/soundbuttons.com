"use client"

import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import { getStrings } from "@/lib/i18n/strings"
import type { Sound } from "@/lib/types/sound"
import type { Category } from "@/lib/constants/categories"
import type { Locale } from "@/lib/i18n/strings"

const PAGE_SIZE = 35

interface CategoryDetailClientProps {
  category: Category
  subcategories?: Category[]
  parentCategory?: Category | null
  /** e.g. "" for en, "/es" for Spanish - used for breadcrumb and subcategory links */
  categoriesBasePath?: string
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
  faqs: { question: string; answer: string }[]
  locale?: Locale
}

export default function CategoryDetailClient({
  category,
  subcategories = [],
  parentCategory = null,
  categoriesBasePath = "",
  initialSounds,
  initialMeta,
  isMobileDevice,
  faqs,
  locale = "en",
}: CategoryDetailClientProps) {
  const cat = useMemo(() => getStrings(locale).category, [locale])
  const nav = useMemo(() => getStrings(locale).nav, [locale])
  const common = useMemo(() => getStrings(locale).common, [locale])
  const base = categoriesBasePath || ""
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [page, setPage] = useState(initialMeta.current_page)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialMeta.current_page < initialMeta.last_page || initialSounds.length >= PAGE_SIZE
  )
  const loadingRef = useRef<HTMLDivElement>(null)

  const displayName = category.name.replace(/ Soundboard$/, "")
  const categoryDescription = `Discover ${displayName} sound buttons: free meme soundboard unblocked for videos & streams. Play, download & share ${displayName} sound effects!`

  const loadMoreSounds = useCallback(async (): Promise<boolean> => {
    if (loading || !hasMore) return false
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await apiClient.getSoundsByCategory(category.apiName, nextPage, PAGE_SIZE)
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
  }, [category.apiName, page, loading, hasMore])

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
        title={`${displayName} Sound Buttons`}
        description={categoryDescription}
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder={nav.searchPlaceholder} />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href={`${base}/categories`} className="hover:text-foreground transition-colors">
              {cat.categories}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            {parentCategory ? (
              <>
                <Link
                  href={`${base}/categories/${parentCategory.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {parentCategory.name}
                </Link>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <span className="text-foreground font-medium">{category.name}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">{category.name}</span>
            )}
          </nav>

          {/* Subcategories (sbmain: e.g. Animal Sounds Subcategories) */}
          {subcategories.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-foreground mb-4">{displayName} {cat.subcategories}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subcategories.map((sub) => {
                  const subDisplayName = sub.name.replace(/ Soundboard$/, "")
                  return (
                    <Link
                      key={sub.id}
                      href={`${base}/categories/${sub.slug}`}
                      className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-accent/50 hover:border-primary/30 transition-all"
                    >
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {subDisplayName}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {sounds.length > 0 ? (
            <>
              <SoundList
                title={`${displayName} Sound Buttons`}
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
                        {common.loadMore}
                      </button>
                    </>
                  )}
                </div>
              )}

              {!hasMore && sounds.length > 0 && (
                <div className="flex justify-center mt-8 py-4">
                  <span className="text-muted-foreground">
                    You&apos;ve reached the end of {displayName} sounds!
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No sounds found in this category at the moment. Check back later!
              </p>
            </div>
          )}

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <div className="mt-16 max-w-none">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                Commonly Asked Questions about {displayName} Sound Buttons
              </h2>
              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group rounded-lg border border-border bg-card overflow-hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 font-medium text-foreground hover:bg-accent/50 transition-colors [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="px-4 py-3 pt-0 text-muted-foreground border-t border-border">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 max-w-none">
            <p className="text-muted-foreground">
              {cat.exploreMore}{" "}
              <Link href={`${base}/new`} className="text-primary underline hover:opacity-80">
                {cat.newSounds}
              </Link>
              ,{" "}
              <Link href={`${base}/trends`} className="text-primary underline hover:opacity-80">
                {cat.trending}
              </Link>
              , and{" "}
              <Link href={`${base}/categories`} className="text-primary underline hover:opacity-80">
                {cat.allCategories}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
