"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import type { ProcessedSound } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import PageHero from "@/components/layout/page-hero"
import SoundList from "@/components/home/SoundList"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 50

function toSound(p: ProcessedSound): Sound {
  return {
    id: p.id,
    name: p.name,
    sound_file: p.sound_file,
    views: p.views,
    likes_count: p.likes_count,
    favorites_count: p.favorites_count,
    is_favorited: true,
    is_liked: p.is_liked,
    category_id: p.category_id,
    category_name: p.category_name,
  }
}

export default function FavoritesClient() {
  const router = useRouter()
  const { token, isReady } = useAuth()
  const [sounds, setSounds] = useState<Sound[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)

  const loadFavorites = useCallback(
    async (pageNum = 1, append = false) => {
      if (!token) return
      const result = await apiClient.getFavorites(token, pageNum, PAGE_SIZE)
      const list = (result.data || []).map(toSound)
      if (append) setSounds((prev) => [...prev, ...list])
      else setSounds(list)
      const meta = result.meta || {}
      setHasMore((meta.current_page ?? pageNum) < (meta.last_page ?? 1))
    },
    [token]
  )

  useEffect(() => {
    if (!isReady) return
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    loadFavorites(1, false).finally(() => setLoading(false))
  }, [isReady, token, loadFavorites])

  const handleLoadMore = async (): Promise<boolean> => {
    if (!token || loadMoreLoading || !hasMore) return false
    setLoadMoreLoading(true)
    const nextPage = page + 1
    try {
      await loadFavorites(nextPage, true)
      setPage(nextPage)
      return hasMore
    } finally {
      setLoadMoreLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!token) {
    return (
      <>
        <PageHero
          title="My Favorites"
          description="Sign in to save and view your favorite sound buttons."
        />
        <div className="py-12 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to see your favorites</h2>
              <p className="text-muted-foreground text-sm">
                Create an account or sign in to save sound buttons and access them here.
              </p>
              <Button asChild className="w-full h-11">
                <Link href="/login?redirect=/favorites">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHero
        title="My Favorites"
        description="Your saved sound buttons. Play, share, or remove from favorites."
      />
      <div className="py-8 bg-background">
        <div className="w-full max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
              Loading favorites...
            </div>
          ) : sounds.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Start adding sounds from the home page or search to see them here.
              </p>
              <Button asChild variant="outline">
                <Link href="/">Explore sounds</Link>
              </Button>
            </div>
          ) : (
            <SoundList
              title=""
              sounds={sounds}
              initialCount={sounds.length}
              hasMoreSounds={hasMore}
              onLoadMore={handleLoadMore}
              showLoadMore={hasMore}
              showLoadingIndicator={loadMoreLoading}
              useCardView
            />
          )}
        </div>
      </div>
    </>
  )
}
