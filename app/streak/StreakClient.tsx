"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Flame, Trophy, LogIn, Loader2, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"

export type StreakLeaderboardEntry = {
  rank: number
  user_id: number
  username: string
  current_streak: number
}

interface StreakClientProps {
  initialLeaderboard: {
    results: StreakLeaderboardEntry[]
    total: number
  }
}

const pageWrap =
  "min-h-screen bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-rose-50/80 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 py-8 sm:py-10"

const card =
  "rounded-3xl shadow-lg border border-orange-200/60 dark:border-orange-800/40 bg-gradient-to-br from-white/90 to-orange-50/80 dark:from-gray-900/90 dark:to-orange-950/30"

const MAX_LEADERBOARD_ITEMS = 100
const PAGE_SIZE = 20

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-6 w-6 text-amber-500" aria-hidden />
  if (rank === 2) return <Trophy className="h-6 w-6 text-slate-400" aria-hidden />
  if (rank === 3) return <Trophy className="h-6 w-6 text-amber-700" aria-hidden />
  return null
}

export default function StreakClient({ initialLeaderboard }: StreakClientProps) {
  const { token, isReady } = useAuth()
  const [streak, setStreak] = useState<{
    current_streak: number
    longest_streak: number
    plays_today: number
    goal_today: number
    logged_in_today: boolean
  } | null>(null)
  const [streakLoading, setStreakLoading] = useState(false)
  const [entries, setEntries] = useState<StreakLeaderboardEntry[]>(initialLeaderboard.results)
  const [total, setTotal] = useState(initialLeaderboard.total)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)

  useEffect(() => {
    if (!isReady || !token) return
    setStreakLoading(true)
    apiClient
      .getMyStreak(token)
      .then((data) =>
        setStreak({
          current_streak: data.current_streak,
          longest_streak: data.longest_streak,
          plays_today: data.plays_today,
          goal_today: data.goal_today,
          logged_in_today: data.logged_in_today,
        })
      )
      .catch(() => setStreak(null))
      .finally(() => setStreakLoading(false))
  }, [isReady, token])

  const loadMore = () => {
    if (entries.length >= MAX_LEADERBOARD_ITEMS || entries.length >= total) return
    setLoadMoreLoading(true)
    apiClient
      .getStreakLeaderboard(entries.length, PAGE_SIZE)
      .then(({ results, total: t }) => {
        setEntries((prev) => [...prev, ...results])
        setTotal(t)
      })
      .finally(() => setLoadMoreLoading(false))
  }

  const canLoadMore = entries.length < total && entries.length < MAX_LEADERBOARD_ITEMS

  return (
    <div className={pageWrap}>
      <section
        className="w-full py-8 sm:py-10 bg-gradient-to-br from-orange-100 via-amber-50 to-rose-100 dark:from-orange-950/50 dark:via-amber-950/40 dark:to-rose-950/50"
        suppressHydrationWarning
      >
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-8 h-8 text-orange-500 dark:text-orange-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Streak
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Log in daily and play at least 5 sounds to build your streak. Compete on the leaderboard and earn rewards.
          </p>
        </div>
      </section>

      <div className="w-full max-w-3xl mx-auto px-4 space-y-6 mt-6">
        {!isReady && (
          <div className={`${card} p-8 flex justify-center`}>
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        )}

        {isReady && !token && (
          <div className={`${card} p-8 text-center space-y-4`}>
            <h2 className="text-xl font-semibold text-foreground">
              Sign in to see your streak and the leaderboard
            </h2>
            <Link
              href="/login?redirect=/streak"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 transition-all shadow-md"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              You can still scroll down to see the global streak leaderboard.
            </p>
          </div>
        )}

        {isReady && token && (
          <>
            <div className={`${card} overflow-hidden p-6`}>
              <h2 className="text-lg font-semibold text-foreground mb-4">Your streak</h2>
              {streakLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                </div>
              ) : streak ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{streak.current_streak}</p>
                      <p className="text-xs text-muted-foreground">Current streak (days)</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground">{streak.longest_streak}</p>
                    <p className="text-xs text-muted-foreground">Longest streak</p>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                    <p className="text-sm font-medium text-foreground">
                      Today: {streak.plays_today}/{streak.goal_today} plays
                      {streak.logged_in_today ? " · You logged in today" : " · Log in to count today"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Play at least 5 different sounds and log in each day to add a day to your streak.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Could not load streak.</p>
              )}
            </div>

            <div className={`${card} overflow-hidden p-6`}>
              <h2 className="text-lg font-semibold text-foreground mb-3">Benefits</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">·</span>
                  <strong className="text-foreground">Colorful profile outline</strong> — Your profile gets a gradient border based on your streak.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">·</span>
                  <strong className="text-foreground">Badge in header</strong> — Your streak appears next to your name with a fire icon.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">·</span>
                  <strong className="text-foreground">Streak in discussions</strong> — When you comment, others see your streak beside your username.
                </li>
              </ul>
            </div>

            <div className={`${card} overflow-hidden p-6`}>
              <h2 className="text-lg font-semibold text-foreground mb-3">FAQ</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-foreground">How do I get a streak?</dt>
                  <dd className="text-muted-foreground mt-1">
                    Log in and play at least 5 different sounds in a day. Do that every day to build consecutive days.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">What if I miss a day?</dt>
                  <dd className="text-muted-foreground mt-1">
                    Your streak resets. Streaks cannot be restored at this time.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">What are the rewards?</dt>
                  <dd className="text-muted-foreground mt-1">
                    A colorful profile outline, a streak badge in the header, and your streak number (with fire icon) next to your name in discussions.
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}

        <div className={`${card} overflow-hidden`}>
          <div className="p-4 border-b border-orange-200/60 dark:border-orange-800/40">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Global streak leaderboard
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Top users by current streak. Show 20, load more up to 100.
            </p>
          </div>
          <div className="px-4 py-3 border-b border-orange-200/50 dark:border-orange-800/50 grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            <span className="col-span-2">Rank</span>
            <span className="col-span-6 sm:col-span-7">User</span>
            <span className="col-span-4 sm:col-span-3 text-right">Streak</span>
          </div>
          {entries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Flame className="mx-auto h-12 w-12 opacity-50 mb-3" />
              <p className="text-sm font-medium">No streak rankings yet</p>
              <p className="text-xs mt-1">Start playing daily to appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-orange-200/50 dark:divide-orange-800/50">
              {entries.map((entry) => (
                <li
                  key={`${entry.user_id}-${entry.rank}`}
                  className="px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-12 gap-2 sm:gap-4 items-center hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors rounded-lg"
                >
                  <span className="col-span-2 flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    <span className="font-bold text-foreground tabular-nums">{entry.rank}</span>
                  </span>
                  <span className="col-span-6 sm:col-span-7 truncate font-medium text-foreground">
                    {entry.username}
                  </span>
                  <span className="col-span-4 sm:col-span-3 text-right flex items-center justify-end gap-1 font-medium text-orange-600 dark:text-orange-400 tabular-nums">
                    <Flame className="h-4 w-4 shrink-0" />
                    {entry.current_streak}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {canLoadMore && (
            <div className="p-4 border-t border-orange-200/50 dark:border-orange-800/50">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadMoreLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors disabled:opacity-50"
              >
                {loadMoreLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ChevronDown className="h-5 w-5" />
                    Load more
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
