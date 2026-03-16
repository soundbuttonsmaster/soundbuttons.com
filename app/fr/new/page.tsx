import { headers } from "next/headers"
import { apiClient } from "@/lib/api/client"
import { buildLocaleMetadata, getLocaleBase } from "@/lib/i18n/metadata"
import { getBreadcrumbLabels } from "@/lib/i18n/strings"
import NewPageClient from "@/app/new/NewPageClient"

export const revalidate = 300
const PAGE_SIZE = 35

export const metadata = buildLocaleMetadata("fr", "new")

export default async function FrNewPage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") ?? ""
  const mobileHint = headersList.get("sec-ch-ua-mobile")
  const isMobile = mobileHint === "?1" || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)

  const initialCount = isMobile ? 20 : 35
  let initialSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getNewSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  const BASE = getLocaleBase("fr")
  const labels = getBreadcrumbLabels("fr")
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: labels.home, item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: labels.new, item: `${BASE}/new` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <NewPageClient initialSounds={initialSounds} initialMeta={meta} isMobileDevice={isMobile} />
    </>
  )
}
