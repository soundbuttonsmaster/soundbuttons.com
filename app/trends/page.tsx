import { apiClient } from "@/lib/api/client"
import TrendsPageClient from "./TrendsPageClient"

export const revalidate = 300

const PAGE_SIZE = 44

function slugify(str: string): string {
  if (!str) return ""
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "sound"
}

export default async function TrendsPage() {
  let initialSounds: Awaited<ReturnType<typeof apiClient.getTrendingSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getTrendingSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  return (
    <>
      <TrendsPageClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={false}
      />
    </>
  )
}
