"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundList from "@/components/home/SoundList"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

const PAGE_SIZE = 35

interface SoundButtonsForSchoolClientProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function SoundButtonsForSchoolClient({
  initialSounds,
  initialMeta,
  isMobileDevice,
}: SoundButtonsForSchoolClientProps) {
  const [sounds, setSounds] = useState(initialSounds)
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
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [loadMoreSounds, hasMore, loading])

  return (
    <>
      <PageHero
        title="Sound Buttons Unblocked for School"
        description="Welcome to our school-friendly collection of sound buttons! Perfect for classroom activities, educational games, and presentations. All sounds are appropriate for school environments and can be accessed even on networks with restrictions."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search sound buttons for school..." />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          <section className="mb-12 rounded-xl p-6 bg-muted/30">
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
              Teacher Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 rounded-lg bg-background border border-border">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Classroom Activities
                </h3>
                <p className="text-muted-foreground">
                  Use our sound buttons to signal transitions between activities, create audio cues for
                  games, or add fun elements to your lessons.
                </p>
              </div>
              <div className="p-5 rounded-lg bg-background border border-border">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Presentation Enhancement
                </h3>
                <p className="text-muted-foreground">
                  Add engaging sound effects to your presentations to keep students attentive and make
                  your content more memorable.
                </p>
              </div>
              <div className="p-5 rounded-lg bg-background border border-border">
                <h3 className="text-xl font-bold mb-3 text-primary">
                  Reward System
                </h3>
                <p className="text-muted-foreground">
                  Use fun sound effects as rewards for student participation, correct answers, or
                  completed assignments.
                </p>
              </div>
            </div>
          </section>

          {sounds.length > 0 ? (
            <>
              <SoundList
                title="Latest Sound Buttons for School"
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
                  <span className="text-muted-foreground">
                    You&apos;ve reached the end of school sound buttons!
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No sound buttons available at the moment. Please check back later!
              </p>
            </div>
          )}

          <section className="mt-16 max-w-none">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="max-w-3xl space-y-4">
              <details className="p-4 bg-muted/50 rounded-lg group">
                <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary">
                  What are Sound Buttons Unblocked for School?
                </summary>
                <p className="mt-2 text-muted-foreground">
                  Sound Buttons Unblocked for School is a collection of fun, educational, and
                  school-appropriate sound effects that are accessible from school networks that block
                  other entertainment websites. All sounds are family-friendly and curated for use in
                  educational environments.
                </p>
              </details>
              <details className="p-4 bg-muted/50 rounded-lg group">
                <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary">
                  Are these sound buttons appropriate for school environments?
                </summary>
                <p className="mt-2 text-muted-foreground">
                  Yes! All of the sounds on our &quot;Unblocked for School&quot; page are appropriate
                  for school environments. Our content is family-friendly and suitable for students
                  of all ages.
                </p>
              </details>
              <details className="p-4 bg-muted/50 rounded-lg group">
                <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary">
                  How can teachers use these sound buttons in their classrooms?
                </summary>
                <p className="mt-2 text-muted-foreground">
                  Teachers can use our sound buttons for transitions between activities, presentations,
                  audio cues for games, and as rewards for student participation.
                </p>
              </details>
              <details className="p-4 bg-muted/50 rounded-lg group">
                <summary className="font-semibold cursor-pointer text-foreground group-open:text-primary">
                  Why are some sound button websites blocked in schools?
                </summary>
                <p className="mt-2 text-muted-foreground">
                  Many schools block entertainment sites to keep students focused or for internet
                  safety. Our Sound Buttons Unblocked for School page offers appropriate content
                  suitable for school use.
                </p>
              </details>
            </div>
            <p className="mt-6 text-muted-foreground">
              Explore more{" "}
              <Link href="/new" className="text-primary underline hover:opacity-80">
                new sounds
              </Link>
              ,{" "}
              <Link href="/trends" className="text-primary underline hover:opacity-80">
                trending sounds
              </Link>
              , and{" "}
              <Link href="/sound-buttons-unblocked" className="text-primary underline hover:opacity-80">
                sound buttons unblocked
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
