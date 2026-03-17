import { headers } from "next/headers"
import { getPublicDashboardsPaginated } from "@/lib/api/dashboards"
import { SITE } from "@/lib/constants/site"
import SoundboardClient from "./SoundboardClient"

export const revalidate = 300

const INITIAL_DASHBOARDS = 3
const BASE = SITE.baseUrl

export default async function SoundboardPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  let initialDashboards: Awaited<ReturnType<typeof getPublicDashboardsPaginated>>["data"] = []
  let initialTotal = 0
  let initialHasMore = false

  try {
    const result = await getPublicDashboardsPaginated(1, INITIAL_DASHBOARDS)
    initialDashboards = result.data
    initialTotal = result.total
    initialHasMore = result.hasMore
  } catch {
    // ignore
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "soundboard", item: `${BASE}/soundboard` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SoundboardClient
      initialDashboards={initialDashboards}
      initialTotal={initialTotal}
      initialHasMore={initialHasMore}
        isMobileDevice={isMobile}
    />
    </>
  )
}
