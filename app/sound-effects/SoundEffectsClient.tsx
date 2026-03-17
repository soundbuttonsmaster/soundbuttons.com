"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundEffectCard from "@/components/sound-effects/SoundEffectCard"
import type { SoundEffect } from "@/lib/api/sound-effects"

interface SoundEffectsClientProps {
  initialEffects: SoundEffect[]
}

export default function SoundEffectsClient({ initialEffects }: SoundEffectsClientProps) {
  const [effects, setEffects] = useState(initialEffects)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialEffects.length === 0) {
      setLoading(true)
      import("@/lib/api/sound-effects")
        .then(({ soundEffectsApi }) => soundEffectsApi.getAll())
        .then((data) => {
          setEffects(data || [])
          setError(null)
        })
        .catch(() => setError("Failed to fetch sound effects"))
        .finally(() => setLoading(false))
    }
  }, [initialEffects.length])

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 opacity-40 blur-3xl dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:opacity-30" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-200 via-indigo-200 to-blue-200 opacity-30 blur-3xl dark:from-pink-900 dark:via-indigo-900 dark:to-blue-900 dark:opacity-20" />
      </div>

      <PageHero
        title="Sound Effects Library"
        description="Discover and download high-quality sound effects for your creative projects. Perfect for videos, games, podcasts, and multimedia content."
      >
        <div className="flex justify-center mt-2 px-2">
          <div className="flex justify-center max-w-3xl md:max-w-4xl lg:max-w-5xl w-full shadow-lg">
            <SearchBar
              searchBasePath="/sound-effects"
              placeholder="Search sound effects..."
            />
          </div>
        </div>
      </PageHero>

      <main className="flex-1 flex flex-col items-center relative z-10 w-full py-8 md:py-10">
        <div className="max-w-7xl w-full px-4">

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Loading sound effects...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Link
                href="/sound-effects"
                className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Try again
              </Link>
            </div>
          ) : effects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {effects.map((effect) => (
                <SoundEffectCard key={effect.id} effect={effect} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No sound effects found.</p>
              <Link
                href="/"
                className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
