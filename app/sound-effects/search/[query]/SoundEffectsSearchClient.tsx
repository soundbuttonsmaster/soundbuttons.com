"use client"

import Link from "next/link"
import PageHero from "@/components/layout/page-hero"
import SearchBar from "@/components/search-bar"
import SoundEffectCard from "@/components/sound-effects/SoundEffectCard"
import type { SoundEffect } from "@/lib/api/sound-effects"

interface SoundEffectsSearchClientProps {
  query: string
  tagDisplayName: string
  initialEffects: SoundEffect[]
}

export default function SoundEffectsSearchClient({
  tagDisplayName,
  initialEffects,
}: SoundEffectsSearchClientProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200 opacity-40 blur-3xl dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 dark:opacity-30" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-pink-200 via-indigo-200 to-blue-200 opacity-30 blur-3xl dark:from-pink-900 dark:via-indigo-900 dark:to-blue-900 dark:opacity-20" />
      </div>

      <PageHero
        title={`Sound Effects: ${tagDisplayName}`}
        description={`Discover and download ${tagDisplayName} sound effects for your creative projects.`}
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

      <main className="flex-1 flex flex-col items-center relative z-10 w-full py-8">
        <div className="max-w-7xl w-full px-4">
          <div className="mb-6">
            <Link
              href="/sound-effects"
              className="text-primary hover:underline font-medium"
            >
              Back to Sound Effects
            </Link>
          </div>

          {initialEffects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialEffects.map((effect) => (
                <SoundEffectCard key={effect.id} effect={effect} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No sound effects found for &quot;{tagDisplayName}&quot;.
              </p>
              <Link
                href="/sound-effects"
                className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground"
              >
                Browse All Sound Effects
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
