import { apiClient } from "@/lib/api/client"
import NewPageClient from "./NewPageClient"

export const revalidate = 300

const PAGE_SIZE = 35

export default async function NewPage() {
  const initialCount = PAGE_SIZE
  let initialSounds: Awaited<ReturnType<typeof apiClient.getNewSounds>>["data"] = []
  let meta = { current_page: 1, last_page: 1, total_items: 0 }

  try {
    const result = await apiClient.getNewSounds(1, PAGE_SIZE)
    initialSounds = result.data
    meta = result.meta
  } catch {
    // ignore
  }

  return (
    <>
      <NewPageClient
        initialSounds={initialSounds}
        initialMeta={meta}
        isMobileDevice={false}
      />
    </>
  )
}
