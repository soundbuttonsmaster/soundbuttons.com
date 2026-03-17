"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Heart, LogIn, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import type { ProcessedSound } from "@/lib/api/client"
import type { Sound } from "@/lib/types/sound"
import SoundList from "@/components/home/SoundList"

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

function FavoritesKidsHero({ title, description }: { title: string; description: string }) {
  return (
    <section
      className="w-full py-8 sm:py-10 bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 dark:from-pink-950/50 dark:via-purple-950/40 dark:to-yellow-950/50"
      suppressHydrationWarning
    >
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}

const gradientBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"

const kidsCard =
  "rounded-3xl shadow-lg border border-pink-200/60 dark:border-pink-800/40 bg-gradient-to-br from-white/90 to-pink-50/80 dark:from-gray-900/90 dark:to-pink-950/30"

const pageWrap =
  "min-h-screen bg-gradient-to-br from-amber-50/80 via-pink-50/80 to-violet-50/80 dark:from-amber-950/30 dark:via-pink-950/30 dark:to-violet-950/30 py-8 sm:py-10"

export default function FavoritesClient() {
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
      <div className={pageWrap}>
        <FavoritesKidsHero title="My Favorites" description="Your saved sound buttons." />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 flex flex-col items-center justify-center gap-4`}>
            <Loader2 className="h-10 w-10 animate-spin text-pink-500 dark:text-pink-400" />
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className={pageWrap}>
        <FavoritesKidsHero
          title="My Favorites"
          description="Sign in to save and view your favorite sound buttons."
        />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 space-y-6 text-center`}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sign in to see your favorites</h2>
            <p className="text-muted-foreground text-sm">
              Create an account or sign in to save sound buttons and access them here.
            </p>
            <Link href="/login?redirect=/favorites" className={`${gradientBtn} w-full`}>
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={pageWrap}>
      <FavoritesKidsHero
        title="My Favorites"
        description="Your saved sound buttons. Play, share, or remove from favorites."
      />
      <div className="w-full max-w-7xl mx-auto px-4 mt-6">
        {loading ? (
          <div className={`${kidsCard} p-12 flex flex-col items-center justify-center gap-4`}>
            <Loader2 className="h-10 w-10 animate-spin text-pink-500 dark:text-pink-400" />
            <p className="text-muted-foreground">Loading your favorites…</p>
          </div>
        ) : sounds.length === 0 ? (
          <div className={`${kidsCard} p-12 text-center max-w-lg mx-auto`}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800/50 dark:to-purple-800/50 flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-pink-600 dark:text-pink-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Add sounds from the home page or search — they&apos;ll show up here.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/" className={gradientBtn}>
                Explore sounds
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium border-2 border-pink-300 dark:border-pink-600 text-foreground hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
              >
                My profile
              </Link>
            </div>
          </div>
        ) : (
          <div className={kidsCard}>
            <div className="p-4 md:p-6">
              <SoundList
                title="Your favorites"
                sounds={sounds}
                initialCount={sounds.length}
                hasMoreSounds={hasMore}
                onLoadMore={handleLoadMore}
                showLoadMore={hasMore}
                showLoadingIndicator={loadMoreLoading}
                useCardView
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
