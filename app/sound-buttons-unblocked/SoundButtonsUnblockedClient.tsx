"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 44

const faqData = [
  {
    question: "What are Sound Buttons Unblocked?",
    answer:
      "Sound Buttons Unblocked are entertaining, interactive sound effects that you can access and play freely, usually on websites that are designed to be accessible from school or workplace networks where other websites would be blocked.",
  },
  {
    question: "Are these sound buttons child friendly?",
    answer:
      "Of course! All the sounds available from SoundButtons.com, especially our \"Unblocked\" page, are carefully curated to ensure family-friendly sounds can be enjoyed by children.",
  },
  {
    question: "How can I play these sounds?",
    answer:
      "You can simply click or tap on any sound button and it will instantly play for you! You can download or share your favorite sounds too!",
  },
  {
    question: "Why are some sound button websites blocked?",
    answer:
      "Some networks, such as school or work networks, will block different websites to keep people focused or to maintain security. Unblocked sound button websites are aimed to provide fun content on those networks.",
  },
  {
    question: "Can I request an additional sound?",
    answer:
      "Of course! We love hearing from our users! Feel free to use our contact page to submit a request for a sound you'd like to see on SoundButtons.com.",
  },
]

interface SoundButtonsUnblockedClientProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function SoundButtonsUnblockedClient({
  initialSounds,
  initialMeta,
  isMobileDevice,
}: SoundButtonsUnblockedClientProps) {
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

  return (
    <>
      <PageHero
        title="Sound Buttons Unblocked - Play & Download Free Sounds"
        description="Play and download sound buttons unblocked on SoundButtons. Access unlimited free sound effects, create your own buttons, and enjoy fun audio anytime, anywhere. Family-friendly sounds for kids and everyone."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search sound buttons..." />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {sounds.length > 0 ? (
            <>
              <SoundList
                title="Sound Buttons Unblocked"
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
                    You&apos;ve reached the end of sound buttons!
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No sound buttons found at the moment. Check back later!
              </p>
            </div>
          )}

          <section className="mt-16 max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="max-w-3xl space-y-4">
              {faqData.map((faq, index) => (
                <details
                  key={index}
                  className="p-4 bg-muted/50 rounded-lg group"
                >
                  <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-muted-foreground">
              Explore more with our{" "}
              <Link href="/new" className="text-primary underline hover:opacity-80">
                new sounds
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
          </section>
        </div>
      </div>
    </>
  )
}
