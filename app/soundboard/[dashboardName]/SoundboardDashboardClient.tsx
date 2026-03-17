"use client"

import Link from "next/link"
import type { Sound } from "@/lib/types/sound"
import SoundList from "@/components/home/SoundList"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import type { PublicDashboard } from "@/lib/api/dashboards"

interface SoundboardDashboardClientProps {
  dashboard: PublicDashboard & { sounds: { id: number; name: string }[] }
  initialSounds: Sound[]
  isMobileDevice?: boolean
}

export default function SoundboardDashboardClient({
  dashboard,
  initialSounds,
  isMobileDevice,
}: SoundboardDashboardClientProps) {
  return (
    <div className="py-8 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-2xl">
            <SearchBar placeholder={`Search ${dashboard.name} sounds...`} />
          </div>
        </div>

        {initialSounds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No sounds in this soundboard yet.</p>
            <Link href="/soundboard" className="mt-4 inline-block">
              <Button variant="outline" size="lg" className="mt-4">
                Back to All Soundboards
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <SoundList
              title=""
              sounds={initialSounds}
              initialCount={initialSounds.length}
              hasMoreSounds={false}
              useCardView
              isMobileDevice={isMobileDevice}
            />

            <section className="mt-12 py-8 md:py-10">
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  About {dashboard.name}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    This <strong>{dashboard.name}</strong> features{" "}
                    {initialSounds.length} high-quality sound effects from the{" "}
                    {dashboard.category?.categoryName ?? "Soundboard"} category.
                    All sounds are free to play, download, and share!
                  </p>
                  <p>
                    Click any sound button to instantly play the audio. You can
                    also download individual sounds or share them with friends on
                    social media.
                  </p>
                  <div className="mt-6">
                    <Link href="/soundboard">
                      <Button variant="default" size="lg">
                        Back to All Soundboards
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
