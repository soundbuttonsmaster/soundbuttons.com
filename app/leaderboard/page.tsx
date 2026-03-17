import { apiClient } from "@/lib/api/client"
import PageHero from "@/components/layout/page-hero"
import LeaderboardClient from "./LeaderboardClient"

export const revalidate = 60

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "leaderboard",
        item: "https://soundbuttons.com/leaderboard",
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageHero
        title="Leaderboard"
        description="Top creators and most popular sound buttons on SoundButtons.com."
      />
      <LeaderboardClient initialData={initialData} />
    </>
  )
}
