"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundButton from "@/components/sound/sound-button"
import SkeletonSoundButton from "@/components/SkeletonSoundButton"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import {
  getPublicDashboardsPaginated,
  getDashboardSounds,
  slugifyDashboardName,
  type PublicDashboard,
} from "@/lib/api/dashboards"
import type { ProcessedSound } from "@/lib/api/client"

const INITIAL_SOUNDS_COUNT = 4
const LOAD_MORE_SOUNDS_COUNT = 4
const DASHBOARDS_PER_PAGE = 3

interface SoundboardClientProps {
  initialDashboards: PublicDashboard[]
  initialTotal: number
  initialHasMore: boolean
  isMobileDevice: boolean
}

export default function SoundboardClient({
  initialDashboards,
  initialTotal,
  initialHasMore,
}: SoundboardClientProps) {
  const router = useRouter()
  const [loadedDashboards, setLoadedDashboards] = useState<PublicDashboard[]>(
    initialDashboards.map((d) => ({ ...d, sounds: [] }))
  )
  const [visibleDashboardsCount, setVisibleDashboardsCount] = useState(
    Math.min(DASHBOARDS_PER_PAGE, initialDashboards.length)
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreDashboards, setHasMoreDashboards] = useState(initialHasMore)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDashboards, setTotalDashboards] = useState(initialTotal)
  const [dashboardCache, setDashboardCache] = useState<Record<number, PublicDashboard[]>>({
    1: initialDashboards,
  })
  const [visibleSoundsCount, setVisibleSoundsCount] = useState<Record<number, number>>({})
  const [soundCache, setSoundCache] = useState<Record<number, ProcessedSound[]>>({})
  const [loadingSounds, setLoadingSounds] = useState<Record<number, boolean>>({})

  const loadDashboardSounds = useCallback(async (dashboard: PublicDashboard) => {
    if (
      !dashboard.sound_ids?.length ||
      dashboard.sounds?.length ||
      soundCache[dashboard.id]
    ) {
      if (soundCache[dashboard.id]) {
        setLoadedDashboards((prev) =>
          prev.map((d) =>
            d.id === dashboard.id
              ? { ...d, sounds: soundCache[dashboard.id] || [] }
              : d
          )
        )
      }
      return
    }
    if (loadingSounds[dashboard.id]) return

    setLoadingSounds((prev) => ({ ...prev, [dashboard.id]: true }))
    try {
      const ids = dashboard.sound_ids.slice(0, INITIAL_SOUNDS_COUNT)
      const sounds = await getDashboardSounds(dashboard.id, ids)
      setSoundCache((prev) => ({ ...prev, [dashboard.id]: sounds }))
      setLoadedDashboards((prev) =>
        prev.map((d) => (d.id === dashboard.id ? { ...d, sounds } : d))
      )
    } catch {
      // ignore
    } finally {
      setLoadingSounds((prev) => ({ ...prev, [dashboard.id]: false }))
    }
  }, [soundCache, loadingSounds])

  const loadMoreDashboardSounds = useCallback(
    async (dashboard: PublicDashboard) => {
      if (!dashboard.sound_ids?.length || loadingSounds[dashboard.id]) return

      const current = loadedDashboards.find((d) => d.id === dashboard.id) || dashboard
      setLoadingSounds((prev) => ({ ...prev, [dashboard.id]: true }))

      try {
        if (current.sounds?.length === 0) {
          const ids = current.sound_ids!.slice(0, LOAD_MORE_SOUNDS_COUNT)
          const sounds = await getDashboardSounds(current.id, ids)
          setLoadedDashboards((prev) =>
            prev.map((d) => (d.id === current.id ? { ...d, sounds } : d))
          )
          setSoundCache((prev) => ({ ...prev, [current.id]: sounds }))
          setVisibleSoundsCount((prev) => ({
            ...prev,
            [current.id]: sounds.length,
          }))
        } else {
          const currentCount = current.sounds?.length ?? 0
          const nextIds = current.sound_ids!.slice(
            currentCount,
            currentCount + LOAD_MORE_SOUNDS_COUNT
          )
          if (nextIds.length === 0) {
            const curVisible = visibleSoundsCount[current.id] ?? INITIAL_SOUNDS_COUNT
            const totalLoaded = current.sounds?.length ?? 0
            if (curVisible < totalLoaded) {
              setVisibleSoundsCount((prev) => ({
                ...prev,
                [current.id]: Math.min(
                  curVisible + LOAD_MORE_SOUNDS_COUNT,
                  totalLoaded
                ),
              }))
            }
            return
          }
          const newSounds = await getDashboardSounds(current.id, nextIds)
          setLoadedDashboards((prev) =>
            prev.map((d) =>
              d.id === current.id
                ? { ...d, sounds: [...(d.sounds || []), ...newSounds] }
                : d
            )
          )
          setSoundCache((prev) => ({
            ...prev,
            [current.id]: [...(prev[current.id] || []), ...newSounds],
          }))
        }
      } catch {
        // ignore
      } finally {
        setLoadingSounds((prev) => ({ ...prev, [dashboard.id]: false }))
      }
    },
    [loadedDashboards, loadingSounds, visibleSoundsCount]
  )

  const handleLoadMoreSounds = useCallback((dashboardId: number, totalSounds: number) => {
    setVisibleSoundsCount((prev) => ({
      ...prev,
      [dashboardId]: Math.min(
        (prev[dashboardId] ?? INITIAL_SOUNDS_COUNT) + LOAD_MORE_SOUNDS_COUNT,
        totalSounds
      ),
    }))
  }, [])

  const handleLoadMoreDashboards = useCallback(async () => {
    if (isLoadingMore || !hasMoreDashboards) return
    setIsLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      if (dashboardCache[nextPage]) {
        const cached = dashboardCache[nextPage]
        setLoadedDashboards((prev) => [...prev, ...cached])
        setVisibleDashboardsCount((prev) => prev + DASHBOARDS_PER_PAGE)
        setCurrentPage(nextPage)
        if (
          loadedDashboards.length + cached.length >= totalDashboards
        ) {
          setHasMoreDashboards(false)
        }
      } else {
        const result = await getPublicDashboardsPaginated(nextPage, DASHBOARDS_PER_PAGE)
        if (result.data.length > 0) {
          const light = result.data.map((d) => ({ ...d, sounds: [] as ProcessedSound[] }))
          setDashboardCache((prev) => ({ ...prev, [nextPage]: light }))
          setLoadedDashboards((prev) => [...prev, ...light])
          setVisibleDashboardsCount((prev) => prev + DASHBOARDS_PER_PAGE)
          setCurrentPage(nextPage)
          setTotalDashboards(result.total)
          setHasMoreDashboards(result.hasMore)
        } else {
          setHasMoreDashboards(false)
        }
      }
    } catch {
      setHasMoreDashboards(false)
    } finally {
      setIsLoadingMore(false)
    }
  }, [
    isLoadingMore,
    hasMoreDashboards,
    currentPage,
    dashboardCache,
    loadedDashboards.length,
    totalDashboards,
  ])

  useEffect(() => {
    const visible = loadedDashboards.slice(0, visibleDashboardsCount)
    setVisibleSoundsCount((prev) => {
      let changed = false
      const next = { ...prev }
      visible.forEach((d) => {
        if (next[d.id] === undefined) {
          next[d.id] = Math.min(
            INITIAL_SOUNDS_COUNT,
            d.sound_ids?.length ?? INITIAL_SOUNDS_COUNT
          )
          changed = true
        }
      })
      return changed ? next : prev
    })
    visible.forEach((d) => {
      if (!d.sounds?.length && d.sound_ids?.length) {
        loadDashboardSounds(d)
      }
    })
  }, [visibleDashboardsCount, loadedDashboards, loadDashboardSounds])

  return (
    <>
      <PageHero
        title="Soundboard: Instant Play Sound Buttons & Meme Soundboard"
        description="Launch the ultimate meme soundboard experience featuring 100,000+ free sound buttons. Play viral audio instantly, download in seconds, and keep the meme magic unblocked on every device."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar placeholder="Search soundboard..." />
          </div>
        </div>
      </PageHero>

      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {loadedDashboards.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {loadedDashboards.slice(0, visibleDashboardsCount).map((dashboard) => {
                const visibleCount =
                  visibleSoundsCount[dashboard.id] ?? INITIAL_SOUNDS_COUNT
                const sounds = dashboard.sounds ?? []
                const visibleSounds = sounds.slice(0, visibleCount)
                const hasMoreSounds =
                  sounds.length > visibleCount ||
                  (dashboard.sound_ids?.length ?? 0) > visibleCount

                return (
                  <div
                    key={dashboard.id}
                    className="p-4 md:p-6 group transition-all duration-300 rounded-xl border border-border bg-card"
                  >
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          const slug = slugifyDashboardName(dashboard.name)
                          router.push(`/soundboard/${slug}`)
                        }}
                        className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors duration-200 cursor-pointer hover:underline text-left w-full"
                      >
                        {dashboard.name}
                      </button>
                      <p className="text-sm text-muted-foreground mb-2">
                        {dashboard.category?.categoryName ?? "Uncategorized"} •{" "}
                        {dashboard.sound_ids?.length ?? 0} sounds
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Click title to view all sounds →
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3 md:gap-4">
                      {loadingSounds[dashboard.id] ? (
                        Array.from({ length: INITIAL_SOUNDS_COUNT }).map(
                          (_, i) => (
                            <SkeletonSoundButton
                              key={`skeleton-${dashboard.id}-${i}`}
                            />
                          )
                        )
                      ) : (
                        visibleSounds.map((sound, index) => (
                          <SoundButton
                            key={sound.id}
                            sound={sound}
                            customSize={80}
                            hideActions
                            isAboveTheFold={index < 4}
                          />
                        ))
                      )}
                    </div>
                    {hasMoreSounds && (
                      <div className="mt-4 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loadingSounds[dashboard.id]}
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (sounds.length > visibleCount) {
                              handleLoadMoreSounds(
                                dashboard.id,
                                sounds.length
                              )
                            } else {
                              await loadMoreDashboardSounds(dashboard)
                            }
                          }}
                        >
                          {loadingSounds[dashboard.id] ? (
                            <>
                              <span className="animate-spin mr-2">⟳</span>
                              Loading...
                            </>
                          ) : sounds.length > visibleCount ? (
                            `Load More (${sounds.length - visibleCount} remaining)`
                          ) : (
                            `Load More (${(dashboard.sound_ids?.length ?? 0) - visibleCount} remaining)`
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {hasMoreDashboards && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMoreDashboards}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? "Loading..." : "Load 3 More Soundboards"}
              </Button>
            </div>
          )}

          {loadedDashboards.length > 0 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing {visibleDashboardsCount} of {totalDashboards} soundboards
            </div>
          )}
        </div>
      </div>

      <div className="py-8 md:py-10 bg-background">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What is a Soundboard?
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                A <strong>soundboard</strong> is an engaging and interactive
                digital interface that fires off sound buttons the instant you
                click or tap. Our collection covers viral meme soundboard
                effects, gaming sounds, blockbuster movie quotes, and trending
                audio lifted from TikTok, Discord, and YouTube.
              </p>
              <p>
                Whether you create content, livestream, game with friends, or
                simply love internet culture, the SoundButtons.com soundboard
                puts instant entertainment at your fingertips. Enjoy seamless
                playback, mobile-friendly browsing, and downloads that work
                anywhere—no software required.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Reasons to Use Our Soundboard
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ul>
                <li>
                  <strong>Instant playback & downloads:</strong> Click any button
                  for instant audio, then grab the MP3 for Discord drops, OBS
                  alerts, streaming overlays, or video edits.
                </li>
                <li>
                  <strong>Soundboard unblocked:</strong> Enjoy browser-based fun
                  in schools, offices, and restricted networks—no installs, no
                  plugins, no headaches.
                </li>
                <li>
                  <strong>Huge library of sounds:</strong> Browse categories like
                  meme soundboard, gaming soundboard, movie lines, Discord
                  classics, and goofy comedy gold—with new buttons added daily.
                </li>
                <li>
                  <strong>Works on mobile:</strong> Responsive design keeps every
                  tap feeling native across iPhone, Android, tablets, and
                  desktop.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              How to Use a Soundboard
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ul>
                <li>Click or tap any soundboard button and hear the sound instantly.</li>
                <li>Download your favorite effects for offline reactions and projects.</li>
                <li>
                  Share buttons with friends or drop them directly into Discord
                  and social feeds.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Constructing Your Own Soundboard
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ol>
                <li>
                  <strong>Register for free:</strong> Sign up on{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    SoundButtons.com
                  </Link>{" "}
                  in seconds.
                </li>
                <li>
                  <strong>Choose a name:</strong> Give your soundboard a standout title.
                </li>
                <li>
                  <strong>Select a category:</strong> Pick the perfect fit from our
                  organized dropdown list.
                </li>
                <li>
                  <strong>Add sounds:</strong> Mix and match your favorite buttons to
                  craft the ultimate collection.
                </li>
                <li>
                  <strong>Create soundboard:</strong> Tap Create Soundboard and share
                  it with the community.
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Unblocked Soundboard for Everyone
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Use our soundboard for free on any network with our unblocked
                experience. Whether you are at school, work, or connected to
                public Wi-Fi, the browser-based player stays accessible where
                traditional software installers are blocked.
              </p>
              <p>
                Students love using our unblocked soundboard for class projects,
                presentations, and well-earned break-time laughs. Teachers tap
                into meme-ready audio to keep lessons energetic and memorable.
                Everyone deserves quick access to fun, creative audio content.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Advantages of Soundboard Unblocked
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <ul>
                <li>No software to install or manage.</li>
                <li>Runs smoothly through standard web browsers.</li>
                <li>School- and work-friendly access without admin approvals.</li>
                <li>Mobile-ready so you can take the soundboard anywhere.</li>
                <li>Free, secure, and free from malware.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Common Collections of Soundboards
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Meme Soundboard
                </h3>
                <p>
                  Dive into the internet&apos;s most viral sounds—from TikTok
                  chart-toppers to Vine-era classics and Discord staples. Queue
                  up iconic reactions like Bruh and Emotional Damage whenever
                  inspiration strikes.
                </p>
                <ul>
                  <li>Vine Soundboard — 6-second comedy classics.</li>
                  <li>TikTok Soundboard — the latest trending audio.</li>
                  <li>Bruh Soundboard — every flavor of bruh.</li>
                  <li>Goofy Soundboard — cartoon chaos and comedy gold.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Gaming Soundboard
                </h3>
                <p>
                  Level up with soundboard effects pulled from legendary games,
                  character quotes, lobby memes, and win screens—perfect for
                  streaming, Discord voice chats, or celebrating big plays.
                </p>
                <ul>
                  <li>Minecraft Soundboard</li>
                  <li>Fortnite Soundboard</li>
                  <li>Among Us Soundboard</li>
                  <li>Roblox Soundboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Movies & TV Soundboard
                </h3>
                <p>
                  Channel the most quotable moments from cinema and television
                  with soundboards spanning timeless classics to modern blockbusters.
                </p>
                <ul>
                  <li>Star Wars Soundboard</li>
                  <li>Harry Potter Soundboard</li>
                  <li>Marvel Soundboard</li>
                  <li>The Office Soundboard</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  Soundboard for Discord & Streaming
                </h3>
                <p>
                  Boost your presence with an expansive Discord-ready catalog that
                  slots seamlessly into Discord Soundboard, OBS, Streamlabs, and
                  every major streaming platform.
                </p>
              </div>
              <p>
                Join millions of users who trust SoundButtons.com as their go-to
                soundboard brand. Browse curated categories, tap into trending
                sounds, or jump straight to the{" "}
                <Link href="/play-random" className="text-primary hover:underline">
                  random sound player
                </Link>{" "}
                for surprise hits. Because the soundboard is unblocked and
                mobile-optimized, the fun never has to pause.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center">
              <span className="text-3xl mr-2">?</span> Soundboard FAQ
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">
                  What is a soundboard?
                </AccordionTrigger>
                <AccordionContent>
                  A soundboard is a digital collection of sound buttons that play
                  specific audio clips when clicked or tapped. Soundboards are
                  popular for memes, gaming, streaming, and entertainment, letting
                  you instantly play funny, viral, or iconic sounds with a single
                  tap.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">
                  How do I use a soundboard?
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Click or tap any soundboard button to instantly play the sound.</li>
                    <li>Download your favorite soundboard effects for offline use.</li>
                    <li>Share soundboard buttons with friends or on social media.</li>
                    <li>
                      Create your own soundboard by uploading custom sounds and
                      images.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Whether you&apos;re streaming, gaming, making memes, or just
                    having fun, our soundboard is the perfect tool to add audio
                    excitement to any moment!
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">
                  How do I create my own soundboard?
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Register for a free account on SoundButtons.com</li>
                    <li>Go to Create Sound and upload your audio file and image</li>
                    <li>Add details like name, description, and tags</li>
                    <li>
                      Submit for review—your soundboard button will be published
                      for everyone to enjoy!
                    </li>
                  </ol>
                  <p className="mt-2">
                    <strong>Tips:</strong> Keep your audio clear and short, use a
                    relevant image, and add accurate tags for discoverability.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold">
                  What are popular categories of soundboards?
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Meme Soundboards:</strong> Viral internet sounds and
                      trends
                    </li>
                    <li>
                      <strong>Movie Soundboards:</strong> Iconic quotes and effects
                      from films
                    </li>
                    <li>
                      <strong>TV Show Soundboards:</strong> Memorable lines and
                      sounds from TV
                    </li>
                    <li>
                      <strong>Gaming Soundboards:</strong> Game sound effects and
                      character quotes
                    </li>
                    <li>
                      <strong>Music Soundboards:</strong> Song snippets and musical
                      moments
                    </li>
                    <li>
                      <strong>Celebrity Soundboards:</strong> Famous quotes and
                      moments
                    </li>
                  </ul>
                  <p className="mt-2">
                    Explore these and more on our <strong>soundboard</strong>—new
                    categories and sounds are added daily!
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/categories/memes"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Memes Soundboard
            </Link>
            <Link
              href="/categories/games"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              Games Soundboard
            </Link>
            <Link
              href="/play-random"
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent font-medium"
            >
              Play Random
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
