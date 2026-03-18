import { apiClient } from "@/lib/api/client"
import { SITE } from "@/lib/constants/site"
import StreakClient from "./StreakClient"

const BASE = SITE.baseUrl
export const revalidate = 60

export default async function StreakPage() {
  let initialLeaderboard = { results: [] as { rank: number; user_id: number; username: string; current_streak: number }[], total: 0 }
  try {
    initialLeaderboard = await apiClient.getStreakLeaderboard(0, 20)
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "Streak", item: `${BASE}/streak` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <StreakClient initialLeaderboard={initialLeaderboard} />
    </>
  )
}
