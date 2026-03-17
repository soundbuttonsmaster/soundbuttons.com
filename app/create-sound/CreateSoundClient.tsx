"use client"

import { useState } from "react"
import Link from "next/link"
import { Scissors, LogIn, Loader2, Upload, Type } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"

function CreateSoundKidsHero({ title, description }: { title: string; description: string }) {
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

export default function CreateSoundClient() {
  const { token, isReady } = useAuth()

  if (!isReady) {
    return (
      <div className={pageWrap}>
        <CreateSoundKidsHero title="Create Sound" description="Make your own sound buttons." />
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
        <CreateSoundKidsHero
          title="Create Sound"
          description="Sign in to create custom sound buttons — record, combine, or trim sounds."
        />
        <div className="max-w-lg mx-auto px-4 mt-6">
          <div className={`${kidsCard} p-8 space-y-6 text-center`}>
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <Scissors className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Sign in to create</h2>
            <p className="text-muted-foreground text-sm">
              Create custom sounds by combining, trimming, or recording. Share your creations with the community.
            </p>
            <Link href="/login?redirect=/create-sound" className={`${gradientBtn} w-full`}>
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
                Register
              </Link>
            </p>
            <p className="text-xs text-muted-foreground pt-4 border-t border-border">
              Try{" "}
              <Link href="/text-to-sound" className="text-pink-600 dark:text-pink-400 hover:underline">
                Text to Sound
              </Link>{" "}
              or{" "}
              <Link href="/trends" className="text-pink-600 dark:text-pink-400 hover:underline">
                trending sounds
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={pageWrap}>
      <CreateSoundKidsHero
        title="Create Sound"
        description="Record, combine, or create sounds from text. Share your creations with the community."
      />
      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        <div className={`${kidsCard} p-8 space-y-6`}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">How do you want to create?</h2>
            <p className="text-sm text-muted-foreground">
              Upload an audio file, use text to sound, or explore other options.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/upload-sound"
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-pink-200/60 dark:border-pink-800/40 bg-white/50 dark:bg-white/5 hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shrink-0 shadow group-hover:shadow-md transition-shadow">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div className="text-left min-w-0">
                <span className="font-semibold text-foreground block">Upload sound</span>
                <span className="text-xs text-muted-foreground">Add an audio file from your device</span>
              </div>
            </Link>
            <Link
              href="/text-to-sound"
              className="flex items-center gap-4 p-4 rounded-2xl border-2 border-pink-200/60 dark:border-pink-800/40 bg-white/50 dark:bg-white/5 hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shrink-0 shadow group-hover:shadow-md transition-shadow">
                <Type className="h-6 w-6 text-white" />
              </div>
              <div className="text-left min-w-0">
                <span className="font-semibold text-foreground block">Text to Sound</span>
                <span className="text-xs text-muted-foreground">Create sounds from text with AI</span>
              </div>
            </Link>
          </div>

          <div className="pt-4 border-t border-border flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <Link href="/profile" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              My profile
            </Link>
            <span aria-hidden>·</span>
            <Link href="/my-soundboard" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              My soundboard
            </Link>
            <span aria-hidden>·</span>
            <Link href="/trends" className="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Trending sounds
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
