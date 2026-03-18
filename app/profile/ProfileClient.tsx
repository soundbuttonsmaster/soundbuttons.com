"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  User,
  LogIn,
  Loader2,
  Upload,
  Music,
  Heart,
  LayoutGrid,
  Eye,
  Flame,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import SoundButton from "@/components/sound/sound-button"
import type { ProcessedSound } from "@/lib/api/client"

function ProfileKidsHero() {
  return (
    <section
      className="w-full py-8 sm:py-10 bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-100 dark:from-pink-950/50 dark:via-purple-950/40 dark:to-yellow-950/50"
      suppressHydrationWarning
    >
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Your sound world — manage your sounds and favorites.
        </p>
      </div>
    </section>
  )
}

const gradientBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"

const kidsCard =
  "rounded-3xl shadow-lg border border-pink-200/60 dark:border-pink-800/40 bg-gradient-to-br from-white/90 to-pink-50/80 dark:from-gray-900/90 dark:to-pink-950/30"

function getStreakOutlineClass(streak: number): string {
  if (streak >= 100) return "p-[3px] rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"
  if (streak >= 30) return "p-[3px] rounded-full bg-gradient-to-r from-orange-400 via-rose-500 to-orange-400"
  if (streak >= 7) return "p-[3px] rounded-full bg-gradient-to-r from-orange-300 to-rose-400"
  return ""
}

export default function ProfileClient() {
  const { user, token, isReady } = useAuth()
  const [userSounds, setUserSounds] = useState<ProcessedSound[]>([])
  const [soundsLoading, setSoundsLoading] = useState(false)
  const [profileStreak, setProfileStreak] = useState<number | null>(null)

  useEffect(() => {
    if (!isReady) return
    if (!token) return
    setSoundsLoading(true)
    apiClient
      .getMySounds(token)
      .then((res) => setUserSounds(res.data))
      .catch(() => setUserSounds([]))
      .finally(() => setSoundsLoading(false))
  }, [isReady, token])

  useEffect(() => {
    if (!isReady || !token) return
    apiClient.getMyStreak(token).then((d) => setProfileStreak(d.current_streak)).catch(() => setProfileStreak(null))
  }, [isReady, token])

  const pageWrap =
    "min-h-screen bg-gradient-to-br from-amber-50/80 via-pink-50/80 to-violet-50/80 dark:from-amber-950/30 dark:via-pink-950/30 dark:to-violet-950/30 py-8 sm:py-10"

  if (!isReady) {
    return (
      <div className={pageWrap}>
        <ProfileKidsHero />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div
            className={`${kidsCard} p-8 flex flex-col items-center justify-center gap-4`}
          >
            <Loader2 className="h-10 w-10 animate-spin text-pink-500 dark:text-pink-400" />
            <p className="text-sm text-muted-foreground">Loading your profile…</p>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className={pageWrap}>
        <ProfileKidsHero />
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 space-y-6 text-center`}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <User className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Sign in to see your profile
            </h2>
            <Link href="/login?redirect=/profile" className={`${gradientBtn} w-full`}>
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              <Link href="/register" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                Register
              </Link>{" "}
              if you don&apos;t have an account.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const totalViews = userSounds.reduce((sum, s) => sum + (s.views || 0), 0)

  return (
    <div className={pageWrap}>
      <ProfileKidsHero />
      <div className="w-full max-w-5xl mx-auto px-4 space-y-6">
        <div className={`${kidsCard} p-6 md:p-8`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
            <div className={profileStreak != null && profileStreak > 0 ? getStreakOutlineClass(profileStreak) : ""}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() ??
                    user?.email?.[0]?.toUpperCase() ??
                    "?"}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                Welcome, {user?.username ?? user?.email}!
                {profileStreak != null && profileStreak > 0 && (
                  <Link
                    href="/streak"
                    className="inline-flex items-center gap-1 text-orange-500 dark:text-orange-400 hover:underline"
                  >
                    <Flame className="h-5 w-5 shrink-0" />
                    <span className="tabular-nums font-semibold">{profileStreak}</span>
                    <span className="text-sm font-normal text-muted-foreground">streak</span>
                  </Link>
                )}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">ID: {user?.id}</p>
            </div>
            <Link href="/upload-sound" className={`${gradientBtn} shrink-0`}>
              <Upload className="h-4 w-4" />
              Upload Sound
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl p-4 bg-gradient-to-br from-pink-100/80 to-purple-100/80 dark:from-pink-900/30 dark:to-purple-900/30 border border-pink-200/50 dark:border-pink-700/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Music className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                <span className="text-sm font-medium">Your sounds</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {userSounds.length}
              </p>
            </div>
            <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/30">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium">Total plays</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {totalViews.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex flex-wrap gap-3">
            <Link
              href="/favorites"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/60 dark:bg-white/10 border border-pink-200/50 dark:border-pink-700/30 text-foreground font-medium hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
            >
              <Heart className="h-4 w-4 text-pink-500 dark:text-pink-400" />
              My Favorites
            </Link>
            <Link
              href="/my-soundboard"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/60 dark:bg-white/10 border border-pink-200/50 dark:border-pink-700/30 text-foreground font-medium hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
            >
              <LayoutGrid className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              My Soundboard
            </Link>
            <Link
              href="/upload-sound"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/60 dark:bg-white/10 border border-pink-200/50 dark:border-pink-700/30 text-foreground font-medium hover:bg-pink-100/50 dark:hover:bg-pink-900/30 transition-colors"
            >
              <Upload className="h-4 w-4 text-pink-500 dark:text-pink-400" />
              Upload Sound
            </Link>
          </div>
        </div>

        <div className={`${kidsCard} p-6 md:p-8`}>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Your sounds
          </h3>
          {soundsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-pink-500 dark:text-pink-400" />
              <p className="text-sm text-muted-foreground">
                Loading your sounds…
              </p>
            </div>
          ) : userSounds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800/50 dark:to-purple-800/50 flex items-center justify-center">
                <Music className="h-10 w-10 text-pink-600 dark:text-pink-400" />
              </div>
              <p className="text-foreground font-medium">No sounds yet</p>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Start by uploading your first sound!
              </p>
              <Link href="/upload-sound" className={gradientBtn}>
                <Upload className="h-4 w-4" />
                Upload your first sound
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {userSounds.map((sound, i) => (
                <SoundButton
                  key={sound.id}
                  sound={sound}
                  customSize={80}
                  hideActions
                  isAboveTheFold={i < 8}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
