"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import SoundButton from "@/components/sound/sound-button"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"

interface AutoLoadingNewSoundsSectionProps {
  initialSounds: (Sound & { sound_file: string })[]
  isMobileDevice: boolean
  title?: string
}

export default function AutoLoadingNewSoundsSection({
  initialSounds,
  isMobileDevice,
  title = "New Sound Buttons",
}: AutoLoadingNewSoundsSectionProps) {
  const router = useRouter()
  const initialDisplayCount = isMobileDevice ? 8 : 22
  const [sounds, setSounds] = useState(
    initialSounds.slice(0, initialDisplayCount)
  )
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const loadingRef = useRef<HTMLDivElement>(null)

  const soundsPerRow = isMobileDevice ? 4 : 11
  const soundsPerTwoLines = soundsPerRow * 2
  const soundsPerFourLines = soundsPerRow * 4

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
      const { data: newSounds, meta } = await apiClient.getNewSounds(
        page + 1,
        pageSize
      )
      setSounds((prev) => [...prev, ...newSounds])
      setPage((p) => p + 1)
      setHasLoadedOnce(true)
      if (newSounds.length === 0 || newSounds.length < pageSize) {
        setHasMore(false)
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

  return (
    <section className="w-full pt-4 pb-0 sound-section-container">
      <div className="flex flex-row items-center justify-between mb-4 gap-1 sm:gap-2 w-full overflow-hidden sound-section-header">
        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center flex-shrink-0 min-w-0">
          <span className="whitespace-nowrap truncate">{title}</span>
        </h2>
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 ml-1 sm:ml-2 flex-nowrap flex-shrink-0">
          <Button
            className="px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition-all whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={() => router.push("/new")}
          >
            <span className="hidden sm:inline">View All →</span>
            <span className="sm:hidden">View →</span>
          </Button>
        </div>
      </div>

      {sounds.length > 0 ? (
        <>
          <div className="space-y-4">
            {Array.from(
              {
                length: Math.ceil(
                  (!hasLoadedOnce ? soundsPerTwoLines : sounds.length) /
                    soundsPerRow
                ),
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
                  <div key={lineIndex} className="sound-row-container">
                    <div className="sound-grid grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-11 gap-0 sm:gap-2 md:gap-2 lg:gap-3 sound-grid-container">
                      {lineSounds.map((sound, colIndex) => {
                        const index = lineIndex * soundsPerRow + colIndex
                        return (
                          <SoundButton
                            key={sound.id}
                            sound={sound}
                            isAboveTheFold={
                              index < (isMobileDevice ? 16 : 44)
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

          <div
            ref={loadingRef}
            className={`flex justify-center mt-4 pb-2 load-more-container ${hasMore ? "" : "hidden"}`}
          >
            {hasMore && (
              <>
                {!hasLoadedOnce ? (
                  <Button
                    onClick={loadMoreSounds}
                    disabled={loading}
                    className="text-white transition-all border-0 px-5 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Load More Sounds →"
                    )}
                  </Button>
                ) : (
                  <div className="flex justify-center py-4">
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
                You've reached the end of new sounds!
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
