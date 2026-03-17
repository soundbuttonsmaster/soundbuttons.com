"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogIn, Loader2, Upload, Music } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { apiClient } from "@/lib/api/client"
import PageHero from "@/components/layout/page-hero"
import SoundButton from "@/components/sound/sound-button"
import type { ProcessedSound } from "@/lib/api/client"

export default function ProfileClient() {
  const router = useRouter()
  const { user, token, isReady } = useAuth()
  const [userSounds, setUserSounds] = useState<ProcessedSound[]>([])
  const [soundsLoading, setSoundsLoading] = useState(false)

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

  if (!isReady) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!token) {
    return (
      <>
        <PageHero title="My Profile" description="Sign in to manage your account." />
        <div className="py-12 bg-background">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sign in to view your profile</h2>
              <Link
                href="/login?redirect=/profile"
                className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
              <p className="text-sm text-muted-foreground">
                <Link href="/register" className="text-primary hover:underline">Register</Link> if you don&apos;t have an account.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const totalViews = userSounds.reduce((sum, s) => sum + (s.views || 0), 0)

  return (
    <>
      <PageHero title="My Profile" description="Manage your account and view your sounds." />
      <div className="py-8 bg-background">
        <div className="w-full max-w-5xl mx-auto px-4 space-y-6">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {user?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Welcome, {user?.username ?? user?.email}!
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {user?.id}</p>
              </div>
              <Link
                href="/upload-sound"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shrink-0"
              >
                <Upload className="h-4 w-4" />
                Upload Sound
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl p-4 bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Music className="h-5 w-5" />
                  <span className="text-sm font-medium">Sounds Uploaded</span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{userSounds.length}</p>
              </div>
              <div className="rounded-xl p-4 bg-muted/50 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm font-medium">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-foreground mt-1">{totalViews.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <Link href="/favorites" className="block text-sm text-primary hover:underline">
                My Favorites
              </Link>
              <Link href="/my-soundboard" className="block text-sm text-primary hover:underline">
                My Soundboard
              </Link>
              <Link href="/upload-sound" className="block text-sm text-primary hover:underline">
                Upload Sound
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Sound Uploads</h3>
            {soundsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading your sounds…</p>
              </div>
            ) : userSounds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Music className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">No sounds yet</p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Start by uploading your first sound!
                </p>
                <Link
                  href="/upload-sound"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                  Upload Your First Sound
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
    </>
  )
}
