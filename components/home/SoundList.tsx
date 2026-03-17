"use client"

import React, {
  useState,
  useEffect,
  Fragment,
  startTransition,
  useDeferredValue,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from "react"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import type { Sound } from "@/lib/types/sound"
import SoundButton from "@/components/sound/sound-button"
import { getSoundDetailPath } from "@/lib/utils/slug"
import { getStrings, getLocaleFromPathname } from "@/lib/i18n/strings"
import type { Locale } from "@/lib/i18n/strings"

interface SoundListProps<T extends { id: number } = Sound> {
  title: string
  sounds: T[]
  initialCount?: number
  loadMoreCount?: number
  viewAllLink?: string
  onLoadMore?: () => Promise<boolean>
  hasMoreSounds?: boolean
  maxLines?: number
  useCardView?: boolean
  useCompactView?: boolean
  showLoadMore?: boolean
  showRedirectButton?: boolean
  showLoadingIndicator?: boolean
  customCardComponent?: React.ComponentType<{
    sound: T
    isAboveTheFold?: boolean
    onRainEffect?: (imageUrl: string) => void
  }>
  onRainEffect?: (imageUrl: string) => void
  isMobileDevice?: boolean
  /** Cap desktop columns (e.g. 8 for "You Might Like" - my-instants) */
  maxCols?: number
  /** Custom detail path for each sound (e.g. /sound-effects/slug/id). Not used when customCardComponent is provided. */
  getDetailPath?: (sound: T) => string
  /** Locale for i18n; defaults to pathname-derived locale */
  locale?: Locale
}

export interface SoundListRef {
  handleAutoPlay: () => void
  handleRandomPlay: () => void
  playRandomSound: () => void
}

/** Generic call signature so <SoundList sounds={kidsSounds} customCardComponent={KidsCardSound} /> infers T = KidsSoundboard */
type SoundListComponent = <T extends { id: number } = Sound>(
  props: SoundListProps<T> & React.RefAttributes<SoundListRef>
) => React.ReactElement | null

const SoundListWithRef = forwardRef(function SoundListInner<T extends { id: number } = Sound>(
  {
    title,
    sounds,
    initialCount = 20,
    loadMoreCount = 10,
    viewAllLink,
    onLoadMore,
    hasMoreSounds = false,
    maxLines = 4,
    useCardView = false,
    useCompactView = false,
    showLoadMore = true,
    showRedirectButton = false,
    showLoadingIndicator = true,
    customCardComponent,
    onRainEffect,
    isMobileDevice: isMobileDeviceProp,
    maxCols,
    getDetailPath,
    locale: localeProp,
  }: SoundListProps<T>,
  ref: React.Ref<SoundListRef>
) {
    const pathname = usePathname()
    const locale = localeProp ?? getLocaleFromPathname(pathname ?? "")
    const { home, common } = useMemo(() => getStrings(locale), [locale])
    const effectiveGetDetailPath = useMemo((): ((s: T) => string) | undefined => {
      if (getDetailPath) return getDetailPath
      if (locale !== "en") {
        return (s: T) =>
          `/${locale}${getSoundDetailPath((s as unknown as Sound).name ?? "", (s as unknown as Sound).id)}`
      }
      return undefined
    }, [getDetailPath, locale])

    const [loading, setLoading] = useState(false)
    const [isMobileDevice, setIsMobileDevice] = useState(
      isMobileDeviceProp ?? false
    )
    const [displayedSounds, setDisplayedSounds] = useState<T[]>(sounds)
    const [isAutoPlaying, setIsAutoPlaying] = useState(false)
    const [isRandomPlaying, setIsRandomPlaying] = useState(false)
    const [currentAutoPlayIndex, setCurrentAutoPlayIndex] = useState(0)
    const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isAutoPlayingRef = useRef(false)
    const isRandomPlayingRef = useRef(false)
    const shuffledIndicesRef = useRef<number[]>([])
    const currentRandomIndexRef = useRef(0)
    const soundEndedHandlersRef = useRef<Map<number, (e: Event) => void>>(
      new Map()
    )
    const deferredSounds = useDeferredValue(displayedSounds)

    useEffect(() => {
      if (typeof window === "undefined") return
      const handleResize = () =>
        setIsMobileDevice(window.innerWidth <= 768)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
      startTransition(() => {
        setDisplayedSounds(sounds)
      })
    }, [sounds])

    const handleLoadMore = async () => {
      if (loading || !onLoadMore) return
      setLoading(true)
      try {
        await onLoadMore()
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    const soundsPerRow = useCompactView
      ? isMobileDevice
        ? 4
        : maxCols ?? 11
      : useCardView
        ? isMobileDevice
          ? 3
          : maxCols ?? 9
        : 3

    const maxSounds = maxLines * soundsPerRow
    const limitedSounds = deferredSounds.slice(0, maxSounds)

    const rows: T[][] = []
    for (let i = 0; i < limitedSounds.length; i += soundsPerRow) {
      rows.push(limitedSounds.slice(i, i + soundsPerRow))
    }

    const handleAutoPlay = () => {
      if (isRandomPlayingRef.current) {
        isRandomPlayingRef.current = false
        setIsRandomPlaying(false)
        shuffledIndicesRef.current = []
        currentRandomIndexRef.current = 0
      }

      if (isAutoPlayingRef.current) {
        isAutoPlayingRef.current = false
        setIsAutoPlaying(false)
        setCurrentAutoPlayIndex(0)
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

      if (limitedSounds.length === 0) return

      isAutoPlayingRef.current = true
      setIsAutoPlaying(true)
      setCurrentAutoPlayIndex(0)

      const playNextSound = (index: number) => {
        if (!isAutoPlayingRef.current && index > 0) return
        if (index >= limitedSounds.length) {
          isAutoPlayingRef.current = false
          setIsAutoPlaying(false)
          setCurrentAutoPlayIndex(0)
          return
        }

        const sound = limitedSounds[index]
        setCurrentAutoPlayIndex(index)
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
    }

    const handleRandomPlay = () => {
      if (isAutoPlayingRef.current) {
        isAutoPlayingRef.current = false
        setIsAutoPlaying(false)
        setCurrentAutoPlayIndex(0)
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

      if (limitedSounds.length === 0) return

      const indices = Array.from(
        { length: limitedSounds.length },
        (_, i) => i
      )
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

        if (
          currentRandomIndexRef.current >= shuffledIndicesRef.current.length
        ) {
          const indices = Array.from(
            { length: limitedSounds.length },
            (_, i) => i
          )
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[indices[i], indices[j]] = [indices[j], indices[i]]
          }
          shuffledIndicesRef.current = indices
          currentRandomIndexRef.current = 0
        }

        const randomIndex =
          shuffledIndicesRef.current[currentRandomIndexRef.current]
        const sound = limitedSounds[randomIndex]
        setCurrentAutoPlayIndex(randomIndex)

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
    }

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

    const canLoadMore =
      showLoadMore &&
      (hasMoreSounds || displayedSounds.length < sounds.length)

    return (
      <section className="w-full py-2 sound-section-container">
        <div className="flex flex-row items-center justify-between mb-2 gap-1 sm:gap-2 w-full overflow-hidden sound-section-header">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center flex-shrink-0 min-w-0">
            <span className="whitespace-nowrap truncate">{title}</span>
          </h2>
          {viewAllLink && (
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 ml-1 sm:ml-2 flex-nowrap flex-shrink-0">
              <button
                type="button"
                className={`btn-theme btn-auto-play hidden md:inline-flex flex-shrink-0 ${isAutoPlaying ? "btn-theme-active" : ""}`}
                onClick={handleAutoPlay}
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
                onClick={() => (window.location.href = viewAllLink)}
              >
                <span className="hidden sm:inline">{home.viewAll}</span>
                <span className="sm:hidden">{home.view}</span>
                <span className="btn-arrow-dot"><ChevronRight className="w-3 h-3" strokeWidth={3} /></span>
              </button>
            </div>
          )}
        </div>
        {displayedSounds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted rounded-xl">
            <p className="text-lg">{common.noSoundsFound}</p>
          </div>
        ) : (
          <>
            <div>
              {rows.map((row, rowIndex) => (
                <div
                  key={`row-${rowIndex}`}
                  className="w-full sound-row-container"
                >
                  <div
                    className={`sound-grid ${
                      useCompactView
                        ? maxCols === 8
                          ? "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-8 gap-0 sm:gap-2 lg:gap-3"
                          : "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 lg:gap-3"
                        : useCardView
                          ? maxCols === 8
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 gap-2 sm:gap-3"
                            : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-2 sm:gap-3"
                          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                    } sound-grid-container`}
                  >
                    {row.map((sound, colIndex) => {
                      const index = rowIndex * soundsPerRow + colIndex
                      return (
                        <Fragment key={`${sound.id}-${index}`}>
                          {                          useCompactView ? (
                            <SoundButton
                              sound={sound as unknown as Sound}
                              isAboveTheFold={
                                index < (isMobileDevice ? 12 : 44)
                              }
                              isMobileDevice={isMobileDevice}
                              detailPath={effectiveGetDetailPath?.(sound)}
                            />
                          ) : useCardView && customCardComponent ? (
                            React.createElement(customCardComponent, {
                              sound,
                              isAboveTheFold:
                                index < (isMobileDevice ? 12 : 18),
                              onRainEffect,
                            })
                          ) : (
                            <SoundButton
                              sound={sound as unknown as Sound}
                              isAboveTheFold={
                                useCardView
                                  ? index < (isMobileDevice ? 12 : 18)
                                  : index < 10
                              }
                              isMobileDevice={isMobileDevice}
                              detailPath={effectiveGetDetailPath?.(sound)}
                            />
                          )}
                        </Fragment>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            {canLoadMore && (
              <div className="mt-6 flex justify-center load-more-container">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-theme btn-theme-arrow px-4"
                >
                  {loading && showLoadingIndicator ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      <span>{common.loading}</span>
                    </div>
                  ) : (
                    <>
                      <span>{home.loadMoreSounds}</span>
                      <span className="btn-arrow-dot"><ChevronRight className="w-3 h-3" strokeWidth={3} /></span>
                    </>
                  )}
                </button>
              </div>
            )}
            {showRedirectButton && viewAllLink && (
              <div className="mt-6 flex justify-center load-more-container">
                <button
                  type="button"
                  onClick={() => (window.location.href = viewAllLink)}
                  className="btn-theme btn-theme-arrow px-4"
                >
                  <span>{home.viewAll} {title}</span>
                  <span className="btn-arrow-dot"><ChevronRight className="w-3 h-3" strokeWidth={3} /></span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    )
  }
)

SoundListWithRef.displayName = "SoundList"

const SoundList = SoundListWithRef as SoundListComponent
export default SoundList
