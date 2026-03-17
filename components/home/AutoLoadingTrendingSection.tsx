"use client"

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import SoundButton from "@/components/sound/sound-button"
import { apiClient } from "@/lib/api/client"
import { getSoundDetailPath } from "@/lib/utils/slug"
import { getStrings } from "@/lib/i18n/strings"
import type { Sound } from "@/lib/types/sound"
import type { Locale } from "@/lib/i18n/strings"

interface AutoLoadingTrendingSectionProps {
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
  title?: string
  viewAllLink: string
  locale?: Locale
}

export interface AutoLoadingTrendingSectionRef {
  handleAutoPlay: () => void
  handleRandomPlay: () => void
  playRandomSound: () => void
}

const AutoLoadingTrendingSection = forwardRef<
  AutoLoadingTrendingSectionRef,
  AutoLoadingTrendingSectionProps
>(
  (
    {
      initialSounds,
      initialMeta,
      isMobileDevice,
      title,
      viewAllLink,
      locale = "en",
    },
    ref
  ) => {
    const router = useRouter()
    const home = getStrings(locale).home
    const sectionTitle = title ?? home.trendingTitle
    const viewAllLabel = home.viewAll
    const initialDisplayCount = isMobileDevice ? 16 : 44
    const [sounds, setSounds] = useState<Sound[]>(
      initialSounds.slice(0, initialDisplayCount)
    )
    const [page, setPage] = useState(initialMeta?.current_page ?? 1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(
      (initialMeta?.current_page ?? 1) < (initialMeta?.last_page ?? 1) ||
        initialSounds.length >= initialDisplayCount
    )
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [isAutoPlaying, setIsAutoPlaying] = useState(false)
    const [isRandomPlaying, setIsRandomPlaying] = useState(false)
    const loadingRef = useRef<HTMLDivElement>(null)
    const newContentRef = useRef<HTMLDivElement>(null)
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isAutoPlayingRef = useRef(false)
    const isRandomPlayingRef = useRef(false)
    const shuffledIndicesRef = useRef<number[]>([])
    const currentRandomIndexRef = useRef(0)
    const soundEndedHandlersRef = useRef<Map<number, (e: Event) => void>>(
      new Map()
    )

    const soundsPerRow = isMobileDevice ? 4 : 11

    const loadMoreSounds = useCallback(async () => {
      if (loading || !hasMore) return

      setLoading(true)
      try {
        const pageSize = !hasLoadedOnce
          ? isMobileDevice
            ? 8
            : 22
          : isMobileDevice
            ? 16
            : 44
        const { data: newSounds, meta } = await apiClient.getTrendingSounds(
          page + 1,
          pageSize
        )
        setSounds((prev) => [...prev, ...(newSounds ?? [])])
        setPage((p) => p + 1)
        setHasLoadedOnce(true)
        const lastPage = meta?.last_page ?? 1
        if ((newSounds?.length ?? 0) === 0 || (newSounds?.length ?? 0) < pageSize) {
          setHasMore(false)
        } else if (page + 1 >= lastPage) {
          setHasMore(false)
        }
        if (!hasLoadedOnce && newContentRef.current) {
          setTimeout(() => {
            if (newContentRef.current) {
              const offset = 100
              const elementPosition =
                newContentRef.current.getBoundingClientRect().top + window.scrollY
              window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
              })
            }
          }, 150)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }, [page, loading, hasMore, isMobileDevice, hasLoadedOnce])

    useEffect(() => {
      if (!hasLoadedOnce) return

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
    }, [loadMoreSounds, hasMore, loading, hasLoadedOnce])

    const handleAutoPlay = useCallback(() => {
      if (isRandomPlayingRef.current) {
        isRandomPlayingRef.current = false
        setIsRandomPlaying(false)
        shuffledIndicesRef.current = []
        currentRandomIndexRef.current = 0
      }

      if (isAutoPlayingRef.current) {
        isAutoPlayingRef.current = false
        setIsAutoPlaying(false)
        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current)
          autoPlayTimeoutRef.current = null
        }
        soundEndedHandlersRef.current.forEach((handler) => {
          window.removeEventListener("sound-ended", handler as EventListener)
        })
        soundEndedHandlersRef.current.clear()
        window.dispatchEvent(
          new CustomEvent("pause-all-sounds", { detail: { exceptId: null } })
        )
        return
      }

      if (sounds.length === 0) return

      isAutoPlayingRef.current = true
      setIsAutoPlaying(true)

      const playNextSound = (index: number) => {
        if (!isAutoPlayingRef.current && index > 0) return
        if (index >= sounds.length) {
          isAutoPlayingRef.current = false
          setIsAutoPlaying(false)
          return
        }

        const sound = sounds[index]
        window.dispatchEvent(
          new CustomEvent("play-sound-auto", { detail: { soundId: sound.id } })
        )

        const handleSoundEnded = (e: Event) => {
          const customEvent = e as CustomEvent<{ soundId: number }>
          if (customEvent.detail?.soundId === sound.id) {
            window.removeEventListener("sound-ended", handleSoundEnded as EventListener)
            soundEndedHandlersRef.current.delete(sound.id)
            if (autoPlayTimeoutRef.current) {
              clearTimeout(autoPlayTimeoutRef.current)
            }
            if (isAutoPlayingRef.current) {
              autoPlayTimeoutRef.current = setTimeout(() => {
                playNextSound(index + 1)
              }, 300)
            }
          }
        }

        soundEndedHandlersRef.current.set(sound.id, handleSoundEnded)
        window.addEventListener("sound-ended", handleSoundEnded as EventListener)

        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current)
        }
        autoPlayTimeoutRef.current = setTimeout(() => {
          window.removeEventListener("sound-ended", handleSoundEnded as EventListener)
          soundEndedHandlersRef.current.delete(sound.id)
          if (isAutoPlayingRef.current) {
            playNextSound(index + 1)
          }
        }, 5000)
      }

      playNextSound(0)
    }, [sounds])

    const handleRandomPlay = useCallback(() => {
      if (isAutoPlayingRef.current) {
        isAutoPlayingRef.current = false
        setIsAutoPlaying(false)
      }

      if (isRandomPlayingRef.current) {
        isRandomPlayingRef.current = false
        setIsRandomPlaying(false)
        shuffledIndicesRef.current = []
        currentRandomIndexRef.current = 0
        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current)
          autoPlayTimeoutRef.current = null
        }
        soundEndedHandlersRef.current.forEach((handler) => {
          window.removeEventListener("sound-ended", handler as EventListener)
        })
        soundEndedHandlersRef.current.clear()
        window.dispatchEvent(
          new CustomEvent("pause-all-sounds", { detail: { exceptId: null } })
        )
        return
      }

      if (sounds.length === 0) return

      const indices = Array.from({ length: sounds.length }, (_, i) => i)
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[indices[i], indices[j]] = [indices[j], indices[i]]
      }

      shuffledIndicesRef.current = indices
      currentRandomIndexRef.current = 0
      isRandomPlayingRef.current = true
      setIsRandomPlaying(true)

      const playNextRandomSound = () => {
        if (!isRandomPlayingRef.current) return

        if (currentRandomIndexRef.current >= shuffledIndicesRef.current.length) {
          const indices = Array.from({ length: sounds.length }, (_, i) => i)
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[indices[i], indices[j]] = [indices[j], indices[i]]
          }
          shuffledIndicesRef.current = indices
          currentRandomIndexRef.current = 0
        }

        const randomIndex =
          shuffledIndicesRef.current[currentRandomIndexRef.current]
        const sound = sounds[randomIndex]

        window.dispatchEvent(
          new CustomEvent("play-sound-auto", { detail: { soundId: sound.id } })
        )

        const handleSoundEnded = (e: Event) => {
          const customEvent = e as CustomEvent<{ soundId: number }>
          if (customEvent.detail?.soundId === sound.id) {
            window.removeEventListener("sound-ended", handleSoundEnded as EventListener)
            soundEndedHandlersRef.current.delete(sound.id)
            if (autoPlayTimeoutRef.current) {
              clearTimeout(autoPlayTimeoutRef.current)
            }
            if (isRandomPlayingRef.current) {
              currentRandomIndexRef.current++
              autoPlayTimeoutRef.current = setTimeout(() => {
                playNextRandomSound()
              }, 300)
            }
          }
        }

        soundEndedHandlersRef.current.set(sound.id, handleSoundEnded)
        window.addEventListener("sound-ended", handleSoundEnded as EventListener)

        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current)
        }
        autoPlayTimeoutRef.current = setTimeout(() => {
          window.removeEventListener("sound-ended", handleSoundEnded as EventListener)
          soundEndedHandlersRef.current.delete(sound.id)
          if (isRandomPlayingRef.current) {
            currentRandomIndexRef.current++
            playNextRandomSound()
          }
        }, 5000)
      }

      playNextRandomSound()
    }, [sounds])

    useEffect(() => {
      return () => {
        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current)
        }
        soundEndedHandlersRef.current.forEach((handler) => {
          window.removeEventListener("sound-ended", handler as EventListener)
        })
        soundEndedHandlersRef.current.clear()
        isAutoPlayingRef.current = false
        setIsAutoPlaying(false)
        isRandomPlayingRef.current = false
        setIsRandomPlaying(false)
        shuffledIndicesRef.current = []
        currentRandomIndexRef.current = 0
      }
    }, [])

    useImperativeHandle(ref, () => ({
      handleAutoPlay,
      handleRandomPlay,
      playRandomSound: handleRandomPlay,
    }))

    return (
      <section className="w-full pt-4 pb-0 sound-section-container">
        <div className="flex flex-row items-center justify-between mb-4 gap-1 sm:gap-2 w-full overflow-hidden sound-section-header">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center flex-shrink-0 min-w-0">
            <span className="text-lg sm:text-xl md:text-2xl mr-1 sm:mr-2"></span>
            <span className="whitespace-nowrap truncate">{sectionTitle}</span>
          </h2>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 ml-1 sm:ml-2 flex-nowrap flex-shrink-0">
            <button
              type="button"
              className={`btn-theme btn-auto-play hidden md:inline-flex flex-shrink-0 ${isAutoPlaying ? "btn-theme-active" : ""}`}
              onClick={handleAutoPlay}
              disabled={sounds.length === 0}
            >
              <span className="hidden sm:inline">
                {isAutoPlaying ? home.stopAuto : home.autoPlay}
              </span>
              <span className="sm:hidden">
                {isAutoPlaying ? home.stopShort : home.autoShort}
              </span>
            </button>
            <button
              type="button"
              className={`btn-theme btn-random-play hidden md:inline-flex flex-shrink-0 ${isRandomPlaying ? "btn-theme-active" : ""}`}
              onClick={handleRandomPlay}
              disabled={sounds.length === 0}
            >
              <span className="hidden sm:inline">
                {isRandomPlaying ? home.stopRandom : home.randomPlay}
              </span>
              <span className="sm:hidden">
                {isRandomPlaying ? home.stopShort : home.randomShort}
              </span>
            </button>
            <button
              type="button"
              className="btn-theme btn-theme-arrow flex-shrink-0"
              onClick={() => router.push(viewAllLink)}
            >
              <span className="hidden sm:inline">{viewAllLabel}</span>
              <span className="sm:hidden">{home.view}</span>
              <span className="btn-arrow-dot"><ChevronRight className="w-3 h-3" strokeWidth={3} /></span>
            </button>
          </div>
        </div>

        {sounds.length > 0 ? (
          <>
            <div className="space-y-4">
              {!hasLoadedOnce ? (
                <div>
                  <div>
                    {Array.from({ length: 4 }, (_, lineIndex) => {
                      const lineStartIndex = lineIndex * soundsPerRow
                      const lineEndIndex = Math.min(
                        lineStartIndex + soundsPerRow,
                        sounds.length
                      )
                      const lineSounds = sounds.slice(lineStartIndex, lineEndIndex)
                      if (lineSounds.length === 0) return null
                      return (
                        <div
                          key={lineIndex}
                          className="w-full sound-row-container"
                          style={{ borderBottom: "2px solid #9ca3af", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}
                        >
                          <div className="sound-grid grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 lg:gap-3 sound-grid-container">
                            {lineSounds.map((sound, colIndex) => {
                              const index = lineIndex * soundsPerRow + colIndex
                              return (
                                <SoundButton
                                  key={sound.id}
                                  sound={sound}
                                  isAboveTheFold={
                                    index < (isMobileDevice ? 16 : 44)
                                  }
                                  isMobileDevice={isMobileDevice}
                                  detailPath={
                                    locale === "en"
                                      ? undefined
                                      : `/${locale}${getSoundDetailPath(sound.name ?? "", sound.id)}`
                                  }
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {hasMore && <div ref={newContentRef} />}
                </div>
              ) : (
                <div>
                  {Array.from(
                    {
                      length: Math.ceil(sounds.length / soundsPerRow),
                    },
                    (_, lineIndex) => {
                      const lineStartIndex = lineIndex * soundsPerRow
                      const lineEndIndex = Math.min(
                        lineStartIndex + soundsPerRow,
                        sounds.length
                      )
                      const lineSounds = sounds.slice(lineStartIndex, lineEndIndex)
                      if (lineSounds.length === 0) return null
                      return (
                        <div
                          key={lineIndex}
                          className="w-full sound-row-container"
                          style={{ borderBottom: "2px solid #9ca3af", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}
                        >
                          <div className="sound-grid grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 lg:gap-3 sound-grid-container">
                            {lineSounds.map((sound, colIndex) => {
                              const index = lineIndex * soundsPerRow + colIndex
                              return (
                                <SoundButton
                                  key={sound.id}
                                  sound={sound}
                                  isAboveTheFold={
                                    index < (isMobileDevice ? 16 : 44)
                                  }
                                  isMobileDevice={isMobileDevice}
                                  detailPath={
                                    locale === "en"
                                      ? undefined
                                      : `/${locale}${getSoundDetailPath(sound.name ?? "", sound.id)}`
                                  }
                                />
                              )
                            })}
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              )}
            </div>

            <div
              className={`flex justify-center mt-4 pb-2 load-more-container ${hasMore ? "" : "hidden"}`}
            >
              {hasMore && (
                <>
                  {!hasLoadedOnce ? (
                    <button
                      type="button"
                      onClick={loadMoreSounds}
                      disabled={loading}
                      className="btn-theme btn-theme-arrow px-4"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <>
                          <span>{home.loadMoreSounds}</span>
                          <span className="btn-arrow-dot"><ChevronRight className="w-3 h-3" strokeWidth={3} /></span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div ref={loadingRef} className="flex justify-center py-4">
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                          <span className="text-lg text-gray-600 dark:text-gray-300">
                            Loading more sounds...
                          </span>
                        </div>
                      ) : (
                        <div className="text-lg text-gray-500 dark:text-gray-400">
                          Scroll down to load more sounds
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {!hasMore && sounds.length > 0 && (
              <div className="flex justify-center mt-8 py-4">
                <div className="text-lg text-gray-500 dark:text-gray-400">
                  You&apos;ve reached the end of trending sounds!
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No sounds found.
          </div>
        )}
      </section>
    )
  }
)

AutoLoadingTrendingSection.displayName = "AutoLoadingTrendingSection"

export default AutoLoadingTrendingSection
