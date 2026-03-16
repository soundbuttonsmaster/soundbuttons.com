"use client"

import { useState } from "react"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  username: string
  score: number
  rank: number
}

interface LeaderboardClientProps {
  initialData: {
    data: LeaderboardEntry[]
    meta: { current_page: number; last_page: number; total_items: number }
  }
}

export default function LeaderboardClient({ initialData }: LeaderboardClientProps) {
  const [data] = useState(initialData.data)
  const meta = initialData.meta

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
    return null
  }

  return (
    <div className="py-8 bg-background">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {data.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Leaderboard coming soon</h2>
              <p className="text-muted-foreground text-sm">
                Rankings will appear here as the community grows. Keep uploading and playing sounds!
              </p>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 bg-muted/50 border-b border-border grid grid-cols-12 gap-2 text-sm font-medium text-foreground">
                <span className="col-span-1">#</span>
                <span className="col-span-7">User</span>
                <span className="col-span-4 text-right">Score</span>
              </div>
              <ul className="divide-y divide-border">
                {data.map((entry, i) => (
                  <li
                    key={`${entry.username}-${entry.rank}-${i}`}
                    className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-muted/30 transition-colors"
                  >
                    <span className="col-span-1 flex items-center gap-1">
                      {getRankIcon(entry.rank)}
                      <span className="font-medium text-muted-foreground">{entry.rank}</span>
                    </span>
                    <span className="col-span-7 truncate font-medium text-foreground">{entry.username}</span>
                    <span className="col-span-4 text-right text-muted-foreground">{entry.score.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              {meta.last_page > 1 && (
                <p className="px-4 py-3 text-xs text-muted-foreground border-t border-border">
                  Page {meta.current_page} of {meta.last_page} • {meta.total_items} total
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
