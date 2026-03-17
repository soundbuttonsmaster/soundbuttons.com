"use client"

import { useState } from "react"
import { Trophy, Medal, Award, Flame, Calendar, Infinity } from "lucide-react"

export type LeaderboardEntry = {
  id: number
  name: string
  total_views: number
}

export type LeaderboardData = {
  daily: LeaderboardEntry[]
  weekly: LeaderboardEntry[]
  all_time: LeaderboardEntry[]
}

interface LeaderboardClientProps {
  initialData: LeaderboardData
}

const pageWrap =
  "min-h-screen bg-gradient-to-br from-amber-50/80 via-pink-50/80 to-violet-50/80 dark:from-amber-950/30 dark:via-pink-950/30 dark:to-violet-950/30 py-8 sm:py-10"

const kidsCard =
  "rounded-3xl shadow-lg border border-pink-200/60 dark:border-pink-800/40 bg-gradient-to-br from-white/90 to-pink-50/80 dark:from-gray-900/90 dark:to-pink-950/30"

type TabId = "daily" | "weekly" | "all_time"

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "daily", label: "Today", icon: <Flame className="h-4 w-4" /> },
  { id: "weekly", label: "This week", icon: <Calendar className="h-4 w-4" /> },
  { id: "all_time", label: "All time", icon: <Infinity className="h-4 w-4" /> },
]

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-6 w-6 text-amber-500" aria-hidden />
  if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" aria-hidden />
  if (rank === 3) return <Award className="h-6 w-6 text-amber-700" aria-hidden />
  return null
}

function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Trophy className="mx-auto h-12 w-12 opacity-50 mb-3" />
        <p className="text-sm font-medium">No rankings yet</p>
        <p className="text-xs mt-1">Plays will show here as the community grows.</p>
      </div>
    )
  }
  return (
    <ul className="divide-y divide-pink-200/50 dark:divide-pink-800/50">
      {entries.map((entry, index) => {
        const rank = index + 1
        return (
          <li
            key={`${entry.id}-${entry.name}-${rank}`}
            className="px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-12 gap-2 sm:gap-4 items-center hover:bg-pink-50/50 dark:hover:bg-pink-950/20 transition-colors rounded-lg"
          >
            <span className="col-span-2 flex items-center gap-2">
              {getRankIcon(rank)}
              <span className="font-bold text-foreground tabular-nums">{rank}</span>
            </span>
            <span className="col-span-6 sm:col-span-7 truncate font-medium text-foreground">
              {entry.name}
            </span>
            <span className="col-span-4 sm:col-span-3 text-right text-muted-foreground font-medium tabular-nums">
              {entry.total_views.toLocaleString()} plays
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default function LeaderboardClient({ initialData }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all_time")

  const entries = initialData[activeTab]
  const hasAnyData =
    initialData.daily.length > 0 ||
    initialData.weekly.length > 0 ||
    initialData.all_time.length > 0

  return (
    <div className={pageWrap}>
      <section
        className="w-full py-8 sm:py-10 bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 dark:from-pink-950/50 dark:via-purple-950/40 dark:to-yellow-950/50"
        suppressHydrationWarning
      >
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Top creators by sound plays — daily, weekly, and all time.
          </p>
        </div>
      </section>

      <div className="w-full max-w-2xl mx-auto px-4 mt-6 sm:mt-8">
        <div className={`${kidsCard} overflow-hidden`}>
          <div className="flex border-b border-pink-200/60 dark:border-pink-800/40 bg-white/50 dark:bg-gray-900/30">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-pink-600 dark:text-pink-400 bg-pink-50/80 dark:bg-pink-950/30 border-b-2 border-pink-500 dark:border-pink-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-pink-50/40 dark:hover:bg-pink-950/20"
                }`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                role="tab"
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="min-h-[240px]"
          >
            <div className="px-4 py-3 sm:px-6 border-b border-pink-200/50 dark:border-pink-800/50 grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              <span className="col-span-2">Rank</span>
              <span className="col-span-6 sm:col-span-7">Creator</span>
              <span className="col-span-4 sm:col-span-3 text-right">Plays</span>
            </div>
            <LeaderboardTable entries={entries} />
          </div>
        </div>

        {hasAnyData && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Rankings are based on total plays of each creator&apos;s sounds.
          </p>
        )}
      </div>
    </div>
  )
}
