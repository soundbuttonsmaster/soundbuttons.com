import { kidsSoundboardApi } from "@/lib/api/kids-soundboard"
import { SITE } from "@/lib/constants/site"
import KidsSoundboardClient from "./KidsSoundboardClient"

const BASE = SITE.baseUrl
const PAGE_SIZE = 36

export const revalidate = 300

export default async function KidsSoundboardPage() {
  let initialCategories: Awaited<ReturnType<typeof kidsSoundboardApi.getCategories>> = []
  let initialSounds: Awaited<ReturnType<typeof kidsSoundboardApi.getPaginated>>["data"] = []
  let hasNext = false
  let totalCount = 0

  try {
    const [catsRes, soundsRes] = await Promise.all([
      kidsSoundboardApi.getCategories(),
      kidsSoundboardApi.getPaginated(1, PAGE_SIZE),
    ])
    initialCategories = catsRes || []
    initialSounds = soundsRes?.data || []
    hasNext = !!soundsRes?.next
    totalCount = soundsRes?.count ?? initialSounds.length
  } catch {
    // fallback empty
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "kids-soundboard", item: `${BASE}/kids-soundboard` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <KidsSoundboardClient
        initialCategories={initialCategories}
        initialSounds={initialSounds}
        initialHasNext={hasNext}
        initialTotalCount={totalCount}
        isMobileDevice={false}
      />
    </>
  )
}
