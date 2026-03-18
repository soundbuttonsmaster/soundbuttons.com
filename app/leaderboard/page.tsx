import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import LeaderboardClient from "./LeaderboardClient"

const BASE = SITE.baseUrl
export const revalidate = 60

export default async function LeaderboardPage() {
  let initialData: Awaited<ReturnType<typeof apiClient.getLeaderboard>> = {
    daily: [],
    weekly: [],
    all_time: [],
  }
  try {
    initialData = await apiClient.getLeaderboard()
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "leaderboard", item: `${BASE}/leaderboard` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <LeaderboardClient initialData={initialData} />
    </>
  )
}
