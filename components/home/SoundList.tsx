"use client"

import React, {
  useState,
  useEffect,
  Fragment,
  useDeferredValue,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react"
import type { Sound } from "@/lib/types/sound"
import SoundButton from "@/components/sound/sound-button"
import { Button } from "@/components/ui/button"

interface SoundListProps {
  title: string
  sounds: (Sound & { sound_file: string })[]
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
  isMobileDevice?: boolean
}

export interface SoundListRef {
  handleAutoPlay: () => void
  handleRandomPlay: () => void
  playRandomSound: () => void
}

const SoundList = forwardRef<SoundListRef, SoundListProps>(
  (
    {
      title,
      sounds,
      initialCount = 20,
      loadMoreCount = 10,
      viewAllLink,
      onLoadMore,
      hasMoreSounds = false,
      maxLines = 4,
      useCompactView = false,
      showLoadMore = true,
      showRedirectButton = false,
      showLoadingIndicator = true,
      isMobileDevice: isMobileDeviceProp,
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false)
    const [isMobileDevice, setIsMobileDevice] = useState(isMobileDeviceProp ?? false)
    const [displayedSounds, setDisplayedSounds] = useState(sounds)
    const deferredSounds = useDeferredValue(displayedSounds)

    useEffect(() => {
      if (typeof window === "undefined") return
      const handleResize = () => setIsMobileDevice(window.innerWidth <= 768)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
      if (sounds.length > displayedSounds.length) {
        setDisplayedSounds(sounds)
      }
    }, [sounds, displayedSounds.length])

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
        : 11
      : 3

    const maxSounds = maxLines * soundsPerRow
    const limitedSounds = deferredSounds.slice(0, maxSounds)

    const rows: (Sound & { sound_file: string })[][] = []
    for (let i = 0; i < limitedSounds.length; i += soundsPerRow) {
      rows.push(limitedSounds.slice(i, i + soundsPerRow))
    }

    const canLoadMore =
      showLoadMore &&
      (hasMoreSounds || displayedSounds.length < sounds.length)

    useImperativeHandle(ref, () => ({
      handleAutoPlay: () => {},
      handleRandomPlay: () => {},
      playRandomSound: () => {},
    }))

    return (
      <section className="w-full py-2 sound-section-container">
        <div className="flex flex-row items-center justify-between mb-2 gap-1 sm:gap-2 w-full overflow-hidden sound-section-header">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center flex-shrink-0 min-w-0">
            <span className="whitespace-nowrap truncate">{title}</span>
          </h2>
          {viewAllLink && (
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 ml-1 sm:ml-2 flex-nowrap flex-shrink-0">
              <Button
                className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => (window.location.href = viewAllLink)}
              >
                <span className="hidden sm:inline">View All →</span>
                <span className="sm:hidden">View →</span>
              </Button>
            </div>
          )}
        </div>
        {displayedSounds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-lg">No sounds found</p>
          </div>
        ) : (
          <>
            <div>
              {rows.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="w-full sound-row-container">
                  <div
                    className={`sound-grid grid ${
                      useCompactView
                        ? "grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 md:gap-2 lg:gap-3"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                    } sound-grid-container`}
                  >
                    {row.map((sound, colIndex) => {
                      const index = rowIndex * soundsPerRow + colIndex
                      return (
                        <Fragment key={`${sound.id}-${index}`}>
                          <SoundButton
                            sound={sound}
                            isAboveTheFold={
                              index < (isMobileDevice ? 12 : 44)
                            }
                          />
                        </Fragment>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            {canLoadMore && (
              <div className="mt-6 flex justify-center load-more-container">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="text-white transition-all border-0 px-5 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading && showLoadingIndicator
                    ? "Loading..."
                    : `Load More ${title}`}
                </Button>
              </div>
            )}
            {showRedirectButton && viewAllLink && (
              <div className="mt-6 flex justify-center load-more-container">
                <Button
                  onClick={() => (window.location.href = viewAllLink)}
                  className="text-white transition-all border-0 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  View All {title} →
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    )
  }
)

SoundList.displayName = "SoundList"

export default SoundList
