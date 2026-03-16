import type { Metadata } from "next"
import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import { SITE_NAV_LINKS } from "@/lib/constants/site-nav-links"
import PageHero from "@/components/layout/page-hero"
import LeaderboardClient from "./LeaderboardClient"

export const revalidate = 60
const BASE = SITE.baseUrl

export const metadata: Metadata = {
  title: { absolute: "Leaderboard - Top Sound Button Creators | SoundButtons.com" },
  description:
    "See the top creators and most popular sound buttons on SoundButtons.com. Leaderboard of trending sounds and community rankings.",
  keywords:
    "sound buttons leaderboard, top sound creators, soundboard rankings, popular sound effects, top meme sounds, sound button rankings",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/leaderboard` },
  openGraph: {
    type: "website",
    title: "Leaderboard - Top Sound Button Creators | SoundButtons.com",
    url: `${BASE}/leaderboard`,
    siteName: "Sound Buttons",
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Leaderboard - SoundButtons.com" }],
  },
  twitter: { card: "summary_large_image", title: "Leaderboard | SoundButtons.com" },
}

export default async function LeaderboardPage() {
  let initialData: Awaited<ReturnType<typeof apiClient.getLeaderboard>> = {
    data: [],
    meta: { current_page: 1, last_page: 1, total_items: 0 },
  }
  try {
    initialData = await apiClient.getLeaderboard(1, 100)
  } catch {
    // ignore
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Leaderboard - Top Sound Button Creators",
    description: "Leaderboard of top creators and popular sound buttons on SoundButtons.com.",
    url: `${BASE}/leaderboard`,
  }
  const navSchema = SITE_NAV_LINKS.map((link) => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: link.name,
    url: link.url,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {navSchema.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      <PageHero
        title="Leaderboard"
        description="Top creators and most popular sound buttons on SoundButtons.com."
      />
      <LeaderboardClient initialData={initialData} />
    </>
  )
}
