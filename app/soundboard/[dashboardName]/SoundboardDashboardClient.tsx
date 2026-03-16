"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { apiClient } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import SoundList from "@/components/home/SoundList"
import SearchBar from "@/components/search-bar"

const PAGE_SIZE = 35

interface SoundboardDashboardClientProps {
  dashboardName: string
  initialSounds: Sound[]
  initialMeta: { current_page: number; last_page: number; total_items: number }
  isMobileDevice: boolean
}

export default function SoundboardDashboardClient({
  dashboardName,
  initialSounds,
  initialMeta,
  isMobileDevice,
}: SoundboardDashboardClientProps) {
  const [sounds, setSounds] = useState<Sound[]>(initialSounds)
  const [page, setPage] = useState(initialMeta.current_page)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialMeta.current_page < initialMeta.last_page || initialSounds.length >= PAGE_SIZE
  )
  const loadingRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async (): Promise<boolean> => {
    if (loading || !hasMore) return false
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await apiClient.getSoundsByCategory(dashboardName, nextPage, PAGE_SIZE)
      const newSounds = (result.data || []).map((p) => ({
        id: p.id,
        name: p.name,
        sound_file: p.sound_file,
        views: p.views,
        likes_count: p.likes_count,
        favorites_count: p.favorites_count,
        is_favorited: p.is_favorited,
        is_liked: p.is_liked,
        category_id: p.category_id,
        category_name: p.category_name,
      }))
      setSounds((prev) => [...prev, ...newSounds])
      setPage(nextPage)
      const meta = result.meta || {}
      setHasMore((meta.current_page ?? nextPage) < (meta.last_page ?? 1))
      return (meta.current_page ?? nextPage) < (meta.last_page ?? 1)
    } catch {
      setHasMore(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [dashboardName, page, loading, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) loadMore()
      },
      { rootMargin: "200px", threshold: 0.1 }
    )
    const el = loadingRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [loadMore, hasMore, loading])

  return (
    <div className="py-8 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            <SearchBar placeholder={`Search ${dashboardName} sounds...`} />
          </div>
        </div>
        {sounds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No sounds in this soundboard yet.</p>
          </div>
        ) : (
          <>
            <SoundList
              title=""
              sounds={sounds}
              initialCount={sounds.length}
              hasMoreSounds={hasMore}
              onLoadMore={loadMore}
              showLoadMore={hasMore}
              showLoadingIndicator={loading}
              useCardView
              isMobileDevice={isMobileDevice}
            />
            <div ref={loadingRef} className="h-4" />
          </>
        )}
      </div>
    </div>
  )
}
